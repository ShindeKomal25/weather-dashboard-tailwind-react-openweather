import { useState, useEffect } from 'react';
import {
  fetchWeatherByCity,
  fetchForecastByCity,
  fetchAirQualityByCoords,
  fetchUvIndexByCoords,
} from '../services/weatherService';

export const useWeather = (initialCity = 'New York') => {
  const [city, setCity] = useState(initialCity);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uvIndex, setUvIndex] = useState(0);
  const [aqi, setAqi] = useState(0);
  const [visibility, setVisibility] = useState(null);

  const searchCity = async (searchCityName) => {
      if (!searchCityName) return;
      setError('');        // <---- Reset error here
      setCity(searchCityName);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const current = await fetchWeatherByCity(city);
        const forecastData = await fetchForecastByCity(city);
        const lat = current.coord.lat;
        const lon = current.coord.lon;

        const aqiData = await fetchAirQualityByCoords(lat, lon);
        const uvData = await fetchUvIndexByCoords(lat, lon);

        setWeather(current);
        setForecast(forecastData.list.slice(0, 8));
        setAqi(aqiData);
        setUvIndex(uvData);
        setVisibility(current.visibility);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setWeather(null);
        setForecast([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [city]);

  return {
    weather,
    forecast,
    city,
    setCity,
    uvIndex,
    aqi,
    visibility,
    error,
    loading,
    searchCity,
  };
};
