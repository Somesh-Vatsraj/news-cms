/**
 * Tiny path matcher. Supports :param segments.
 * match('/news/:slug', '/news/hello') -> { slug: 'hello' }
 */
export function match(pattern, path) {
  const pParts = pattern.split('/').filter(Boolean);
  const uParts = path.split('/').filter(Boolean);
  if (pParts.length !== uParts.length) return null;
  const params = {};
  for (let i = 0; i < pParts.length; i++) {
    const p = pParts[i];
    if (p.startsWith(':')) params[p.slice(1)] = decodeURIComponent(uParts[i]);
    else if (p !== uParts[i]) return null;
  }
  return params;
}

export function createRouter() {
  const routes = [];
  const add = (method, pattern, handler) => routes.push({ method, pattern, handler });
  return {
    get: (p, h) => add('GET', p, h),
    post: (p, h) => add('POST', p, h),
    put: (p, h) => add('PUT', p, h),
    delete: (p, h) => add('DELETE', p, h),
    find(method, path) {
      for (const r of routes) {
        if (r.method !== method) continue;
        const params = match(r.pattern, path);
        if (params) return { handler: r.handler, params };
      }
      return null;
    }
  };
}
