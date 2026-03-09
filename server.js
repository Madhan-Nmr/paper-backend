const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

console.log("RapidAPI backend started");

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
      .filter(Boolean);

    const results = {};

    for (const symbol of symbols) {

      const response = await axios.get(
        "https://yh-finance.p.rapidapi.com/stock/v2/get-quote",
        {
          params: { symbol },
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": "yh-finance.p.rapidapi.com"
          }
        }
      );

      results[symbol] = {
        last_price: response.data.price?.regularMarketPrice?.raw || 0
      };

    }

    res.json({ data: results });

  } catch (error) {

    console.error("RapidAPI Error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch prices"
    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
