#!/usr/bin/env bash
set -euo pipefail

# Week 01 Day 02: VPS provisioning and host hardening
# Target host: Ubuntu 22.04 LTS

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root (or with sudo)." >&2
  exit 1
fi

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <deploy_username> <public_ssh_key_path>" >&2
  exit 1
fi

DEPLOY_USER="$1"
PUB_KEY_PATH="$2"

if [[ ! -f "${PUB_KEY_PATH}" ]]; then
  echo "SSH public key file not found: ${PUB_KEY_PATH}" >&2
  exit 1
fi

echo "==> Updating system packages"
apt update
DEBIAN_FRONTEND=noninteractive apt upgrade -y

echo "==> Installing baseline packages"
DEBIAN_FRONTEND=noninteractive apt install -y \
  ca-certificates \
  curl \
  fail2ban \
  gnupg \
  lsb-release \
  ufw

echo "==> Creating deploy user: ${DEPLOY_USER}"
if ! id -u "${DEPLOY_USER}" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "${DEPLOY_USER}"
fi
usermod -aG sudo "${DEPLOY_USER}"

echo "==> Configuring SSH key authentication"
install -d -m 700 -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" "/home/${DEPLOY_USER}/.ssh"
install -m 600 -o "${DEPLOY_USER}" -g "${DEPLOY_USER}" "${PUB_KEY_PATH}" "/home/${DEPLOY_USER}/.ssh/authorized_keys"

echo "==> Hardening SSH daemon configuration"
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%Y%m%d%H%M%S)
sed -i 's/^#\?PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#\?PubkeyAuthentication .*/PubkeyAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin .*/PermitRootLogin no/' /etc/ssh/sshd_config
if ! grep -q '^ChallengeResponseAuthentication' /etc/ssh/sshd_config; then
  echo 'ChallengeResponseAuthentication no' >> /etc/ssh/sshd_config
fi
systemctl restart ssh

echo "==> Configuring UFW firewall"
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable

echo "==> Configuring fail2ban for SSH"
cat > /etc/fail2ban/jail.local <<'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(syslog_backend)s
EOF
systemctl enable fail2ban
systemctl restart fail2ban

echo "==> Installing Docker Engine + Compose plugin"
install -m 0755 -d /etc/apt/keyrings
if [[ ! -f /etc/apt/keyrings/docker.gpg ]]; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
fi

ARCH="$(dpkg --print-architecture)"
CODENAME="$(. /etc/os-release && echo "${VERSION_CODENAME}")"
cat > /etc/apt/sources.list.d/docker.list <<EOF
deb [arch=${ARCH} signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${CODENAME} stable
EOF

apt update
DEBIAN_FRONTEND=noninteractive apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
usermod -aG docker "${DEPLOY_USER}"
systemctl enable docker
systemctl restart docker

echo "==> Day 2 hardening completed. Run scripts/day-02/verify-day-02.sh next."
