#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <domain> <letsencrypt_email>" >&2
  echo "Example: $0 triumphkiateh.com info@triumphkiateh.com" >&2
  exit 1
fi

DOMAIN="$1"
LE_EMAIL="$2"

echo "==> Confirm ingress containers are running"
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}' | rg 'nginx-proxy|letsencrypt'

echo "==> Launch temporary Day 4 canary container"
docker rm -f tkh-day4-canary >/dev/null 2>&1 || true
docker run -d --name tkh-day4-canary \
  --network bridge \
  -e VIRTUAL_HOST="${DOMAIN},www.${DOMAIN}" \
  -e VIRTUAL_PORT=3000 \
  -e LETSENCRYPT_HOST="${DOMAIN},www.${DOMAIN}" \
  -e LETSENCRYPT_EMAIL="${LE_EMAIL}" \
  node:20-alpine sh -c "npm i -g http-server >/dev/null 2>&1 && mkdir -p /app && echo day4-ok > /app/index.html && http-server /app -p 3000"

echo "==> Waiting for proxy reload and LE companion processing"
sleep 8
docker logs --tail 80 nginx-proxy
docker logs --tail 120 letsencrypt-proxy

echo "==> Canary is live. Run verify-day-04.sh for external checks."
echo "Cleanup when done: docker rm -f tkh-day4-canary"
