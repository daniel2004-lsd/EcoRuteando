import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LeafIcon, ArrowLeft, MapIcon, BikeIcon, BusIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";

/* ─── COMPONENTES INTERNOS ──────────────────────────────────── */
const Badge = ({ type }) => (
  <span style={{
    fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
    textTransform: "uppercase", padding: "2px 8px", borderRadius: 4,
    fontFamily: "sans-serif",
    ...(type === "bike"
      ? { background: "#d4e6d4", color: "#2d4a2a", border: "1px solid #6b8a5c" }
      : { background: "#cde3f0", color: "#1a3a4f", border: "1px solid #8bb5cc" }),
  }}>
    {type === "bike" ? "Bicicleta" : "T. Público"}
  </span>
);

const Co2Bar = ({ co2, isDarkMode }) => {
  const val = parseFloat(co2);
  const pct = Math.min((val / 1.2) * 100, 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 3, borderRadius: 99, background: isDarkMode ? "#244352" : "#d0d8e4" }}>
        <div style={{
          height: "100%", borderRadius: 99, width: `${pct}%`,
          background: isDarkMode ? "#7acc8a" : "#1a3a4f",
        }} />
      </div>
      <span style={{ fontSize: 11, color: isDarkMode ? "#7acc8a" : "#1a3a4f", fontWeight: 600, fontFamily: "sans-serif", minWidth: 52 }}>
        {co2} CO₂
      </span>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════ */
const PlanRoute = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [transportType, setTransportType] = useState("bike");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const routes = [
    { name: "Neiva – Centro",  type: "public", time: "29 min", distance: "9.97 km",  co2: "0.80 kg" },
    { name: "Neiva – Sur",     type: "public", time: "35 min", distance: "11.20 km", co2: "0.95 kg" },
    { name: "Ulloa – Centro",  type: "bike",   time: "23 min", distance: "5.78 km",  co2: "0.69 kg" },
    { name: "Ulloa – Norte",   type: "bike",   time: "28 min", distance: "6.90 km",  co2: "0.82 kg" },
  ];

  const handleCalculate = () => {
    if (origin && destination) setShowSuggestions(true);
    else alert("Por favor ingresa origen y destino");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>

      {/* Botón modo oscuro/claro */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* HEADER */}
      <header className={`relative ${isDarkMode ? 'bg-gray-800 border-b border-emerald-500/30' : 'bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700'} shadow-lg overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isDarkMode ? 'bg-gray-700 border border-emerald-500/30' : 'bg-white'}`}>
                <MapIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Planear Ruta</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>Movilidad Ecológica · Neiva, Huila</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate("/dashboard")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft size={16} />
              Volver
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Alerta de seguridad */}
        <div className={`rounded-xl p-4 mb-6 flex gap-3 items-start ${isDarkMode ? 'bg-amber-900/30 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? "#fbbf24" : "#d97706"} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className={`text-xs font-bold mb-1 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>ALERTAS DE RUTA VERIFICADAS</p>
            <p className={`text-xs ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
              <strong>Inseguridad:</strong> Zona centro — evitar horario nocturno
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>
              <strong>Daño en vía:</strong> Calle 15 con carrera 8 — desvío recomendado
            </p>
          </div>
        </div>

        {/* Tarjeta del formulario */}
        <div className={`rounded-2xl shadow-md border mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Planear Ruta Ecológica</h2>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Calcula el trayecto con menor huella ambiental</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={`block text-xs font-bold mb-1 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Origen</label>
                <input
                  type="text"
                  placeholder="Punto de partida"
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none ${isDarkMode ? 'bg-gray-700 border border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-400'}`}
                />
                <button className={`text-xs font-semibold mt-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Guardar dirección</button>
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Destino</label>
                <input
                  type="text"
                  placeholder="¿A dónde vas?"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none ${isDarkMode ? 'bg-gray-700 border border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-400'}`}
                />
              </div>
            </div>

            <div className="mt-5">
              <label className={`block text-xs font-bold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tipo de Transporte</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setTransportType("bike")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${transportType === "bike"
                    ? (isDarkMode ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white')
                    : (isDarkMode ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-600 border border-gray-200')
                    }`}
                >
                  <BikeIcon size={16} /> Bicicleta
                </button>
                <button
                  onClick={() => setTransportType("public")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${transportType === "public"
                    ? (isDarkMode ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white')
                    : (isDarkMode ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-600 border border-gray-200')
                    }`}
                >
                  <BusIcon size={16} /> Transporte Público
                </button>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              <LeafIcon size={16} white={true} /> Calcular Ruta Ecológica
            </button>
          </div>
        </div>

        {/* Rutas sugeridas */}
        {showSuggestions && (
          <div className={`rounded-2xl shadow-md border mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Rutas Sugeridas</h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ordenadas por menor huella ambiental</p>
            </div>

            <div className="p-6">
              <div className="flex gap-2 mb-4">
                {["Neiva", "Ulloa"].map((z, i) => (
                  <span key={z} className={`text-xs font-bold px-3 py-1 rounded-full ${i === 0 ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}>
                    {z}
                  </span>
                ))}
              </div>

              <div className="space-y-3">
                {routes.filter(r => r.type === transportType).map((route, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-wrap md:flex-nowrap items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md ${isDarkMode ? 'bg-gray-700/50 border border-gray-600 hover:border-emerald-500/50' : 'bg-gray-50 border border-gray-100 hover:border-emerald-200'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${route.type === "bike" ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                      {route.type === "bike" ? "🚲" : "🚌"}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{route.name}</span>
                        <Badge type={route.type} />
                      </div>
                      <div className="flex gap-4 mb-2">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>⏱ {route.time}</span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>📏 {route.distance}</span>
                      </div>
                      <Co2Bar co2={route.co2} isDarkMode={isDarkMode} />
                    </div>

                    <button className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${isDarkMode ? 'border border-emerald-500 text-emerald-400 hover:bg-emerald-500/20' : 'border border-emerald-500 text-emerald-600 hover:bg-emerald-50'}`}>
                      Ver Detalle
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mapa */}
        <div className={`rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Vista del Mapa</h2>
          </div>
          <div className="p-6 text-center">
            <div className={`rounded-xl p-8 mb-4 ${isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="text-4xl mb-2">🗺️</div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Mapa Inicializado</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Requiere API Key de Google Maps para visualizar rutas</p>
            </div>
            <button className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
              Ingresar API Key
            </button>
          </div>
        </div>

        {/* Frase motivacional */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            Movilidad sostenible para Neiva · Reduciendo huella de carbono
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanRoute;