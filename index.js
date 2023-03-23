const apiKey = "8d20fda0-c7da-11ed-89b6-c77bf9e1f255";
const BASE_URL = "https://app.zipcodebase.com/api/v1/search";

const inputElement = document.querySelector("#zipCodeInput");
const buttonElement = document.querySelector("#renderButton");
const zipInfo = document.querySelector(".zipInfo");

buttonElement.addEventListener("click", fetchZipCode);

let referer = document.referrer;
  let utmParams = new URLSearchParams(location.search);

  if (referer && referer !== '' && !referer.includes(location.hostname)) {
  }

function fetchZipCode() {
  
  let ipAddressPromise = fetch('https://api.ipify.org/?format=json')
    .then((response) => response.json())
    .then((data) => {
      return data.ip;
    })
    .catch((error) => {
      zipInfo.innerHTML = "<p class='error'>Invalid zip code. Zip code not found in database.</p>";
      showBackButton();
      addBackButtonListener()
    });


  let zipCode = inputElement.value;
  if (!/^\d{5}$/.test(zipCode)) {
    zipInfo.innerHTML = "<p class='error'>Invalid zip code. Please enter a 5-digit zip code.</p>";
    showBackButton();
    addBackButtonListener()
    return;
  }

 let zipCodePromise = fetch(`${BASE_URL}?apikey=${apiKey}&codes=${zipCode}&country=us`)
  .then((response) => response.json())
  .then((data) => {
    if (zipCode in data.results) {
      let result = data.results[zipCode][0];
      let city = result.city;
      let state = result.state;
      return { city, state };
    } else {
      zipInfo.innerHTML = "<p class='error'>Invalid zip code. Zip code not found in database.</p>";
      showBackButton();
      addBackButtonListener()
      throw new Error('Zip code not found in database');
    }
  })
  .catch(() => {
    zipInfo.innerHTML = "<p class='error'>Invalid zip code. Zip code not found in database.</p>";
    showBackButton();
    addBackButtonListener()
  });

  Promise.all([ipAddressPromise, zipCodePromise])
    .then(([ipAddress, zipData]) => {
      const userAgent = navigator.appVersion;
      markupInfo(zipData, referer, utmParams, ipAddress, userAgent);
    })
    .catch();
}

const backButton = document.createElement('button');
backButton.textContent = 'Back to Home';
backButton.classList.add('btn', 'btn-primary', 'mb-3', 'd-none');
zipInfo.after(backButton);

function showBackButton() {
  backButton.classList.remove('d-none');
}
function hideBackButton() {
  backButton.classList.add('d-none');
}

function addBackButtonListener() {
  backButton.addEventListener('click', backButtonClickHandler);
}

function backButtonClickHandler() {
  window.location.href = '/';
  hideBackButton();
  backButton.removeEventListener('click', backButtonClickHandler);
}

function markupInfo(zipData, referer, utmParams, ipAddress, userAgent) {
  if (!zipData) {
    return;
  }
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
  showBackButton()
  addBackButtonListener();
  
}
