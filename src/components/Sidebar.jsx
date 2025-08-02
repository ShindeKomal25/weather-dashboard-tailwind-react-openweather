import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { WiHumidity, WiStrongWind, WiRain, WiBarometer } from "react-icons/wi";
import DayLightChart from "./DayLightChart";

const Sidebar = ({ city, setCity, weather }) => {
  const [inputCity, setInputCity] = useState(city);
  //const [error, setError] = useState(null);

  useEffect(() => {
    setInputCity(city);
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedCity = inputCity.trim();
    if (trimmedCity && trimmedCity.toLowerCase() !== city.toLowerCase()) {
      setCity(trimmedCity);
    }
  };

  const formatDate = (dt, timezoneOffset) => {
    const localTimestamp = (dt + timezoneOffset) * 1000;
    const date = new Date(localTimestamp);
    const options = {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC"
    };
    return date.toLocaleString("en-US", options);
  };

  const getWeatherIcon = (iconCode) =>
    `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  const getRainChance = () => {
    if (!weather) return "0%";
    if (weather.rain) {
      const rainVolume = weather.rain["1h"] ?? weather.rain["3h"] ?? 0;
      return rainVolume > 0 ? "Possible" : "0%";
    }
    return "0%";
  };

  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 px-6 py-8 shadow-lg rounded-r-3xl flex flex-col justify-between text-gray-900 dark:text-gray-100">
      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6">
        <div className="relative w-full">
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Search for places …"
            className="w-full px-4 py-2 pl-10 text-sm rounded-full border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FiSearch className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-300" />
        </div>
      </form>

      {weather && (
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Today, {formatDate(weather.dt, weather.timezone)}
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src={getWeatherIcon(weather.weather[0].icon)}
              alt={weather.weather[0].description}
              className="w-24 h-24"
            />
          </div>

          <div>
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
              {Math.round(weather.main.temp)}°C
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {weather.weather[0].main}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-400">
              Feels like {Math.round(weather.main.feels_like)}°C
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-sm">
            <div className="flex items-center gap-2 text-blue-500">
              <WiRain size={20} />
              <span>Rain Chance: {getRainChance()}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-500">
              <WiStrongWind size={20} />
              <span>Wind: {weather.wind.speed} km/h</span>
            </div>
            <div className="flex items-center gap-2 text-sky-500">
              <WiHumidity size={20} />
              <span>Humidity: {weather.main.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 text-pink-500">
              <WiBarometer size={20} />
              <span>Pressure: {weather.main.pressure} mb</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10">
        {weather && weather.sys && weather.sys.sunrise && weather.sys.sunset && (
          <DayLightChart
            sunrise={new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            sunset={new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
