// FILE: src/api/auth.js
import { hashPassword, verifyPassword, randomToken, sha256Hex } from '../utils/crypto.js';
import { ok, fail } from '../utils/response.js';
import { readJson, isEmail, requireFields } from '../utils/validation.js';
import { getCurrentUser, SESSION_COOKIE } from '../middleware/auth.js';

const SESSION_DAYS = 30;

async function createSession(env, userId) {
  const token = randomToken(32);
  const tokenHash = await sha256Hex(token);
  const expires = new Date(Date.now() + SESSION_DAYS * 86400 * 1000).toISOString();
  await env.DB.prepare(
    `INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)`
  ).bind(userId, tokenHash, expires).run();
  return { token, expires };
}

function attachCookie(response, token) {
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    `Max-Age=${SESSION_DAYS * 86400}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax'
  ];
  response.headers.append('Set-Cookie', parts.join('; '));
  return response;
}

export async function login(request, env) {
  const body = await readJson(request);
  const missing = requireFields(body, ['email', 'password']);
  if (missing.length) return fail('Email and password are required.', 400);
  if (!isEmail(body.email)) return fail('Invalid email address.', 400);

  const user = await env.DB.prepare(
    `SELECT id, name, email, password_hash, role, status FROM users WHERE email = ? LIMIT 1`
  ).bind(body.email.toLowerCase()).first();
  if (!user) return fail('Invalid credentials.', 401);
  if (user.status !== 'active') return fail('Account suspended.', 403);

  const okPw = await verifyPassword(body.password, user.password_hash);
  if (!okPw) return fail('Invalid credentials.', 401);

  const { token } = await createSession(env, user.id);

  await env.DB.prepare(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, ip_address, user_agent)
     VALUES (?, 'login', 'user', ?, ?, ?)`
  ).bind(user.id, user.id,
    request.headers.get('CF-Connecting-IP') || '',
    request.headers.get('User-Agent') || '').run();

  const res = ok({
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  }, 'Login successful');
  return attachCookie(res, token);
}

export async function logout(request, env) {
  const user = await getCurrentUser(request, env);
  if (user) {
    await env.DB.prepare(`DELETE FROM sessions WHERE id = ?`).bind(user.sessionId).run();
    await env.DB.prepare(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, ip_address, user_agent)
       VALUES (?, 'logout', 'user', ?, ?, ?)`
    ).bind(user.id, user.id,
      request.headers.get('CF-Connecting-IP') || '',
      request.headers.get('User-Agent') || '').run();
  }
  const res = ok({}, 'Logged out');
  res.headers.append('Set-Cookie',
    `${SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`);
  return res;
}

export async function me(request, env) {
  const user = await getCurrentUser(request, env);
  if (!user) return ok({ user: null });
  return ok({ user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
}

export async function register(request, env) {
  const body = await readJson(request);
  const missing = requireFields(body, ['name', 'email', 'password']);
  if (missing.length) return fail('Missing required fields.', 400);
  if (!isEmail(body.email)) return fail('Invalid email.', 400);
  if (String(body.password).length < 6) return fail('Password must be at least 6 characters.', 400);

  const regEnabled = await env.DB.prepare(
    `SELECT setting_value FROM settings WHERE setting_key = 'registration_enabled' LIMIT 1`
  ).first();
  if (regEnabled && regEnabled.setting_value === '0') return fail('Registration is disabled.', 403);

  const exists = await env.DB.prepare(`SELECT id FROM users WHERE email = ? LIMIT 1`).bind(body.email.toLowerCase()).first();
  if (exists) return fail('Email already registered.', 409);

  const hash = await hashPassword(body.password);
  const res = await env.DB.prepare(
    `INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, 'user', 'active')`
  ).bind(body.name, body.email.toLowerCase(), hash).run();

  const userId = res.meta.last_row_id;
  const { token } = await createSession(env, userId);
  const response = ok({ user: { id: userId, name: body.name, email: body.email, role: 'user' } }, 'Registered');
  return attachCookie(response, token);
}

export async function changePassword(request, env) {
  const user = await getCurrentUser(request, env);
  if (!user) return fail('Authentication required', 401);
  const body = await readJson(request);
  const missing = requireFields(body, ['currentPassword', 'newPassword']);
  if (missing.length) return fail('Missing required fields.', 400);
  if (String(body.newPassword).length < 6) return fail('New password must be at least 6 characters.', 400);

  const row = await env.DB.prepare(`SELECT password_hash FROM users WHERE id = ?`).bind(user.id).first();
  const okPw = await verifyPassword(body.currentPassword, row.password_hash);
  if (!okPw) return fail('Current password is incorrect.', 400);

  const newHash = await hashPassword(body.newPassword);
  await env.DB.prepare(
    `UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?`
  ).bind(newHash, user.id).run();

  await env.DB.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(user.id).run();

  const res = ok({}, 'Password updated. Please log in again.');
  res.headers.append('Set-Cookie', `${SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`);
  return res;
}

export async function updateProfile(request, env) {
  const user = await getCurrentUser(request, env);
  if (!user) return fail('Authentication required', 401);
  const body = await readJson(request);
  const name = (body.name || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const avatar = (body.avatar || '').trim();
  if (!name) return fail('Name is required.', 400);
  if (!isEmail(email)) return fail('Valid email is required.', 400);

  const conflict = await env.DB.prepare(`SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1`).bind(email, user.id).first();
  if (conflict) return fail('Email already in use.', 409);

  await env.DB.prepare(
    `UPDATE users SET name = ?, email = ?, avatar = ?, updated_at = datetime('now') WHERE id = ?`
  ).bind(name, email, avatar, user.id).run();
  return ok({}, 'Profile updated');
}

export async function setupStatus(request, env) {
  const admin = await env.DB.prepare(`SELECT id FROM users WHERE role = 'admin' LIMIT 1`).first();
  return ok({ needsSetup: !admin });
}

export async function setup(request, env) {
  const admin = await env.DB.prepare(`SELECT id FROM users WHERE role = 'admin' LIMIT 1`).first();
  if (admin) return fail('Setup already completed.', 403);

  const body = await readJson(request);
  const missing = requireFields(body, ['name', 'email', 'password', 'confirmPassword']);
  if (missing.length) return fail('All fields are required.', 400);
  if (!isEmail(body.email)) return fail('Invalid email.', 400);
  if (body.password.length < 8) return fail('Password must be at least 8 characters.', 400);
  if (body.password !== body.confirmPassword) return fail('Passwords do not match.', 400);

  const hash = await hashPassword(body.password);
  const res = await env.DB.prepare(
    `INSERT INTO users (name, email, password_hash, role, status)
     VALUES (?, ?, ?, 'admin', 'active')`
  ).bind(body.name, body.email.toLowerCase(), hash).run();

  const userId = res.meta.last_row_id;
  const { token } = await createSession(env, userId);
  const response = ok({ user: { id: userId, name: body.name, email: body.email, role: 'admin' } }, 'Admin created');
  return attachCookie(response, token);
}
