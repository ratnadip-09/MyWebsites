// OpenWeatherMap API Key
const apiKey = "c196e6cc08a245ae9477f60995d4968e";

// DOM Elements
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const refreshBtn = document.getElementById("refreshBtn");
const weatherInfo = document.getElementById("weatherInfo");
const errorBox = document.getElementById("errorBox");
const locationEl = document.getElementById("location");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const tempEl = document.getElementById("temp");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const feelsLikeEl = document.getElementById("feelsLike");
const weatherIconEl = document.getElementById("weatherIcon");

// Weather Icons
const icons = {
  Clear: "fa-sun",
  Clouds: "fa-cloud",
  Rain: "fa-cloud-showers-heavy",
  Drizzle: "fa-cloud-rain",
  Thunderstorm: "fa-bolt",
  Snow: "fa-snowflake",
  Mist: "fa-smog",
  Smoke: "fa-smog",
  Haze: "fa-smog",
  Fog: "fa-smog"
};

// Store last searched city
let lastQuery = "";

// Format Date
function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// Format Time
function formatTime(date) {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

// Show Error
function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
  weatherInfo.classList.add("hidden");
}

// Hide Error
function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

// Update Date & Time
function updateDateTime() {
  const now = new Date();
  dateEl.textContent = formatDate(now);
  timeEl.textContent = formatTime(now);
}

// Set Weather Icon
function setWeatherIcon(main) {
  const iconClass = icons[main] || "fa-cloud-sun";
  weatherIconEl.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
}

// Fetch Weather Data
async function fetchWeather(query) {
  query = query.trim();

  if (!query) {
    showError("Please enter a city name.");
    return;
  }

  lastQuery = query;

  const endpoint =
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${apiKey}&units=metric`;

  try {
    clearError();

    const response = await fetch(endpoint);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch weather data");
    }

    locationEl.textContent = `${data.name}, ${data.sys.country}`;
    descriptionEl.textContent = data.weather[0].description;

    // HTML already contains °C
    tempEl.textContent = Math.round(data.main.temp);

    humidityEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;

    setWeatherIcon(data.weather[0].main);

    weatherInfo.classList.remove("hidden");
  } catch (error) {
    showError(error.message || "Something went wrong");
  }
}

// Search Button Click
searchBtn.addEventListener("click", () => {
  fetchWeather(cityInput.value);
});

// Enter Key Search
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    fetchWeather(cityInput.value);
  }
});

// Refresh Button
refreshBtn.addEventListener("click", () => {
  if (lastQuery) {
    fetchWeather(lastQuery);
  } else {
    showError("Search for a city first.");
  }
});

// Initialize Date & Time
updateDateTime();
setInterval(updateDateTime, 60000);