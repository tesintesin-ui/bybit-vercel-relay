// /api/relay/kline → Bybit v5/market/kline を中継（GET/HEADのみ）
module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).send('Method Not Allowed'); return;
  }

  const base = (req.query.net === 'prod')
    ? 'https://api.bybit.com'
    : 'https://api-testnet.bybit.com';

  // クエリはそのまま引き継ぎ
  const qs = (req.url && req.url.includes('?')) ? req.url.slice(req.url.indexOf('?')) : '';
  const upstream = `${base}/v5/market/kline${qs}`;

  const r = await fetch(upstream, { headers: { 'accept': 'application/json' } });
  const text = await r.text();

  res.status(r.status);
  res.setHeader('content-type', 'application/json');
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-methods', 'GET, HEAD, OPTIONS');
  res.send(text);
};
