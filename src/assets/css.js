export const PUBLIC_CSS = `
:root{
  --primary:#8b5cf6;--primary-dark:#7c3aed;--secondary:#a855f7;
  --light-purple:#f3e8ff;--background:#faf5ff;--white:#ffffff;
  --text:#18181b;--muted:#71717a;--border:#e4e4e7;
  --success:#22c55e;--danger:#ef4444;--warning:#f59e0b;
  --radius:18px;--shadow:0 8px 30px rgba(0,0,0,.06);
  --shadow-sm:0 2px 10px rgba(0,0,0,.04);
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  background:var(--background);color:var(--text);line-height:1.55;font-size:16px;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block;height:auto}
button,input,textarea,select{font-family:inherit;font-size:inherit}
.container{max-width:1240px;margin:0 auto;padding:0 18px}
/* header */
.site-header{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.94);backdrop-filter:saturate(180%) blur(12px);border-bottom:1px solid var(--border)}
.header-inner{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 0}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:22px;color:var(--primary-dark)}
.logo-mark{width:36px;height:36px;background:linear-gradient(135deg,var(--primary),var(--secondary));border-radius:11px;display:grid;place-items:center;color:#fff;font-size:18px;font-weight:900}
.nav{display:flex;gap:4px;align-items:center}
.nav a{padding:8px 14px;border-radius:10px;font-size:15px;font-weight:500;color:var(--text);transition:background .15s,color .15s}
.nav a:hover{background:var(--light-purple);color:var(--primary-dark)}
.header-actions{display:flex;align-items:center;gap:8px}
.icon-btn{width:40px;height:40px;border-radius:11px;background:transparent;border:1px solid var(--border);cursor:pointer;display:grid;place-items:center;color:var(--text);transition:all .15s}
.icon-btn:hover{background:var(--light-purple);border-color:var(--primary);color:var(--primary-dark)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 18px;border-radius:11px;font-weight:600;font-size:14px;cursor:pointer;border:1px solid transparent;transition:all .15s;white-space:nowrap}
.btn-primary{background:var(--primary);color:#fff}
.btn-primary:hover{background:var(--primary-dark)}
.btn-outline{background:transparent;border-color:var(--border);color:var(--text)}
.btn-outline:hover{border-color:var(--primary);color:var(--primary-dark);background:var(--light-purple)}
.btn-ghost{background:transparent;color:var(--muted)}
.btn-ghost:hover{color:var(--primary-dark);background:var(--light-purple)}
.btn-sm{padding:6px 12px;font-size:13px}
.mobile-toggle{display:none}
/* breaking bar */
.breaking-bar{background:linear-gradient(90deg,#7c3aed,#a855f7);color:#fff;overflow:hidden;font-size:14px}
.breaking-inner{display:flex;align-items:center;gap:14px;padding:9px 0}
.breaking-label{background:rgba(0,0,0,.25);padding:4px 11px;border-radius:8px;font-weight:800;letter-spacing:.5px;font-size:11px}
.breaking-scroll{overflow:hidden;flex:1;position:relative;height:22px}
.breaking-track{display:flex;gap:40px;animation:slide 40s linear infinite;white-space:nowrap;position:absolute}
@keyframes slide{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.breaking-track a{color:#fff;opacity:.95}
.breaking-track a:hover{text-decoration:underline}
/* hero */
.hero{padding:30px 0 10px}
.hero-grid{display:grid;grid-template-columns:2fr 1fr;gap:24px}
.hero-main{position:relative;border-radius:var(--radius);overflow:hidden;aspect-ratio:16/10;background:#111}
.hero-main img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease}
.hero-main:hover img{transform:scale(1.05)}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(0,0,0,.85));color:#fff;padding:26px;display:flex;flex-direction:column;justify-content:flex-end}
.hero-overlay h1{font-size:clamp(22px,3.2vw,38px);line-height:1.15;margin:10px 0 8px;font-weight:800}
.hero-overlay p{opacity:.92;font-size:15px;max-width:640px}
.hero-meta{display:flex;align-items:center;gap:14px;font-size:13px;opacity:.9;margin-top:12px}
.hero-side{display:flex;flex-direction:column;gap:14px}
.side-card{display:grid;grid-template-columns:110px 1fr;gap:12px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);transition:transform .2s,box-shadow .2s}
.side-card:hover{transform:translateY(-2px);box-shadow:var(--shadow)}
.side-card img{width:110px;height:100%;object-fit:cover;aspect-ratio:1}
.side-card-body{padding:10px 12px 10px 0;display:flex;flex-direction:column;gap:4px}
.side-card-body h3{font-size:14px;line-height:1.3;font-weight:700;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.side-card-body .meta{font-size:11px;color:var(--muted);margin-top:auto;display:flex;gap:8px}
/* badges */
.badge{display:inline-block;padding:3px 9px;border-radius:7px;font-size:11px;font-weight:700;letter-spacing:.3px;background:var(--light-purple);color:var(--primary-dark);text-transform:uppercase}
.badge.breaking{background:#fee2e2;color:#b91c1c}
/* section */
.section{padding:34px 0}
.section-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:20px;gap:16px;flex-wrap:wrap}
.section-title{font-size:22px;font-weight:800;position:relative;padding-left:14px}
.section-title::before{content:"";position:absolute;left:0;top:6px;bottom:6px;width:4px;border-radius:3px;background:linear-gradient(180deg,var(--primary),var(--secondary))}
.section-title small{display:block;font-weight:500;color:var(--muted);font-size:13px;margin-top:2px}
.section-link{font-size:13px;font-weight:600;color:var(--primary-dark)}
/* grid */
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:22px}
/* card */
.card{background:#fff;border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-sm);transition:transform .25s,box-shadow .25s;display:flex;flex-direction:column}
.card:hover{transform:translateY(-4px);box-shadow:var(--shadow)}
.card-img{aspect-ratio:16/10;overflow:hidden;background:#f4f4f5}
.card-img img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease}
.card:hover .card-img img{transform:scale(1.07)}
.card-body{padding:16px;display:flex;flex-direction:column;gap:8px;flex:1}
.card-body h3{font-size:16px;font-weight:700;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-body p{font-size:14px;color:var(--muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;color:var(--muted);margin-top:auto;padding-top:8px;border-top:1px solid var(--border)}
/* article */
.article-wrap{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:34px;padding:26px 0 40px}
.article-header h1{font-size:clamp(24px,3.4vw,40px);line-height:1.18;font-weight:800;margin:10px 0 14px}
.article-meta{display:flex;flex-wrap:wrap;gap:14px;color:var(--muted);font-size:13px;align-items:center;padding-bottom:16px;border-bottom:1px solid var(--border)}
.article-hero-img{margin:22px 0;border-radius:var(--radius);overflow:hidden;aspect-ratio:16/9}
.article-hero-img img{width:100%;height:100%;object-fit:cover}
.article-content{font-size:17px;line-height:1.75;color:#27272a}
.article-content p{margin:0 0 18px}
.article-content h2{font-size:24px;margin:28px 0 12px;font-weight:800}
.article-content h3{font-size:20px;margin:22px 0 10px;font-weight:700}
.article-content ul,.article-content ol{margin:0 0 18px 22px}
.article-content blockquote{border-left:4px solid var(--primary);padding:6px 16px;margin:18px 0;color:#52525b;font-style:italic;background:var(--light-purple);border-radius:0 12px 12px 0}
.article-content img{border-radius:14px;margin:14px 0}
.article-content a{color:var(--primary-dark);text-decoration:underline}
.share-row{display:flex;gap:10px;flex-wrap:wrap;margin:26px 0;padding:18px;background:#fff;border-radius:14px;box-shadow:var(--shadow-sm);align-items:center}
.share-row strong{font-size:13px;color:var(--muted);margin-right:8px}
.share-btn{width:40px;height:40px;border-radius:11px;background:var(--light-purple);display:grid;place-items:center;color:var(--primary-dark);transition:all .15s}
.share-btn:hover{background:var(--primary);color:#fff}
.breadcrumb{font-size:13px;color:var(--muted);margin-bottom:6px}
.breadcrumb a:hover{color:var(--primary-dark)}
/* sidebar */
.sidebar{display:flex;flex-direction:column;gap:24px}
.side-block{background:#fff;border-radius:var(--radius);padding:20px;box-shadow:var(--shadow-sm)}
.side-block h4{font-size:15px;font-weight:800;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.side-block h4::before{content:"";width:4px;height:16px;border-radius:3px;background:linear-gradient(180deg,var(--primary),var(--secondary))}
.pop-list{display:flex;flex-direction:column;gap:12px}
.pop-item{display:grid;grid-template-columns:64px 1fr;gap:12px;align-items:start}
.pop-item img{width:64px;height:64px;border-radius:10px;object-fit:cover;background:#f4f4f5}
.pop-item .t{font-size:13px;font-weight:600;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pop-item .v{font-size:11px;color:var(--muted);margin-top:4px}
/* footer */
.site-footer{background:#18181b;color:#d4d4d8;margin-top:40px;padding:44px 0 18px}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:30px;margin-bottom:30px}
.footer-grid h4{color:#fff;font-size:14px;margin-bottom:14px;font-weight:700}
.footer-grid a{display:block;padding:4px 0;font-size:14px;color:#a1a1aa}
.footer-grid a:hover{color:var(--primary)}
.footer-brand .logo{color:#fff;margin-bottom:10px}
.footer-brand p{font-size:14px;color:#a1a1aa;max-width:340px}
.footer-social{display:flex;gap:10px;margin-top:16px}
.footer-social a{width:36px;height:36px;border-radius:10px;background:#27272a;display:grid;place-items:center;color:#d4d4d8;padding:0}
.footer-social a:hover{background:var(--primary);color:#fff}
.footer-bottom{border-top:1px solid #27272a;padding-top:18px;font-size:13px;color:#a1a1aa;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
/* ads */
.ad-slot{margin:24px 0;padding:14px;background:#fff;border:1px dashed var(--border);border-radius:14px;text-align:center;min-height:60px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12px}
.ad-slot::before{content:"Advertisement";position:absolute;top:6px;left:14px;font-size:10px;color:var(--muted);letter-spacing:1px;text-transform:uppercase}
.ad-slot{position:relative;padding-top:24px}
/* pagination */
.pagination{display:flex;gap:6px;justify-content:center;padding:22px 0;flex-wrap:wrap}
.pagination a,.pagination span{padding:8px 13px;border-radius:10px;background:#fff;border:1px solid var(--border);font-size:14px;font-weight:600;color:var(--text)}
.pagination a:hover{border-color:var(--primary);color:var(--primary-dark)}
.pagination .active{background:var(--primary);color:#fff;border-color:var(--primary)}
.pagination .disabled{opacity:.4;pointer-events:none}
/* newsletter */
.newsletter-box{background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;border-radius:var(--radius);padding:36px;text-align:center}
.newsletter-box h3{font-size:24px;margin-bottom:8px;font-weight:800}
.newsletter-box p{opacity:.92;margin-bottom:18px}
.newsletter-form{display:flex;gap:10px;max-width:480px;margin:0 auto}
.newsletter-form input{flex:1;padding:13px 16px;border-radius:12px;border:none;font-size:15px}
.newsletter-form input:focus{outline:2px solid #fff}
.newsletter-form button{background:#18181b;color:#fff;border:none;padding:13px 22px;border-radius:12px;font-weight:700;cursor:pointer}
.newsletter-form button:hover{background:#000}
/* search */
.search-header{background:#fff;padding:26px 0;border-bottom:1px solid var(--border)}
.search-input-wrap{display:flex;gap:10px;max-width:720px;margin:0 auto}
.search-input{flex:1;padding:13px 18px;border-radius:12px;border:1px solid var(--border);font-size:15px;background:var(--background)}
.search-input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 4px rgba(139,92,246,.15);background:#fff}
.filters{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}
.filter-pill{padding:7px 14px;border-radius:999px;background:#fff;border:1px solid var(--border);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}
.filter-pill:hover{border-color:var(--primary)}
.filter-pill.active{background:var(--primary);color:#fff;border-color:var(--primary)}
/* empty */
.empty{text-align:center;padding:70px 20px;color:var(--muted)}
.empty svg{width:80px;height:80px;opacity:.4;margin-bottom:16px}
.empty h3{color:var(--text);font-size:20px;margin-bottom:6px}
/* toast */
.toast-wrap{position:fixed;bottom:22px;right:22px;display:flex;flex-direction:column;gap:10px;z-index:9999}
.toast{background:#18181b;color:#fff;padding:13px 18px;border-radius:12px;font-size:14px;box-shadow:0 10px 40px rgba(0,0,0,.25);animation:toastIn .25s ease;min-width:220px}
.toast.success{background:#16a34a}.toast.error{background:#dc2626}.toast.warn{background:#d97706}
@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
/* mobile drawer */
.drawer-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:opacity .2s;z-index:200}
.drawer-backdrop.open{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;bottom:0;left:0;width:82%;max-width:340px;background:#fff;transform:translateX(-100%);transition:transform .25s;z-index:201;padding:22px;overflow-y:auto}
.drawer.open{transform:translateX(0)}
.drawer-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}
.drawer nav{display:flex;flex-direction:column;gap:4px}
.drawer nav a{padding:12px 14px;border-radius:11px;font-weight:600}
.drawer nav a:hover{background:var(--light-purple);color:var(--primary-dark)}
/* skeleton */
.skel{background:linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:8px}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
/* dark */
body.dark{--background:#0a0a0a;--white:#18181b;--text:#fafafa;--muted:#a1a1aa;--border:#27272a;--light-purple:#2a1d4a}
body.dark .site-header{background:rgba(24,24,27,.94)}
body.dark .side-card,body.dark .card,body.dark .side-block,body.dark .search-header{background:#18181b}
body.dark .hero-main{background:#000}
@media (max-width:1024px){
  .hero-grid{grid-template-columns:1fr}
  .grid-4{grid-template-columns:repeat(2,1fr)}
  .grid-3{grid-template-columns:repeat(2,1fr)}
  .article-wrap{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr 1fr}
  .nav{display:none}
  .mobile-toggle{display:grid}
}
@media (max-width:640px){
  .grid-4,.grid-3,.grid-2{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr;gap:22px}
  .header-actions .btn-outline{display:none}
  .hero-overlay{padding:16px}
  .section{padding:24px 0}
  .newsletter-form{flex-direction:column}
  .container{padding:0 14px}
  .toast-wrap{left:14px;right:14px;bottom:14px}
}
`;

