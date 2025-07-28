import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-rotatedmarker";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const WeatherMap = ({ weatherData }) => {
  const coords = weatherData?.coord
    ? [weatherData.coord.lat, weatherData.coord.lon]
    : [20, 0];

  const MapCenterUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, 8);
    }, [center, map]);
    return null;
  };

  return (
    <div className="h-[600px] mt-6 rounded-xl overflow-hidden shadow-md">
      <MapContainer center={coords} zoom={2} scrollWheelZoom={true} className="h-full w-full">
        <MapCenterUpdater center={coords} />

        {/* Clean, bright base map */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {weatherData && (
          <Marker position={[weatherData.coord.lat, weatherData.coord.lon]}>
            <Popup>
            <strong>{weatherData.name}</strong><br />
            Temp: {Math.round(weatherData.main.temp)}°C<br />
            Wind: {weatherData.wind.speed} m/s<br />
            Direction: {weatherData.wind.deg}°<br />
            Pressure: {weatherData.main.pressure} hPa
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
