//Variables

const APIKey = '4c58e25ed978176bdd5f665c64121ffb';

//404 check


//input event listener

//geo fetch
fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city name},${state code},${country code}&limit=${limit}&appid=${API key}`)
    .then((res) => res.json)
    .then((res) => {
        console.log(res);
    })
//weather fetch
let lat = "";
let lon = "";
fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`)
    .then((res) => res.json)
    .then((res) => {
        console.log(res);
    })
//then function

//local storage function

//