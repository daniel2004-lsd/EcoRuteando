import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { LeafIcon, ArrowLeft, MapIcon, BikeIcon, BusIcon, SearchIcon, TargetIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import MapViewGoogle from "../../../features/auth/components/MapViewGoogle";
import mapsService from "../../../services/mapsService";
import routeService from "../../../services/routeService";
import tripService from "../../../services/tripService";
import weatherService from "../../../services/weatherService";
import { loadGoogleMapsApi } from "../../../services/googleMapsLoader";

// Coordenadas de Neiva (viewport inicial del mapa)
const NEIVA_LAT = 2.9273;
const NEIVA_LON = -75.2819;

// Orden y etiquetas en español del tipo de mapa de Google
const MAP_TYPE_ORDER = ["roadmap", "satellite", "hybrid", "terrain"];
const MAP_TYPE_LABELS = {
  roadmap: "Mapa",
  satellite: "Satélite",
  hybrid: "Híbrido",
  terrain: "Relieve",
};

// Componente de búsqueda (Autocompletado de Google Places)
const LocationSearch = ({ placeholder, onSelect, isDarkMode, type = "origin", externalValue }) => {
  const [query, setQuery] = useState(externalValue || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hint, setHint] = useState("");
  const debounceRef = useRef(null);
  const skipNextSearchRef = useRef(false);
  const serviceHostRef = useRef(null);
  const placesServiceRef = useRef(null);

  useEffect(() => {
    if (externalValue && externalValue !== query) {
      setQuery(externalValue);
    }
  }, [externalValue]);

  const getPlacesService = () => {
    if (!placesServiceRef.current) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(serviceHostRef.current);
    }
    return placesServiceRef.current;
  };

  const searchPredictions = (text) => {
    if (!text || text.length < 1) {
      setSuggestions([]);
      setHint("");
      return;
    }

    if (!window.google?.maps?.places) {
      setSuggestions([]);
      setHint("Google Maps aún se está cargando…");
      return;
    }

    setIsLoading(true);
    setHint("");

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: text,
        types: ["geocode", "establishment"],
        componentRestrictions: { country: "CO" },
        locationBias: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(NEIVA_LAT - 0.25, NEIVA_LON - 0.25),
          new window.google.maps.LatLng(NEIVA_LAT + 0.25, NEIVA_LON + 0.25)
        ),
      },
      (predictions, status) => {
        setIsLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions?.length) {
          setSuggestions(
            predictions.map((p) => ({
              placeId: p.place_id,
              name: p.structured_formatting?.main_text || p.description,
              address: p.structured_formatting?.secondary_text || "",
              matched: (p.matched_substrings || []).filter((ms) => ms.offset < (p.structured_formatting?.main_text || p.description).length),
            }))
          );
        } else {
          setSuggestions([]);
          setHint(
            status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
              ? "Sin resultados"
              : "No se pudo completar la búsqueda en Google Maps"
          );
        }
      }
    );
  };

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPredictions(query.trim()), 250);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const selectPlace = (suggestion) => {
    setShowDropdown(false);
    setIsLoading(true);
    setHint("");

    getPlacesService().getDetails(
      {
        placeId: suggestion.placeId,
        fields: ["name", "formatted_address", "geometry"],
      },
      (place, status) => {
        setIsLoading(false);
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          const location = place.geometry.location;
          const selected = {
            name: place.name || suggestion.name,
            address: place.formatted_address || suggestion.address,
            lat: location.lat(),
            lng: location.lng(),
            placeId: suggestion.placeId,
          };
          skipNextSearchRef.current = true;
          onSelect(selected);
          setQuery(selected.name);
          setSuggestions([]);
        } else {
          setHint("No se pudo obtener el detalle del lugar seleccionado");
        }
      }
    );
  };

  const renderName = (suggestion) => {
    const main = suggestion.name || "";
    const match = suggestion.matched?.[0];
    if (!match || match.offset >= main.length) {
      return <span className="font-medium text-sm">{main}</span>;
    }
    const prefix = main.slice(0, match.offset);
    const matched = main.slice(match.offset, match.offset + (match.length || 0));
    const suffix = main.slice(match.offset + (match.length || 0));
    return (
      <span className="font-medium text-sm">
        {prefix}
        <strong>{matched}</strong>
        {suffix}
      </span>
    );
  };

  return (
    <div className="relative w-full" ref={serviceHostRef}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className={isDarkMode
            ? "w-full pl-8 pr-4 py-3 rounded-full text-sm bg-[#111C20] border border-[#26383D] text-[#e2e8f0] placeholder:text-[#94a3b8]/60 focus:outline-none focus:ring-2 focus:ring-[#34D399]/30"
            : "w-full pl-8 pr-4 py-3 rounded-full text-sm bg-[#f5f0e8] border-0 text-[#2d2d2d] placeholder:text-[#8b7355]/60 focus:outline-none focus:ring-2 focus:ring-[#1a5c2a]/20"
          }
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && (suggestions.length > 0 || hint) && (
        <div className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto ${
          isDarkMode ? 'bg-[#162329] border border-[#26383D]' : 'bg-white border border-gray-200'
        }`}>
          {suggestions.map((suggestion, idx) => (
            <button
              key={`${suggestion.placeId}-${idx}`}
              onClick={() => selectPlace(suggestion)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors border-b last:border-b-0 ${
                isDarkMode ? 'hover:bg-[#111C20] text-[#e2e8f0] border-[#26383D]' : 'hover:bg-gray-50 text-gray-700 border-gray-100'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`mt-0.5 text-xs ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>📍</span>
                <div className="min-w-0">
                  <div>{renderName(suggestion)}</div>
                  {suggestion.address && (
                    <div className={`text-xs mt-0.5 truncate ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>
                      {suggestion.address}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
          {suggestions.length === 0 && hint && (
            <div className={`px-3 py-2 text-sm ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
              {hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente principal
const PlanRoute = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [transportMode, setTransportMode] = useState("walking");
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [originInputValue, setOriginInputValue] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: NEIVA_LAT, lng: NEIVA_LON });
  const [mapFocus, setMapFocus] = useState(null);
  const [mapsReady, setMapsReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [nearbyPois, setNearbyPois] = useState([]);
  const [nearbyType, setNearbyType] = useState("restaurant");
  const [showNearbySearch, setShowNearbySearch] = useState(false);
  const [mapTypeId, setMapTypeId] = useState("roadmap");
  const [routeSavedId, setRouteSavedId] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [routeWeather, setRouteWeather] = useState(null);
  const [activeTripId, setActiveTripId] = useState(null);
  const [startingTrip, setStartingTrip] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [tripError, setTripError] = useState(null);
  const location = useLocation();
  const presetPendingRef = useRef(false);
  const [actionMessage, setActionMessage] = useState(null);
  const actionTimeoutRef = useRef(null);
  const showActionMessage = (message) => {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    setActionMessage(message);
    actionTimeoutRef.current = setTimeout(() => setActionMessage(null), 2600);
  };

  useEffect(() => {
    return () => {
      if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    };
  }, []);

  // Si se llega desde "Usar ruta" (favoritos), precargar origen/destino y trazar la ruta
  useEffect(() => {
    const fav = location.state?.favoriteRoute;
    if (
      fav &&
      fav.startLat != null &&
      fav.startLng != null &&
      fav.endLat != null &&
      fav.endLng != null
    ) {
      const start = {
        name: fav.routeName || "Origen",
        address: `${fav.startLat}, ${fav.startLng}`,
        lat: fav.startLat,
        lng: fav.startLng,
      };
      const end = {
        name: fav.routeName || "Destino",
        address: `${fav.endLat}, ${fav.endLng}`,
        lat: fav.endLat,
        lng: fav.endLng,
      };
      setOrigin(start);
      setDestination(end);
      setOriginInputValue(start.name);
      setMapCenter({
        lat: (fav.startLat + fav.endLat) / 2,
        lng: (fav.startLng + fav.endLng) / 2,
      });
      // Esta ruta ya está guardada en el backend: reutilizar su id en vez de duplicarla
      if (fav.routeId) {
        setRouteSavedId(fav.routeId);
      }
      presetPendingRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadGoogleMapsApi().then(() => {
      setMapsReady(true);
    }).catch(() => setError("Error cargando Google Maps"));
  }, []);

  // Obtener ubicación actual y resolver su dirección real (barrio/calle)
  const resolveLocationName = async (lat, lng) => {
    try {
      const data = await mapsService.reverseGeocode(lat, lng);
      const address = data?.results?.[0]?.formattedAddress;
      if (address) {
        // Primer segmento de la dirección (calle + número o nombre de lugar)
        const parts = address.split(",");
        return parts[0] || address;
      }
    } catch (err) {
      console.warn("No se pudo resolver la dirección de la ubicación:", err);
    }
    return "Mi ubicación";
  };

  // Función para calcular ruta (usa backend).
  // Acepta puntos opcionales para evitar el problema de closure cuando
  // el origen/destino se acaban de actualizar (p.ej. "Usar mi ubicación").
  const calculateRoute = async (nextOrigin = origin, nextDestination = destination) => {
    if (!nextOrigin) {
      setError("Seleccione un origen");
      return;
    }
    if (!nextDestination) {
      setError("Seleccione un destino");
      return;
    }
    if (!nextOrigin.lat || !nextOrigin.lng) {
      setError("El origen no tiene coordenadas válidas");
      return;
    }
    if (!nextDestination.lat || !nextDestination.lng) {
      setError("El destino no tiene coordenadas válidas");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Calculando ruta via backend...");
      console.log("Origen:", nextOrigin);
      console.log("Destino:", nextDestination);
      console.log("Modo:", transportMode);

      // Mapear modos de transporte
      const modeMap = {
        walking: "walking",
        bike: "bicycling",
        car: "driving",
        public: "transit",
      };

      const result = await mapsService.getDirections(
        nextOrigin.lat,
        nextOrigin.lng,
        nextDestination.lat,
        nextDestination.lng,
        modeMap[transportMode] || "walking"
      );

      console.log("Respuesta del backend:", result);

      if (result && result.encodedPolyline) {
        const distance = (result.distance.valueMeters / 1000).toFixed(1);
        const duration = Math.round(result.duration.valueSeconds / 60);

        console.log("Ruta calculada:", { distance, duration });

        setRoute({
          distance,
          duration,
          geometry: result.encodedPolyline,
          startAddress: nextOrigin.address,
          endAddress: nextDestination.address,
        });

        // Estimar CO₂/calorías con el backend (factores de transporte)
        try {
          const pgModeMap = { walking: "walking", bike: "bike", car: "car", public: "public_transport" };
          const estimateResult = await mapsService.getEstimate(
            nextOrigin.lat,
            nextOrigin.lng,
            nextDestination.lat,
            nextDestination.lng,
            pgModeMap[transportMode] || "walking"
          );
          console.log("Estimación de sostenibilidad:", estimateResult);
          setEstimate(estimateResult);
        } catch (err) {
          console.warn("Estimación de sostenibilidad no disponible:", err);
          setEstimate(null);
        }

        // Alertas climáticas del trayecto (no bloqueantes: si fallan, se omiten)
        try {
          const weather = await weatherService.getRouteWeather(
            nextOrigin.lat,
            nextOrigin.lng,
            nextDestination.lat,
            nextDestination.lng
          );
          setRouteWeather(weather);
        } catch (err) {
          console.warn("Clima no disponible, se omite:", err);
          setRouteWeather(null);
        }
      } else {
        setError("No se encontró una ruta válida");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err?.response?.data?.message || err?.message || "Error calculando la ruta");
    } finally {
      setLoading(false);
    }
  };

  // Guardar ruta en el backend
  const saveRoute = async () => {
    if (!route || !origin || !destination) return null;

    // Si la ruta ya está guardada (p.ej. vino de favoritos), no crear un duplicado
    if (routeSavedId) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      return routeSavedId;
    }

    setSaving(true);
    try {
      const modeMap = {
        walking: "walking",
        bike: "bike",
        car: "car",
        public: "public_transport",
      };

      const savedRoute = await routeService.create({
        name: `${origin.name} → ${destination.name}`,
        description: `Ruta calculada desde ${origin.name} hasta ${destination.name}`,
        transportType: modeMap[transportMode] || "walking",
        startName: origin.name,
        destinationName: destination.name,
        startLat: origin.lat,
        startLng: origin.lng,
        endLat: destination.lat,
        endLng: destination.lng,
        encodedPolyline: route.geometry,
        distanceKm: parseFloat(route.distance),
        estimatedTimeMin: route.duration,
        co2SavedKg: estimate?.co2SavedKg ?? null,
        estimatedCalories: estimate?.estimatedCalories ?? null,
      });

      setRouteSavedId(savedRoute?.id ?? null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      return savedRoute?.id ?? null;
    } catch (err) {
      console.error("Error guardando ruta:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Iniciar viaje: guarda la ruta si falta y crea el trayecto
  const startTrip = async () => {
    if (!route || !origin || !destination) return;

    setStartingTrip(true);
    setTripError(null);
    try {
      let routeId = routeSavedId;
      if (!routeId) {
        routeId = await saveRoute();
      }
      if (!routeId) {
        throw new Error("No se pudo guardar la ruta para iniciar el viaje.");
      }

      const modeMap = {
        walking: "walking",
        bike: "bike",
        car: "car",
        public: "public_transport",
      };

      const started = await tripService.start({
        routeId,
        transportMode: modeMap[transportMode] || "walking",
        source: "web",
      });

      setActiveTripId(started?.id ?? null);
      setTripError(null);
    } catch (err) {
      console.error("Error iniciando viaje:", err);
      setTripError(err?.response?.data?.message || err?.message || "Error iniciando el viaje");
    } finally {
      setStartingTrip(false);
    }
  };

  // Completar viaje: registra las métricas reales y el CO₂ ahorrado
  const completeTrip = async () => {
    if (!activeTripId || !route) return;

    setCompleting(true);
    setTripError(null);
    try {
      await tripService.complete(activeTripId, {
        actualDistanceKm: parseFloat(route.distance),
        actualDurationMin: route.duration,
        actualCo2Kg: estimate?.co2SavedKg ?? null,
      });

      console.log("Viaje completado");
      onNavigate?.("/user/history");
    } catch (err) {
      console.error("Error completando viaje:", err);
      setTripError(err?.response?.data?.message || err?.message || "Error completando el viaje");
    } finally {
      setCompleting(false);
    }
  };

  // Recalcular cuando cambia el modo de transporte
  useEffect(() => {
    if (origin && destination && origin.lat && destination.lat) {
      calculateRoute();
    }
  }, [transportMode]);

  // Trazar automáticamente la ruta precargada desde favoritos (una sola vez)
  useEffect(() => {
    if (presetPendingRef.current && origin?.lat && destination?.lat) {
      presetPendingRef.current = false;
      calculateRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, destination]);

  const swapLocations = () => {
    setOrigin(destination);
    setDestination(origin);
    setOriginInputValue(destination?.name || "");
    setRoute(null);
  };

  // Función para usar mi ubicación como origen.
  // Siempre solicita GPS fresco en el clic (enableHighAccuracy, sin caché)
  // para no usar una posición cacheada/imprecisa del primer useEffect.
  const setMyLocation = async () => {
    if (!navigator.geolocation) {
      setError("Su navegador no soporta geolocalización.");
      return;
    }

    setError("Obteniendo su ubicación…");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: "Mi ubicación",
          address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        };
        const realName = await resolveLocationName(location.lat, location.lng);
        location.name = realName;
        location.address = `${realName} (${location.address})`;
        setOrigin(location);
        setOriginInputValue(realName);
        setMapCenter({ lat: location.lat, lng: location.lng });
        console.log("Usando ubicación como origen:", location);

        if (destination && destination.lat) {
          setTimeout(() => calculateRoute(location, destination), 100);
        }
      },
      (err) => {
        console.error("Error obteniendo ubicación:", err);
        setError("No se pudo obtener su ubicación. Verifique los permisos del GPS.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const loadNearbyPois = async (type) => {
    try {
      const result = await mapsService.getPlacesNearby(mapCenter.lat, mapCenter.lng, type, 2000);
      if (result?.results) setNearbyPois(result.results);
    } catch (err) {
      console.error("Error cargando lugares cercanos:", err);
    }
  };

  const selectNearbyPoi = (poi) => {
    const rawLat = poi.lat ?? poi.geometry?.location?.lat;
    const rawLng = poi.lng ?? poi.geometry?.location?.lng;
    const lat = typeof rawLat === "function" ? rawLat() : Number(rawLat);
    const lng = typeof rawLng === "function" ? rawLng() : Number(rawLng);
    const address = poi.vicinity || poi.address || poi.formatted_address || "";
    const name = poi.name || address;

    if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      setError("No se pudo usar ese lugar como destino");
      return;
    }

    const selected = {
      name,
      address,
      lat,
      lng,
      placeId: poi.placeId || poi.place_id,
    };

    setDestination(selected);
    setMapCenter({ lat, lng });
    setShowNearbySearch(false);

    const hasValidOrigin =
      origin != null &&
      Number.isFinite(Number(origin.lat)) &&
      Number.isFinite(Number(origin.lng));

    if (hasValidOrigin) {
      calculateRoute(origin, selected);
      return;
    }

    if (!navigator.geolocation) {
      setError("Seleccione un origen o permita el acceso a su ubicación para calcular la ruta.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const geoLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: "Mi ubicación",
          address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        };
        const realName = await resolveLocationName(geoLocation.lat, geoLocation.lng);
        geoLocation.name = realName;
        geoLocation.address = `${realName} (${geoLocation.address})`;
        setOrigin(geoLocation);
        setOriginInputValue(realName);
        calculateRoute(geoLocation, selected);
      },
      () => {
        setError("Seleccione un origen o permita el acceso a su ubicación para calcular la ruta.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const centerOnNeiva = () => {
    setMapCenter({ lat: NEIVA_LAT, lng: NEIVA_LON });
  };

  const handleNearbyToggle = () => {
    const opening = !showNearbySearch;
    setShowNearbySearch(opening);
    if (opening) {
      if (nearbyPois.length === 0) loadNearbyPois(nearbyType);
      showActionMessage("Elige un tipo para buscar lugares cercanos");
    } else {
      showActionMessage("Panel de búsqueda cerrado");
    }
  };

  const handleMapTypeCycle = () => {
    const currentIndex = MAP_TYPE_ORDER.indexOf(mapTypeId);
    const next = MAP_TYPE_ORDER[(currentIndex + 1 + MAP_TYPE_ORDER.length) % MAP_TYPE_ORDER.length];
    setMapTypeId(next);
    showActionMessage(`Vista: ${MAP_TYPE_LABELS[next]}`);
  };

  const handleCenterAction = () => {
    if (!navigator.geolocation) {
      showActionMessage("Tu navegador no soporta geolocalización.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude);
        const lng = Number(pos.coords.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          showActionMessage("No se pudo obtener tu ubicación actual.");
          return;
        }
        setMapCenter({ lat, lng });
        setMapFocus({ lat, lng, zoom: 17, at: Date.now() });
        showActionMessage("Vista centrada en tu ubicación");
      },
      (err) => {
        if (typeof window !== "undefined" && window.isSecureContext === false) {
          showActionMessage(
            "Conexión no segura: el acceso por HTTP desde una dirección de red (no localhost) puede bloquear el GPS exacto. Accede por HTTPS o desde localhost para centrar con precisión."
          );
          return;
        }
        if (err?.code === 1) {
          showActionMessage("Permite el acceso a tu ubicación para centrar el mapa.");
        } else {
          showActionMessage("No se pudo obtener tu ubicación actual.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className={`relative h-screen w-full overflow-hidden ${isDarkMode ? "bg-[#0B1215]" : "bg-[#f5f0e8]"}`}>
      <div className="absolute inset-0">
        <MapViewGoogle
          height="100vh"
          center={mapCenter}
          mapFocus={mapFocus}
          zoom={14}
          mapTypeId={mapTypeId}
          selectedLocation={origin}
          routeGeometry={route?.geometry}
          showUserLocation={true}
          onLocationSelect={null}
          markers={[
            origin && { lat: origin.lat, lng: origin.lng, popup: `Origen: ${origin.name}`, type: "origin" },
            destination && { lat: destination.lat, lng: destination.lng, popup: `Destino: ${destination.name}`, type: "destination" },
            ...nearbyPois.map((poi) => ({
              lat: poi.lat, lng: poi.lng,
              popup: `${poi.name}${poi.vicinity ? ` — ${poi.vicinity}` : ""}${poi.rating ? ` ⭐ ${poi.rating}` : ""}`,
              type: "nearby",
            })),
          ].filter(Boolean)}
        />
      </div>

      <div className="absolute top-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${isDarkMode ? "bg-[#064E3B]" : "bg-[#1a5c2a]"}`}>
            <span className="text-white font-black text-lg">e</span>
          </div>
          <div>
            <h1 className={`text-lg font-black leading-tight ${isDarkMode ? "text-[#34D399]" : "text-[#1a5c2a]"}`}>EcoRuteando</h1>
            <p className={`text-[10px] font-medium tracking-wider ${isDarkMode ? "text-[#94a3b8]" : "text-[#8b7355]"}`}>NEIVA · HUILA · COLOMBIA</p>
          </div>
        </div>
        <button onClick={toggleTheme} className={`pointer-events-auto w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-all ${isDarkMode ? "bg-[#162329] border border-[#26383D]" : "bg-white"}`}>
          <span className="text-lg">{isDarkMode ? "☀️" : "🌙"}</span>
        </button>
      </div>

      <div className="absolute top-20 left-4 md:left-6 z-20 w-[calc(100%-2rem)] max-w-[380px] max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className={`rounded-3xl shadow-xl overflow-hidden mb-4 ${isDarkMode ? "bg-[#162329] border border-[#26383D]" : "bg-white"}`}>
          <div className="px-6 pt-6 pb-4">
            <p className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-1 ${isDarkMode ? "text-[#34D399]/80" : "text-[#1a5c2a]/70"}`}>Planificador de rutas</p>
            <h2 className={`text-2xl font-black leading-snug ${isDarkMode ? "text-[#e2e8f0]" : "text-[#2d2d2d]"}`}>
              Recorre la ciudad <em className={`not-italic ${isDarkMode ? "text-[#34D399]" : "text-[#1a5c2a]"}`}>sin dejar huella.</em>
            </h2>
          </div>
          <div className="px-6 pb-6 space-y-4">
            <div>
              <label className={`block text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5 ${isDarkMode ? "text-[#94a3b8]" : "text-[#8b7355]"}`}>Origen</label>
              <LocationSearch placeholder="Dirección o lugar" onSelect={setOrigin} isDarkMode={isDarkMode} value={origin?.name} externalValue={originInputValue} type="origin" />
            </div>
            <div>
              <label className={`block text-[10px] font-bold tracking-[0.15em] uppercase mb-1.5 ${isDarkMode ? "text-[#94a3b8]" : "text-[#8b7355]"}`}>Destino</label>
              <LocationSearch placeholder="Dirección o lugar" onSelect={setDestination} isDarkMode={isDarkMode} value={destination?.name} type="destination" />
            </div>
            <button onClick={setMyLocation} className={`w-full py-2.5 rounded-full border-2 text-xs font-bold flex items-center justify-center gap-2 transition-all ${isDarkMode ? "border-[#26383D] text-[#34D399] hover:bg-[#111C20]" : "border-[#1a5c2a]/20 text-[#1a5c2a] hover:bg-[#1a5c2a]/5"}`}>
              Usar mi ubicación
            </button>
            <div>
              <label className={`block text-[10px] font-bold tracking-[0.15em] uppercase mb-2 ${isDarkMode ? "text-[#94a3b8]" : "text-[#8b7355]"}`}>Modo de transporte</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "walking", icon: "🚶", label: "Caminar" },
                  { id: "bike", icon: "🚲", label: "Bicicleta" },
                  { id: "public", icon: "🚌", label: "Transporte" },
                  { id: "car", icon: "🚗", label: "Carro" }
                ].map((mode) => (
                  <button key={mode.id} onClick={() => setTransportMode(mode.id)}
                    className={`py-3 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
                      transportMode === mode.id
                        ? isDarkMode ? "bg-[#064E3B] text-white shadow-lg" : "bg-[#1a5c2a] text-white shadow-lg shadow-[#1a5c2a]/30"
                        : isDarkMode ? "bg-[#111C20] text-[#94a3b8] border border-[#26383D] hover:bg-[#162329]" : "bg-[#f5f0e8] text-[#8b7355] hover:bg-[#ebe4d5]"
                    }`}>
                    <span className="text-lg">{mode.icon}</span>
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => calculateRoute()} disabled={!origin?.lat || !destination?.lat || loading}
              className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all ${
                origin?.lat && destination?.lat && !loading
                  ? isDarkMode ? "bg-[#064E3B] text-white hover:bg-[#065f46] shadow-lg" : "bg-[#1a5c2a] text-white hover:bg-[#145223] shadow-lg shadow-[#1a5c2a]/30"
                  : isDarkMode ? "bg-[#111C20] text-[#94a3b8]/60 border border-[#26383D] cursor-not-allowed" : "bg-[#e8e0d4] text-[#b8a898] cursor-not-allowed"
              }`}>
              {loading ? "Calculando..." : "Calcular ruta"}
            </button>
            {(transportMode === "bike" || transportMode === "public") && (
              <div className={`p-3 rounded-xl text-xs border ${isDarkMode ? "bg-[#111C20] border-[#26383D] text-[#e2e8f0]" : "bg-amber-50 border-amber-100 text-amber-700"}`}>
                {transportMode === "bike"
                  ? "En Neiva puede no haber rutas de bicicleta. Si no calcula, prueba a pie o en carro."
                  : "En Neiva puede no haber rutas de transporte público. Si no calcula, prueba a pie o en carro."}
              </div>
            )}
            {error && <div className={`p-3 rounded-xl text-xs text-center border ${isDarkMode ? "bg-[#111C20] border-[#26383D] text-red-400" : "bg-red-50 border-red-100 text-red-600"}`}>{error}</div>}
          </div>
        </div>

        {route && (
          <div className={`rounded-3xl shadow-xl overflow-hidden mb-4 ${isDarkMode ? "bg-[#162329] border border-[#26383D]" : "bg-white"}`}>
            <div className="px-6 pt-5 pb-3">
              <p className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-1 ${isDarkMode ? "text-[#34D399]/80" : "text-[#1a5c2a]/70"}`}>Ruta sugerida</p>
              <p className={`text-sm font-bold leading-snug ${isDarkMode ? "text-[#e2e8f0]" : "text-[#2d2d2d]"}`}>
                {route.startAddress?.split(",")[0]} → {route.endAddress?.split(",")[0]}
              </p>
            </div>
            <div className="px-6 pb-5">
              <div className="flex gap-2">
                <div className={`flex-1 rounded-2xl p-3 text-center ${isDarkMode ? "bg-[#111C20] border border-[#26383D]" : "bg-[#f5f0e8]"}`}>
                  <p className={`text-lg font-black ${isDarkMode ? "text-[#e2e8f0]" : "text-[#2d2d2d]"}`}>{route.duration}</p>
                  <p className={`text-[10px] font-bold tracking-wider uppercase ${isDarkMode ? "text-[#94a3b8]" : "text-[#8b7355]"}`}>{transportMode === "car" ? "Carro" : transportMode === "bike" ? "Bici" : transportMode === "public" ? "Bus" : "A pie"}</p>
                </div>
                <div className={`flex-1 rounded-2xl p-3 text-center ${isDarkMode ? "bg-[#111C20] border border-[#26383D]" : "bg-[#f5f0e8]"}`}>
                  <p className={`text-lg font-black ${isDarkMode ? "text-[#e2e8f0]" : "text-[#2d2d2d]"}`}>{route.distance} km</p>
                  <p className={`text-[10px] font-bold tracking-wider uppercase ${isDarkMode ? "text-[#94a3b8]" : "text-[#8b7355]"}`}>Distancia</p>
                </div>
                {estimate?.co2SavedKg != null && (
                  <div className={`flex-1 rounded-2xl p-3 text-center ${isDarkMode ? "bg-[#111C20] border border-[#26383D]" : "bg-[#f5f0e8]"}`}>
                    <p className={`text-lg font-black ${isDarkMode ? "text-[#34D399]" : "text-[#1a5c2a]"}`}>-{estimate.co2SavedKg} kg</p>
                    <p className={`text-[10px] font-bold tracking-wider uppercase ${isDarkMode ? "text-[#94a3b8]" : "text-[#8b7355]"}`}>CO₂ evitado</p>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                {activeTripId ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <span className={`flex items-center justify-center py-2.5 rounded-xl text-xs font-bold ${isDarkMode ? "bg-[#111C20] text-[#34D399] border border-[#26383D]" : "bg-amber-50 text-amber-700"}`}>En curso</span>
                      <button onClick={completeTrip} disabled={completing} className={`py-2.5 rounded-xl text-xs font-bold ${completing ? isDarkMode ? "bg-[#111C20] text-[#94a3b8]/60 border border-[#26383D]" : "bg-[#e8e0d4] text-[#b8a898]" : isDarkMode ? "bg-[#064E3B] text-white hover:bg-[#065f46]" : "bg-[#1a5c2a] text-white hover:bg-[#145223]"}`}>{completing ? "Completando..." : "Completar"}</button>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={saveRoute} disabled={saving || saved || !!routeSavedId} className={`py-2.5 rounded-xl text-xs font-bold ${saved || routeSavedId ? isDarkMode ? "bg-[#111C20] text-[#34D399] border border-[#26383D]" : "bg-green-50 text-green-700" : saving ? isDarkMode ? "bg-[#111C20] text-[#94a3b8]/60 border border-[#26383D]" : "bg-[#e8e0d4] text-[#b8a898]" : isDarkMode ? "bg-[#064E3B] text-white hover:bg-[#065f46]" : "bg-[#1a5c2a] text-white hover:bg-[#145223]"}`}>{saved || routeSavedId ? "Guardada" : saving ? "Guardando..." : "Guardar"}</button>
                    <button onClick={startTrip} disabled={startingTrip} className={`py-2.5 rounded-xl text-xs font-bold ${startingTrip ? isDarkMode ? "bg-[#111C20] text-[#94a3b8]/60 border border-[#26383D]" : "bg-[#e8e0d4] text-[#b8a898]" : isDarkMode ? "bg-[#064E3B] text-white hover:bg-[#065f46]" : "bg-[#1a5c2a] text-white hover:bg-[#145223]"}`}>{startingTrip ? "Iniciando..." : "Iniciar"}</button>
                  </div>
                )}
                {tripError && <p className={`text-center text-xs ${isDarkMode ? "text-red-400" : "text-red-500"}`}>{tripError}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-24 right-4 md:bottom-6 md:right-6 z-20 flex flex-col gap-2">
        <button onClick={handleNearbyToggle} className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#34D399]/40 ${showNearbySearch ? "bg-[#064E3B] text-white border border-[#064E3B]" : isDarkMode ? "bg-[#162329] border border-[#26383D] text-[#e2e8f0] hover:bg-[#111C20]" : "bg-white text-[#2d2d2d] hover:bg-gray-50"}`} title="Buscar lugares" aria-label="Buscar lugares"><SearchIcon size={22} /></button>
        <button onClick={handleMapTypeCycle} className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#34D399]/40 ${isDarkMode ? "bg-[#162329] border border-[#26383D] text-[#e2e8f0] hover:bg-[#111C20]" : "bg-white text-[#2d2d2d] hover:bg-gray-50"}`} title={`Tipo de mapa: ${MAP_TYPE_LABELS[mapTypeId]} — tocar para cambiar`} aria-label={`Tipo de mapa: ${MAP_TYPE_LABELS[mapTypeId]} — tocar para cambiar`}><MapIcon size={22} /></button>
        <button onClick={handleCenterAction} className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#34D399]/40 ${isDarkMode ? "bg-[#162329] border border-[#26383D] text-[#e2e8f0] hover:bg-[#111C20]" : "bg-white text-[#2d2d2d] hover:bg-gray-50"}`} title="Centrar en mi ubicación" aria-label="Centrar en mi ubicación"><TargetIcon size={22} /></button>
        <button onClick={() => onNavigate?.("/dashboard")} className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#34D399]/40 ${isDarkMode ? "bg-[#162329] border border-[#26383D] text-[#e2e8f0] hover:bg-[#111C20]" : "bg-white text-[#1a5c2a] hover:bg-gray-50"}`} title="Volver" aria-label="Volver"><ArrowLeft size={22} /></button>
      </div>

      {actionMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`absolute bottom-6 left-4 md:left-6 z-30 max-w-[calc(100%-6rem)] px-4 py-2.5 rounded-full shadow-lg text-xs font-bold pointer-events-none ${isDarkMode ? "bg-[#162329] border border-[#26383D] text-[#e2e8f0]" : "bg-white border border-black/5 text-[#2d2d2d]"}`}
        >
          {actionMessage}
        </div>
      )}

      {showNearbySearch && (
        <div className="absolute z-20 left-4 right-4 top-[380px] md:top-20 md:left-[400px] md:right-auto">
          <div className={`rounded-2xl shadow-2xl p-4 w-full md:w-72 ${isDarkMode ? "bg-[#162329] border border-[#26383D]" : "bg-white border border-black/5"}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-sm font-bold ${isDarkMode ? "text-[#e2e8f0]" : "text-black"}`}>Buscar cerca</h4>
              <button onClick={() => setShowNearbySearch(false)} className={`text-xs font-bold ${isDarkMode ? "text-[#94a3b8] hover:text-[#e2e8f0]" : "text-black/60 hover:text-black"}`}>Cerrar</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["restaurant", "hotel", "church", "park", "cafe", "bar", "museum"].map((type) => (
                <button key={type} onClick={() => { setNearbyType(type); loadNearbyPois(type); }}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold capitalize ${nearbyType === type ? isDarkMode ? "bg-[#064E3B] text-white" : "bg-[#1a5c2a] text-white" : isDarkMode ? "bg-[#111C20] text-[#e2e8f0] border border-[#26383D] hover:bg-[#162329]" : "bg-[#f5f0e8] text-black hover:bg-[#ebe4d5]"}`}>{type}</button>
              ))}
            </div>
            {nearbyPois.length > 0 && (
              <div className="mt-3 max-h-52 overflow-y-auto space-y-1.5">
                {nearbyPois.slice(0, 10).map((poi, idx) => (
                  <button key={idx} type="button" onClick={() => selectNearbyPoi(poi)} className={`w-full text-left p-2.5 rounded-lg border transition-colors ${isDarkMode ? "bg-[#111C20] border-[#26383D] hover:border-[#34D399]" : "bg-white border-black/10 hover:border-[#1a5c2a]"}`}>
                    <p className={`text-[13px] font-bold leading-snug ${isDarkMode ? "text-[#e2e8f0]" : "text-black"}`}>{poi.name}</p>
                    {poi.vicinity && <p className={`text-[11px] font-medium leading-snug ${isDarkMode ? "text-[#94a3b8]" : "text-black/70"}`}>{poi.vicinity}</p>}
                    <p className={`text-[11px] font-bold mt-0.5 ${isDarkMode ? "text-[#e2e8f0]" : "text-black"}`}>
                      {poi.rating ? `⭐ ${poi.rating} · ` : ""}Tocar para ir
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanRoute;
