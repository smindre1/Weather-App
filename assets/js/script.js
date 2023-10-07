//Variables
const APIKey = "4c58e25ed978176bdd5f665c64121ffb";

//Make 404 check
//Make a bad search error alert

//Input event listener
$("#submitBtn").on("click", function () {
  let input = $("#searchBar").val();
  resetPage();
  searchHistory(input);
  locationCoords(input);
});

//Fix the enter key event listener
$("#searchBar").keypress(function (e) {
  if (e == 13) {
    let input = $("#searchBar").val();
    for (i = 0; i < input.length; i++) {
      if (input[i] === " ") {
        input = input.replaceAll(" ", "+");
      }
      locationCoords(input);
    }
  }
});

//This function grabs the coordinates of the User's city search and uses them to call functions for the current and forecasted weather.
function locationCoords(input) {
  //Adjust the User's search to fit in the API url.
  for (i = 0; i < input.length; i++) {
    if (input[i] === " ") {
      input = input.replaceAll(" ", "+");
    }
  }
  const cityName = input;
  const limit = "1";
  //Geo API fetch request
  //fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${APIKey}`)
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${APIKey}`)
    .then((res) => res.json())
    .then((data) => {
      //Takes the latitude and longitude data from the fetch request and assigns them.
      const lat = String(data[0].lat);
      const lon = String(data[0].lon);
      //Calls the weather functions
      currentWeather(lat, lon);
      futureWeather(lat, lon);
    });
}

//Gathers and filters the forecast data of the User's searches city to be appended to the webpage.
function futureWeather(lat, lon) {
  //Forecast API fetch request.
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`)
    .then((res) => res.json())
    .then((res) => {
      console.log(res, "Forecat Data");

      const currentCity = [res.city.name];
      $("#cityName").append(`${currentCity}`);

      function dataLog(arrayNumber, location) {
        const time = res.list[arrayNumber].dt_txt;
        let hour = (time[11] + time[12]) / 12;
        let newHour = "";
        if (hour < 1 && 0 < hour) {
          newHour = hour * 12 + "AM";
        }
        if (hour == 01) {
          newHour = "12PM";
        }
        if (hour == 00) {
          newHour = "12AM";
        }
        if (hour > 1) {
          newHour = (hour - 1) * 12 + "PM";
        }
        $("#" + location).append(`<p class=hourDisplay>${newHour}</p>`);
      }
      //Catagorizes the Weather API's data by the html <div> tags
      let dayContainers = ["dayOne", "dayTwo", "dayThree", "dayFour", "dayFive"];
      //Adds the date to each day's weather data
      for (i = 0; i < 5; i++) {
        const days = [0, 8, 16, 24, 32];
        const time = res.list[days[i]].dt_txt;
        const date = time[5] + time[6] + "/" + time[8] + time[9];
        $("#" + dayContainers[i]).append(`<p class=dates>${date}</p>`);
      }
      for (i = 0; i < 40; i++) {
        const location = `unitInstance${i}`;
        if (i < 8) {
          $("#" + dayContainers[0]).append(`<div id=${location} class=unitInstance></div>`);
          dataLog(i, location);
          $("#" + location).append(`<div id=weatherDataNum${i} class=weatherLogs></div>`);
          weatherConditions(i);
        }
        if (8 <= i && i <= 15) {
          $("#" + dayContainers[1]).append(`<div id=${location} class=unitInstance></div>`);
          dataLog(i, location);
          $("#" + location).append(`<div id=weatherDataNum${i} class=weatherLogs></div>`);
          weatherConditions(i);
        }
        if (16 <= i && i <= 23) {
          $("#" + dayContainers[2]).append(`<div id=${location} class=unitInstance></div>`);
          dataLog(i, location);
          $("#" + location).append(`<div id=weatherDataNum${i} class=weatherLogs></div>`);
          weatherConditions(i);
        }
        if (24 <= i && i <= 31) {
          $("#" + dayContainers[3]).append(`<div id=${location} class=unitInstance></div>`);
          dataLog(i, location);
          $("#" + location).append(`<div id=weatherDataNum${i} class=weatherLogs></div>`);
          weatherConditions(i);
        }
        if (32 <= i && i <= 39) {
          $("#" + dayContainers[4]).append(`<div id=${location} class=unitInstance></div>`);
          dataLog(i, location);
          $("#" + location).append(`<div id=weatherDataNum${i} class=weatherLogs></div>`);
          weatherConditions(i);
        }
      }

      function weatherConditions(i) {
        //Weather conditions
        let weatherDescription = res.list[i].weather[0].description;
        const weatherIconCode = res.list[i].weather[0].icon;
        const imageAlt = res.list[i].weather[0].main;

        $("#weatherDataNum" + i).append(
          `<div class=weatherIconAndLabel><img src=https://openweathermap.org/img/w/${weatherIconCode}.png alt=${imageAlt}> <p>(${weatherDescription})</p></div>`
        );
        //Temperature
        const celsius = Math.round(res.list[i].main.temp - 273.15);
        const fahrenheit = Math.round((res.list[i].main.temp - 273.15) * (9 / 5) + 32);
        $("#weatherDataNum" + i).append(`<p>Temp: ${celsius}°C ${fahrenheit}°F</p>`);
        //wind speed
        const windSpeed = res.list[i].wind.speed;
        $("#weatherDataNum" + i).append(`<p>Wind: ${windSpeed} MPH</p>`);
        //Humidity
        const humidity = res.list[i].main.humidity;
        $("#weatherDataNum" + i).append(`<p>Humidity: ${humidity}%</p>`);
      }
    });
}

