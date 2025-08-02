import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Tabs from "./components/Tabs";
import HourlyForecast from "./components/HourlyForecast";
import Highlights from "./components/Highlights";
import WeeklyChart from "./components/WeeklyForecast";
import WeatherMap from "./components/WeatherMap";
import { useWeather } from "./hooks/useWeather";
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [activeTab, setActiveTab] = useState("Today");
  const [isDark, setIsDark] = useState(false);

  const { weather, forecast, city, setCity, uvIndex, aqi, visibility, error } = useWeather("New York");

  const [weeklyData, setWeeklyData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);

  useEffect(() => {
    const root = document.documentElement;
    isDark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    if (!forecast.length) return;

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

    const temps = forecast.map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: item.main.temp,
    }));

    const humidity = forecast.map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      humidity: item.main.humidity,
    }));

    setTempData(temps);
    setHumidityData(humidity);
    setWeeklyData(groupByDay(forecast));
  }, [forecast]);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      <Sidebar city={city} setCity={setCity} weather={weather} error={error} />
      <main className="flex-1 p-6 overflow-auto">
  {error ? (
    <div className="text-center text-red-500 text-lg mt-10">
      {error}
    </div>
  ) : (
    <>
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
        <WeatherMap weatherData={weather} />
      )}
    </>
  )}
</main>
    </div>
  );
};

export default App;
