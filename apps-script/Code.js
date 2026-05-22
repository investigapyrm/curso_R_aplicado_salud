const APP = {
  NAME: 'R aplicado a la salud',
  VERSION: '2026.05.22.2',
  SHEET_ID: '1mlgNE-pDQZuAuUNj524dHn-zF9cbYvv6a6shvTDDtTg',
  DRIVE_FOLDER_ID: '1g5rmr_z3wo2JbkPD4GGl3EhvC-Jq1E6v',
  PAGES_URL: 'https://investigapyrm.github.io/curso_R_aplicado_salud/',
  TZ: 'America/Asuncion'
};

const HEADERS = {
  CONFIG: ['parametro', 'valor', 'descripcion', 'activo', 'fecha_actualizacion'],
  USUARIOS: ['usuario', 'password_hash', 'nombre', 'correo', 'rol', 'activo', 'fecha_creacion', 'ultimo_acceso', 'observacion'],
  SESIONES: ['fecha_hora', 'session_id', 'usuario', 'nombre', 'rol', 'evento', 'detalle', 'user_agent', 'origen_url'],
  PROGRESO: ['fecha_hora', 'usuario', 'nombre', 'rol', 'xp_total', 'porcentaje_avance', 'quizzes_completados', 'promedio_quiz', 'badges', 'progreso_json', 'session_id'],
  CALIFICACIONES: ['fecha_hora', 'usuario', 'nombre', 'rol', 'unidad', 'actividad', 'tipo', 'puntaje', 'correctas', 'total', 'porcentaje', 'detalle', 'session_id'],
  EVENTOS: ['fecha_hora', 'usuario', 'nombre', 'rol', 'evento', 'unidad', 'recurso', 'detalle', 'origen_url', 'user_agent', 'session_id', 'app_version'],
  FOROS: ['fecha_hora', 'id', 'tipo', 'canal', 'usuario', 'nombre', 'rol', 'unidad', 'recurso', 'titulo_recurso', 'mensaje', 'parent_id', 'estado', 'origen_url', 'user_agent', 'session_id'],
  CALENDARIO: ['id', 'unidad', 'tipo', 'titulo', 'fecha_inicio', 'fecha_vencimiento', 'recurso', 'estado', 'observacion'],
  EVIDENCIAS: ['fecha_hora', 'id_evidencia', 'usuario', 'nombre', 'rol', 'unidad', 'titulo', 'nombre_archivo', 'tipo_mime', 'tamano_bytes', 'file_id', 'url_drive', 'estado', 'observacion', 'session_id'],
  ERRORES: ['fecha_hora', 'usuario', 'modulo', 'mensaje_usuario', 'detalle_tecnico', 'payload', 'session_id'],
  VERSIONES: ['fecha_hora', 'app_version', 'script_version', 'detalle']
};

