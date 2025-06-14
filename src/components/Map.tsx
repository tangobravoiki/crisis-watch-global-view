
import React, { useRef, useState, useEffect } from "react";
import { flightService } from "@/services/flightService";
import { shipService } from "@/services/shipService";
import { weatherService } from "@/services/weatherService";
import { trafficService } from "@/services/trafficService";
import { useMap } from "@/hooks/useMap";
// Map layers
import FlightLayer from "./mapLayers/FlightLayer";
import ShipLayer from "./mapLayers/ShipLayer";
import WeatherLayer from "./mapLayers/WeatherLayer";
import TrafficLayer from "./mapLayers/TrafficLayer";

const Map = ({ activeLayer, center, emergencyMode }) => {
  const mapContainer = useRef(null);
  const map = useMap(mapContainer, center, emergencyMode);

  // State per layer data
  const [flights, setFlights] = useState([]);
  const [ships, setShips] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flightError, setFlightError] = useState(false);
  const updateInterval = useRef(null);

  useEffect(() => {
    // Immediate fetch on mount & on activeLayer changes
    if (map.current) {
      loadLayerData();
    }
    setupAutoRefresh();
    return () => {
      if (updateInterval.current) clearInterval(updateInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLayer, center, map.current]);

  const setupAutoRefresh = () => {
    if (updateInterval.current) clearInterval(updateInterval.current);
    updateInterval.current = setInterval(() => {
      loadLayerData();
    }, 30000);
  };

  const loadLayerData = async () => {
    if (loading) return;
    setLoading(true);
    setFlightError(false);

    try {
      switch (activeLayer) {
        case "flights": {
          const flightData = await flightService.getNearbyFlights(center[1], center[0], 100);
          if (!flightData || flightData.length === 0) {
            setFlights([]);
            setFlightError(true);
            return;
          }
          setFlights(flightData);
          setFlightError(false);
          break;
        }
        case "ships": {
          const shipData = await shipService.getNearbyShips(center[1], center[0], 100);
          setShips(shipData);
          break;
        }
        case "weather": {
          const weather = await weatherService.getCurrentWeather(center[1], center[0]);
          setWeatherData(weather);
          break;
        }
        case "traffic": {
          // No data fetch, handled by TrafficLayer
          break;
        }
        default:
          // Clear all layer state
          setFlights([]); setShips([]); setWeatherData(null);
      }
    } catch (error) {
      if (activeLayer === "flights") {
        setFlightError(true); setFlights([]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* EMERGENCY OVERLAY */}
      {emergencyMode && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold animate-pulse">
            ACİL DURUM MODU
          </div>
        </div>
      )}

      {/* LOADING INDICATOR */}
      {loading && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Yükleniyor...
        </div>
      )}

      {/* MAP LAYERS */}
      {map.current && activeLayer === "flights" && flights.length > 0 && (
        <FlightLayer map={map} flights={flights} />
      )}
      {map.current && activeLayer === "ships" && ships.length > 0 && (
        <ShipLayer map={map} ships={ships} />
      )}
      {map.current && activeLayer === "weather" && weatherData && (
        <WeatherLayer map={map} weather={weatherData} center={center} />
      )}
      {map.current && activeLayer === "traffic" && (
        <TrafficLayer map={map} />
      )}

      {/* LAYER INFO */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
        <p className="text-sm">
          Aktif Katman: <span className="font-bold capitalize">{activeLayer}</span>
        </p>
        {activeLayer === "flights" && flightError && (
          <p className="text-xs text-red-400 mt-1">Uçuş verisi alınamadı.</p>
        )}
        {activeLayer === "flights" && !flightError && (
          <p className="text-xs">{flights.length} uçak görüntüleniyor</p>
        )}
        {activeLayer === "ships" && (
          <p className="text-xs">{ships.length} gemi görüntüleniyor</p>
        )}
        {activeLayer === "weather" && weatherData && (
          <p className="text-xs">Hava durumu: {Math.round(weatherData.main?.temp)}°C</p>
        )}
        {activeLayer === "traffic" && (
          <p className="text-xs">Trafik durumu görüntüleniyor</p>
        )}
      </div>
    </div>
  );
};

export default Map;
