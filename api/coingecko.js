// api/coingecko.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { coinId } = req.query;

  if (!coinId) {
    return res.status(400).json({ error: 'coinId parameter is required' });
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      {
        headers: {
          'x-cg-demo-api-key': 'CG-QgrMAHBWtELivvPG367nTZU4'
        }
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `CoinGecko API error: ${response.status}` 
      });
    }

    const data = await response.json();

    return res.status(200).json({
      coinId,
      fdv: data.market_data?.fully_diluted_valuation?.usd || null,
      marketCap: data.market_data?.market_cap?.usd || null,
      price: data.market_data?.current_price?.usd || null
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to fetch data from CoinGecko',
      details: error.message 
    });
  }
}