const DEFAULT_CALENDAR = [
  ['u1_material', 1, 'material', 'Unidad 1: instalación y primeros pasos', '2026-06-01', '2026-06-07', 'dashboard.html#unidad', 'activo', ''],
  ['u1_quiz', 1, 'quiz', 'Quiz Unidad 1', '2026-06-06', '2026-06-07', 'dashboard.html#cuestionarios', 'activo', ''],
  ['u2_material', 2, 'material', 'Unidad 2: datos de salud', '2026-06-08', '2026-06-14', 'dashboard.html#unidad', 'activo', ''],
  ['u2_quiz', 2, 'quiz', 'Quiz Unidad 2', '2026-06-13', '2026-06-14', 'dashboard.html#cuestionarios', 'activo', ''],
  ['u3_material', 3, 'material', 'Unidad 3: descriptiva y gráficos', '2026-06-15', '2026-06-21', 'dashboard.html#unidad', 'activo', ''],
  ['u3_quiz', 3, 'quiz', 'Quiz Unidad 3', '2026-06-20', '2026-06-21', 'dashboard.html#cuestionarios', 'activo', ''],
  ['u4_material', 4, 'material', 'Unidad 4: inferencia básica', '2026-06-22', '2026-06-28', 'dashboard.html#unidad', 'activo', ''],
  ['u4_quiz', 4, 'quiz', 'Quiz Unidad 4', '2026-06-27', '2026-06-28', 'dashboard.html#cuestionarios', 'activo', ''],
  ['u5_material', 5, 'material', 'Unidad 5: modelos sencillos', '2026-06-29', '2026-07-05', 'dashboard.html#unidad', 'activo', ''],
  ['u5_quiz', 5, 'quiz', 'Quiz Unidad 5', '2026-07-04', '2026-07-05', 'dashboard.html#cuestionarios', 'activo', ''],
  ['u6_material', 6, 'material', 'Unidad 6: reporte y RPubs', '2026-07-06', '2026-07-12', 'dashboard.html#proyecto', 'activo', ''],
  ['final_rpubs', 6, 'entrega', 'Entrega final: enlace RPubs', '2026-07-10', '2026-07-12', 'dashboard.html#proyecto', 'activo', '']
];

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  try {
    const action = String(params.action || 'ping').toLowerCase();
    if (action === 'setup') return jsonResponse(setupWorkbook_(), params.callback);
    if (action === 'bootstrap') return jsonResponse(getBootstrap_(), params.callback);
    if (action === 'auth') return jsonResponse(authenticate_(params), params.callback);
    if (action === 'write') return jsonResponse(writeFromGet_(params), params.callback);
    if (action === 'forums') return jsonResponse(listForums_(params), params.callback);
    if (action === 'calendar') return jsonResponse({ status: 'ok', items: getCalendar_() }, params.callback);
    return jsonResponse({ status: 'ok', app: APP.NAME, version: APP.VERSION, sheet_id: APP.SHEET_ID }, params.callback);
  } catch (err) {
    logError_('', 'doGet', 'No se pudo completar la operación.', err, params);
    return jsonResponse({ status: 'error', message: String(err && err.message ? err.message : err) }, params.callback);
  }
}

function doPost(e) {
  let payload = {};
  try {
    payload = parsePayload_(e);
    const result = appendPayload_(payload);
    return jsonResponse(result);
  } catch (err) {
    logError_(payload.usuario || '', 'doPost', 'No se pudo guardar la información.', err, payload);
    return jsonResponse({ status: 'error', message: String(err && err.message ? err.message : err) });
  }
}

function setupWorkbook_() {
  const ss = getSpreadsheet_();
  ensureWorkbook_(ss);
  seedConfig_(ss);
  seedUsers_(ss);
  seedCalendar_(ss);
  appendByHeaders_(ss.getSheetByName('VERSIONES'), HEADERS.VERSIONES, {
    fecha_hora: now_(),
    app_version: APP.VERSION,
    script_version: 'Code.js',
    detalle: 'setupWorkbook ejecutado'
  });
  return { status: 'ok', sheets: Object.keys(HEADERS), app: APP };
}

function getBootstrap_() {
  const ss = getSpreadsheet_();
  ensureWorkbook_(ss);
  return {
    status: 'ok',
    app: APP,
    config: readConfig_(ss),
    calendar: getCalendar_(),
    forums: listForums_({ limit: 40 }).items
  };
}

