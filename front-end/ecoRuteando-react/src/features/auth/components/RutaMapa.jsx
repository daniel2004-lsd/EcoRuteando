import React, { useRef, useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { useTheme } from "../../../app/context/ThemeContext";

// Importar iconos de Leaflet
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const RutaMapa = ({ origin, destination, routeCoordinates, height = "400px" }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { isDarkMode } = useTheme();
  const [center] = useState({ lng: -75.281, lat: 2.927 }); // Neiva

  const MAPTILER_API_KEY = "YOUR_MAPTILER_API_KEY_HERE";

  useEffect(() => {
    if (map.current) return;

    map.current = new L.Map(mapContainer.current, {
      center: L.latLng(center.lat, center.lng),
      zoom: 13,
    });

    const mtLayer = new MaptilerLayer({
      apiKey: MAPTILER_API_KEY,
      style: isDarkMode ? "streets-v2-dark" : "streets-v2",
    }).addTo(map.current);

    L.control.scale({ metric: true, imperial: false, position: 'bottomright' }).addTo(map.current);

    // Si hay coordenadas de ruta, dibujar la línea
    if (routeCoordinates && routeCoordinates.length > 0) {
      const polyline = L.polyline(routeCoordinates, {
        color: '#3a8a5a',
        weight: 4,
        opacity: 0.8,
        lineJoin: 'round',
      }).addTo(map.current);
      
      map.current.fitBounds(polyline.getBounds());
    }

    // Si hay origen y destino, agregar marcadores
    if (origin && origin.lat && origin.lng) {
      L.marker([origin.lat, origin.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: #3a8a5a; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        })
      }).addTo(map.current).bindPopup('Origen');
    }

    if (destination && destination.lat && destination.lng) {
      L.marker([destination.lat, destination.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background-color: #c44a3a; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        })
      }).addTo(map.current).bindPopup('Destino');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center.lat, center.lng, isDarkMode, origin, destination, routeCoordinates]);

  return (
    <div style={{ 
      width: '100%', 
      height: height,
      borderRadius: '14px',
      overflow: 'hidden',
      border: isDarkMode ? '1px solid #1e3a4d' : '1px solid #c8d8e8',
    }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default RutaMapa;