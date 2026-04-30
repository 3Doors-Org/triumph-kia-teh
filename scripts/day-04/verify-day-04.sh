#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <domain>" >&2
  echo "Example: $0 triumphkiateh.com" >&2
  exit 1
fi

DOMAIN="$1"

echo "==> HTTPS handshake and status"
curl -sS -I "https://${DOMAIN}" | sed -n '1,20p'

echo "==> Security headers"
curl -sS -I "https://${DOMAIN}" | rg -i "strict-transport-security|x-frame-options|x-content-type-options|referrer-policy|permissions-policy|content-security-policy" || true

echo "==> TLS certificate summary"
echo | openssl s_client -servername "${DOMAIN}" -connect "${DOMAIN}:443" 2>/dev/null \
  | openssl x509 -noout -issuer -subject -dates

echo "==> HTTP->HTTPS redirect check"
curl -sS -I "http://${DOMAIN}" | sed -n '1,10p'

echo "Day 4 verification complete."