function authenticate_(params) {
  const usuario = String(params.usuario || params.username || '').trim();
  const passwordHash = String(params.password_hash || '').trim();
  const plainPassword = String(params.password || '').trim();
  if (!usuario || (!passwordHash && !plainPassword)) {
    return { status: 'error', message: 'missing_credentials' };
  }

  const ss = getSpreadsheet_();
  ensureWorkbook_(ss);
  seedUsers_(ss);
  const sheet = ss.getSheetByName('USUARIOS');
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  const rows = values.map((row, index) => objectFromRow_(headers, row, index + 2));
  const user = rows.find(row => String(row.usuario || '').trim() === usuario && String(row.activo || '').toLowerCase() !== 'false');
  if (!user) {
    appendEvent_({ usuario, evento: 'login_fallido', detalle: 'usuario_no_autorizado' });
    return { status: 'error', message: 'not_authorized' };
  }

  const expected = String(user.password_hash || '').trim();
  const incoming = passwordHash || sha256Hex_(plainPassword);
  if (expected !== incoming) {
    appendEvent_({ usuario, nombre: user.nombre, rol: user.rol, evento: 'login_fallido', detalle: 'password_incorrecto' });
    return { status: 'error', message: 'invalid_password' };
  }

  const lastAccessCol = headers.indexOf('ultimo_acceso') + 1;
  if (lastAccessCol > 0) sheet.getRange(user.__row, lastAccessCol).setValue(now_());
  appendByHeaders_(ss.getSheetByName('SESIONES'), HEADERS.SESIONES, {
    fecha_hora: now_(),
    session_id: Utilities.getUuid(),
    usuario,
    nombre: user.nombre,
    rol: user.rol,
    evento: 'login_exitoso',
    detalle: 'auth_backend',
    user_agent: params.user_agent || '',
    origen_url: params.origen_url || ''
  });

  return {
    status: 'ok',
    user: {
      usuario,
      nombre: user.nombre || usuario,
      correo: user.correo || '',
      email: user.correo || '',
      rol: user.rol || 'estudiante',
      source: 'backend'
    }
  };
}

function writeFromGet_(params) {
  if (!params.payload) return { status: 'error', message: 'missing_payload' };
  const payload = JSON.parse(Utilities.newBlob(Utilities.base64Decode(params.payload)).getDataAsString('UTF-8'));
  return appendPayload_(payload);
}

function appendPayload_(payload) {
  const ss = getSpreadsheet_();
  ensureWorkbook_(ss);
  const kind = String(payload.kind || 'evento').toLowerCase();
  if (kind === 'progreso') return appendProgress_(ss, payload);
  if (kind === 'calificacion' || kind === 'quiz') return appendGrade_(ss, payload);
  if (kind === 'foro' || kind === 'interaccion') return appendForum_(ss, payload);
  if (kind === 'evidencia') return appendEvidence_(ss, payload);
  if (kind === 'error') return appendError_(ss, payload);
  return appendEvent_(payload);
}

function appendProgress_(ss, payload) {
  appendByHeaders_(ss.getSheetByName('PROGRESO'), HEADERS.PROGRESO, {
    fecha_hora: payload.timestamp || now_(),
    usuario: payload.usuario || '',
    nombre: payload.nombre || '',
    rol: payload.rol || '',
    xp_total: payload.xp_total || 0,
    porcentaje_avance: payload.porcentaje_avance || 0,
    quizzes_completados: payload.quizzes_completados || '',
    promedio_quiz: payload.promedio_quiz || '',
    badges: stringify_(payload.badges || ''),
    progreso_json: stringify_(payload.progreso_json || payload.progreso || ''),
    session_id: payload.session_id || ''
  });
  return { status: 'ok', saved_at: now_(), sheet: 'PROGRESO' };
}

function appendGrade_(ss, payload) {
  appendByHeaders_(ss.getSheetByName('CALIFICACIONES'), HEADERS.CALIFICACIONES, {
    fecha_hora: payload.timestamp || now_(),
    usuario: payload.usuario || '',
    nombre: payload.nombre || '',
    rol: payload.rol || '',
    unidad: payload.unidad || '',
    actividad: payload.actividad || '',
    tipo: payload.tipo || payload.kind || 'quiz',
    puntaje: payload.puntaje || 0,
    correctas: payload.correctas || 0,
    total: payload.total || 0,
    porcentaje: payload.porcentaje || payload.puntaje || 0,
    detalle: stringify_(payload.detalle || payload),
    session_id: payload.session_id || ''
  });
  return { status: 'ok', saved_at: now_(), sheet: 'CALIFICACIONES' };
}

