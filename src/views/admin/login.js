export function renderLogin({ next = '/admin', error = '' } = {}) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Admin Login — NewsHub</title>
  <link rel="stylesheet" href="/css/admin.css">
</head>
<body>
  <div id="toastWrap" class="toast-wrap"></div>
  <div class="login-wrap">
    <div class="login-card">
      <div class="logo"><span class="logo-mark">N</span> NewsHub</div>
      <h1>Welcome back</h1>
      <p class="sub">Sign in to your admin dashboard</p>
      ${error ? `<div style="background:#fee2e2;color:#991b1b;padding:11px 14px;border-radius:10px;font-size:13px;margin-bottom:16px">${error}</div>` : ''}
      <form id="loginForm" autocomplete="on">
        <input type="hidden" name="next" value="${next}">
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" required autocomplete="username" placeholder="admin@example.com">
        </div>
        <div class="field">
          <label for="password">Password</label>
          <div style="position:relative">
            <input id="password" name="password" type="password" required autocomplete="current-password" placeholder="••••••••">
            <button type="button" id="togglePw" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted);font-size:12px;padding:6px">Show</button>
          </div>
        </div>
        <button class="btn btn-primary btn-block" id="submitBtn" type="submit" style="margin-top:8px">Sign In</button>
      </form>
      <p style="text-align:center;margin-top:18px;font-size:13px;color:var(--muted)"><a href="/" style="color:var(--primary-dark)">← Back to site</a></p>
    </div>
  </div>
  <script>
    var pwInput = document.getElementById('password');
    var toggle = document.getElementById('togglePw');
    toggle.addEventListener('click', function(){
      var isPw = pwInput.type === 'password';
      pwInput.type = isPw ? 'text' : 'password';
      toggle.textContent = isPw ? 'Hide' : 'Show';
    });
    var form = document.getElementById('loginForm');
    var submit = document.getElementById('submitBtn');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      submit.disabled = true; submit.textContent = 'Signing in...';
      var fd = new FormData(form);
      fetch('/api/auth/login', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') })
      }).then(function(r){ return r.json().then(function(j){ return { ok: r.ok, j: j }; }); })
      .then(function(res){
        if(res.j.success){
          location.href = fd.get('next') || '/admin';
        } else {
          submit.disabled = false; submit.textContent = 'Sign In';
          var err = document.createElement('div');
          err.style.cssText = 'background:#fee2e2;color:#991b1b;padding:11px 14px;border-radius:10px;font-size:13px;margin-bottom:16px';
          err.textContent = res.j.message || 'Login failed';
          var existing = form.querySelector('.err');
          if (existing) existing.remove();
          err.className = 'err';
          form.insertBefore(err, form.firstChild);
        }
      })
      .catch(function(){ submit.disabled = false; submit.textContent = 'Sign In'; });
    });
  </script>
</body>
</html>`;
}

export function renderSetup({ error = '' } = {}) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Setup — NewsHub</title>
  <link rel="stylesheet" href="/css/admin.css">
</head>
<body>
  <div class="login-wrap">
    <div class="login-card">
      <div class="logo"><span class="logo-mark">N</span> NewsHub Setup</div>
      <h1>Create your admin account</h1>
      <p class="sub">This is a one-time setup. It will be disabled once an admin exists.</p>
      ${error ? `<div style="background:#fee2e2;color:#991b1b;padding:11px 14px;border-radius:10px;font-size:13px;margin-bottom:16px">${error}</div>` : ''}
      <form id="setupForm">
        <div class="field"><label>Name</label><input name="name" required></div>
        <div class="field"><label>Email</label><input name="email" type="email" required></div>
        <div class="field"><label>Password</label><input name="password" type="password" required minlength="8" placeholder="At least 8 characters"></div>
        <div class="field"><label>Confirm Password</label><input name="confirmPassword" type="password" required minlength="8"></div>
        <button class="btn btn-primary btn-block" id="submitBtn">Create Admin</button>
      </form>
    </div>
  </div>
  <script>
    document.getElementById('setupForm').addEventListener('submit', function(e){
      e.preventDefault();
      var btn = document.getElementById('submitBtn');
      btn.disabled = true; btn.textContent = 'Creating...';
      var fd = new FormData(e.target);
      var payload = Object.fromEntries(fd.entries());
      fetch('/api/auth/setup', {
        method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload)
      }).then(function(r){ return r.json(); }).then(function(j){
        if(j.success){ location.href = '/admin'; }
        else { alert(j.message || 'Setup failed'); btn.disabled = false; btn.textContent = 'Create Admin'; }
      }).catch(function(){ btn.disabled = false; btn.textContent = 'Create Admin'; });
    });
  </script>
</body>
</html>`;
}
