const API_KEY = `46ad7457603b9b0104e633e78cd60e16`;


const showPopup = () => {
    const popup = document.getElementById('popup');
    popup.style.display = 'flex';

    const closePopupButton = document.getElementById('close-popup');
    closePopupButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });
};

const searchTemperature = () => {
    const city = document.getElementById('city-name').value;
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(currentWeatherUrl)
        .then(res => res.json())
        .then(data => {
            if (data.cod === '404') {
                showPopup();
                return;
            }
            displayCurrentWeather(data);

            const hourlyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
            fetch(hourlyForecastUrl)
                .then(res => res.json())
                .then(hourlyData => {
                    displayHourlyForecast (hourlyData.list);
                })
                .catch(error => {
                    console.error('Error fetching hourly forecast:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
        });
}




// console.log

const setInnerText = (id, text) => {
    document.getElementById(id).innerText = text;
}



const displayCurrentWeather = temperature => {
    setInnerText('city', temperature.name);
    setInnerText('temperature', temperature.main.temp);
    setInnerText('feels-like', `${temperature.main.feels_like}°C`); 
    setInnerText('humidity', ` ${temperature.main.humidity}%`);
    setInnerText('pressure', `${temperature.main.pressure} hPa`);
    setInnerText('temp-min', `temp-min-${temperature.main.temp_min}°C`);
    setInnerText('temp-max', `temp-max-${temperature.main.temp_max}°C`);


const conditionText = temperature.weather[0].description === 'Rain'
    ? `Rain ${temperature.pop}%` // Display rain percentage
    : temperature.weather[0].main;



    const precipitationText = temperature.rain && temperature.rain['1h']
    ? `${temperature.rain['1h']} mm`
    : 'No Precipitation rain'; // Check for precipitation amount

setInnerText('precipitation', precipitationText);
 setInnerText('condition', conditionText);

 setInnerText('wind', `Wind Speed: ${temperature.wind.speed.toFixed(2)} km/h`);

 const date = new Date(temperature.dt * 1000); // Convert UNIX timestamp to JS date
setInnerText('date', `Today: ${date.toDateString()}`);//date




 const sunrise = new Date(temperature.sys.sunrise * 1000);
 setInnerText('sunrise', `sunrise- ${sunrise.toLocaleTimeString()}`); //sunrise
 
 const sunset = new Date(temperature.sys.sunset * 1000);
 setInnerText('sunset', ` sunset- ${sunset.toLocaleTimeString()}`); //sunset


 // Set weather icon
 const url = `http://openweathermap.org/img/wn/${temperature.weather[0].icon}@2x.png`;
 const imgIcon = document.getElementById('weather-icon');
 imgIcon.setAttribute('src', url);
}    


//hourly weather  
const displayHourlyForecast = hourlyForecast => {
    const hourlyForecastContainer = document.getElementById('hourly-forecast');
    hourlyForecastContainer.innerHTML = '';

    const tempChartData = {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            pointRadius: 4,
            data: []
        }]
    };

    const popChartData = {
        labels: [],
        datasets: [{
            label: 'Rain Probability (%)',
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                // Add more colors as needed
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)',
                // Add more colors as needed
            ],
            borderWidth: 2,
            data: []
        }]
    };

    const windSpeedChartData = {
        labels: [],
        datasets: [{
            label: 'Wind Speed (m/s)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
            pointRadius: 4,
            data: []
        }]
    };

    const humidityChartData = {
        labels: [],
        datasets: [{
            label: 'Humidity (%)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 2,
            pointRadius: 4,
            data: []
        }]
    };

    const feelsLikeChartData = {
        labels: [],
        datasets: [{
            label: 'Feels Like (°C)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 2,
            pointRadius: 4,
            data: []
        }]
    };

   
    const pressureChartData = {
        labels: [],
        datasets: [{
            label: 'Pressure (hPa)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor:' rgba(255, 99, 132, 1)',
            borderWidth: 2,
            pointRadius: 4,
            data: []
        }]
    };

    hourlyForecast.forEach(hour => {
        const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temperature = hour.main.temp.toFixed(1);
        const humidity = hour.main.humidity.toFixed(2);
        const pop = hour.pop || 0;
        const weatherIcon = hour.weather[0].icon;
        const windSpeed = hour.wind.speed.toFixed(2);
        const feelsLike = hour.main.feels_like.toFixed(1);
        const pressure = hour.main.pressure;

        humidityChartData.labels.push(time);
        humidityChartData.datasets[0].data.push(humidity);

        windSpeedChartData.labels.push(time);
        windSpeedChartData.datasets[0].data.push(windSpeed);

        tempChartData.labels.push(time);
        tempChartData.datasets[0].data.push(temperature);

        popChartData.labels.push(time);
        popChartData.datasets[0].data.push(pop);

        feelsLikeChartData.labels.push(time);
        feelsLikeChartData.datasets[0].data.push(feelsLike);

    
        pressureChartData.labels.push(time);
        pressureChartData.datasets[0].data.push({ x: time, y: pressure, r: 8 }); // Using 'r' for bubble size



        const forecastItem = document.createElement('div');
        forecastItem.classList.add('hourly-forecast-item');
        forecastItem.innerHTML = `
            <div class="forecast-time">${time}</div>
            <div class="forecast-pop">Rain-${pop}%</div>
            <div class="weather-icon"><img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon"></div>
        `;

        hourlyForecastContainer.appendChild(forecastItem);
    });

    const tempChartCtx = document.getElementById('hourly-temp-chart').getContext('2d');
    new Chart(tempChartCtx, {
        type: 'bar',
        data: tempChartData,
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    const popChartCtx = document.getElementById('hourly-pop-chart').getContext('2d');
    new Chart(popChartCtx, {
        type: 'doughnut',
        data: popChartData,
        options: {}
    });

    const windSpeedChartCtx = document.getElementById('hourly-wind-speed-chart').getContext('2d');
    new Chart(windSpeedChartCtx, {
        type: 'radar',
        data: windSpeedChartData,
        options: {}
    });

    const humidityChartCtx = document.getElementById('hourly-humidity-chart').getContext('2d');
    new Chart(humidityChartCtx, {
        type: 'polarArea',
        data: humidityChartData,
        options: {}
    });

    const feelsLikeChartCtx = document.getElementById('hourly-feels-like-chart').getContext('2d');
    new Chart(feelsLikeChartCtx, {
        type: 'bar',
        data: feelsLikeChartData,
        options: {}
    });

    const pressureChartCtx = document.getElementById('hourly-pressure-chart').getContext('2d');
    new Chart(pressureChartCtx, {
        type: 'line',
        data: {
            labels: pressureChartData.labels,
            datasets: [pressureChartData.datasets[0]]
        },
        options: {}
    });


};
