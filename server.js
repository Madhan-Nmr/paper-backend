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

    const url =
      "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
      symbol +
      ".BSE&apikey=demo";

    const response = await axios.get(url);

    res.json(response.data);

  } catch (error) {

    console.log("FULL ERROR:", error.message);

    res.json({
      error: "External API failed",
      details: error.message
    });

  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});