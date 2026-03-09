const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/getPrices", async (req, res) => {

  const symbols = req.query.symbols;

  if (!symbols) {
    return res.status(400).json({ error: "Symbols required" });
  }

  try {

    const yahooSymbols = symbols
      .split(",")
      .map(s => s.trim() + ".NS")
      .join(",");

    const response = await axios.get(
      "https://yahoo-finance15.p.rapidapi.com/api/v1/markets/quote",
      {
        params: { symbols: yahooSymbols },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com"
        }
      }
    );

    const results = {};

    response.data.body.forEach(stock => {
      results[stock.symbol] = {
        last_price: stock.regularMarketPrice
      };
    });

    res.json({ data: results });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch prices"
    });

  }

});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
