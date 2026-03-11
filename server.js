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

    const response = await axios.get(
      `https://api.allorigins.win/raw?url=https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}.NS`
    );

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
    console.log(error.message);
    res.json({ error: "Failed to fetch price" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});