function appendForum_(ss, payload) {
  const id = payload.id || Utilities.getUuid();
  appendByHeaders_(ss.getSheetByName('FOROS'), HEADERS.FOROS, {
    fecha_hora: payload.timestamp || now_(),
    id,
    tipo: payload.tipo || 'foro',
    canal: payload.canal || 'foro_unidad',
    usuario: payload.usuario || '',
    nombre: payload.nombre || '',
    rol: payload.rol || '',
    unidad: payload.unidad || '',
    recurso: payload.recurso || '',
    titulo_recurso: payload.titulo_recurso || payload.titulo || '',
    mensaje: payload.mensaje || '',
    parent_id: payload.parent_id || '',
    estado: payload.estado || 'publicado',
    origen_url: payload.origen_url || '',
    user_agent: payload.user_agent || '',
    session_id: payload.session_id || ''
  });
  return { status: 'ok', saved_at: now_(), sheet: 'FOROS', id };
}

function appendEvidence_(ss, payload) {
  if (!payload.data_base64) {
    throw new Error('missing_file_data');
  }
  const folder = DriveApp.getFolderById(APP.DRIVE_FOLDER_ID);
  const fileName = sanitizeFileName_(payload.file_name || `evidencia_${Date.now()}`);
  const blob = Utilities.newBlob(
    Utilities.base64Decode(payload.data_base64),
    payload.mime_type || 'application/octet-stream',
    fileName
  );
  const file = folder.createFile(blob);
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) {
    // Some domains disable public sharing. The Drive URL is still recorded.
  }
  const id = Utilities.getUuid();
  appendByHeaders_(ss.getSheetByName('EVIDENCIAS'), HEADERS.EVIDENCIAS, {
    fecha_hora: payload.timestamp || now_(),
    id_evidencia: id,
    usuario: payload.usuario || '',
    nombre: payload.nombre || '',
    rol: payload.rol || '',
    unidad: payload.unidad || '',
    titulo: payload.titulo || '',
    nombre_archivo: fileName,
    tipo_mime: payload.mime_type || '',
    tamano_bytes: payload.size_bytes || '',
    file_id: file.getId(),
    url_drive: file.getUrl(),
    estado: 'guardado',
    observacion: payload.observacion || '',
    session_id: payload.session_id || ''
  });
  return { status: 'ok', saved_at: now_(), sheet: 'EVIDENCIAS', id, file_id: file.getId(), file_url: file.getUrl() };
}

function appendEvent_(payload) {
  const ss = getSpreadsheet_();
  ensureWorkbook_(ss);
  appendByHeaders_(ss.getSheetByName('EVENTOS'), HEADERS.EVENTOS, {
    fecha_hora: payload.timestamp || now_(),
    usuario: payload.usuario || '',
    nombre: payload.nombre || '',
    rol: payload.rol || '',
    evento: payload.evento || payload.kind || '',
    unidad: payload.unidad || '',
    recurso: payload.recurso || '',
    detalle: stringify_(payload.detalle || payload),
    origen_url: payload.origen_url || '',
    user_agent: payload.user_agent || '',
    session_id: payload.session_id || '',
    app_version: payload.app_version || APP.VERSION
  });
  return { status: 'ok', saved_at: now_(), sheet: 'EVENTOS' };
}

function appendError_(ss, payload) {
  appendByHeaders_(ss.getSheetByName('ERRORES'), HEADERS.ERRORES, {
    fecha_hora: now_(),
    usuario: payload.usuario || '',
    modulo: payload.modulo || '',
    mensaje_usuario: payload.mensaje_usuario || '',
    detalle_tecnico: payload.detalle_tecnico || '',
    payload: stringify_(payload),
    session_id: payload.session_id || ''
  });
  return { status: 'ok', saved_at: now_(), sheet: 'ERRORES' };
}

