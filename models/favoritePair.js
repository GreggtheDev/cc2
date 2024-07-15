const { DataTypes } = require("sequelize");
// Imports the DataTypes object from the Sequelize library, which is used to define the types of the model attributes.

module.exports = (sequelize) => {
  // Exports a function that defines the FavoritePair model. The function takes a Sequelize instance as an argument.

  const FavoritePair = sequelize.define("FavoritePair", {
    // Defines a new model called "FavoritePair" with two attributes: baseCurrency and targetCurrency.

    baseCurrency: {
      type: DataTypes.STRING,
      // Sets the type of the baseCurrency attribute to STRING, meaning it will hold text data.
      allowNull: false,
      // Specifies that the baseCurrency attribute cannot be null, meaning it is a required field.
    },

    targetCurrency: {
      type: DataTypes.STRING,
      // Sets the type of the targetCurrency attribute to STRING, meaning it will hold text data.
      allowNull: false,
      // Specifies that the targetCurrency attribute cannot be null, meaning it is a required field.
    },
  });

  return FavoritePair;
  // Returns the defined model so it can be used elsewhere in the application.
};
