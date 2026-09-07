import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { LeafIcon, ArrowLeft, MapIcon, BikeIcon, BusIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import MapViewGoogle from "../../../features/auth/components/MapViewGoogle";
import mapsService from "../../../services/mapsService";
import routeService from "../../../services/routeService";
import tripService from "../../../services/tripService";
import poiService from "../../../services/poiService";
import weatherService from "../../../services/weatherService";
import { loadGoogleMapsApi } from "../../../services/googleMapsLoader";

// Coordenadas de Neiva (viewport inicial del mapa)
const NEIVA_LAT = 2.9273;
const NEIVA_LON = -75.2819;

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
        <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium ${
          type === "origin" ? "text-green-600" : "text-red-600"
        }`}>
          {type === "origin" ? "A" : "B"}
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className={`w-full pl-8 pr-8 py-2.5 rounded-lg text-sm border transition-all focus:outline-none ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-800 focus:border-blue-500'
          }`}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && (suggestions.length > 0 || hint) && (
        <div className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {suggestions.map((suggestion, idx) => (
            <button
              key={`${suggestion.placeId}-${idx}`}
              onClick={() => selectPlace(suggestion)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors border-b last:border-b-0 ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300 border-gray-700' : 'hover:bg-gray-50 text-gray-700 border-gray-100'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`mt-0.5 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>📍</span>
                <div className="min-w-0">
                  <div>{renderName(suggestion)}</div>
                  {suggestion.address && (
                    <div className={`text-xs mt-0.5 truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {suggestion.address}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
          {suggestions.length === 0 && hint && (
            <div className={`px-3 py-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
  const [mapsReady, setMapsReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pois, setPois] = useState([]);
  const [showPois, setShowPois] = useState(true);
  const [routeSavedId, setRouteSavedId] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [routeWeather, setRouteWeather] = useState(null);
  const [activeTripId, setActiveTripId] = useState(null);
  const [startingTrip, setStartingTrip] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [tripError, setTripError] = useState(null);
  const location = useLocation();
  const presetPendingRef = useRef(false);

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

  // Cargar puntos de interés activos desde el backend
  useEffect(() => {
    poiService
      .getAll()
      .then((data) => {
        setPois(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error cargando puntos de interés:", err);
        setPois([]);
      });
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

  // Centrar en Neiva
  const centerOnNeiva = () => {
    setMapCenter({ lat: NEIVA_LAT, lng: NEIVA_LON });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Mapa */}
      <div className="absolute inset-0">
        <MapViewGoogle
          height="100vh"
          center={mapCenter}
          zoom={14}
          selectedLocation={origin}
          routeGeometry={route?.geometry}
          showUserLocation={true}
          markers={[
            origin && { lat: origin.lat, lng: origin.lng, popup: `Origen: ${origin.name}`, type: "origin" },
            destination && { lat: destination.lat, lng: destination.lng, popup: `Destino: ${destination.name}`, type: "destination" },
            ...(!showPois ? [] : pois.map((poi) => ({
              lat: poi.lat,
              lng: poi.lng,
              popup: `${poi.name}${poi.address ? ` — ${poi.address}` : ""}`,
              type: "poi",
            }))),
          ].filter(Boolean)}
        />
      </div>

      {/* Panel de control */}
      <div className="absolute top-4 left-4 right-4 md:left-4 md:right-auto md:w-96 z-20">
        <div className={`rounded-xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          
          {/* Encabezado */}
          <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-600 flex items-center justify-center">
                <LeafIcon size={14} white={true} />
              </div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Planificador de rutas
              </span>
              <span className={`text-xs ml-auto ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Neiva
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-4">
            {/* Origen */}
            <div className="space-y-1">
              <label className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Origen
              </label>
              <LocationSearch
                placeholder="Dirección o lugar"
                onSelect={setOrigin}
                isDarkMode={isDarkMode}
                value={origin?.name}
                externalValue={originInputValue}
                type="origin"
              />
            </div>

            {/* Botón intercambiar */}
            <div className="flex justify-center my-2">
              <button
                onClick={swapLocations}
                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                  isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                ↕
              </button>
            </div>

            {/* Destino */}
            <div className="space-y-1">
              <label className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Destino
              </label>
              <LocationSearch
                placeholder="Dirección o lugar"
                onSelect={setDestination}
                isDarkMode={isDarkMode}
                value={destination?.name}
                type="destination"
              />
            </div>

            {/* Mi ubicación */}
            <button
              onClick={setMyLocation}
              className={`w-full mt-3 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-base">📍</span>
              Usar mi ubicación
            </button>

            {/* Modos de transporte */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
              {[
                { id: "walking", label: "Caminar", icon: "🚶" },
                { id: "bike", label: "Bicicleta", icon: "🚲" },
                { id: "car", label: "Carro", icon: "🚗" },
                { id: "public", label: "Transporte", icon: "🚌" }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setTransportMode(mode.id)}
                  className={`py-2 rounded-md text-sm font-medium transition-all ${
                    transportMode === mode.id
                      ? 'bg-emerald-600 text-white'
                      : isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-base">{mode.icon}</span>
                  <span className="ml-1">{mode.label}</span>
                </button>
              ))}
            </div>

            {/* Aviso de disponibilidad según el modo (depende de los datos de Google Maps) */}
            {(transportMode === 'bike' || transportMode === 'public') && (
              <div className={`mt-2 p-2 rounded-md text-xs ${
                isDarkMode ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-50 text-amber-700'
              }`}>
                ⚠️ {transportMode === 'bike'
                  ? 'En Neiva, Google Maps puede no tener rutas de bicicleta disponibles para algunos trayectos. Si no calcula, prueba a pie o en carro.'
                  : 'En Neiva, Google Maps puede no tener rutas de transporte público disponibles. Si no calcula, prueba a pie o en carro.'}
              </div>
            )}

            {/* Botón calcular */}
            <button
              onClick={calculateRoute}
              disabled={!origin?.lat || !destination?.lat || loading}
              className={`w-full mt-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                origin?.lat && destination?.lat && !loading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Calculando...' : 'Calcular ruta'}
            </button>

            {/* Error */}
            {error && (
              <div className="mt-3 p-2 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 text-xs text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tarjeta de resultados */}
      {route && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-20">
          <div className={`rounded-xl shadow-2xl overflow-hidden border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-emerald-50 border-gray-100'}`}>
              <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-emerald-700'}`}>
                ✅ Ruta calculada
              </span>
              <button
                onClick={() => setRoute(null)}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="text-gray-400 text-sm">✕</span>
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  transportMode === 'walking' ? 'bg-green-100 text-green-700' :
                  transportMode === 'bike' ? 'bg-emerald-100 text-emerald-700' :
                  transportMode === 'car' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {transportMode === 'walking' ? 'Caminata' : transportMode === 'bike' ? 'Ciclorruta' : transportMode === 'car' ? 'Automóvil' : 'Transporte público'}
                </span>
                <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {route.distance} km · {route.duration} min
                </span>
              </div>
              <p className={`text-sm mt-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {route.startAddress?.split(',')[0]} → {route.endAddress?.split(',')[0]}
              </p>

              {/* Sostenibilidad */}
              <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                  <LeafIcon size={14} />
                  CO₂ ahorrado: {estimate?.co2SavedKg != null ? `${estimate.co2SavedKg} kg` : "—"}
                </span>
                {estimate?.co2EmissionsKg != null && (
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Emisiones: {estimate.co2EmissionsKg} kg
                  </span>
                )}
                {estimate?.estimatedCalories != null && (
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    🔥 {estimate.estimatedCalories} kcal
                  </span>
                )}
              </div>

              {/* Clima y alertas del trayecto */}
              {routeWeather && (
                <div className={`mt-3 p-3 rounded-lg border ${
                  routeWeather.alerts?.length
                    ? (isDarkMode ? 'bg-amber-900/20 border-amber-500/40' : 'bg-amber-50 border-amber-200')
                    : (isDarkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200')
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      ⛅ Clima del trayecto
                    </span>
                    {(routeWeather.origin || routeWeather.destination) && (
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {routeWeather.origin?.temperatureC != null
                          ? `${Math.round(routeWeather.origin.temperatureC)}°C`
                          : ''}
                        {routeWeather.destination?.temperatureC != null
                          ? ` → ${Math.round(routeWeather.destination.temperatureC)}°C`
                          : ''}
                      </span>
                    )}
                  </div>

                  {(routeWeather.origin || routeWeather.destination) && (
                    <div className={`mt-1.5 text-xs flex flex-wrap gap-x-3 gap-y-0.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {routeWeather.origin?.conditionDescription && (
                        <span>🌤 {routeWeather.origin.conditionDescription}</span>
                      )}
                      {routeWeather.origin?.windKmh != null && (
                        <span>💨 {Math.round(routeWeather.origin.windKmh)} km/h</span>
                      )}
                      {routeWeather.origin?.relativeHumidity != null && (
                        <span>💧 {routeWeather.origin.relativeHumidity}%</span>
                      )}
                      {routeWeather.origin?.precipitationProbability != null && (
                        <span>🌧 {routeWeather.origin.precipitationProbability}% lluvia</span>
                      )}
                    </div>
                  )}

                  {routeWeather.alerts?.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {routeWeather.alerts.map((alert, idx) => (
                        <div key={idx} className={`text-xs rounded-md p-2 ${
                          alert.severity === 'HIGH' || alert.severity === 'EXTREME'
                            ? (isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700')
                            : (isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700')
                        }`}>
                          <span className="font-bold">⚠️ {alert.alertTitle}</span>
                          {alert.description && <p className="mt-0.5">{alert.description}</p>}
                          {alert.instruction && <p className="mt-0.5 italic">{alert.instruction}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {routeWeather.suggestions?.length > 0 && (
                    <div className={`mt-2 text-xs ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      💡 {routeWeather.suggestions.join(' ')}
                    </div>
                  )}
                </div>
              )}

              {/* Acciones */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {activeTripId ? (
                  <>
                    <span className="flex items-center justify-center px-2 py-2.5 rounded-lg text-sm font-bold bg-amber-100 text-amber-700">
                      ✓ Viaje en curso
                    </span>
                    <button
                      onClick={completeTrip}
                      disabled={completing}
                      className={`flex items-center justify-center px-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        completing
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {completing ? 'Completando...' : 'Completar viaje'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={saveRoute}
                      disabled={saving || saved || !!routeSavedId}
                      className={`flex items-center justify-center px-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        saved || routeSavedId
                          ? 'bg-green-100 text-green-700'
                          : saving
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {saved || routeSavedId ? '✓ Guardada' : saving ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={startTrip}
                      disabled={startingTrip}
                      className={`flex items-center justify-center px-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        startingTrip
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {startingTrip ? 'Iniciando...' : '🚀 Iniciar viaje'}
                    </button>
                  </>
                )}
              </div>

              {/* Error de viaje */}
              {tripError && (
                <div className="mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 text-xs text-center">
                  {tripError}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botones flotantes */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setShowPois(!showPois)}
          className="w-9 h-9 rounded-md bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
          title={showPois ? "Ocultar puntos de interés" : "Mostrar puntos de interés"}
        >
          <span className="text-sm">📍</span>
        </button>
        <button
          onClick={centerOnNeiva}
          className="w-9 h-9 rounded-md bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
          title="Centrar en Neiva"
        >
          <span className="text-sm">🏙️</span>
        </button>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-md bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
        >
          <span className="text-sm">{isDarkMode ? "☀️" : "🌙"}</span>
        </button>
      </div>

      {/* Botón volver */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => onNavigate?.("/dashboard")}
          className={`px-3 py-1.5 rounded-md text-sm shadow-md transition-all ${
            isDarkMode ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};

export default PlanRoute;