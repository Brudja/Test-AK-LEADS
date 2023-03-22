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

  let ipAddress = null;
  let userAgent = null;
  fetch('https://api.ipify.org/?format=json')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      ipAddress = data.ip;
      userAgent = navigator.userAgent;
    })
    .catch((error) => console.error(error));
  let zipCode = inputElement.value
  console.log('zipCode :>> ', zipCode);
  fetch(`${BASE_URL}?apikey=${apiKey}&codes=${zipCode}&country=us`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    let result = data.results[zipCode][0];
    let city = result.city;
    let state = result.state;
    return { city, state };
  })
  .then((zipData) =>markupInfo(zipData, referer, utmParams, ipAddress, userAgent))
  .catch((error) => console.error(error));
}

function markupInfo(zipData, referer, utmParams, ipAddress, userAgent) {
  console.log(zipData);
  const { city, state } = zipData;

  zipInfo.innerHTML = `
    <p><span class="spantext">City:</span> ${city}</p>
    <p><span class="spantext">State:</span> ${state}</p>
    ${ipAddress ? `<p><span class="spantext">IP Address:</span> ${ipAddress}</p>` : ''}
    ${userAgent ? `<p><span class="spantext">User Agent:</span> ${userAgent}</p>` : ''}
    ${referer && referer !== '' && !referer.includes(location.hostname) ? `<p><span class="spantext">HTTP Referer:</span> ${referer}</p>` : ''}
    ${utmParams.toString() !== '' ? `<p><span class="spantext">UTM parameters:</span> ${utmParams.toString()}</p>` : ''}
  `;
}