function listForums_(params) {
  const ss = getSpreadsheet_();
  ensureWorkbook_(ss);
  const limit = Math.max(1, Math.min(Number(params.limit || 100), 500));
  const unidad = String(params.unidad || '').trim();
  const rows = readObjects_(ss.getSheetByName('FOROS'))
    .filter(row => String(row.estado || 'publicado') !== 'anulado')
    .filter(row => !unidad || String(row.unidad || '') === unidad)
    .slice(-limit)
    .map(row => ({
      timestamp: row.fecha_hora || '',
      id: row.id || '',
      tipo: row.tipo || 'foro',
      canal: row.canal || '',
      usuario: row.usuario || '',
      nombre: row.nombre || '',
      rol: row.rol || '',
      unidad: row.unidad || '',
      recurso: row.recurso || '',
      titulo_recurso: row.titulo_recurso || '',
      mensaje: row.mensaje || '',
      parent_id: row.parent_id || '',
      estado: row.estado || 'publicado'
    }));
  return { status: 'ok', items: rows };
}

function getCalendar_() {
  const ss = getSpreadsheet_();
  ensureWorkbook_(ss);
  return readObjects_(ss.getSheetByName('CALENDARIO'))
    .filter(row => String(row.estado || 'activo').toLowerCase() === 'activo')
    .map(row => ({
      id: row.id || '',
      unit: row.unidad || '',
      type: row.tipo || '',
      title: row.titulo || '',
      start: normalizeDate_(row.fecha_inicio),
      due: normalizeDate_(row.fecha_vencimiento),
      resource: row.recurso || ''
    }));
}

function ensureWorkbook_(ss) {
  Object.keys(HEADERS).forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    const headers = HEADERS[name];
    const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    const needsHeader = headers.some((header, index) => current[index] !== header);
    if (needsHeader) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setFontColor('#ffffff')
      .setBackground(sheetColor_(name));
  });
}

function getSpreadsheet_() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  return SpreadsheetApp.openById(APP.SHEET_ID);
}

function seedConfig_(ss) {
  const sheet = ss.getSheetByName('CONFIG');
  if (sheet.getLastRow() > 1) return;
  const rows = [
    ['APP_NAME', APP.NAME, 'Nombre del aula', 'TRUE', now_()],
    ['APP_VERSION', APP.VERSION, 'Versión publicada', 'TRUE', now_()],
    ['SHEET_ID', APP.SHEET_ID, 'Libro de datos del aula', 'TRUE', now_()],
    ['DRIVE_FOLDER_ID', APP.DRIVE_FOLDER_ID, 'Carpeta para imágenes, fotos y evidencias', 'TRUE', now_()],
    ['PAGES_URL', APP.PAGES_URL, 'URL pública del aula', 'TRUE', now_()],
    ['PERMITIR_OFFLINE', 'TRUE', 'Permite cola local de sincronización', 'TRUE', now_()]
  ];
  sheet.getRange(2, 1, rows.length, HEADERS.CONFIG.length).setValues(rows);
}

function seedUsers_(ss) {
  const sheet = ss.getSheetByName('USUARIOS');
  if (sheet.getLastRow() > 1) return;
  const rows = [
    ['estudiante', sha256Hex_('r-salud'), 'Estudiante de prueba', '', 'estudiante', 'TRUE', now_(), '', 'Usuario demo'],
    ['docente', sha256Hex_('docente-r'), 'Docente demo', '', 'docente', 'TRUE', now_(), '', 'Usuario demo']
  ];
  sheet.getRange(2, 1, rows.length, HEADERS.USUARIOS.length).setValues(rows);
}

function seedCalendar_(ss) {
  const sheet = ss.getSheetByName('CALENDARIO');
  if (sheet.getLastRow() > 1) return;
  sheet.getRange(2, 1, DEFAULT_CALENDAR.length, HEADERS.CALENDARIO.length).setValues(DEFAULT_CALENDAR);
}

