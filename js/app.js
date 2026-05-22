(async function () {
  const CONFIG = window.RSALUD_CONFIG;
  const API = window.RSaludAPI;
  const session = API.getSession();

  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  let course = null;
  let bootstrap = { status: 'offline', calendar: [], forums: [], config: {} };
  let forumCache = [];
  let progressTimer = null;

  const progressKey = `${CONFIG.localProgressPrefix}${session.usuario}`;
  const defaultProgress = {
    checks: {},
    quizResults: {},
    activeUnit: 1,
    rpubsUrl: '',
    notes: '',
    calendarDone: {},
    badges: [],
    evidenceLocal: []
  };
  let progress = loadProgress();

  const NAV = [
    ['inicio', 'Inicio'],
    ['ruta', 'Ruta secuencial'],
    ['unidad', 'Unidad activa'],
    ['calendario', 'Calendario'],
    ['foros', 'Foros'],
    ['cuestionarios', 'Cuestionarios'],
    ['laboratorio', 'Laboratorio R'],
    ['evidencias', 'Evidencias'],
    ['proyecto', 'Proyecto RPubs'],
    ['progreso', 'Mi progreso'],
    ['administracion', 'Administración'],
    ['ayuda', 'Ayuda']
  ];

  function loadProgress() {
    try {
      return { ...defaultProgress, ...JSON.parse(localStorage.getItem(progressKey) || '{}') };
    } catch (error) {
      return { ...defaultProgress };
    }
  }

  function saveLocalProgress() {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }

  function debounceProgressSync(reason = 'avance') {
    saveLocalProgress();
    clearTimeout(progressTimer);
    progressTimer = setTimeout(() => syncProgress(reason), 900);
    renderSyncPanel();
  }

  async function syncProgress(reason = 'avance') {
    const summary = progressSummary();
    await API.write('progreso', {
      evento: reason,
      xp_total: summary.xp,
      porcentaje_avance: summary.percent,
      quizzes_completados: summary.quizzesDone,
      promedio_quiz: summary.quizAverage,
      badges: progress.badges,
      progreso_json: progress
    });
    renderSyncPanel();
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function jsString(value) {
    return JSON.stringify(String(value));
  }

  function stepKey(unit, sublevel) {
    return `u${unit.id}_${sublevel.id.replace('.', '_')}`;
  }

  function taskKey(unit) {
    return `u${unit.id}_task`;
  }

  function quizKey(unit) {
    return `u${unit.id}_quiz`;
  }

  function isStepDone(unit, sublevel) {
    return Boolean(progress.checks[stepKey(unit, sublevel)]);
  }

  function isTaskDone(unit) {
    return Boolean(progress.checks[taskKey(unit)]);
  }

  function isQuizDone(unit) {
    const result = progress.quizResults[`u${unit.id}`];
    return Boolean(result && Number(result.score) >= 70);
  }

  function unitProgress(unit) {
    const total = unit.sublevels.length + 2;
    const done = unit.sublevels.filter(sublevel => isStepDone(unit, sublevel)).length
      + (isTaskDone(unit) ? 1 : 0)
      + (isQuizDone(unit) ? 1 : 0);
    return { done, total, percent: Math.round(done / total * 100) };
  }

  function isUnitComplete(unit) {
    return unitProgress(unit).percent === 100;
  }

  function isUnitUnlocked(unit) {
    if (unit.id === 1) return true;
    const previous = course.units.find(item => item.id === unit.id - 1);
    return previous ? isUnitComplete(previous) : true;
  }

  function allCheckIds() {
    return course.units.flatMap(unit => [
      ...unit.sublevels.map(sublevel => stepKey(unit, sublevel)),
      taskKey(unit),
      quizKey(unit)
    ]);
  }

  function progressSummary() {
    const ids = allCheckIds();
    const done = ids.filter(id => progress.checks[id]).length;
    const quizScores = Object.values(progress.quizResults).map(item => Number(item.score || 0));
    const quizAverage = quizScores.length ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;
    const percent = Math.round(done / ids.length * 100);
    const xp = done * 40 + quizScores.reduce((sum, score) => sum + Math.round(score / 5), 0);
    return { done, total: ids.length, percent, quizzesDone: quizScores.length, quizAverage, xp };
  }

  function updateBadges() {
    const badges = new Set(progress.badges || []);
    course.units.forEach(unit => {
      if (isUnitComplete(unit)) {
        const badge = course.badges[unit.id - 1];
        if (badge) badges.add(badge.id);
      }
    });
    if (progress.rpubsUrl) badges.add('publicador');
    progress.badges = Array.from(badges);
  }

  function nextAction() {
    for (const unit of course.units) {
      if (!isUnitUnlocked(unit)) continue;
      const pendingSublevel = unit.sublevels.find(sublevel => !isStepDone(unit, sublevel));
      if (pendingSublevel) {
        return {
          unit,
          label: `Continuar U${unit.id}.${pendingSublevel.id.split('.')[1]}: ${pendingSublevel.title}`,
          target: 'unidad'
        };
      }
      if (!isTaskDone(unit)) return { unit, label: `Completar tarea Unidad ${unit.id}`, target: 'unidad' };
      if (!isQuizDone(unit)) return { unit, label: `Rendir quiz Unidad ${unit.id}`, target: 'cuestionarios' };
    }
    return { unit: course.units[course.units.length - 1], label: 'Registrar publicación final en RPubs', target: 'proyecto' };
  }

  function setActiveUnit(unitId) {
    progress.activeUnit = Number(unitId);
    saveLocalProgress();
    renderUnit();
    showSection('unidad');
  }

  async function markStep(unitId, sublevelId) {
    const unit = course.units.find(item => item.id === Number(unitId));
    const sublevel = unit.sublevels.find(item => item.id === sublevelId);
    progress.checks[stepKey(unit, sublevel)] = true;
    updateBadges();
    debounceProgressSync(`subnivel_${sublevel.id}`);
    await API.write('evento', {
      evento: 'subnivel_completado',
      unidad: unit.id,
      recurso: sublevel.id,
      detalle: sublevel.title
    });
    renderAll();
  }

  async function markTask(unitId) {
    const unit = course.units.find(item => item.id === Number(unitId));
    progress.checks[taskKey(unit)] = true;
    updateBadges();
    debounceProgressSync(`tarea_u${unit.id}`);
    await API.write('evento', {
      evento: 'tarea_completada',
      unidad: unit.id,
      recurso: taskKey(unit),
      detalle: unit.product
    });
    renderAll();
  }

  async function markCalendar(eventId, done) {
    progress.calendarDone[eventId] = done;
    debounceProgressSync('calendario');
    await API.write('evento', {
      evento: done ? 'calendario_completado' : 'calendario_pendiente',
      recurso: eventId,
      detalle: eventId
    });
    renderCalendar();
  }

  function initNavigation() {
    const nav = document.getElementById('navList');
    const mobile = document.getElementById('mobileSelect');
    nav.innerHTML = '';
    mobile.innerHTML = '';

    NAV.forEach(([id, label]) => {
      if (id === 'administracion' && !['docente', 'admin'].includes(session.rol)) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-btn';
      btn.dataset.target = id;
      btn.innerHTML = `<span class="nav-mark"></span><span>${label}</span>`;
      btn.addEventListener('click', () => showSection(id));
      nav.appendChild(btn);

      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = label;
      mobile.appendChild(opt);
    });

    mobile.addEventListener('change', event => showSection(event.target.value));
  }

  function showSection(id) {
    if (!document.getElementById(id)) id = 'inicio';
    document.querySelectorAll('.section').forEach(section => section.classList.toggle('active', section.id === id));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.target === id));
    document.getElementById('mobileSelect').value = id;
    const section = document.getElementById(id);
    document.getElementById('pageTitle').textContent = section.dataset.title;
    document.getElementById('pageSubtitle').textContent = section.dataset.subtitle;
    if (location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
    if (id === 'foros') renderForums();
  }

  function renderSyncPanel() {
    const queue = API.getQueue();
    const online = navigator.onLine;
    const backend = API.backendReady();
    document.getElementById('syncPanel').innerHTML = `
      <strong>Sincronización</strong><br>
      <span class="sync-dot ${online ? 'online' : 'offline'}"></span>
      ${online ? 'Con conexión' : 'Sin conexión'}<br>
      Backend: ${backend ? 'Apps Script activo' : 'pendiente'}<br>
      Pendientes locales: <strong>${queue.length}</strong>
      <div style="margin-top:10px">
        <button class="btn small secondary" type="button" onclick="RSaludApp.syncNow()">Enviar pendientes</button>
      </div>
    `;
  }

  function renderHome() {
    const summary = progressSummary();
    const action = nextAction();
    document.getElementById('inicio').innerHTML = `
      <div class="hero-dashboard">
        <div>
          <span class="eyebrow">Aula virtual conectada</span>
          <h2>Aprendizaje secuencial con trazabilidad real</h2>
          <p>
            Este tablero conserva el potencial del aula ejemplo: ruta por unidades,
            calendario, foros, cuestionarios, evidencias y sincronización con Google Sheets.
          </p>
          <div class="pill-row">
            <button class="btn" type="button" onclick="RSaludApp.goNext()">${escapeHtml(action.label)}</button>
            <a class="btn secondary" href="${CONFIG.sheetUrl}" target="_blank" rel="noopener">Abrir Sheet</a>
            <a class="btn secondary" href="${CONFIG.driveFolderUrl}" target="_blank" rel="noopener">Carpeta Drive</a>
          </div>
        </div>
        <div class="progress-ring" aria-label="Avance general">
          <span>${summary.percent}%</span>
          <small>${summary.done}/${summary.total} hitos</small>
        </div>
      </div>
      <div class="grid four" style="margin-top:16px">
        <div class="stat-card"><span>XP</span><strong>${summary.xp}</strong></div>
        <div class="stat-card"><span>Quizzes</span><strong>${summary.quizzesDone}/6</strong></div>
        <div class="stat-card"><span>Promedio</span><strong>${summary.quizAverage}%</strong></div>
        <div class="stat-card"><span>Logros</span><strong>${progress.badges.length}</strong></div>
      </div>
      <div class="grid two" style="margin-top:16px">
        <div class="panel">
          <h2>Próximas fechas</h2>
          ${nextEvents().map(calendarListItem).join('') || '<p>Sin fechas próximas.</p>'}
        </div>
        <div class="panel">
          <h2>Arquitectura activa</h2>
          <ul>
            <li>Sheet: <code>${CONFIG.sheetId}</code></li>
            <li>Apps Script: <code>${CONFIG.scriptId}</code></li>
            <li>Drive evidencias: <code>${CONFIG.driveFolderId}</code></li>
            <li>Cola offline: <code>${API.getQueue().length}</code> pendiente(s)</li>
          </ul>
        </div>
      </div>
    `;
  }

  function renderRoute() {
    document.getElementById('ruta').innerHTML = `
      <div class="path-grid">
        ${course.units.map(unit => {
          const p = unitProgress(unit);
          const locked = !isUnitUnlocked(unit);
          const complete = isUnitComplete(unit);
          return `
            <article class="path-card ${locked ? 'locked' : ''} ${complete ? 'complete' : ''}">
              <div class="path-top">
                <span class="unit-number" style="background:${unit.color}">${unit.id}</span>
                <span class="pill ${locked ? '' : 'info'}">${locked ? 'Bloqueada' : complete ? 'Completa' : 'Disponible'}</span>
              </div>
              <h3>${unit.title}</h3>
              <p>${unit.product}</p>
              <div class="progress-bar"><div class="progress-fill" style="width:${p.percent}%;background:${unit.color}"></div></div>
              <p class="footer-note">${p.done}/${p.total} hitos · ${unit.weeks}</p>
              <button class="btn small ${locked ? 'secondary' : ''}" type="button" ${locked ? 'disabled' : ''} onclick="RSaludApp.setActiveUnit(${unit.id})">Abrir unidad</button>
            </article>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderUnit() {
    const unit = course.units.find(item => item.id === Number(progress.activeUnit)) || course.units[0];
    const unlocked = isUnitUnlocked(unit);
    const p = unitProgress(unit);
    document.getElementById('unidad').innerHTML = `
      <div class="unit-control panel">
        <div>
          <span class="eyebrow">Unidad activa</span>
          <h2>${unit.id}. ${unit.title}</h2>
          <p>${unit.product}</p>
        </div>
        <select id="unitSelect" aria-label="Seleccionar unidad">
          ${course.units.map(item => `<option value="${item.id}" ${item.id === unit.id ? 'selected' : ''}>Unidad ${item.id}: ${item.shortTitle}</option>`).join('')}
        </select>
      </div>
      ${!unlocked ? `
        <div class="status-box error">Esta unidad se desbloquea al completar la unidad anterior. Podés revisar el mapa, pero el avance recomendado es secuencial.</div>
      ` : ''}
      <div class="grid two" style="margin-top:16px">
        <div class="panel">
          <h2>Resultados de aprendizaje</h2>
          <ul>${unit.outcomes.map(item => `<li>${item}</li>`).join('')}</ul>
          <div class="progress-bar"><div class="progress-fill" style="width:${p.percent}%;background:${unit.color}"></div></div>
          <p class="footer-note">${p.percent}% de la unidad completada</p>
        </div>
        <div class="panel">
          <h2>Producto de la unidad</h2>
          <p>${unit.product}</p>
          <div class="pill-row">
            <a class="btn small secondary" href="${unit.taskUrl}">Ver tarea</a>
            <button class="btn small" type="button" onclick="RSaludApp.markTask(${unit.id})">${isTaskDone(unit) ? 'Tarea registrada' : 'Marcar tarea'}</button>
            <button class="btn small warn" type="button" onclick="RSaludApp.startQuiz(${unit.id})">Rendir quiz</button>
          </div>
          <div id="unitQuizMount"></div>
        </div>
      </div>
      <div class="sublevel-list">
        ${unit.sublevels.map((sublevel, index) => {
          const previousDone = index === 0 || isStepDone(unit, unit.sublevels[index - 1]);
          const lockedStep = unlocked && !previousDone;
          return `
            <article class="sublevel-card ${isStepDone(unit, sublevel) ? 'complete' : ''} ${lockedStep || !unlocked ? 'locked' : ''}">
              <div class="sublevel-index">${sublevel.id}</div>
              <div>
                <h3>${sublevel.title}</h3>
                <p>${sublevel.practice}</p>
                <div class="pill-row">
                  <span class="pill">${sublevel.duration}</span>
                  <a class="btn small secondary" href="${sublevel.resource}">Abrir recurso</a>
                  <button class="btn small" type="button" ${lockedStep || !unlocked ? 'disabled' : ''} onclick="RSaludApp.markStep(${unit.id}, ${jsString(sublevel.id)})">
                    ${isStepDone(unit, sublevel) ? 'Completado' : 'Completar'}
                  </button>
                  <button class="btn small secondary" type="button" onclick="RSaludApp.openForumPrompt(${unit.id}, ${jsString(sublevel.id)})">Foro</button>
                </div>
                <p class="footer-note"><strong>Foro sugerido:</strong> ${sublevel.forumPrompt}</p>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    `;
    document.getElementById('unitSelect').addEventListener('change', event => setActiveUnit(event.target.value));
  }

  function calendarEvents() {
    return [...(course.calendar || []), ...(bootstrap.calendar || [])].sort((a, b) => String(a.due).localeCompare(String(b.due)));
  }

  function nextEvents() {
    const today = new Date().toISOString().slice(0, 10);
    return calendarEvents().filter(event => event.due >= today && !progress.calendarDone[event.id]).slice(0, 5);
  }

  function calendarListItem(event) {
    return `
      <div class="calendar-item type-${event.type}">
        <div class="calendar-date">
          <strong>${event.due.slice(8, 10)}</strong>
          <span>${event.due.slice(5, 7)}/${event.due.slice(0, 4)}</span>
        </div>
        <div class="calendar-body">
          <div class="calendar-title-row">
            <strong>${event.title}</strong>
            <span class="pill">${event.type}</span>
          </div>
          <p>Unidad ${event.unit || '-'} · Inicio ${event.start || event.due}</p>
        </div>
      </div>
    `;
  }

  function renderCalendar() {
    const events = calendarEvents();
    document.getElementById('calendario').innerHTML = `
      <div class="panel">
        <h2>Calendario del aula</h2>
        <p>Las marcas se guardan localmente y se registran como eventos en Google Sheets.</p>
        <div class="calendar-list">
          ${events.map(event => `
            <div class="calendar-item type-${event.type}">
              <div class="calendar-date">
                <strong>${event.due.slice(8, 10)}</strong>
                <span>${event.due.slice(5, 7)}/${event.due.slice(0, 4)}</span>
              </div>
              <div class="calendar-body">
                <div class="calendar-title-row">
                  <strong>${event.title}</strong>
                  <span class="pill ${progress.calendarDone[event.id] ? 'info' : ''}">${progress.calendarDone[event.id] ? 'Completado' : event.type}</span>
                </div>
                <p>Unidad ${event.unit || '-'} · ${event.start || event.due} a ${event.due}</p>
                <div class="pill-row">
                  <a class="btn small secondary" href="${event.resource || '#'}">Abrir recurso</a>
                  <button class="btn small" type="button" onclick="RSaludApp.markCalendar(${jsString(event.id)}, ${!progress.calendarDone[event.id]})">
                    ${progress.calendarDone[event.id] ? 'Desmarcar' : 'Marcar hecho'}
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async function renderForums() {
    const activeUnit = course.units.find(unit => unit.id === Number(progress.activeUnit)) || course.units[0];
    forumCache = await API.listForums(activeUnit.id);
    const prompts = activeUnit.sublevels.map(sublevel => `<option value="${sublevel.id}">${sublevel.id} · ${sublevel.title}</option>`).join('');
    document.getElementById('foros').innerHTML = `
      <div class="grid two">
        <div class="panel">
          <h2>Foro de reflexión</h2>
          <p>Las intervenciones quedan en la hoja <code>FOROS</code>. Si no hay conexión, se guardan en cola local.</p>
          <form id="forumForm">
            <div class="form-field">
              <label for="forumUnit">Unidad</label>
              <select id="forumUnit">${course.units.map(unit => `<option value="${unit.id}" ${unit.id === activeUnit.id ? 'selected' : ''}>Unidad ${unit.id}: ${unit.shortTitle}</option>`).join('')}</select>
            </div>
            <div class="form-field">
              <label for="forumPrompt">Subnivel</label>
              <select id="forumPrompt">${prompts}</select>
            </div>
            <div class="status-box" id="forumPromptPreview">${escapeHtml(activeUnit.sublevels[0].forumPrompt)}</div>
            <div class="form-field">
              <label for="forumMessage">Tu aporte</label>
              <textarea id="forumMessage" rows="7" required placeholder="Escribe una reflexión, pregunta o respuesta para tus compañeros."></textarea>
            </div>
            <button class="btn" type="submit">Publicar en foro</button>
          </form>
        </div>
        <div class="panel">
          <h2>Rúbrica breve</h2>
          <ul>
            <li>Conecta el aporte con la pregunta del subnivel.</li>
            <li>Usa vocabulario de salud o estadística correctamente.</li>
            <li>Incluye una duda o aplicación concreta.</li>
            <li>Respeta confidencialidad: no publiques datos personales reales.</li>
          </ul>
        </div>
      </div>
      <div class="panel" style="margin-top:16px">
        <h2>Aportes recientes</h2>
        <div id="forumList">${renderForumItems(forumCache)}</div>
      </div>
    `;
    bindForumForm(activeUnit);
  }

  function renderForumItems(items) {
    if (!items.length) return '<p class="footer-note">Todavía no hay aportes para esta unidad.</p>';
    return items.slice().reverse().map(item => `
      <article class="forum-post">
        <div>
          <strong>${escapeHtml(item.nombre || item.usuario || 'Participante')}</strong>
          <span>${escapeHtml(item.timestamp || '')}</span>
        </div>
        <p>${escapeHtml(item.mensaje || '')}</p>
        <small>Unidad ${escapeHtml(item.unidad || '')} · ${escapeHtml(item.recurso || '')}</small>
      </article>
    `).join('');
  }

  function bindForumForm(activeUnit) {
    const unitSelect = document.getElementById('forumUnit');
    const promptSelect = document.getElementById('forumPrompt');
    const preview = document.getElementById('forumPromptPreview');

    unitSelect.addEventListener('change', () => {
      progress.activeUnit = Number(unitSelect.value);
      saveLocalProgress();
      renderForums();
    });

    promptSelect.addEventListener('change', () => {
      const sublevel = activeUnit.sublevels.find(item => item.id === promptSelect.value) || activeUnit.sublevels[0];
      preview.textContent = sublevel.forumPrompt;
    });

    document.getElementById('forumForm').addEventListener('submit', async event => {
      event.preventDefault();
      const sublevel = activeUnit.sublevels.find(item => item.id === promptSelect.value) || activeUnit.sublevels[0];
      const mensaje = document.getElementById('forumMessage').value.trim();
      if (!mensaje) return;
      const item = {
        id: `foro-${Date.now()}`,
        tipo: 'foro',
        unidad: activeUnit.id,
        recurso: sublevel.id,
        titulo_recurso: sublevel.title,
        mensaje,
        canal: 'foro_unidad',
        estado: 'publicado',
        timestamp: API.nowISO()
      };
      const result = await API.write('foro', item);
      const local = JSON.parse(localStorage.getItem('rSaludLocalForums') || '[]');
      local.push({ ...API.sessionMeta(), ...item });
      localStorage.setItem('rSaludLocalForums', JSON.stringify(local.slice(-300)));
      document.getElementById('forumMessage').value = '';
      preview.className = `status-box ${result.status === 'queued' ? 'error' : 'ok'}`;
      preview.textContent = result.status === 'queued'
        ? 'Sincronización pendiente. El aporte quedó en cola local.'
        : 'Aporte publicado y registrado.';
      renderForums();
    });
  }

  function openForumPrompt(unitId, sublevelId) {
    progress.activeUnit = Number(unitId);
    saveLocalProgress();
    showSection('foros');
    renderForums().then(() => {
      const select = document.getElementById('forumPrompt');
      if (select) {
        select.value = sublevelId;
        select.dispatchEvent(new Event('change'));
      }
    });
  }

  function renderQuizzes() {
    document.getElementById('cuestionarios').innerHTML = `
      <div class="grid two">
        ${course.units.map(unit => {
          const result = progress.quizResults[`u${unit.id}`];
          const locked = !isUnitUnlocked(unit);
          return `
            <article class="quiz-card ${locked ? 'locked' : ''}" id="quizCard${unit.id}">
              <h3>Unidad ${unit.id}: ${unit.shortTitle}</h3>
              <p>${unit.title}</p>
              <div class="pill-row">
                <span class="pill ${result ? 'info' : ''}">${result ? `${result.score}% · ${result.correct}/${result.total}` : 'Pendiente'}</span>
                <button class="btn small" type="button" ${locked ? 'disabled' : ''} onclick="RSaludApp.startQuiz(${unit.id}, 'quizMount${unit.id}')">Iniciar</button>
              </div>
              <div id="quizMount${unit.id}"></div>
            </article>
          `;
        }).join('')}
      </div>
    `;
  }

  async function startQuiz(unitId, mountId = 'unitQuizMount') {
    const unit = course.units.find(item => item.id === Number(unitId));
    const mount = document.getElementById(mountId);
    mount.innerHTML = '<div class="status-box">Cargando cuestionario...</div>';
    try {
      const response = await fetch(unit.quiz, { cache: 'no-store' });
      const quiz = await response.json();
      mount.innerHTML = `
        <form class="quiz-live" id="quizForm${unit.id}">
          ${quiz.preguntas.map((question, qIndex) => `
            <fieldset class="panel quiz-question">
              <legend><strong>${qIndex + 1}. ${question.texto}</strong></legend>
              <div class="quiz-options">
                ${question.opciones.map((option, oIndex) => `
                  <label>
                    <input type="radio" name="q${qIndex}" value="${oIndex}" required>
                    <span>${option}</span>
                  </label>
                `).join('')}
              </div>
            </fieldset>
          `).join('')}
          <button class="btn small" type="submit">Corregir y registrar</button>
        </form>
        <div class="quiz-feedback" id="quizFeedback${unit.id}"></div>
      `;
      document.getElementById(`quizForm${unit.id}`).addEventListener('submit', async event => {
        event.preventDefault();
        const data = new FormData(event.target);
        let correct = 0;
        const explanations = quiz.preguntas.map((question, qIndex) => {
          const selected = Number(data.get(`q${qIndex}`));
          const ok = selected === question.correcta;
          if (ok) correct += 1;
          return `<li><strong>${ok ? 'Correcta' : 'Revisar'}:</strong> ${question.explicacion}</li>`;
        });
        const score = Math.round(correct / quiz.preguntas.length * 100);
        progress.quizResults[`u${unit.id}`] = { score, correct, total: quiz.preguntas.length, date: API.nowISO() };
        if (score >= 70) progress.checks[quizKey(unit)] = true;
        updateBadges();
        debounceProgressSync(`quiz_u${unit.id}`);
        await API.write('calificacion', {
          unidad: unit.id,
          actividad: `Quiz Unidad ${unit.id}`,
          tipo: 'quiz',
          puntaje: score,
          correctas: correct,
          total: quiz.preguntas.length,
          porcentaje: score,
          detalle: { titulo: quiz.titulo }
        });
        const feedback = document.getElementById(`quizFeedback${unit.id}`);
        feedback.className = 'quiz-feedback visible';
        feedback.innerHTML = `<h3>Resultado: ${score}%</h3><p>${score >= 70 ? 'Unidad aprobada.' : 'Conviene repasar y volver a intentar.'}</p><ul>${explanations.join('')}</ul>`;
        renderRoute();
        renderHome();
      });
    } catch (error) {
      mount.innerHTML = '<div class="status-box error">No se pudo cargar el cuestionario.</div>';
    }
  }

  function renderLab() {
    const code = `# Curso R aplicado a la salud
library(tidyverse)
library(janitor)
library(broom)

salud <- read.csv("data/salud_muestra.csv")
glimpse(salud)

salud <- salud |>
  mutate(
    diagnostico = factor(diagnostico),
    tabaquismo = factor(tabaquismo),
    diabetes_probable = diagnostico == "Diabetes probable"
  )

salud |>
  group_by(diagnostico) |>
  summarise(
    n = n(),
    glucosa_media = mean(glucosa_mg_dl),
    imc_media = mean(imc),
    .groups = "drop"
  )

ggplot(salud, aes(diagnostico, glucosa_mg_dl, fill = diagnostico)) +
  geom_boxplot(show.legend = FALSE) +
  labs(title = "Glucosa por diagnóstico", x = "Diagnóstico", y = "Glucosa mg/dl") +
  theme_minimal()

modelo <- glm(diabetes_probable ~ edad + imc + tabaquismo, data = salud, family = binomial)
tidy(modelo, exponentiate = TRUE, conf.int = TRUE)`;
    document.getElementById('laboratorio').innerHTML = `
      <div class="grid two">
        <div class="panel">
          <h2>Laboratorio integrado</h2>
          <p>Este bloque concentra la línea de trabajo del curso. Copialo dentro de RStudio y ejecútalo por partes.</p>
          <div class="pill-row">
            <a class="btn" href="laboratorio/index.html">Abrir laboratorio extendido</a>
            <a class="btn secondary" href="data/datasets/salud_muestra.csv" download>Descargar CSV</a>
          </div>
        </div>
        <div class="panel">
          <h2>Paquetes</h2>
          <p><code>tidyverse</code>, <code>janitor</code>, <code>broom</code> y <code>gtsummary</code> cubren el flujo completo.</p>
        </div>
      </div>
      <div class="code-block">
        <button class="btn small warn" type="button" onclick="RSaludApp.copyCode(this)">Copiar</button>
        <pre><code>${escapeHtml(code)}</code></pre>
      </div>
    `;
  }

  function renderEvidence() {
    document.getElementById('evidencias').innerHTML = `
      <div class="grid two">
        <div class="panel">
          <h2>Cargar evidencia a Drive</h2>
          <p>Usa esta sección para enviar capturas de instalación, gráficos PNG, reportes HTML/PDF o imágenes del proyecto. El backend los guarda en la carpeta Drive configurada.</p>
          <form id="evidenceForm">
            <div class="form-field">
              <label for="evidenceUnit">Unidad</label>
              <select id="evidenceUnit">${course.units.map(unit => `<option value="${unit.id}">Unidad ${unit.id}: ${unit.shortTitle}</option>`).join('')}</select>
            </div>
            <div class="form-field">
              <label for="evidenceTitle">Título</label>
              <input id="evidenceTitle" required placeholder="Gráfico de glucosa por diagnóstico">
            </div>
            <div class="form-field">
              <label for="evidenceFile">Archivo</label>
              <input id="evidenceFile" type="file" accept="image/*,.pdf,.html,.htm,.txt,.R,.Rmd,.qmd" required>
            </div>
            <button class="btn" type="submit">Guardar evidencia</button>
          </form>
          <div id="evidenceStatus" class="status-box">Carpeta destino: ${CONFIG.driveFolderId}</div>
        </div>
        <div class="panel">
          <h2>Evidencias locales</h2>
          <div id="evidenceList">${renderEvidenceList()}</div>
        </div>
      </div>
    `;
    document.getElementById('evidenceForm').addEventListener('submit', uploadEvidence);
  }

  function renderEvidenceList() {
    const items = progress.evidenceLocal || [];
    if (!items.length) return '<p class="footer-note">Todavía no se registraron evidencias desde este navegador.</p>';
    return items.slice().reverse().map(item => `
      <div class="resource-row">
        <div><strong>${escapeHtml(item.title)}</strong><p>Unidad ${item.unit} · ${escapeHtml(item.fileName)} · ${escapeHtml(item.status)}</p></div>
        ${item.url ? `<a class="btn small secondary" href="${item.url}" target="_blank" rel="noopener">Abrir</a>` : '<span class="pill">Pendiente</span>'}
      </div>
    `).join('');
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function uploadEvidence(event) {
    event.preventDefault();
    const status = document.getElementById('evidenceStatus');
    const file = document.getElementById('evidenceFile').files[0];
    if (!file) return;
    status.className = 'status-box';
    status.textContent = 'Preparando archivo...';

    try {
      const dataBase64 = await fileToBase64(file);
      const payload = {
        unidad: document.getElementById('evidenceUnit').value,
        titulo: document.getElementById('evidenceTitle').value.trim(),
        file_name: file.name,
        mime_type: file.type || 'application/octet-stream',
        size_bytes: file.size,
        data_base64: dataBase64
      };
      const result = await API.write('evidencia', payload, { large: true });
      progress.evidenceLocal.push({
        unit: payload.unidad,
        title: payload.titulo,
        fileName: file.name,
        status: result.status === 'queued' ? 'Pendiente de sincronización' : 'Guardada en Drive',
        url: result.file_url || '',
        timestamp: API.nowISO()
      });
      debounceProgressSync('evidencia');
      status.className = `status-box ${result.status === 'queued' ? 'error' : 'ok'}`;
      status.textContent = result.status === 'queued'
        ? 'No se pudo confirmar el backend. La evidencia quedó en cola local.'
        : 'Evidencia guardada en Google Drive y registrada en Sheets.';
      renderEvidence();
    } catch (error) {
      status.className = 'status-box error';
      status.textContent = `No se pudo preparar la evidencia: ${error.message}`;
    }
  }

  function renderProject() {
    document.getElementById('proyecto').innerHTML = `
      <div class="grid two">
        <div class="panel">
          <h2>Ensayo final RPubs</h2>
          <p>El producto final debe integrar una pregunta, datos, código, resultados, interpretación y límites. El informe se publica como HTML en RPubs.</p>
          <ol>
            <li>Crear <code>reporte_final.Rmd</code> o <code>reporte_final.qmd</code>.</li>
            <li>Usar el dataset de práctica o una base autorizada y anonimizada.</li>
            <li>Incluir una tabla, dos gráficos y una prueba o modelo sencillo.</li>
            <li>Renderizar HTML y publicar en RPubs.</li>
          </ol>
        </div>
        <div class="panel">
          <h2>Registrar publicación</h2>
          <div class="form-field">
            <label for="rpubsUrl">URL RPubs</label>
            <input id="rpubsUrl" value="${escapeHtml(progress.rpubsUrl || '')}" placeholder="https://rpubs.com/usuario/reporte">
          </div>
          <button class="btn" type="button" onclick="RSaludApp.saveRpubs()">Guardar y sincronizar</button>
          <p class="footer-note">Referencia útil: <a href="${CONFIG.rpubsReference}" target="_blank" rel="noopener">Inferencia con R</a>.</p>
        </div>
      </div>
    `;
  }

  async function saveRpubs() {
    const url = document.getElementById('rpubsUrl').value.trim();
    progress.rpubsUrl = url;
    updateBadges();
    debounceProgressSync('rpubs');
    await API.write('evento', { evento: 'rpubs_registrado', recurso: 'proyecto_final', detalle: url });
    renderAll();
    showSection('proyecto');
  }

  function renderProgress() {
    const summary = progressSummary();
    document.getElementById('progreso').innerHTML = `
      <div class="grid two">
        <div class="panel">
          <h2>Mi avance</h2>
          <div class="progress-bar"><div class="progress-fill" style="width:${summary.percent}%"></div></div>
          <p>${summary.percent}% · ${summary.done}/${summary.total} hitos · ${summary.xp} XP</p>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Unidad</th><th>Avance</th><th>Quiz</th><th>Estado</th></tr></thead>
              <tbody>
                ${course.units.map(unit => {
                  const p = unitProgress(unit);
                  const quiz = progress.quizResults[`u${unit.id}`];
                  return `<tr><td>${unit.id}. ${unit.shortTitle}</td><td>${p.done}/${p.total}</td><td>${quiz ? `${quiz.score}%` : 'Pendiente'}</td><td>${isUnitComplete(unit) ? 'Completa' : isUnitUnlocked(unit) ? 'En curso' : 'Bloqueada'}</td></tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
        <div class="panel">
          <h2>Logros</h2>
          <div class="badge-grid">
            ${course.badges.map(badge => `<div class="badge-card ${progress.badges.includes(badge.id) ? 'earned' : ''}"><strong>${badge.name}</strong><span>${badge.criteria}</span></div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderAdmin() {
    document.getElementById('administracion').innerHTML = `
      <div class="grid two">
        <div class="admin-box">
          <h2>Backend conectado</h2>
          <p><strong>Sheet:</strong> <a href="${CONFIG.sheetUrl}" target="_blank" rel="noopener">${CONFIG.sheetId}</a></p>
          <p><strong>Apps Script:</strong> <code>${CONFIG.scriptId}</code></p>
          <p><strong>Web app:</strong> <code>${CONFIG.appsScriptUrl}</code></p>
          <p><strong>Drive:</strong> <a href="${CONFIG.driveFolderUrl}" target="_blank" rel="noopener">${CONFIG.driveFolderId}</a></p>
          <button class="btn small" type="button" onclick="RSaludApp.setupWorkbook()">Preparar libro de Sheets</button>
        </div>
        <div class="admin-box">
          <h2>Operación</h2>
          <button class="btn small" type="button" onclick="RSaludApp.syncNow()">Enviar cola offline</button>
          <button class="btn small secondary" type="button" onclick="RSaludApp.downloadProgress()">Exportar progreso</button>
          <button class="btn small secondary" type="button" onclick="RSaludApp.resetProgress()">Reiniciar progreso local</button>
          <div id="adminStatus" class="status-box">Listo para operar.</div>
        </div>
      </div>
    `;
  }

  function renderHelp() {
    document.getElementById('ayuda').innerHTML = `
      <div class="grid two">
        <div class="panel">
          <h2>Documentación</h2>
          <div class="resource-row"><div><strong>Manual de usuario</strong><p>Uso del aula, progreso, foros y evidencias.</p></div><a class="btn small secondary" href="docs/manual_usuario.md">Abrir</a></div>
          <div class="resource-row"><div><strong>Manual técnico</strong><p>Backend, Sheets, Apps Script y publicación.</p></div><a class="btn small secondary" href="docs/manual_tecnico.md">Abrir</a></div>
          <div class="resource-row"><div><strong>Diccionario de datos</strong><p>Variables del dataset de práctica.</p></div><a class="btn small secondary" href="docs/diccionario_datos.md">Abrir</a></div>
        </div>
        <div class="panel">
          <h2>Soporte rápido</h2>
          <ul>
            <li>Si no hay internet, los eventos quedan en cola y se sincronizan después.</li>
            <li>Si una evidencia no sube, queda pendiente y no se borra localmente.</li>
            <li>Si el login remoto falla, el aula usa credenciales locales de demostración.</li>
            <li>Para producción, administrar usuarios desde la hoja <code>USUARIOS</code>.</li>
          </ul>
        </div>
      </div>
    `;
  }

  async function setupWorkbook() {
    const status = document.getElementById('adminStatus');
    status.className = 'status-box';
    status.textContent = 'Preparando libro...';
    try {
      const result = await API.setupWorkbook();
      status.className = 'status-box ok';
      status.textContent = `Libro listo. Hojas verificadas: ${(result.sheets || []).join(', ')}`;
    } catch (error) {
      status.className = 'status-box error';
      status.textContent = error.message;
    }
  }

  async function syncNow() {
    const result = await API.syncQueue();
    renderSyncPanel();
    renderHome();
    alert(`Sincronización: enviados ${result.sent}, pendientes ${result.remaining}`);
  }

  function goNext() {
    const action = nextAction();
    progress.activeUnit = action.unit.id;
    saveLocalProgress();
    if (action.target === 'unidad') renderUnit();
    showSection(action.target);
  }

  function copyCode(button) {
    const code = button.parentElement.querySelector('code').innerText;
    navigator.clipboard.writeText(code).then(() => {
      button.textContent = 'Copiado';
      setTimeout(() => button.textContent = 'Copiar', 1400);
    });
  }

  function downloadProgress() {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `progreso_${session.usuario}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function resetProgress() {
    if (!confirm('¿Reiniciar el progreso local?')) return;
    progress = { ...defaultProgress };
    saveLocalProgress();
    renderAll();
  }

  function renderAll() {
    updateBadges();
    renderSyncPanel();
    renderHome();
    renderRoute();
    renderUnit();
    renderCalendar();
    renderQuizzes();
    renderLab();
    renderEvidence();
    renderProject();
    renderProgress();
    renderAdmin();
    renderHelp();
  }

  async function init() {
    document.getElementById('userLabel').textContent = `${session.nombre} · ${session.rol}`;
    document.getElementById('logoutBtn').addEventListener('click', () => {
      sessionStorage.removeItem(CONFIG.localSessionKey);
      window.location.href = 'index.html';
    });
    window.addEventListener('online', renderSyncPanel);
    window.addEventListener('offline', renderSyncPanel);
    window.addEventListener('rSaludQueueChanged', renderSyncPanel);

    const response = await fetch(CONFIG.courseDataUrl, { cache: 'no-store' });
    course = await response.json();
    bootstrap = await API.bootstrap();
    initNavigation();
    renderAll();
    showSection((location.hash || '#inicio').replace('#', ''));
  }

  window.RSaludApp = {
    copyCode,
    downloadProgress,
    goNext,
    markCalendar,
    markStep,
    markTask,
    openForumPrompt,
    resetProgress,
    saveRpubs,
    setActiveUnit,
    setupWorkbook,
    startQuiz,
    syncNow
  };

  init().catch(error => {
    document.body.innerHTML = `<main class="doc-page"><div class="status-box error">No se pudo iniciar el aula: ${escapeHtml(error.message)}</div></main>`;
  });
})();
