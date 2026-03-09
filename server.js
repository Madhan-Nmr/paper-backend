const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

console.log("Yahoo Finance backend started");

app.get("/getPrices", async (req, res) => {

  const symbols = req.query.symbols;

  if (!symbols) {
    return res.status(400).json({ error: "Symbols required" });
  }

  try {

    const yahooSymbols = symbols
      .split(",")
      .map(s => s + ".NS")
      .join(",");

    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}`;

    const response = await axios.get(url);

    const results = {};

    response.data.quoteResponse.result.forEach(stock => {
      results[stock.symbol] = {
        last_price: stock.regularMarketPrice
      };
    });

    res.json({ data: results });

  } catch (error) {

    console.error("Yahoo API error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch prices"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});