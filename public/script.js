const API_KEY = "cur_live_w4H0x7eUy6n7WD2OoANxCd8qr3JK3hfchT4bkdQz";
// This is the API key used to authenticate requests to the currency exchange API.

const API_URL = `https://api.exchangerate-api.com/v4/latest/`;
// This is the base URL for the currency exchange API, used to fetch the latest exchange rates.

async function fetchExchangeRates(baseCurrency) {
  // This asynchronous function fetches exchange rates for a given base currency.
  try {
    const response = await fetch(`${API_URL}${baseCurrency}?apikey=${API_KEY}`);
    // Fetch the exchange rates from the API for the specified base currency.
    const data = await response.json();
    // Parse the response as JSON.
    return data.rates;
    // Return the exchange rates.
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // Log any errors that occur during the fetch.
    alert("Failed to fetch exchange rates. Please try again later.");
    // Alert the user if fetching the exchange rates fails.
  }
}

document.getElementById("convertBtn").addEventListener("click", async () => {
  // Add an event listener to the "Convert" button that triggers when it is clicked.
  const baseCurrency = document.getElementById("baseCurrency").value;
  // Get the selected base currency from the dropdown.
  const targetCurrency = document.getElementById("targetCurrency").value;
  // Get the selected target currency from the dropdown.
  const amount = parseFloat(document.getElementById("amount").value);
  // Get the amount to be converted and parse it as a floating-point number.

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    // Alert the user if the amount entered is not a valid number or is less than or equal to zero.
    return;
  }

  const rates = await fetchExchangeRates(baseCurrency);
  // Fetch the exchange rates for the base currency.
  const conversionRate = rates[targetCurrency];
  // Get the conversion rate for the target currency.
  const convertedAmount = (amount * conversionRate).toFixed(2);
  // Calculate the converted amount and format it to two decimal places.

  document.getElementById(
    "convertedAmount"
  ).innerText = `${amount} ${baseCurrency} = ${convertedAmount} ${targetCurrency}`;
  // Display the converted amount on the webpage.
});

document.getElementById("historyBtn").addEventListener("click", async () => {
  // Add an event listener to the "Get Historical Rates" button that triggers when it is clicked.
  const baseCurrency = document.getElementById("baseCurrency").value;
  // Get the selected base currency from the dropdown.
  const targetCurrency = document.getElementById("targetCurrency").value;
  // Get the selected target currency from the dropdown.
  const date = "2021-01-01"; // Hardcoded date for example
  // Define a hardcoded date for fetching historical rates.

  try {
    const response = await fetch(
      `${API_URL}${baseCurrency}/${date}?apikey=${API_KEY}`
    );
    // Fetch the historical exchange rates for the base currency on the specified date.
    const data = await response.json();
    // Parse the response as JSON.
    const historicalRate = data.rates[targetCurrency];
    // Get the historical rate for the target currency.

    document.getElementById(
      "historicalRate"
    ).innerText = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${historicalRate} ${targetCurrency}`;
    // Display the historical exchange rate on the webpage.
  } catch (error) {
    console.error("Error fetching historical rates:", error);
    // Log any errors that occur during the fetch.
    alert("Failed to fetch historical rates. Please try again later.");
    // Alert the user if fetching the historical rates fails.
  }
});

const favoritePairs = [];
// Initialize an array to store favorite currency pairs.

document.getElementById("saveFavoriteBtn").addEventListener("click", () => {
  // Add an event listener to the "Save Favorite Pair" button that triggers when it is clicked.
  const baseCurrency = document.getElementById("baseCurrency").value;
  // Get the selected base currency from the dropdown.
  const targetCurrency = document.getElementById("targetCurrency").value;
  // Get the selected target currency from the dropdown.
  const pair = `${baseCurrency}/${targetCurrency}`;
  // Create a string representing the currency pair.

  if (!favoritePairs.includes(pair)) {
    favoritePairs.push(pair);
    // Add the currency pair to the favorites array if it is not already included.
    displayFavorites();
    // Update the displayed list of favorite pairs.
  }
});

function displayFavorites() {
  // This function updates the displayed list of favorite currency pairs.
  const favoritesList = document.getElementById("favoritesList");
  // Get the HTML element that displays the list of favorite pairs.
  favoritesList.innerHTML = "";
  // Clear the current contents of the favorites list.

  favoritePairs.forEach((pair) => {
    // Iterate over the array of favorite pairs.
    const listItem = document.createElement("li");
    // Create a new list item for each favorite pair.
    listItem.innerText = pair;
    // Set the text of the list item to the currency pair.
    listItem.addEventListener("click", () => {
      // Add an event listener to the list item that triggers when it is clicked.
      const [base, target] = pair.split("/");
      // Split the currency pair string into the base and target currencies.
      document.getElementById("baseCurrency").value = base;
      // Set the base currency dropdown to the selected base currency.
      document.getElementById("targetCurrency").value = target;
      // Set the target currency dropdown to the selected target currency.
    });
    favoritesList.appendChild(listItem);
    // Add the list item to the favorites list.
  });
}
