#!/usr/bin/env bash
# Manual deploy — same build + rsync as .github/workflows/deploy.yml,
# for when GitHub Actions is down.
#
# Reads config from .env (gitignored):
#   DEPLOY_HOST=...
#   DEPLOY_USER=...
#   DEPLOY_PORT=...
#   DEPLOY_PATH=...
#   DEPLOY_SSH_KEY=~/.ssh/id_ed25519   # optional, defaults to your agent/default key
#
# Usage: ./deploy.sh [--no-update] [--dry-run]

set -euo pipefail
cd "$(dirname "$0")"

[ -f .env ] && set -a && . ./.env && set +a

: "${DEPLOY_HOST:?missing DEPLOY_HOST (set it in .env)}"
: "${DEPLOY_USER:?missing DEPLOY_USER}"
: "${DEPLOY_PATH:?missing DEPLOY_PATH}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"

RUN_UPDATE=1
RSYNC_FLAGS=(-avz --delete --exclude=node_modules)

for arg in "$@"; do
  case "$arg" in
    --no-update) RUN_UPDATE=0 ;;
    --dry-run) RSYNC_FLAGS+=(--dry-run) ;;
    *) echo "unknown option: $arg" >&2; exit 1 ;;
  esac
done

if [ "$RUN_UPDATE" = 1 ]; then
  echo "==> Updating data"
  node _scripts/update.js
fi

echo "==> Building (production)"
JEKYLL_ENV=production bundle exec jekyll build

SSH_CMD="ssh -p $DEPLOY_PORT"
[ -n "${DEPLOY_SSH_KEY:-}" ] && SSH_CMD="$SSH_CMD -i ${DEPLOY_SSH_KEY/#\~/$HOME}"

echo "==> Deploying to $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH"
rsync "${RSYNC_FLAGS[@]}" -e "$SSH_CMD" _site/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH"

echo "==> Done"
