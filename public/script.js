document.addEventListener("DOMContentLoaded", () => {
  const baseCurrencySelect = document.getElementById("base-currency");
  const targetCurrencySelect = document.getElementById("target-currency");
  const amountInput = document.getElementById("amount");
  const convertedAmountDisplay = document.getElementById("converted-amount");

  const apiUrl = "/api"; // Use the local server endpoints

  // Fetch and populate the dropdown menus with available currencies
  async function populateCurrencyDropdowns() {
    try {
      const response = await fetch(`${apiUrl}/symbols`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      const currencies = Object.keys(data.symbols);

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

      // Set default values
      baseCurrencySelect.value = "USD";
      targetCurrencySelect.value = "EUR";
    } catch (error) {
      console.error("Error populating currency dropdowns:", error);
    }
  }

  // Fetch the exchange rate data
  async function fetchExchangeRate(baseCurrency, targetCurrency) {
    try {
      if (!baseCurrency || !targetCurrency) {
        throw new Error("Both base and target currencies must be selected.");
      }
      const url = `${apiUrl}/rates?base=${baseCurrency}&symbols=${targetCurrency}`;
      console.log("Fetching exchange rate from URL:", url); // Debug log
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error: ${response.status}, Message: ${errorData.error}`
        );
      }
      const data = await response.json();
      console.log(
        `Exchange rate from ${baseCurrency} to ${targetCurrency}:`,
        data.rates[targetCurrency]
      ); // Debug log
      return data.rates[targetCurrency];
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return null;
    }
  }

  // Convert the currency
  async function convertCurrency() {
    const baseCurrency = baseCurrencySelect.value;
    const targetCurrency = targetCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
      convertedAmountDisplay.textContent = "Invalid amount";
      return;
    }

    const exchangeRate = await fetchExchangeRate(baseCurrency, targetCurrency);
    if (exchangeRate) {
      const convertedAmount = amount * exchangeRate;
      console.log(`Converted amount: ${convertedAmount} ${targetCurrency}`); // Debug log
      convertedAmountDisplay.textContent = `${convertedAmount.toFixed(
        2
      )} ${targetCurrency}`;
    } else {
      convertedAmountDisplay.textContent = "Error fetching rate";
    }
  }

  // Event listeners for user interactions
  baseCurrencySelect.addEventListener("change", convertCurrency);
  targetCurrencySelect.addEventListener("change", convertCurrency);
  amountInput.addEventListener("input", convertCurrency);

  // Initialize the application
  async function initialize() {
    await populateCurrencyDropdowns();
    convertCurrency();
  }

  initialize();
});
