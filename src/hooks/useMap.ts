
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export function useMap(containerRef, center, emergencyMode) {
  const map = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibXNlcm1hbiIsImEiOiJjbWF3bHRzcmswY3oxMmpzZDVsZHduMG9zIn0.ZKuqgdVvEK77nyQsatMT6g';
    
    map.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: center,
      zoom: 6,
      pitch: 45,
      bearing: 0
    });

    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.current.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

    map.current.on('load', () => {
      if (emergencyMode) {
        map.current.setPaintProperty('background', 'background-color', '#4a0e0e');
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [containerRef, center, emergencyMode]);

  return map;
}
