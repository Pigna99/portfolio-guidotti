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

echo "==> npm run build (auto-runs content via prebuild)"
npm run build

echo "==> Copying static + public into standalone"
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

echo "==> pm2 reload portfolio-guidotti"
pm2 reload portfolio-guidotti --update-env
pm2 save >/dev/null

sleep 2
pm2 status portfolio-guidotti
echo "✓ Done."
