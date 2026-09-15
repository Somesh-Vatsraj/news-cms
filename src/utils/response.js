export function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('x-content-type-options', 'nosniff');
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function ok(data = {}, message = 'OK') {
  return json({ success: true, message, data });
}

export function fail(message = 'Error', status = 400, extra = {}) {
  return json({ success: false, message, ...extra }, { status });
}

export function html(content, status = 200, extraHeaders = {}) {
  const headers = new Headers(extraHeaders);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  return new Response(content, { status, headers });
}

export function text(content, contentType = 'text/plain; charset=utf-8', status = 200) {
  return new Response(content, { status, headers: { 'content-type': contentType } });
}

export function redirect(location, status = 302) {
  return new Response(null, { status, headers: { location } });
}

export function setCookie(res, name, value, options = {}) {
  const parts = [`${name}=${value}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly !== false) parts.push('HttpOnly');
  if (options.secure !== false) parts.push('Secure');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  res.headers.append('Set-Cookie', parts.join('; '));
  return res;
}
