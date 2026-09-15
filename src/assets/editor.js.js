export const EDITOR_JS = String.raw`
(function(){
  'use strict';

  var editor = document.getElementById('editor');
  var hidden = document.getElementById('contentHidden');
  var form = document.getElementById('articleForm');
  var saveBtn = document.getElementById('saveBtn');

  if (!editor || !form || !saveBtn) {
    console.error('[editor] Missing required elements', {
      editor: !!editor, form: !!form, saveBtn: !!saveBtn
    });
    return;
  }

  // ---- Toolbar commands ----
  document.querySelectorAll('.editor-toolbar button').forEach(function(b){
    b.addEventListener('click', function(e){
      e.preventDefault();
      var cmd = b.dataset.cmd;
      var val = b.dataset.val || null;
      editor.focus();
      try {
        if (cmd === 'createLink') {
          var url = prompt('Enter URL:');
          if (url) document.execCommand('createLink', false, url);
        } else if (cmd === 'insertImage') {
          var src = prompt('Enter image URL:');
          if (src) document.execCommand('insertImage', false, src);
        } else if (cmd === 'formatBlock') {
          document.execCommand('formatBlock', false, val);
        } else {
          document.execCommand(cmd, false, null);
        }
      } catch (err) { console.warn('execCommand error:', err); }
    });
  });

  // ---- Fallback: if button is outside form (Safari) ----
  if (saveBtn.form !== form) {
    saveBtn.addEventListener('click', function(e){
      e.preventDefault();
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
  }

  // ---- Submit ----
  form.addEventListener('submit', function(e){
    e.preventDefault();
    e.stopPropagation();

    // Sync editor content into hidden textarea
    hidden.value = editor.innerHTML;

    // Build payload
    var fd = new FormData(form);
    var payload = {};
    fd.forEach(function(v, k){ payload[k] = v; });

    // Force content from editor (in case textarea wasn't synced)
    payload.content = editor.innerHTML;

    // Boolean flags
    var cbF = form.querySelector('[name=is_featured]');
    var cbT = form.querySelector('[name=is_trending]');
    var cbB = form.querySelector('[name=is_breaking]');
    payload.is_featured = cbF ? cbF.checked : false;
    payload.is_trending = cbT ? cbT.checked : false;
    payload.is_breaking = cbB ? cbB.checked : false;

    // Clean FK fields
    if (!payload.category_id) delete payload.category_id;
    else payload.category_id = parseInt(payload.category_id, 10);
    if (!payload.author_id) delete payload.author_id;
    else payload.author_id = parseInt(payload.author_id, 10);

    var id = form.dataset.id;
    var url = id ? '/api/news/' + id : '/api/news';
    var method = id ? 'PUT' : 'POST';

    console.log('[editor] Submitting', method, url);

    saveBtn.disabled = true;
    var oldTxt = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';

    fetch(url, {
      method: method,
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    })
    .then(function(r){
      return r.text().then(function(txt){
        var json;
        try { json = JSON.parse(txt); }
        catch (e) { json = { success: false, message: 'Invalid response: ' + txt.slice(0, 200) }; }
        return { status: r.status, json: json };
      });
    })
    .then(function(res){
      saveBtn.disabled = false;
      saveBtn.textContent = oldTxt;
      console.log('[editor] Response', res.status, res.json);

      if (res.json.success) {
        if (typeof toast === 'function') toast('Saved successfully', 'success');
        else alert('Saved successfully');

        if (!id && res.json.data && res.json.data.id) {
          setTimeout(function(){ location.href = '/admin/news/edit/' + res.json.data.id; }, 700);
        } else {
          setTimeout(function(){ location.reload(); }, 700);
        }
      } else {
        var msg = res.json.message || ('HTTP ' + res.status);
        console.error('[editor] Save failed:', msg);
        if (typeof toast === 'function') toast(msg, 'error');
        else alert(msg);
      }
    })
    .catch(function(err){
      saveBtn.disabled = false;
      saveBtn.textContent = oldTxt;
      console.error('[editor] Network error:', err);
      if (typeof toast === 'function') toast('Network error: ' + err.message, 'error');
      else alert('Network error: ' + err.message);
    });
  });
})();
`;
