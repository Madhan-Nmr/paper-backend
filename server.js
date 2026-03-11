const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let portfolio = {};
let orders = [];

// Home
app.get("/", (req, res) => {
  res.send("Paper Trading Backend Running");
});

// Buy stock
app.post("/buy", (req, res) => {

  const { symbol, price, quantity } = req.body;

  if (!symbol || !price || !quantity) {
    return res.json({ error: "Missing fields" });
  }

  if (!portfolio[symbol]) {
    portfolio[symbol] = { quantity: 0, avgPrice: 0 };
  }

  const stock = portfolio[symbol];

  const totalCost =
    stock.avgPrice * stock.quantity + price * quantity;

  stock.quantity += quantity;
  stock.avgPrice = totalCost / stock.quantity;

  orders.push({
    type: "BUY",
    symbol,
    price,
    quantity,
    time: new Date()
  });

  res.json({
    message: "Stock bought",
    portfolio
  });

});

// Sell stock
app.post("/sell", (req, res) => {

  const { symbol, price, quantity } = req.body;

  if (!portfolio[symbol] || portfolio[symbol].quantity < quantity) {
    return res.json({ error: "Not enough shares" });
  }

  portfolio[symbol].quantity -= quantity;

  orders.push({
    type: "SELL",
    symbol,
    price,
    quantity,
    time: new Date()
  });

  res.json({
    message: "Stock sold",
    portfolio
  });

});

// Portfolio
app.get("/portfolio", (req, res) => {
  res.json(portfolio);
});

// Order history
app.get("/orders", (req, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});