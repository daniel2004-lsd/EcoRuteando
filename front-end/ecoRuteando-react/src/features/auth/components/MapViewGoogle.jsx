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

const MapViewGoogle = ({ 
  center, 
  zoom, 
  onLocationSelect, 
  height = "100vh", 
  markers = [], 
  selectedLocation, 
  routeGeometry, 
  alternativeRoutes = [],
  onSelectAlternative,
  showUserLocation = true, 
  mapFocus = null, 
  mapTypeId = "roadmap" 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);
  const altRoutesRef = useRef([]);
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

  // Forzar resize de Google Maps al cambiar tamaño o cargar
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    const timer = setTimeout(() => {
      if (mapInstanceRef.current && window.google?.maps) {
        window.google.maps.event.trigger(mapInstanceRef.current, "resize");
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [mapLoaded, height]);

  // Dibujar ruta activa (polyline) y rutas alternativas estilo Google Maps
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    if (routeRef.current) {
      routeRef.current.setMap(null);
      routeRef.current = null;
    }
    altRoutesRef.current.forEach((r) => r.setMap(null));
    altRoutesRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();
    let hasPoints = false;

    // 1. Trazar rutas alternativas en gris si existen
    if (Array.isArray(alternativeRoutes) && window.google?.maps?.geometry) {
      alternativeRoutes.forEach((alt) => {
        if (!alt?.geometry || alt.geometry === routeGeometry) return;
        try {
          const decodedAlt = window.google.maps.geometry.encoding.decodePath(alt.geometry);
          if (decodedAlt && decodedAlt.length > 0) {
            const altPoly = new window.google.maps.Polyline({
              path: decodedAlt,
              geodesic: true,
              strokeColor: isDarkMode ? "#64748b" : "#94a3b8",
              strokeOpacity: 0.75,
              strokeWeight: 4,
              map: mapInstanceRef.current,
              zIndex: 10,
            });

            altPoly.addListener("click", () => {
              if (typeof onSelectAlternative === "function") {
                onSelectAlternative(alt.index);
              }
            });

            decodedAlt.forEach((p) => {
              bounds.extend(p);
              hasPoints = true;
            });
            altRoutesRef.current.push(altPoly);
          }
        } catch (e) {
          console.warn("Error decodificando polyline alternativa:", e);
        }
      });
    }

    // 2. Trazar la ruta principal seleccionada (verde esmeralda destacado)
    if (typeof routeGeometry === 'string' && routeGeometry.length > 0 && window.google?.maps?.geometry) {
      try {
        const decodedPath = window.google.maps.geometry.encoding.decodePath(routeGeometry);
        if (decodedPath && decodedPath.length > 0) {
          routeRef.current = new window.google.maps.Polyline({
            path: decodedPath,
            geodesic: true,
            strokeColor: "#10b981",
            strokeOpacity: 0.95,
            strokeWeight: 6,
            map: mapInstanceRef.current,
            zIndex: 30,
          });
          
          decodedPath.forEach(point => {
            bounds.extend(point);
            hasPoints = true;
          });

          mapInstanceRef.current.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
          return;
        }
      } catch (e) {
        console.warn("Error decodificando polyline guardada:", e);
      }
    }

    // Fallback: Si no hay polyline pero hay marcadores de origen y destino, trazar con DirectionsService o línea directa
    const originM = markers.find(m => m.type === 'origin');
    const destM = markers.find(m => m.type === 'destination');
    if (originM && destM && window.google?.maps) {
      if (window.google.maps.DirectionsService) {
        const ds = new window.google.maps.DirectionsService();
        ds.route({
          origin: { lat: Number(originM.lat), lng: Number(originM.lng) },
          destination: { lat: Number(destM.lat), lng: Number(destM.lng) },
          travelMode: window.google.maps.TravelMode.WALKING,
        }, (result, status) => {
          if (status === 'OK' && result?.routes?.[0]?.overview_polyline && mapInstanceRef.current) {
            try {
              const decodedPath = window.google.maps.geometry.encoding.decodePath(result.routes[0].overview_polyline);
              if (routeRef.current) routeRef.current.setMap(null);
              routeRef.current = new window.google.maps.Polyline({
                path: decodedPath,
                geodesic: true,
                strokeColor: "#10b981",
                strokeOpacity: 0.95,
                strokeWeight: 6,
                map: mapInstanceRef.current,
                zIndex: 30,
              });
              const fbBounds = new window.google.maps.LatLngBounds();
              decodedPath.forEach(p => fbBounds.extend(p));
              mapInstanceRef.current.fitBounds(fbBounds, { top: 40, right: 40, bottom: 40, left: 40 });
            } catch (err) {
              console.warn("Error decodificando directions fallback:", err);
            }
          }
        });
      }
    }
  }, [routeGeometry, alternativeRoutes, mapLoaded, markers, isDarkMode]);

  // Actualizar marcadores (origen verde, destino rojo, etc.) y ajustar vista si no hay polyline
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();
    let hasValidPoints = false;

    markers.forEach(marker => {
      let iconUrl = "";
      if (marker.type === 'origin') {
        iconUrl = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
      } else if (marker.type === 'destination') {
        iconUrl = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
      } else if (marker.type === 'poi' || marker.type === 'nearby') {
        iconUrl = marker.iconUrl || "https://maps.google.com/mapfiles/ms/icons/orange-dot.png";
      }
      
      const pos = { lat: Number(marker.lat), lng: Number(marker.lng) };
      if (!Number.isFinite(pos.lat) || !Number.isFinite(pos.lng)) return;

      bounds.extend(pos);
      hasValidPoints = true;

      const m = new window.google.maps.Marker({
        position: pos,
        map: mapInstanceRef.current,
        title: marker.popup,
        icon: iconUrl || undefined,
        animation: window.google.maps.Animation.DROP
      });
      
      const badgePrefix = marker.type === 'origin' ? '🟢 Origen: ' : marker.type === 'destination' ? '🔴 Destino: ' : '📍 ';
      const ratingHtml = marker.rating ? `<div style="margin-top: 4px; color: #f59e0b; font-size: 11px; font-weight: 700;">⭐ ${marker.rating} / 5</div>` : '';
      const vicinityHtml = marker.vicinity ? `<div style="margin-top: 2px; color: #64748b; font-size: 11px;">${escapeHtml(marker.vicinity)}</div>` : '';

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 6px 8px; font-family: system-ui, sans-serif; font-size: 13px; max-width: 220px;">
          <strong>${badgePrefix}${escapeHtml(marker.popup || '')}</strong>
          ${vicinityHtml}
          ${ratingHtml}
        </div>`
      });
      
      m.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, m);
        if (typeof marker.onClick === 'function') {
          marker.onClick();
        }
      });
      
      markersRef.current.push(m);
    });

    // Si hay marcadores y no hay polyline, encuadrar los puntos en el mapa
    if (!routeGeometry && hasValidPoints && markers.length >= 2) {
      mapInstanceRef.current.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    }
  }, [markers, mapLoaded, routeGeometry]);

  // Centrar en ubicación seleccionada
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation || !mapLoaded) return;
    mapInstanceRef.current.setCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
    mapInstanceRef.current.setZoom(15);
  }, [selectedLocation, mapLoaded]);

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