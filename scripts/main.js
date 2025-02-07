//const apiKey = import.meta.env.VITE_API_KEY; // "freecurrencyapi.com" API method

const amountInput = document.getElementById("amountText");
const resultText = document.getElementById("resultText");
const errorText = document.getElementById("errorText");

const baseCurrencySelect = document.getElementById("baseCurrency");
const targetCurrencySelect = document.getElementById("targetCurrency");

const convertButton = document.getElementById("convertButton");
const swapButton = document.getElementById("swapButton");

const maxCharacterLength = 16;

const currencies = {
    "EUR": "Euro (EUR)", 
    "USD" : "US Dollar (USD)", 
    "HUF": "Hungarian Forint (HUF)", 
    "CAD": "Canadian Dollar (CAD)", 
    "GBP": "British Pound Sterling (GBP)"
};


function createOptions() { // Creates the option elements

    Object.entries(currencies).forEach(([key, value]) => {
        const optionBase = document.createElement("option");
        const optionTarget = document.createElement("option");

        optionBase.value = key;
        optionBase.textContent = value;

        optionTarget.value = key;
        optionTarget.textContent = value;

        optionBase.classList.add("optionList");
        optionTarget.classList.add("optionList");


        baseCurrencySelect.appendChild(optionBase);
        targetCurrencySelect.appendChild(optionTarget);


    });

    if (targetCurrencySelect.options.length >= 2) {
        baseCurrencySelect.options[0].selected = true; // Sets the first currency selected
        targetCurrencySelect.options[1].selected = true; // Sets the second currency selected
    }

}

createOptions();




convertButton.addEventListener("click", async () => {

    const errorMessage = "Error: Request failed.";

    try {

        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        const amount = amountInput.value;


        if (baseCurrency != targetCurrency)
        {
            if (amount > 0) {

                const data = await requestData(baseCurrency, targetCurrency, errorMessage);

                //const resultCurrency = Object.keys(data.data)[0]; // Gets the currency name
                const resultValue = Object.values(data.data)[0]; // Gets the currency amount
        
                let result = calculateCurrency(amount, resultValue);
                result = result >= 1 ? Number(result).toFixed(4) : result;
            

                //displayResult(`${result} ${resultCurrency}`);
                displayResult(result);

                if (errorText.textContent != "") {
                    errorText.textContent = "";
                }
    
            }
            else {
                displayError("The amount must be higher than 0.");
            }
        }
        else {
            displayError("You can't convert to the same currency!");
        }


    }
    catch (error) {
        console.error(error);
        displayError(errorMessage);
    }


});


swapButton.addEventListener("click", () => { // Swaps the values of currencies in the select/input fields 
    const oldBaseSelectValue = baseCurrencySelect.value;
    const oldTargetSelectValue = targetCurrencySelect.value;
    const oldAmountValue = amountInput.value;
    const oldResultValue = resultText.value;

    baseCurrencySelect.value = oldTargetSelectValue;
    targetCurrencySelect.value = oldBaseSelectValue;
    amountInput.value = oldResultValue;
    resultText.value = oldAmountValue;
});

 
async function requestData(baseCurrency, targetCurrency, errorMessage) { // Fetch data from the API

    //const requestUrl = `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&currencies=${targetCurrency}&base_currency=${baseCurrency}`; // Using the "freecurrencyapi.com" API method
    const requestUrl = `https://molnar-zoltan-currency-converter.netlify.app/.netlify/functions/getData?param1=${baseCurrency}&param2=${targetCurrency}`; // Using the Netlify serverless function method
    const response = await fetch(requestUrl);

    if (!response.ok) {
        throw new Error(errorMessage);
    }

    return await response.json();

}


function calculateCurrency(inputAmount, targetAmount) {
    return inputAmount * targetAmount;
}

function displayResult(result) {
    resultText.value = result; // Displays the result into thwe target currency input
}

function displayError(message) {
    errorText.textContent = message;
}


amountInput.addEventListener("input", (event) => {
    if (event.target.value.length > maxCharacterLength) {
        event.target.value = event.target.value.slice(0, maxCharacterLength); // Limits the input's max character length
    }
});