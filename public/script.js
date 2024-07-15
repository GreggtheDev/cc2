document.addEventListener("DOMContentLoaded", () => {
  // This event listener waits for the entire HTML document to be loaded and parsed before running the function.

  // Selects the HTML elements by their IDs and stores them in variables for later use.
  const baseCurrencySelect = document.getElementById("base-currency");
  const targetCurrencySelect = document.getElementById("target-currency");
  const amountInput = document.getElementById("amount");
  const convertedAmountSpan = document.getElementById("converted-amount");
  const historicalRatesButton = document.getElementById("historical-rates");
  const historicalRatesContainer = document.getElementById(
    "historical-rates-container"
  );
  const saveFavoriteButton = document.getElementById("save-favorite");
  const favoriteCurrencyPairsContainer = document.getElementById(
    "favorite-currency-pairs"
  );

  // The API key used to fetch currency data from the freecurrencyapi.com service.
  const apiKey = "fca_live_dgMfbpbcfn2T8gaTaNyYq3fSRx34vHeFagUP7hdV";

  // Function to populate the currency dropdown menus with available currencies.
  const populateCurrencyDropdowns = async () => {
    try {
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}`
      );
      // Fetches the latest currency data from the API.
      const data = await response.json();
      // Parses the JSON response from the API.
      const currencies = Object.keys(data.data);
      // Gets the list of currency codes from the data.
      currencies.forEach((currency) => {
        const option = document.createElement("option");
        // Creates a new option element for each currency.
        option.value = currency;
        // Sets the value of the option to the currency code.
        option.textContent = currency;
        // Sets the displayed text of the option to the currency code.
        baseCurrencySelect.appendChild(option.cloneNode(true));
        // Adds the option to the base currency dropdown menu.
        targetCurrencySelect.appendChild(option.cloneNode(true));
        // Adds the option to the target currency dropdown menu.
      });
    } catch (error) {
      console.error("Error fetching currency data:", error);
      // Logs an error message to the console if the API request fails.
    }
  };

  // Function to convert the currency based on user input and display the result.
  const convertCurrency = async () => {
    try {
      const baseCurrency = baseCurrencySelect.value;
      // Gets the selected base currency.
      const targetCurrency = targetCurrencySelect.value;
      // Gets the selected target currency.
      const amount = parseFloat(amountInput.value);
      // Gets the amount to be converted, parsed as a floating-point number.
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${baseCurrency}`
      );
      // Fetches the latest exchange rate data for the base currency from the API.
      const data = await response.json();
      // Parses the JSON response from the API.
      const exchangeRate = data.data[targetCurrency];
      // Gets the exchange rate for the target currency.
      const convertedAmount = (amount * exchangeRate).toFixed(2);
      // Calculates the converted amount and rounds it to two decimal places.
      convertedAmountSpan.textContent = `${convertedAmount} ${targetCurrency}`;
      // Updates the displayed converted amount.
    } catch (error) {
      console.error("Error converting currency:", error);
      // Logs an error message to the console if the conversion fails.
    }
  };

  // Function to fetch and display historical exchange rates for a selected date.
  const viewHistoricalRates = async () => {
    try {
      const baseCurrency = baseCurrencySelect.value;
      // Gets the selected base currency.
      const targetCurrency = targetCurrencySelect.value;
      // Gets the selected target currency.
      const date = "2021-01-01"; // Hardcoded date for historical rates.
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/historical?apikey=${apiKey}&base_currency=${baseCurrency}&date=${date}`
      );
      // Fetches the historical exchange rate data for the base currency on the specified date.
      const data = await response.json();
      // Parses the JSON response from the API.
      const historicalRate = data.data[targetCurrency];
      // Gets the historical exchange rate for the target currency.
      historicalRatesContainer.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${historicalRate} ${targetCurrency}`;
      // Updates the displayed historical rate.
    } catch (error) {
      console.error("Error fetching historical rates:", error);
      // Logs an error message to the console if the API request fails.
    }
  };

  // Function to fetch and display the user's favorite currency pairs.
  const fetchFavoriteCurrencyPairs = async () => {
    try {
      const response = await fetch("/api/favorites");
      // Fetches the favorite currency pairs from the server.
      const favoritePairs = await response.json();
      // Parses the JSON response from the server.
      favoriteCurrencyPairsContainer.innerHTML = "";
      // Clears the favorite currency pairs container.
      favoritePairs.forEach((pair) => {
        const favoritePairButton = document.createElement("button");
        // Creates a new button for each favorite currency pair.
        favoritePairButton.textContent = `${pair.baseCurrency}/${pair.targetCurrency}`;
        // Sets the button text to the currency pair.
        favoritePairButton.addEventListener("click", () => {
          baseCurrencySelect.value = pair.baseCurrency;
          // Sets the base currency dropdown to the selected favorite base currency.
          targetCurrencySelect.value = pair.targetCurrency;
          // Sets the target currency dropdown to the selected favorite target currency.
          convertCurrency();
          // Converts the currency based on the selected favorite pair.
        });
        favoriteCurrencyPairsContainer.appendChild(favoritePairButton);
        // Adds the button to the favorite currency pairs container.
      });
    } catch (error) {
      console.error("Error fetching favorite currency pairs:", error);
      // Logs an error message to the console if the API request fails.
    }
  };

  // Function to save the currently selected currency pair as a favorite.
  const saveFavoriteCurrencyPair = async () => {
    try {
      const baseCurrency = baseCurrencySelect.value;
      // Gets the selected base currency.
      const targetCurrency = targetCurrencySelect.value;
      // Gets the selected target currency.
      await fetch("/api/favorites", {
        method: "POST",
        // Sends a POST request to save the favorite currency pair.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ baseCurrency, targetCurrency }),
        // Sends the base and target currency pair as a JSON object.
      });
      fetchFavoriteCurrencyPairs();
      // Fetches and updates the favorite currency pairs list.
    } catch (error) {
      console.error("Error saving favorite currency pair:", error);
      // Logs an error message to the console if the API request fails.
    }
  };

  // Adds event listeners to handle user interactions.
  baseCurrencySelect.addEventListener("change", convertCurrency);
  // Converts currency when the base currency dropdown value changes.
  targetCurrencySelect.addEventListener("change", convertCurrency);
  // Converts currency when the target currency dropdown value changes.
  amountInput.addEventListener("input", convertCurrency);
  // Converts currency when the amount input value changes.
  historicalRatesButton.addEventListener("click", viewHistoricalRates);
  // Views historical rates when the historical rates button is clicked.
  saveFavoriteButton.addEventListener("click", saveFavoriteCurrencyPair);
  // Saves the favorite currency pair when the save favorite button is clicked.

  // Initializes the dropdown menus and favorite currency pairs list.
  populateCurrencyDropdowns();
  // Populates the currency dropdown menus with available currencies.
  fetchFavoriteCurrencyPairs();
  // Fetches and displays the favorite currency pairs.
});
