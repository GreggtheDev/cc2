document.addEventListener("DOMContentLoaded", () => {
  const baseCurrencySelect = document.getElementById("base-currency");
  const targetCurrencySelect = document.getElementById("target-currency");
  const amountInput = document.getElementById("amount");
  const convertedAmountDisplay = document.getElementById("converted-amount");
  const historicalRatesButton = document.getElementById("historical-rates");
  const historicalRatesContainer = document.getElementById(
    "historical-rates-container"
  );
  const saveFavoriteButton = document.getElementById("save-favorite");
  const favoriteCurrencyPairsContainer = document.getElementById(
    "favorite-currency-pairs"
  );

  const apiKey = "YOUR_API_KEY";
  const apiUrl = "https://api.apilayer.com/exchangerates_data";

  let favoriteCurrencyPairs = [];

  async function fetchExchangeRate(baseCurrency, targetCurrency) {
    const url = `${apiUrl}/latest?base=${baseCurrency}&symbols=${targetCurrency}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: apiKey,
      },
    });
    const data = await response.json();
    return data.rates[targetCurrency];
  }

  async function convertCurrency() {
    const baseCurrency = baseCurrencySelect.value;
    const targetCurrency = targetCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
      convertedAmountDisplay.textContent = "Invalid amount";
      return;
    }

    const exchangeRate = await fetchExchangeRate(baseCurrency, targetCurrency);
    const convertedAmount = amount * exchangeRate;
    convertedAmountDisplay.textContent = `${convertedAmount.toFixed(
      2
    )} ${targetCurrency}`;
  }

  async function fetchHistoricalRates(baseCurrency, targetCurrency) {
    const date = "2023-01-01"; // Replace with desired date or add functionality to select a date
    const url = `${apiUrl}/${date}?base=${baseCurrency}&symbols=${targetCurrency}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: apiKey,
      },
    });
    const data = await response.json();
    return data.rates[targetCurrency];
  }

  async function displayHistoricalRates() {
    const baseCurrency = baseCurrencySelect.value;
    const targetCurrency = targetCurrencySelect.value;

    const historicalRate = await fetchHistoricalRates(
      baseCurrency,
      targetCurrency
    );
    historicalRatesContainer.textContent = `Historical exchange rate on 2023-01-01: 1 ${baseCurrency} = ${historicalRate} ${targetCurrency}`;
  }

  function saveFavoriteCurrencyPair() {
    const baseCurrency = baseCurrencySelect.value;
    const targetCurrency = targetCurrencySelect.value;
    const currencyPair = `${baseCurrency}/${targetCurrency}`;

    if (!favoriteCurrencyPairs.includes(currencyPair)) {
      favoriteCurrencyPairs.push(currencyPair);
      displayFavoriteCurrencyPairs();
    }
  }

  function displayFavoriteCurrencyPairs() {
    favoriteCurrencyPairsContainer.innerHTML = "";
    favoriteCurrencyPairs.forEach((pair) => {
      const button = document.createElement("button");
      button.textContent = pair;
      button.addEventListener("click", () => {
        const [base, target] = pair.split("/");
        baseCurrencySelect.value = base;
        targetCurrencySelect.value = target;
        convertCurrency();
      });
      favoriteCurrencyPairsContainer.appendChild(button);
    });
  }

  baseCurrencySelect.addEventListener("change", convertCurrency);
  targetCurrencySelect.addEventListener("change", convertCurrency);
  amountInput.addEventListener("input", convertCurrency);
  historicalRatesButton.addEventListener("click", displayHistoricalRates);
  saveFavoriteButton.addEventListener("click", saveFavoriteCurrencyPair);

  async function initialize() {
    const currencies = ["USD", "EUR", "GBP", "JPY", "AUD"]; // Add more currencies as needed

    currencies.forEach((currency) => {
      const option1 = document.createElement("option");
      option1.value = currency;
      option1.textContent = currency;
      baseCurrencySelect.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = currency;
      option2.textContent = currency;
      targetCurrencySelect.appendChild(option2);
    });

    baseCurrencySelect.value = "USD"; // Set default base currency to USD
    targetCurrencySelect.value = "EUR"; // Set default target currency to EUR
    convertCurrency();
  }

  initialize();
});
