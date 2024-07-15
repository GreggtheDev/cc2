const express = require("express");
 // Imports the Express library, which is used to create the web server.
 const path = require("path");
 // Imports the Path module, which provides utilities for working with file and directory paths.
 const bodyParser = require("body-parser");
 // Imports the Body-Parser library, which is used to parse incoming request bodies in middleware.
 const { sequelize, FavoritePair } = require("./models");
 // Imports the Sequelize instance and the FavoritePair model from the models directory.

 const app = express();
 // Creates an instance of an Express application.
 const PORT = process.env.PORT || 3000;
 // Sets the port number to the value of the environment variable PORT, or defaults to 3000 if not set.

 app.use(bodyParser.json());
 // Configures the app to use Body-Parser to parse JSON request bodies.
 app.use(express.static(path.join(__dirname, "public")));
 // Serves static files from the "public" directory.

 app.get("/api/favorites", async (req, res) => {
   // Defines a route handler for GET requests to "/api/favorites".
   try {
     const favoritePairs = await FavoritePair.findAll();
     // Fetches all favorite currency pairs from the database.
     res.json(favoritePairs);
     // Sends the favorite pairs as a JSON response.
   } catch (error) {
     res.status(500).send(error.message);
     // Sends a 500 Internal Server Error response with the error message if an error occurs.
   }
 });

 app.post("/api/favorites", async (req, res) => {
   // Defines a route handler for POST requests to "/api/favorites".
   try {
     const { baseCurrency, targetCurrency } = req.body;
     // Extracts the baseCurrency and targetCurrency from the request body.
     const favoritePair = await FavoritePair.create({
       baseCurrency,
       targetCurrency,
     });
     // Creates a new favorite pair in the database with the extracted values.
     res.status(201).json(favoritePair);
     // Sends a 201 Created response with the newly created favorite pair as JSON.
   } catch (error) {
     res.status(500).send(error.message);
     // Sends a 500 Internal Server Error response with the error message if an error occurs.
   }
 });

 app.listen(PORT, () => {
   // Starts the server and listens for incoming requests on the specified port.
   console.log(`Server is running on port ${PORT}`);
   // Logs a message indicating that the server is running.
   sequelize.sync();
   // Synchronizes the Sequelize models with the database, creating tables if they do not exist.
 });
