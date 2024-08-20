document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const resultDiv = document.getElementById('result');
    const swapButton = document.getElementById('swapCurrencies');

    // API URL and key
    const apiKey = '45be014a38c2473d9fdeea3f36b39914';
    const apiURL = `https://api.currencyfreaks.com/latest?apikey=${apiKey}`;

    // Fetch and populate currency options
    fetchCurrencies()
        .then(currencies => {
            // Sort currencies alphabetically
            currencies.sort();
            populateSelectOptions(currencies, fromCurrencySelect);
            populateSelectOptions(currencies, toCurrencySelect);
        })
        .catch(error => console.error('Error fetching currencies:', error));

    // Handle form submission
    document.getElementById('currency-form').addEventListener('submit', event => {
        event.preventDefault();
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        convertCurrency(amount, fromCurrency, toCurrency)
            .then(result => {
                resultDiv.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
            })
            .catch(error => console.error('Error converting currency:', error));
    });

    // Handle swap button click
    swapButton.addEventListener('click', () => {
        const fromCurrency = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = fromCurrency;
    });

    // Function to fetch currencies
    function fetchCurrencies() {
        return fetch(apiURL)
            .then(response => response.json())
            .then(data => Object.keys(data.rates))
            .catch(error => {
                console.error('Error fetching currencies:', error);
                throw error;
            });
    }

    // Function to populate select options
    function populateSelectOptions(currencies, selectElement) {
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            selectElement.appendChild(option);
        });
    }

    // Function to convert currency
    function convertCurrency(amount, fromCurrency, toCurrency) {
        return fetch(apiURL)
            .then(response => response.json())
            .then(data => {
                const rate = data.rates[toCurrency] / data.rates[fromCurrency];
                return (amount * rate).toFixed(2);
            })
            .catch(error => {
                console.error('Error fetching exchange rates:', error);
                throw error;
            });
    }
});



