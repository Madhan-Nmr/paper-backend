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
  const symbol = req.params.symbol.toLowerCase();

  try {
    const response = await axios.get(
      `https://stooq.com/q/l/?s=${symbol}.in&f=sd2t2ohlcv&h&e=json`
    );

    const data = response.data[0];

    if (!data) {
      return res.json({ error: "Stock not found" });
    }

    res.json({
      symbol: symbol.toUpperCase(),
      price: data.close,
      open: data.open,
      high: data.high,
      low: data.low,
      volume: data.volume
    });

  } catch (error) {
    console.log("API ERROR:", error.message);
    res.json({ error: "Failed to fetch price" });
  }
});