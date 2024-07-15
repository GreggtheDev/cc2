const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { sequelize, FavoritePair } = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/favorites", async (req, res) => {
  try {
    const favoritePairs = await FavoritePair.findAll();
    res.json(favoritePairs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { baseCurrency, targetCurrency } = req.body;
    const favoritePair = await FavoritePair.create({
      baseCurrency,
      targetCurrency,
    });
    res.status(201).json(favoritePair);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  sequelize.sync();
});
