app.get("/price/:symbol", async (req, res) => {

  const symbol = req.params.symbol;

  try {

    const response = await axios.get(
      `https://query1.finance.yahoo.com/v7/finance/quote`,
      {
        params: {
          symbols: `${symbol}.NS`
        },
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      }
    );

    const result = response.data.quoteResponse.result;

    if (!result || result.length === 0) {
      return res.json({ error: "Stock not found" });
    }

    const data = result[0];

    res.json({
      symbol: symbol,
      price: data.regularMarketPrice,
      change: data.regularMarketChangePercent
    });

  } catch (error) {

    console.log("API ERROR:", error.response?.data || error.message);

    res.json({
      error: "Failed to fetch price"
    });

  }

});