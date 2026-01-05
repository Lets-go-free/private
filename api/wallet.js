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
.
    const url = `https://deep-index.moralis.io/api/v2/${wallet}/erc20?chain=0x1`;

    const response = await fetch(url, {
      headers: {
        "X-API-Key": process.env.MORALIS_API_KEY
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({
        error: "Moralis error",
        status: response.status,
        body: text
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