export const config = {
  runtime: "nodejs18.x"
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const wallet = req.query.wallet;
    if (!wallet) {
      return res.status(400).json({ error: "wallet missing" });
    }

    if (!process.env.MORALIS_API_KEY) {
      return res.status(500).json({ error: "MORALIS_API_KEY missing" });
    }

    const chain = "0x1"; // NUR Ethereum (stabiler Test)
    const url = `https://api.moralis.io/api/v2.2/${wallet}/erc20?chain=${chain}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": process.env.MORALIS_API_KEY
      }
    });

    if (!response.ok) {
      const txt = await response.text();
      return res.status(500).json({
        error: "Moralis error",
        status: response.status,
        body: txt
      });
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "server crash",
      message: err.message
    });
  }
}