const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = process.env.REACT_APP_WEATHER_API_BASE;

// Get current weather for a city
export const fetchWeatherByCity = async (city) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('City not found');
  return res.json();
};

// Get hourly forecast for a city (3-hour intervals)
export const fetchForecastByCity = async (city) => {
  const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Forecast not available');
  return res.json();
};

export const fetchAirQualityByCoords = async (lat, lon) => {
  const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch air quality");
  }
  const data = await response.json();
  return data.list[0].main.aqi; // Returns AQI (1-5)
};

export const fetchUvIndexByCoords = async (lat, lon) => {
  const url = `${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch air quality");
  }
  const data = await response.json();
  return data.value; // Returns UVI
};

// Get current weather by coordinates
export const fetchWeatherByCoords = async (lat, lon) => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Location not found');
  return res.json();
};