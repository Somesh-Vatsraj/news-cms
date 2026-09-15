// Minimal but effective HTML sanitizer for stored rich text.
// Removes <script>, <iframe>, style/on* attributes, javascript: URLs.

const ALLOWED_TAGS = new Set([
  'p','br','strong','b','em','i','u','s','blockquote','code','pre',
  'h1','h2','h3','h4','h5','h6','ul','ol','li','a','img','figure','figcaption',
  'hr','table','thead','tbody','tr','th','td','span','div'
]);

const ALLOWED_ATTRS = {
  a: ['href','title','target','rel'],
  img: ['src','alt','title','width','height','loading'],
  '*': ['class']
};

export function sanitizeHtml(input) {
  if (!input) return '';
  let s = String(input);
  // Drop dangerous blocks entirely
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
  s = s.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
  s = s.replace(/<object[\s\S]*?<\/object>/gi, '');
  s = s.replace(/<embed[^>]*>/gi, '');

  // Clean tags
  s = s.replace(/<\/?([a-zA-Z0-9-]+)([^>]*)>/g, (m, tag, attrs) => {
    const t = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(t)) return '';
    if (m.startsWith('</')) return `</${t}>`;
    const safeAttrs = [];
    const allowed = new Set([...(ALLOWED_ATTRS[t] || []), ...(ALLOWED_ATTRS['*'] || [])]);
    const re = /([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
    let mm;
    while ((mm = re.exec(attrs))) {
      const name = mm[1].toLowerCase();
      let value = mm[2] ?? mm[3] ?? mm[4] ?? '';
      if (name.startsWith('on')) continue;
      if (!allowed.has(name)) continue;
      if ((name === 'href' || name === 'src') && /^\s*javascript:/i.test(value)) continue;
      if ((name === 'href' || name === 'src') && /^\s*data:/i.test(value) && !/^data:image\//i.test(value)) continue;
      value = value.replace(/"/g, '&quot;').replace(/</g, '&lt;');
      safeAttrs.push(`${name}="${value}"`);
    }
    return `<${t}${safeAttrs.length ? ' ' + safeAttrs.join(' ') : ''}>`;
  });
  return s;
}

export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
