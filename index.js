const apiKey = "8d20fda0-c7da-11ed-89b6-c77bf9e1f255";
const BASE_URL = "https://app.zipcodebase.com/api/v1/search";

const inputElement = document.querySelector("#zipCodeInput");
const buttonElement = document.querySelector("#renderButton");
const zipInfo = document.querySelector(".zipInfo");

buttonElement.addEventListener("click", fetchZipCode);

function fetchZipCode() {
  let referer = document.referrer;
  let utmParams = new URLSearchParams(location.search);

  if (referer && referer !== '' && !referer.includes(location.hostname)) {
  }

  let ipAddressPromise = fetch('https://api.ipify.org/?format=json')
    .then((response) => response.json())
    .then((data) => {
      return data.ip;
    })
    .catch((error) => console.error(error));

  let zipCode = inputElement.value;
  let zipCodePromise = fetch(`${BASE_URL}?apikey=${apiKey}&codes=${zipCode}&country=us`)
    .then((response) => response.json())
    .then((data) => {
      let result = data.results[zipCode][0];
      let city = result.city;
      let state = result.state;
      return { city, state };
    })
    .catch((error) => console.error(error));

  Promise.all([ipAddressPromise, zipCodePromise])
    .then(([ipAddress, zipData]) => {
      const userAgent = navigator.userAgent;
      markupInfo(zipData, referer, utmParams, ipAddress, userAgent);
    })
    .catch((error) => console.error(error));
}

function markupInfo(zipData, referer, utmParams, ipAddress, userAgent) {
  const { city, state } = zipData;

  let utmParamsMarkup = '';
  for (let [key, value] of utmParams) {
    utmParamsMarkup += `<p><span class="spantext">${key}:</span> ${value}</p>`;
  }

  zipInfo.innerHTML = `
    <p><span class="spantext">City:</span> ${city}</p>
    <p><span class="spantext">State:</span> ${state}</p>
    ${ipAddress ? `<p><span class="spantext">IP Address:</span> ${ipAddress}</p>` : ''}
    ${userAgent ? `<p><span class="spantext">User Agent:</span> ${userAgent}</p>` : ''}
    ${referer && referer !== '' && !referer.includes(location.hostname) ? `<p><span class="spantext">HTTP Referer:</span> ${referer}</p>` : ''}
    ${utmParamsMarkup}
  `;
}
