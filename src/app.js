import cities from "./cities";

const properties = document.querySelector("#property-container");
const sfHeader = document.querySelector("#sf-header");

//Integrate auto complete library

const getReprString = (city) => `${city.city}, ${city.code}`;

var my_autoComplete = new autoComplete({
  selector: 'input[name="search"]',
  minChars: 3,
  source: function (term, suggest) {
    term = term.toLowerCase();
    var choices = cities;
    var matches = [];
    for (let i = 0; i < choices.length; i++)
      if (~getReprString(choices[i]).toLowerCase().indexOf(term))
        matches.push(getReprString(choices[i]));
    suggest(matches);
  },
});

//Search properties

document.querySelector("form").addEventListener("submit", searchProperties);

function searchProperties(e) {
  e.preventDefault();
  const [city, stateCode] = document
    .querySelector('input[name="search"]')
    .value.split(",")
    .map((_) => _.trim());
  fetch(
    `https://realtor.p.rapidapi.com/properties/v2/list-for-sale?sort=relevance&city=${city}&limit=60&offset=0&state_code=${stateCode}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "realtor.p.rapidapi.com",
        "x-rapidapi-key": "be8a00a409msh54ed15d6a211e67p1a063ejsnf387341d9ff7",
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((response) => {
      console.log(response);
      clearPropertyContainer();
      propertiesForSale(response);
    })
    .catch((err) => {
      console.log(err);
    });
}

//San Francisco properties

document.addEventListener("DOMContentLoaded", sanFranciscoProperties);

function sanFranciscoProperties() {
  fetch(
    `https://realtor.p.rapidapi.com/properties/v2/list-for-sale?sort=relevance&city=San%20Francisco%20&limit=60&offset=0&state_code=CA`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "realtor.p.rapidapi.com",
        "x-rapidapi-key": "be8a00a409msh54ed15d6a211e67p1a063ejsnf387341d9ff7",
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((response) => {
      console.log(response);
      propertiesForSale(response);
    })
    .catch((err) => {
      console.log(err);
    });
}

//Properties for sale

function propertiesForSale(homes) {
  let output = "";

  homes.properties.forEach((home) => {
    let image = home.thumbnail ? home.thumbnail : "image-not-found.png";
    let beds = home.beds ? home.beds : 0;
    let baths = home.baths ? home.baths : 0;
    let price = home.price.toLocaleString();

    output += `
    <div class="h-64 px-2 py-2 border-1 border-black mt-4 mb-12">
    <p class="font-sans text-xs text-gray-600 mb-1">Brokered by ${home.branding.listing_office.list_item.name}</p>
    <a href="${home.rdc_web_url}" class="toggle-image" data-id="${home.id}">
    <img src=${image}
    alt=""
    class="w-full h-full"></img>
    <p class="font-sans text-sm mt-2"><span class="ml-3">For Sale</span> <span class="font-semibold text-lg">$${price}</span></p>
    <p class="font-sans text-sm"><span class="ml-3 font-semibold">${beds}</span> bed   <span class="font-semibold">${baths}</span> bath</p>
    <p class="font-sans text-sm"><span class="ml-3">${home.address.line}</span>
     <span class="ml-3">${home.address.city}</span>, <span>${home.address.state_code}</span> <span>${home.address.postal_code}</span>
    </p>
    </a> 
    </div>
    `;
  });
  properties.innerHTML = output;
}

function clearPropertyContainer() {
  sfHeader.remove();
  properties.innerHTML = "";
}
