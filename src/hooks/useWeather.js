import { useState } from 'react';
import { fetchWeatherByCity, fetchForecastByCity } from '../services/weatherService';

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchCity = async (city) => {
    if (!city) return;
    setLoading(true);
    setError('');
    try {
      const current = await fetchWeatherByCity(city);
      const forecastData = await fetchForecastByCity(city);
      setWeather(current);
      setForecast(forecastData.list.slice(0, 8)); // Limit to 8 items
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setWeather(null);
      setForecast([]);
    }
    setLoading(false);
  };

  return {
    weather,
    forecast,
    loading,
    error,
    searchCity,
  };
};
