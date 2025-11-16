#!/usr/bin/env bash
# create_galerie.sh — Setup idempotent Flask (Gunicorn+Nginx) + offline fallback + SSL
# Ce script n'écrase pas les fichiers existants (wsgi, service systemd, vhost). Certbot pourra modifier le vhost pour SSL.

set -euo pipefail

# --------- Variables à adapter ---------
PROJECT_DIR="/var/www/galerie-dessin"
PROJECT_NAME="galerie-dessin"
SYSTEMD_SERVICE="galerie"
DOMAIN="gallerie.yukina.ovh"          # ← FQDN
ADMIN_EMAIL="noreply@yukina.ovh"       # ← email pour Let's Encrypt
PYTHON_BIN="python3"
VENV_DIR="$PROJECT_DIR/venv"
UPLOADS_DIR="$PROJECT_DIR/static/uploads"
NGINX_SITE_NAME="$DOMAIN"             # /etc/nginx/sites-available/$NGINX_SITE_NAME
# --------------------------------------

msg()  { echo -e "\033[1;32m[OK]\033[0m $*"; }
warn() { echo -e "\033[1;33m[WARN]\033[0m $*"; }
info() { echo -e "\033[1;34m[INFO]\033[0m $*"; }

ensure_dir()  { [[ -d "$1" ]] || { mkdir -p "$1"; msg "Créé dossier : $1"; }; }
ensure_file() { [[ -f "$1" ]] || { touch "$1"; msg "Créé fichier : $1"; }; }

write_if_absent() {
  local target="$1"
  if [[ -e "$target" ]]; then
    info "Existe déjà : $target (pas de réécriture)."
  else
    # shellcheck disable=SC2094
    cat > "$target"
    msg "Créé : $target"
  fi
}

symlink_if_absent() {
  local src="$1" dst="$2"
  if [[ -L "$dst" || -e "$dst" ]]; then
    info "Lien/fichier existe : $dst (pas de réécriture)."
  else
    ln -s "$src" "$dst"
    msg "Symlink créé : $dst -> $src"
  fi
}

need_cmd() { command -v "$1" >/dev/null 2>&1; }

# --------- 0) Packages utiles (optionnel mais pratique) ---------
if need_cmd apt-get; then
  DEBIAN_FRONTEND=noninteractive apt-get update -y >/dev/null || true
  apt-get install -y nginx python3-venv >/dev/null || true
fi

# --------- 1) Arborescence projet ---------
ensure_dir  "$PROJECT_DIR"
ensure_dir  "$PROJECT_DIR/static/css"
ensure_dir  "$UPLOADS_DIR"
ensure_dir  "$PROJECT_DIR/templates/admin"

for f in app.py config.py models.py email_utils.py forms.py requirements.txt; do
  ensure_file "$PROJECT_DIR/$f"
done

for f in base.html index.html _image_panel.html _comments_list.html; do
  ensure_file "$PROJECT_DIR/templates/$f"
done

for f in login.html twofa.html reset_request.html reset_form.html dashboard.html upload.html _image_row.html; do
  ensure_file "$PROJECT_DIR/templates/admin/$f"
done

# offline.html (page de secours)
OFFLINE_HTML="$PROJECT_DIR/static/offline.html"
if [[ ! -f "$OFFLINE_HTML" ]]; then
  cat > "$OFFLINE_HTML" <<'EOF'
