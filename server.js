const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

console.log("Stock backend started");

app.get("/getPrices", async (req, res) => {

  const symbols = req.query.symbols;

  if (!symbols) {
    return res.status(400).json({ error: "Symbols required" });
  }

  try {

    const list = symbols.split(",");

    const results = {};

    for (const sym of list) {

      const url = `https://stooq.com/q/l/?s=${sym.toLowerCase()}.in&f=sd2t2ohlcv&h&e=json`;

      const response = await axios.get(url);

      const price = response.data?.data?.[0]?.close;

      results[sym] = {
        last_price: Number(price) || 0
      };

    }

    res.json({ data: results });

  } catch (error) {

    console.error("API error:", error.message);

    res.status(500).json({
      error: "Failed to fetch prices"
    });

  }

});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});