

document.addEventListener("DOMContentLoaded", () => {
    loadCurrencies();
    setupDropdowns();
    setupFormHandling()
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
        console.log(sortedCurrencies, "before, sortedcountries")
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
        console.log(sortedCurrencies, "after, sortedcountries")
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
    const include_perry_fee = true;
    

    const convertBtn = document.getElementById("convertBtn");
    const spinner = convertBtn.querySelector(".spinner");
    const btnText = convertBtn.querySelector(".btn-text");
    // Clear previous results
    resultDiv.innerHTML = '';

    convertBtn.classList.add("converting");

    try {
        // console.log("Starting conversion with:", { fromCurrency, toCurrency, amount });

        if (!amount || amount <= 0) {
            throw new Error("Please enter a valid amount greater than 0");
        }
        if (!fromCurrency || !toCurrency) {
            throw new Error("Please select both source and target currencies");
        }

        // Build API URL with proper encoding
        const apiUrl = new URL("https://perryleo-server-dest.vercel.app/api/pbc/getTransferRates");
        const params = {
            amount: amount,
            source_currency: fromCurrency,
            destination_currency: toCurrency,
            include_perry_fee: include_perry_fee
        };

        Object.keys(params).forEach(key =>
            apiUrl.searchParams.append(key, params[key])
        );

        // console.log("API Request URL:", apiUrl.href);

        const response = await fetch(apiUrl);
        const data = await response.json();


        if (data.status != "success") {
            const errorMessage = data.message & `HTTP Error: ${response.status}`;
            throw new Error(errorMessage);
        }

        // Handle successful response
        if (data.status = "success") {
            // console.log("API Response:", data, "status=" , data.status);
            resultDiv.innerHTML = `
                <div class="conversion-result">
                    <p>${amount} ${fromCurrency} =</p>
                    <h3>${data.data.source.modifiedSourceAmount} ${toCurrency}</h3>
                    
                    ${data.data.perryTransferFee ? `<p class="fee transferFee">Transfer Fee: ${data.data.perryTransferFee}</p>` : ''}
                    ${data.data.perryExchangeRate ? `<p class="fee exchangeRate">Exchange Rate: ${data.data.perryExchangeRate}</p>` : ''}
                    
                </div>
            `;
        } else {
            throw new Error("Invalid response format from server");
        }

        // ${console.log("data.data.source.amount:", data.data.perryTransferFee)}
        // ${data.data.modifiedRate ? `<p class="fee">Exchange Rate: ${data.data.rate} ${fromCurrency}</p>` : ''}

    } catch (error) {
        console.error("Conversion Error:", error);
        resultDiv.innerHTML = `
            <div class="error">
                <p>⚠️ No conversion available for the selections.</p>
                
            </div>
        `;
    } finally {
        // Hide spinner
        convertBtn.classList.remove("converting");
    }
}

{/* <p>${error.message}</p> */}


function setupFormHandling() {
    const form = document.getElementById("converter-form");

    // Prevent default form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        convertCurrency(); // Trigger conversion on form submission
    });

    // Handle Enter key in amount field
    document.getElementById("amount").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            convertCurrency();
        }
    });
}

