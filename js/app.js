const API_KEY = `46ad7457603b9b0104e633e78cd60e16`;
const searchTemperature = () => {
    const city = document.getElementById('city-name').value;
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const hourlyForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    fetch(currentWeatherUrl)
    .then(res => res.json())
    .then(data => {
        displayCurrentWeather(data); 

        fetch(hourlyForecastUrl)  // Fetch the hourly forecast data
            .then(res => res.json())
            .then(hourlyData => {
                displayHourlyForecast(hourlyData.list); // Display the hourly forecast
            })
            .catch(error => {
                console.error('Error fetching hourly forecast:', error);
            });
    })

    .catch(error => {
        console.error('Error fetching current weather:', error);
    });
}

//

const setInnerText = (id, text) => {
    document.getElementById(id).innerText = text;
}



const displayCurrentWeather = temperature => {
    setInnerText('city', temperature.name);
    setInnerText('temperature', temperature.main.temp);
    setInnerText('feels-like', `${temperature.main.feels_like}°C`); 
    setInnerText('humidity', ` ${temperature.main.humidity}%`);
    setInnerText('pressure', `${temperature.main.pressure} hPa`);
    setInnerText('temp-min', `${temperature.main.temp_min}°C`);
    setInnerText('temp-max', `${temperature.main.temp_max}°C`);


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



     // weather hourly
const displayHourlyForecast = hourlyForecast => {
    const hourlyForecastContainer = document.getElementById('hourly-forecast');
    hourlyForecastContainer.innerHTML = '';

    const chartData = {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            pointRadius: 4,
            borderWidth: 2,
            data: []
        }]
    };


    hourlyForecast.forEach(hour => {
        const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temperature = hour.main.temp.toFixed(1);
        const pop = hour.pop || 0;
        const weatherIcon = hour.weather[0].icon; 

        chartData.labels.push(time);
        chartData.datasets[0].data.push(temperature);

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('hourly-forecast-item');
        forecastItem.innerHTML = `
            <div class="forecast-time">${time}</div>
            <div class="forecast-pop">Rain ${pop}%</div>
            <div class="weather-icon"><img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon"></div>
            <div class="forecast-temperature">${temperature}°C</div>
        `;

        hourlyForecastContainer.appendChild(forecastItem);
    });

    const ctx = document.getElementById('hourly-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}