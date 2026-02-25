const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/getPrice", async (req, res) => {
  const instrumentKey = req.query.symbol;

  if (!instrumentKey) {
    return res.status(400).json({ error: "Instrument key is required" });
  }

  try {
    const response = await axios.get(
      `https://api.upstox.com/v2/market-quote/ltp?instrument_key=${instrumentKey}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTOX_ACCESS_TOKEN}`
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error("Upstox Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch real price" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
