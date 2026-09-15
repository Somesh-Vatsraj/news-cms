import { ok, fail } from '../utils/response.js';
import { readJson, parseIntSafe, isEmail } from '../utils/validation.js';
import { hashPassword } from '../utils/crypto.js';
import { requireAdmin, requireAdminOnly } from '../middleware/auth.js';

export async function list(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim();
  const limit = Math.min(parseIntSafe(url.searchParams.get('limit'), 30), 100);
  const page = Math.max(parseIntSafe(url.searchParams.get('page'), 1), 1);
  const offset = (page - 1) * limit;

  const where = ['1=1']; const params = [];
  if (q) { where.push(`(name LIKE ? OR email LIKE ?)`); params.push(`%${q}%`, `%${q}%`); }

  const rows = await env.DB.prepare(
    `SELECT id, name, email, role, avatar, status, created_at FROM users
     WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).bind(...params, limit, offset).all();
  const total = await env.DB.prepare(`SELECT COUNT(*) AS c FROM users WHERE ${where.join(' AND ')}`).bind(...params).first();
  return ok({ items: rows.results, total: total.c, page, limit, totalPages: Math.ceil(total.c/limit) });
}

export async function create(request, env) {
  const auth = await requireAdminOnly(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  if (!b.name || !b.email || !b.password) return fail('Name, email and password are required.', 400);
  if (!isEmail(b.email)) return fail('Invalid email.', 400);
  if (b.password.length < 6) return fail('Password must be at least 6 characters.', 400);
  const exists = await env.DB.prepare(`SELECT id FROM users WHERE email = ? LIMIT 1`).bind(b.email.toLowerCase()).first();
  if (exists) return fail('Email already exists.', 409);
  const hash = await hashPassword(b.password);
  const role = ['admin','editor','author','user'].includes(b.role) ? b.role : 'user';
  const res = await env.DB.prepare(
    `INSERT INTO users (name, email, password_hash, role, avatar, status) VALUES (?,?,?,?,?,?)`
  ).bind(b.name, b.email.toLowerCase(), hash, role, b.avatar || '', 'active').run();
  return ok({ id: res.meta.last_row_id }, 'User created');
}

export async function update(request, env, id) {
  const auth = await requireAdminOnly(request, env);
  if (auth.error) return auth.error;
  const b = await readJson(request);
  const row = await env.DB.prepare(`SELECT id, name, email, role, status, avatar FROM users WHERE id = ?`).bind(id).first();
  if (!row) return fail('Not found', 404);

  // Only admins can change roles; cannot demote yourself from admin if you're the last one
  let role = row.role;
  if (b.role && ['admin','editor','author','user'].includes(b.role)) role = b.role;
  if (row.role === 'admin' && role !== 'admin') {
    const adminCount = await env.DB.prepare(`SELECT COUNT(*) AS c FROM users WHERE role='admin' AND status='active'`).first();
    if (adminCount.c <= 1) return fail('Cannot demote the last admin.', 400);
  }

  const status = ['active','suspended'].includes(b.status) ? b.status : row.status;
  let newPasswordHash = null;
  if (b.password) {
    if (b.password.length < 6) return fail('Password must be at least 6 characters.', 400);
    newPasswordHash = await hashPassword(b.password);
  }
  if (newPasswordHash) {
    await env.DB.prepare(`UPDATE users SET name=?, email=?, role=?, status=?, avatar=?, password_hash=?, updated_at=datetime('now') WHERE id=?`)
      .bind(b.name ?? row.name, (b.email ?? row.email).toLowerCase(), role, status, b.avatar ?? row.avatar, newPasswordHash, id).run();
    await env.DB.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(id).run();
  } else {
    await env.DB.prepare(`UPDATE users SET name=?, email=?, role=?, status=?, avatar=?, updated_at=datetime('now') WHERE id=?`)
      .bind(b.name ?? row.name, (b.email ?? row.email).toLowerCase(), role, status, b.avatar ?? row.avatar, id).run();
  }
  return ok({}, 'User updated');
}

export async function remove(request, env, id) {
  const auth = await requireAdminOnly(request, env);
  if (auth.error) return auth.error;
  if (Number(id) === auth.user.id) return fail('You cannot delete your own account.', 400);
  const row = await env.DB.prepare(`SELECT role FROM users WHERE id = ?`).bind(id).first();
  if (row?.role === 'admin') {
    const c = await env.DB.prepare(`SELECT COUNT(*) AS c FROM users WHERE role='admin' AND status='active'`).first();
    if (c.c <= 1) return fail('Cannot delete the last admin.', 400);
  }
  await env.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(id).run();
  return ok({}, 'User deleted');
}
