const APP = {
  NAME: 'Practica inicial - datos de salud en vivo',
  VERSION: '2026.05.27.1',
  SHEET_ID: '1PtQGtn_ex9ShQxu9p5YVXFFZd6FGz3N5aLjv9p9uoqY',
  TZ: 'America/Asuncion',
  RESPONSES: 'RESPUESTAS',
  LOG: 'LOG'
};

const HEADERS = [
  'id',
  'fecha_hora',
  'nombre',
  'usuario_aula',
  'correo',
  'fecha_nacimiento',
  'edad',
  'sexo',
  'semestre',
  'turno',
  'estatura_cm',
  'peso_kg',
  'imc',
  'categoria_imc',
  'presion_sistolica',
  'presion_diastolica',
  'frecuencia_cardiaca',
  'glucosa_mg_dl',
  'actividad_fisica',
  'horas_sueno',
  'fuma',
  'objetivo',
  'consentimiento',
  'origen_url',
  'user_agent'
];

const LOG_HEADERS = ['fecha_hora', 'accion', 'detalle', 'origen_url', 'user_agent'];

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  try {
    const action = String(params.action || 'ping').toLowerCase();
    if (action === 'setup') return jsonResponse_(setup_(), params.callback);
    if (action === 'save') return jsonResponse_(saveFromParams_(params), params.callback);
    if (action === 'list') return jsonResponse_(list_(params), params.callback);
    if (action === 'stats') return jsonResponse_(stats_(), params.callback);
    return jsonResponse_(appStatus(), params.callback);
  } catch (err) {
    log_('error', String(err && err.stack ? err.stack : err), params);
    return jsonResponse_({ status: 'error', message: String(err && err.message ? err.message : err) }, params.callback);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData && e.postData.contents ? e.postData.contents : '{}');
    return jsonResponse_(save_(payload));
  } catch (err) {
    log_('post_error', String(err && err.stack ? err.stack : err), {});
    return jsonResponse_({ status: 'error', message: String(err && err.message ? err.message : err) });
  }
}

function setupWorkbook() {
  return setup_();
}

function appStatus() {
  return {
    status: 'ok',
    app: APP.NAME,
    version: APP.VERSION,
    sheet_id: APP.SHEET_ID,
    updated_at: now_()
  };
}

function setup_() {
  const ss = SpreadsheetApp.openById(APP.SHEET_ID);
  ensureSheet_(ss, APP.RESPONSES, HEADERS, '#0e5a6b');
  ensureSheet_(ss, APP.LOG, LOG_HEADERS, '#475569');
  log_('setup', 'Estructura verificada', {});
  return { status: 'ok', app: APP, sheets: [APP.RESPONSES, APP.LOG] };
}

function saveFromParams_(params) {
  if (!params.payload) throw new Error('missing_payload');
  const text = Utilities.newBlob(Utilities.base64Decode(params.payload)).getDataAsString('UTF-8');
  return save_(JSON.parse(text));
}

function save_(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    const ss = SpreadsheetApp.openById(APP.SHEET_ID);
    setup_();
    const sheet = ss.getSheetByName(APP.RESPONSES);
    const row = normalize_(payload);
    sheet.appendRow(HEADERS.map(header => row[header] !== undefined ? row[header] : ''));
    const count = Math.max(0, sheet.getLastRow() - 1);
    log_('save', row.id || '', payload);
    return { status: 'ok', saved_at: now_(), id: row.id, count };
  } finally {
    lock.releaseLock();
  }
}

function list_(params) {
  const ss = SpreadsheetApp.openById(APP.SHEET_ID);
  setup_();
  const limit = Math.max(1, Math.min(Number(params.limit || 1000), 3000));
  const rows = readRows_(ss.getSheetByName(APP.RESPONSES)).slice(-limit);
  return { status: 'ok', count: rows.length, items: rows };
}

function stats_() {
  const items = list_({ limit: 3000 }).items;
  const imc = numeric_(items.map(row => row.imc));
  const edad = numeric_(items.map(row => row.edad));
  return {
    status: 'ok',
    count: items.length,
    imc_mean: mean_(imc),
    edad_mean: mean_(edad),
    updated_at: now_()
  };
}

function normalize_(payload) {
  const row = {};
  HEADERS.forEach(header => row[header] = payload[header] || '');
  row.id = row.id || Utilities.getUuid();
  row.fecha_hora = row.fecha_hora || now_();
  row.edad = row.edad || age_(row.fecha_nacimiento);
  row.imc = row.imc || bmi_(row.peso_kg, row.estatura_cm);
  row.categoria_imc = row.categoria_imc || bmiCategory_(row.imc);
  row.consentimiento = row.consentimiento || 'Si';
  row.estatura_cm = numberOrBlank_(row.estatura_cm);
  row.peso_kg = numberOrBlank_(row.peso_kg);
  row.imc = numberOrBlank_(row.imc);
  row.presion_sistolica = numberOrBlank_(row.presion_sistolica);
  row.presion_diastolica = numberOrBlank_(row.presion_diastolica);
  row.frecuencia_cardiaca = numberOrBlank_(row.frecuencia_cardiaca);
  row.glucosa_mg_dl = numberOrBlank_(row.glucosa_mg_dl);
  row.horas_sueno = numberOrBlank_(row.horas_sueno);
  return row;
}

function ensureSheet_(ss, name, headers, color) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeader = headers.some((header, index) => current[index] !== header);
  if (needsHeader) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setFontColor('#ffffff')
    .setBackground(color);
  sheet.autoResizeColumns(1, headers.length);
}

function readRows_(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  return values.map(row => {
    const item = {};
    headers.forEach((header, index) => {
      const value = row[index];
      item[header] = value instanceof Date ? Utilities.formatDate(value, APP.TZ, "yyyy-MM-dd'T'HH:mm:ssXXX") : value;
    });
    return item;
  });
}

function log_(action, detail, payload) {
  try {
    const ss = SpreadsheetApp.openById(APP.SHEET_ID);
    ensureSheet_(ss, APP.LOG, LOG_HEADERS, '#475569');
    ss.getSheetByName(APP.LOG).appendRow([
      now_(),
      action,
      detail,
      payload && payload.origen_url ? payload.origen_url : '',
      payload && payload.user_agent ? payload.user_agent : ''
    ]);
  } catch (ignored) {
    // Avoid recursive errors.
  }
}

function jsonResponse_(data, callback) {
  const json = JSON.stringify(data);
  const safeCallback = callback && /^[\w.$]+$/.test(callback) ? callback : '';
  const output = safeCallback ? `${safeCallback}(${json});` : json;
  return ContentService
    .createTextOutput(output)
    .setMimeType(safeCallback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function now_() {
  return Utilities.formatDate(new Date(), APP.TZ, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function age_(dateText) {
  if (!dateText) return '';
  const birth = new Date(dateText);
  if (isNaN(birth.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function bmi_(weight, height) {
  const w = Number(weight);
  const h = Number(height);
  if (!w || !h) return '';
  return Math.round((w / Math.pow(h / 100, 2)) * 10) / 10;
}

function bmiCategory_(imc) {
  const value = Number(imc);
  if (!value) return '';
  if (value < 18.5) return 'Bajo peso';
  if (value < 25) return 'Normal';
  if (value < 30) return 'Sobrepeso';
  return 'Obesidad';
}

function numberOrBlank_(value) {
  const n = Number(value);
  return isFinite(n) && value !== '' ? n : '';
}

function numeric_(values) {
  return values.map(Number).filter(value => isFinite(value));
}

function mean_(values) {
  return values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : 0;
}
