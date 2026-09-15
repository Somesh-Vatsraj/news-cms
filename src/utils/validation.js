export function isEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function isUrl(s) {
  if (!s) return true;
  try { new URL(s); return true; } catch { return false; }
}

export function requireFields(obj, fields) {
  const missing = [];
  for (const f of fields) {
    const v = obj?.[f];
    if (v === undefined || v === null || String(v).trim() === '') missing.push(f);
  }
  return missing;
}

export function parseIntSafe(v, def = 0) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
}

export function readJson(request) {
  return request.json().catch(() => ({}));
}

export function readForm(request) {
  return request.formData().catch(() => new FormData());
}
