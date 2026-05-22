(function () {
  const CONFIG = window.RSALUD_CONFIG || {};

  function nowISO() {
    return new Date().toISOString();
  }

  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(CONFIG.localSessionKey) || 'null');
    } catch (error) {
      return null;
    }
  }

  function sessionMeta() {
    const session = getSession() || {};
    return {
      usuario: session.usuario || '',
      nombre: session.nombre || '',
      rol: session.rol || '',
      session_id: session.sessionId || '',
      origen_url: location.href,
      user_agent: navigator.userAgent,
      app_version: CONFIG.appVersion
    };
  }

  function encodePayload(payload) {
    const text = JSON.stringify(payload || {});
    return btoa(unescape(encodeURIComponent(text)));
  }

  function decodePayload(encoded) {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))));
  }

  function backendReady() {
    return Boolean(CONFIG.appsScriptUrl && CONFIG.appsScriptUrl.includes('/exec'));
  }

  function jsonp(action, params = {}) {
    if (!backendReady()) {
      return Promise.reject(new Error('Backend Apps Script no configurado'));
    }

    return new Promise((resolve, reject) => {
      const callback = `rSaludCb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const url = new URL(CONFIG.appsScriptUrl);
      url.searchParams.set('action', action);
      url.searchParams.set('callback', callback);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) url.searchParams.set(key, value);
      });

      const script = document.createElement('script');
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('Tiempo de espera agotado al contactar Apps Script'));
      }, 18000);

      function cleanup() {
        clearTimeout(timer);
        delete window[callback];
        script.remove();
      }

      window[callback] = data => {
        cleanup();
        resolve(data);
      };

      script.onerror = () => {
        cleanup();
        reject(new Error('No se pudo contactar Apps Script'));
      };

      script.src = url.toString();
      document.head.appendChild(script);
    });
  }

  async function post(payload) {
    if (!backendReady()) {
      throw new Error('Backend Apps Script no configurado');
    }

    const response = await fetch(CONFIG.appsScriptUrl, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      if (text.trim().startsWith('<')) {
        throw new Error('Apps Script devolvió HTML. Revisar permisos o deployment.');
      }
      throw new Error('Apps Script no devolvió JSON válido.');
    }
  }

  function queueItem(payload, reason) {
    const queue = getQueue();
    queue.push({
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      payload,
      createdAt: nowISO(),
      attempts: 0,
      lastError: reason || ''
    });
    localStorage.setItem(CONFIG.localQueueKey, JSON.stringify(queue.slice(-250)));
    window.dispatchEvent(new CustomEvent('rSaludQueueChanged'));
  }

  function getQueue() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.localQueueKey) || '[]');
    } catch (error) {
      return [];
    }
  }

  async function write(kind, data = {}, options = {}) {
    const payload = {
      kind,
      timestamp: nowISO(),
      ...sessionMeta(),
      ...data
    };

    try {
      if (options.large) {
        const result = await post(payload);
        if (result.status && result.status !== 'ok') throw new Error(result.message || 'Error de backend');
        return result;
      }
      const result = await jsonp('write', { payload: encodePayload(payload) });
      if (result.status && result.status !== 'ok') throw new Error(result.message || 'Error de backend');
      return result;
    } catch (error) {
      queueItem(payload, error.message);
      return { status: 'queued', message: error.message };
    }
  }

  async function syncQueue() {
    const queue = getQueue();
    if (!queue.length) return { status: 'ok', sent: 0, remaining: 0 };
    const remaining = [];
    let sent = 0;

    for (const item of queue) {
      try {
        const result = item.payload && item.payload.data_base64
          ? await post(item.payload)
          : await jsonp('write', { payload: encodePayload(item.payload) });
        if (result.status && result.status !== 'ok') throw new Error(result.message || 'Error de backend');
        sent += 1;
      } catch (error) {
        remaining.push({
          ...item,
          attempts: Number(item.attempts || 0) + 1,
          lastError: error.message,
          lastAttemptAt: nowISO()
        });
      }
    }

    localStorage.setItem(CONFIG.localQueueKey, JSON.stringify(remaining));
    window.dispatchEvent(new CustomEvent('rSaludQueueChanged'));
    return { status: remaining.length ? 'partial' : 'ok', sent, remaining: remaining.length };
  }

  async function sha256Hex(text) {
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async function loadLocalUsers() {
    const response = await fetch('data/usuarios.json', { cache: 'no-store' });
    return response.json();
  }

  async function login(usuario, password) {
    const passwordHash = await sha256Hex(password);
    if (backendReady()) {
      try {
        const result = await jsonp('auth', { usuario, password_hash: passwordHash, password });
        if (result.status === 'ok' && result.user) {
          return result.user;
        }
      } catch (error) {
        console.warn('Login backend no disponible, usando fallback local.', error);
      }
    }

    const users = await loadLocalUsers();
    const found = users.find(user => user.usuario === usuario && user.password === password && user.activo);
    if (!found) throw new Error('Usuario o contraseña incorrectos');
    return {
      usuario: found.usuario,
      nombre: found.nombre,
      rol: found.rol || 'estudiante',
      email: found.email || '',
      source: 'local'
    };
  }

  async function bootstrap() {
    try {
      const result = await jsonp('bootstrap', {});
      if (result.status === 'ok') return result;
    } catch (error) {
      console.warn('Bootstrap backend no disponible.', error);
    }
    return { status: 'offline', calendar: [], forums: [], config: {} };
  }

  async function setupWorkbook() {
    return jsonp('setup', {});
  }

  async function listForums(unidad = '') {
    try {
      const result = await jsonp('forums', { unidad, limit: 150 });
      if (result.status === 'ok') return result.items || [];
    } catch (error) {
      console.warn('No se pudieron cargar foros desde Sheets.', error);
    }
    return JSON.parse(localStorage.getItem('rSaludLocalForums') || '[]')
      .filter(item => !unidad || String(item.unidad) === String(unidad));
  }

  window.RSaludAPI = {
    backendReady,
    bootstrap,
    decodePayload,
    encodePayload,
    getQueue,
    getSession,
    jsonp,
    listForums,
    login,
    nowISO,
    post,
    queueItem,
    sessionMeta,
    setupWorkbook,
    sha256Hex,
    syncQueue,
    write
  };
})();

