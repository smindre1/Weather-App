//Variables

const APIKey = "4c58e25ed978176bdd5f665c64121ffb";

//404 check

//input event listener
$("#submitBtn").on("click", function () {
  let input = $("#searchBar").val();
  for (i = 0; i < input.length; i++) {
    if (input[i] === " ") {
      input = input.replaceAll(" ", "+");
    }
  }
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
//geo api fetch
function locationCoords(input) {
  const cityName = input;
  const limit = "1";
  //   fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${APIKey}`)
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${APIKey}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "data");
      const lat = String(data[0].lat);
      const lon = String(data[0].lon);
      console.log(lat, "lat", lon, "lon");
      //weather api fetch
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res, "weather data");
          console.log(res.list[0].main.temp);

          const currentCity = [res.city.name];
          //local Storage
          // $("#dayOne").append("<p>test</p>");

          function dataLog(arrayNumber, location) {
            const celsius = Math.round(res.list[arrayNumber].main.temp - 273.15);
            const fahrenheit = Math.round((res.list[arrayNumber].main.temp - 273.15) * (9 / 5) + 32);
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
            $("#" + location).append(`<p>Time: ${newHour}</p>`);
            $("#" + location).append(`<p>Temp: ${celsius}°C ${fahrenheit}°F</p>`);
          }
          //Catagorizes the Weather API's data by the html <div> tags
          let dayContainers = ["todaysWeather", "dayOne", "dayTwo", "dayThree", "dayFour"];
          //Adds the date to each day's weather data
          for (i = 0; i < 5; i++) {
            const days = [0, 8, 16, 24, 32];
            const time = res.list[days[i]].dt_txt;
            const date = time[5] + time[6] + "/" + time[8] + time[9];
            $("#" + dayContainers[i]).append(`<p>${date}</p>`);
          }
          for (i = 0; i < 40; i++) {
            if (i < 8) {
              dataLog(i, dayContainers[0]);
            }
            if (8 <= i && i <= 15) {
              dataLog(i, dayContainers[1]);
            }
            if (16 <= i && i <= 23) {
              dataLog(i, dayContainers[2]);
            }
            if (24 <= i && i <= 31) {
              dataLog(i, dayContainers[3]);
            }
            if (32 <= i && i <= 39) {
              dataLog(i, dayContainers[4]);
            }
          }
          //Function array data
          //Function to display data elements
          //Needed Data: city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
        });
    });
}
//then function

//local storage function

//
