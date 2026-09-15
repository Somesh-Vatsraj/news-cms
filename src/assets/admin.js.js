export const ADMIN_JS = String.raw`
(function(){
  'use strict';

  // Mobile drawer
  var sidebar = document.getElementById('adminSidebar');
  var backdrop = document.getElementById('mobBackdrop');
  var toggle = document.getElementById('mobToggle');
  if(toggle) toggle.addEventListener('click', function(){ sidebar.classList.add('open'); backdrop.classList.add('open'); });
  if(backdrop) backdrop.addEventListener('click', function(){ sidebar.classList.remove('open'); backdrop.classList.remove('open'); });

  window.logout = function(){
    fetch('/api/auth/logout', {method:'POST'}).then(function(){ location.href='/admin/login'; });
  };

  // Toast
  window.toast = function(msg, type){
    var wrap = document.getElementById('toastWrap');
    if(!wrap){ wrap=document.createElement('div'); wrap.id='toastWrap'; wrap.className='toast-wrap'; document.body.appendChild(wrap); }
    var t = document.createElement('div');
    t.className = 'toast ' + (type||'');
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(function(){ t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(function(){ t.remove(); }, 300); }, 3000);
  };

  // Modal helpers
  window.openModal = function(html){
    var bd = document.getElementById('modalBackdrop');
    var body = document.getElementById('modalBody');
    body.innerHTML = html;
    bd.classList.add('open');
    return body;
  };
  window.closeModal = function(){
    document.getElementById('modalBackdrop').classList.remove('open');
  };
  document.getElementById('modalBackdrop')?.addEventListener('click', function(e){
    if(e.target.id === 'modalBackdrop') closeModal();
  });

  window.confirmDialog = function(message, onConfirm){
    openModal('<h3>Confirm</h3><p style="color:var(--muted)">'+message+'</p><div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancel</button><button class="btn btn-danger" id="confirmYes">Confirm</button></div>');
    document.getElementById('confirmYes').addEventListener('click', function(){ closeModal(); onConfirm(); });
  };

  window.api = function(path, opts){
    opts = opts || {};
    var init = { method: opts.method || 'GET', headers: Object.assign({'content-type':'application/json'}, opts.headers||{}) };
    if(opts.body) init.body = JSON.stringify(opts.body);
    return fetch(path, init).then(function(r){ return r.json().then(function(j){ return { ok: r.ok, j: j }; }); });
  };

  window.escapeHtmlJs = function(s){ var d=document.createElement('div'); d.textContent=s==null?'':String(s); return d.innerHTML; };

  // Login page handles itself; list pages get JS boot
  if(window.__ADMIN_PAGE__) {
    if(window.__ADMIN_PAGE__ === 'news') bootNewsList();
    else if(window.__ADMIN_PAGE__ === 'categories') bootCategories();
    else if(window.__ADMIN_PAGE__ === 'authors') bootAuthors();
    else if(window.__ADMIN_PAGE__ === 'users') bootUsers();
    else if(window.__ADMIN_PAGE__ === 'comments') bootComments();
    else if(window.__ADMIN_PAGE__ === 'media') bootMedia();
    else if(window.__ADMIN_PAGE__ === 'advertisements') bootAds();
    else if(window.__ADMIN_PAGE__ === 'pages') bootPages();
    else if(window.__ADMIN_PAGE__ === 'navigation') bootNav();
    else if(window.__ADMIN_PAGE__ === 'settings') bootSettings();
    else if(window.__ADMIN_PAGE__ === 'seo') bootSeo();
  }

  // ------------- NEWS LIST -------------
  function bootNewsList(){
    var c = document.querySelector('[data-role="list-container"]');
    var actions = document.querySelector('[data-role="actions"]');
    actions.innerHTML = '<a href="/admin/news/new" class="btn btn-primary">+ New Article</a>';
    var page = 1;
    var filters = { q:'', status:'', category_id:'' };

    c.querySelector('[data-role="list-content"]').innerHTML =
      '<div class="filters">' +
        '<input id="q" placeholder="Search title..." style="flex:1;min-width:200px">' +
        '<select id="status"><option value="">All statuses</option><option>draft</option><option>published</option><option>scheduled</option><option>archived</option></select>' +
        '<select id="catFilter"><option value="">All categories</option></select>' +
        '<button class="btn btn-outline btn-sm" id="refresh">Refresh</button>' +
      '</div>' +
      '<div id="listBody"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>' +
      '<div id="pager" class="pagination" style="padding:14px 0"></div>' +
      '<div id="bulkBar" style="display:none;padding:12px;background:var(--light-purple);border-radius:10px;margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center"></div>';

    function loadCats(){
      api('/api/categories?all=1').then(function(r){
        if(!r.j.success) return;
        var sel = document.getElementById('catFilter');
        r.j.data.items.forEach(function(cx){ var o=document.createElement('option'); o.value=cx.id; o.textContent=cx.name; sel.appendChild(o); });
      });
    }
    loadCats();

    function load(){
      var qs = new URLSearchParams();
      qs.set('page', page); qs.set('limit', 15);
      if(filters.q) qs.set('q', filters.q);
      if(filters.status) qs.set('status', filters.status);
      if(filters.category_id) qs.set('category_id', filters.category_id);
      var body = document.getElementById('listBody');
      body.innerHTML = '<div class="skel"></div><div class="skel"></div><div class="skel"></div>';
      api('/api/news/admin/list?' + qs.toString()).then(function(r){
        if(!r.j.success){ body.innerHTML = '<div class="empty">'+(r.j.message||'Error')+'</div>'; return; }
        var items = r.j.data.items;
        if(!items.length){ body.innerHTML = '<div class="empty"><h3>No news found</h3></div>'; document.getElementById('pager').innerHTML=''; return; }
        var selAllHtml = '<th style="width:34px"><input type="checkbox" id="selAll"></th>';
        body.innerHTML = '<div style="overflow-x:auto"><table><thead><tr>' + selAllHtml +
          '<th>Article</th><th>Category</th><th>Author</th><th>Status</th><th>Views</th><th>Date</th><th>Flags</th><th>Actions</th></tr></thead><tbody>' +
          items.map(function(n){
            return '<tr>' +
              '<td><input type="checkbox" class="rowCheck" value="'+n.id+'"></td>' +
              '<td><div style="display:flex;gap:10px;align-items:center"><img class="tbl-thumb" src="'+(n.thumbnail||n.featured_image||'https://placehold.co/60x60/f3e8ff/8b5cf6?text=')+'" alt=""><div><div style="font-weight:600;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+escapeHtmlJs(n.title)+'</div><div style="color:var(--muted);font-size:11.5px">/news/'+escapeHtmlJs(n.slug)+'</div></div></div></td>' +
              '<td>'+escapeHtmlJs(n.category_name||'—')+'</td>' +
              '<td>'+escapeHtmlJs(n.author_name||'—')+'</td>' +
              '<td><span class="pill '+n.status+'">'+n.status+'</span></td>' +
              '<td>'+(n.views||0)+'</td>' +
              '<td style="font-size:12px">'+(n.created_at||'').slice(0,10)+'</td>' +
              '<td>' + (n.is_featured?'<span class="pill published" style="font-size:9px">F</span> ':'') + (n.is_trending?'<span class="pill scheduled" style="font-size:9px">T</span> ':'') + (n.is_breaking?'<span class="pill rejected" style="font-size:9px">B</span>':'') + '</td>' +
              '<td><div class="tbl-actions">' +
                '<a class="btn btn-outline btn-sm" href="/admin/news/edit/'+n.id+'">Edit</a>' +
                '<button class="btn btn-outline btn-sm" data-dup="'+n.id+'">Dup</button>' +
                '<button class="btn btn-danger btn-sm" data-del="'+n.id+'">Del</button>' +
              '</div></td>' +
            '</tr>';
          }).join('') + '</tbody></table></div>';

        var pag = r.j.data;
        var pager = document.getElementById('pager');
        var pages = '';
        for(var i=1; i<=pag.totalPages && i<=10; i++){
          pages += '<a href="#" data-page="'+i+'" class="'+(i===pag.page?'active':'')+'">'+i+'</a>';
        }
        pager.innerHTML = pages;
        pager.querySelectorAll('a').forEach(function(a){
          a.addEventListener('click', function(e){ e.preventDefault(); page = parseInt(a.dataset.page,10); load(); });
        });

        // bulk bar
        var bulk = document.getElementById('bulkBar');
        bulk.style.display = 'flex';
        bulk.innerHTML = '<strong style="font-size:13px">Bulk:</strong>' +
          '<button class="btn btn-outline btn-sm" data-bulk="publish">Publish</button>' +
          '<button class="btn btn-outline btn-sm" data-bulk="archive">Archive</button>' +
          '<button class="btn btn-outline btn-sm" data-bulk="feature">Feature</button>' +
          '<button class="btn btn-outline btn-sm" data-bulk="trend">Trend</button>' +
          '<button class="btn btn-outline btn-sm" data-bulk="break">Break</button>' +
          '<button class="btn btn-danger btn-sm" data-bulk="delete">Delete</button>';

        // wire
        document.getElementById('selAll')?.addEventListener('change', function(e){
          document.querySelectorAll('.rowCheck').forEach(function(c){ c.checked = e.target.checked; });
        });
        body.querySelectorAll('[data-del]').forEach(function(b){ b.addEventListener('click', function(){
          confirmDialog('Delete this article permanently?', function(){
            api('/api/news/'+b.dataset.del, {method:'DELETE'}).then(function(res){
              toast(res.j.message, res.j.success?'success':'error'); load();
            });
          });
        });});
        body.querySelectorAll('[data-dup]').forEach(function(b){ b.addEventListener('click', function(){
          api('/api/news/'+b.dataset.dup+'/duplicate', {method:'POST'}).then(function(res){
            toast(res.j.message, res.j.success?'success':'error'); load();
          });
        });});
        bulk.querySelectorAll('[data-bulk]').forEach(function(b){
          b.addEventListener('click', function(){
            var ids = Array.from(document.querySelectorAll('.rowCheck:checked')).map(function(c){ return parseInt(c.value,10); });
            if(!ids.length) return toast('Select at least one item', 'warn');
            var action = b.dataset.bulk;
            if(action==='delete') return confirmDialog('Delete '+ids.length+' item(s)?', function(){ run(); });
            run();
            function run(){
              api('/api/news/bulk', {method:'POST', body:{ids: ids, action: action}}).then(function(res){
                toast(res.j.message, res.j.success?'success':'error'); load();
              });
            }
          });
        });
      });
    }

    document.getElementById('q').addEventListener('input', debounce(function(e){ filters.q = e.target.value.trim(); page=1; load(); }, 350));
    document.getElementById('status').addEventListener('change', function(e){ filters.status = e.target.value; page=1; load(); });
    document.getElementById('catFilter').addEventListener('change', function(e){ filters.category_id = e.target.value; page=1; load(); });
    document.getElementById('refresh').addEventListener('click', function(){ load(); });

    load();
  }

  // ------------- CATEGORIES -------------
  function bootCategories(){
    var c = document.querySelector('[data-role="list-container"]');
    document.querySelector('[data-role="actions"]').innerHTML = '<button class="btn btn-primary" id="addBtn">+ New Category</button>';
    c.querySelector('[data-role="list-content"]').innerHTML = '<div id="listBody"><div class="skel"></div><div class="skel"></div></div>';

    function load(){
      api('/api/categories?all=1').then(function(r){
        if(!r.j.success) return;
        var items = r.j.data.items;
        var body = document.getElementById('listBody');
        if(!items.length){ body.innerHTML = '<div class="empty"><h3>No categories yet</h3></div>'; return; }
        body.innerHTML = '<div style="overflow-x:auto"><table><thead><tr><th>Name</th><th>Slug</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
          items.map(function(c){
            return '<tr><td><strong>'+escapeHtmlJs(c.name)+'</strong></td><td>'+escapeHtmlJs(c.slug)+'</td><td>'+c.sort_order+'</td>' +
              '<td><span class="pill '+c.status+'">'+c.status+'</span></td>' +
              '<td><div class="tbl-actions">' +
                '<button class="btn btn-outline btn-sm" data-edit="'+c.id+'">Edit</button>' +
                '<button class="btn btn-danger btn-sm" data-del="'+c.id+'">Delete</button>' +
              '</div></td></tr>';
          }).join('') + '</tbody></table></div>';

        body.querySelectorAll('[data-edit]').forEach(function(b){ b.addEventListener('click', function(){
          var item = items.find(function(x){ return x.id == b.dataset.edit; });
          openCategoryModal(item);
        }); });
        body.querySelectorAll('[data-del]').forEach(function(b){ b.addEventListener('click', function(){
          confirmDialog('Delete this category?', function(){
            api('/api/categories/'+b.dataset.del, {method:'DELETE'}).then(function(res){
              toast(res.j.message, res.j.success?'success':'error'); load();
            });
          });
        }); });
      });
    }

    function openCategoryModal(item){
      item = item || {};
      openModal('<h3>'+(item.id?'Edit':'New')+' Category</h3>' +
        '<div class="field"><label>Name</label><input id="cname" value="'+escapeHtmlJs(item.name||'')+'"></div>' +
        '<div class="field"><label>Slug</label><input id="cslug" value="'+escapeHtmlJs(item.slug||'')+'" placeholder="auto"></div>' +
        '<div class="field"><label>Description</label><textarea id="cdesc" rows="3">'+escapeHtmlJs(item.description||'')+'</textarea></div>' +
        '<div class="form-row">' +
          '<div class="field"><label>Image URL</label><input id="cimg" value="'+escapeHtmlJs(item.image||'')+'"></div>' +
          '<div class="field"><label>Sort Order</label><input id="corder" type="number" value="'+(item.sort_order||0)+'"></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="field"><label>Meta Title</label><input id="cmtitle" value="'+escapeHtmlJs(item.meta_title||'')+'"></div>' +
          '<div class="field"><label>Status</label><select id="cstatus"><option value="active" '+((item.status||'active')==='active'?'selected':'')+'>Active</option><option value="inactive" '+(item.status==='inactive'?'selected':'')+'>Inactive</option></select></div>' +
        '</div>' +
        '<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="saveCat">Save</button></div>');

      document.getElementById('saveCat').addEventListener('click', function(){
        var payload = {
          name: document.getElementById('cname').value,
          slug: document.getElementById('cslug').value,
          description: document.getElementById('cdesc').value,
          image: document.getElementById('cimg').value,
          sort_order: parseInt(document.getElementById('corder').value,10) || 0,
          meta_title: document.getElementById('cmtitle').value,
          status: document.getElementById('cstatus').value
        };
        var url = item.id ? '/api/categories/'+item.id : '/api/categories';
        var method = item.id ? 'PUT' : 'POST';
        api(url, {method: method, body: payload}).then(function(r){
          if(r.j.success){ toast('Saved', 'success'); closeModal(); load(); }
          else toast(r.j.message, 'error');
        });
      });
    }

    document.getElementById('addBtn').addEventListener('click', function(){ openCategoryModal(null); });
    load();
  }

  // ------------- AUTHORS -------------
  function bootAuthors(){
    var c = document.querySelector('[data-role="list-container"]');
    document.querySelector('[data-role="actions"]').innerHTML = '<button class="btn btn-primary" id="addBtn">+ New Author</button>';
    c.querySelector('[data-role="list-content"]').innerHTML = '<div id="listBody"><div class="skel"></div></div>';
    function load(){
      api('/api/authors?all=1').then(function(r){
        if(!r.j.success) return;
        var items = r.j.data.items;
        var body = document.getElementById('listBody');
        if(!items.length){ body.innerHTML = '<div class="empty">No authors yet</div>'; return; }
        body.innerHTML = '<div style="overflow-x:auto"><table><thead><tr><th>Author</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
          items.map(function(a){
            return '<tr><td><div style="display:flex;gap:10px;align-items:center"><div class="avatar" style="width:34px;height:34px">'+(a.avatar?'<img src="'+a.avatar+'">':escapeHtmlJs(a.name[0]))+'</div>'+escapeHtmlJs(a.name)+'</div></td>' +
              '<td>'+escapeHtmlJs(a.email||'—')+'</td>' +
              '<td><span class="pill '+a.status+'">'+a.status+'</span></td>' +
              '<td><div class="tbl-actions"><button class="btn btn-outline btn-sm" data-edit="'+a.id+'">Edit</button><button class="btn btn-danger btn-sm" data-del="'+a.id+'">Delete</button></div></td></tr>';
          }).join('') + '</tbody></table></div>';
        body.querySelectorAll('[data-edit]').forEach(function(b){ b.addEventListener('click', function(){
          openAuthorModal(items.find(function(x){ return x.id == b.dataset.edit; }));
        });});
        body.querySelectorAll('[data-del]').forEach(function(b){ b.addEventListener('click', function(){
          confirmDialog('Delete author?', function(){ api('/api/authors/'+b.dataset.del, {method:'DELETE'}).then(function(){ toast('Deleted','success'); load(); }); });
        });});
      });
    }
    function openAuthorModal(item){
      item = item || {};
      openModal('<h3>'+(item.id?'Edit':'New')+' Author</h3>' +
        '<div class="field"><label>Name</label><input id="aname" value="'+escapeHtmlJs(item.name||'')+'"></div>' +
        '<div class="field"><label>Email</label><input id="aemail" value="'+escapeHtmlJs(item.email||'')+'"></div>' +
        '<div class="field"><label>Avatar URL</label><input id="aavatar" value="'+escapeHtmlJs(item.avatar||'')+'"></div>' +
        '<div class="field"><label>Bio</label><textarea id="abio" rows="3">'+escapeHtmlJs(item.bio||'')+'</textarea></div>' +
        '<div class="field"><label>Status</label><select id="astatus"><option value="active" '+((item.status||'active')==='active'?'selected':'')+'>Active</option><option value="inactive" '+(item.status==='inactive'?'selected':'')+'>Inactive</option></select></div>' +
        '<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="saveA">Save</button></div>');
      document.getElementById('saveA').addEventListener('click', function(){
        var payload = {
          name: document.getElementById('aname').value,
          email: document.getElementById('aemail').value,
          avatar: document.getElementById('aavatar').value,
          bio: document.getElementById('abio').value,
          status: document.getElementById('astatus').value
        };
        var url = item.id ? '/api/authors/'+item.id : '/api/authors';
        api(url, {method: item.id?'PUT':'POST', body: payload}).then(function(r){
          if(r.j.success){ toast('Saved','success'); closeModal(); load(); } else toast(r.j.message,'error');
        });
      });
    }
    document.getElementById('addBtn').addEventListener('click', function(){ openAuthorModal(null); });
    load();
  }

  // ------------- USERS -------------
  function bootUsers(){
    var c = document.querySelector('[data-role="list-container"]');
    document.querySelector('[data-role="actions"]').innerHTML = '<button class="btn btn-primary" id="addBtn">+ New User</button>';
    c.querySelector('[data-role="list-content"]').innerHTML =
      '<div class="filters"><input id="uq" placeholder="Search users..." style="flex:1;min-width:200px"></div>' +
      '<div id="listBody"><div class="skel"></div></div>';
    function load(){
      var q = document.getElementById('uq').value.trim();
      api('/api/users?q='+encodeURIComponent(q)).then(function(r){
        if(!r.j.success){ document.getElementById('listBody').innerHTML='<div class="empty">'+(r.j.message||'')+'</div>'; return; }
        var items = r.j.data.items;
        var body = document.getElementById('listBody');
        if(!items.length){ body.innerHTML = '<div class="empty">No users</div>'; return; }
        body.innerHTML = '<div style="overflow-x:auto"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
          items.map(function(u){
            return '<tr><td>'+escapeHtmlJs(u.name)+'</td><td>'+escapeHtmlJs(u.email)+'</td><td><span class="pill">'+u.role+'</span></td><td><span class="pill '+u.status+'">'+u.status+'</span></td>' +
              '<td><div class="tbl-actions"><button class="btn btn-outline btn-sm" data-edit="'+u.id+'">Edit</button><button class="btn btn-danger btn-sm" data-del="'+u.id+'">Delete</button></div></td></tr>';
          }).join('') + '</tbody></table></div>';
        body.querySelectorAll('[data-edit]').forEach(function(b){ b.addEventListener('click', function(){ openUserModal(items.find(function(x){ return x.id==b.dataset.edit; })); });});
        body.querySelectorAll('[data-del]').forEach(function(b){ b.addEventListener('click', function(){
          confirmDialog('Delete user?', function(){ api('/api/users/'+b.dataset.del, {method:'DELETE'}).then(function(res){ toast(res.j.message, res.j.success?'success':'error'); load(); }); });
        });});
      });
    }
    function openUserModal(item){
      item = item || {};
      openModal('<h3>'+(item.id?'Edit':'New')+' User</h3>' +
        '<div class="field"><label>Name</label><input id="uname" value="'+escapeHtmlJs(item.name||'')+'"></div>' +
        '<div class="field"><label>Email</label><input id="uemail" value="'+escapeHtmlJs(item.email||'')+'"></div>' +
        '<div class="field"><label>Password '+(item.id?'(leave empty to keep current)':'')+'</label><input id="upw" type="password" '+(item.id?'':'required')+'></div>' +
        '<div class="form-row">' +
          '<div class="field"><label>Role</label><select id="urole">' + ['admin','editor','author','user'].map(function(r){ return '<option value="'+r+'" '+((item.role||'user')===r?'selected':'')+'>'+r+'</option>'; }).join('') + '</select></div>' +
          '<div class="field"><label>Status</label><select id="ustatus"><option value="active" '+((item.status||'active')==='active'?'selected':'')+'>Active</option><option value="suspended" '+(item.status==='suspended'?'selected':'')+'>Suspended</option></select></div>' +
        '</div>' +
        '<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="saveU">Save</button></div>');
      document.getElementById('saveU').addEventListener('click', function(){
        var payload = {
          name: document.getElementById('uname').value,
          email: document.getElementById('uemail').value,
          role: document.getElementById('urole').value,
          status: document.getElementById('ustatus').value
        };
        var pw = document.getElementById('upw').value;
        if(pw) payload.password = pw;
        var url = item.id ? '/api/users/'+item.id : '/api/users';
        api(url, {method: item.id?'PUT':'POST', body: payload}).then(function(r){
          if(r.j.success){ toast('Saved','success'); closeModal(); load(); } else toast(r.j.message,'error');
        });
      });
    }
    document.getElementById('addBtn').addEventListener('click', function(){ openUserModal(null); });
    document.getElementById('uq').addEventListener('input', debounce(load, 350));
    load();
  }

  // ------------- COMMENTS -------------
  function bootComments(){
    var c = document.querySelector('[data-role="list-container"]');
    c.querySelector('[data-role="list-content"]').innerHTML =
      '<div class="filters">' +
        '<select id="cmStatus"><option value="">All</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="spam">Spam</option></select>' +
        '<input id="cmQ" placeholder="Search..." style="flex:1;min-width:180px">' +
      '</div>' +
      '<div id="listBody"><div class="skel"></div></div>';
    function load(){
      var qs = '?status=' + document.getElementById('cmStatus').value + '&q=' + encodeURIComponent(document.getElementById('cmQ').value.trim());
      api('/api/comments'+qs).then(function(r){
        if(!r.j.success) return;
        var items = r.j.data.items;
        var body = document.getElementById('listBody');
        if(!items.length){ body.innerHTML = '<div class="empty">No comments</div>'; return; }
        body.innerHTML = items.map(function(cm){
          return '<div class="card" style="box-shadow:none;border:1px solid var(--border);padding:14px;margin-bottom:12px">' +
            '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><div><strong>'+escapeHtmlJs(cm.name)+'</strong> <span style="color:var(--muted);font-size:12px">on "'+escapeHtmlJs(cm.news_title||'')+'" · '+(cm.created_at||'').slice(0,16)+'</span></div><span class="pill '+cm.status+'">'+cm.status+'</span></div>' +
            '<div style="margin:8px 0;color:#3f3f46">'+escapeHtmlJs(cm.content)+'</div>' +
            '<div class="tbl-actions">' +
              '<button class="btn btn-outline btn-sm" data-status="approved" data-id="'+cm.id+'">Approve</button>' +
              '<button class="btn btn-outline btn-sm" data-status="rejected" data-id="'+cm.id+'">Reject</button>' +
              '<button class="btn btn-outline btn-sm" data-status="spam" data-id="'+cm.id+'">Spam</button>' +
              '<button class="btn btn-danger btn-sm" data-del="'+cm.id+'">Delete</button>' +
            '</div></div>';
        }).join('');
        body.querySelectorAll('[data-status]').forEach(function(b){ b.addEventListener('click', function(){
          api('/api/comments/'+b.dataset.id, {method:'PUT', body:{status:b.dataset.status}}).then(function(){ toast('Updated','success'); load(); });
        });});
        body.querySelectorAll('[data-del]').forEach(function(b){ b.addEventListener('click', function(){
          confirmDialog('Delete this comment?', function(){ api('/api/comments/'+b.dataset.del, {method:'DELETE'}).then(function(){ toast('Deleted','success'); load(); }); });
        });});
      });
    }
    document.getElementById('cmStatus').addEventListener('change', load);
    document.getElementById('cmQ').addEventListener('input', debounce(load, 350));
    load();
  }

  // ------------- MEDIA -------------
  function bootMedia(){
    var c = document.querySelector('[data-role="list-container"]');
    document.querySelector('[data-role="actions"]').innerHTML = '<button class="btn btn-primary" id="addBtn">+ Add URL</button>';
    c.querySelector('[data-role="list-content"]').innerHTML =
      '<div class="filters"><input id="mq" placeholder="Search media..." style="flex:1;min-width:200px"></div>' +
      '<div id="listBody" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px"></div>';
    function load(){
      api('/api/media?q='+encodeURIComponent(document.getElementById('mq').value)).then(function(r){
        if(!r.j.success) return;
        var items = r.j.data.items;
        var body = document.getElementById('listBody');
        if(!items.length){ body.innerHTML = '<div class="empty" style="grid-column:1/-1">No media yet. Add one by URL.</div>'; return; }
        body.innerHTML = items.map(function(m){
          return '<div style="background:#fafafa;border-radius:12px;padding:10px;border:1px solid var(--border)">' +
            '<img src="'+escapeHtmlJs(m.url)+'" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px" alt="'+escapeHtmlJs(m.alt_text||'')+'">' +
            '<div style="font-size:12px;margin-top:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+escapeHtmlJs(m.filename)+'</div>' +
            '<div class="tbl-actions" style="margin-top:6px"><button class="btn btn-outline btn-sm" data-copy="'+escapeHtmlJs(m.url)+'">Copy URL</button><button class="btn btn-danger btn-sm" data-del="'+m.id+'">×</button></div>' +
          '</div>';
        }).join('');
        body.querySelectorAll('[data-copy]').forEach(function(b){ b.addEventListener('click', function(){ navigator.clipboard.writeText(b.dataset.copy); toast('URL copied','success'); });});
        body.querySelectorAll('[data-del]').forEach(function(b){ b.addEventListener('click', function(){ confirmDialog('Remove from library?', function(){ api('/api/media/'+b.dataset.del, {method:'DELETE'}).then(function(){ load(); toast('Removed','success'); }); }); }); });
      });
    }
    document.getElementById('addBtn').addEventListener('click', function(){
      openModal('<h3>Add Media by URL</h3>' +
        '<div class="field"><label>Image URL</label><input id="murl" placeholder="https://..."></div>' +
        '<div class="field"><label>Filename</label><input id="mfn" placeholder="optional"></div>' +
        '<div class="field"><label>Alt text</label><input id="malt"></div>' +
        '<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="saveM">Save</button></div>');
      document.getElementById('saveM').addEventListener('click', function(){
        api('/api/media', {method:'POST', body:{
          url: document.getElementById('murl').value,
          filename: document.getElementById('mfn').value,
          alt_text: document.getElementById('malt').value,
          type: 'image'
        }}).then(function(r){ if(r.j.success){ toast('Added','success'); closeModal(); load(); } else toast(r.j.message,'error'); });
      });
    });
    document.getElementById('mq').addEventListener('input', debounce(load, 350));
    load();
  }

  // ------------- ADS -------------
  function bootAds(){
    var c = document.querySelector('[data-role="list-container"]');
    document.querySelector('[data-role="actions"]').innerHTML = '<button class="btn btn-primary" id="addBtn">+ New Ad</button>';
    c.querySelector('[data-role="list-content"]').innerHTML = '<div id="listBody"><div class="skel"></div></div>';
    var POSITIONS = ['header','homepage_top','homepage_middle','sidebar','article_top','article_middle','article_bottom','footer'];
    function load(){
      api('/api/ads').then(function(r){
        if(!r.j.success) return;
        var items = r.j.data.items;
        var body = document.getElementById('listBody');
        if(!items.length){ body.innerHTML = '<div class="empty">No advertisements yet</div>'; return; }
        body.innerHTML = '<div style="overflow-x:auto"><table><thead><tr><th>Name</th><th>Position</th><th>Status</th><th>Dates</th><th>Actions</th></tr></thead><tbody>' +
          items.map(function(a){
            return '<tr><td>'+escapeHtmlJs(a.name)+'</td><td><span class="pill">'+a.position+'</span></td><td><span class="pill '+a.status+'">'+a.status+'</span></td>' +
              '<td style="font-size:12px">'+(a.start_date||'—')+' → '+(a.end_date||'—')+'</td>' +
              '<td><div class="tbl-actions"><button class="btn btn-outline btn-sm" data-edit="'+a.id+'">Edit</button><button class="btn btn-danger btn-sm" data-del="'+a.id+'">Delete</button></div></td></tr>';
          }).join('') + '</tbody></table></div>';
        body.querySelectorAll('[data-edit]').forEach(function(b){ b.addEventListener('click', function(){ openAdModal(items.find(function(x){ return x.id==b.dataset.edit; })); });});
        body.querySelectorAll('[data-del]').forEach(function(b){ b.addEventListener('click', function(){ confirmDialog('Delete this ad?', function(){ api('/api/ads/'+b.dataset.del, {method:'DELETE'}).then(function(){ load(); toast('Deleted','success'); }); }); }); });
      });
    }
    function openAdModal(item){
      item = item || {};
      openModal('<h3>'+(item.id?'Edit':'New')+' Advertisement</h3>' +
        '<div class="field"><label>Name</label><input id="aname" value="'+escapeHtmlJs(item.name||'')+'"></div>' +
        '<div class="field"><label>Position</label><select id="apos">'+POSITIONS.map(function(p){ return '<option value="'+p+'" '+(item.position===p?'selected':'')+'>'+p+'</option>'; }).join('')+'</select></div>' +
        '<div class="field"><label>Image URL</label><input id="aimg" value="'+escapeHtmlJs(item.image_url||'')+'"></div>' +
        '<div class="field"><label>Target URL</label><input id="atgt" value="'+escapeHtmlJs(item.target_url||'')+'"></div>' +
        '<div class="field"><label>HTML/JS Ad Code (paste AdSense or other)</label><textarea id="acode" rows="4">'+escapeHtmlJs(item.code||'')+'</textarea></div>' +
        '<div class="form-row">' +
          '<div class="field"><label>Start Date</label><input type="date" id="astart" value="'+escapeHtmlJs(item.start_date||'')+'"></div>' +
          '<div class="field"><label>End Date</label><input type="date" id="aend" value="'+escapeHtmlJs(item.end_date||'')+'"></div>' +
        '</div>' +
        '<div class="field"><label>Status</label><select id="astatus"><option value="active" '+((item.status||'active')==='active'?'selected':'')+'>Active</option><option value="inactive" '+(item.status==='inactive'?'selected':'')+'>Inactive</option></select></div>' +
        '<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="saveAd">Save</button></div>');
      document.getElementById('saveAd').addEventListener('click', function(){
        var payload = {
          name: document.getElementById('aname').value,
          position: document.getElementById('apos').value,
          image_url: document.getElementById('aimg').value,
          target_url: document.getElementById('atgt').value,
          code: document.getElementById('acode').value,
          start_date: document.getElementById('astart').value,
          end_date: document.getElementById('aend').value,
          status: document.getElementById('astatus').value
        };
        var url = item.id ? '/api/ads/'+item.id : '/api/ads';
        api(url, {method: item.id?'PUT':'POST', body: payload}).then(function(r){
          if(r.j.success){ toast('Saved','success'); closeModal(); load(); } else toast(r.j.message,'error');
        });
      });
    }
    document.getElementById('addBtn').addEventListener('click', function(){ openAdModal(null); });
    load();
  }

  // ------------- PAGES -------------
  function bootPages(){
    var c = document.querySelector('[data-role="list-container"]');
    document.querySelector('[data-role="actions"]').innerHTML = '<button class="btn btn-primary" id="addBtn">+ New Page</button>';
    c.querySelector('[data-role="list-content"]').innerHTML = '<div id="listBody"><div class="skel"></div></div>';
    function load(){
      api('/api/pages').then(function(r){
        if(!r.j.success) return;
        var items = r.j.data.items;
        var body = document.getElementById('listBody');
        if(!items.length){ body.innerHTML = '<div class="empty">No pages yet</div>'; return; }
        body.innerHTML = '<div style="overflow-x:auto"><table><thead><tr><th>Title</th><th>Slug</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
          items.map(function(p){
            return '<tr><td>'+escapeHtmlJs(p.title)+'</td><td><a href="/page/'+p.slug+'" target="_blank">/'+p.slug+'</a></td><td><span class="pill '+p.status+'">'+p.status+'</span></td>' +
              '<td><div class="tbl-actions"><button class="btn btn-outline btn-sm" data-edit="'+p.id+'">Edit</button><button class="btn btn-danger btn-sm" data-del="'+p.id+'">Delete</button></div></td></tr>';
          }).join('') + '</tbody></table></div>';
        body.querySelectorAll('[data-edit]').forEach(function(b){ b.addEventListener('click', function(){ openPageModal(items.find(function(x){ return x.id==b.dataset.edit; })); });});
        body.querySelectorAll('[data-del]').forEach(function(b){ b.addEventListener('click', function(){ confirmDialog('Delete page?', function(){ api('/api/pages/'+b.dataset.del, {method:'DELETE'}).then(function(){ load(); toast('Deleted','success'); }); }); }); });
      });
    }
    function openPageModal(item){
      item = item || {};
      openModal('<h3>'+(item.id?'Edit':'New')+' Page</h3>' +
        '<div class="field"><label>Title</label><input id="ptitle" value="'+escapeHtmlJs(item.title||'')+'"></div>' +
        '<div class="field"><label>Slug</label><input id="pslug" value="'+escapeHtmlJs(item.slug||'')+'" placeholder="auto"></div>' +
        '<div class="field"><label>Content (HTML allowed)</label><textarea id="pcontent" rows="8">'+escapeHtmlJs(item.content||'')+'</textarea></div>' +
        '<div class="form-row">' +
          '<div class="field"><label>Meta Title</label><input id="pmtitle" value="'+escapeHtmlJs(item.meta_title||'')+'"></div>' +
          '<div class="field"><label>Status</label><select id="pstatus"><option value="published" '+((item.status||'published')==='published'?'selected':'')+'>Published</option><option value="draft" '+(item.status==='draft'?'selected':'')+'>Draft</option></select></div>' +
        '</div>' +
        '<div class="field"><label>Meta Description</label><textarea id="pmdesc" rows="2">'+escapeHtmlJs(item.meta_description||'')+'</textarea></div>' +
        '<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="saveP">Save</button></div>');
      document.getElementById('saveP').addEventListener('click', function(){
        var payload = {
          title: document.getElementById('ptitle').value,
          slug: document.getElementById('pslug').value,
          content: document.getElementById('pcontent').value,
          meta_title: document.getElementById('pmtitle').value,
          meta_description: document.getElementById('pmdesc').value,
          status: document.getElementById('pstatus').value
        };
        var url = item.id ? '/api/pages/'+item.id : '/api/pages';
        api(url, {method: item.id?'PUT':'POST', body: payload}).then(function(r){
          if(r.j.success){ toast('Saved','success'); closeModal(); load(); } else toast(r.j.message,'error');
        });
      });
    }
    document.getElementById('addBtn').addEventListener('click', function(){ openPageModal(null); });
    load();
  }

  // ------------- NAVIGATION -------------
  function bootNav(){
    var c = document.querySelector('[data-role="list-container"]');
    document.querySelector('[data-role="actions"]').innerHTML = '<button class="btn btn-primary" id="addBtn">+ New Item</button>';
    c.querySelector('[data-role="list-content"]').innerHTML = '<div id="listBody"><div class="skel"></div></div>';
    function load(){
      api('/api/navigation?all=1').then(function(r){
        if(!r.j.success) return;
        var items = r.j.data.items;
        var body = document.getElementById('listBody');
        if(!items.length){ body.innerHTML = '<div class="empty">No navigation yet</div>'; return; }
        body.innerHTML = '<div style="overflow-x:auto"><table><thead><tr><th>Title</th><th>URL</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
          items.map(function(n){
            return '<tr><td>'+escapeHtmlJs(n.title)+'</td><td>'+escapeHtmlJs(n.url)+'</td><td>'+n.sort_order+'</td><td><span class="pill '+n.status+'">'+n.status+'</span></td>' +
              '<td><div class="tbl-actions"><button class="btn btn-outline btn-sm" data-edit="'+n.id+'">Edit</button><button class="btn btn-danger btn-sm" data-del="'+n.id+'">Delete</button></div></td></tr>';
          }).join('') + '</tbody></table></div>';
        body.querySelectorAll('[data-edit]').forEach(function(b){ b.addEventListener('click', function(){ openNavModal(items.find(function(x){ return x.id==b.dataset.edit; })); });});
        body.querySelectorAll('[data-del]').forEach(function(b){ b.addEventListener('click', function(){ confirmDialog('Delete nav item?', function(){ api('/api/navigation/'+b.dataset.del, {method:'DELETE'}).then(function(){ load(); toast('Deleted','success'); }); }); }); });
      });
    }
    function openNavModal(item){
      item = item || {};
      openModal('<h3>'+(item.id?'Edit':'New')+' Nav Item</h3>' +
        '<div class="field"><label>Title</label><input id="ntitle" value="'+escapeHtmlJs(item.title||'')+'"></div>' +
        '<div class="field"><label>URL</label><input id="nurl" value="'+escapeHtmlJs(item.url||'')+'" placeholder="/ or /category/..."></div>' +
        '<div class="form-row">' +
          '<div class="field"><label>Order</label><input id="norder" type="number" value="'+(item.sort_order||0)+'"></div>' +
          '<div class="field"><label>Status</label><select id="nstatus"><option value="active" '+((item.status||'active')==='active'?'selected':'')+'>Active</option><option value="inactive" '+(item.status==='inactive'?'selected':'')+'>Inactive</option></select></div>' +
        '</div>' +
        '<div class="modal-actions"><button class="btn btn-outline" onclick="closeModal()">Cancel</button><button class="btn btn-primary" id="saveN">Save</button></div>');
      document.getElementById('saveN').addEventListener('click', function(){
        var payload = {
          title: document.getElementById('ntitle').value,
          url: document.getElementById('nurl').value,
          sort_order: parseInt(document.getElementById('norder').value,10) || 0,
          status: document.getElementById('nstatus').value
        };
        var url = item.id ? '/api/navigation/'+item.id : '/api/navigation';
        api(url, {method: item.id?'PUT':'POST', body: payload}).then(function(r){
          if(r.j.success){ toast('Saved','success'); closeModal(); load(); } else toast(r.j.message,'error');
        });
      });
    }
    document.getElementById('addBtn').addEventListener('click', function(){ openNavModal(null); });
    load();
  }

  // ------------- SETTINGS -------------
  function bootSettings(){
    var c = document.querySelector('[data-role="list-container"]');
    c.querySelector('[data-role="list-content"]').innerHTML = '<div id="settingsForm"><div class="skel"></div></div>';
    api('/api/settings').then(function(r){
      if(!r.j.success) return;
      var s = r.j.data.settings;
      var groups = [
        { t:'General', f:[['site_name','Site Name'],['tagline','Tagline'],['site_description','Description'],['logo','Logo URL'],['favicon','Favicon URL']] },
        { t:'Contact', f:[['contact_email','Email'],['phone','Phone'],['address','Address']] },
        { t:'Social', f:[['facebook','Facebook'],['instagram','Instagram'],['youtube','YouTube'],['twitter','X/Twitter'],['telegram','Telegram'],['whatsapp','WhatsApp']] },
        { t:'Appearance', f:[['primary_color','Primary Color'],['secondary_color','Secondary Color'],['copyright','Copyright Text']] },
        { t:'Features', f:[['comments_enabled','Comments (1/0)'],['registration_enabled','Registration (1/0)'],['newsletter_enabled','Newsletter (1/0)'],['breaking_enabled','Breaking (1/0)']] },
        { t:'Homepage', f:[['show_hero','Show Hero (1/0)'],['show_latest','Show Latest (1/0)'],['show_trending','Show Trending (1/0)'],['show_featured','Show Featured (1/0)'],['show_sidebar','Show Sidebar (1/0)'],['show_newsletter','Show Newsletter (1/0)'],['hero_count','Hero Count'],['latest_count','Latest Count'],['trending_count','Trending Count']] },
        { t:'Maintenance', f:[['maintenance_mode','Maintenance Mode (1/0)']] }
      ];
      var html = groups.map(function(g){
        return '<div class="card"><h3>'+g.t+'</h3>' +
          '<div class="form-row">' + g.f.map(function(kv){
            return '<div class="field"><label>'+kv[1]+'</label><input name="'+kv[0]+'" value="'+escapeHtmlJs(s[kv[0]]||'')+'"></div>';
          }).join('') + '</div></div>';
      }).join('') + '<button class="btn btn-primary" id="saveSettings">Save Settings</button>';
      document.getElementById('settingsForm').innerHTML = html;
      document.getElementById('saveSettings').addEventListener('click', function(){
        var payload = {};
        document.querySelectorAll('#settingsForm input').forEach(function(i){ payload[i.name] = i.value; });
        api('/api/settings', {method:'PUT', body: payload}).then(function(r){ toast(r.j.message, r.j.success?'success':'error'); });
      });
    });
  }

  // ------------- SEO -------------
  function bootSeo(){
    var c = document.querySelector('[data-role="list-container"]');
    c.querySelector('[data-role="list-content"]').innerHTML = '<div id="seoForm"><div class="skel"></div></div>';
    api('/api/settings').then(function(r){
      if(!r.j.success) return;
      var s = r.j.data.settings;
      var fields = [['seo_title','Site Title'],['seo_description','Meta Description'],['seo_keywords','Keywords'],['og_title','OG Title'],['og_description','OG Description'],['og_image','OG Image URL'],['twitter_card','Twitter Card'],['canonical_url','Canonical URL']];
      document.getElementById('seoForm').innerHTML = '<div class="card"><h3>SEO Settings</h3>' + fields.map(function(f){
        return '<div class="field"><label>'+f[1]+'</label><input name="'+f[0]+'" value="'+escapeHtmlJs(s[f[0]]||'')+'"></div>';
      }).join('') + '<button class="btn btn-primary" id="saveSeo">Save SEO</button></div>' +
      '<div class="card"><h3>Generated Files</h3><div style="display:flex;gap:10px;flex-wrap:wrap"><a href="/sitemap.xml" target="_blank" class="btn btn-outline">View sitemap.xml</a><a href="/robots.txt" target="_blank" class="btn btn-outline">View robots.txt</a></div></div>';
      document.getElementById('saveSeo').addEventListener('click', function(){
        var payload = {};
        document.querySelectorAll('#seoForm input').forEach(function(i){ payload[i.name] = i.value; });
        api('/api/settings', {method:'PUT', body: payload}).then(function(r){ toast(r.j.message, r.j.success?'success':'error'); });
      });
    });
  }

  function debounce(fn, ms){
    var t; return function(){
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function(){ fn.apply(self, args); }, ms);
    };
  }
})();
`;
