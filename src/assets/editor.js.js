export const EDITOR_JS = String.raw`
(function(){
  'use strict';

  var editor = document.getElementById('editor');
  var hidden = document.getElementById('contentHidden');
  var form = document.getElementById('articleForm');
  var saveBtn = document.getElementById('saveBtn');

  // Toolbar commands
  document.querySelectorAll('.editor-toolbar button').forEach(function(b){
    b.addEventListener('click', function(){
      var cmd = b.dataset.cmd;
      var val = b.dataset.val || null;
      editor.focus();
      if(cmd === 'createLink'){
        var url = prompt('Enter URL:');
        if(url) document.execCommand('createLink', false, url);
      } else if(cmd === 'insertImage'){
        var src = prompt('Enter image URL:');
        if(src) document.execCommand('insertImage', false, src);
      } else if(cmd === 'formatBlock'){
        document.execCommand('formatBlock', false, val);
      } else {
        document.execCommand(cmd, false, null);
      }
    });
  });

  // Save
  form.addEventListener('submit', function(e){
    e.preventDefault();
    hidden.value = editor.innerHTML;
    var fd = new FormData(form);
    var payload = Object.fromEntries(fd.entries());
    payload.is_featured = form.querySelector('[name=is_featured]').checked;
    payload.is_trending = form.querySelector('[name=is_trending]').checked;
    payload.is_breaking = form.querySelector('[name=is_breaking]').checked;
    if(payload.category_id) payload.category_id = parseInt(payload.category_id,10);
    if(payload.author_id) payload.author_id = parseInt(payload.author_id,10);
    var id = form.dataset.id;
    var url = id ? '/api/news/'+id : '/api/news';
    var method = id ? 'PUT' : 'POST';
    saveBtn.disabled = true; var oldTxt = saveBtn.textContent; saveBtn.textContent = 'Saving...';
    api(url, {method: method, body: payload}).then(function(r){
      saveBtn.disabled = false; saveBtn.textContent = oldTxt;
      if(r.j.success){
        toast('Saved successfully','success');
        if(!id){
          setTimeout(function(){ location.href = '/admin/news/edit/' + r.j.data.id; }, 700);
        }
      } else {
        toast(r.j.message || 'Error', 'error');
      }
    }).catch(function(){
      saveBtn.disabled = false; saveBtn.textContent = oldTxt;
      toast('Network error', 'error');
    });
  });
})();
`;
