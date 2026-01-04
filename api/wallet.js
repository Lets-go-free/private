// api/wallet.js
const EVM_CHAINS = ["eth","bsc","polygon","avalanche","arbitrum","optimism"];
const APERTUM_CHAIN_ID = "2786";

export default async function handler(req, res) {
  try {
    const wallet = req.query.wallet;
    if(!wallet) return res.status(400).json({ error: "wallet missing" });

    const MORALIS_KEY = process.env.MORALIS_API_KEY;
    if(!MORALIS_KEY) return res.status(500).json({ error: "API key missing" });

    let allTokens = [];

    // --- EVM Chains ---
    for(const chain of EVM_CHAINS){
      // ERC-20 Tokens
      const ercRes = await fetch(`https://deep-index.moralis.io/api/v2.2/${wallet}/erc20?chain=${chain}`, {
        headers: { "X-API-Key": MORALIS_KEY }
      });
      const ercJson = ercRes.ok ? await ercRes.json() : [];

      // Native Balance
      const balRes = await fetch(`https://deep-index.moralis.io/api/v2.2/${wallet}/balance?chain=${chain}`, {
        headers: { "X-API-Key": MORALIS_KEY }
      });
      const balData = balRes.ok ? await balRes.json() : null;
      if(balData){
        ercJson.push({
          token_address: chain+"-native",
          symbol: chain.toUpperCase(),
          name: chain.toUpperCase(),
          balance: balData.balance,
          decimals: 18
        });
      }

      allTokens.push(...ercJson.map(t => ({ ...t, chain })));
    }

    // --- Apertum Chain ---
    const aptRes = await fetch(`https://deep-index.moralis.io/api/v2.2/${wallet}/balance?chain=${APERTUM_CHAIN_ID}`, {
      headers: { "X-API-Key": MORALIS_KEY }
    });
    const aptData = aptRes.ok ? await aptRes.json() : null;
    if(aptData){
      allTokens.push({
        token_address: APERTUM_CHAIN_ID+"-native",
        symbol: "APTUM",
        name: "Apertum",
        balance: aptData.balance,
        decimals: 18,
        chain: APERTUM_CHAIN_ID
      });
    }

    res.status(200).json(allTokens);

  } catch(e){
    console.error("wallet.js crashed:", e);
    res.status(500).json({ error: "internal server error" });
  }
}