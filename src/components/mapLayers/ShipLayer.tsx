
import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

interface Ship {
  mmsi: string;
  name: string;
  shipType: string;
  speed: number;
  course: number;
  latitude: number;
  longitude: number;
}

interface Props {
  map: React.MutableRefObject<any>;
  ships: Ship[];
}

const ShipLayer = ({ map, ships }: Props) => {
  useEffect(() => {
    if (!map.current || !ships || ships.length === 0) return;

    const features = ships.map(ship => ({
      type: 'Feature',
      properties: {
        id: ship.mmsi,
        name: ship.name,
        type: ship.shipType,
        speed: ship.speed,
        course: ship.course || 0,
      },
      geometry: {
        type: 'Point',
        coordinates: [ship.longitude, ship.latitude],
      },
    }));

    if (map.current.getSource('ships')) {
      (map.current.getSource('ships') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features,
      });
    } else {
      map.current.addSource('ships', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
      });

      map.current.addLayer({
        id: 'ships-layer',
        type: 'circle',
        source: 'ships',
        paint: {
          'circle-radius': 8,
          'circle-color': '#00ffff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
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
          'text-size': 10,
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
        }
      });

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
    }

    return () => {
      ['ships-layer', 'ships-labels'].forEach(layerId => {
        if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
      });
      if (map.current.getSource('ships')) map.current.removeSource('ships');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, ships]);

  return null;
};

export default ShipLayer;
