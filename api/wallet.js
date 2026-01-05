export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const wallet = req.query.wallet;
  if (!wallet) {
    return res.status(400).json({ error: "wallet missing" });
  }

  const chains = ["0x1"]; // NUR Ethereum zum Test
  const allTokens = [];

  try {
    for (const chain of chains) {
      const url = `https://api.moralis.io/api/v2.2/${wallet}/erc20?chain=${chain}`;

      const r = await fetch(url, {
        headers: {
          "X-API-Key": process.env.MORALIS_API_KEY
        }
      });

      const data = await r.json();

      console.log("Moralis response:", data);

      if (Array.isArray(data)) {
        data.forEach(t => {
          allTokens.push({
            chain,
            token_address: t.token_address,
            symbol: t.symbol,
            decimals: t.decimals,
            balance: t.balance
          });
        });
      }
    }

    return res.status(200).json(allTokens);

  } catch (e) {
    console.error("API ERROR", e);
    return res.status(500).json({ error: "failed" });
  }
}