export const PUBLIC_JS = String.raw`
(function(){
  'use strict';

  // Dark mode
  var dark = localStorage.getItem('nh_dark') === '1';
  if (dark) document.body.classList.add('dark');
  window.toggleDark = function(){
    dark = !dark;
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('nh_dark', dark ? '1':'0');
  };

  // Mobile drawer
  var drawer = document.getElementById('mobileDrawer');
  var backdrop = document.getElementById('drawerBackdrop');
  var toggleBtn = document.getElementById('mobileToggle');
  var closeDrawer = document.getElementById('closeDrawer');
  function openDrawer(){ if(drawer){ drawer.classList.add('open'); backdrop.classList.add('open'); } }
  function closeD(){ if(drawer){ drawer.classList.remove('open'); backdrop.classList.remove('open'); } }
  if(toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if(closeDrawer) closeDrawer.addEventListener('click', closeD);
  if(backdrop) backdrop.addEventListener('click', closeD);

  // Search
  var searchBtn = document.getElementById('openSearch');
  if(searchBtn) searchBtn.addEventListener('click', function(){ location.href = '/search'; });
  var searchForm = document.getElementById('searchForm');
  if(searchForm){
    searchForm.addEventListener('submit', function(e){
      e.preventDefault();
      var q = searchForm.querySelector('input[name=q]').value.trim();
      location.href = '/search?q=' + encodeURIComponent(q);
    });
  }

  // Newsletter
  var nlForm = document.getElementById('newsletterForm');
  if(nlForm){
    nlForm.addEventListener('submit', function(e){
      e.preventDefault();
      var email = nlForm.querySelector('input[name=email]').value.trim();
      fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({email: email})
      }).then(function(r){ return r.json(); }).then(function(j){
        toast(j.message || (j.success ? 'Subscribed' : 'Error'), j.success ? 'success' : 'error');
        if(j.success) nlForm.reset();
      }).catch(function(){ toast('Network error', 'error'); });
    });
  }

  // Comments
  var commentForm = document.getElementById('commentForm');
  if(commentForm){
    commentForm.addEventListener('submit', function(e){
      e.preventDefault();
      var newsId = commentForm.dataset.newsId;
      var fd = new FormData(commentForm);
      fetch('/api/news/' + newsId + '/comments', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          content: fd.get('content')
        })
      }).then(function(r){ return r.json(); }).then(function(j){
        toast(j.message || 'Submitted', j.success ? 'success':'error');
        if(j.success) commentForm.reset();
      });
    });
  }

  // Share
  document.querySelectorAll('[data-share]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      var url = encodeURIComponent(location.href);
      var title = encodeURIComponent(document.title);
      var kind = el.dataset.share;
      var map = {
        facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
        twitter:  'https://twitter.com/intent/tweet?url=' + url + '&text=' + title,
        linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
        whatsapp: 'https://api.whatsapp.com/send?text=' + title + ' ' + url,
        telegram: 'https://t.me/share/url?url=' + url + '&text=' + title
      };
      window.open(map[kind] || url, '_blank', 'width=640,height=500');
    });
  });

  // Copy link
  document.querySelectorAll('[data-copy]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      navigator.clipboard.writeText(location.href).then(function(){
        toast('Link copied', 'success');
      });
    });
  });

  // Toast
  window.toast = function(message, type){
    var wrap = document.getElementById('toastWrap');
    if(!wrap){ wrap = document.createElement('div'); wrap.id = 'toastWrap'; wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
    var t = document.createElement('div');
    t.className = 'toast ' + (type || '');
    t.textContent = message;
    wrap.appendChild(t);
    setTimeout(function(){ t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(function(){ t.remove(); }, 300); }, 3200);
  };

  // Lazy image fade in
  document.querySelectorAll('img[loading=lazy]').forEach(function(img){
    img.style.opacity = 0;
    img.style.transition = 'opacity .4s';
    if(img.complete){ img.style.opacity = 1; }
    else img.addEventListener('load', function(){ img.style.opacity = 1; });
  });

})();
`;
