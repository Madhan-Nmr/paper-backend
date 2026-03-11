const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const API_KEY = "demo"; // replace with your AlphaVantage key later

app.get("/", (req, res) => {
  res.send("Stock API running");
});

app.get("/price/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.BSE&apikey=${API_KEY}`;

    const response = await axios.get(url);

    const data = response.data["Global Quote"];

    if (!data) {
      return res.json({ error: "Stock not found" });
    }

    res.json({
      symbol: symbol,
      price: data["05. price"],
      change: data["10. change percent"]
    });

  } catch (error) {
    console.log("API ERROR:", error.message);
    res.json({ error: "Failed to fetch price" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});