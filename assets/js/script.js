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
//geo fetch
function locationCoords() {
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${APIKey}`)
    .then((res) => res.json)
    .then((res) => {
      console.log(res);
    });

  //weather fetch
  let lat = "";
  let lon = "";
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`)
    .then((res) => res.json)
    .then((res) => {
      console.log(res);
    });
}
//then function

//local storage function

//
