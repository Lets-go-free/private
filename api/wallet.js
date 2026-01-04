export default async function handler(req, res) {
  const { wallet, chain } = req.query;

  const response = await fetch(
    `https://deep-index.moralis.io/api/v2.2/${wallet}/erc20?chain=${chain}`,
    {
      headers: {
        "X-API-Key": process.env.MORALIS_API_KEY
      }
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}