import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from "../../../app/context/ThemeContext";

const MapViewGoogle = ({ center, zoom, onLocationSelect, height = "100vh", markers = [], selectedLocation, routeGeometry, showUserLocation = true }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);
  const userMarkerRef = useRef(null);
  const { isDarkMode } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  // Cargar Google Maps
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&language=es`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => console.error("Error cargando Google Maps");
    document.head.appendChild(script);
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    // Usar colores normales, no oscuros
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: center?.lat || 4.7110, lng: center?.lng || -74.0721 },
      zoom: zoom || 13,
      zoomControl: true,
      mapTypeControl: false,
      fullscreenControl: true,
      streetViewControl: false,
      styles: [], // Sin estilos oscuros - mapa normal
    });

    // Botón de mi ubicación
    const locationButton = document.createElement("button");
    locationButton.innerHTML = "📍";
    locationButton.className = "custom-location-button";
    locationButton.style.cssText = `
      position: absolute;
      bottom: 20px;
      right: 20px;
      z-index: 10;
      background: white;
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    locationButton.onclick = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const newLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          mapInstanceRef.current.setCenter(newLocation);
          mapInstanceRef.current.setZoom(16);
        }, undefined, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
      }
    };
    
    mapRef.current.appendChild(locationButton);

    if (onLocationSelect) {
      mapInstanceRef.current.addListener('click', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        onLocationSelect({ lat, lng });
      });
    }
  }, [mapLoaded]);

  // Mostrar ubicación del usuario (punto azul)
  useEffect(() => {
    if (!mapInstanceRef.current || !showUserLocation) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          if (userMarkerRef.current) {
            userMarkerRef.current.setMap(null);
          }

          userMarkerRef.current = new window.google.maps.Marker({
            position: userPos,
            map: mapInstanceRef.current,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
              scale: 10,
            },
            title: "Tu ubicación",
            zIndex: 1000
          });
        },
        (error) => console.error("Error obteniendo ubicación:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    }
  }, [mapLoaded, showUserLocation]);

  // Dibujar ruta
  useEffect(() => {
    if (!mapInstanceRef.current || !routeGeometry) return;

    if (routeRef.current) {
      routeRef.current.setMap(null);
    }

    if (typeof routeGeometry === 'string' && routeGeometry.length > 0) {
      try {
        const decodedPath = window.google.maps.geometry.encoding.decodePath(routeGeometry);
        routeRef.current = new window.google.maps.Polyline({
          path: decodedPath,
          geodesic: true,
          strokeColor: "#10b981",
          strokeOpacity: 0.9,
          strokeWeight: 5,
          map: mapInstanceRef.current,
        });
        
        const bounds = new window.google.maps.LatLngBounds();
        decodedPath.forEach(point => bounds.extend(point));
        mapInstanceRef.current.fitBounds(bounds);
      } catch (e) {
        console.error("Error decodificando polyline:", e);
      }
    }
  }, [routeGeometry]);

  // Actualizar marcadores
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    markers.forEach(marker => {
      let iconUrl = "";
      if (marker.type === 'origin') {
        iconUrl = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
      } else if (marker.type === 'destination') {
        iconUrl = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
      } else if (marker.type === 'poi') {
        iconUrl = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
      }
      
      const m = new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: mapInstanceRef.current,
        title: marker.popup,
        icon: iconUrl || undefined,
        animation: window.google.maps.Animation.DROP
      });
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 8px; font-family: sans-serif; font-size: 13px;"><strong>${marker.popup}</strong></div>`
      });
      
      m.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, m);
      });
      
      markersRef.current.push(m);
    });
  }, [markers]);

  // Centrar en ubicación seleccionada
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;
    mapInstanceRef.current.setCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
    mapInstanceRef.current.setZoom(15);
  }, [selectedLocation]);

  return (
    <div style={{ 
      width: '100%', 
      height: height,
      borderRadius: '14px',
      overflow: 'hidden',
      position: 'relative',
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
          zIndex: 10,
        }}>
          Cargando mapa de Google...
        </div>
      )}
    </div>
  );
};

export default MapViewGoogle;