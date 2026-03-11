app.get("/price/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {

    const response = await axios.get(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}.NS`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const result = response.data.quoteResponse.result;

    if (!result || result.length === 0) {
      return res.json({ error: "Stock not found" });
    }

    const stock = result[0];

    res.json({
      symbol: symbol,
      price: stock.regularMarketPrice,
      change: stock.regularMarketChangePercent
    });

  } catch (error) {

    console.log("API ERROR:", error.message);

    res.json({
      error: "Failed to fetch price"
    });

  }
});