const express = require("express");
// Import the Express framework for building web applications.

const Sequelize = require("sequelize");
// Import Sequelize, a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server.

const bodyParser = require("body-parser");
// Import body-parser, a middleware to parse incoming request bodies.

const path = require("path");
// Import path, a module to work with file and directory paths.

const app = express();
// Create an instance of an Express application.

const sequelize = new Sequelize("sqlite::memory:");
// Create a new Sequelize instance with SQLite as the database stored in memory. You can replace this with a connection string for another database.


// Define Favorite model
const Favorite = sequelize.define("favorite", {
  // Define a model named 'favorite' with two string fields: baseCurrency and targetCurrency.
  baseCurrency: Sequelize.STRING,
  targetCurrency: Sequelize.STRING,
});

sequelize.sync();
// Synchronize the model with the database, creating the table if it doesn't exist.

app.use(bodyParser.json());
// Use body-parser middleware to parse JSON bodies of incoming requests.

app.use(express.static(path.join(__dirname, "public")));
// Serve static files from the "public" directory.

app.get("/favorites", async (req, res) => {
  // Handle GET requests to the "/favorites" route.
  const favorites = await Favorite.findAll();
  // Retrieve all favorite currency pairs from the database.
  res.json(favorites);
  // Send the retrieved favorites as a JSON response.
});

app.post("/favorites", async (req, res) => {
  // Handle POST requests to the "/favorites" route.
  const { baseCurrency, targetCurrency } = req.body;
  // Extract baseCurrency and targetCurrency from the request body.
  const favorite = await Favorite.create({ baseCurrency, targetCurrency });
  // Create a new favorite currency pair in the database.
  res.json(favorite);
  // Send the created favorite as a JSON response.
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
  // Start the server on port 3000 and log a message when it's running.
});
