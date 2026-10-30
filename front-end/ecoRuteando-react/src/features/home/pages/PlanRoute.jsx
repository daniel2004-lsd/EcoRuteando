import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { LeafIcon, ArrowLeft, SearchIcon, TargetIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import MapViewGoogle from "../../../features/auth/components/MapViewGoogle";
import mapsService from "../../../services/mapsService";
import routeService from "../../../services/routeService";
import tripService from "../../../services/tripService";
import favoriteService from "../../../services/favoriteService";
import { loadGoogleMapsApi } from "../../../services/googleMapsLoader";
import { useAuth } from "../../../app/context/AuthContext";
import toast from "react-hot-toast";
import DownloadApkModal from "../../../shared/components/DownloadApkModal";
import RecommendedDestinations, { RECOMMENDED_DESTINATIONS } from "../components/RecommendedDestinations";
const SparklesIcon = ({ className = "w-4 h-4", size = 16 }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    <path d="M20 3v4"/>
    <path d="M22 5h-4"/>
    <path d="M4 17v2"/>
    <path d="M5 18H3"/>
  </svg>
);

// Coordenadas de Neiva (viewport inicial del mapa)
const NEIVA_LAT = 2.9273;
const NEIVA_LON = -75.2819;

// Normalización segura de coordenadas (funciones de Google LatLng, strings, números)
const parseCoord = (c) => {
  if (c == null) return null;
  if (typeof c === "function") {
    try {
      const val = c();
      const n = Number(val);
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  }
  const n = Number(c);
  return Number.isFinite(n) ? n : null;
};

// Cálculo de distancia en línea recta (Haversine) para estimaciones visuales y modo invitado
const computeHaversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Orden de los tipos de mapa de Google y claves i18n de sus etiquetas
const MAP_TYPE_ORDER = ["roadmap", "satellite", "hybrid", "terrain"];
const MAP_TYPE_LABELS = {
  roadmap: "planRoute.mapType.roadmap",
  satellite: "planRoute.mapType.satellite",
  hybrid: "planRoute.mapType.hybrid",
  terrain: "planRoute.mapType.terrain",
};

// SVG Icons auxiliares estilo Google Maps
const SwapIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12M17 20l4-4M17 20l-4-4" />
  </svg>
);

const NavigationIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
  </svg>
);

const BookmarkIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const HeartIcon = ({ className = "w-4 h-4", filled = false }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const LayersIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

// Componente de búsqueda (Autocompletado de Google Places estilo Google Maps)
const LocationSearch = ({ placeholder, onSelect, onClear, isDarkMode, externalValue }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(externalValue || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hint, setHint] = useState("");
  const debounceRef = useRef(null);
  const skipNextSearchRef = useRef(false);
  const serviceHostRef = useRef(null);
  const placesServiceRef = useRef(null);

  // Sincronizar cuando externalValue cambie durante el renderizado (patrón oficial de React para derivar estado de props)
  const [prevExternalValue, setPrevExternalValue] = useState(externalValue);
  if (externalValue !== prevExternalValue) {
    setPrevExternalValue(externalValue);
    setQuery(externalValue || "");
  }

  const getPlacesService = () => {
    if (!placesServiceRef.current && serviceHostRef.current) {
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
      setHint(t("planRoute.search.mapsLoading"));
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
              ? t("planRoute.search.noResults")
              : t("planRoute.search.failed")
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

    const service = getPlacesService();
    if (!service) {
      setIsLoading(false);
      return;
    }

    service.getDetails(
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
          setHint(t("planRoute.search.detailFailed"));
        }
      }
    );
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setHint("");
    if (onClear) onClear();
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
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 220)}
          className={`w-full py-2 pl-2 pr-7 text-xs sm:text-sm font-medium rounded-lg bg-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!isLoading && query && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
              isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-700/60" : "text-gray-400 hover:text-gray-700 hover:bg-gray-200"
            }`}
            title="Borrar"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && (suggestions.length > 0 || hint) && (
        <div className={`absolute z-50 left-0 right-0 top-full mt-1.5 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto ${
          isDarkMode ? "bg-[#162329] border border-[#26383D]" : "bg-white border border-gray-200"
        }`}>
          {suggestions.map((suggestion, idx) => (
            <button
              key={`${suggestion.placeId}-${idx}`}
              onClick={() => selectPlace(suggestion)}
              className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm transition-colors border-b last:border-b-0 ${
                isDarkMode ? "hover:bg-[#111C20] text-[#e2e8f0] border-[#26383D]" : "hover:bg-gray-50 text-gray-800 border-gray-100"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-xs select-none">📍</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate">{renderName(suggestion)}</div>
                  {suggestion.address && (
                    <div className={`text-[11px] mt-0.5 truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {suggestion.address}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
          {suggestions.length === 0 && hint && (
            <div className={`px-3.5 py-2.5 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const POI_CATEGORIES = [
  { id: "restaurant", label: "Restaurantes", icon: "🍽️", placeType: "restaurant", color: "#ea4335" },
  { id: "lodging", label: "Hoteles", icon: "🏨", placeType: "lodging", color: "#4285f4" },
  { id: "cafe", label: "Cafés", icon: "☕", placeType: "cafe", color: "#a5673f" },
  { id: "park", label: "Parques", icon: "🌳", placeType: "park", color: "#10b981" },
  { id: "pharmacy", label: "Farmacias", icon: "💊", placeType: "pharmacy", color: "#e91e63" },
  { id: "supermarket", label: "Supermercados", icon: "🛒", placeType: "supermarket", color: "#ff6d00" },
  { id: "atm", label: "Cajeros", icon: "🏧", placeType: "atm", color: "#34a853" },
  { id: "tourist_attraction", label: "Sitios de Interés", icon: "🏛️", placeType: "tourist_attraction", color: "#8b5cf6" },
];

// Componente principal
const PlanRoute = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [transportMode, setTransportMode] = useState("walking");
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [originInputValue, setOriginInputValue] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: NEIVA_LAT, lng: NEIVA_LON });
  const [mapFocus, setMapFocus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [favoriting, setFavoriting] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [nearbyPois, setNearbyPois] = useState([]);
  const [nearbyType, setNearbyType] = useState("restaurant");
  const [showNearbySearch, setShowNearbySearch] = useState(false);
  const [activePoiFilter, setActivePoiFilter] = useState(null);
  const [loadingPois, setLoadingPois] = useState(false);
  const [routeAlternatives, setRouteAlternatives] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [mapTypeId, setMapTypeId] = useState("roadmap");
  const [routeSavedId, setRouteSavedId] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [activeTripId, setActiveTripId] = useState(null);
  const [startingTrip, setStartingTrip] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [tripError, setTripError] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [activeTab, setActiveTab] = useState("plan"); // "plan" | "explore"
  const [focusedDestination, setFocusedDestination] = useState(null);
  const [poiError, setPoiError] = useState(null);
  const [routeAuthWarning, setRouteAuthWarning] = useState(false);
  const [routeZeroResultsSuggestion, setRouteZeroResultsSuggestion] = useState(null);

  const handleViewDestinationOnMap = (dest) => {
    setFocusedDestination(dest);
    setMapCenter({ lat: dest.lat, lng: dest.lng });
    setMapFocus({ lat: dest.lat, lng: dest.lng, zoom: 16, at: Date.now() });
    showActionMessage(`📍 Enfocando en el mapa: ${dest.name}`, "info");
  };

  const handleRouteToDestination = (dest) => {
    const destObj = {
      name: dest.name,
      address: dest.location,
      lat: dest.lat,
      lng: dest.lng,
    };
    setDestination(destObj);
    setFocusedDestination(dest);
    setMapCenter({ lat: dest.lat, lng: dest.lng });
    setActiveTab("plan");
    showActionMessage(`Destino fijado: ${dest.name}`, "success");

    const originLat = parseCoord(origin?.lat);
    const originLng = parseCoord(origin?.lng);
    if (originLat != null && originLng != null) {
      calculateRoute(origin, destObj);
    } else {
      showActionMessage("Selecciona tu punto de partida o usa 'Mi ubicación'", "info");
    }
  };
  const location = useLocation();
  const presetPendingRef = useRef(false);
  const [actionMessage, setActionMessage] = useState(null);
  const actionTimeoutRef = useRef(null);

  const showActionMessage = (message, type = "info") => {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    setActionMessage(typeof message === "string" ? { text: message, type } : message);
    actionTimeoutRef.current = setTimeout(() => setActionMessage(null), 3200);
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
      const startName = fav.startName || (fav.routeName?.includes("→") ? fav.routeName.split("→")[0].trim() : null) || t("planRoute.defaultOrigin");
      const destName = fav.destinationName || (fav.routeName?.includes("→") ? fav.routeName.split("→")[1].trim() : null) || t("planRoute.defaultDestination");
      const start = {
        name: startName,
        address: `${fav.startLat}, ${fav.startLng}`,
        lat: fav.startLat,
        lng: fav.startLng,
      };
      const end = {
        name: destName,
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
      if (fav.routeId) {
        setRouteSavedId(fav.routeId);
        setSaved(true);
        setFavorited(true);
      }
      presetPendingRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadGoogleMapsApi().catch(() => setError(t("planRoute.errors.loadMaps")));
    routeService.getUserAddressHistory().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Invertir origen y destino estilo Google Maps
  const handleSwap = () => {
    const prevOrigin = origin;
    const prevDest = destination;
    setOrigin(prevDest);
    setDestination(prevOrigin);
    setOriginInputValue(prevDest?.name || "");
    if (prevDest?.lat && prevOrigin?.lat) {
      calculateRoute(prevDest, prevOrigin);
    }
  };

  // Obtener ubicación actual y resolver su dirección real
  const resolveLocationName = async (lat, lng) => {
    try {
      const data = await mapsService.reverseGeocode(lat, lng);
      const address = data?.results?.[0]?.formattedAddress;
      if (address) {
        const parts = address.split(",");
        return parts[0] || address;
      }
    } catch (err) {
      console.warn("No se pudo resolver la dirección de la ubicación:", err);
    }
    return t("planRoute.myLocation");
  };

  const CAR_EMISSION_FACTOR = 0.169;

  // Registrar automáticamente la consulta y trayecto en el Historial del usuario
  const registerCalculatedTripInHistory = async (calculatedRoute, originPoint, destPoint, mode, co2Val) => {
    if (!isAuthenticated || !calculatedRoute || !originPoint?.lat || !destPoint?.lat) return;
    try {
      const modeMap = {
        walking: "walking",
        car: "car",
      };

      const rawOrigin = originPoint.name || "Origen";
      const rawDest = destPoint.name || "Destino";
      const baseName = `${rawOrigin.substring(0, 50)} → ${rawDest.substring(0, 50)}`;
      const payload = {
        name: `Viaje: ${baseName} (${Date.now()})`.substring(0, 140),
        description: `[trip_transient] ${baseName}`.substring(0, 950),
        transportType: modeMap[mode] || "walking",
        startName: rawOrigin.substring(0, 190),
        destinationName: rawDest.substring(0, 190),
        startLat: originPoint.lat,
        startLng: originPoint.lng,
        endLat: destPoint.lat,
        endLng: destPoint.lng,
        encodedPolyline: calculatedRoute.geometry,
        distanceKm: parseFloat(calculatedRoute.distance),
        estimatedTimeMin: calculatedRoute.duration,
        co2SavedKg: co2Val ?? null,
      };

      const savedRoute = await routeService.create(payload);
      if (savedRoute?.id) {
        const started = await tripService.start({
          routeId: savedRoute.id,
          transportMode: modeMap[mode] || "walking",
          source: "web",
        });

        if (started?.id) {
          const distNum = parseFloat(calculatedRoute.distance);
          const durNum = calculatedRoute.duration;
          const finalCo2 = co2Val != null 
            ? co2Val 
            : (mode === "walking" ? parseFloat((distNum * CAR_EMISSION_FACTOR).toFixed(2)) : 0);

          await tripService.complete(started.id, {
            actualDistanceKm: distNum,
            actualDurationMin: durNum,
            actualCo2Kg: finalCo2,
          });
          showActionMessage("✓ Ruta calculada y registrada en tu Historial de Viajes", "success");
        }
      }
    } catch (histErr) {
      console.warn("No se pudo registrar la consulta en el historial:", histErr);
    }
  };

  // Función para calcular ruta y sus diferentes alternativas de tiempo y CO2
  const calculateRoute = async (nextOrigin = origin, nextDestination = destination) => {
    if (!nextOrigin) {
      setError(t("planRoute.errors.selectOrigin"));
      return;
    }
    if (!nextDestination) {
      setError(t("planRoute.errors.selectDestination"));
      return;
    }

    const originLat = parseCoord(nextOrigin?.lat);
    const originLng = parseCoord(nextOrigin?.lng);
    const destLat = parseCoord(nextDestination?.lat);
    const destLng = parseCoord(nextDestination?.lng);

    if (originLat == null || originLng == null) {
      setError(t("planRoute.errors.originInvalidCoords"));
      return;
    }
    if (destLat == null || destLng == null) {
      setError(t("planRoute.errors.destinationInvalidCoords"));
      return;
    }

    setLoading(true);
    setError(null);
    setRouteAuthWarning(false);
    setRouteZeroResultsSuggestion(null);

    try {
      const modeMap = {
        walking: "walking",
        car: "driving",
      };

      const result = await mapsService.getDirections(
        originLat,
        originLng,
        destLat,
        destLng,
        modeMap[transportMode] || "walking"
      );

      if (result && result.encodedPolyline) {
        const baseDistance = (result.distance.valueMeters / 1000).toFixed(1);
        const baseDuration = Math.round(result.duration.valueSeconds / 60);

        const isCurrentCar = transportMode === "car";
        const primaryCo2Saved = isCurrentCar ? 0 : parseFloat((Number(baseDistance) * CAR_EMISSION_FACTOR).toFixed(2));
        const primaryCo2Emitted = isCurrentCar ? parseFloat((Number(baseDistance) * CAR_EMISSION_FACTOR).toFixed(2)) : 0;

        const options = [];
        // 1. Opción principal seleccionada
        options.push({
          index: 0,
          label: result.summary ? `Por ${result.summary}` : (isCurrentCar ? "Ruta principal en auto" : "Ruta recomendada a pie"),
          mode: transportMode,
          distance: baseDistance,
          duration: baseDuration,
          geometry: result.encodedPolyline,
          co2SavedKg: primaryCo2Saved,
          co2EmittedKg: primaryCo2Emitted,
          tag: isCurrentCar ? "Principal" : "Ecológica 🌱",
        });

        // 2. Rutas alternativas de Google Directions en el mismo medio de transporte
        if (Array.isArray(result.alternatives) && result.alternatives.length > 0) {
          result.alternatives.forEach((alt, idx) => {
            const altDist = (alt.distance.valueMeters / 1000).toFixed(1);
            const altDur = Math.round(alt.duration.valueSeconds / 60);
            options.push({
              index: options.length,
              label: alt.summary ? `Por ${alt.summary}` : `Alternativa ${idx + 1}`,
              mode: transportMode,
              distance: altDist,
              duration: altDur,
              geometry: alt.encodedPolyline,
              co2SavedKg: isCurrentCar ? 0 : parseFloat((Number(altDist) * CAR_EMISSION_FACTOR).toFixed(2)),
              co2EmittedKg: isCurrentCar ? parseFloat((Number(altDist) * CAR_EMISSION_FACTOR).toFixed(2)) : 0,
              tag: `Alternativa ${idx + 1}`,
            });
          });
        }

        // 3. Opción comparativa multimodal (a pie vs automóvil) para evidenciar tiempo y ahorro de CO2
        try {
          const compMode = isCurrentCar ? "walking" : "driving";
          const compResult = await mapsService.getDirections(
            nextOrigin.lat,
            nextOrigin.lng,
            nextDestination.lat,
            nextDestination.lng,
            compMode
          );
          if (compResult && compResult.encodedPolyline) {
            const compDist = (compResult.distance.valueMeters / 1000).toFixed(1);
            const compDur = Math.round(compResult.duration.valueSeconds / 60);
            const compSaved = isCurrentCar ? parseFloat((Number(compDist) * CAR_EMISSION_FACTOR).toFixed(2)) : 0;
            const compEmitted = isCurrentCar ? 0 : parseFloat((Number(compDist) * CAR_EMISSION_FACTOR).toFixed(2));
            options.push({
              index: options.length,
              label: isCurrentCar ? "Alternativa Ecológica A Pie 🚶" : "Alternativa Rápida en Automóvil 🚗",
              mode: isCurrentCar ? "walking" : "car",
              distance: compDist,
              duration: compDur,
              geometry: compResult.encodedPolyline,
              co2SavedKg: compSaved,
              co2EmittedKg: compEmitted,
              tag: isCurrentCar ? `🌱 Ahorras ${compSaved} kg CO₂` : `⚡ Ahorras tiempo (+${compEmitted} kg CO₂)`,
              isComparative: true,
            });
          }
        } catch (compErr) {
          console.warn("No se pudo obtener la ruta multimodal alternativa:", compErr);
        }

        setRouteAlternatives(options);
        setSelectedRouteIndex(0);

        const currentRouteData = {
          distance: baseDistance,
          duration: baseDuration,
          geometry: result.encodedPolyline,
          startAddress: nextOrigin.address,
          endAddress: nextDestination.address,
        };
        setRoute(currentRouteData);

        if (!presetPendingRef.current) {
          setRouteSavedId(null);
          setSaved(false);
          setFavorited(false);
        }

        // Estimar CO₂/calorías con el backend
        try {
          const pgModeMap = { walking: "walking", car: "car" };
          const estimateResult = await mapsService.getEstimate(
            nextOrigin.lat,
            nextOrigin.lng,
            nextDestination.lat,
            nextDestination.lng,
            pgModeMap[transportMode] || "walking"
          );
          setEstimate(estimateResult);
        } catch (err) {
          console.warn("Estimación de sostenibilidad no disponible:", err);
          setEstimate({
            co2SavedKg: primaryCo2Saved,
            estimatedCalories: transportMode === "walking" ? Math.round(Number(baseDistance) * 65) : 0,
          });
        }

        // Registrar inmediatamente en el historial si el usuario está autenticado
        if (isAuthenticated) {
          registerCalculatedTripInHistory(
            currentRouteData,
            nextOrigin,
            nextDestination,
            transportMode,
            primaryCo2Saved
          );
        }

      } else {
        setError(t("planRoute.errors.noValidRoute"));
      }
    } catch (err) {
      console.error("Error calculando ruta:", err);
      const status = err?.response?.status;
      const backendMessage = err?.response?.data?.message;

      if (status === 401) {
        // Fallback si una solicitud privada de respaldo requiere sesión
        setRouteAuthWarning(true);
        const distKm = computeHaversineDistanceKm(originLat, originLng, destLat, destLng);
        const estMin = transportMode === "car" ? Math.max(3, Math.round(distKm / 0.4)) : Math.max(5, Math.round(distKm / 0.08));
        setRoute({
          distance: distKm.toFixed(1),
          duration: estMin,
          geometry: null,
          startAddress: nextOrigin?.name || nextOrigin?.address || t("planRoute.defaultOrigin"),
          endAddress: nextDestination?.name || nextDestination?.address || t("planRoute.defaultDestination"),
          isDirectEstimate: true,
        });
        setError(null);
      } else if (status === 400 && backendMessage) {
        setError(backendMessage);
      } else if (status === 404 && backendMessage) {
        setError(backendMessage);
        if (transportMode === "walking" && backendMessage.toLowerCase().includes("automóvil")) {
          setRouteZeroResultsSuggestion("car");
        } else if (transportMode === "car" && backendMessage.toLowerCase().includes("pie")) {
          setRouteZeroResultsSuggestion("walking");
        }
      } else if (status === 429) {
        const retryAfter = err?.response?.headers?.["retry-after"];
        const waitMsg = retryAfter ? ` Por favor espera ${retryAfter} segundos.` : " Por favor espera un momento antes de intentar de nuevo.";
        setError(`Has alcanzado el límite de solicitudes de cálculo de ruta.${waitMsg}`);
      } else if (status === 502 || status === 503) {
        setError("El servicio de cálculo de rutas de Google Maps no está disponible temporalmente (Error 502/503 del proveedor). Por favor intenta de nuevo en unos momentos.");
      } else if (status === 500) {
        setError("Ocurrió un error interno en el servidor al calcular la ruta. Por favor intenta de nuevo más tarde.");
      } else if (err?.code === "ECONNABORTED" || err?.message?.includes("timeout")) {
        setError("La solicitud de ruta excedió el tiempo de espera. Por favor verifica tu conexión e intenta de nuevo.");
      } else {
        setError(backendMessage || err?.message || t("planRoute.errors.calculateRoute"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRouteOption = (index) => {
    const selected = routeAlternatives[index];
    if (!selected) return;
    setSelectedRouteIndex(index);
    const newRoute = {
      distance: selected.distance,
      duration: selected.duration,
      geometry: selected.geometry,
      startAddress: origin?.address,
      endAddress: destination?.address,
    };
    setRoute(newRoute);
    setEstimate({
      co2SavedKg: selected.co2SavedKg,
      estimatedCalories: selected.mode === "walking" ? Math.round(Number(selected.distance) * 65) : 0,
    });
    if (selected.mode !== transportMode) {
      setTransportMode(selected.mode);
    }

    if (isAuthenticated) {
      registerCalculatedTripInHistory(
        newRoute,
        origin,
        destination,
        selected.mode,
        selected.co2SavedKg
      );
    }
  };

  // Guardar ruta en el backend (isTransient = true cuando solo se usa para registrar el viaje en Historial)
  const saveRoute = async (isTransient = false) => {
    if (!route || !origin || !destination) return null;

    if (!isTransient && routeSavedId) {
      const msg = t("planRoute.errors.alreadySaved", "Esta ruta ya se encuentra guardada en Mis Rutas.");
      showActionMessage(msg, "error");
      toast.error(msg);
      return routeSavedId;
    }

    if (!isTransient) {
      setSaving(true);
    }
    try {
      const modeMap = {
        walking: "walking",
        car: "car",
      };

      const rawOrigin = origin.name || "Origen";
      const rawDest = destination.name || "Destino";
      const baseName = `${rawOrigin.substring(0, 50)} → ${rawDest.substring(0, 50)}`;
      const payload = {
        name: (isTransient ? `Viaje: ${baseName} (${Date.now()})` : baseName).substring(0, 140),
        description: (isTransient
          ? `[trip_transient] ${baseName}`
          : t("planRoute.saveDescription", { from: rawOrigin, to: rawDest })).substring(0, 950),
        transportType: modeMap[transportMode] || "walking",
        startName: rawOrigin.substring(0, 190),
        destinationName: rawDest.substring(0, 190),
        startLat: origin.lat,
        startLng: origin.lng,
        endLat: destination.lat,
        endLng: destination.lng,
        encodedPolyline: route.geometry,
        distanceKm: parseFloat(route.distance),
        estimatedTimeMin: route.duration,
        co2SavedKg: estimate?.co2SavedKg ?? null,
        estimatedCalories: estimate?.estimatedCalories ?? null,
      };

      let savedRoute;
      try {
        savedRoute = await routeService.create(payload);
      } catch (err) {
        const errorMsg = err?.response?.data?.message || err?.message || "";
        if (!isTransient && (errorMsg.includes("Ya existe") || errorMsg.includes("duplicate"))) {
          const msg = t("planRoute.errors.alreadySaved", "Esta ruta ya se encuentra guardada en Mis Rutas.");
          showActionMessage(msg, "error");
          toast.error(msg);
          throw err;
        } else {
          throw err;
        }
      }

      if (!isTransient) {
        setRouteSavedId(savedRoute?.id ?? null);
        setSaved(true);
        const okMsg = t("planRoute.savedInMyRoutes", "Ruta guardada en Mis Rutas");
        showActionMessage(okMsg, "success");
        toast.success(okMsg);
      }
      return savedRoute?.id ?? null;
    } catch (err) {
      console.error("Error guardando ruta:", err);
      if (!isTransient) {
        const errMsg = err?.response?.data?.message || err?.message || t("planRoute.errors.saveFailed", "Error al guardar la ruta");
        showActionMessage(errMsg, "error");
        toast.error(errMsg);
      }
      throw err;
    } finally {
      if (!isTransient) {
        setSaving(false);
      }
    }
  };

  // Añadir a Favoritos
  const saveFavorite = async () => {
    if (!route || !origin || !destination) return;
    if (favorited) {
      const msg = t("planRoute.errors.alreadyFavorite", "Esta ruta ya se encuentra en tus Favoritos.");
      showActionMessage(msg, "error");
      toast.error(msg);
      return;
    }

    setFavoriting(true);
    try {
      let routeId = routeSavedId;
      if (!routeId) {
        routeId = await saveRoute(false);
      }
      if (!routeId) {
        throw new Error("No se pudo obtener el ID de la ruta");
      }

      await favoriteService.add(routeId, `${origin.name} → ${destination.name}`);
      setFavorited(true);
      const favOk = t("planRoute.favoriteAdded", "❤️ ¡Ruta añadida a Favoritos!");
      showActionMessage(favOk, "success");
      toast.success(favOk);
    } catch (err) {
      console.error("Error al añadir a favoritos:", err);
      const msg = err?.response?.data?.message || err?.message || "No se pudo añadir a favoritos";
      if (typeof msg === "string" && (msg.toLowerCase().includes("favorit") || msg.toLowerCase().includes("ya existe"))) {
        setFavorited(true);
        const dupMsg = t("planRoute.errors.alreadyFavorite", "Esta ruta ya se encuentra en tus Favoritos.");
        showActionMessage(dupMsg, "error");
        toast.error(dupMsg);
      } else {
        showActionMessage(msg, "error");
        toast.error(msg);
      }
    } finally {
      setFavoriting(false);
    }
  };

  // Clicks explícitos para mostrar error al presionar por segunda vez
  const handleSaveClick = async () => {
    if (!isAuthenticated) {
      toast.error(t("planRoute.loginRequiredToSave", "Inicia sesión para guardar tus rutas personalizadas."));
      return;
    }
    if (saved || routeSavedId) {
      const msg = t("planRoute.errors.alreadySaved", "Esta ruta ya se encuentra guardada en Mis Rutas.");
      showActionMessage(msg, "error");
      toast.error(msg);
      return;
    }
    await saveRoute(false);
  };

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      toast.error(t("planRoute.loginRequiredToFavorite", "Inicia sesión para añadir rutas a tus favoritos."));
      return;
    }
    if (favorited) {
      const msg = t("planRoute.errors.alreadyFavorite", "Esta ruta ya se encuentra en tus Favoritos.");
      showActionMessage(msg, "error");
      toast.error(msg);
      return;
    }
    await saveFavorite();
  };

  // Iniciar viaje
  const startTrip = async () => {
    if (!route || !origin || !destination) return;
    if (!isAuthenticated) {
      toast.error(t("planRoute.loginRequiredToTrip", "Inicia sesión para iniciar y registrar un trayecto en tiempo real."));
      return;
    }

    setStartingTrip(true);
    setTripError(null);
    try {
      let routeId = routeSavedId;
      if (!routeId) {
        // Guarda como ruta transitoria: se graba en el historial pero NO aparece en "Mis Rutas"
        routeId = await saveRoute(true);
      }
      if (!routeId) {
        throw new Error(t("planRoute.errors.saveForTrip"));
      }

      const modeMap = {
        walking: "walking",
        car: "car",
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
      setTripError(err?.response?.data?.message || err?.message || t("planRoute.errors.startTrip"));
    } finally {
      setStartingTrip(false);
    }
  };

  // Completar viaje
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

      setActiveTripId(null);
      onNavigate?.("/user/history");
    } catch (err) {
      console.error("Error completando viaje:", err);
      const msg = err?.response?.data?.message || err?.response?.data?.detail || err?.message || "";
      if (msg.includes("ya fue finalizado") || err?.response?.status === 400) {
        setActiveTripId(null);
        onNavigate?.("/user/history");
        return;
      }
      setTripError(msg || t("planRoute.errors.completeTrip"));
    } finally {
      setCompleting(false);
    }
  };

  // Recalcular cuando cambia el modo de transporte
  useEffect(() => {
    if (origin && destination && origin.lat && destination.lat) {
      calculateRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transportMode]);

  // Trazar automáticamente la ruta precargada desde favoritos
  useEffect(() => {
    if (presetPendingRef.current && origin?.lat && destination?.lat) {
      presetPendingRef.current = false;
      calculateRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, destination]);

  // Usar ubicación actual
  const setMyLocation = async () => {
    if (!navigator.geolocation) {
      setError(t("planRoute.errors.geoUnsupported"));
      return;
    }

    setError(t("planRoute.errors.gettingLocation"));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: t("planRoute.myLocation"),
          address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        };

        const realName = await resolveLocationName(location.lat, location.lng);
        location.name = realName;
        location.address = `${realName} (${location.address})`;
        setOrigin(location);
        setOriginInputValue(realName);
        setMapCenter({ lat: location.lat, lng: location.lng });
        setError(null);

        if (destination && destination.lat) {
          setTimeout(() => calculateRoute(location, destination), 100);
        }
      },
      (err) => {
        console.error("Error obteniendo ubicación:", err);
        setError(t("planRoute.errors.locationFailed"));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleTogglePoiCategory = async (cat) => {
    // Si se presiona la misma categoría, la deseleccionamos sin afectar la barra
    if (activePoiFilter?.id === cat.id) {
      setActivePoiFilter(null);
      setNearbyPois([]);
      setPoiError(null);
      return;
    }

    setActivePoiFilter(cat);
    setLoadingPois(true);
    setPoiError(null);

    try {
      const centerLat = parseCoord(destination?.lat) || parseCoord(origin?.lat) || parseCoord(mapCenter.lat) || NEIVA_LAT;
      const centerLng = parseCoord(destination?.lng) || parseCoord(origin?.lng) || parseCoord(mapCenter.lng) || NEIVA_LON;

      const res = await mapsService.getPlacesNearby(centerLat, centerLng, cat.placeType, 2500);
      const list = res?.results || [];
      setNearbyPois(list);
      if (list.length === 0) {
        setPoiError(`No se encontraron ${cat.label.toLowerCase()} en un radio de 2.5 km.`);
      } else {
        showActionMessage(`Encontrados ${list.length} ${cat.label.toLowerCase()} en el mapa`, "success");
      }
    } catch (err) {
      console.error("Error buscando lugares de categoría:", err);
      setNearbyPois([]);
      setPoiError(`No se pudieron cargar ${cat.label.toLowerCase()} (servicio temporalmente no disponible).`);
      showActionMessage(`No se pudieron cargar ${cat.label.toLowerCase()}`, "error");
    } finally {
      setLoadingPois(false);
    }
  };

  const loadNearbyPois = async (type) => {
    try {
      const result = await mapsService.getPlacesNearby(mapCenter.lat, mapCenter.lng, type, 2500);
      if (result?.results) setNearbyPois(result.results);
    } catch (err) {
      console.error("Error cargando lugares cercanos:", err);
    }
  };

  const selectNearbyPoi = (poi) => {
    const lat = parseCoord(poi.lat ?? poi.geometry?.location?.lat);
    const lng = parseCoord(poi.lng ?? poi.geometry?.location?.lng);
    const address = poi.vicinity || poi.address || poi.formatted_address || "";
    const name = poi.name || address;

    if (!name || lat == null || lng == null) {
      setError(t("planRoute.errors.placeAsDestination"));
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
    setMapFocus({ lat, lng, zoom: 16, at: Date.now() });
    // NO ocultamos el panel ni destruimos categorías: deben permanecer visibles
    showActionMessage(`✓ Destino: ${name}`, "success");

    const originLat = parseCoord(origin?.lat);
    const originLng = parseCoord(origin?.lng);
    const hasValidOrigin = originLat != null && originLng != null;

    if (hasValidOrigin) {
      calculateRoute(origin, selected);
      return;
    }

    if (!navigator.geolocation) {
      showActionMessage("Selecciona tu punto de origen o escribe una dirección", "info");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const geoLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: t("planRoute.myLocation"),
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
        showActionMessage("Selecciona tu punto de origen para calcular la ruta", "info");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleNearbyToggle = () => {
    const opening = !showNearbySearch;
    setShowNearbySearch(opening);
    if (opening) {
      if (nearbyPois.length === 0) loadNearbyPois(nearbyType);
      showActionMessage(t("planRoute.action.chooseType"));
    } else {
      showActionMessage(t("planRoute.action.searchPanelClosed"));
    }
  };

  const handleMapTypeCycle = () => {
    const currentIndex = MAP_TYPE_ORDER.indexOf(mapTypeId);
    const next = MAP_TYPE_ORDER[(currentIndex + 1 + MAP_TYPE_ORDER.length) % MAP_TYPE_ORDER.length];
    setMapTypeId(next);
    showActionMessage(t("planRoute.mapView", { view: t(MAP_TYPE_LABELS[next]) }));
  };

  const handleCenterAction = () => {
    if (!navigator.geolocation) {
      showActionMessage(t("planRoute.action.geoUnsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude);
        const lng = Number(pos.coords.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          showActionMessage(t("planRoute.action.locationUnavailable"));
          return;
        }
        setMapCenter({ lat, lng });
        setMapFocus({ lat, lng, zoom: 17, at: Date.now() });
        showActionMessage(t("planRoute.action.centeredOnLocation"));
      },
      (err) => {
        if (typeof window !== "undefined" && window.isSecureContext === false) {
          showActionMessage(t("planRoute.action.insecureConnection"));
          return;
        }
        if (err?.code === 1) {
          showActionMessage(t("planRoute.action.allowLocation"));
        } else {
          showActionMessage(t("planRoute.action.locationUnavailable"));
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className={`relative h-screen w-full overflow-hidden select-none ${isDarkMode ? "bg-[#0B1215]" : "bg-[#f5f0e8]"}`}>
      {/* MAPA FULLSCREEN */}
      <div className="absolute inset-0">
        <MapViewGoogle
          height="100vh"
          center={mapCenter}
          mapFocus={mapFocus}
          zoom={14}
          mapTypeId={mapTypeId}
          selectedLocation={origin}
          routeGeometry={route?.geometry}
          alternativeRoutes={routeAlternatives.map((alt, idx) => ({
            geometry: alt.geometry,
            index: idx,
            isSelected: idx === selectedRouteIndex,
          }))}
          onSelectAlternative={handleSelectRouteOption}
          showUserLocation={true}
          onLocationSelect={null}
          markers={[
            origin && {
              lat: parseCoord(origin.lat),
              lng: parseCoord(origin.lng),
              popup: t("planRoute.popupOrigin", { name: origin.name }),
              type: "origin",
            },
            destination && {
              lat: parseCoord(destination.lat),
              lng: parseCoord(destination.lng),
              popup: t("planRoute.popupDestination", { name: destination.name }),
              type: "destination",
            },
            focusedDestination && {
              lat: parseCoord(focusedDestination.lat),
              lng: parseCoord(focusedDestination.lng),
              popup: `${focusedDestination.name} (${focusedDestination.category})`,
              vicinity: focusedDestination.location,
              type: "destination",
            },
            ...nearbyPois.map((poi) => ({
              lat: parseCoord(poi.lat ?? poi.geometry?.location?.lat),
              lng: parseCoord(poi.lng ?? poi.geometry?.location?.lng),
              popup: poi.name,
              vicinity: poi.vicinity || poi.address || "",
              rating: poi.rating,
              type: "nearby",
              onClick: () => selectNearbyPoi(poi),
            })),
          ].filter((m) => m && Number.isFinite(m.lat) && Number.isFinite(m.lng))}
        />
      </div>

      {/* TARJETA FLOTANTE ESTILO GOOGLE MAPS */}
      <div className="absolute top-4 left-4 z-30 w-[calc(100%-2rem)] max-w-[420px] max-h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar pointer-events-auto">
        <div className={`rounded-2xl shadow-2xl overflow-hidden transition-all border backdrop-blur-md ${
          isDarkMode
            ? "bg-[#162329]/95 border-[#26383D] text-[#e2e8f0]"
            : "bg-white/95 border-gray-200/80 text-gray-900"
        }`}>
          {/* HEADER CON BOTÓN VOLVER, TÍTULO Y THEME */}
          <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between border-b border-inherit/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => onNavigate?.(isAuthenticated ? "/dashboard" : "/")}
                className={`p-2 rounded-xl transition-all ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-[#111C20]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                title={t("planRoute.back")}
                aria-label={t("planRoute.back")}
              >
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0">
                <p className={`text-[10px] font-black tracking-wider uppercase leading-none mb-0.5 ${
                  isDarkMode ? "text-emerald-400" : "text-[#1a5c2a]"
                }`}>
                  {t("planRoute.plannerTitle")}
                </p>
                <h1 className="text-sm sm:text-base font-extrabold truncate">
                  {t("planRoute.heroLead")}{" "}
                  <span className={isDarkMode ? "text-emerald-400 font-black" : "text-[#1a5c2a] font-black"}>
                    {t("planRoute.heroHighlight")}
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowDownloadModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
                title="Descargar App Móvil (.apk)"
              >
                <span>📱</span>
                <span className="hidden sm:inline">Descargar</span> App
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2 rounded-xl text-sm transition-all ${
                  isDarkMode ? "hover:bg-[#111C20]" : "hover:bg-gray-100"
                }`}
                title="Cambiar tema"
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>

          {/* BARRA DE PESTAÑAS: PLANEAR RUTA vs LUGARES RECOMENDADOS */}
          <div className="flex border-b border-inherit/10 px-3 pt-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("plan")}
              className={`flex-1 pb-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === "plan"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold"
                  : isDarkMode
                    ? "border-transparent text-gray-400 hover:text-gray-200"
                    : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <NavigationIcon className="w-3.5 h-3.5" />
              <span>Planear ruta</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("explore")}
              className={`flex-1 pb-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === "explore"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold"
                  : isDarkMode
                    ? "border-transparent text-gray-400 hover:text-gray-200"
                    : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <SparklesIcon size={14} className="text-amber-500" />
              <span>Lugares recomendados</span>
            </button>
          </div>

          {activeTab === "explore" ? (
            <div className="p-3.5">
              <RecommendedDestinations
                onSelectDestination={handleRouteToDestination}
                onViewOnMap={handleViewDestinationOnMap}
                isDarkMode={isDarkMode}
                activeDestinationId={focusedDestination?.id}
              />
            </div>
          ) : (
            <div className="p-3.5 space-y-3">
            {/* SELECTOR DE MODO DE TRANSPORTE ESTILO GOOGLE MAPS */}
            <div className={`flex items-center justify-between gap-1 p-1 rounded-xl ${
              isDarkMode ? "bg-[#111C20]/90 border border-[#26383D]" : "bg-gray-100/90"
            }`}>
              {[
                { id: "walking", icon: "🚶", label: t("planRoute.modeWalking") },
                { id: "car", icon: "🚗", label: t("planRoute.modeCar") },
              ].map((mode) => {
                const isActive = transportMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTransportMode(mode.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? isDarkMode
                          ? "bg-emerald-600 text-white shadow-md font-bold"
                          : "bg-white text-emerald-800 shadow-sm font-bold border border-emerald-100"
                        : isDarkMode
                          ? "text-gray-400 hover:text-gray-200 hover:bg-[#162329]"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                    }`}
                  >
                    <span className="text-base sm:text-lg">{mode.icon}</span>
                    <span className="text-xs font-bold">{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* CAJA DE ENTRADA ORIGEN / DESTINO CON CONECTOR Y BOTÓN SWAP (GOOGLE MAPS STYLE) */}
            <div className={`relative rounded-xl border p-2.5 transition-all ${
              isDarkMode
                ? "bg-[#111C20] border-[#26383D] focus-within:border-emerald-500/50"
                : "bg-white border-gray-200 focus-within:border-emerald-600/50 shadow-sm"
            }`}>
              <div className="flex items-center gap-2">
                {/* Indicadores visuales de punto de partida (círculo verde) y llegada (punto rojo) con conector punteado */}
                <div className="flex flex-col items-center justify-between self-stretch py-2 select-none">
                  <span className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-white dark:bg-[#111C20] shrink-0" title="Origen" />
                  <div className="w-0.5 flex-1 my-1 border-l-2 border-dotted border-gray-300 dark:border-gray-600" />
                  <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" title="Destino" />
                </div>

                {/* Campos de texto de búsqueda de Google Places */}
                <div className="flex-1 min-w-0 space-y-1">
                  <LocationSearch
                    placeholder={t("planRoute.origin")}
                    onSelect={(loc) => {
                      setOrigin(loc);
                      setOriginInputValue(loc.name);
                      if (destination?.lat) calculateRoute(loc, destination);
                    }}
                    onClear={() => { setOrigin(null); setOriginInputValue(""); setRoute(null); }}
                    isDarkMode={isDarkMode}
                    externalValue={origin?.name || originInputValue}
                  />
                  <div className={`h-px w-full ${isDarkMode ? "bg-[#26383D]" : "bg-gray-100"}`} />
                  <LocationSearch
                    placeholder={t("planRoute.destination")}
                    onSelect={(loc) => {
                      setDestination(loc);
                      if (origin?.lat) calculateRoute(origin, loc);
                    }}
                    onClear={() => { setDestination(null); setRoute(null); }}
                    isDarkMode={isDarkMode}
                    externalValue={destination?.name}
                  />
                </div>

                {/* Botón de invertir origen y destino (Swap) */}
                <div className="shrink-0 pl-1">
                  <button
                    type="button"
                    onClick={handleSwap}
                    title="Invertir origen y destino"
                    className={`p-2 rounded-full transition-transform active:scale-90 hover:rotate-180 duration-300 ${
                      isDarkMode
                        ? "text-gray-300 hover:bg-[#162329] hover:text-emerald-400"
                        : "text-gray-600 hover:bg-gray-100 hover:text-emerald-700"
                    }`}
                  >
                    <SwapIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* BARRA DE CHIPS DE LUGARES DE INTERÉS (PUNTOS DE INTERÉS ESTILO GOOGLE MAPS & MÓVIL) */}
            <div className="pt-0.5">
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className={`text-[10px] font-extrabold tracking-wider uppercase ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Explorar Puntos de Interés
                </span>
                {activePoiFilter && (
                  <button
                    type="button"
                    onClick={() => { setActivePoiFilter(null); setNearbyPois([]); setPoiError(null); }}
                    className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1"
                  >
                    <span>✕</span>
                    <span>Limpiar filtro</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {POI_CATEGORIES.map((cat) => {
                  const isActive = activePoiFilter?.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleTogglePoiCategory(cat)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                        isActive
                          ? "bg-emerald-600 text-white border-emerald-500 shadow-md font-bold scale-[1.02] ring-2 ring-emerald-400/40"
                          : isDarkMode
                            ? "bg-[#111C20] text-gray-300 border-[#26383D] hover:bg-[#162329] hover:text-white"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LISTA DE LUGARES ENCONTRADOS SI HAY UN FILTRO POI ACTIVO */}
            {activePoiFilter && (
              <div className={`p-2.5 rounded-xl border max-h-48 overflow-y-auto no-scrollbar space-y-1.5 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-emerald-50/40 border-emerald-200"
              }`}>
                <div className="flex items-center justify-between text-xs font-bold px-1 mb-1">
                  <span className={isDarkMode ? "text-emerald-400" : "text-[#1a5c2a]"}>
                    {activePoiFilter.icon} {activePoiFilter.label} cercanos ({nearbyPois.length})
                  </span>
                  {loadingPois && (
                    <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                {poiError && (
                  <p className="text-[11px] text-amber-500 text-center py-2 px-1">
                    {poiError}
                  </p>
                )}

                {nearbyPois.length === 0 && !loadingPois && !poiError && (
                  <p className="text-[11px] text-gray-400 text-center py-2">
                    No se encontraron {activePoiFilter.label.toLowerCase()} en este radio.
                  </p>
                )}

                {nearbyPois.map((poi, idx) => (
                  <div
                    key={poi.placeId || poi.place_id || idx}
                    className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-xs transition-colors ${
                      destination?.name === poi.name
                        ? isDarkMode ? "bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500" : "bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600"
                        : isDarkMode ? "bg-[#162329] border-[#26383D] hover:border-emerald-500/60" : "bg-white border-gray-200 hover:border-emerald-600/60 shadow-sm"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate text-[12px]">{poi.name}</p>
                      {poi.vicinity && (
                        <p className={`text-[10px] truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {poi.vicinity}
                        </p>
                      )}
                      {poi.rating && (
                        <span className="text-[10px] text-amber-500 font-bold">
                          ⭐ {poi.rating} / 5
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => selectNearbyPoi(poi)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 shadow-sm transition-transform active:scale-95 ${
                        destination?.name === poi.name
                          ? "bg-emerald-700 text-white cursor-default"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white"
                      }`}
                    >
                      {destination?.name === poi.name ? "✓ Destino" : "Ir aquí"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ACCESOS RÁPIDOS Y BOTÓN DE CALCULAR */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={setMyLocation}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isDarkMode
                    ? "bg-[#111C20] hover:bg-[#162329] text-emerald-400 border border-[#26383D]"
                    : "bg-emerald-50 hover:bg-emerald-100 text-[#1a5c2a] border border-emerald-100"
                }`}
              >
                <TargetIcon size={14} />
                <span>{t("planRoute.useMyLocation")}</span>
              </button>

              <button
                type="button"
                onClick={() => calculateRoute()}
                disabled={!origin?.lat || !destination?.lat || loading}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                  origin?.lat && destination?.lat && !loading
                    ? isDarkMode
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.98]"
                      : "bg-[#1a5c2a] hover:bg-[#145223] text-white active:scale-[0.98]"
                    : isDarkMode
                      ? "bg-[#111C20] text-gray-500 border border-[#26383D] cursor-not-allowed"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t("planRoute.calculating")}</span>
                  </>
                ) : (
                  <>
                    <NavigationIcon className="w-3.5 h-3.5" />
                    <span>{t("planRoute.calculate")}</span>
                  </>
                )}
              </button>
            </div>

            {/* ADVERTENCIA DE AUTENTICACIÓN REQUERIDA (ERROR 401 DEL BACKEND) */}
            {routeAuthWarning && (
              <div className={`p-3 rounded-xl border space-y-2 text-xs transition-all ${
                isDarkMode ? "bg-amber-950/30 border-amber-600/50 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900"
              }`}>
                <div className="flex items-start gap-2">
                  <span className="text-base select-none">🔒</span>
                  <div className="flex-1">
                    <p className="font-bold text-xs">Cálculo de ruta en tiempo real requiere autenticación</p>
                    <p className="text-[11px] opacity-90 mt-0.5 leading-snug">
                      Para consultar indicaciones paso a paso, rutas alternativas y registrar tu trayecto con ahorro de CO₂, inicia sesión con tu cuenta de EcoRuteando.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate?.("/login")}
                    className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate?.("/register")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                      isDarkMode ? "bg-[#162329] border-[#26383D] text-gray-200 hover:bg-[#1f3037]" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Crear cuenta
                  </button>
                </div>
              </div>
            )}

            {/* SUGERENCIA DE CAMBIO DE MODO ANTE ZERO_RESULTS (404) */}
            {routeZeroResultsSuggestion && (
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    const newMode = routeZeroResultsSuggestion;
                    setTransportMode(newMode);
                    setRouteZeroResultsSuggestion(null);
                    calculateRoute(origin, destination);
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-[0.98]"
                >
                  <span>{routeZeroResultsSuggestion === "car" ? "🚗" : "🚶"}</span>
                  <span>Calcular automáticamente {routeZeroResultsSuggestion === "car" ? "en automóvil" : "a pie"}</span>
                </button>
              </div>
            )}

            {/* MENSAJES DE ERROR */}
            {error && (
              <div className={`p-2.5 rounded-xl text-xs text-center border ${
                isDarkMode ? "bg-rose-950/40 border-rose-900/60 text-rose-300" : "bg-rose-50 border-rose-100 text-rose-700"
              }`}>
                {error}
              </div>
            )}

            {/* SELECTOR DE DIFERENTES RUTAS ALTERNATIVAS CON TIEMPO Y CO2 EVITADO */}
            {routeAlternatives.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <span className={`text-[10px] font-extrabold tracking-wider uppercase ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Rutas Encontradas ({routeAlternatives.length})
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-500">
                    Toca para elegir
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                  {routeAlternatives.map((alt, idx) => {
                    const isSelected = selectedRouteIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectRouteOption(idx)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                          isSelected
                            ? isDarkMode
                              ? "bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500"
                              : "bg-emerald-50 border-emerald-600 shadow-sm ring-1 ring-emerald-600"
                            : isDarkMode
                              ? "bg-[#111C20] border-[#26383D] hover:bg-[#162329]"
                              : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm">{alt.mode === "car" ? "🚗" : "🚶"}</span>
                            <span className="font-bold text-xs truncate max-w-[190px]">{alt.label}</span>
                          </div>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-emerald-600 text-white"
                              : isDarkMode ? "bg-[#162329] text-gray-300" : "bg-gray-100 text-gray-700"
                          }`}>
                            {alt.tag}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs mt-1">
                          <div className="flex items-baseline gap-1.5">
                            <span className={`font-black text-sm ${isSelected ? "text-emerald-500" : isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                              {alt.duration} min
                            </span>
                            <span className={`text-[11px] ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              ({alt.distance} km)
                            </span>
                          </div>

                          {alt.mode === "walking" ? (
                            <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-0.5">
                              🌱 -{alt.co2SavedKg} kg CO₂ evitado
                            </span>
                          ) : (
                            <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${isDarkMode ? "text-amber-400" : "text-amber-700"}`}>
                              🚗 {alt.co2EmittedKg} kg CO₂
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TARJETA DE RESULTADO DE RUTA (ESTILO GOOGLE MAPS ROUTE SUMMARY) */}
            {route && (
              <div className={`mt-2 p-3.5 rounded-xl border transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"
              }`}>
                {/* Resumen del tiempo y distancia en formato grande */}
                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-black ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                      {route.duration} min
                    </span>
                    <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      ({route.distance} km)
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isDarkMode ? "bg-[#162329] text-gray-300 border border-[#26383D]" : "bg-white text-gray-700 border border-gray-200"
                  }`}>
                    {transportMode === "car" ? t("planRoute.modeCar") : t("planRoute.onFoot")}
                  </span>
                </div>

                {/* Nombres de los puntos */}
                <p className={`text-xs font-medium truncate mb-2.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {route.startAddress?.split(",")[0]} → {route.endAddress?.split(",")[0]}
                </p>

                {/* Chips de ahorro de CO2 y calorías */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {estimate?.co2SavedKg != null && (
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      isDarkMode ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60" : "bg-emerald-100/70 text-emerald-800 border border-emerald-200"
                    }`}>
                      <span>🌱</span>
                      <span>-{estimate.co2SavedKg} kg {t("planRoute.co2Avoided")}</span>
                    </div>
                  )}
                  {estimate?.estimatedCalories != null && (
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      isDarkMode ? "bg-amber-950/40 text-amber-300 border border-amber-800/50" : "bg-amber-100/70 text-amber-900 border border-amber-200"
                    }`}>
                      <span>🔥</span>
                      <span>{estimate.estimatedCalories} kcal</span>
                    </div>
                  )}
                </div>

                                {/* Botones de guardar y favoritos */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    disabled={saving}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                      saved || routeSavedId
                        ? isDarkMode ? "bg-emerald-950/40 text-emerald-400 border-emerald-800" : "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : isDarkMode
                          ? "bg-[#162329] text-gray-200 border-[#26383D] hover:bg-[#1f3037]"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 shadow-sm"
                    }`}
                  >
                    <BookmarkIcon className="w-3.5 h-3.5" />
                    <span>{saved || routeSavedId ? t("planRoute.savedInMyRoutes") : saving ? t("planRoute.saving") : t("planRoute.save")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFavoriteClick}
                    disabled={favoriting}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                      favorited
                        ? isDarkMode ? "bg-rose-950/40 text-rose-400 border-rose-800" : "bg-rose-50 text-rose-700 border-rose-300"
                        : isDarkMode
                          ? "bg-[#162329] text-gray-200 border-[#26383D] hover:bg-[#1f3037]"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 shadow-sm"
                    }`}
                  >
                    <HeartIcon className={`w-3.5 h-3.5 ${favorited ? "text-rose-500 fill-rose-500" : ""}`} filled={favorited} />
                    <span>{favorited ? t("planRoute.favorited") : favoriting ? t("planRoute.favoriting") : t("planRoute.favorite")}</span>
                  </button>
                </div>

                {/* GESTIÓN DE VIAJE Y HISTORIAL */}
                <div className="mt-3 pt-2.5 border-t border-inherit/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold px-0.5">
                    <span className="text-emerald-500 flex items-center gap-1 font-bold">
                      ✓ Registrado en tu Historial
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate?.("/user/history")}
                      className={`text-xs font-bold underline hover:opacity-80 transition-opacity flex items-center gap-1 ${
                        isDarkMode ? "text-emerald-400" : "text-[#1a5c2a]"
                      }`}
                    >
                      Ver en Historial 📋
                    </button>
                  </div>

                  {activeTripId ? (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Viaje activo en progreso
                      </span>
                      <button
                        type="button"
                        onClick={completeTrip}
                        disabled={completing}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all"
                      >
                        {completing ? t("planRoute.completing") : "Finalizar viaje"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={startTrip}
                      disabled={startingTrip}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                        isDarkMode ? "bg-emerald-600 hover:bg-emerald-500" : "bg-[#1a5c2a] hover:bg-[#145223]"
                      }`}
                    >
                      <NavigationIcon className="w-3.5 h-3.5" />
                      <span>{startingTrip ? t("planRoute.starting") : "Iniciar nuevo viaje activo"}</span>
                    </button>
                  )}
                  {tripError && <p className="text-center text-xs text-rose-500 font-medium">{tripError}</p>}
                </div>
              </div>
            )}

            {/* ACCESO RÁPIDO A LUGARES RECOMENDADOS */}
            <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all ${
              isDarkMode ? "bg-[#111C20] border-[#26383D] text-gray-300" : "bg-emerald-50/50 border-emerald-100 text-gray-700"
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base select-none">🌟</span>
                <div className="min-w-0">
                  <p className="font-bold text-[11px] truncate">Lugares recomendados para descubrir</p>
                  <p className={`text-[10px] truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    6 destinos verificados en Neiva y Huila
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("explore")}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 shrink-0 shadow-sm"
              >
                Descubrir →
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* BOTONES FLOTANTES DEL MAPA ESTILO GOOGLE MAPS (INFERIOR DERECHA) */}
      <div className="absolute bottom-6 right-4 md:right-6 z-20 flex flex-col gap-2.5 items-end">
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "explore" ? "plan" : "explore")}
          className={`w-11 h-11 rounded-2xl shadow-xl flex items-center justify-center transition-all ${
            activeTab === "explore"
              ? "bg-emerald-600 text-white"
              : isDarkMode
                ? "bg-[#162329]/95 text-amber-400 border border-[#26383D] hover:bg-[#111C20]"
                : "bg-white/95 text-amber-600 hover:bg-gray-50 shadow-md"
          }`}
          title="Lugares recomendados para descubrir"
          aria-label="Lugares recomendados para descubrir"
        >
          <SparklesIcon size={20} />
        </button>

        <button
          type="button"
          onClick={handleNearbyToggle}
          className={`w-11 h-11 rounded-2xl shadow-xl flex items-center justify-center transition-all ${
            showNearbySearch
              ? "bg-emerald-600 text-white"
              : isDarkMode
                ? "bg-[#162329]/95 text-gray-200 border border-[#26383D] hover:bg-[#111C20]"
                : "bg-white/95 text-gray-800 hover:bg-gray-50 shadow-md"
          }`}
          title={t("planRoute.searchPlaces")}
          aria-label={t("planRoute.searchPlaces")}
        >
          <SearchIcon size={20} />
        </button>

        <button
          type="button"
          onClick={handleMapTypeCycle}
          className={`w-11 h-11 rounded-2xl shadow-xl flex items-center justify-center transition-all ${
            isDarkMode
              ? "bg-[#162329]/95 text-gray-200 border border-[#26383D] hover:bg-[#111C20]"
              : "bg-white/95 text-gray-800 hover:bg-gray-50 shadow-md"
          }`}
          title={t("planRoute.mapTypeHint", { type: t(MAP_TYPE_LABELS[mapTypeId]) })}
          aria-label={t("planRoute.mapTypeHint", { type: t(MAP_TYPE_LABELS[mapTypeId]) })}
        >
          <LayersIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleCenterAction}
          className={`w-11 h-11 rounded-2xl shadow-xl flex items-center justify-center transition-all ${
            isDarkMode
              ? "bg-[#162329]/95 text-gray-200 border border-[#26383D] hover:bg-[#111C20]"
              : "bg-white/95 text-gray-800 hover:bg-gray-50 shadow-md"
          }`}
          title={t("planRoute.centerMyLocation")}
          aria-label={t("planRoute.centerMyLocation")}
        >
          <TargetIcon size={20} />
        </button>
      </div>

      {/* TOAST FLOTANTE DE ACCIÓN */}
      {actionMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-full shadow-2xl text-xs font-bold pointer-events-none transition-all flex items-center gap-2 ${
            actionMessage.type === "error"
              ? "bg-rose-600 text-white border border-rose-400 shadow-rose-950/50"
              : actionMessage.type === "success"
                ? "bg-emerald-600 text-white border border-emerald-400 shadow-emerald-950/50"
                : isDarkMode
                  ? "bg-[#162329] border border-[#26383D] text-gray-100"
                  : "bg-gray-900 text-white"
          }`}
        >
          {actionMessage.type === "error" ? "⚠️" : actionMessage.type === "success" ? "✓" : "ℹ️"}
          <span>{actionMessage.text || actionMessage}</span>
        </div>
      )}

      {/* PANEL FLOTANTE DE LUGARES DE INTERÉS CERCANOS */}
      {showNearbySearch && (
        <div className="absolute z-20 left-4 right-4 top-20 md:left-[450px] md:right-auto">
          <div className={`rounded-2xl shadow-2xl p-4 w-full md:w-80 backdrop-blur-md border ${
            isDarkMode ? "bg-[#162329]/95 border-[#26383D]" : "bg-white/95 border-gray-200"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-sm font-bold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                {t("planRoute.nearbyTitle")}
              </h4>
              <button
                type="button"
                onClick={() => setShowNearbySearch(false)}
                className={`text-xs font-bold ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
              >
                {t("planRoute.close")}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["restaurant", "hotel", "church", "park", "cafe", "bar", "museum"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setNearbyType(type); loadNearbyPois(type); }}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                    nearbyType === type
                      ? isDarkMode ? "bg-emerald-600 text-white" : "bg-[#1a5c2a] text-white"
                      : isDarkMode ? "bg-[#111C20] text-gray-300 border border-[#26383D] hover:bg-[#162329]" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {t(`planRoute.poiTypes.${type}`)}
                </button>
              ))}
            </div>
            {nearbyPois.length > 0 && (
              <div className="mt-3 max-h-52 overflow-y-auto space-y-1.5 no-scrollbar">
                {nearbyPois.slice(0, 10).map((poi, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectNearbyPoi(poi)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                      isDarkMode
                        ? "bg-[#111C20] border-[#26383D] hover:border-emerald-500"
                        : "bg-white border-gray-200 hover:border-emerald-600 shadow-sm"
                    }`}
                  >
                    <p className={`text-xs font-bold leading-snug ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>{poi.name}</p>
                    {poi.vicinity && <p className={`text-[11px] font-medium leading-snug mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{poi.vicinity}</p>}
                    <p className={`text-[11px] font-bold mt-1 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                      {poi.rating ? `⭐ ${poi.rating} · ` : ""}{t("planRoute.tapToGo")}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <DownloadApkModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
};

export default PlanRoute;
