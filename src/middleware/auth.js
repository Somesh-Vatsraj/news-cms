import { sha256Hex } from '../utils/crypto.js';
import { fail } from '../utils/response.js';

const COOKIE_NAME = 'nh_session';

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach(p => {
    const idx = p.indexOf('=');
    if (idx > -1) out[p.slice(0, idx).trim()] = decodeURIComponent(p.slice(idx + 1).trim());
  });
  return out;
}

export function getSessionToken(request) {
  return parseCookies(request.headers.get('Cookie') || '')[COOKIE_NAME] || null;
}

export const SESSION_COOKIE = COOKIE_NAME;

export async function getCurrentUser(request, env) {
  const token = getSessionToken(request);
  if (!token) return null;
  const tokenHash = await sha256Hex(token);
  const row = await env.DB.prepare(
    `SELECT s.id AS session_id, s.expires_at,
            u.id, u.name, u.email, u.role, u.avatar, u.status
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? LIMIT 1`
  ).bind(tokenHash).first();
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await env.DB.prepare(`DELETE FROM sessions WHERE id = ?`).bind(row.session_id).run();
    return null;
  }
  if (row.status !== 'active') return null;
  return {
    id: row.id, name: row.name, email: row.email,
    role: row.role, avatar: row.avatar, sessionId: row.session_id
  };
}

export async function requireUser(request, env) {
  const user = await getCurrentUser(request, env);
  if (!user) return { error: fail('Authentication required', 401) };
  return { user };
}

export async function requireAdmin(request, env) {
  const user = await getCurrentUser(request, env);
  if (!user) return { error: fail('Authentication required', 401) };
  if (user.role !== 'admin' && user.role !== 'editor') return { error: fail('Forbidden', 403) };
  return { user };
}

export async function requireAdminOnly(request, env) {
  const user = await getCurrentUser(request, env);
  if (!user) return { error: fail('Authentication required', 401) };
  if (user.role !== 'admin') return { error: fail('Forbidden', 403) };
  return { user };
}
