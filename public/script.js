document.addEventListener("DOMContentLoaded", () => {
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

  const apiKey = "fca_live_dgMfbpbcfn2T8gaTaNyYq3fSRx34vHeFagUP7hdV"; // Your API key

  // Function to check the status of the API
  const checkApiStatus = async () => {
    try {
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/status?apikey=${apiKey}`
      );
      const data = await response.json();
      console.log("API status:", data); // Debugging
      if (data.status === "ok") {
        populateCurrencyDropdowns();
      } else {
        console.error("API status is not OK:", data);
      }
    } catch (error) {
      console.error("Error checking API status:", error);
    }
  };

  // Function to populate the currency dropdown menus with available currencies.
  const populateCurrencyDropdowns = async () => {
    try {
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}`
      );
      if (!response.ok) {
        throw new Error(`API response not OK: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched currency data:", data); // Debugging
      if (!data || !data.data) {
        throw new Error("Invalid currency data received");
      }
      const currencies = Object.keys(data.data);
      console.log("Currency keys:", currencies); // Debugging
      currencies.forEach((currency) => {
        const option = document.createElement("option");
        option.value = currency;
        option.textContent = currency;
        baseCurrencySelect.appendChild(option.cloneNode(true));
        targetCurrencySelect.appendChild(option.cloneNode(true));
      });
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  // Function to convert the currency based on user input and display the result.
  const convertCurrency = async () => {
    try {
      const baseCurrency = baseCurrencySelect.value;
      const targetCurrency = targetCurrencySelect.value;
      const amount = parseFloat(amountInput.value);
      console.log("Converting:", { baseCurrency, targetCurrency, amount }); // Debugging
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${baseCurrency}`
      );
      if (!response.ok) {
        throw new Error(`API response not OK: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched exchange rate data:", data); // Debugging
      if (!data || !data.data) {
        throw new Error("Invalid exchange rate data received");
      }
      const exchangeRate = data.data[targetCurrency];
      const convertedAmount = (amount * exchangeRate).toFixed(2);
      convertedAmountSpan.textContent = `${convertedAmount} ${targetCurrency}`;
    } catch (error) {
      console.error("Error converting currency:", error);
    }
  };

  // Function to fetch and display historical exchange rates for a selected date.
  const viewHistoricalRates = async () => {
    try {
      const baseCurrency = baseCurrencySelect.value;
      const targetCurrency = targetCurrencySelect.value;
      const date = "2021-01-01"; // Hardcoded date for historical rates
      console.log("Fetching historical rates for:", {
        baseCurrency,
        targetCurrency,
        date,
      }); // Debugging
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/historical?apikey=${apiKey}&base_currency=${baseCurrency}&date=${date}`
      );
      if (!response.ok) {
        throw new Error(`API response not OK: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched historical rate data:", data); // Debugging
      if (!data || !data.data) {
        throw new Error("Invalid historical rate data received");
      }
      const historicalRate = data.data[targetCurrency];
      historicalRatesContainer.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${historicalRate} ${targetCurrency}`;
    } catch (error) {
      console.error("Error fetching historical rates:", error);
    }
  };

  // Function to save the currently selected currency pair as a favorite.
  const saveFavoriteCurrencyPair = () => {
    const baseCurrency = baseCurrencySelect.value;
    const targetCurrency = targetCurrencySelect.value;
    const favoritePair = `${baseCurrency}/${targetCurrency}`;
    const favoritePairButton = document.createElement("button");
    favoritePairButton.textContent = favoritePair;
    favoritePairButton.addEventListener("click", () => {
      baseCurrencySelect.value = baseCurrency;
      targetCurrencySelect.value = targetCurrency;
      convertCurrency();
    });
    favoriteCurrencyPairsContainer.appendChild(favoritePairButton);
  };

  // Adds event listeners to handle user interactions.
  baseCurrencySelect.addEventListener("change", convertCurrency);
  targetCurrencySelect.addEventListener("change", convertCurrency);
  amountInput.addEventListener("input", convertCurrency);
  historicalRatesButton.addEventListener("click", viewHistoricalRates);
  saveFavoriteButton.addEventListener("click", saveFavoriteCurrencyPair);

  // Check the API status before populating the dropdown menus.
  checkApiStatus();
});
