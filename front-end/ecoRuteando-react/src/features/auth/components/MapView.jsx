import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from "../../../app/context/ThemeContext";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const MapViewGoogle = ({ center, zoom, onLocationSelect, height = "100vh", markers = [], selectedLocation, routeGeometry }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);
  const { isDarkMode } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);

  // Cargar Google Maps
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&language=es`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: center?.lat || 2.9273, lng: center?.lng || -75.2819 },
      zoom: zoom || 13,
      styles: isDarkMode ? darkMapStyle : [],
      zoomControl: true,
      mapTypeControl: false,
      fullscreenControl: true,
    });

    // Click en el mapa
    if (onLocationSelect) {
      mapInstanceRef.current.addListener('click', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        onLocationSelect({ lat, lng });
        
        // Mostrar marcador temporal
        new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstanceRef.current,
          title: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
        });
      });
    }
  }, [mapLoaded, center, zoom, isDarkMode]);

  // Dibujar ruta
  useEffect(() => {
    if (!mapInstanceRef.current || !routeGeometry) return;

    // Limpiar ruta anterior
    if (routeRef.current) {
      routeRef.current.setMap(null);
    }

    // Si routeGeometry es un string (polyline codificado)
    if (typeof routeGeometry === 'string') {
      const decodedPath = window.google.maps.geometry.encoding.decodePath(routeGeometry);
      routeRef.current = new window.google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: "#10b981",
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: mapInstanceRef.current,
      });
      
      // Ajustar vista
      const bounds = new window.google.maps.LatLngBounds();
      decodedPath.forEach(point => bounds.extend(point));
      mapInstanceRef.current.fitBounds(bounds);
    }
    // Si routeGeometry tiene coordinates (formato Leaflet)
    else if (routeGeometry.coordinates && routeGeometry.coordinates.length) {
      const path = routeGeometry.coordinates.map(coord => ({ lat: coord[0], lng: coord[1] }));
      routeRef.current = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#10b981",
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: mapInstanceRef.current,
      });
      
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach(point => bounds.extend(point));
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [routeGeometry]);

  // Actualizar marcadores
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Agregar nuevos marcadores
    markers.forEach(marker => {
      const m = new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: mapInstanceRef.current,
        title: marker.popup,
        icon: marker.type === 'origin' ? originIcon : marker.type === 'destination' ? destIcon : null
      });
      
      // Info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 8px; font-family: sans-serif;"><strong>${marker.popup}</strong></div>`
      });
      
      m.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, m);
      });
      
      markersRef.current.push(m);
    });
  }, [markers]);

  // Ubicación seleccionada
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;

    mapInstanceRef.current.setCenter({ lat: selectedLocation.lat, lng: selectedLocation.lon });
    mapInstanceRef.current.setZoom(15);
  }, [selectedLocation]);

  return (
    <div style={{ 
      width: '100%', 
      height: height,
      borderRadius: '14px',
      overflow: 'hidden',
      border: isDarkMode ? '1px solid #1e3a4d' : '1px solid #c8d8e8',
    }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {!mapLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
        }}>
          Cargando mapa...
        </div>
      )}
    </div>
  );
};

// Estilos para modo oscuro
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

// Iconos personalizados
const originIcon = {
  url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
};

const destIcon = {
  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
};

export default MapViewGoogle;