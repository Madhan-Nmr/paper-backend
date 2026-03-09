const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

console.log("Yahoo Finance backend started");

app.get("/getPrices", async (req, res) => {

  const keys = req.query.keys;

  if (!keys) {
    return res.status(400).json({ error: "Keys required" });
  }

  try {

    // Convert instrument keys → NSE symbols
    const symbols = keys
      .split(",")
      .map(k => {
        const parts = k.split("|");
        return parts[1] ? parts[1] + ".NS" : null;
      })
      .filter(Boolean)
      .join(",");

    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

    const response = await axios.get(url);

    const results = {};

    response.data.quoteResponse.result.forEach(stock => {
      results[stock.symbol] = {
        last_price: stock.regularMarketPrice
      };
    });

    res.json({ data: results });

  } catch (error) {

    console.error("Yahoo API error:", error.message);

    res.status(500).json({
      error: "Failed to fetch prices"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
