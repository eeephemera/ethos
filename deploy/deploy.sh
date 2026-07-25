#!/usr/bin/env bash
#
# Turnkey deploy for aiethos.ru (Ethos / Терра — Next.js landing).
# Run this ON the server (Ubuntu/Debian) as root:
#
#   ssh root@72.56.5.23
#   apt-get update && apt-get install -y git
#   git clone https://github.com/eeephemera/ethos.git /opt/ethos
#   cd /opt/ethos && git checkout claude/deploy-ethos-server-nigp2j
#   bash deploy/deploy.sh
#
# Re-running is safe: it pulls the latest code, rebuilds, and restarts.
#
set -euo pipefail

REPO_DIR="${REPO_DIR:-/opt/ethos}"
APP_DIR="$REPO_DIR/nextjs"
DOMAIN="${DOMAIN:-aiethos.ru}"
WWW_DOMAIN="www.$DOMAIN"
NODE_MAJOR="${NODE_MAJOR:-22}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"   # optional; set to enable non-interactive certbot

log() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
warn() { printf '\n\033[1;33m[warn] %s\033[0m\n' "$*"; }

if [[ $EUID -ne 0 ]]; then
  echo "This script must be run as root." >&2
  exit 1
fi

log "Installing base packages (git, nginx, curl, ca-certificates)"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y git nginx curl ca-certificates

# ---------------------------------------------------------------------------
# Node.js
# ---------------------------------------------------------------------------
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | sed 's/v\([0-9]*\).*/\1/')" -lt 18 ]]; then
  log "Installing Node.js $NODE_MAJOR via NodeSource"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi
log "Node $(node -v), npm $(npm -v)"

# ---------------------------------------------------------------------------
# Get / update the code
# ---------------------------------------------------------------------------
if [[ -d "$REPO_DIR/.git" ]]; then
  log "Updating existing checkout in $REPO_DIR"
  git -C "$REPO_DIR" fetch --all --prune
  git -C "$REPO_DIR" checkout claude/deploy-ethos-server-nigp2j
  git -C "$REPO_DIR" pull --ff-only origin claude/deploy-ethos-server-nigp2j
else
  log "Cloning repo into $REPO_DIR"
  git clone https://github.com/eeephemera/ethos.git "$REPO_DIR"
  git -C "$REPO_DIR" checkout claude/deploy-ethos-server-nigp2j
fi

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
log "Installing dependencies and building"
cd "$APP_DIR"
npm ci || npm install
npm run build

# ---------------------------------------------------------------------------
# systemd service
# ---------------------------------------------------------------------------
log "Installing systemd service ethos.service"
# Point WorkingDirectory at the actual checkout location.
sed "s#/opt/ethos/nextjs#$APP_DIR#g" "$REPO_DIR/deploy/ethos.service" > /etc/systemd/system/ethos.service

# Healthcheck watchdog: restarts the app if it hangs (systemd's Restart= only
# catches a crashed process, not a hung-but-alive one).
sed "s#/opt/ethos#$REPO_DIR#g" "$REPO_DIR/deploy/ethos-health.service" > /etc/systemd/system/ethos-health.service
cp "$REPO_DIR/deploy/ethos-health.timer" /etc/systemd/system/ethos-health.timer
chmod +x "$REPO_DIR/deploy/ethos-health.sh"

systemctl daemon-reload
systemctl enable ethos
systemctl restart ethos
systemctl enable --now ethos-health.timer
sleep 2
systemctl --no-pager --full status ethos | head -12 || true

# ---------------------------------------------------------------------------
# Swap — protect against OOM kills on low-RAM VPS (the #1 cause of crashes).
# ---------------------------------------------------------------------------
if [[ "$(swapon --show --noheadings | wc -l)" -eq 0 ]]; then
  log "No swap found — creating a 2G swap file"
  if fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048; then
    chmod 600 /swapfile
    mkswap /swapfile >/dev/null
    swapon /swapfile
    grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
    log "Swap enabled: $(swapon --show --noheadings | tr -s ' ')"
  else
    warn "Could not create swap file (skipping)."
  fi
else
  log "Swap already present — skipping."
fi

# ---------------------------------------------------------------------------
# MSS clamping — fixes "site won't load" for clients behind a smaller MTU
# (mobile networks, VPN, PPPoE). Without it the TCP handshake succeeds but
# large packets are silently dropped, so only some networks can open the site.
# ---------------------------------------------------------------------------
if iptables -t mangle -C POSTROUTING -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu 2>/dev/null; then
  log "MSS clamping already enabled"
else
  log "Enabling MSS clamping (helps mobile/VPN clients)"
  bash "$REPO_DIR/deploy/fix-mtu.sh" || warn "Could not enable MSS clamping."
fi

# ---------------------------------------------------------------------------
# nginx
# ---------------------------------------------------------------------------
log "Installing nginx site for $DOMAIN"
# Don't clobber a config Certbot has already customized with the SSL/redirect
# blocks — overwriting it would drop HTTPS. Only install the base config on a
# first run (or if Certbot hasn't touched it yet).
if grep -q "managed by Certbot" "/etc/nginx/sites-available/$DOMAIN" 2>/dev/null; then
  log "Existing nginx site has Certbot-managed HTTPS — leaving it in place."
else
  cp "$REPO_DIR/deploy/nginx-aiethos.conf" /etc/nginx/sites-available/$DOMAIN
fi
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
# Drop the default site if it would clash on port 80.
rm -f /etc/nginx/sites-enabled/default
mkdir -p /var/www/html
nginx -t
systemctl reload nginx

# ---------------------------------------------------------------------------
# HTTPS via certbot (only if DNS already points here)
# ---------------------------------------------------------------------------
SERVER_IP="$(curl -fsSL --max-time 10 https://api.ipify.org || echo '')"
DOMAIN_IP="$(getent hosts "$DOMAIN" | awk '{print $1}' | head -1 || echo '')"
log "Server public IP: ${SERVER_IP:-unknown} | $DOMAIN resolves to: ${DOMAIN_IP:-unresolved}"

if [[ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]]; then
  log "TLS certificate for $DOMAIN already exists — skipping certbot."
  echo "    Renew with the same method you issued it (see deploy/DEPLOY.md)."
elif [[ -n "$SERVER_IP" && "$DOMAIN_IP" == "$SERVER_IP" ]]; then
  log "DNS points here — obtaining Let's Encrypt certificate"
  apt-get install -y certbot python3-certbot-nginx
  if [[ -n "$CERTBOT_EMAIL" ]]; then
    certbot --nginx -d "$DOMAIN" -d "$WWW_DOMAIN" --non-interactive --agree-tos -m "$CERTBOT_EMAIL" --redirect || \
      warn "certbot failed — check that both $DOMAIN and $WWW_DOMAIN point here."
  else
    warn "CERTBOT_EMAIL not set. Run certbot manually:"
    echo "    certbot --nginx -d $DOMAIN -d $WWW_DOMAIN"
  fi
else
  warn "DNS for $DOMAIN does not point to this server yet."
  echo "    Set the A record:  $DOMAIN  ->  ${SERVER_IP:-<this server IP>}"
  echo "    Then run:          certbot --nginx -d $DOMAIN -d $WWW_DOMAIN"
fi

log "Done. The site is served on http://$DOMAIN (HTTPS after certbot)."
echo "Service logs:  journalctl -u ethos -f"
echo "Local check:   curl -I http://127.0.0.1:3000"
