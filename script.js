document.addEventListener('DOMContentLoaded', () => {
    const weatherForm = document.getElementById('weather-form');
    const cityInput = document.getElementById('city');
    const weatherResult = document.getElementById('weather-result');
    const weatherEmoji = document.getElementById('weather-emoji');
    
    const apiKey = 'bf3121f47c5c430c88bf418970e89e1c';
    const apiURL = `https://api.weatherbit.io/v2.0/`;

    weatherForm.addEventListener('submit', event => {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city === '') {
            alert('Please enter a city name.');
            return;
        }

        getCurrentWeather(city);
        getHistoricalWeather(city);
        getAirQuality(city);
        getSevereAlerts(city);
    });

    function getCurrentWeather(city) {
        fetch(`${apiURL}current?key=${apiKey}&city=${city}`)
            .then(response => response.json())
            .then(data => {
                const weather = data.data[0];
                weatherResult.textContent = `Current weather in ${weather.city_name}: ${weather.temp}°C, ${weather.weather.description}`;
                weatherEmoji.textContent = getWeatherEmoji(weather.weather.code);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherResult.textContent = 'Error fetching weather data. Please try again.';
                weatherEmoji.textContent = '';
            });
    }

    function getHistoricalWeather(city) {
        fetch(`${apiURL}history/daily?key=${apiKey}&city=${city}&days=5`)
            .then(response => response.json())
            .then(data => {
                const temps = data.data.map(day => day.temp);
                const dates = data.data.map(day => day.datetime);
                const ctx = document.getElementById('historical-chart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'Temperature (°C)',
                            data: temps,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: false
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching historical weather data:', error);
            });
    }

    function getAirQuality(city) {
        fetch(`${apiURL}current/airquality?key=${apiKey}&city=${city}`)
            .then(response => response.json())
            .then(data => {
                const airQuality = data.data[0];
                const ctx = document.getElementById('air-quality-piechart').getContext('2d');
                new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['CO', 'NO2', 'O3', 'SO2', 'PM2.5', 'PM10'],
                        datasets: [{
                            data: [airQuality.co, airQuality.no2, airQuality.o3, airQuality.so2, airQuality.pm25, airQuality.pm10],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching air quality data:', error);
            });
    }

    function getSevereAlerts(city) {
        fetch(`${apiURL}alerts?key=${apiKey}&city=${city}`)
            .then(response => response.json())
            .then(data => {
                const alerts = data.alerts;
                alertsTable.innerHTML = '';
                alerts.forEach(alert => {
                    const row = document.createElement('tr');
                    const alertCell = document.createElement('td');
                    alertCell.textContent = alert.title;
                    const descCell = document.createElement('td');
                    descCell.textContent = alert.description;
                    row.appendChild(alertCell);
                    row.appendChild(descCell);
                    alertsTable.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching severe weather alerts:', error);
            });
    }

    function getWeatherEmoji(code) {
        const weatherCodes = {
            200: '⛈️', // Thunderstorm with light rain
            201: '⛈️', // Thunderstorm with rain
            202: '⛈️', // Thunderstorm with heavy rain
            230: '⛈️', // Thunderstorm with light drizzle
            231: '⛈️', // Thunderstorm with drizzle
            232: '⛈️', // Thunderstorm with heavy drizzle
            300: '🌧️', // Light drizzle
            301: '🌧️', // Drizzle
            302: '🌧️', // Heavy drizzle
            500: '🌦️', // Light rain
            501: '🌧️', // Moderate rain
            502: '🌧️', // Heavy rain
            511: '🌧️', // Freezing rain
            520: '🌧️', // Light shower rain
            521: '🌧️', // Shower rain
            522: '🌧️', // Heavy shower rain
            600: '❄️', // Light snow
            601: '❄️', // Snow
            602: '❄️', // Heavy snow
            610: '🌨️', // Mix snow/rain
            611: '🌨️', // Sleet
            612: '🌨️', // Heavy sleet
            621: '🌨️', // Snow shower
            622: '🌨️', // Heavy snow shower
            700: '🌫️', // Mist
            711: '🌫️', // Smoke
            721: '🌫️', // Haze
            731: '🌫️', // Sand/dust
            741: '🌫️', // Fog
            751: '🌫️', // Freezing fog
            800: '☀️', // Clear sky
            801: '🌤️', // Few clouds
            802: '⛅', // Scattered clouds
            803: '🌥️', // Broken clouds
            804: '☁️' // Overcast clouds
        };
        return weatherCodes[code] || '🌈';
    }
});

