import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Tabs from "./components/Tabs";
import HourlyForecast from "./components/HourlyForecast";
import Highlights from "./components/Highlights";
import WeeklyChart from "./components/WeeklyForecast";
import WeatherMap from "./components/WeatherMap";
import { fetchForecastByCity, fetchWeatherByCity, fetchAirQualityByCoords, fetchUvIndexByCoords } from "./services/weatherService";
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("New York");
  const [activeTab, setActiveTab] = useState("Today");
  const [isDark, setIsDark] = useState(false);

  const [uvIndex, setUvIndex] = useState(0);
  const [aqi, setAqi] = useState(0);
  const [tempData, setTempData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [visibility, setVisibility] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const getForecast = async () => {
      try {
        const data = await fetchForecastByCity(city);
        setForecast(data.list.slice(0, 8));
        const weekly = groupByDay(data.list);
        setWeeklyData(weekly);

        const temps = data.list.slice(0, 8).map(item => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: item.main.temp,
        }));

        const humidity = data.list.slice(0, 8).map(item => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          humidity: item.main.humidity,
        }));

        setTempData(temps);
        setHumidityData(humidity);

      } catch (error) {
        console.error("Forecast fetch error:", error);
      }
    };

    const getCurrentWeather = async () => {
      try {
        const data = await fetchWeatherByCity(city);
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        const vis = data.visibility;

        const aqi = await fetchAirQualityByCoords(lat, lon);
        const uvi = await fetchUvIndexByCoords(lat, lon);
        setAqi(aqi);
        setUvIndex(uvi);
        setVisibility(vis);
        setCurrentWeather(data);

      } catch (error) {
        console.error("Current weather fetch error:", error);
      }
    };

    getForecast();
    getCurrentWeather();
  }, [city]);

  const groupByDay = (list) => {
    const grouped = {};
    list.forEach(item => {
      const day = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(item);
    });

    return Object.entries(grouped).slice(0, 7).map(([day, entries]) => {
      const temps = entries.map(e => e.main.temp);
      const humidities = entries.map(e => e.main.humidity);
      const rainVolumes = entries.map(e => e.rain?.['3h'] || 0);
      const totalRain = rainVolumes.reduce((sum, r) => sum + r, 0);

      return {
        day,
        min: Math.min(...temps),
        max: Math.max(...temps),
        humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
        rain: totalRain,
        alert: totalRain > 1
      };
    });
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <Sidebar city={city} setCity={setCity} isDark={isDark} setIsDark={setIsDark} />
      <main className="flex-1 p-6 overflow-auto">
        <Tabs activeTab={activeTab} onChangeTab={setActiveTab} isDark={isDark} setIsDark={setIsDark} />
        {activeTab === "Today" ? (
          <>
            <div className="mt-6 px-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {forecast.map((hourData, idx) => (
                <HourlyForecast
                  key={idx}
                  time={hourData.dt}
                  icon={hourData.weather[0].icon}
                  temp={hourData.main.temp}
                />
              ))}
            </div>

            <div>
              <h3 className="mt-8 ml-2 font-semibold">Today's Highlights</h3>
            </div>

            <Highlights
              uvIndex={uvIndex}
              aqi={aqi}
              tempData={tempData}
              humidityData={humidityData}
              visibility={visibility}
              isDark={isDark} 
            />
          </>
        ) : activeTab === "Week" ? (
          <WeeklyChart weeklyData={weeklyData} isDark={isDark} />
        ) : (
          <WeatherMap weatherData={currentWeather} />
        )}
      </main>
    </div>
  );
};

export default App;
