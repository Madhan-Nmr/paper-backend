app.get("/price/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {

    const response = await axios.get(
      `https://yahoo-finance-api.vercel.app/api/quote/${symbol}.NS`
    );

    const data = response.data;

    if (!data) {
      return res.json({ error: "Stock not found" });
    }

    res.json({
      symbol: symbol,
      price: data.regularMarketPrice,
      change: data.regularMarketChangePercent
    });

  } catch (error) {
    console.log("API ERROR:", error.message);
    res.json({ error: "Failed to fetch price" });
  }
});