export const ADMIN_CSS = `
:root{
  --primary:#8b5cf6;--primary-dark:#7c3aed;--secondary:#a855f7;
  --light-purple:#f3e8ff;--bg:#faf5ff;--white:#fff;--text:#18181b;--muted:#71717a;
  --border:#e4e4e7;--success:#22c55e;--danger:#ef4444;--warning:#f59e0b;
  --radius:14px;--shadow:0 8px 30px rgba(0,0,0,.06);--sidebar-w:250px;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.5;font-size:14px;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
button,input,textarea,select{font-family:inherit;font-size:inherit}
.login-wrap{min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,#faf5ff,#ede9fe)}
.login-card{background:#fff;padding:38px;border-radius:20px;box-shadow:0 20px 60px rgba(139,92,246,.15);width:100%;max-width:420px}
.login-card h1{font-size:24px;margin-bottom:6px;font-weight:800}
.login-card p.sub{color:var(--muted);margin-bottom:24px}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:20px;color:var(--primary-dark);margin-bottom:24px}
.logo-mark{width:34px;height:34px;background:linear-gradient(135deg,var(--primary),var(--secondary));border-radius:10px;display:grid;place-items:center;color:#fff;font-weight:900}
.field{margin-bottom:16px}
.field label{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#3f3f46}
.field input,.field select,.field textarea{width:100%;padding:11px 14px;border-radius:11px;border:1px solid var(--border);background:#fff;outline:none;transition:border .15s,box-shadow .15s;font-size:14px;color:var(--text)}
.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 4px rgba(139,92,246,.13)}
.field textarea{resize:vertical;min-height:110px;font-family:inherit}
.field .hint{font-size:12px;color:var(--muted);margin-top:4px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 18px;border-radius:11px;font-weight:600;font-size:14px;cursor:pointer;border:1px solid transparent;transition:all .15s;white-space:nowrap}
.btn:disabled{opacity:.6;cursor:not-allowed}
.btn-primary{background:var(--primary);color:#fff}
.btn-primary:hover:not(:disabled){background:var(--primary-dark)}
.btn-outline{background:#fff;border-color:var(--border);color:var(--text)}
.btn-outline:hover:not(:disabled){border-color:var(--primary);color:var(--primary-dark)}
.btn-danger{background:var(--danger);color:#fff}
.btn-danger:hover:not(:disabled){background:#dc2626}
.btn-sm{padding:6px 12px;font-size:13px}
.btn-block{width:100%}
.layout{display:grid;grid-template-columns:var(--sidebar-w) 1fr;min-height:100vh}
.sidebar{background:#fff;border-right:1px solid var(--border);padding:20px 14px;position:sticky;top:0;height:100vh;overflow-y:auto}
.sidebar .logo{padding:0 10px;margin-bottom:26px;font-size:17px}
.nav-group{margin-bottom:20px}
.nav-group h5{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);padding:0 10px;margin-bottom:8px;font-weight:700}
.nav-group a{display:flex;align-items:center;gap:11px;padding:9px 12px;border-radius:10px;font-size:13.5px;font-weight:500;color:#52525b;transition:all .15s;margin-bottom:2px}
.nav-group a:hover{background:var(--light-purple);color:var(--primary-dark)}
.nav-group a.active{background:var(--primary);color:#fff}
.nav-group a svg{width:17px;height:17px;flex-shrink:0}
.main{padding:0 0 40px}
.topbar{background:#fff;border-bottom:1px solid var(--border);padding:14px 28px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.topbar h2{font-size:18px;font-weight:700}
.topbar .user{display:flex;align-items:center;gap:12px;font-size:13px}
.avatar{width:36px;height:36px;border-radius:50%;background:var(--primary);color:#fff;display:grid;place-items:center;font-weight:700;font-size:14px;overflow:hidden}
.avatar img{width:100%;height:100%;object-fit:cover}
.content{padding:26px 28px}
.page-head{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:22px}
.page-head h1{font-size:22px;font-weight:800}
.page-head .sub{color:var(--muted);font-size:13px;margin-top:3px}
.card{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);padding:20px;margin-bottom:22px}
.card h3{font-size:15px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:10px}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;margin-bottom:26px}
.stat{background:#fff;border-radius:var(--radius);box-shadow:var(--shadow);padding:20px;position:relative;overflow:hidden}
.stat .lbl{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;font-weight:600}
.stat .val{font-size:28px;font-weight:800;margin:8px 0 4px;color:var(--text)}
.stat .sub{font-size:12px;color:var(--muted)}
.stat .icon{position:absolute;top:16px;right:16px;width:38px;height:38px;border-radius:11px;background:var(--light-purple);display:grid;place-items:center;color:var(--primary-dark)}
table{width:100%;border-collapse:collapse;font-size:13.5px}
table th{text-align:left;padding:10px 12px;font-weight:700;color:var(--muted);text-transform:uppercase;font-size:11px;letter-spacing:.5px;border-bottom:1px solid var(--border)}
table td{padding:12px;border-bottom:1px solid var(--border);vertical-align:middle}
table tr:hover td{background:#fafafa}
.tbl-thumb{width:44px;height:44px;border-radius:9px;object-fit:cover;background:#f4f4f5}
.tbl-actions{display:flex;gap:6px;flex-wrap:wrap}
.pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;text-transform:uppercase}
.pill.published{background:#dcfce7;color:#166534}
.pill.draft{background:#fef3c7;color:#92400e}
.pill.scheduled{background:#dbeafe;color:#1e40af}
.pill.archived{background:#e4e4e7;color:#3f3f46}
.pill.pending{background:#fef3c7;color:#92400e}
.pill.approved{background:#dcfce7;color:#166534}
.pill.rejected{background:#fee2e2;color:#991b1b}
.pill.spam{background:#e4e4e7;color:#3f3f46}
.pill.active{background:#dcfce7;color:#166534}
.pill.inactive{background:#e4e4e7;color:#3f3f46}
.filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;align-items:center}
.filters input,.filters select{padding:9px 13px;border-radius:10px;border:1px solid var(--border);background:#fff;font-size:13.5px;outline:none}
.filters input:focus,.filters select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(139,92,246,.13)}
.grid2{display:grid;grid-template-columns:2fr 1fr;gap:20px}
.grid2-eq{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media (max-width:900px){.grid2,.grid2-eq{grid-template-columns:1fr}}
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;z-index:1000;padding:16px}
.modal-backdrop.open{display:flex}
.modal{background:#fff;border-radius:16px;padding:24px;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,.3)}
.modal h3{font-size:18px;font-weight:800;margin-bottom:14px}
.modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:22px}
.toast-wrap{position:fixed;top:20px;right:20px;display:flex;flex-direction:column;gap:10px;z-index:9999;max-width:340px}
.toast{background:#18181b;color:#fff;padding:12px 16px;border-radius:12px;font-size:13.5px;box-shadow:0 10px 40px rgba(0,0,0,.25);animation:tin .25s ease}
.toast.success{background:#16a34a}.toast.error{background:#dc2626}.toast.warn{background:#d97706}
@keyframes tin{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.empty{text-align:center;padding:60px 20px;color:var(--muted)}
.empty h3{color:var(--text);margin-bottom:6px}
.skel{background:linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:8px;height:14px;margin:8px 0}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.mobile-menu-btn{display:none;background:#fff;border:1px solid var(--border);width:40px;height:40px;border-radius:10px;cursor:pointer}
.mobile-drawer-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:opacity .2s;z-index:200}
.mobile-drawer-backdrop.open{opacity:1;pointer-events:auto}
.tabs{display:flex;gap:6px;border-bottom:1px solid var(--border);margin-bottom:18px;flex-wrap:wrap}
.tab{padding:9px 15px;font-size:13.5px;font-weight:600;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px}
.tab.active{color:var(--primary-dark);border-bottom-color:var(--primary)}
.editor-toolbar{display:flex;gap:4px;flex-wrap:wrap;background:#fafafa;padding:8px;border-radius:12px 12px 0 0;border:1px solid var(--border);border-bottom:none}
.editor-toolbar button{background:#fff;border:1px solid var(--border);border-radius:8px;padding:6px 10px;cursor:pointer;font-size:13px;font-weight:600;color:#3f3f46;min-width:34px;display:grid;place-items:center}
.editor-toolbar button:hover{background:var(--light-purple);border-color:var(--primary);color:var(--primary-dark)}
.editor-area{min-height:380px;padding:18px;border:1px solid var(--border);border-radius:0 0 12px 12px;background:#fff;outline:none;font-size:15px;line-height:1.7}
.editor-area:focus{border-color:var(--primary);box-shadow:0 0 0 4px rgba(139,92,246,.1)}
.editor-area h2{font-size:22px;margin:16px 0 8px}
.editor-area h3{font-size:18px;margin:14px 0 6px}
.editor-area p{margin:0 0 12px}
.editor-area blockquote{border-left:4px solid var(--primary);padding:6px 14px;background:var(--light-purple);margin:12px 0;font-style:italic}
.editor-area ul,.editor-area ol{margin:0 0 12px 22px}
.editor-area img{border-radius:10px;margin:10px 0}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media (max-width:700px){.form-row{grid-template-columns:1fr}}
.switch{position:relative;display:inline-block;width:42px;height:24px}
.switch input{opacity:0;width:0;height:0}
.slider{position:absolute;inset:0;background:#d4d4d8;border-radius:24px;cursor:pointer;transition:.2s}
.slider::before{content:"";position:absolute;height:18px;width:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s}
input:checked + .slider{background:var(--primary)}
input:checked + .slider::before{transform:translateX(18px)}
@media (max-width:900px){
  .layout{grid-template-columns:1fr}
  .sidebar{position:fixed;left:0;top:0;bottom:0;z-index:300;transform:translateX(-100%);transition:transform .25s;width:270px;height:100vh}
  .sidebar.open{transform:translateX(0)}
  .mobile-menu-btn{display:grid}
  .content{padding:18px 14px}
  .topbar{padding:12px 14px}
  table{font-size:12.5px}
  table th,table td{padding:8px}
}
body.dark{--bg:#0a0a0a;--white:#18181b;--text:#fafafa;--muted:#a1a1aa;--border:#27272a;--light-purple:#2a1d4a}
body.dark .card,body.dark .stat,body.dark .sidebar,body.dark .topbar,body.dark .modal{background:#18181b}
body.dark .field input,body.dark .field select,body.dark .field textarea,body.dark .filters input,body.dark .filters select{background:#0a0a0a;border-color:#27272a;color:#fafafa}
body.dark table tr:hover td{background:#18181b}
body.dark .editor-toolbar{background:#18181b}
body.dark .editor-toolbar button{background:#27272a;color:#e4e4e7;border-color:#3f3f46}
body.dark .editor-area{background:#0a0a0a;color:#fafafa}
`;
