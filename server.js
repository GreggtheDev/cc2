const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;
const apiUrl = "https://api.apilayer.com/exchangerates_data";

app.use(express.static("public"));

// Endpoint to get symbols
app.get("/api/symbols", async (req, res) => {
  try {
    const response = await fetch(`${apiUrl}/symbols`, {
      method: "GET",
      headers: {
        apikey: apiKey,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching symbols:", error);
    res.status(500).json({ error: "Error fetching symbols" });
  }
});

// Endpoint to get exchange rate
app.get("/api/rates", async (req, res) => {
  const { base, symbols } = req.query;
  try {
    const response = await fetch(
      `${apiUrl}/latest?base=${base}&symbols=${symbols}`,
      {
        method: "GET",
        headers: {
          apikey: apiKey,
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    res.status(500).json({ error: "Error fetching exchange rate" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
