import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const DayLightChart = ({ sunrise, sunset }) => {
  // sunrise and sunset strings, e.g. "06:45 am", "06:11 pm"

  // We'll create data points for the daylight curve:
  // X axis: time (string), Y axis: intensity from 0 to 1 (height of the curve)

  // For simplicity, create a simple parabolic curve over 5 points:
  const data = [
    { time: sunrise, intensity: 0 },
    { time: "09:00 am", intensity: 0.6 },
    { time: "12:00 pm", intensity: 1 },
    { time: "03:00 pm", intensity: 0.6 },
    { time: sunset, intensity: 0 },
  ];

  return (
    <div>
      <h3 className="mb-2 font-semibold text-gray-800">Daylight Hours</h3>
      <p className="text-sm text-gray-500 mb-4">
        Track the day's light cycle and solar patterns
      </p>

      <ResponsiveContainer width="100%" height={100}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis hide domain={[0, 1]} />
          <Tooltip
            formatter={(value) => `${Math.round(value * 100)}% intensity`}
            labelFormatter={(label) => `Time: ${label}`}
            contentStyle={{ fontSize: 12 }}
          />
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="intensity"
            stroke="#fbbf24"
            fillOpacity={1}
            fill="url(#colorLight)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex justify-between text-xs text-gray-600 mt-2 px-2">
        <div>{sunrise}</div>
        <div>{sunset}</div>
      </div>
    </div>
  );
};

export default DayLightChart;
