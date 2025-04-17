

document.addEventListener("DOMContentLoaded", () => {
    loadCurrencies();
    setupDropdowns();
});



async function loadCurrencies() {
    const fromDropdown = document.getElementById("fromDropdown");
    const toDropdown = document.getElementById("toDropdown");


    // Manual flag overrides for specific currencies
    const flagOverrides = {
        'AED': 'https://flagcdn.com/ae.svg',      // United Arab Emirates
        'ARS': 'https://flagcdn.com/ar.svg',      // Argentina
        'AUD': 'https://flagcdn.com/au.svg',      // Australia
        'BRL': 'https://flagcdn.com/br.svg',      // Brazil
        'CAD': 'https://flagcdn.com/ca.svg',      // Canada
        'CHF': 'https://flagcdn.com/ch.svg',      // Switzerland
        'CZK': 'https://flagcdn.com/cz.svg',      // Czech Republic
        'ETB': 'https://flagcdn.com/et.svg',      // Ethiopia
        'EGP': 'https://flagcdn.com/eg.svg',      // Egypt
        'EUR': 'https://flagcdn.com/eu.svg',      // European Union
        'GBP': 'https://flagcdn.com/gb.svg',      // United Kingdom
        'GHS': 'https://flagcdn.com/gh.svg',      // Ghana
        'ILS': 'https://flagcdn.com/il.svg',      // Israel
        'INR': 'https://flagcdn.com/in.svg',      // India
        'JPY': 'https://flagcdn.com/jp.svg',      // Japan
        'KES': 'https://flagcdn.com/ke.svg',      // Kenya
        'MAD': 'https://flagcdn.com/ma.svg',      // Morocco
        'MUR': 'https://flagcdn.com/mu.svg',      // Mauritius
        'MYR': 'https://flagcdn.com/my.svg',      // Malaysia
        'NGN': 'https://flagcdn.com/ng.svg',      // Nigeria
        'NOK': 'https://flagcdn.com/no.svg',      // Norway
        'NZD': 'https://flagcdn.com/nz.svg',      // New Zealand
        'PEN': 'https://flagcdn.com/pe.svg',      // Peru
        'PLN': 'https://flagcdn.com/pl.svg',      // Poland
        'RUB': 'https://flagcdn.com/ru.svg',      // Russia
        'RWF': 'https://flagcdn.com/rw.svg',      // Rwanda
        'SAR': 'https://flagcdn.com/sa.svg',      // Saudi Arabia
        'SEK': 'https://flagcdn.com/se.svg',      // Sweden
        'SGD': 'https://flagcdn.com/sg.svg',      // Singapore
        'SLL': 'https://flagcdn.com/sl.svg',      // Sierra Leone
        'TZS': 'https://flagcdn.com/tz.svg',      // Tanzania
        'UGX': 'https://flagcdn.com/ug.svg',      // Uganda
        'USD': 'https://flagcdn.com/us.svg',      // United States
        'XAF': 'https://flagcdn.com/cm.svg',      // Central Africa (Cameroon representative)
        'XOF': 'https://flagcdn.com/sn.svg',      // West Africa (Senegal representative)
        'ZAR': 'https://flagcdn.com/za.svg',      // South Africa
        'ZMK': 'https://flagcdn.com/zm.svg',      // Zambia (old currency)
        'ZMW': 'https://flagcdn.com/zm.svg',      // Zambia (new currency)
        'MWK': 'https://flagcdn.com/mw.svg'       // Malawi
    };

    // Preferred country codes for currency origins
    const currencyOrigin = {
        'AED': 'AE',  // UAE Dirham - United Arab Emirates
        'ARS': 'AR',  // Argentine Peso - Argentina
        'AUD': 'AU',  // Australian Dollar - Australia
        'BRL': 'BR',  // Brazilian Real - Brazil
        'CAD': 'CA',  // Canadian Dollar - Canada
        'CHF': 'CH',  // Swiss Franc - Switzerland
        'CZK': 'CZ',  // Czech Koruna - Czech Republic
        'ETB': 'ET',  // Ethiopian Birr - Ethiopia
        'EGP': 'EG',  // Egyptian Pound - Egypt
        'EUR': 'EU',  // Euro - European Union (special flag)
        'GBP': 'GB',  // British Pound - United Kingdom
        'GHS': 'GH',  // Ghanaian Cedi - Ghana
        'ILS': 'IL',  // Israeli Shekel - Israel
        'INR': 'IN',  // Indian Rupee - India
        'JPY': 'JP',  // Japanese Yen - Japan
        'KES': 'KE',  // Kenyan Shilling - Kenya
        'MAD': 'MA',  // Moroccan Dirham - Morocco
        'MUR': 'MU',  // Mauritian Rupee - Mauritius
        'MYR': 'MY',  // Malaysian Ringgit - Malaysia
        'NGN': 'NG',  // Nigerian Naira - Nigeria
        'NOK': 'NO',  // Norwegian Krone - Norway
        'NZD': 'NZ',  // New Zealand Dollar - New Zealand
        'PEN': 'PE',  // Peruvian Sol - Peru
        'PLN': 'PL',  // Polish Złoty - Poland
        'RUB': 'RU',  // Russian Ruble - Russia
        'RWF': 'RW',  // Rwandan Franc - Rwanda
        'SAR': 'SA',  // Saudi Riyal - Saudi Arabia
        'SEK': 'SE',  // Swedish Krona - Sweden
        'SGD': 'SG',  // Singapore Dollar - Singapore
        'SLL': 'SL',  // Sierra Leonean Leone - Sierra Leone
        'TZS': 'TZ',  // Tanzanian Shilling - Tanzania
        'UGX': 'UG',  // Ugandan Shilling - Uganda
        'USD': 'US',  // US Dollar - United States
        'XAF': 'CM',  // CFA Franc BEAC - Cameroon (representing Central Africa)
        'XOF': 'SN',  // CFA Franc BCEAO - Senegal (representing West Africa)
        'ZAR': 'ZA',  // South African Rand - South Africa
        'ZMK': 'ZM',  // Zambian Kwacha (old) - Zambia
        'ZMW': 'ZM',  // Zambian Kwacha (new) - Zambia
        'MWK': 'MW'   // Malawian Kwacha - Malawi
    };

    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();
        const currencyData = {};

        // First pass: Process preferred currency origins
        countries.forEach(country => {
            const currencyCodes = Object.keys(country.currencies || {});
            currencyCodes.forEach(currency => {
                if (currencyOrigin[currency] === country.cca2) {
                    currencyData[currency] = {
                        name: country.currencies[currency].name,
                        flag: flagOverrides[currency] || country.flags.svg
                    };
                }
            });
        });

        // Second pass: Fill remaining currencies
        countries.forEach(country => {
            const currencyCodes = Object.keys(country.currencies || {});
            currencyCodes.forEach(currency => {
                if (!currencyData[currency]) {
                    currencyData[currency] = {
                        name: country.currencies[currency].name,
                        flag: flagOverrides[currency] || country.flags.svg
                    };
                }
            });
        });

        // Apply manual flag overrides
        Object.keys(flagOverrides).forEach(currency => {
            if (currencyData[currency]) {
                currencyData[currency].flag = flagOverrides[currency];
            }
        });

        // Filter to only supported currencies
        const supportedCurrencies = [
            'AED', 'ARS', 'AUD', 'BRL', 'CAD', 'CHF', 'CZK', 'ETB', 'EGP',
            'EUR', 'GBP', 'GHS', 'ILS', 'INR', 'JPY', 'KES', 'MAD', 'MUR',
            'MYR', 'NGN', 'NOK', 'NZD', 'PEN', 'PLN', 'RUB', 'RWF', 'SAR',
            'SEK', 'SGD', 'SLL', 'TZS', 'UGX', 'USD', 'XAF', 'XOF', 'ZAR',
            'ZMK', 'ZMW', 'MWK'
        ];

        const filteredCurrencies = Object.keys(currencyData)
            .filter(currency => supportedCurrencies.includes(currency))
            .sort();

        // Clear and populate dropdowns
        fromDropdown.innerHTML = '';
        toDropdown.innerHTML = '';

        filteredCurrencies.forEach(currency => {
            const { name, flag } = currencyData[currency];

            // Create FROM dropdown option
            const fromOption = document.createElement("div");
            fromOption.classList.add("dropdown-option");
            fromOption.innerHTML = `
    <img src="${flag}" class="flag-icon" alt="${currency} flag">
    ${currency} - ${name}
`;
            fromOption.dataset.value = currency;
            fromOption.addEventListener("click", (e) => {
                e.stopPropagation();
                selectCurrency("from", currency, flag);
            });

            // Create TO dropdown option
            const toOption = document.createElement("div");
            toOption.classList.add("dropdown-option");
            toOption.innerHTML = `
                    <img src="${flag}" class="flag-icon" alt="${currency} flag">
                    ${currency} - ${name}
                `;
            toOption.dataset.value = currency;
            toOption.addEventListener("click", (e) => {
                e.stopPropagation();
                selectCurrency("to", currency, flag);
            });

            // Append to respective dropdowns
            fromDropdown.appendChild(fromOption);
            toDropdown.appendChild(toOption);
        });

        // Set default selections
        if (currencyData.USD) selectCurrency("from", "USD", currencyData.USD.flag);
        if (currencyData.EUR) selectCurrency("to", "EUR", currencyData.EUR.flag);

    } catch (error) {
        console.error("Error fetching currencies:", error);
        document.getElementById("result").innerHTML = `
            <div class="error">
                Failed to load currencies: ${error.message}
            </div>
        `;
    }
}


