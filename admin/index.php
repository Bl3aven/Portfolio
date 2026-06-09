<?php
session_start();

$CONFIG = __DIR__ . '/config.php';
if (file_exists($CONFIG)) require $CONFIG;
$PASS = defined('ADMIN_PASS') ? ADMIN_PASS : 'AdminPortfolio2026!';

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$flash  = '';
$flashMsg = '';

if ($action === 'logout') { session_destroy(); header('Location: /admin/'); exit; }

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (hash_equals(hash('sha256', $PASS), hash('sha256', trim($_POST['pass'] ?? '')))) {
        $_SESSION['ok'] = true;
        $redirect = $_GET['redirect'] ?? '/admin/';
        header('Location: ' . $redirect);
        exit;
    }
    $flash = 'error'; $flashMsg = 'Mot de passe incorrect.';
}

$isAuth = !empty($_SESSION['ok']);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Admin — tournayre.ovh</title>
<meta name="robots" content="noindex,nofollow">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --accent:#ff8c42;--ad:rgba(255,140,66,.1);
  --bg:#0a0a0c;--s:rgba(255,255,255,.04);
  --b:rgba(255,255,255,.09);--t:#eaeaec;
  --m:rgba(255,255,255,.45);--g:#36d399;--r:#ff6b6b;
}
html,body{min-height:100vh;background:var(--bg);color:var(--t);font-family:Inter,-apple-system,sans-serif;font-size:14px}
body{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem;gap:1.2rem}

/* ── Card ── */
.card{
  background:var(--s);border:1px solid var(--b);border-radius:14px;
  padding:2rem 2rem;width:100%;max-width:420px;
}
.card-title{font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:1.2rem}

/* ── Form elements ── */
label{display:flex;flex-direction:column;gap:.35rem;font-size:.74rem;color:var(--m);margin-bottom:.75rem}
input[type=password],input[type=text]{
  background:rgba(255,255,255,.06);border:1px solid var(--b);border-radius:8px;
  color:var(--t);font-size:.88rem;padding:.65rem .9rem;outline:none;
  transition:border-color .2s;width:100%;font-family:inherit;
}
input:focus{border-color:rgba(255,140,66,.4)}

/* ── Buttons ── */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:.45rem;
  padding:.65rem 1.2rem;border-radius:8px;font-size:.82rem;font-weight:600;
  cursor:pointer;font-family:inherit;text-decoration:none;transition:all .2s;border:1px solid var(--b);
  background:transparent;color:var(--m);width:100%;
}
.btn:hover{border-color:rgba(255,255,255,.22);color:var(--t)}
.btn.primary{background:var(--ad);color:var(--accent);border-color:rgba(255,140,66,.3)}
.btn.primary:hover{background:rgba(255,140,66,.18);border-color:rgba(255,140,66,.55)}
.btn.big{padding:.85rem 1.5rem;font-size:.9rem}
.btn.edit-btn{
  background:linear-gradient(135deg,rgba(255,140,66,.08),rgba(255,140,66,.04));
  color:var(--accent);border-color:rgba(255,140,66,.25);
  font-size:.92rem;padding:1rem 1.4rem;
}
.btn.edit-btn:hover{background:rgba(255,140,66,.15);border-color:rgba(255,140,66,.5)}

/* ── Flash messages ── */
.flash{padding:.65rem .9rem;border-radius:8px;font-size:.78rem;margin-bottom:1rem}
.flash.error{background:rgba(255,107,107,.1);border:1px solid rgba(255,107,107,.25);color:var(--r)}
.flash.success{background:rgba(54,211,153,.1);border:1px solid rgba(54,211,153,.25);color:var(--g)}

/* ── Logo ── */
.logo{font-size:.82rem;color:var(--m);letter-spacing:.04em;text-align:center}
.logo span{color:var(--accent);font-weight:700}
.divider{width:100%;max-width:420px;height:1px;background:var(--b)}

/* ── Password strength ── */
#pw-strength{height:3px;border-radius:2px;margin-top:.3rem;background:var(--b);overflow:hidden}
#pw-bar{height:100%;width:0;border-radius:2px;transition:width .3s,background .3s}
</style>
</head>
<body>

<div class="logo">tournayre.ovh <span>/ admin</span></div>

<?php if (!$isAuth): ?>
<!-- ── Login ────────────────────────────────────────────────── -->
<div class="card">
  <div class="card-title">Connexion</div>
  <?php if ($flash === 'error'): ?>
    <div class="flash error"><?= htmlspecialchars($flashMsg) ?></div>
  <?php endif ?>
  <form method="post">
    <input type="hidden" name="action" value="login">
    <label>Mot de passe<input type="password" name="pass" autofocus></label>
    <button type="submit" class="btn primary" style="margin-top:.25rem">Se connecter</button>
  </form>
</div>

<?php else: ?>
<!-- ── Dashboard ─────────────────────────────────────────────── -->
<div class="card">
  <div class="card-title">Éditeur de contenu</div>
  <a href="/?edit=1" class="btn edit-btn big">
    ✏ Ouvrir l'éditeur visuel
  </a>
  <p style="font-size:.72rem;color:var(--m);margin-top:.75rem;text-align:center;line-height:1.5">
    Le site complet s'ouvre en mode édition.<br>
    Cliquez sur n'importe quel texte pour le modifier.
  </p>
</div>

<div class="divider"></div>

<div class="card">
  <div class="card-title">Changer le mot de passe</div>
  <div id="pw-flash"></div>
  <form id="pw-form">
    <label>Mot de passe actuel<input type="password" id="pw-cur"></label>
    <label>Nouveau mot de passe<input type="password" id="pw-new" id="pw-new"><div id="pw-strength"><div id="pw-bar"></div></div></label>
    <label>Confirmer<input type="password" id="pw-confirm"></label>
    <button type="submit" class="btn primary" style="margin-top:.25rem">Mettre à jour</button>
  </form>
</div>

<a href="?action=logout" class="btn" style="max-width:420px;color:rgba(255,107,107,.5);border-color:rgba(255,107,107,.15)">Déconnexion</a>

<script>
// Password strength meter
document.getElementById('pw-new').addEventListener('input', function(){
  const v = this.value, bar = document.getElementById('pw-bar');
  let score = 0;
  if (v.length >= 8)  score++;
  if (v.length >= 12) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/\d/.test(v))   score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  const colors = ['','#ff6b6b','#febc2e','#febc2e','#36d399','#36d399'];
  bar.style.width  = (score * 20) + '%';
  bar.style.background = colors[score] || '';
});

// Password change via AJAX
document.getElementById('pw-form').addEventListener('submit', function(e){
  e.preventDefault();
  const cur     = document.getElementById('pw-cur').value;
  const newPass = document.getElementById('pw-new').value;
  const confirm = document.getElementById('pw-confirm').value;
  const flash   = document.getElementById('pw-flash');

  fetch('/admin/api.php', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({action:'change_password', current:cur, new:newPass, confirm})
  })
  .then(r => r.json())
  .then(d => {
    flash.innerHTML = d.ok
      ? '<div class="flash success">✓ ' + (d.message || 'Mot de passe mis à jour') + '</div>'
      : '<div class="flash error">' + (d.error || 'Erreur') + '</div>';
    if (d.ok) { document.getElementById('pw-cur').value = ''; document.getElementById('pw-new').value = ''; document.getElementById('pw-confirm').value = ''; document.getElementById('pw-bar').style.width='0'; }
  })
  .catch(() => { flash.innerHTML = '<div class="flash error">Erreur réseau</div>'; });
});
</script>

<?php endif ?>
</body>
</html>
