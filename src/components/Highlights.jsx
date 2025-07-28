import React from "react";
import { WiDaySunny, WiDust, WiFog } from "react-icons/wi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Highlights = ({ uvIndex, aqi, tempData, humidityData, visibility, isDark }) => {
  const uvColor = (uv) => {
    if (uv <= 2) return isDark ? "text-green-400" : "text-green-500";
    if (uv <= 5) return isDark ? "text-yellow-400" : "text-yellow-500";
    if (uv <= 7) return isDark ? "text-orange-500" : "text-orange-600";
    if (uv <= 10) return isDark ? "text-red-500" : "text-red-600";
    return isDark ? "text-purple-600" : "text-purple-800";
  };

  const aqiColor = (aqi) => {
    if (aqi <= 50) return isDark ? "text-green-400" : "text-green-500";
    if (aqi <= 100) return isDark ? "text-yellow-400" : "text-yellow-500";
    if (aqi <= 150) return isDark ? "text-orange-400" : "text-orange-500";
    if (aqi <= 200) return isDark ? "text-red-400" : "text-red-500";
    if (aqi <= 300) return isDark ? "text-purple-500" : "text-purple-600";
    return isDark ? "text-pink-600" : "text-pink-700";
  };

  const aqiLabel = (aqi) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const textPrimary = isDark ? "text-gray-200" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";

  // Tooltip styles
  const tooltipWrapperStyle = {
    backgroundColor: isDark ? "#333" : "#fff",
    border: isDark ? "none" : "1px solid #ddd",
    color: isDark ? "#fff" : "#000",
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`${cardBg} p-4 rounded-lg shadow flex flex-col items-center justify-center text-center`}
        >
          <WiDaySunny size={40} className={`${uvColor(uvIndex)} mb-2`} />
          <h3 className={`font-semibold text-lg ${textPrimary}`}>UV Index</h3>
          <p className={`text-2xl ${textPrimary}`}>{uvIndex}</p>
        </div>

        <div
          className={`${cardBg} p-4 rounded-lg shadow flex flex-col items-center justify-center text-center`}
        >
          <WiDust size={40} className={`${aqiColor(aqi)} mb-2`} />
          <h3 className={`font-semibold text-lg ${textPrimary}`}>Air Quality</h3>
          <p className={`text-2xl ${textPrimary}`}>{aqi}</p>
          <p className={`text-sm ${textSecondary}`}>{aqiLabel(aqi)}</p>
        </div>

        <div
          className={`${cardBg} p-4 rounded-lg shadow flex flex-col items-center justify-center text-center`}
        >
          <WiFog size={40} className={isDark ? "text-gray-400" : "text-gray-500"} />
          <h3 className={`font-semibold text-lg ${textPrimary}`}>Visibility</h3>
          <p className={`text-2xl ${textPrimary}`}>
            {(visibility / 1000).toFixed(1)} km
          </p>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${cardBg} p-4 rounded-lg shadow`}>
          <h3 className={`font-semibold mb-2 ${textPrimary}`}>Humidity</h3>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={humidityData}>
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                wrapperStyle={tooltipWrapperStyle}
                contentStyle={tooltipWrapperStyle}
                itemStyle={{ color: tooltipWrapperStyle.color }}
              />
              <Bar dataKey="humidity" fill="#2e9b77ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${cardBg} p-4 rounded-lg shadow`}>
          <h3 className={`font-semibold mb-2 ${textPrimary}`}>Temperature Trend</h3>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={tempData}>
              <defs>
                <linearGradient id="tempGradientDynamic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.7} />
                  <stop offset="50%" stopColor="#f97316" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={["dataMin - 5", "dataMax + 5"]} hide />
              <Tooltip
                contentStyle={tooltipWrapperStyle}
                labelStyle={{ color: isDark ? "#ccc" : "#555" }}
                formatter={(value) => [`${value.toFixed(1)}°C`, "Temperature"]}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#f97316"
                fill="url(#tempGradientDynamic)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


export default Highlights;