<!DOCTYPE html>
<html lang="fr"><head>
<meta charset="UTF-8"><title>Galerie indisponible</title>
<style>body{background:#0c0d10;color:#e6e6e6;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center} .box{max-width:640px} h1{font-size:2em;margin:.2em 0} p{color:#aaa}</style>
</head><body><div class="box">
<h1>🚧 Galerie momentanément indisponible</h1>
<p>L’application est en maintenance ou temporairement arrêtée.<br>Merci de revenir dans quelques minutes.</p>
</div></body></html>
EOF
  msg "Créé : $OFFLINE_HTML"
else
  info "offline.html existe (pas de réécriture)."
fi

# droits sur uploads
chown -R www-data:www-data "$UPLOADS_DIR" || warn "Impossible de chown $UPLOADS_DIR (besoin sudo ?)"

# --------- 2) wsgi.py (si absent) ---------
write_if_absent "$PROJECT_DIR/wsgi.py" <<'EOF'
from app import app as application
EOF

# --------- 3) Virtualenv + pip ---------
if [[ ! -d "$VENV_DIR" ]]; then
  $PYTHON_BIN -m venv "$VENV_DIR"
  msg "Virtualenv créé : $VENV_DIR"
else
  info "Virtualenv existe : $VENV_DIR"
fi

# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"
pip install --upgrade pip >/dev/null
if [[ -s "$PROJECT_DIR/requirements.txt" ]]; then
  pip install -r "$PROJECT_DIR/requirements.txt"
  msg "Dépendances installées depuis requirements.txt"
else
  warn "requirements.txt absent ou vide — rien installé"
fi
pip install gunicorn python-dotenv >/dev/null || true

# --------- 4) systemd service (si absent) ---------
SERVICE_FILE="/etc/systemd/system/${SYSTEMD_SERVICE}.service"
write_if_absent "$SERVICE_FILE" <<EOF
[Unit]
Description=Gunicorn for ${PROJECT_NAME} Flask app
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=${PROJECT_DIR}
EnvironmentFile=${PROJECT_DIR}/.env
ExecStart=${VENV_DIR}/bin/gunicorn \\
  --workers 3 \\
  --bind unix:${PROJECT_DIR}/gunicorn.sock \\
  --umask 007 \\
  wsgi:application
Restart=always
RestartSec=2

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable "$SYSTEMD_SERVICE" >/dev/null 2>&1 || true
if ! systemctl restart "$SYSTEMD_SERVICE"; then
  warn "Échec start/restart du service (journalctl -u $SYSTEMD_SERVICE pour debug)."
fi

# --------- 5) Nginx vhost HTTP (fallback intégré) ---------
NGINX_AVAIL="/etc/nginx/sites-available/${NGINX_SITE_NAME}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${NGINX_SITE_NAME}"

if [[ ! -e "$NGINX_AVAIL" ]]; then
  cat > "$NGINX_AVAIL" <<EOF
server {
    listen 80;
    server_name ${DOMAIN};

    client_max_body_size 10m;

    location /static/ {
        alias ${PROJECT_DIR}/static/;
        access_log off;
        expires 30d;
    }

    # Proxy vers Gunicorn ; fallback statique si backend KO
    location / {
        include proxy_params;
        proxy_pass http://unix:${PROJECT_DIR}/gunicorn.sock;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_redirect off;

        error_page 502 503 504 /offline.html;
    }

    location = /offline.html {
        root ${PROJECT_DIR}/static;
    }
}
EOF
  msg "Créé vhost Nginx : $NGINX_AVAIL"
else
  info "Vhost déjà présent : $NGINX_AVAIL (aucune modification)."
  warn "Pour activer le fallback offline, vérifie que 'location /' contient :
        error_page 502 503 504 /offline.html;
        ... et ajoute aussi :
        location = /offline.html { root ${PROJECT_DIR}/static; }"
fi

symlink_if_absent "$NGINX_AVAIL" "$NGINX_ENABLED"

if nginx -t; then
  systemctl reload nginx
  msg "Nginx rechargé (HTTP prêt)."
else
  warn "nginx -t a échoué — corrige le vhost puis relance."
fi

# --------- 6) SSL Let's Encrypt (certbot --nginx) ---------
LE_FULLCHAIN="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
if [[ -f "$LE_FULLCHAIN" ]]; then
  info "Certificat déjà présent pour ${DOMAIN} — étape SSL sautée."
else
  # Installer certbot si absent (Debian/Ubuntu)
  if ! need_cmd certbot; then
    if need_cmd apt-get; then
      info "Installation de certbot + plugin nginx…"
      apt-get install -y certbot python3-certbot-nginx >/dev/null || {
        warn "Installation certbot échouée — installe manuellement certbot/python3-certbot-nginx puis relance."
      }
    else
      warn "certbot introuvable et gestionnaire de paquets non détecté — installe certbot manuellement."
    fi
  fi

  if need_cmd certbot; then
    # Obtient le certificat et modifie le vhost pour HTTPS + redirection
    certbot --nginx -d "${DOMAIN}" \
      --non-interactive --agree-tos --email "${ADMIN_EMAIL}" \
      --redirect || warn "Certbot a échoué — vérifie DNS/port 80 accessibles."
  fi

  # Recharge Nginx si la conf a été modifiée par certbot
  if nginx -t; then
    systemctl reload nginx
    msg "Nginx rechargé (HTTPS prêt si certbot a réussi)."
  fi
fi

msg "Installation terminée sans écraser l’existant ✨"
