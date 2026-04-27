#!/usr/bin/env bash
# Run on the VPS to rebuild and reload the site after content changes.
#
# Usage:
#   cd /opt/portfolio-guidotti
#   bash scripts/vps-rebuild.sh
#
# Or via SSH from a dev machine:
#   ssh pigna-bot "cd /opt/portfolio-guidotti && bash scripts/vps-rebuild.sh"

set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Fixing ownership/perms (idempotent)"
sudo chown -R pigna:pigna node_modules 2>/dev/null || true
sudo chown -R pigna:pigna .next 2>/dev/null || true
sudo chmod -R u+rwX,go+rX content 2>/dev/null || true

echo "==> npm run build (auto-runs content via prebuild)"
npm run build

echo "==> Refreshing standalone runtime assets"
rm -rf .next/standalone/.next/static .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

echo "==> pm2 reload portfolio-guidotti"
pm2 reload portfolio-guidotti --update-env
pm2 save >/dev/null

sleep 2
pm2 status portfolio-guidotti
echo "✓ Done."
