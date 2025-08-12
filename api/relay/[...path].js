// api/relay/[...path].js  — Bybitリレー（GET/HEADのみ）
export const config = { runtime: 'nodejs18.x', regions: ['hnd1'] }; // 東京リージョン固定

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  const p = Array.isArray(req.query.path) ? req.query.path.join('/') : (req.query.path || '');
  const base = (req.query.net === 'prod') ? 'https://api.bybit.com' : 'https://api-testnet.bybit.com';
  const qs = req.url?.includes('?') ? '?' + req.url.split('?')[1] : '';
  const upstream = `${base}/${p}${qs}`;

  const r = await fetch(upstream, { headers: { 'accept': 'application/json' } });
  const text = await r.text();
  res.status(r.status);
  res.setHeader('content-type', 'application/json');
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-methods', 'GET, HEAD, OPTIONS');
  res.send(text);
}