function readConfig_(ss) {
  const config = {};
  readObjects_(ss.getSheetByName('CONFIG')).forEach(row => {
    if (String(row.activo || '').toLowerCase() !== 'false') config[row.parametro] = row.valor;
  });
  return config;
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  return JSON.parse(e.postData.contents);
}

function readObjects_(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  return values.map((row, index) => objectFromRow_(headers, row, index + 2));
}

function objectFromRow_(headers, row, rowIndex) {
  const obj = { __row: rowIndex };
  headers.forEach((header, index) => obj[header] = row[index]);
  return obj;
}

function appendByHeaders_(sheet, headers, rowObject) {
  const row = headers.map(header => rowObject[header] !== undefined ? rowObject[header] : '');
  sheet.appendRow(row);
}

function logError_(usuario, modulo, mensajeUsuario, err, payload) {
  try {
    const ss = getSpreadsheet_();
    ensureWorkbook_(ss);
    appendByHeaders_(ss.getSheetByName('ERRORES'), HEADERS.ERRORES, {
      fecha_hora: now_(),
      usuario,
      modulo,
      mensaje_usuario: mensajeUsuario,
      detalle_tecnico: String(err && err.stack ? err.stack : err),
      payload: stringify_(payload || ''),
      session_id: payload && payload.session_id ? payload.session_id : ''
    });
  } catch (ignored) {
    // Avoid recursive failures.
  }
}

function jsonResponse(data, callback) {
  const json = JSON.stringify(data);
  const output = callback ? `${callback}(${json});` : json;
  return ContentService
    .createTextOutput(output)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function stringify_(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function now_() {
  return Utilities.formatDate(new Date(), APP.TZ, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function normalizeDate_(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, APP.TZ, 'yyyy-MM-dd');
  }
  return String(value).slice(0, 10);
}

function sanitizeFileName_(name) {
  return String(name).replace(/[\\/:*?"<>|#%{}~&]/g, '_').slice(0, 180);
}

function sha256Hex_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value));
  return bytes.map(byte => {
    const unsigned = byte < 0 ? byte + 256 : byte;
    return (`0${unsigned.toString(16)}`).slice(-2);
  }).join('');
}

function sheetColor_(name) {
  const colors = {
    CONFIG: '#0a3d2f',
    USUARIOS: '#116149',
    SESIONES: '#1d7a8c',
    PROGRESO: '#7c3aed',
    CALIFICACIONES: '#9a6a13',
    EVENTOS: '#374151',
    FOROS: '#2563eb',
    CALENDARIO: '#b45309',
    EVIDENCIAS: '#b42318',
    ERRORES: '#991b1b',
    VERSIONES: '#4b5563'
  };
  return colors[name] || '#374151';
}

function sendReminderEmails() {
  const ss = getSpreadsheet_();
  ensureWorkbook_(ss);
  const users = readObjects_(ss.getSheetByName('USUARIOS'))
    .filter(row => row.correo && String(row.activo || '').toLowerCase() !== 'false');
  const today = Utilities.formatDate(new Date(), APP.TZ, 'yyyy-MM-dd');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = Utilities.formatDate(tomorrow, APP.TZ, 'yyyy-MM-dd');
  const due = getCalendar_().filter(event => event.due === today || event.due === tomorrowISO);
  users.forEach(user => {
    due.forEach(event => {
      MailApp.sendEmail(
        user.correo,
        `R aplicado a la salud: ${event.title}`,
        `Hola ${user.nombre || user.usuario},\n\nRecordatorio del aula: ${event.title}\nVence: ${event.due}\n\nAula: ${APP.PAGES_URL}`
      );
      appendEvent_({ usuario: user.usuario, nombre: user.nombre, rol: user.rol, evento: 'recordatorio_email', unidad: event.unit, recurso: event.id, detalle: event.title });
    });
  });
}
