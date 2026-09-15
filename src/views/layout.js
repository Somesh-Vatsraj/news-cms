import { escapeHtml } from '../utils/sanitize.js';

export function renderPublicLayout({ settings, navItems, adsByPosition, body, title, meta = {}, path = '/' }) {
  const s = settings || {};
  const primary = s.primary_color || '#8b5cf6';
  const secondary = s.secondary_color || '#a855f7';
  const siteName = s.site_name || 'NewsHub';
  const tagline = s.tagline || '';

  const pageTitle = title ? `${title} — ${siteName}` : (s.seo_title || siteName);
  const description = meta.description || s.seo_description || '';
  const canonical = meta.canonical || (s.canonical_url || '') + path;
  const ogImage = meta.image || s.og_image || '';

  const nav = (navItems || []).filter(n => n.status === 'active').map(n =>
    `<a href="${escapeHtml(n.url)}"${path === n.url ? ' style="color:var(--primary-dark)"' : ''}>${escapeHtml(n.title)}</a>`
  ).join('');

  const drawerNav = (navItems || []).filter(n => n.status === 'active').map(n =>
    `<a href="${escapeHtml(n.url)}">${escapeHtml(n.title)}</a>`
  ).join('');

  // Breaking bar
  const breaking = (adsByPosition && adsByPosition._breaking) || [];
  const breakingBar = (s.breaking_enabled === '1' && breaking.length)
    ? `<div class="breaking-bar">
         <div class="container breaking-inner">
           <span class="breaking-label">BREAKING</span>
           <div class="breaking-scroll"><div class="breaking-track">
             ${breaking.concat(breaking).map(n => `<a href="/news/${escapeHtml(n.slug)}">${escapeHtml(n.title)}</a>`).join('')}
           </div></div>
         </div>
       </div>` : '';

  // Social
  const socials = ['facebook','instagram','youtube','twitter','telegram','whatsapp']
    .filter(k => s[k])
    .map(k => `<a href="${escapeHtml(s[k])}" target="_blank" rel="noopener" aria-label="${k}">${k[0].toUpperCase()}</a>`)
    .join('');

  const categoryLinks = (adsByPosition && adsByPosition._categories) || [];
  const catLinks = categoryLinks.map(c => `<a href="/category/${escapeHtml(c.slug)}">${escapeHtml(c.name)}</a>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  ${meta.keywords ? `<meta name="keywords" content="${escapeHtml(meta.keywords)}">` : ''}
  ${canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : ''}
  <meta property="og:title" content="${escapeHtml(meta.ogTitle || pageTitle)}">
  <meta property="og:description" content="${escapeHtml(meta.ogDescription || description)}">
  ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}">` : ''}
  <meta property="og:type" content="${meta.type || 'website'}">
  <meta name="twitter:card" content="${escapeHtml(s.twitter_card || 'summary_large_image')}">
  ${s.favicon ? `<link rel="icon" href="${escapeHtml(s.favicon)}">` : ''}
  <style>:root{--primary:${primary};--primary-dark:${primary};--secondary:${secondary}}</style>
  <link rel="stylesheet" href="/css/main.css">
  ${meta.jsonLd ? `<script type="application/ld+json">${meta.jsonLd}</script>` : ''}
</head>
<body>
  <div id="toastWrap" class="toast-wrap"></div>
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="logo">
        <span class="logo-mark">${s.logo ? `<img src="${escapeHtml(s.logo)}" alt="" style="width:100%;height:100%;border-radius:10px;object-fit:cover">` : siteName[0]}</span>
        <span>${escapeHtml(siteName)}</span>
      </a>
      <nav class="nav">${nav}</nav>
      <div class="header-actions">
        <button class="icon-btn" id="openSearch" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
        </button>
        <button class="icon-btn" onclick="toggleDark()" aria-label="Toggle dark mode">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <a href="/admin/login" class="btn btn-outline btn-sm">Admin</a>
        <button class="icon-btn mobile-toggle" id="mobileToggle" aria-label="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
    </div>
  </header>
  ${breakingBar}
  ${body}
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo"><span class="logo-mark">${siteName[0]}</span>${escapeHtml(siteName)}</div>
          <p>${escapeHtml(s.site_description || tagline)}</p>
          <div class="footer-social">${socials}</div>
        </div>
        <div><h4>Quick Links</h4>
          <a href="/">Home</a><a href="/search">Search</a>
          <a href="/page/about-us">About</a><a href="/page/contact-us">Contact</a>
        </div>
        <div><h4>Categories</h4>${catLinks || '<a href="/">News</a>'}</div>
        <div><h4>Legal</h4>
          <a href="/page/privacy-policy">Privacy Policy</a>
          <a href="/page/terms-conditions">Terms & Conditions</a>
          <a href="/page/disclaimer">Disclaimer</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>${escapeHtml(s.copyright || `© ${new Date().getFullYear()} ${siteName}`)}</span>
        <span>Contact: ${escapeHtml(s.contact_email || '')}</span>
      </div>
    </div>
  </footer>
  <div class="drawer-backdrop" id="drawerBackdrop"></div>
  <aside class="drawer" id="mobileDrawer">
    <div class="drawer-head">
      <div class="logo"><span class="logo-mark">${siteName[0]}</span>${escapeHtml(siteName)}</div>
      <button class="icon-btn" id="closeDrawer" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <nav>${drawerNav}</nav>
  </aside>
  <script src="/js/app.js"></script>
</body>
</html>`;
}
