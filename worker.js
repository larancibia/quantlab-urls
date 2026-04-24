// Cloudflare Worker: quantlab-urls dashboard with Basic Auth
// Serves a single HTML page listing all Luis's project URLs.
// Auth: luis / Tengo1Hermana!

const EXPECTED_AUTH = 'Basic ' + btoa('luis:Tengo1Hermana!');

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>quantlab · dashboard</title>
<style>
:root {
  --bg: #0a0d12;
  --surface: #10151c;
  --surface-2: #151b25;
  --border: #1f2733;
  --text: #e4e7ec;
  --text-dim: #8b95a5;
  --accent: #10b981;
  --warn: #f59e0b;
  --danger: #ef4444;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; padding: 24px; }
.container { max-width: 1100px; margin: 0 auto; }
header { margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
header h1 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
header p { color: var(--text-dim); font-size: 13px; }
.grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
@media (min-width: 720px) { .grid { grid-template-columns: 1fr 1fr; } }
section { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 18px; }
section h2 { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-dim); margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
section h2 .count { background: var(--surface-2); color: var(--text-dim); padding: 2px 6px; border-radius: 10px; font-size: 11px; letter-spacing: 0; text-transform: none; }
.item { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: 8px; margin-bottom: 6px; background: var(--surface-2); transition: background 0.1s; }
.item:hover { background: #1a2230; }
.item a { color: var(--text); text-decoration: none; font-weight: 500; font-size: 14px; word-break: break-word; }
.item a:hover { color: var(--accent); }
.item .desc { font-size: 12px; color: var(--text-dim); }
.badge { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin-left: 6px; }
.badge.live { background: rgba(16,185,129,0.15); color: var(--accent); }
.badge.demo { background: rgba(245,158,11,0.15); color: var(--warn); }
.badge.archived { background: rgba(139,149,165,0.15); color: var(--text-dim); }
footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid var(--border); color: var(--text-dim); font-size: 12px; text-align: center; }
footer code { background: var(--surface-2); padding: 1px 5px; border-radius: 3px; font-size: 11px; }
</style>
</head>
<body>
<div class="container">
<header>
  <h1>🛰️ quantlab · dashboard</h1>
  <p>Índice de servicios y URLs del homelab + Vercel + paquetes</p>
</header>

<div class="grid">

<section>
  <h2>🖥️ Server Contabo (quantlab) <span class="count">5</span></h2>
  <div class="item"><a href="https://quantlab.firemandeveloper.com" target="_blank">quantlab.firemandeveloper.com</a><div class="desc">Trading dashboard · Python/uvicorn :8001 <span class="badge live">live</span></div></div>
  <div class="item"><a href="https://hunt.firemandeveloper.com" target="_blank">hunt.firemandeveloper.com</a><div class="desc">Job hunt pilot · FastAPI :8011 <span class="badge live">live</span></div></div>
  <div class="item"><a href="https://myweb.firemandeveloper.com" target="_blank">myweb.firemandeveloper.com</a><div class="desc">Tritium knowledge base · FastAPI :8000 <span class="badge live">live</span></div></div>
  <div class="item"><a href="https://digest.firemandeveloper.com" target="_blank">digest.firemandeveloper.com</a><div class="desc">Static digest archive (auth) <span class="badge live">live</span></div></div>
  <div class="item"><a href="https://urls.firemandeveloper.com" target="_blank">urls.firemandeveloper.com</a><div class="desc">Este dashboard · Cloudflare Worker <span class="badge live">live</span></div></div>
</section>

<section>
  <h2>☁️ Vercel (production) <span class="count">9</span></h2>
  <div class="item"><a href="https://canopy.firemandeveloper.com" target="_blank">canopy.firemandeveloper.com</a><div class="desc">Canopy landing · custom domain + HTTPS <span class="badge live">live</span></div></div>
  <div class="item"><a href="https://patagoniaorbit-2.vercel.app" target="_blank">patagoniaorbit-2.vercel.app</a><div class="desc">Weather Patagonia · OpenWeatherMap live data <span class="badge live">live</span></div></div>
  <div class="item"><a href="https://canopy-lang-site.vercel.app" target="_blank">canopy-lang-site.vercel.app</a><div class="desc">Canopy landing (alias Vercel)</div></div>
  <div class="item"><a href="https://agro-dusky-theta.vercel.app" target="_blank">agro-dusky-theta.vercel.app</a><div class="desc">Agro platform (Next.js + Genkit)</div></div>
  <div class="item"><a href="https://orthoposture.vercel.app" target="_blank">orthoposture.vercel.app</a><div class="desc">Orthoposture (investigación)</div></div>
  <div class="item"><a href="https://guanaco-labs-landing.vercel.app" target="_blank">guanaco-labs-landing.vercel.app</a><div class="desc">GuanacoLabs landing</div></div>
  <div class="item"><a href="https://web-fireman-developer.vercel.app" target="_blank">web-fireman-developer.vercel.app</a><div class="desc">FiremanDeveloper web</div></div>
  <div class="item"><a href="https://doc-tradinglatino-transcripts.vercel.app" target="_blank">doc-tradinglatino-transcripts.vercel.app</a><div class="desc">TradingLatino transcripts</div></div>
  <div class="item"><a href="https://logo-gallery-ai.pages.dev" target="_blank">logo-gallery-ai.pages.dev</a><div class="desc">Logo gallery AI (Cloudflare Pages)</div></div>
</section>

<section>
  <h2>📦 PyPI packages <span class="count">1</span></h2>
  <div class="item"><a href="https://pypi.org/project/canopy-lang/" target="_blank">pypi.org/project/canopy-lang</a><div class="desc">Trading strategy DSL · v0.0.5 <span class="badge live">live</span></div></div>
</section>

<section>
  <h2>🐙 GitHub repos (públicos) <span class="count">3</span></h2>
  <div class="item"><a href="https://github.com/larancibia/canopy-lang" target="_blank">github.com/larancibia/canopy-lang</a><div class="desc">Canopy lib · source + releases</div></div>
  <div class="item"><a href="https://github.com/larancibia/canopy-lang-site" target="_blank">github.com/larancibia/canopy-lang-site</a><div class="desc">Canopy landing source</div></div>
  <div class="item"><a href="https://github.com/larancibia/patagoniaorbit-2" target="_blank">github.com/larancibia/patagoniaorbit-2</a><div class="desc">PatagoniaOrbit weather</div></div>
</section>

<section>
  <h2>🔧 Infra (internal only) <span class="count">4</span></h2>
  <div class="item"><span style="color:var(--text-dim); font-weight: 500; font-size: 14px;">cloudflared-config.service</span><div class="desc">systemd user service · config tunnel</div></div>
  <div class="item"><span style="color:var(--text-dim); font-weight: 500; font-size: 14px;">referral-ops-config.service</span><div class="desc">systemd user service · FastAPI config web</div></div>
  <div class="item"><span style="color:var(--text-dim); font-weight: 500; font-size: 14px;">quantlab-* (systemd-timers)</span><div class="desc">nightly 02:30 · testnet cada 4h · weekly lun 07:00</div></div>
  <div class="item"><span style="color:var(--text-dim); font-weight: 500; font-size: 14px;">whatsapp-bridge :8080</span><div class="desc">Go binary · WhatsApp MCP</div></div>
</section>

<section>
  <h2>📊 External dashboards <span class="count">3</span></h2>
  <div class="item"><a href="https://vercel.com/arancibialuisalejandro-gmailcoms-projects" target="_blank">Vercel dashboard</a><div class="desc">Deployments + analytics</div></div>
  <div class="item"><a href="https://dash.cloudflare.com" target="_blank">Cloudflare dashboard</a><div class="desc">DNS, Workers, tunnels</div></div>
  <div class="item"><a href="https://github.com/larancibia" target="_blank">GitHub · @larancibia</a><div class="desc">Todos los repos</div></div>
</section>

</div>

<footer>
Hosted on Cloudflare Workers · Basic Auth enabled · <code>luis:Tengo1Hermana!</code>
</footer>
</div>
</body>
</html>`;

addEventListener('fetch', (event) => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const auth = request.headers.get('Authorization') || '';
  if (auth !== EXPECTED_AUTH) {
    return new Response('Authentication required\n', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="quantlab dashboard", charset="UTF-8"',
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
  return new Response(HTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-cache',
    },
  });
}
