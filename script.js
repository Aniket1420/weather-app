const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherIcon = document.getElementById("weather-icon");
const tempDiv = document.getElementById("temp-div");
const infoDiv = document.getElementById("weather-info");
const hourlyForecast = document.getElementById("hourly-forecast");
const hourlyHeading = document.getElementById("hourly-heading");
const loader = document.getElementById("loader");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  show(loader, true);
  resetDisplay();

  try {
    const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_KEY}&units=metric`);
    const currentData = await currentRes.json();
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPEN_WEATHER_KEY}&units=metric`);
    const forecastData = await forecastRes.json();

    if (currentData.cod !== 200) throw new Error(currentData.message);
    displayCurrent(currentData);
    displayForecast(forecastData.list);
    changeBackground(currentData.weather[0].main);
  } catch (err) {
    alert("Error: " + err.message);
  } finally {
    show(loader, false);
  }
});

function displayCurrent(data) {
  const { name, main, weather } = data;
  const temperature = Math.round(main.temp);
  const desc = weather[0].description;
  const icon = weather[0].icon;

  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
  weatherIcon.classList.remove("hidden");

  tempDiv.innerHTML = `<p>${temperature}°C</p>`;
  infoDiv.innerHTML = `<p>${name}</p><p>${desc}</p>`;
}

function displayForecast(list) {
  hourlyHeading.classList.remove("hidden");
  const next8 = list.slice(0, 8);
  next8.forEach(item => {
    const date = new Date(item.dt * 1000);
    const hour = date.getHours();
    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;

    const div = document.createElement("div");
    div.className = "hourly-item";
    div.innerHTML = `
      <span>${hour}:00</span>
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="" />
      <span>${temp}°C</span>
    `;
    hourlyForecast.appendChild(div);
  });
}

function changeBackground(main) {
  const map = {
    Clear: "clear",
    Clouds: "clouds",
    Rain: "rain",
    Drizzle: "rain",
    Snow: "snow",
    Thunderstorm: "thunderstorm",
    Mist: "mist",
    Haze: "mist",
    Fog: "mist",
    Smoke: "mist"
  };

  const bg = map[main] || "clear";
  document.body.style.backgroundImage = `url('assets/backgrounds/${bg}.jpg')`;
}

function resetDisplay() {
  tempDiv.innerHTML = "";
  infoDiv.innerHTML = "";
  hourlyForecast.innerHTML = "";
  weatherIcon.classList.add("hidden");
  hourlyHeading.classList.add("hidden");
}

function show(el, show = true) {
  el.classList.toggle("hidden", !show);
}
