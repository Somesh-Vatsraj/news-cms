import { renderAdminShell } from './shell.js';
import { escapeHtml } from '../../utils/sanitize.js';

/** Dashboard */
export function renderDashboard({ user, path }) {
  const content = `
    <div class="page-head">
      <div><h1>Dashboard</h1><div class="sub">Overview of your news platform</div></div>
      <div style="display:flex;gap:8px">
        <a href="/admin/news/new" class="btn btn-primary">+ New Article</a>
      </div>
    </div>
    <div class="stats-grid" id="statsGrid">
      ${['Total News','Published','Drafts','Scheduled','Users','Pending Comments','Total Views','Views (7d)']
        .map((l,i) => `<div class="stat"><div class="lbl">${l}</div><div class="val skel" style="height:32px;width:60%"></div></div>`).join('')}
    </div>
    <div class="grid2">
      <div class="card">
        <h3>Recent Articles <a href="/admin/news" class="btn btn-outline btn-sm">View all</a></h3>
        <div id="recentNews"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>
      </div>
      <div class="card">
        <h3>Most Viewed</h3>
        <div id="mostViewed"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>
      </div>
    </div>
    <div class="card">
      <h3>Recent Activity</h3>
      <div id="recentLogs"><div class="skel"></div><div class="skel"></div></div>
    </div>
    <div class="card">
      <h3>Quick Actions</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px">
        <a href="/admin/news/new" class="btn btn-outline">+ Add News</a>
        <a href="/admin/news" class="btn btn-outline">Manage News</a>
        <a href="/admin/categories" class="btn btn-outline">+ Category</a>
        <a href="/admin/users" class="btn btn-outline">Manage Users</a>
        <a href="/admin/settings" class="btn btn-outline">Settings</a>
      </div>
    </div>
    <script>
      (function(){
        fetch('/api/dashboard/stats').then(r=>r.json()).then(j=>{
          if(!j.success) return;
          var s = j.data.stats;
          var vals = [s.total, s.published, s.drafts, s.scheduled, s.users, s.pendingComments, s.views, s.weekViews];
          var grid = document.getElementById('statsGrid');
          grid.querySelectorAll('.val').forEach(function(el, i){
            el.classList.remove('skel'); el.style.width='auto'; el.style.height='auto';
            el.textContent = (vals[i]||0).toLocaleString();
          });
          var rn = document.getElementById('recentNews');
          rn.innerHTML = (j.data.recentNews||[]).map(n => \`
            <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);align-items:center">
              <img src="\${n.featured_image || 'https://placehold.co/80x80/f3e8ff/8b5cf6?text='}" style="width:44px;height:44px;border-radius:8px;object-fit:cover" alt="">
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${escapeHtmlJs(n.title)}</div>
                <div style="font-size:11.5px;color:var(--muted)">\${n.category_name||'—'} · \${n.views||0} views</div>
              </div>
              <span class="pill \${n.status}">\${n.status}</span>
            </div>\`).join('') || '<div class="empty">No articles yet</div>';
          var mv = document.getElementById('mostViewed');
          mv.innerHTML = (j.data.mostViewed||[]).map((n,i) => \`
            <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);align-items:center">
              <div style="width:26px;height:26px;border-radius:8px;background:var(--light-purple);color:var(--primary-dark);display:grid;place-items:center;font-weight:700;font-size:12px">\${i+1}</div>
              <div style="flex:1;min-width:0;font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${escapeHtmlJs(n.title)}</div>
              <div style="font-size:12px;color:var(--muted)">\${n.views} views</div>
            </div>\`).join('') || '<div class="empty">No data</div>';
          var rl = document.getElementById('recentLogs');
          rl.innerHTML = (j.data.recentLogs||[]).map(l => \`
            <div style="padding:9px 0;border-bottom:1px solid var(--border);font-size:13px">
              <strong>\${escapeHtmlJs(l.user_name||'System')}</strong>
              <span style="color:var(--muted)">\${escapeHtmlJs(l.action)}</span>
              <span style="float:right;color:var(--muted);font-size:11.5px">\${(l.created_at||'').slice(0,16)}</span>
            </div>\`).join('') || '<div class="empty">No activity yet</div>';
        });
      })();
      function escapeHtmlJs(s){ var d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }
    </script>
  `;
  return renderAdminShell({ user, title: 'Dashboard', content, path });
}

/** Generic list pages render shell and mount JS via data-page attr */
export function renderListPage({ user, path, title, pageKey }) {
  const content = `
    <div class="page-head">
      <div><h1>${escapeHtml(title)}</h1><div class="sub" data-role="subtitle"></div></div>
      <div data-role="actions"></div>
    </div>
    <div class="card" data-role="list-container">
      <div data-role="list-content"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>
    </div>
    <script>window.__ADMIN_PAGE__ = "${pageKey}";</script>
  `;
  return renderAdminShell({ user, title, content, path });
}

