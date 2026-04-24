#!/usr/bin/env bash
# Deploy / update the quantlab-urls Worker.
#
# Requires:
#   - CLOUDFLARE_API_TOKEN with Workers Scripts:Edit
#   - CLOUDFLARE_ACCOUNT_ID
#
# Usage:
#   ./deploy.sh               # re-upload worker.js
#   ./deploy.sh --attach-domain  # also (re)attach urls.firemandeveloper.com

set -euo pipefail

: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN (export or source .env)}"
: "${CLOUDFLARE_ACCOUNT_ID:?Set CLOUDFLARE_ACCOUNT_ID}"

SCRIPT_NAME="quantlab-urls"
WORKER_FILE="$(dirname "$0")/worker.js"

if [[ ! -f "$WORKER_FILE" ]]; then
  echo "worker.js not found next to deploy.sh" >&2
  exit 1
fi

echo "→ Uploading $SCRIPT_NAME ..."
curl -fsS -X PUT \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/javascript" \
  --data-binary @"$WORKER_FILE" \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/$SCRIPT_NAME" \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print("  success:", d.get("success")); [print("  error:", e) for e in d.get("errors", [])]'

if [[ "${1:-}" == "--attach-domain" ]]; then
  : "${CLOUDFLARE_ZONE_ID:?Set CLOUDFLARE_ZONE_ID for firemandeveloper.com}"
  HOSTNAME="urls.firemandeveloper.com"
  echo "→ Attaching $HOSTNAME to $SCRIPT_NAME ..."
  curl -fsS -X PUT \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "{\"environment\":\"production\",\"hostname\":\"$HOSTNAME\",\"service\":\"$SCRIPT_NAME\",\"zone_id\":\"$CLOUDFLARE_ZONE_ID\"}" \
    "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/domains" \
    | python3 -c 'import json,sys; d=json.load(sys.stdin); print("  success:", d.get("success"))'
fi

echo "→ Done. https://urls.firemandeveloper.com"
