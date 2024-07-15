const { Sequelize } = require("sequelize");
// Imports the Sequelize library, which is used to interact with the database.

const sequelize = new Sequelize({
  dialect: "sqlite",
  // Specifies the type of database to use, in this case, SQLite.
  storage: "./database.sqlite",
  // Specifies the file path where the SQLite database will be stored.
});

const FavoritePair = require("./favoritePair")(sequelize);
// Imports the FavoritePair model, passing the Sequelize instance to the function that defines the model.

module.exports = {
  sequelize,
  // Exports the Sequelize instance for use in other parts of the application.
  FavoritePair,
  // Exports the FavoritePair model for use in other parts of the application.
};
