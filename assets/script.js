// API-CURRENT WEATHER link: https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// API-Key: 6dbc49a4b8c7ccf14f99179edf5da007
// API-5-DAY LINK: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// API-KEY:5992091e2298f94f0b179fed7fc2df0d

// Defined Variables//
let searchForm = document.querySelector("#search-form");
let searchBtn = document.querySelector("#search-btn");
let historyBtn = document.querySelector(".history-item");
let clearHistoryBtn = document.querySelector("#clear-history")
let recentSearchContainer = document.querySelector("#recent-search-container");
let searchContainer = document.querySelector(".search-container");
let searchInput = document.querySelector("#search-input");
let getStorage = localStorage.getItem("recentSearch") || "[]";
let recentSearchArray = JSON.parse(getStorage);
let forecastContainer = document.getElementById("forecast-container");
let currentContainer = document.getElementById("current-container")

// This function fetches latitude and longitude data and returns it
// usage of async/wait and fetch from https://www.youtube.com/watch?v=Yp9KIcSKTNo
async function loadLatLon(cityNameValue) {
  // let cityName = searchInput.value;
  let cityName = cityNameValue;
  let latKey = '73dc2b7a96e932f4bffbe268927875ae';
  let latURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=10&appid=${latKey}`;

  const response = await fetch(latURL);
  const latLonData = await response.json();

  return latLonData;
}

async function loadUVI(lat,lon){
  let uviKey = '1bfd9ae7ce69911e90bd1495a7f9ef63';
  let uviURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${uviKey}`;
  const response = await fetch(uviURL);
  const uviData = await response.json();

  return uviData;
}

// This function fetches and loads current weather data to page.
let fetchWeather = function (lat, lon){
    let weatherKey = '6dbc49a4b8c7ccf14f99179edf5da007'
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}`;
    
    let weatherData;

    fetch(weatherUrl)
      .then(response => response.json())
      .then(data => {
            weatherData = data;
            console.log(weatherData);
            displayCurrent(weatherData);
      })
      .catch(function (error) {
        alert('Unable to grab weather data. Error: ' + error);
      });
}

// This function fetches and loads 5 day forecast weather data to the page.
let fetchFiveDay = function(lat, lon){
    let fiveDayKey = '5992091e2298f94f0b179fed7fc2df0d' ;
    var apiUrl3 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${fiveDayKey}`;

    let forecastData;

    fetch(apiUrl3)
        .then(response => response.json())
        .then(data => {
          forecastData = data.list
          console.log(forecastData);
          displayForecast(forecastData);
        })
        .catch(function (error) {
            console.log(error)
            alert('Unable to grab forecast data. Error: ' + error);
        });
}

let kToF = function (kelvin){
  return ((((kelvin - 273.15) * 9) / 5) + 32).toFixed(2); 
};

let displayCurrent = async function (dataInput){
  let currentContainer = document.getElementById("current-container");
  currentContainer.setAttribute("class", "col-3 mx-auto my-4")

  let name = document.createElement('div');
  name.innerHTML = dataInput.name;
  name.setAttribute("class", "mx-5");
  currentContainer.append(name);

  let date = document.createElement('div')
  date.innerHTML = moment().format('L');
  date.setAttribute("class", "mx-5");
  currentContainer.append(date)

  let iconId = dataInput.weather[0].icon;
  let icon = document.createElement('img');
  let iconSpan = document.createElement('span');
  icon.setAttribute("src", `https://openweathermap.org/img/wn/${iconId}@2x.png`);
  icon.setAttribute("class", "mx-5");
  iconSpan.append(icon);
  currentContainer.append(iconSpan);

  let temp = document.createElement('div');
  temp.innerHTML = `Temp: ${kToF(dataInput.main.temp)};`
  temp.setAttribute("class", "mx-5");
  currentContainer.append(temp);

  let humidity = document.createElement('div');
  humidity.innerHTML = `Humidity: ${dataInput.main.humidity}`;
  humidity.setAttribute("class", "mx-5");
  currentContainer.append(humidity);

  let wind = document.createElement('div');
  wind.innerHTML = `Wind Speed: ${dataInput.wind.speed}`;
  wind.setAttribute("class", "mx-5");
  currentContainer.append(wind);

  // Referencing https://www.epa.gov/sunsafety/uv-index-scale-0 for UV index scale
  let uv = document.createElement('div');
  let uvRes = await loadUVI(dataInput.coord.lat, dataInput.coord.lon);
  let uviVal = uvRes.current.uvi;
  uv.innerHTML = uviVal;
  if (uviVal >= 0 && uviVal < 3){
    uv.setAttribute("class", "uv-green mx-5");
  } else if (uviVal >= 3 && uviVal < 6){
      uv.setAttribute("class", "uv-yellow mx-5");
  } else if (uviVal >= 6 && uviVal < 8){
      uv.setAttribute("class", "uv-orange mx-5");
  } else if (uviVal >= 8 && uviVal < 11){
      uv.setAttribute("class", "uv-red mx-5");
  } else {
      uv.setAttribute("class", "uv-purple mx-5");
  };
  currentContainer.append(uv)
}


