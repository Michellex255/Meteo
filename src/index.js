function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");

  let temperature = response.data.temperature.current;
  let date = new Date(response.data.time * 1000);

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  temperatureElement.innerHTML = Math.round(temperature);

  iconElement.innerHTML = `
      <img
      src="${response.data.condition.icon_url}"
      class="weather-app-icon"
      alt="${response.data.condition.description}"
    />
  `;

  iconElement.className = "";
  const desc = response.data.condition.description.toLowerCase();
  if (desc.includes("rain")) {
    iconElement.classList.add("rainy");
  } else if (desc.includes("cloud")) {
    iconElement.classList.add("cloudy");
  } else if (desc.includes("clear") || desc.includes("sun")) {
    iconElement.classList.add("sunny");
  }

  getForecast(response.data.city);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
}

function searchCity(city) {
  let apiKey = "d374t43e29a36b438a5593oaba8810fc";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}
function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

function getForecast(city) {
  let apiKey = "d374t43e29a36b438a5593oaba8810fc";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      let desc = day.condition.description.toLowerCase();
      let weatherClass = "";
      if (desc.includes("rain")) {
        weatherClass = "rainy";
      } else if (desc.includes("cloud")) {
        weatherClass = "cloudy";
      } else if (desc.includes("clear") || desc.includes("sun")) {
        weatherClass = "sunny";
      }

      forecastHtml += ` 
    <div class="weather-forecast-day ${weatherClass}">
    <div class="weather-forecast-date">${formatDay(day.time)}</div>

    <img src="${day.condition.icon_url}" class="weather-forecast-icon"  alt="${
        day.condition.description
      }"/>
    <div class="weather-forecast-temperatures">
    <div class="weather-forecast-temperature">
   <strong>${Math.round(day.temperature.maximum)}°</strong>
    </div>
    <div class="weather-forecast-temperature">${Math.round(
      day.temperature.minimum
    )}°</div>
    </div>
    </div>`;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

searchCity("Paris");
