let api = "https://restcountries.com/v3.1/all";
let main = document.querySelector("main");
let input = document.querySelector("input");
let select = document.querySelector("select");
let mode = document.getElementById("mode");

fetch(api)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch data from the API");
        }
        return response.json();
    })
    .then((json) => {

        showData(json);

        input.addEventListener("input", () => {
            let filteredArray = json.filter((element) =>
                element.name.common.toLowerCase().includes(input.value.toLowerCase())
            );
            showData(filteredArray);
        });

        select.addEventListener("change", () => {
            let filteredData = json.filter(
                (element) => element.region === select.value
            );
            showData(filteredData);
        });
    })
    .catch((error) => {
        console.error("Error:", error);
        main.innerHTML = "<p>Failed to load data. Please try again later.</p>";
    });

function showData(data) {
    main.innerHTML = "";
    data.forEach((country) => {
        let population = country.population || "N/A";
        let region = country.region || "N/A";
        let capital = country.capital ? country.capital[0] : "N/A";

        let div = document.createElement("div");
        div.classList.add("box");
        div.innerHTML = `
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
      <div class="box-text">
        <h2>${country.name.common}</h2>
        <p><span class="bold">Population</span>: ${population}</p>
        <p><span class="bold">Region</span>: ${region}</p>
        <p><span class="bold">Capital</span>: ${capital}</p>
      </div>
    `;

        div.addEventListener("click", () => {
            showDetails(country);
        });

        main.appendChild(div);
    });
}

function showDetails(country) {
    document.querySelector(".search").style.display = "none";

    let nativeName =
        country.name.nativeName && Object.values(country.name.nativeName)[0]?.common;
    let languages = Object.values(country.languages || {}).join(", ");
    let currencies = Object.values(country.currencies || {})
        .map((currency) => currency.name)
        .join(", ");
    let tld = country.tld ? country.tld.join(", ") : "N/A";

    main.innerHTML = `
    <button id="backButton" style="margin-bottom: 10px; padding: 5px 10px; font-size: 0.8rem; border: none; border-radius: 4px; background-color: pink; cursor: pointer;">
      &larr; Back
    </button>
    <div class="details">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
      <div>
        <h2>${country.name.common}</h2>
        <p><span class="bold">Native Name</span>: ${nativeName || "N/A"}</p>
        <p><span class="bold">Population</span>: ${country.population}</p>
        <p><span class="bold">Region</span>: ${country.region}</p>
        <p><span class="bold">Sub Region</span>: ${country.subregion || "N/A"}</p>
        <p><span class="bold">Capital</span>: ${country.capital || "N/A"}</p>
        <p><span class="bold">Languages</span>: ${languages || "N/A"}</p>
        <p><span class="bold">Currencies</span>: ${currencies || "N/A"}</p>
        <p><span class="bold">Top Level Domain</span>: ${tld}</p>
      </div>
    </div>
  `;

    document.getElementById("backButton").addEventListener("click", () => {
        document.querySelector(".search").style.display = "flex";
        fetch(api)
            .then((response) => response.json())
            .then((data) => showData(data));
    });
}

mode.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    input.classList.toggle("dark-mode");
    select.classList.toggle("dark-mode");
    document.querySelector("header").classList.toggle("dark-mode");
    document.querySelectorAll(".box").forEach((box) => {
        box.classList.toggle("dark-mode");
    });

    if (mode.innerHTML.includes("Dark Mode")) {
        mode.innerHTML = '<i class="fa-regular fa-sun"></i> Light Mode';
    } else {
        mode.innerHTML = '<i class="fa-regular fa-moon"></i> Dark Mode';
    }
});
