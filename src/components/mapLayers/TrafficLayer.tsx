
import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

interface Props {
  map: React.MutableRefObject<any>;
}

const TrafficLayer = ({ map }: Props) => {
  useEffect(() => {
    if (!map.current) return;

    if (!map.current.getSource('traffic')) {
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
    }

    return () => {
      if (map.current.getLayer('traffic-layer')) map.current.removeLayer('traffic-layer');
      if (map.current.getSource('traffic')) map.current.removeSource('traffic');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};

export default TrafficLayer;
