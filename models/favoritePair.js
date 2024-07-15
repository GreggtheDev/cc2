const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const FavoritePair = sequelize.define("FavoritePair", {
    baseCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return FavoritePair;
};
