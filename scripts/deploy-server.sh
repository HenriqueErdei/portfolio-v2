#!/usr/bin/env bash
# Build de produção e publica no Nginx deste servidor.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${DEST:-/var/www/henrique-erdei-portfolio}"
SITE_URL="${VITE_SITE_URL:-http://178.105.63.20}"
NGINX_SRC="$ROOT/deploy/nginx-portfolio.conf"
NGINX_AVAILABLE="/etc/nginx/sites-available/henrique-erdei-portfolio"
NGINX_ENABLED="/etc/nginx/sites-enabled/henrique-erdei-portfolio"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd "$ROOT"
command -v nvm >/dev/null && nvm use >/dev/null

echo "Building $SITE_URL"
VITE_SITE_URL="$SITE_URL" npm run build

sudo mkdir -p "$DEST"
sudo rsync -a --delete "$ROOT/dist/" "$DEST/"

sudo cp "$NGINX_SRC" "$NGINX_AVAILABLE"
sudo ln -sfn "$NGINX_AVAILABLE" "$NGINX_ENABLED"

sudo nginx -t
sudo systemctl reload nginx

echo "Published at $SITE_URL"