function selectCurrency(type, currency, flag) {
    const button = document.getElementById(type === "from" ? "fromButton" : "toButton");
    button.innerHTML = `<img src="${flag}" class="flag-icon"> ${currency}`;
    button.dataset.value = currency;
    closeDropdowns();  // Keep this to close after selection
}


function toggleDropdown(dropdownId) {
    const otherDropdownId = dropdownId === "fromDropdown" ? "toDropdown" : "fromDropdown";
    document.getElementById(otherDropdownId).classList.remove("show");
    document.getElementById(dropdownId).classList.toggle("show");
}



function closeDropdowns() {
    document.getElementById("fromDropdown").classList.remove("show");
    document.getElementById("toDropdown").classList.remove("show");
}

// function setupDropdowns() {
//     document.getElementById("fromButton").addEventListener("click", (event) => {
//         toggleDropdown("fromDropdown");
//         event.stopPropagation();
//     });

//     document.getElementById("toButton").addEventListener("click", (event) => {
//         toggleDropdown("toDropdown");
//         event.stopPropagation();
//     });

//     // Close dropdowns when clicking outside
//     document.addEventListener("click", () => closeDropdowns());

//     // Prevent event propagation for dropdown items
//     document.querySelectorAll('#fromDropdown .dropdown-item, #toDropdown .dropdown-item').forEach(item => {
//         item.addEventListener('click', (event) => {
//             event.stopPropagation();
//         });
//     });
// }

