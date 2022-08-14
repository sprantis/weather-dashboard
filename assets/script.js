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

// Add event listener: when searchBtn is clicked, grab lat and lon values, and call functions to fetch current weather and forecast data
searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  let resultArray = [];

  try {
    resultArray = await loadLatLon()
    let latLon = {lat: resultArray[0].lat, lon: resultArray[0].lon}
    console.log(latLon);
    fetchWeather(latLon.lat, latLon.lon);
    fetchFiveDay(latLon.lat, latLon.lon);

  } catch (e) {
    console.log("Error: "+ e)
  }
})

let kToF = function (kelvin){
  return ((((kelvin - 273.15) * 9) / 5) + 32).toFixed(2); 
};

let displayCurrent = async function (dataInput){
  let currentContainer = document.getElementById("current-container");

  let name = document.createElement('div');
  name.innerHTML = dataInput.name;
  currentContainer.append(name);

  let date = document.createElement('div')
  date.innerHTML = moment().format('L');
  currentContainer.append(date)

  let iconId = dataInput.weather[0].icon;
  let icon = document.createElement('img');
  icon.setAttribute("src", `http://openweathermap.org/img/wn/${iconId}@2x.png`);
  currentContainer.append(icon);

  let temp = document.createElement('div');
  temp.innerHTML = `Temp: ${kToF(dataInput.main.temp)};`
  currentContainer.append(temp);

  let humidity = document.createElement('div');
  humidity.innerHTML = `Humidity: ${dataInput.main.humidity}`;
  currentContainer.append(humidity);

  let wind = document.createElement('div');
  wind.innerHTML = `Wind Speed: ${dataInput.wind.speed}`;
  currentContainer.append(wind);

  // API call not working to fetch UVI from Open Weather API 3.0
  // let uv = document.createElement('div')
  // uv.innerHTML = await loadUVI(dataInput.coord.lat, dataInput.coord.lon);
  // currentContainer.append(uv)
}


let displayForecast = function (dataInput){
  // let forecastContainer = document.getElementById("forecast-container");

  let forecastCounter = 7;
  for (i=1; i<=5; i++){
    let dayContainer = document.getElementById(`day${i}`);

    let date = document.createElement('div');
    date.innerHTML = moment().add(i, 'days').calendar(); 
    dayContainer.append(date);
    
    let iconId = dataInput[forecastCounter].weather[0].icon;
    let icon = document.createElement('img');
    icon.setAttribute("src", `http://openweathermap.org/img/wn/${iconId}@2x.png`);
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

    // 3 hour increments for OpenWeather API forecast reponse. Need to increase counter by 8 to equal a full 24 hours
    forecastCounter+=8;

  }
}




// moment.js for date
// UV fetch call- will do later


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