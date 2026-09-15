import { ok, fail } from '../utils/response.js';
import { readJson, isEmail } from '../utils/validation.js';
import { requireAdmin } from '../middleware/auth.js';

export async function subscribe(request, env) {
  const b = await readJson(request);
  if (!isEmail(b.email)) return fail('Valid email required.', 400);
  try {
    await env.DB.prepare(`INSERT INTO newsletter (email) VALUES (?)`).bind(b.email.toLowerCase()).run();
  } catch {
    return ok({}, 'Already subscribed');
  }
  return ok({}, 'Subscribed');
}

export async function list(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const rows = await env.DB.prepare(`SELECT * FROM newsletter ORDER BY created_at DESC LIMIT 500`).all();
  return ok({ items: rows.results });
}

export async function remove(request, env, id) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  await env.DB.prepare(`DELETE FROM newsletter WHERE id = ?`).bind(id).run();
  return ok({}, 'Subscriber removed');
}
