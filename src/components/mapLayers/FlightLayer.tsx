
import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

interface Flight {
  icao24: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  heading: number;
  registration: string;
}

interface Props {
  map: React.MutableRefObject<any>;
  flights: Flight[];
  onClickFlight?: (flight: Flight) => void;
}

const FlightLayer = ({ map, flights, onClickFlight }: Props) => {
  useEffect(() => {
    if (!map.current || !flights || flights.length === 0) return;

    const features = flights.map(flight => ({
      type: 'Feature',
      properties: {
        id: flight.icao24,
        callsign: flight.callsign,
        altitude: flight.altitude,
        velocity: flight.velocity,
        heading: flight.heading || 0,
        registration: flight.registration,
      },
      geometry: {
        type: 'Point',
        coordinates: [flight.longitude, flight.latitude]
      }
    }));

    if (map.current.getSource('flights')) {
      (map.current.getSource('flights') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features,
      });
    } else {
      map.current.addSource('flights', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        },
      });

      map.current.addLayer({
        id: 'flights-layer',
        type: 'circle',
        source: 'flights',
        paint: {
          'circle-radius': 8,
          'circle-color': '#00bfff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
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
          'text-size': 10,
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
        }
      });

      // Flight layer click handler
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
        if (onClickFlight) onClickFlight(flight);
      });
    }

    return () => {
      // Remove flight layers and sources on cleanup
      ['flights-layer', 'flights-labels'].forEach(layerId => {
        if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
      });
      if (map.current.getSource('flights')) map.current.removeSource('flights');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, flights]);

  return null;
};

export default FlightLayer;
