const result = document.querySelector("#result");
const cryptoSelect = document.querySelector("#cryptocurrency");
const currencySelect = document.querySelector("#currency");
const formCrypto = document.querySelector("#formCrypto");

const objConsult = {
  currency: "",
  cryptocurrency: "",
};

function getCryptocurrencies(cryptocurrencies) {
  return new Promise((resolve) => {
    resolve(cryptocurrencies);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  consultCurrency();
  formCrypto.addEventListener("submit", cryptocurrenciesForm);
  cryptoSelect.addEventListener("change", readValue);
  currencySelect.addEventListener("change", readValue);
});

async function consultCurrency() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  try {
    const response = await fetch(url);
    const result = await response.json();
    const cryptocurrencies = await getCryptocurrencies(result.Data);
    selectCryptocurrencies(cryptocurrencies);
  } catch (error) {
    showAlert(error);
  }
}

function selectCryptocurrencies(cryptocurrencies) {
  cryptocurrencies.forEach((crypto) => {
    const { FullName, Name } = crypto.CoinInfo;
    const option = document.createElement("OPTION");
    option.value = Name;
    option.textContent = FullName;
    cryptoSelect.appendChild(option);
  });
}
function readValue(e) {
  objConsult[e.target.name] = e.target.value;
}
function cryptocurrenciesForm(e) {
  e.preventDefault();
  const { currency, cryptocurrency } = objConsult;
  if (currency === "" || cryptocurrency === "") {
    showAlert("Choose a currency or cryptocurrency");
  }

  consultAPI();
}

function showAlert(message) {
  const alert = document.createElement("DIV");
  alert.classList.add("error");
  alert.textContent = message;

  formCrypto.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

async function consultAPI() {
  const { currency, cryptocurrency } = objConsult;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`;

  showSpinner();
  try {
    const response = await fetch(url);
    const quote = await response.json();
    showPrice(quote.DISPLAY[cryptocurrency][currency]);
  } catch (error) {
    showAlert(error);
  }
}

function showPrice(quote) {
  cleanHTML();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = quote;

  const price = document.createElement("p");
  price.classList.add("price");
  price.innerHTML = `The Price is: <span> ${PRICE} </span>`;

  const highDay = document.createElement("p");
  highDay.innerHTML = `<p>Highest price of the day: <span>${HIGHDAY}</span> </p>`;

  const lowDay = document.createElement("p");
  lowDay.innerHTML = `<p>Lowest price of the day: <span>${LOWDAY}</span> </p>`;

  const lastHours = document.createElement("p");
  lastHours.innerHTML = `<p>Variation last 24 hours: <span>${CHANGEPCT24HOUR}%</span></p>`;

  const lastUpdate = document.createElement("p");
  lastUpdate.innerHTML = `<p>Last update: <span>${LASTUPDATE}</span></p>`;

  result.appendChild(price);
  result.appendChild(highDay);
  result.appendChild(lowDay);
  result.appendChild(lastHours);
  result.appendChild(lastUpdate);
}

function showSpinner() {
  cleanHTML();

  const spinner = document.createElement("DIV");
  spinner.classList.add("spinner");

  spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>    
    `;

  result.appendChild(spinner);
}

function cleanHTML() {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }
}
