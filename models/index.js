const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

const FavoritePair = require("./favoritePair")(sequelize);

module.exports = {
  sequelize,
  FavoritePair,
};
