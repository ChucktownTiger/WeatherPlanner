// define variables of document elements
var cityInputEl = document.getElementById("cityinput")
var cityInputFormEl = document.getElementById("cityinputform")
var searchBtn = document.getElementById("searchbtn")
var searchName = JSON.parse(localStorage.getItem("searchName")) || []
var searchHistoryList = document.getElementById("history-list")
var todaysWeatherEl = document.getElementById("todayweather")
var cityDateEl = document.getElementById("city-date")
var tempEl = document.getElementById("temp")
var feelsLikeTempEl = document.getElementById("feels-like")
var windEl = document.getElementById("wind")
var humidityEl = document.getElementById("humidity")
var UVIndexEl = document.getElementById("UV-index")
var weatherDisplayEl = document.querySelector(".weather-results")
var fivedayEl = document.querySelector(".five-day-forecast")
var d1El = document.getElementById("d1")
var d2El = document.getElementById("d2")
var d3El = document.getElementById ("d3")
var d4El = document.getElementById ("d4")
var d5El = document.getElementById ("d5")
var forecastArr = []

var getWeatherData = function(userSearch) {

    // my API key from the website
    const APIKey = "f2adfc525cc3c6c9a79c91dd777a0caa";
   
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + userSearch + "&APPID=" + APIKey;

    // fetch from API
    fetch(queryUrl)
    .then(response => { 
        if (!response.ok) { 
            var errorDisplay = document.getElementById("error-message")
            errorDisplay.setAttribute("class", "card-body")
            errorDisplay.setAttribute("class", "text-center")
            errorDisplay.textContent = "Invalid City Name"
            cityInputFormEl.reset()
         } else {
         return response.json()
         }
    })
    .then(data => {
        if (!searchName.includes(data.name)) {
            searchName.push(data.name)
            localStorage.setItem("searchName", JSON.stringify(searchName))
            searchHistoryDisplay()
            cityInputFormEl.reset()
            }

        // un hide hidden elements
        weatherDisplayEl.classList.remove("weather-results")
        fivedayEl.classList.remove("five-day-forecast")

        // display data on elements

        // setting current date to a variable, multiply by 1000 because dt is UNIX time
        let currentDate = new Date(data.dt *1000)
        let date = currentDate.getDate()
        let month = currentDate.getMonth()+1
        let year = currentDate.getFullYear()
        todaysWeatherEl.textContent = data.name + " " + month + "/" + date + "/"  + year

          let weatherIcon = data.weather[0].icon
            weatherIconImg = document.createElement("img")
            weatherIconImg.setAttribute("src", `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`)
            todaysWeatherEl.append(weatherIconImg)

           tempEl.innerHTML = "Temperature:" + " " + data.main.temp + " " + '\u00B0F'

           feelsLikeTempEl.innerHTML = "Feels Like:" + " " + data.main.feels_like + " " + '\u00B0F'

            windEl.innerHTML= "Wind Speed:" + " " + data.wind.speed + "mph"

            humidityEl.innerHTML = "Humidity:" + " " + data.main.humidity + "%"

            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var UVQueryUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&APPID=" + APIKey;
            
            
        // five day forecast 

        var fiveDayQueryUrl =  "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&APPID=" + APIKey;
        fetch(fiveDayQueryUrl)
        .then(response => response.json())
        .then (data => {
            console.log(data)  
            
            // create forecast array

            var forecastArr = [d1El, d2El, d3El, d4El, d5El]
            var k=0
            
            for (let i = 1; i < 8; i++) {           
            var dateTitle = document.createElement("h4")
            var tempP = document.createElement("p")
            var feelsLikeP = document.createElement("p")
            var windP = document.createElement("p")
            var humidityP = document.createElement("p")

            let iDate = new Date(data.daily[i].dt *1000)
            let idate = iDate.getDate()
            let imonth = iDate.getMonth()+1
            let iyear = iDate.getFullYear()
            dateTitle.innerHTML= imonth + "/" + idate + "/"  + iyear

           let iWeatherIcon = data.daily[i].weather.icon
           iWeatherIconImg = document.createElement("img")
           iWeatherIconImg.setAttribute("src", `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`)
         
           tempP.innerHTML = "Temp:" + " " + data.daily[i].temp.day + '\u00B0F'
           feelsLikeP.innerHTML = "Feels Like:" + " " + data.daily[i].feels_like.day + '\u00B0F'
           windP.innerHTML = "Wind:" + " " + data.daily[i].wind_speed + "mph"
           humidityP.innerHTML = "Humidity:" + " " + data.daily[i].humidity + "%"

           
           
           // append the elements
          forecastArr[k].append(dateTitle)
          forecastArr[k].append(iWeatherIconImg)
          forecastArr[k].append(tempP)
          forecastArr[k].append(feelsLikeP)
          forecastArr[k].append(windP)
          forecastArr[k].append(humidityP)
          k++
        }
        })
    }) 
}

searchBtn.addEventListener("click", function() { 
    userSearch = cityInputEl.value
    getWeatherData(userSearch);
})

searchHistoryDisplay()

function searchHistoryDisplay () {

    // for loop to create a list of city searches
    searchHistoryList.innerHTML = "";
    for (let i = 0; i < searchName.length; i++) {
         var searchHistoryItem = document.createElement("button")
        searchHistoryItem.className = "btn btn-light btn-outline-dark btn-xs btn-block" 
        searchHistoryItem.innerHTML = searchName[i]
        searchHistoryItem.setAttribute("value", searchName[i])
        searchHistoryList.append(searchHistoryItem)

        // be able to click a city in the search history and have its data populate on the page
        searchHistoryItem.addEventListener("click", function (event) {
            getWeatherData(event.target.value);
        })
    } 
}