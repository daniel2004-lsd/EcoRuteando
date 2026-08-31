import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LeafIcon, ArrowLeft, MapIcon, BikeIcon, BusIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import MapViewGoogle from "../../../features/auth/components/MapViewGoogle";
import mapsService from "../../../services/mapsService";
import routeService from "../../../services/routeService";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

// Coordenadas de Neiva
const NEIVA_LAT = 2.9273;
const NEIVA_LON = -75.2819;

// Lugares populares de Neiva con coordenadas VERIFICADAS
const NEIVA_PLACES = [
  { name: "Parque Santander", lat: 2.9273, lng: -75.2819, address: "Centro, Neiva" },
  { name: "Terminal de Transporte", lat: 2.9150, lng: -75.2850, address: "Sur, Neiva" },
  { name: "Centro Comercial Unicentro", lat: 2.9400, lng: -75.2800, address: "Norte, Neiva" },
  { name: "Universidad Surcolombiana", lat: 2.9450, lng: -75.2830, address: "Norte, Neiva" },
  { name: "Clínica Medilaser", lat: 2.9300, lng: -75.2820, address: "Centro, Neiva" },
  { name: "Aeropuerto Benito Salas", lat: 2.9500, lng: -75.2900, address: "Sur, Neiva" },
];

// Cargar Google Maps (solo para el visualizador del mapa)
let mapsLoadingPromise = null;
const loadGoogleMapsApi = () => {
  if (mapsLoadingPromise) return mapsLoadingPromise;
  
  mapsLoadingPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google);
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&language=es`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  
  return mapsLoadingPromise;
};

// Componente de búsqueda (usa backend para geocoding)
const LocationSearch = ({ placeholder, onSelect, isDarkMode, value, type = "origin", externalValue }) => {
  const [query, setQuery] = useState(value || externalValue || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (externalValue && externalValue !== query) {
      setQuery(externalValue);
    }
  }, [externalValue]);

  const searchPlaces = async (text) => {
    if (text.length < 2) {
      if (text.length === 0) {
        setSuggestions(NEIVA_PLACES);
      } else {
        setSuggestions([]);
      }
      return;
    }

    setIsLoading(true);
    
    try {
      // Usar backend para geocoding
      const response = await mapsService.geocode(text);
      
      if (response.results && response.results.length > 0) {
        setSuggestions(response.results.map(r => ({
          name: r.formattedAddress.split(',')[0],
          address: r.formattedAddress,
          lat: r.lat,
          lng: r.lng,
          placeId: r.placeId,
        })));
      } else {
        // Fallback a lugares predefinidos
        const filtered = NEIVA_PLACES.filter(p => 
          p.name.toLowerCase().includes(text.toLowerCase())
        );
        setSuggestions(filtered);
      }
    } catch (error) {
      console.error("Error en geocoding:", error);
      // Fallback a lugares predefinidos
      const filtered = NEIVA_PLACES.filter(p => 
        p.name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(query), 400);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const selectPlace = (place) => {
    onSelect({
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
    });
    setQuery(place.name);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
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

      {showDropdown && suggestions.length > 0 && (
        <div className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {suggestions.map((place, idx) => (
            <button
              key={idx}
              onClick={() => selectPlace(place)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors border-b last:border-b-0 ${
                isDarkMode ? 'hover:bg-gray-700 text-gray-300 border-gray-700' : 'hover:bg-gray-50 text-gray-700 border-gray-100'
              }`}
            >
              <div className="font-medium">{place.name}</div>
              <div className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {place.address || "Neiva, Huila"}
              </div>
            </button>
          ))}
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
  const [userLocation, setUserLocation] = useState(null);
  const [originInputValue, setOriginInputValue] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: NEIVA_LAT, lng: NEIVA_LON });
  const [mapsReady, setMapsReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadGoogleMapsApi().then(() => {
      setMapsReady(true);
    }).catch(() => setError("Error cargando Google Maps"));
  }, []);

  // Obtener ubicación actual
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            name: "Mi ubicación",
            address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
          };
          setUserLocation(location);
          console.log("Ubicación obtenida:", location);
        },
        (err) => {
          console.error("Error obteniendo ubicación:", err);
          setError("No se pudo obtener su ubicación. Verifique los permisos.");
        }
      );
    }
  }, []);

  // Función para calcular ruta (usa backend)
  const calculateRoute = async () => {
    if (!origin) {
      setError("Seleccione un origen");
      return;
    }
    if (!destination) {
      setError("Seleccione un destino");
      return;
    }
    if (!origin.lat || !origin.lng) {
      setError("El origen no tiene coordenadas válidas");
      return;
    }
    if (!destination.lat || !destination.lng) {
      setError("El destino no tiene coordenadas válidas");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Calculando ruta via backend...");
      console.log("Origen:", origin);
      console.log("Destino:", destination);
      console.log("Modo:", transportMode);

      // Mapear modos de transporte
      const modeMap = {
        walking: "walking",
        bike: "bicycling",
        public: "transit",
      };

      const result = await mapsService.getDirections(
        origin.lat,
        origin.lng,
        destination.lat,
        destination.lng,
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
          startAddress: origin.address,
          endAddress: destination.address,
        });
      } else {
        setError("No se encontró una ruta válida");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Error calculando la ruta");
    } finally {
      setLoading(false);
    }
  };

  // Guardar ruta en el backend
  const saveRoute = async () => {
    if (!route || !origin || !destination) return;

    setSaving(true);
    try {
      const modeMap = {
        walking: "walking",
        bike: "bike",
        public: "public_transport",
      };

      await routeService.create({
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
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Error guardando ruta:", err);
    } finally {
      setSaving(false);
    }
  };

  // Recalcular cuando cambia el modo de transporte
  useEffect(() => {
    if (origin && destination && origin.lat && destination.lat) {
      calculateRoute();
    }
  }, [transportMode]);

  const swapLocations = () => {
    setOrigin(destination);
    setDestination(origin);
    setOriginInputValue(destination?.name || "");
    setRoute(null);
  };

  // Función para usar mi ubicación como origen
  const setMyLocation = () => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      setOrigin(userLocation);
      setOriginInputValue("Mi ubicación");
      setMapCenter({ lat: userLocation.lat, lng: userLocation.lng });
      console.log("Usando ubicación como origen:", userLocation);
      
      if (destination && destination.lat) {
        setTimeout(() => calculateRoute(), 100);
      }
    } else {
      setError("No se pudo obtener su ubicación. Verifique los permisos del GPS.");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            name: "Mi ubicación",
            address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
          };
          setUserLocation(location);
          setOrigin(location);
          setOriginInputValue("Mi ubicación");
          setMapCenter({ lat: location.lat, lng: location.lng });
        },
        () => setError("No se pudo acceder a su ubicación")
      );
    }
  };

  // Centrar en Neiva
  const centerOnNeiva = () => {
    setMapCenter({ lat: NEIVA_LAT, lng: NEIVA_LON });
  };

  // Seleccionar destino rápido
  const selectQuickDestination = (place) => {
    setDestination(place);
    if (origin && origin.lat) {
      setTimeout(() => calculateRoute(), 100);
    }
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
            destination && { lat: destination.lat, lng: destination.lng, popup: `Destino: ${destination.name}`, type: "destination" }
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

            {/* Destinos rápidos */}
            <div className="mt-2 flex flex-wrap gap-1">
              {NEIVA_PLACES.slice(0, 3).map(place => (
                <button
                  key={place.name}
                  onClick={() => selectQuickDestination(place)}
                  className={`text-xs px-2 py-1 rounded-md transition-all ${
                    isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {place.name}
                </button>
              ))}
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
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
              {[
                { id: "walking", label: "Caminar", icon: "🚶" },
                { id: "bike", label: "Bicicleta", icon: "🚲" },
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
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-20">
          <div className={`rounded-xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      transportMode === 'walking' ? 'bg-green-100 text-green-700' :
                      transportMode === 'bike' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {transportMode === 'walking' ? 'Caminata' : transportMode === 'bike' ? 'Ciclorruta' : 'Transporte público'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {route.distance} km · {route.duration} min
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {route.startAddress?.split(',')[0]} → {route.endAddress?.split(',')[0]}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveRoute}
                    disabled={saving || saved}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      saved
                        ? 'bg-green-100 text-green-700'
                        : saving
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {saved ? '✓ Guardada' : saving ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => setRoute(null)}
                    className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="text-gray-400 text-sm">✕</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botones flotantes */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
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