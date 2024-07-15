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

  const apiKey = "fca_live_dgMfbpbcfn2T8gaTaNyYq3fSRx34vHeFagUP7hdV";

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

  const fetchFavoriteCurrencyPairs = async () => {
    try {
      const response = await fetch("/api/favorites");
      const favoritePairs = await response.json();
      favoriteCurrencyPairsContainer.innerHTML = "";
      favoritePairs.forEach((pair) => {
        const favoritePairButton = document.createElement("button");
        favoritePairButton.textContent = `${pair.baseCurrency}/${pair.targetCurrency}`;
        favoritePairButton.addEventListener("click", () => {
          baseCurrencySelect.value = pair.baseCurrency;
          targetCurrencySelect.value = pair.targetCurrency;
          convertCurrency();
        });
        favoriteCurrencyPairsContainer.appendChild(favoritePairButton);
      });
    } catch (error) {
      console.error("Error fetching favorite currency pairs:", error);
    }
  };

  const saveFavoriteCurrencyPair = async () => {
    try {
      const baseCurrency = baseCurrencySelect.value;
      const targetCurrency = targetCurrencySelect.value;
      await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ baseCurrency, targetCurrency }),
      });
      fetchFavoriteCurrencyPairs();
    } catch (error) {
      console.error("Error saving favorite currency pair:", error);
    }
  };

  baseCurrencySelect.addEventListener("change", convertCurrency);
  targetCurrencySelect.addEventListener("change", convertCurrency);
  amountInput.addEventListener("input", convertCurrency);
  historicalRatesButton.addEventListener("click", viewHistoricalRates);
  saveFavoriteButton.addEventListener("click", saveFavoriteCurrencyPair);

  populateCurrencyDropdowns();
  fetchFavoriteCurrencyPairs();
});
