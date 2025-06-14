import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { flightService } from '@/services/flightService';
import { shipService } from '@/services/shipService';
import { weatherService } from '@/services/weatherService';
import { trafficService } from '@/services/trafficService';

const Map = ({ activeLayer, center, emergencyMode }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [flights, setFlights] = useState([]);
  const [ships, setShips] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flightError, setFlightError] = useState(false);
  const updateInterval = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibXNlcm1hbiIsImEiOiJjbWF3bHRzcmswY3oxMmpzZDVsZHduMG9zIn0.ZKuqgdVvEK77nyQsatMT6g';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: center,
      zoom: 6,
      pitch: 45,
      bearing: 0
    });

    // Navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Scale control
    map.current.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }),
      'bottom-left'
    );

    map.current.on('load', () => {
      if (emergencyMode) {
        map.current.setPaintProperty('background', 'background-color', '#4a0e0e');
      }

      loadLayerData();
      setupAutoRefresh();
    });

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      loadLayerData();
    }
  }, [activeLayer]);

  const setupAutoRefresh = () => {
    // Auto-refresh data every 30 seconds
    if (updateInterval.current) {
      clearInterval(updateInterval.current);
    }
    
    updateInterval.current = setInterval(() => {
      console.log(`${activeLayer} verisi güncelleniyor...`);
      loadLayerData();
    }, 30000);
  };

  const loadLayerData = async () => {
    if (loading) return;

    setLoading(true);
    setFlightError(false);
    try {
      switch (activeLayer) {
        case 'flights':
          const flightData = await flightService.getNearbyFlights(center[1], center[0], 100);
          if (!flightData || flightData.length === 0) {
            setFlights([]);
            setFlightError(true);
            clearAllLayers();
            return;
          }
          setFlights(flightData);
          setFlightError(false);
          displayFlights(flightData);
          break;
        case 'ships':
          const shipData = await shipService.getNearbyShips(center[1], center[0], 100);
          setShips(shipData);
          displayShips(shipData);
          break;
        case 'weather':
          const weather = await weatherService.getCurrentWeather(center[1], center[0]);
          setWeatherData(weather);
          displayWeather(weather);
          break;
        case 'traffic':
          await displayTrafficLayer();
          break;
        default:
          clearAllLayers();
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      if (activeLayer === 'flights') {
        setFlightError(true);
        setFlights([]);
        clearAllLayers();
      }
    } finally {
      setLoading(false);
    }
  };

  const displayFlights = (flightData) => {
    clearAllLayers();

    if (!flightData || flightData.length === 0) {
      return;
    }

    const features = flightData.map(flight => ({
      type: 'Feature',
      properties: {
        id: flight.icao24,
        callsign: flight.callsign,
        altitude: flight.altitude,
        velocity: flight.velocity,
        heading: flight.heading || 0
      },
      geometry: {
        type: 'Point',
        coordinates: [flight.longitude, flight.latitude]
      }
    }));

    map.current.addSource('flights', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features
      }
    });

    // Flight icons
    map.current.addLayer({
      id: 'flights-layer',
      type: 'circle',
      source: 'flights',
      paint: {
        'circle-radius': 8,
        'circle-color': '#00bfff',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    map.current.addLayer({
      id: 'flights-labels',
      type: 'symbol',
      source: 'flights',
      layout: {
        'text-field': ['get', 'callsign'],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 2],
        'text-anchor': 'top',
        'text-size': 10
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 1
      }
    });

    // Click events
    map.current.on('click', 'flights-layer', (e) => {
      const flight = e.features[0].properties;
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <div class="p-3">
            <h3 class="font-bold text-blue-600">Uçak Bilgileri</h3>
            <p><strong>Çağrı Kodu:</strong> ${flight.callsign || 'Bilinmiyor'}</p>
            <p><strong>Yükseklik:</strong> ${flight.altitude || 0} m</p>
            <p><strong>Hız:</strong> ${flight.velocity || 0} km/h</p>
            <p><strong>Yön:</strong> ${flight.heading || 0}°</p>
          </div>
        `)
        .addTo(map.current);
    });
  };

  const displayShips = (shipData) => {
    clearAllLayers();
    
    if (!shipData || shipData.length === 0) {
      console.log('Gösterilecek gemi verisi bulunamadı');
      return;
    }

    const features = shipData.map(ship => ({
      type: 'Feature',
      properties: {
        id: ship.mmsi,
        name: ship.name,
        type: ship.shipType,
        speed: ship.speed,
        course: ship.course || 0
      },
      geometry: {
        type: 'Point',
        coordinates: [ship.longitude, ship.latitude]
      }
    }));

    map.current.addSource('ships', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: features
      }
    });

    map.current.addLayer({
      id: 'ships-layer',
      type: 'circle',
      source: 'ships',
      paint: {
        'circle-radius': 8,
        'circle-color': '#00ffff',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    map.current.addLayer({
      id: 'ships-labels',
      type: 'symbol',
      source: 'ships',
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 2],
        'text-anchor': 'top',
        'text-size': 10
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 1
      }
    });

    // Click events
    map.current.on('click', 'ships-layer', (e) => {
      const ship = e.features[0].properties;
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <div class="p-3">
            <h3 class="font-bold text-cyan-600">Gemi Bilgileri</h3>
            <p><strong>İsim:</strong> ${ship.name || 'Bilinmiyor'}</p>
            <p><strong>Tip:</strong> ${ship.type || 'Bilinmiyor'}</p>
            <p><strong>Hız:</strong> ${ship.speed || 0} knot</p>
            <p><strong>Rota:</strong> ${ship.course || 0}°</p>
          </div>
        `)
        .addTo(map.current);
    });
  };

  const displayWeather = (weather) => {
    clearAllLayers();
    
    if (!weather) {
      console.log('Gösterilecek hava durumu verisi bulunamadı');
      return;
    }

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
            windSpeed: weather.wind?.speed
          },
          geometry: {
            type: 'Point',
            coordinates: center
          }
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
  };

  const displayTrafficLayer = async () => {
    clearAllLayers();
    
    try {
      // TomTom Traffic Flow tile layer
      map.current.addSource('traffic', {
        type: 'raster',
        tiles: [
          `https://api.tomtom.com/traffic/map/4/tile/flow/absolute/{z}/{x}/{y}.png?key=4aWbNX5XHYVrCjWnn1uDeXeCM9Q7hGG0`
        ],
        tileSize: 256
      });

      map.current.addLayer({
        id: 'traffic-layer',
        type: 'raster',
        source: 'traffic',
        paint: {
          'raster-opacity': 0.7
        }
      });

      console.log('Trafik katmanı eklendi');
    } catch (error) {
      console.error('Trafik katmanı eklenemedi:', error);
    }
  };

  const clearAllLayers = () => {
    const layersToRemove = [
      'flights-layer', 'flights-labels', 'ships-layer', 'ships-labels', 
      'weather-layer', 'traffic-layer'
    ];
    
    layersToRemove.forEach(layerId => {
      if (map.current.getLayer(layerId)) {
        map.current.removeLayer(layerId);
      }
    });

    const sourcesToRemove = ['flights', 'ships', 'weather', 'traffic'];
    sourcesToRemove.forEach(sourceId => {
      if (map.current.getSource(sourceId)) {
        map.current.removeSource(sourceId);
      }
    });
  };

  const getWeatherColor = (temp) => {
    if (temp < 0) return '#0066cc';
    if (temp < 10) return '#0099ff';
    if (temp < 20) return '#00cc66';
    if (temp < 30) return '#ffcc00';
    return '#ff6600';
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Emergency overlay */}
      {emergencyMode && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg font-bold animate-pulse">
            ACİL DURUM MODU
          </div>
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Yükleniyor...
        </div>
      )}
      
      {/* Layer info */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
        <p className="text-sm">
          Aktif Katman: <span className="font-bold capitalize">{activeLayer}</span>
        </p>
        {activeLayer === 'flights' && flightError && (
          <p className="text-xs text-red-400 mt-1">Uçuş verisi alınamadı.</p>
        )}
        {activeLayer === 'flights' && !flightError && <p className="text-xs">{flights.length} uçak görüntüleniyor</p>}
        {activeLayer === 'ships' && <p className="text-xs">{ships.length} gemi görüntüleniyor</p>}
        {activeLayer === 'weather' && weatherData && <p className="text-xs">Hava durumu: {Math.round(weatherData.main?.temp)}°C</p>}
        {activeLayer === 'traffic' && <p className="text-xs">Trafik durumu görüntüleniyor</p>}
      </div>
    </div>
  );
};

export default Map;
