
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface NewsItem {
  id: string;
  title: string;
  description?: string;
  url?: string;
  latitude?: number;
  longitude?: number;
  publishedAt?: string;
}

interface Props {
  news: NewsItem[];
  loading?: boolean;
}

// Önemli: Kendi Mapbox public token'ınızı kullanmalısınız!
const MAPBOX_TOKEN = "pk.eyJ1IjoibXNlcm1hbiIsImEiOiJjbWF3bHRzcmswY3oxMmpzZDVsZHduMG9zIn0.ZKuqgdVvEK77nyQsatMT6g";

const Map: React.FC<Props> = ({ news, loading }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [35, 39],
      zoom: 5,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Mevcut tüm eski markerları kaldırmak için closure array.
    let markers: mapboxgl.Marker[] = [];

    // Sadece konumlu haberler marker olarak eklenir
    news
      .filter((n) => n.latitude !== undefined && n.longitude !== undefined)
      .forEach((item) => {
        const marker = new mapboxgl.Marker({ color: "#f43f5e" })
          .setLngLat([item.longitude!, item.latitude!])
          .setPopup(
            new mapboxgl.Popup({ offset: 16 })
              .setHTML(`<strong>${item.title}</strong><br/><span>${item.description || ""}</span>`)
          )
          .addTo(map.current!);
        markers.push(marker);
      });

    // Temizleme: markerları kaldır.
    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [news]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <div className="text-white animate-spin h-10 w-10 border-b-2 border-white rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default Map;
