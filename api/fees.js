// api/fees.js
export default async function handler(req, res) {
  // Autoriser les requêtes CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { protocol } = req.query;

  if (!protocol) {
    return res.status(400).json({ error: 'Protocol parameter is required' });
  }

  try {
    // Appeler DeFiLlama depuis le serveur (pas de problème CORS ici)
    const feesResponse = await fetch(
      `https://api.llama.fi/summary/fees/${protocol}?dataType=dailyFees`
    );

    if (!feesResponse.ok) {
      return res.status(feesResponse.status).json({ 
        error: `DeFiLlama API error: ${feesResponse.status}` 
      });
    }

    const feesData = await feesResponse.json();

    return res.status(200).json({
      protocol,
      total24h: feesData.total24h || 0,
      total7d: feesData.total7d || 0,
      total30d: feesData.total30d || 0,
      totalAllTime: feesData.totalAllTime || 0
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to fetch data from DeFiLlama',
      details: error.message 
    });
  }
}
