import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from "../../../app/context/ThemeContext";
import { loadGoogleMapsApi } from "../../../services/googleMapsLoader";

const escapeHtml = (str) => str.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Dark map styles tuned to the custom dark palette
// (background #0B1215, surface #162329, elevated #111C20, border #26383D,
// primary text #e2e8f0, secondary #94a3b8, accent #34D399).
const DARK_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0B1215" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#e2e8f0" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0B1215" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#162329" }] },
  { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#0B1215" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#111C20" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#064E3B" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#34D399" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#162329" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#26383D" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1b2f35" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#26383D" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#111C20" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#34D399" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e2127" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
];

const VALID_MAP_TYPE_IDS = ["roadmap", "satellite", "hybrid", "terrain"];

const MapViewGoogle = ({ center, zoom, onLocationSelect, height = "100vh", markers = [], selectedLocation, routeGeometry, showUserLocation = true, mapFocus = null, mapTypeId = "roadmap" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);
  const userMarkerRef = useRef(null);
  const focusMarkerRef = useRef(null);
  const { isDarkMode } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);
  const onLocationSelectRef = useRef(onLocationSelect);

  useEffect(() => { onLocationSelectRef.current = onLocationSelect; }, [onLocationSelect]);

  // Cargar Google Maps (loader singleton para evitar carga múltiple)
  useEffect(() => {
    loadGoogleMapsApi()
      .then(() => setMapLoaded(true))
      .catch((err) => console.error("Error cargando Google Maps:", err));
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    // Initial style matches the current theme; later theme toggles use setOptions below
    const initialMapTypeId = VALID_MAP_TYPE_IDS.includes(mapTypeId) ? mapTypeId : "roadmap";
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: center?.lat || 4.7110, lng: center?.lng || -74.0721 },
      zoom: zoom || 13,
      mapTypeId: initialMapTypeId,
      zoomControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: isDarkMode ? DARK_MAP_STYLES : [],
    });

    if (true) {
      mapInstanceRef.current.addListener('click', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        onLocationSelectRef.current?.({ lat, lng });
      });
    }
  }, [mapLoaded]);

  // Pan the existing map when `center` changes (e.g. "Centrar en Neiva",
  // selected nearby destination). One-time creation above stays untouched;
  // zoom is left alone and selectedLocation/routeGeometry effects are separate.
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const lat = Number(center?.lat);
    const lng = Number(center?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    if (typeof mapInstanceRef.current.panTo === "function") {
      mapInstanceRef.current.panTo({ lat, lng });
    } else {
      mapInstanceRef.current.setCenter({ lat, lng });
    }
  }, [center?.lat, center?.lng]);

  // React to theme changes without recreating the map or its listeners/markers/routes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setOptions({ styles: isDarkMode ? DARK_MAP_STYLES : [] });
  }, [isDarkMode, mapLoaded]);

  // Switch Google map type without recreating the map or touching markers/routes/theme/listeners
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const nextMapTypeId = VALID_MAP_TYPE_IDS.includes(mapTypeId) ? mapTypeId : "roadmap";
    if (typeof mapInstanceRef.current.setMapTypeId === "function") {
      mapInstanceRef.current.setMapTypeId(nextMapTypeId);
    }
  }, [mapTypeId, mapLoaded]);

  // Explicit focus on the user's current GPS position (e.g. "Centrar" button).
  // Validates coordinates, then centers with an explicit zoom and renders a
  // high-contrast current-position marker. Separate from the ambient `center`
  // pan effect above; `at` acts as a nonce so repeated taps always retrigger.
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    if (!mapFocus) return;
    const lat = Number(mapFocus?.lat);
    const lng = Number(mapFocus?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    if (!window.google?.maps) return;
    mapInstanceRef.current.setCenter({ lat, lng });
    const requestedZoom = Number(mapFocus?.zoom);
    const fallbackZoom =
      typeof mapInstanceRef.current.getZoom === "function"
        ? mapInstanceRef.current.getZoom()
        : zoom;
    const targetZoom = Number.isFinite(requestedZoom) ? requestedZoom : fallbackZoom;
    if (Number.isFinite(Number(targetZoom))) {
      mapInstanceRef.current.setZoom(Number(targetZoom));
    }
    if (focusMarkerRef.current) {
      focusMarkerRef.current.setMap(null);
      focusMarkerRef.current = null;
    }
    focusMarkerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: "#1a73e8",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 3,
        scale: 10,
      },
      title: "Tu ubicación actual",
      zIndex: 2000,
    });
  }, [mapFocus?.lat, mapFocus?.lng, mapFocus?.zoom, mapFocus?.at, mapLoaded]);

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
        content: `<div style="padding: 8px; font-family: sans-serif; font-size: 13px;"><strong>${escapeHtml(marker.popup)}</strong></div>`
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