# quantlab-urls

A one-page dashboard listing every service, deploy and repo I run. Served from a single Cloudflare Worker behind HTTP Basic Auth.

Live at **https://urls.firemandeveloper.com**.

## Why

- I keep losing track of which URL hosts what (`quantlab.firemandeveloper.com` vs `hunt.` vs the 9 Vercel deploys vs PyPI releases).
- A private index page on a sensible domain is the answer. 
- Zero servers, zero sudo, zero framework: one Worker script, one HTML string, one custom domain — all set up through the Cloudflare API with `curl`.

## Architecture

```
                   DNS (Cloudflare — auto)
                           │
 urls.firemandeveloper.com ──► Cloudflare Worker "quantlab-urls"
                                   │
                                   ├─ 401 + WWW-Authenticate if creds missing
                                   └─ 200 HTML dashboard if Basic Auth matches
```

- `worker.js` is a classic service-worker (`addEventListener('fetch', ...)`). The entire HTML document is a JavaScript template literal inline.
- No KV, no D1, no third-party dependencies. The Worker is ~100 lines total.
- TLS cert is issued automatically by Cloudflare the moment the custom domain is attached.
- Basic Auth is compared once per request; no session, no cookies.

## Auth

HTTP Basic Auth over TLS.

| Field | Value |
|---|---|
| User | `luis` |
| Password | kept in the Worker source — rotate with `./deploy.sh` |

`401` responses carry `WWW-Authenticate: Basic realm="quantlab dashboard"` so browsers pop up a native login prompt. Clients can also send `Authorization: Basic base64(user:pass)` directly:

```bash
curl -u 'luis:yourpass' https://urls.firemandeveloper.com
```

## Local setup

You need a Cloudflare API token with these permissions on your account:

- `Workers Scripts:Edit`
- `Workers Routes:Edit` *(needed once, to attach the custom domain)*

Store the token + your account ID as environment variables:

```bash
export CLOUDFLARE_API_TOKEN='...'
export CLOUDFLARE_ACCOUNT_ID='...'
```

(If you already have a `.env` for another project, source it.)

## Deploy

### First deploy (one-time)

```bash
# 1. Upload the Worker script
curl -X PUT \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/javascript" \
  --data-binary @worker.js \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/quantlab-urls"

# 2. Attach the custom domain (also creates the DNS record + TLS cert automatically)
ZONE_ID="<your firemandeveloper.com zone id>"

curl -X PUT \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "{\"environment\":\"production\",\"hostname\":\"urls.firemandeveloper.com\",\"service\":\"quantlab-urls\",\"zone_id\":\"$ZONE_ID\"}" \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/domains"
```

Propagation is typically 10–30 seconds.

### Update the dashboard content

Edit `worker.js` (the `HTML` constant holds the full page) and re-run the upload step above. The new version is live globally within a few seconds — no caching to invalidate.

Or use the helper:

```bash
./deploy.sh
```

### Rotate the password

1. Edit `worker.js`: change the string inside `btoa('luis:...')`.
2. `./deploy.sh`.

The old password stops working as soon as the new version propagates (a few seconds).

## Cloudflare API reference

Only two endpoints in use:

| Method | Path | Use |
|---|---|---|
| `PUT` | `/accounts/{account_id}/workers/scripts/{name}` | Upload / replace Worker source |
| `PUT` | `/accounts/{account_id}/workers/domains` | Attach a custom domain to a Worker |
| `GET` | `/accounts/{account_id}/workers/scripts` | List existing Workers (sanity check) |

Official docs:

- Workers Scripts API — https://developers.cloudflare.com/api/resources/workers/subresources/scripts/
- Workers Domains API — https://developers.cloudflare.com/api/resources/workers/subresources/domains/
- Service Worker format — https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/

## Cost

Cloudflare Workers Free plan:

- 100,000 requests/day
- 10 ms CPU time per request

A 10-link dashboard hit a handful of times a day uses ~0.001 % of the quota. It will never leave the free tier.

## Adding / removing URLs

All URLs live in `worker.js` inside the `HTML` constant, grouped by section (`<section>` blocks). The structure is:

```html
<section>
  <h2>🖥️ Section title <span class="count">N</span></h2>
  <div class="item">
    <a href="URL" target="_blank">Display text</a>
    <div class="desc">Description · stack · <span class="badge live">live</span></div>
  </div>
  ...
</section>
```

Just copy an existing `<div class="item">` block. No build step.

## Security notes

- **Basic Auth is fine here** because (a) traffic is always TLS and (b) the dashboard content is links, not secrets. If the page ever held secrets I'd swap Basic Auth for Cloudflare Access (Zero Trust, free for up to 50 users).
- The password is committed to `worker.js`. That is intentional for a personal project; rotate it by editing + redeploying if anyone unwanted gains access to this repo.
- The Cloudflare API token is **not** in the repo. It lives in a local `.env` or shell export.
- The custom domain only works because `firemandeveloper.com` is on a zone I control. Forking this repo for a different domain requires changing `ZONE_ID` and `hostname` in the deploy step.

## License

MIT — see `LICENSE`.
