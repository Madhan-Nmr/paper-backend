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
  const symbol = req.params.symbol.toUpperCase();

  try {

    const response = await axios.get(
      `https://yahoo-finance-api.vercel.app/api/quote/${symbol}.NS`
    );

    const data = response.data;

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

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});