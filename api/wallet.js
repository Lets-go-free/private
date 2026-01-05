module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const wallet = req.query.wallet;
  if (!wallet) return res.status(400).json({ error: "wallet missing" });

  try {
    const url = `https://deep-index.moralis.io/api/v2/${wallet}/erc20?chain=0x1`;
    const response = await fetch(url, {
      headers: { "X-API-Key": process.env.MORALIS_API_KEY }
    });

    if (!response.ok) {
      const txt = await response.text();
      return res.status(500).json({ error: "Moralis error", body: txt });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: "server crash", message: err.message });
  }
};