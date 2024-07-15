const API_KEY = "cur_live_w4H0x7eUy6n7WD2OoANxCd8qr3JK3hfchT4bkdQz";
const API_URL = `https://api.exchangerate-api.com/v4/latest/`;

async function fetchExchangeRates(baseCurrency) {
  try {
    const response = await fetch(`${API_URL}${baseCurrency}?apikey=${API_KEY}`);
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    alert("Failed to fetch exchange rates. Please try again later.");
  }
}

document.getElementById("convertBtn").addEventListener("click", async () => {
  const baseCurrency = document.getElementById("baseCurrency").value;
  const targetCurrency = document.getElementById("targetCurrency").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  const rates = await fetchExchangeRates(baseCurrency);
  const conversionRate = rates[targetCurrency];
  const convertedAmount = (amount * conversionRate).toFixed(2);

  document.getElementById(
    "convertedAmount"
  ).innerText = `${amount} ${baseCurrency} = ${convertedAmount} ${targetCurrency}`;
});

document.getElementById("historyBtn").addEventListener("click", async () => {
  const baseCurrency = document.getElementById("baseCurrency").value;
  const targetCurrency = document.getElementById("targetCurrency").value;
  const date = "2021-01-01"; // Hardcoded date for example

  try {
    const response = await fetch(
      `${API_URL}${baseCurrency}/${date}?apikey=${API_KEY}`
    );
    const data = await response.json();
    const historicalRate = data.rates[targetCurrency];

    document.getElementById(
      "historicalRate"
    ).innerText = `Historical exchange rate on ${date}: 1 ${baseCurrency} = ${historicalRate} ${targetCurrency}`;
  } catch (error) {
    console.error("Error fetching historical rates:", error);
    alert("Failed to fetch historical rates. Please try again later.");
  }
});

const favoritePairs = [];

document.getElementById("saveFavoriteBtn").addEventListener("click", () => {
  const baseCurrency = document.getElementById("baseCurrency").value;
  const targetCurrency = document.getElementById("targetCurrency").value;
  const pair = `${baseCurrency}/${targetCurrency}`;

  if (!favoritePairs.includes(pair)) {
    favoritePairs.push(pair);
    displayFavorites();
  }
});

function displayFavorites() {
  const favoritesList = document.getElementById("favoritesList");
  favoritesList.innerHTML = "";

  favoritePairs.forEach((pair) => {
    const listItem = document.createElement("li");
    listItem.innerText = pair;
    listItem.addEventListener("click", () => {
      const [base, target] = pair.split("/");
      document.getElementById("baseCurrency").value = base;
      document.getElementById("targetCurrency").value = target;
    });
    favoritesList.appendChild(listItem);
  });
}
