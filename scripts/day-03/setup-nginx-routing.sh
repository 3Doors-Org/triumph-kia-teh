#!/usr/bin/env bash
set -euo pipefail

# Week 01 Day 03: DNS + Nginx reverse proxy skeleton (HTTP stage)
# This script configures an HTTP-only Nginx layout ready for TLS on Day 4.

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root (or with sudo)." >&2
  exit 1
fi

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <domain> <www_domain> <app_upstream_host:port>" >&2
  echo "Example: $0 triumphkiateh.com www.triumphkiateh.com 127.0.0.1:3000" >&2
  exit 1
fi

DOMAIN="$1"
WWW_DOMAIN="$2"
APP_UPSTREAM="$3"

echo "==> Preflight: detect shared ingress on 80/443"
if ss -ltnp | rg -q ':(80|443)\s'; then
  if ss -ltnp | rg -q 'docker-proxy'; then
    echo "Detected docker-proxy bound to :80/:443. This host uses containerized ingress." >&2
    echo "Abort system-nginx setup to avoid downtime/conflicts." >&2
    echo "Use the Day 03 docker-proxy path in week-01-day-03-execution-guide.md instead." >&2
    exit 2
  fi
fi

echo "==> Installing Nginx"
apt update
DEBIAN_FRONTEND=noninteractive apt install -y nginx

echo "==> Writing Cloudflare real-ip include template"
mkdir -p /etc/nginx/snippets
cat > /etc/nginx/snippets/cloudflare-realip.conf <<'EOF'
# Optional Cloudflare real-ip support.
# Uncomment and maintain this list when traffic is proxied through Cloudflare.
# set_real_ip_from 173.245.48.0/20;
# set_real_ip_from 103.21.244.0/22;
# set_real_ip_from 103.22.200.0/22;
# set_real_ip_from 103.31.4.0/22;
# set_real_ip_from 141.101.64.0/18;
# set_real_ip_from 108.162.192.0/18;
# set_real_ip_from 190.93.240.0/20;
# set_real_ip_from 188.114.96.0/20;
# set_real_ip_from 197.234.240.0/22;
# set_real_ip_from 198.41.128.0/17;
# set_real_ip_from 162.158.0.0/15;
# set_real_ip_from 104.16.0.0/13;
# set_real_ip_from 104.24.0.0/14;
# set_real_ip_from 172.64.0.0/13;
# set_real_ip_from 131.0.72.0/22;
# real_ip_header CF-Connecting-IP;
EOF

echo "==> Writing site config for ${DOMAIN} and ${WWW_DOMAIN}"
cat > "/etc/nginx/sites-available/${DOMAIN}.conf" <<EOF
upstream app_upstream {
  server ${APP_UPSTREAM};
  keepalive 32;
}

server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name _;
  return 444;
}

server {
  listen 80;
  listen [::]:80;
  server_name ${DOMAIN} ${WWW_DOMAIN};

  # Keep this include even if not active yet, so Day 4+ only requires data updates.
  include /etc/nginx/snippets/cloudflare-realip.conf;

  # Deterministic health response for early platform checks.
  location = /healthz {
    add_header Content-Type text/plain;
    return 200 "ok\n";
  }

  # Application proxy path.
  location / {
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header Connection "";
    proxy_pass http://app_upstream;
  }

  # Security hardening for static and accidental path exposure.
  autoindex off;
}
EOF

echo "==> Removing default site ambiguity"
rm -f /etc/nginx/sites-enabled/default
ln -sf "/etc/nginx/sites-available/${DOMAIN}.conf" "/etc/nginx/sites-enabled/${DOMAIN}.conf"

echo "==> Validating and reloading Nginx"
nginx -t
systemctl enable nginx
systemctl restart nginx

echo "==> Day 3 setup done."
echo "Next: run scripts/day-03/verify-day-03.sh ${DOMAIN} ${WWW_DOMAIN}"
