#!/usr/bin/env bash
set -euo pipefail

echo "==> OS release"
lsb_release -ds || true

echo "==> UFW status (expected: only 22, 80, 443)"
sudo ufw status verbose

echo "==> fail2ban sshd status"
sudo fail2ban-client status sshd

echo "==> Docker versions"
docker --version
docker compose version

echo "==> Listening ports (expected public: 22, 80, 443)"
sudo ss -tulpen

echo "==> Security check: postgres/redis must not be listening on public interfaces"
if sudo ss -tulpen | grep -E ':5432|:6379' >/dev/null 2>&1; then
  echo "WARNING: Postgres or Redis appears exposed. Investigate immediately."
  exit 1
fi

echo "Day 2 verification passed."
