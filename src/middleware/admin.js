import { getCurrentUser } from './auth.js';
import { redirect } from '../utils/response.js';

/** Guard for /admin/* HTML routes. Redirects to login when not allowed. */
export async function guardAdminHtml(request, env, allowRoles = ['admin','editor','author']) {
  const url = new URL(request.url);
  const user = await getCurrentUser(request, env);
  if (!user || !allowRoles.includes(user.role)) {
    return { redirectTo: `/admin/login?next=${encodeURIComponent(url.pathname + url.search)}` };
  }
  return { user };
}

export function redirectToLogin(pathWithQuery) {
  return redirect(`/admin/login?next=${encodeURIComponent(pathWithQuery)}`, 302);
}
