const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const sequelize = new Sequelize("sqlite::memory:"); // Or use another database

// Define Favorite model
const Favorite = sequelize.define("favorite", {
  baseCurrency: Sequelize.STRING,
  targetCurrency: Sequelize.STRING,
});

sequelize.sync();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/favorites", async (req, res) => {
  const favorites = await Favorite.findAll();
  res.json(favorites);
});

app.post("/favorites", async (req, res) => {
  const { baseCurrency, targetCurrency } = req.body;
  const favorite = await Favorite.create({ baseCurrency, targetCurrency });
  res.json(favorite);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
