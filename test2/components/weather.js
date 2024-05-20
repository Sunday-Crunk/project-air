import { AirComponent, createState, html } from '../air-js/core/air.js';

export const WeatherComponent = AirComponent('weather-component', function() {
  const [weatherData, setWeatherData] = createState(null);

  const fetchWeather = async (city = 'London') => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`);
      const data = await response.json();
      setWeatherData({
        temp: data.main.temp,
        description: data.weather[0].main,
        icon: data.weather[0].icon
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  fetchWeather()

  const weatherIconUrl = (iconCode) => `http://openweathermap.org/img/wn/${iconCode}.png`;

  return html`
    <style>
      .weather-container {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        padding: 20px;
        text-align: center;
        transition: background-color 0.3s;
      }
      .weather-container:hover {
        background-color: #e2e2ea;
      }
      .temp {
        font-size: 2rem;
        color: #333;
      }
      .description {
        color: #555;
        font-size: 1.2rem;
        margin-top: 5px;
      }
      img {
        height: 100px;
        animation: bounce 2s infinite;
      }
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-30px);
        }
        60% {
          transform: translateY(-15px);
        }
      }
    </style>
    <div class="weather-container">
      ${weatherData ? html`
        <img src="${weatherIconUrl(weatherData.icon)}" alt="Weather Icon">
        <div class="temp">${weatherData.temp}°C</div>
        <div class="description">${weatherData.description}</div>
      ` : 'Loading...'}
    </div>
  `;
});
