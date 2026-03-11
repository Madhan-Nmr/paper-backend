const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Stock API running");
});

app.get("/price/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {

    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}.NS`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

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
    res.json({ error: "Failed to fetch price" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});