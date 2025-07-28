import React from "react";

const HourlyForecast = ({ time, icon, temp }) => {
  const formatHour = (unixTime) => {
    const date = new Date(unixTime * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center text-center">
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
        {formatHour(time)}
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="weather icon"
        className="w-12 h-12"
      />
      <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
        {Math.round(temp)}°C
      </p>
    </div>
  );
};

export default HourlyForecast;
