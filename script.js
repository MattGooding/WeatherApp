const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "381ac6ed30fd4d6c878191518240803";

const createWeatherElement = (weatherData) => {
    // Function to format time
    const formatTime = (dateTimeString) => {
        const [_, timePart] = dateTimeString.split(' ');
        const [hours] = timePart.split(':');
        const hour = parseInt(hours, 10);
        const amPM = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour} ${amPM}`;
    };
    // Function to format date
    const formatDate = (dateString) => {
        const dateParts = dateString.split('-');
        const month = parseInt(dateParts[1], 10);
        const day = parseInt(dateParts[2], 10);
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[month - 1]} ${day}`;
    };

    const weatherDataElement = document.querySelector(".weather-data");
    const weatherElement = document.createElement("div");
    const headerElement = document.querySelector("header");
    headerElement.classList.remove('empty');

    let airQualityText = '';
    let airQualityIndex = weatherData.current.air_quality['gb-defra-index'];
    if (airQualityIndex >= 0 && airQualityIndex <= 3) {
        airQualityText = 'Air pollution levels are low.';
    } else if (airQualityIndex >= 4 && airQualityIndex <= 6) {
        airQualityText = 'Air pollution levels are moderate.';
    } else if (airQualityIndex >= 7 && airQualityIndex <= 9) {
        airQualityText = 'Air pollution levels are high, consider reducing activity outdoors.';
    } else if (airQualityIndex === 10) {
        airQualityText = 'Air pollution levels are very high, reduce activity outdoors.';
    } else {
        airQualityText = 'Unknown';
    }

    const sunElement = document.querySelector('.sunray');
    let uvText = '';
    let uv = weatherData.current.uv;
    if (uv >= 0 && uv <= 3) {
        uvText = 'UV levels are low.';
        sunElement.style.opacity = '';
    } else if (uv >= 4 && uv <= 6) {
        uvText = 'UV levels are moderate, sun protection recommended.';
        sunElement.style.opacity = '.5';
    } else if (uv >= 7 && uv <= 9) {
        uvText = 'UV levels are high, sun protection recommended.';
        sunElement.style.opacity = '1';
    } else if (uv >= 10) {
        uvText = 'UV levels are extreme, sun protection strongly recommended.';
        sunElement.style.opacity = '1';
    } else {
        uvText = 'Unknown';
    }

    const hourlyData = weatherData.forecast.forecastday[0].hour;

    // Calculate total humidity
    let totalHumidity = 0;
    hourlyData.forEach(hour => {
        totalHumidity += hour.humidity;
    });

    const avgHumidity = (totalHumidity / hourlyData.length).toFixed(0);

    let visibilityText = '';
    let visibility = weatherData.current.vis_km;
    if (visibility < 1) {
        visibilityText = 'Visibility is very poor.';
    } else if (visibility >= 1 && visibility < 2) {
        visibilityText = 'Visibility is poor.';
    } else if (visibility >= 2 && visibility < 4) {
        visibilityText = 'Visibility is moderate.';
    } else if (visibility >= 4 && visibility <= 10) {
        visibilityText = 'Visibility is clear.';
    } else if (visibility > 10) {
        visibilityText = 'Visibility is very clear.';
    } else {
        visibilityText = 'Unknown';
    }

    const currentTemp = weatherData.current.temp_c;
    const feelsLikeTemp = weatherData.current.feelslike_c;
    const tempDifference = feelsLikeTemp - currentTemp;

    let feelsText = '';
    if (tempDifference > 0) {
        feelsText = `Feels ${Math.abs(tempDifference).toFixed(0)}° warmer.`;
    } else if (tempDifference < 0) {
        feelsText = `Feels ${Math.abs(tempDifference).toFixed(0)}° colder.`;
    } else {
        feelsText = 'Feels the same as actual temperature.';
    }

    weatherElement.innerHTML = `
    <div class="container hero">
        <h2 class="fs2">${weatherData.location.name}, ${weatherData.location.country}</h2>
        <p class="fs1">${weatherData.current.temp_c.toFixed(0)}°C</p>
        <p class="fs3">${weatherData.current.condition.text}</p>
        <span>
            <p class="fs3">H: ${weatherData.forecast.forecastday[0].day.maxtemp_c.toFixed(0)}°</p>
            <p class="fs3">L: ${weatherData.forecast.forecastday[0].day.mintemp_c.toFixed(0)}°</p>
        </span>
    </div>
    <div class="card-container">
        <div class="card-xlg">
        <span class="card-header">
            <i class="fa-regular fa-clock"></i>
            <h3>Hourly Forecast</h3>
        </span>
            <span class="scroll">
                ${weatherData.forecast.forecastday[0].hour.map(hourlyForecast => `
                <div class="hourly"><p>${formatTime(hourlyForecast.time)}</p>
                <img class="hourlyImg" src="${hourlyForecast.condition.icon}" alt="Weather icon"/>
                <p>${hourlyForecast.temp_c}°C</p></div>
                `).join('')}
            </span>
        </div>

        <div class="card-lg">
        <span class="card-header">
            <i class="fa-regular fa-calendar"></i>
            <h3>3-Day Forecast</h3>
        </span>
        <span class="column">
        ${weatherData.forecast.forecastday.map(dailyForecast => `
        <span class="daily"><p>${formatDate(dailyForecast.date)}</p>
        <img src="${dailyForecast.day.condition.icon}" alt="Weather icon"/>
        <span>
        <p>${dailyForecast.day.mintemp_c}°</p>
        <div class="temperature-gradient"></div>
        <p class="high">${dailyForecast.day.maxtemp_c}°</p></span></span>
        `).join('')}
        </span>
        </div>

        <div class="card">
        <span class="card-header">
            <i class="fa-solid fa-smog"></i>
            <h3>Air Quality</h3>
        </span>
        <p class="fs2">${weatherData.current.air_quality['gb-defra-index']}</p>
        <p>${airQualityText}</p>
        </div>

        <div class="card">
        <span class="card-header">
            <i class="fa-solid fa-temperature-three-quarters"></i>
            <h3>Feels Like</h3>
        </span>
        <p class="fs2">${weatherData.current.feelslike_c.toFixed(0)}°C</p>
        <p>${feelsText}</p>
        </div>

        <div class="card">
        <span class="card-header">
            <i class="fa-regular fa-sun"></i>
            <h3>UV Index</h3>
        </span>
        <p class="fs2">${weatherData.current.uv}</p>
        <p>${uvText}</p>
        </div>

        <div class="card">
        <span class="card-header">
            <i class="fa-solid fa-water"></i>
            <h3>Humidity</h3>
        </span>
        <p class="fs2">${weatherData.current.humidity}%</p>
        <p>Todays average humidity is ${avgHumidity}%</p>
        </div>
        
        <div class="card">
        <span class="card-header">
            <i class="fa-solid fa-wind"></i>
            <h3>Wind</h3>
        </span>
        <div class="weathercontent">
        <i class="fa-solid fa-location-arrow wind-icon"></i>
        <p class="fs2">${weatherData.current.wind_kph.toFixed(0)}km/h</p>
        </br>
        <p>${weatherData.current.wind_degree}deg ${weatherData.current.wind_dir}</p>
        </div>
        </div>

        <div class="card">
        <span class="card-header">
            <i class="fa-solid fa-droplet"></i>
            <h3>Precipitation</h3>
        </span>
        <p class="fs2">${Math.round(weatherData.forecast.forecastday[0].day.totalprecip_mm)}mm</p>
        <p>${Math.round(weatherData.forecast.forecastday[1].day.totalprecip_mm)}mm Expected Tomorrow</p>
        </div>

        <div class="card">
        <span class="card-header">
            <i class="fa-solid fa-mountain-sun"></i>
            <h3>Sun Rise/Set</h3>
        </span>
        <p class="fs3">${weatherData.forecast.forecastday[0].astro.sunrise} Sunrise</p>
        <p class="fs3 sunset">${weatherData.forecast.forecastday[0].astro.sunset} Sunset</p>
        </div>

        <div class="card">
        <span class="card-header">
            <i class="fa-solid fa-eye"></i>
            <h3>Visibility</h3>
        </span>
        <p class="fs2">${weatherData.current.vis_km} km</p>
        <p>${visibilityText}</p>
        </div>

    </div>
`;
    weatherDataElement.innerHTML = '';

    if (weatherData.current.is_day === 0) {
        let gradientColor = 'linear-gradient(rgb(7, 28, 54), rgb(15, 37, 64))';
        if (weatherData.forecast.forecastday[0].day.will_it_snow === 0) {
            gradientColor = 'linear-gradient(rgb(22, 47, 79), rgb(23, 47, 75))';
        } else if (weatherData.forecast.forecastday[0].day.will_it_rain === 1) {
            gradientColor = 'linear-gradient(rgb(3, 28, 59), rgb(16, 47, 85))';
        }
        document.body.style.backgroundImage = gradientColor;
    } else {
        document.body.style.backgroundImage = '';
    }

    const cloudElement = document.querySelector('.cloud2');
    if (weatherData.current.cloud < 25) {
        cloudElement.style.opacity = '0';
    } else if (weatherData.current.cloud > 75) {
        cloudElement.style.opacity = '.6';
    } else {
        cloudElement.style.opacity = '';
    }
    weatherDataElement.appendChild(weatherElement);

    const windIcon = document.querySelector('.wind-icon');
    windIcon.style.transform = `rotate(${weatherData.current.wind_degree - 46}deg)`;
};


const getWeatherDetails = (location) => {
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3&aqi=yes&alerts=no`;

    console.log(API_URL);
    fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
            createWeatherElement(data);
        })
        .catch(() => {
            alert("An error occurred while fetching weather details!");
        });
};

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") {
        alert("Please enter a city name.");
        return;
    }
    fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found.");
            }
            return response.json();
        })
        .then(() => {
            getWeatherDetails(cityName);
            cityInput.value = '';
        })
        .catch(error => {
            alert(error.message);
        });
}

const getUserCoordinates = () => {
    cityInput.value = '';
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const latLong = `${latitude},${longitude}`;
            getWeatherDetails(latLong);
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());