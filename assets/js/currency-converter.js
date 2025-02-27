document.addEventListener("DOMContentLoaded", () => {
    loadCurrencies();
    setupDropdowns();
});

async function loadCurrencies() {
    const fromDropdown = document.getElementById("fromDropdown");
    const toDropdown = document.getElementById("toDropdown");

    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();
        const currencyData = {};

        countries.forEach(country => {
            if (country.currencies) {
                Object.keys(country.currencies).forEach(currency => {
                    if (!currencyData[currency]) {
                        currencyData[currency] = {
                            name: country.currencies[currency].name,
                            flag: country.flags.svg
                        };
                    }
                });
            }
        });

        const sortedCurrencies = Object.keys(currencyData).sort();

        sortedCurrencies.forEach(currency => {
            const { name, flag } = currencyData[currency];

            const option1 = document.createElement("div");
            const option2 = document.createElement("div");

            option1.classList.add("dropdown-option");
            option2.classList.add("dropdown-option");

            option1.innerHTML = `<img src="${flag}" class="flag-icon"> ${currency} - ${name}`;
            option2.innerHTML = `<img src="${flag}" class="flag-icon"> ${currency} - ${name}`;

            option1.dataset.value = currency;
            option2.dataset.value = currency;

            option1.addEventListener("click", () => selectCurrency("from", currency, flag));
            option2.addEventListener("click", () => selectCurrency("to", currency, flag));

            fromDropdown.appendChild(option1);
            toDropdown.appendChild(option2);
        });

        // Default selection
        selectCurrency("from", "USD", "https://flagcdn.com/us.svg");
        selectCurrency("to", "EUR", "https://flagcdn.com/eu.svg");

    } catch (error) {
        console.error("Error fetching currencies:", error);
    }
}

function selectCurrency(type, currency, flag) {
    const button = document.getElementById(type === "from" ? "fromButton" : "toButton");
    button.innerHTML = `<img src="${flag}" class="flag-icon"> ${currency}`;
    button.dataset.value = currency;

    // Close dropdown after selection
    closeDropdowns();
}

function setupDropdowns() {
    document.getElementById("fromButton").addEventListener("click", (event) => {
        toggleDropdown("fromDropdown");
        event.stopPropagation();
    });

    document.getElementById("toButton").addEventListener("click", (event) => {
        toggleDropdown("toDropdown");
        event.stopPropagation();
    });

    // Close dropdowns if clicked outside
    document.addEventListener("click", () => closeDropdowns());
}

function toggleDropdown(dropdownId) {
    closeDropdowns();
    document.getElementById(dropdownId).classList.toggle("show");
}

function closeDropdowns() {
    document.getElementById("fromDropdown").classList.remove("show");
    document.getElementById("toDropdown").classList.remove("show");
}

async function convertCurrency() {
    const fromCurrency = document.getElementById("fromButton").dataset.value;
    const toCurrency = document.getElementById("toButton").dataset.value;
    const amount = document.getElementById("amount").value;
    const resultDiv = document.getElementById("result");

    if (!amount || amount <= 0) {
        resultDiv.innerHTML = "<p style='color: red; font-weight: bold;'>Please enter a valid amount.</p>";
        return;
    }

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/f485c0e933d81af70ef1c104/latest/${fromCurrency}`);
        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        if (data.result !== "success") throw new Error("Invalid response from API");

        const rate = data.conversion_rates[toCurrency];

        if (rate) {
            const convertedAmount = (amount * rate).toFixed(2);
            resultDiv.innerHTML = `<p>${amount} ${fromCurrency} = <strong>${convertedAmount} ${toCurrency}</strong></p>`;
        } else {
            resultDiv.innerHTML = "<p style='color: red; font-weight: bold;'>Conversion rate not available.</p>";
        }
    } catch (error) {
        resultDiv.innerHTML = `<p style='color: red; font-weight: bold;'>Error: ${error.message}. Try again later.</p>`;
    }
}
