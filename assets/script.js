// API-CURRENT WEATHER link: https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// API-Key: 6dbc49a4b8c7ccf14f99179edf5da007
// API-5-DAY LINK: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// API-KEY:5992091e2298f94f0b179fed7fc2df0d

// Defined Variables//
let searchForm = document.querySelector("#search-form");
let searchBtn = document.querySelector("#search-btn");
let searchHistory = document.querySelector(".list-group");
let searchContainer = document.querySelector(".search-container");
let searchInput = document.querySelector("#search-input");

// This function fetches latitude and longitude data and returns it
// usage of async/wait and fetch from https://www.youtube.com/watch?v=Yp9KIcSKTNo
async function loadLatLon() {
  let cityName = searchInput.value;
  let latKey = '73dc2b7a96e932f4bffbe268927875ae';
  let latURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=10&appid=${latKey}`;

  const response = await fetch(latURL);
  const latLonData = await response.json();

  return latLonData;
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
        })
        .catch(function (error) {
            alert('Unable to grab forecast data. Error: ' + error);
        });
}

// Add event listener: when searchBtn is clicked, grab lat and lon values, and call functions to fetch current weather and forecast data
searchBtn.addEventListener("click", async () => {
  let resultArray = [];

  try {
    //  latLon = await loadLatLon();
    resultArray = await loadLatLon()
    let latLon = {lat: resultArray[0].lat, lon: resultArray[0].lon}
    console.log(latLon);
    fetchWeather(latLon.lat, latLon.lon);
    fetchFiveDay(latLon.lat, latLon.lon);

  } catch (e) {
    console.log("Error: "+ e)
  }
})


// function of Search History//


// fiveDay provides 40 objects, one every 3 hours
// 1 day = 24 hours
// [0] === Current Day 00:00
// [1] === Current Day 03:00
// [2] === Current Day 06:00
// ------
// [8] === Forecast Day 1 00:00
// [16] === Forecast Day 2 00:00
// [24] === Forecast Day 3 00:00
// [32] === Forecast Day 4 00:00
// [40] === Forecast Day 5 00:00


// 40 objects. Every 8th object is a new day