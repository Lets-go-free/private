export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const wallet = req.query.wallet;
  if (!wallet) {
    return res.status(400).json({ error: "wallet missing" });
  }

  const MORALIS_KEY = process.env.MORALIS_API_KEY;

  // ✅ NUR gültige Moralis-Chains
  const chains = [
    "0x1",    // Ethereum
    "0x38",   // BSC
    "0x89",   // Polygon
    "0xa4b1", // Arbitrum
    "0xa"     // Optimism
  ];

  let allTokens = [];

  try {
    for (const chain of chains) {
      const url = `https://deep-index.moralis.io/api/v2/${wallet}/erc20?chain=${chain}`;

      const r = await fetch(url, {
        headers: {
          "X-API-Key": MORALIS_KEY
        }
      });

      const data = await r.json();

      if (Array.isArray(data)) {
        data.forEach(t => {
          allTokens.push({
            chain,
            token_address: t.token_address,
            name: t.name,
            symbol: t.symbol,
            decimals: Number(t.decimals),
            balance: t.balance
          });
        });
      }
    }

    return res.status(200).json(allTokens);

  } catch (err) {
    console.error("API ERROR", err);
    return res.status(500).json({ error: "api failed" });
  }
}