function setupDropdowns() {
    document.getElementById("fromButton").addEventListener("click", (event) => {
        event.stopPropagation();
        toggleDropdown("fromDropdown");
    });

    document.getElementById("toButton").addEventListener("click", (event) => {
        event.stopPropagation();
        toggleDropdown("toDropdown");
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", () => closeDropdowns());
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
        console.log(data, "data.data")

        if (data.status === "success") { // Fixed assignment operator (= to ===)
            // Create number formatters
            const amountFormatter = new Intl.NumberFormat('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });

            const convertedFormatter = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3
            });

            const feeFormatter = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            const rateFormatter = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 4,
                maximumFractionDigits: 5
            });

            // Format values
            const formattedAmount = amountFormatter.format(amount);
            const formattedConverted = convertedFormatter.format(data.data.source.modifiedSourceAmount);
            const formattedFee = data.data.perryTransferFee ?
            (parseFloat(data.data.perryTransferFee.replace('%', '')) / amount) * 100 : null;
            const formattedRate = data.data.perryExchangeRate ?
                rateFormatter.format(data.data.perryExchangeRate) : null;

            resultDiv.innerHTML = `
                    <div class="conversion-result">
                        <p>${fromCurrency} ${formattedAmount}  =</p>
                        <h3>${toCurrency} ${formattedConverted}</h3>
                        ${formattedFee ? `<p class="fee transferFee">Transfer Fee Added: ${fromCurrency} ${formattedFee}</p>` : ''}
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
                <p>⚠️ Error during conversion. <br> ${error}</p>
                
            </div>
        `;
    } finally {
        // Hide spinner
        convertBtn.classList.remove("converting");
    }
}