function searchHistory(userSearch) {
  let weatherSearchHistory = JSON.parse(localStorage.getItem("weatherSearch"));
  let newSearch = false;
  if (weatherSearchHistory === null) {
    weatherSearchHistory = [];
  }
  for (i = 0; weatherSearchHistory.length >= i; i++) {
    if (weatherSearchHistory[i] == userSearch) {
      newSearch = true;
    }
  }
  if (newSearch == false) {
    weatherSearchHistory.push(userSearch);
  }
  if (weatherSearchHistory.length > 7) {
    weatherSearchHistory.splice(0, 1);
  }
  localStorage.setItem("weatherSearch", JSON.stringify(weatherSearchHistory));
  //Creates the button list of previous searches.
  for (i = 0; weatherSearchHistory.length > i; i++) {
    let search = weatherSearchHistory[i];
    $("#searchHistory").append(`<button id=button${i}>${search}</button>`);
    $("#button" + i).on("click", function () {
      let input = $(this).html();
      resetPage();
      searchHistory(input);
      for (i = 0; i < input.length; i++) {
        if (input[i] === " ") {
          input = input.replaceAll(" ", "+");
        }
      }
      locationCoords(input);
    });
  }
}

//This resets the previous User's search results to allow room for new search result data.
function resetPage() {
  let dayContainers = ["dayOne", "dayTwo", "dayThree", "dayFour", "dayFive"];
  //Resets the city name title.
  $("#cityName").html("");
  //Empties the weather data for previous location search.
  for (i = 0; dayContainers.length > i; i++) {
    let resetTarget = $("#" + dayContainers[i]);
    resetTarget.empty();
  }
  //Empties search history section.
  $("#searchHistory").empty();

  //Empties main display.
  $("#todaysWeather").empty();
  $("#todaysDate").html("");
  $("#alignCircle").html("");
}

function currentWeather(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "Today's Weather Data");
      // $("#todaysWeather").append(`<div id=${location} class=unitInstance></div>`);
      //Date
      const currentDate = new Date();
      const printDate = currentDate.getMonth() + 1 + "/" + currentDate.getDate();
      $("#todaysDate").append(`${printDate}`);
      $("#alignCircle").append(`${printDate}`);
      //Icon
      const weatherIconCode = data.weather[0].icon;
      const imageAlt = data.weather[0].main;
      const weatherDescription = data.weather[0].description;
      $("#todaysWeather").append(
        `<div class="weatherIconAndLabel mainIconAndLabel"><img src=https://openweathermap.org/img/w/${weatherIconCode}.png alt=${imageAlt}> <p>(${weatherDescription})</p></div>`
      );
      //Temperature
      console.log(data.main.temp, "temp");
      const celsius = Math.round(data.main.temp - 273.15);
      const fahrenheit = Math.round((data.main.temp - 273.15) * (9 / 5) + 32);
      $("#todaysWeather").append(`<div><p class="todaysTemperature marginAdjustment">${celsius}°C ${fahrenheit}°F</p></div>`);
      //Humidity
      const humidity = data.main.humidity;
      $("#todaysWeather").append(`<p>Humidity: ${humidity}%</p>`);
      //Wind Speed
      const windSpeed = data.wind.speed;
      $("#todaysWeather").append(`<p class=marginAdjustment>Wind: ${windSpeed} MPH</p>`);
    });
}
