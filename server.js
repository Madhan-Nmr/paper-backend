const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/getPrices", async (req, res) => {
  const instrumentKeys = req.query.keys;

  if (!instrumentKeys) {
    return res.status(400).json({ error: "Instrument keys are required" });
  }

  try {
    const response = await axios.get(
      "https://api.upstox.com/v2/market-quote/ltp",
      {
        params: {
          instrument_key: instrumentKeys,
        },
        headers: {
          Authorization: `Bearer ${process.env.UPSTOX_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error("Upstox Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
