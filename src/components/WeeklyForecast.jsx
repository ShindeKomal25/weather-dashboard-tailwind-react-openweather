import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

const WeeklyChart = ({ weeklyData, isDark }) => {
  const temps = weeklyData.map((d) => (d.max + d.min) / 2);
  const humidity = weeklyData.map((d) => d.humidity);
  const rain = weeklyData.map((d) => d.rain || 0);
  const days = weeklyData.map((d) => d.day || ""); // Use day label for xAxis

  // Colors for light/dark mode
  const textColor = isDark ? "#d1d5db" : "#6B7280"; // lighter gray in dark, original gray in light
  const axisLineColorTemp = "#3b82f6";
  const axisLineColorHumidity = "#10b981";
  const axisLineColorRain = "#6366f1";
  const tooltipBgColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.7)";
  const tooltipTextColor = isDark ? "#f9fafb" : "#fff";
  const legendTextColor = isDark ? "#d1d5db" : "#4B5563";
  const containerBg = isDark ? "#1f2937" : "white"; // dark or white background for container
  const containerTextColor = isDark ? "#f9fafb" : "#4B5563";

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: tooltipBgColor,
      textStyle: { color: tooltipTextColor },
      formatter: function (params) {
        let tooltip = `${params[0].axisValue}<br/>`;
        params.forEach((p) => {
          tooltip += `
            <span style="display:inline-block;margin-right:5px;
            border-radius:10px;width:10px;height:10px;background-color:${p.color}"></span>
            ${p.seriesName}: ${Number(p.data).toFixed(2)}<br/>
          `;
        });
        return tooltip;
      },
    },
    legend: {
      data: ["Temperature", "Humidity", "Rain"],
      top: 10,
      textStyle: { color: legendTextColor, fontWeight: 500 },
    },
    grid: {
      top: 60,
      left: "5%",
      right: "5%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: days,
      axisLine: { lineStyle: { color: textColor } },
      axisLabel: { color: textColor, fontWeight: "500" },
      splitLine: { show: false },
    },
    yAxis: [
      {
        // Temperature
        type: "value",
        name: "°C",
        position: "left",
        min: 0,
        max: 40,
        axisLine: { lineStyle: { color: axisLineColorTemp } },
        axisLabel: {
          color: textColor,
          formatter: (value) => `${value.toFixed(2)}°C`,
        },
        splitLine: { show: false },
      },
      {
        // Humidity
        type: "value",
        name: "%",
        position: "right",
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: axisLineColorHumidity } },
        axisLabel: {
          color: textColor,
          formatter: (value) => `${value.toFixed(2)}%`,
        },
        splitLine: { show: false },
      },
      {
        // Rain
        type: "value",
        name: "Rain (mm)",
        position: "right",
        offset: 60,
        min: 0,
        max: Math.max(...rain, 2) + 1,
        axisLine: { lineStyle: { color: axisLineColorRain } },
        axisLabel: {
          color: textColor,
          formatter: (value) => `${value.toFixed(2)} mm`,
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: "Temperature",
        type: "line",
        data: temps,
        yAxisIndex: 0,
        smooth: true,
        symbol: "none",
        lineStyle: { width: 2, color: axisLineColorTemp },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(59, 130, 246, 0.4)" },
            { offset: 1, color: "rgba(59, 130, 246, 0.05)" },
          ]),
        },
      },
      {
        name: "Humidity",
        type: "line",
        data: humidity,
        yAxisIndex: 1,
        smooth: true,
        symbol: "none",
        lineStyle: { width: 2, color: axisLineColorHumidity },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(16, 185, 129, 0.4)" },
            { offset: 1, color: "rgba(16, 185, 129, 0.05)" },
          ]),
        },
      },
      {
        name: "Rain",
        type: "line",
        data: rain,
        yAxisIndex: 2,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 1.5,
          color: axisLineColorRain,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(99, 102, 241, 0.4)" },
            { offset: 1, color: "rgba(99, 102, 241, 0.05)" },
          ]),
        },
      },
    ],
  };

  return (
    <div
      className="rounded-xl shadow p-4 mt-4"
      style={{ backgroundColor: containerBg, color: containerTextColor }}
    >
      <h3 className="text-base font-semibold mb-2" style={{ color: containerTextColor }}>
        🌤 Temperature, Humidity & Rain Forecast
      </h3>
      <p className="text-sm mb-4" style={{ color: containerTextColor }}>
        Combined weather data for the week
      </p>
      <ReactECharts option={option} style={{ height: 320 }} />
    </div>
  );
};

export default WeeklyChart;
