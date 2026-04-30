#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <domain> <www_domain>" >&2
  exit 1
fi

DOMAIN="$1"
WWW_DOMAIN="$2"

echo "==> DNS resolution checks"
dig +short A "${DOMAIN}" || true
dig +short A "${WWW_DOMAIN}" || true
dig +short AAAA "${DOMAIN}" || true
dig +short AAAA "${WWW_DOMAIN}" || true

echo "==> Nginx status"
sudo systemctl status nginx --no-pager | sed -n '1,12p'
sudo nginx -t

echo "==> HTTP smoke tests"
curl -sS -I "http://${DOMAIN}/healthz"
curl -sS -I "http://${WWW_DOMAIN}/healthz"

echo "==> Expected status checks"
echo "- /healthz should return HTTP 200"
echo "- unknown host requests should return no content (444) from default server"

echo "==> Port exposure check"
sudo ss -tulpen | grep -E ':80|:443|:22' || true

echo "Day 3 verification complete."