let displayForecast = function (dataInput){
  let rowDiv = document.createElement("div")
  rowDiv.setAttribute("class", "row")
  forecastContainer.append(rowDiv)

  let forecastCounter = 7;
  for (i=1; i<=5; i++){
    // let dayContainer = document.getElementById(`day${i}`);
    let dayContainer = document.createElement("div");
    dayContainer.setAttribute("id", `day${i}`);
    dayContainer.setAttribute("class", "mx-4 my-4")

    let date = document.createElement('div');
    let currentDate = moment();
    date.innerHTML = moment().add(i, 'days').format('MM/DD/YYYY')
    dayContainer.append(date);
    
    let iconId = dataInput[forecastCounter].weather[0].icon;
    let icon = document.createElement('img');
    icon.setAttribute("src", `https://openweathermap.org/img/wn/${iconId}@2x.png`);

    dayContainer.append(icon);

    let temp = document.createElement('div');
    let fahrenheit = kToF(dataInput[forecastCounter].main.temp);
    temp.innerHTML = `Temp: ${fahrenheit}`;
    dayContainer.append(temp);

    let humidity = document.createElement('div');
    humidity.innerHTML = `Humidity: ${dataInput[forecastCounter].main.humidity}`;
    dayContainer.append(humidity);

    let wind = document.createElement('div');
    wind.innerHTML = `Wind Speed: ${dataInput[forecastCounter].wind.speed}`;
    dayContainer.append(wind);

    rowDiv.append(dayContainer);

    // 3 hour increments for OpenWeather API forecast reponse. Need to increase counter by 8 to equal a full 24 hours
    forecastCounter+=8;

  }
}

// Using code reference from https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
let removeAllChildNodes = function (parent){
  while(parent.firstChild){
    parent.removeChild(parent.firstChild)
  }
}

// Below are three verions of similar functionality. May need to refactor later.

let previousSearch = async function () {
  removeAllChildNodes(currentContainer);
  removeAllChildNodes(forecastContainer);
  let resultArray = [];
  try {
    resultArray = await loadLatLon(recentSearchArray[0].city)
    let latLon = {lat: resultArray[0].lat, lon: resultArray[0].lon}
    fetchWeather(latLon.lat, latLon.lon);
    fetchFiveDay(latLon.lat, latLon.lon);
  } catch (e) {
    console.log("Error: "+ e)
  }
}

let populateSearchData = async function (event){
  event.preventDefault();
  removeAllChildNodes(currentContainer);
  removeAllChildNodes(forecastContainer);
  let resultArray = [];
  try {
    resultArray = await loadLatLon(searchInput.value)
    let latLon = {lat: resultArray[0].lat, lon: resultArray[0].lon}
    fetchWeather(latLon.lat, latLon.lon);
    fetchFiveDay(latLon.lat, latLon.lon);

    // localStorage code
    let oldSearch = {city: resultArray[0].name}
    recentSearchArray.unshift(oldSearch)
    setStorage(recentSearchArray);

    // add history to side bar
    let historyItem = document.createElement('div');
    historyItem.setAttribute("class", "history-item");
    historyItem.textContent = resultArray[0].name
    historyItem.addEventListener("click", populateHistoricalData);
    recentSearchContainer.prepend(historyItem);
    searchInput.value = '';
  } catch (e) {
    alert("Error: " + e)
    console.log("Error: "+ e)
  }
}

let populateHistoricalData = async function (event){
  event.preventDefault();
  removeAllChildNodes(currentContainer);
  removeAllChildNodes(forecastContainer);
  let resultArray = [];
  try {
    resultArray = await loadLatLon(this.textContent)
    let latLon = {lat: resultArray[0].lat, lon: resultArray[0].lon}
    console.log(resultArray);
    console.log(latLon);
    fetchWeather(latLon.lat, latLon.lon);
    fetchFiveDay(latLon.lat, latLon.lon);

    // localStorage code
    let oldSearch = {city: resultArray[0].name}
    recentSearchArray.unshift(oldSearch)
    setStorage(recentSearchArray);

    // add history to side bar
    let historyItem = document.createElement('div');
    historyItem.setAttribute("class", "history-item");
    historyItem.textContent = resultArray[0].name
    historyItem.addEventListener("click", populateHistoricalData);
    recentSearchContainer.prepend(historyItem);

  } catch (e) {
    alert("Error: " + e)
    console.log("Error: "+ e)
  }
}

let showSearchHistory = function () {
  let historyArray = JSON.parse(getStorage);
  for (i = historyArray.length - 1; i >= 0; i--){
    let historyItem = document.createElement('div');
    historyItem.setAttribute("class", "history-item");
    historyItem.textContent = historyArray[i].city;
    historyItem.addEventListener("click", populateHistoricalData);
    console.log(historyItem, historyArray);
    recentSearchContainer.prepend(historyItem);
  }
};

let setStorage = function (array) {
  localStorage.setItem("recentSearch", JSON.stringify(array));
};

let clearHistory = function () {
  localStorage.clear();
  removeAllChildNodes(recentSearchContainer);
};

clearHistoryBtn.addEventListener("click", clearHistory);

searchBtn.addEventListener("click", populateSearchData);

// Leverage enter key for inputs. Reference: https://stackoverflow.com/questions/155188/trigger-a-button-click-with-javascript-on-the-enter-key-in-a-text-box
searchInput.addEventListener("keypress", function(event){
  event.preventDefault();
  if (event.keyCode == 13) {
    searchBtn.click();
  }
})

showSearchHistory();

previousSearch();
