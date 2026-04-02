#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./deploy-prod.sh [service-name]
# Example:
#   ./deploy-prod.sh mbw

SERVICE_NAME="${1:-mbw}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

run_privileged() {
  if [[ "${EUID}" -eq 0 ]]; then
    "$@"
  else
    sudo "$@"
  fi
}

cd "$SCRIPT_DIR/.."

echo "[deploy] Syncing with remote"
git fetch --prune origin
git reset --hard origin/main
git clean -fd

cd "$SCRIPT_DIR"

echo "[deploy] Installing dependencies"
npm ci

echo "[deploy] Building minified assets"
npm run build:assets

echo "[deploy] Running database migrations"
npm run migrate

echo "[deploy] Restarting service: ${SERVICE_NAME}"
if command -v systemctl >/dev/null 2>&1; then
  run_privileged systemctl restart "${SERVICE_NAME}"
  run_privileged systemctl --no-pager --full status "${SERVICE_NAME}" | sed -n '1,12p'
elif command -v pm2 >/dev/null 2>&1; then
  pm2 restart "${SERVICE_NAME}" || pm2 restart all
  pm2 save
else
  echo "[deploy] No supported process manager found (systemctl/pm2)."
  echo "[deploy] Built assets successfully. Restart your Node process manually."
fi

echo "[deploy] Done"
