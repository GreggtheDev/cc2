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

  const apiKey = "fca_live_dgMfbpbcfn2T8gaTaNyYq3fSR"; // My API key

  const populateCurrencyDropdowns = async () => {
    try {
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}`
      );
      const data = await response.json();
      const currencies = Object.keys(data.data);
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

  const convertCurrency = async () => {
    try {
      const baseCurrency = baseCurrencySelect.value;
      const targetCurrency = targetCurrencySelect.value;
      const amount = parseFloat(amountInput.value);
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${baseCurrency}`
      );
      const data = await response.json();
      const exchangeRate = data.data[targetCurrency];
      const convertedAmount = (amount * exchangeRate).toFixed(2);
      convertedAmountSpan.textContent = `${convertedAmount} ${targetCurrency}`;
    } catch (error) {
      console.error("Error converting currency:", error);
    }
  };

  const viewHistoricalRates = async () => {
    try {
      const baseCurrency = baseCurrencySelect.value;
      const targetCurrency = targetCurrencySelect.value;
      const date = "2021-01-01"; // Hardcoded date for historical rates
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/historical?apikey=${apiKey}&base_currency=${baseCurrency}&date=${date}`
      );
      const data = await response.json();
      const historicalRate = data.data[targetCurrency];
      historicalRatesContainer.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${historicalRate} ${targetCurrency}`;
    } catch (error) {
      console.error("Error fetching historical rates:", error);
    }
  };

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

  baseCurrencySelect.addEventListener("change", convertCurrency);
  targetCurrencySelect.addEventListener("change", convertCurrency);
  amountInput.addEventListener("input", convertCurrency);
  historicalRatesButton.addEventListener("click", viewHistoricalRates);
  saveFavoriteButton.addEventListener("click", saveFavoriteCurrencyPair);

  populateCurrencyDropdowns();
});