/** News editor page */
export function renderNewsEditor({ user, path, article, categories, authors, tags }) {
  const isEdit = !!article;
  const content = `
    <div class="page-head">
      <div><h1>${isEdit ? 'Edit Article' : 'New Article'}</h1><div class="sub">${isEdit ? escapeHtml(article.title) : 'Create a new article'}</div></div>
      <div style="display:flex;gap:8px">
        <a href="/admin/news" class="btn btn-outline">Cancel</a>
        <button class="btn btn-primary" id="saveBtn" form="articleForm" type="submit">${isEdit ? 'Update' : 'Create'}</button>
      </div>
    </div>
    <form id="articleForm" data-id="${isEdit ? article.id : ''}">
      <div class="grid2">
        <div>
          <div class="card">
            <div class="field">
              <label>Title</label>
              <input name="title" required value="${isEdit ? escapeHtml(article.title) : ''}" placeholder="Article headline">
            </div>
            <div class="field">
              <label>Slug</label>
              <input name="slug" value="${isEdit ? escapeHtml(article.slug) : ''}" placeholder="auto-generated if empty">
            </div>
            <div class="field">
              <label>Excerpt</label>
              <textarea name="excerpt" rows="3" placeholder="Brief summary">${isEdit ? escapeHtml(article.excerpt||'') : ''}</textarea>
            </div>
            <div class="field" style="margin-bottom:0">
              <label>Content</label>
              <div class="editor-toolbar">
                <button type="button" data-cmd="formatBlock" data-val="h2">H2</button>
                <button type="button" data-cmd="formatBlock" data-val="h3">H3</button>
                <button type="button" data-cmd="formatBlock" data-val="p">¶</button>
                <button type="button" data-cmd="bold"><b>B</b></button>
                <button type="button" data-cmd="italic"><i>I</i></button>
                <button type="button" data-cmd="underline"><u>U</u></button>
                <button type="button" data-cmd="insertUnorderedList">• List</button>
                <button type="button" data-cmd="insertOrderedList">1. List</button>
                <button type="button" data-cmd="formatBlock" data-val="blockquote">" Quote</button>
                <button type="button" data-cmd="createLink">🔗</button>
                <button type="button" data-cmd="insertImage">🖼</button>
                <button type="button" data-cmd="removeFormat">Tx</button>
              </div>
              <div class="editor-area" id="editor" contenteditable="true">${isEdit ? (article.content || '') : ''}</div>
              <textarea name="content" id="contentHidden" style="display:none">${isEdit ? escapeHtml(article.content||'') : ''}</textarea>
            </div>
          </div>
        </div>
        <div>
          <div class="card">
            <h3>Publishing</h3>
            <div class="field"><label>Status</label>
              <select name="status">
                ${['draft','published','scheduled','archived'].map(s => `<option value="${s}" ${(isEdit && article.status===s)?'selected':''}>${s}</option>`).join('')}
              </select>
            </div>
            <div class="field"><label>Visibility</label>
              <select name="visibility">
                <option value="public" ${(isEdit && article.visibility==='public')?'selected':''}>public</option>
                <option value="private" ${(isEdit && article.visibility==='private')?'selected':''}>private</option>
              </select>
            </div>
            <div class="field"><label>Publish Date</label>
              <input type="datetime-local" name="published_at" value="${isEdit && article.published_at ? article.published_at.slice(0,16) : ''}">
            </div>
            <div class="field"><label>Scheduled For</label>
              <input type="datetime-local" name="scheduled_at" value="${isEdit && article.scheduled_at ? article.scheduled_at.slice(0,16) : ''}">
            </div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:6px">
              <label style="display:flex;gap:6px;align-items:center;font-size:13px;font-weight:600"><input type="checkbox" name="is_featured" ${isEdit && article.is_featured?'checked':''}> Featured</label>
              <label style="display:flex;gap:6px;align-items:center;font-size:13px;font-weight:600"><input type="checkbox" name="is_trending" ${isEdit && article.is_trending?'checked':''}> Trending</label>
              <label style="display:flex;gap:6px;align-items:center;font-size:13px;font-weight:600"><input type="checkbox" name="is_breaking" ${isEdit && article.is_breaking?'checked':''}> Breaking</label>
            </div>
          </div>

          <div class="card">
            <h3>Organize</h3>
            <div class="field"><label>Category</label>
              <select name="category_id">
                <option value="">— None —</option>
                ${categories.map(c => `<option value="${c.id}" ${isEdit && article.category_id===c.id?'selected':''}>${escapeHtml(c.name)}</option>`).join('')}
              </select>
            </div>
            <div class="field"><label>Author</label>
              <select name="author_id">
                <option value="">— None —</option>
                ${authors.map(a => `<option value="${a.id}" ${isEdit && article.author_id===a.id?'selected':''}>${escapeHtml(a.name)}</option>`).join('')}
              </select>
            </div>
            <div class="field"><label>Tags (comma separated)</label>
              <input name="tags" value="${isEdit ? escapeHtml(tags||'') : ''}" placeholder="tech, ai, startup">
            </div>
          </div>

          <div class="card">
            <h3>Images</h3>
            <div class="field"><label>Featured Image URL</label>
              <input name="featured_image" id="fimg" value="${isEdit ? escapeHtml(article.featured_image||'') : ''}" placeholder="https://...">
            </div>
            <div class="field"><label>Thumbnail URL</label>
              <input name="thumbnail" id="timg" value="${isEdit ? escapeHtml(article.thumbnail||'') : ''}" placeholder="https://...">
            </div>
          </div>

          <div class="card">
            <h3>SEO</h3>
            <div class="field"><label>SEO Title</label><input name="meta_title" value="${isEdit ? escapeHtml(article.meta_title||'') : ''}"></div>
            <div class="field"><label>Meta Description</label><textarea name="meta_description" rows="2">${isEdit ? escapeHtml(article.meta_description||'') : ''}</textarea></div>
            <div class="field"><label>Meta Keywords</label><input name="meta_keywords" value="${isEdit ? escapeHtml(article.meta_keywords||'') : ''}"></div>
            <div class="field"><label>Canonical URL</label><input name="canonical_url" value="${isEdit ? escapeHtml(article.canonical_url||'') : ''}"></div>
          </div>
        </div>
      </div>
    </form>
    <script src="/js/editor.js"></script>
  `;
  return renderAdminShell({ user, title: isEdit ? 'Edit Article' : 'New Article', content, path });
}
