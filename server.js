app.get("/price/:symbol", async (req, res) => {

  const symbol = req.params.symbol.toUpperCase();

  try {

    const url =
      "https://api.allorigins.win/raw?url=" +
      encodeURIComponent(
        `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}.NS`
      );

    const response = await axios.get(url);

    const data = response.data.quoteResponse.result[0];

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

    res.json({
      error: "Failed to fetch price"
    });

  }

});