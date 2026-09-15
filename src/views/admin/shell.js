import { escapeHtml } from '../../utils/sanitize.js';

const MENU = [
  { group: 'Main', items: [
    { href: '/admin', label: 'Dashboard', icon: 'M3 12L12 3l9 9M5 10v10h14V10' },
  ]},
  { group: 'Content', items: [
    { href: '/admin/news', label: 'News', icon: 'M4 4h16v16H4zM8 8h8M8 12h8M8 16h4' },
    { href: '/admin/categories', label: 'Categories', icon: 'M4 6h16M4 12h16M4 18h10' },
    { href: '/admin/authors', label: 'Authors', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M22 12a4 4 0 0 0-8 0M9 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8z' },
    { href: '/admin/media', label: 'Media', icon: 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 15l5-5 6 6M14 14l3-3 4 4' },
  ]},
  { group: 'Community', items: [
    { href: '/admin/users', label: 'Users', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 22a8 8 0 1 1 16 0' },
    { href: '/admin/comments', label: 'Comments', icon: 'M21 11.5a8.38 8.38 0 0 1-4.5 7.5A8.5 8.5 0 0 1 4 19l-1 1 1.5-4A8.5 8.5 0 1 1 21 11.5z' },
  ]},
  { group: 'Monetization', items: [
    { href: '/admin/advertisements', label: 'Advertisements', icon: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' },
  ]},
  { group: 'Website', items: [
    { href: '/admin/pages', label: 'Pages', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8' },
    { href: '/admin/navigation', label: 'Navigation', icon: 'M4 6h16M4 12h16M4 18h10' },
    { href: '/admin/seo', label: 'SEO', icon: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35' },
    { href: '/admin/settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
  ]},
];

export function renderAdminShell({ user, title, content, path }) {
  const sidebar = MENU.map(group => `
    <div class="nav-group">
      <h5>${group.group}</h5>
      ${group.items.map(it => `
        <a href="${it.href}" class="${path === it.href || (it.href !== '/admin' && path.startsWith(it.href)) ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${it.icon}"/></svg>
          ${it.label}
        </a>
      `).join('')}
    </div>
  `).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>${escapeHtml(title)} — Admin</title>
  <link rel="stylesheet" href="/css/admin.css">
</head>
<body>
  <div id="toastWrap" class="toast-wrap"></div>
  <div class="mobile-drawer-backdrop" id="mobBackdrop"></div>
  <div class="layout">
    <aside class="sidebar" id="adminSidebar">
      <div class="logo"><span class="logo-mark">N</span> NewsHub Admin</div>
      ${sidebar}
    </aside>
    <main class="main">
      <div class="topbar">
        <div style="display:flex;align-items:center;gap:12px">
          <button class="mobile-menu-btn" id="mobToggle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <h2>${escapeHtml(title)}</h2>
        </div>
        <div class="user">
          <a href="/" target="_blank" class="btn btn-outline btn-sm">View Site</a>
          <div class="avatar">${user.avatar ? `<img src="${escapeHtml(user.avatar)}" alt="">` : escapeHtml(user.name[0] || 'A')}</div>
          <div style="line-height:1.2">
            <div style="font-weight:600">${escapeHtml(user.name)}</div>
            <div style="color:var(--muted);font-size:11px;text-transform:uppercase">${escapeHtml(user.role)}</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="logout()">Logout</button>
        </div>
      </div>
      <div class="content">${content}</div>
    </main>
  </div>
  <div class="modal-backdrop" id="modalBackdrop">
    <div class="modal" id="modalBody"></div>
  </div>
  <script src="/js/admin.js"></script>
</body>
</html>`;
}
