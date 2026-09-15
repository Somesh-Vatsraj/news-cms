import { ok, fail } from '../utils/response.js';
import { readJson } from '../utils/validation.js';
import { requireAdmin, requireAdminOnly } from '../middleware/auth.js';

export async function list(request, env) {
  const rows = await env.DB.prepare(`SELECT setting_key, setting_value FROM settings`).all();
  const settings = {};
  for (const r of rows.results) settings[r.setting_key] = r.setting_value;
  return ok({ settings });
}

export async function update(request, env) {
  const auth = await requireAdminOnly(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  if (!b || typeof b !== 'object') return fail('Invalid payload', 400);
  const keys = Object.keys(b);
  if (!keys.length) return ok({}, 'Nothing to update');

  const stmt = env.DB.prepare(
    `INSERT INTO settings (setting_key, setting_value, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = datetime('now')`
  );
  const batch = keys.map(k => stmt.bind(k, String(b[k] ?? '')));
  await env.DB.batch(batch);
  await env.DB.prepare(
    `INSERT INTO activity_logs (user_id, action, entity_type) VALUES (?, 'update_settings', 'settings')`
  ).bind(auth.user.id).run();
  return ok({}, 'Settings saved');
}

/** Raw helper for HTML routes to load settings map. */
export async function loadSettingsMap(env) {
  const rows = await env.DB.prepare(`SELECT setting_key, setting_value FROM settings`).all();
  const map = {};
  for (const r of rows.results) map[r.setting_key] = r.setting_value;
  return map;
}
