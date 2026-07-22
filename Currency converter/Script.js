const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromselect = document.querySelector('.from select');
const toselect = document.querySelector('.to select');
const msg = document.querySelector("#msg");

for (let select of dropdowns) {
    for (let codes in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = codes;
        newOption.value = codes;
        select.append(newOption);
        if (select.name === "from" && codes === "USD") {
            newOption.selected = true;
        }
        if (select.name === "to" && codes === "INR") {
            newOption.selected = true;
        }
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let currCountry = countryList[currCode];
    let newImg = element.parentElement.querySelector("img");
    newImg.src = `https://flagsapi.com/${currCountry}/shiny/64.png`;

}
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector("form input");
    let amtvalue = amount.value;

    if (amtvalue == "" || amtvalue <= 0) {
        amtvalue = 1;
        amount.value = "1";
    }
    let URL = `${BASE_URL}/${fromselect.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data[fromselect.value.toLowerCase()][toselect.value.toLowerCase()];
    let finalamt = amtvalue * rate;
    msg.innerText = `${amtvalue} ${fromselect.value} = ${finalamt.toFixed(2)} ${toselect.value}`;
});

