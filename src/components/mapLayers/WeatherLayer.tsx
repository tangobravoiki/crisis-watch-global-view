
import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

interface Weather {
  main?: { temp: number; humidity?: number };
  weather?: { description: string }[];
  wind?: { speed: number };
}

interface Props {
  map: React.MutableRefObject<any>;
  weather: Weather | null;
  center: [number, number];
}

const getWeatherColor = (temp = 20) => {
  if (temp < 0) return '#0066cc';
  if (temp < 10) return '#0099ff';
  if (temp < 20) return '#00cc66';
  if (temp < 30) return '#ffcc00';
  return '#ff6600';
};

const WeatherLayer = ({ map, weather, center }: Props) => {
  useEffect(() => {
    if (!map.current || !weather) return;

    if (map.current.getSource('weather')) {
      (map.current.getSource('weather') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {
            temperature: weather.main?.temp,
            description: weather.weather?.[0]?.description,
            humidity: weather.main?.humidity,
            windSpeed: weather.wind?.speed,
          },
          geometry: { type: 'Point', coordinates: center },
        }]
      });
    } else {
      map.current.addSource('weather', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {
              temperature: weather.main?.temp,
              description: weather.weather?.[0]?.description,
              humidity: weather.main?.humidity,
              windSpeed: weather.wind?.speed,
            },
            geometry: { type: 'Point', coordinates: center },
          }]
        }
      });

      map.current.addLayer({
        id: 'weather-layer',
        type: 'circle',
        source: 'weather',
        paint: {
          'circle-radius': 50,
          'circle-color': getWeatherColor(weather.main?.temp),
          'circle-opacity': 0.6,
          'circle-stroke-width': 3,
          'circle-stroke-color': '#ffffff'
        }
      });
    }

    return () => {
      if (map.current.getLayer('weather-layer')) map.current.removeLayer('weather-layer');
      if (map.current.getSource('weather')) map.current.removeSource('weather');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, weather, center]);

  return null;
};

export default WeatherLayer;
