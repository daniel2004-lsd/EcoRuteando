import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  LeafIcon, 
  ArrowLeft, 
  ActivityIcon, 
  ClockIcon, 
  MapPinIcon,
  AlertTriangleIcon
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";

const UserAlerts = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

  // Datos de ejemplo para alertas climáticas
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "rain",
      title: "Lluvia intensa",
      description: "Se esperan lluvias intensas en el centro de la ciudad durante las próximas 3 horas.",
      severity: "high",
      time: "Hace 10 min",
      location: "Centro, Neiva",
      icon: "🌧️"
    },
    {
      id: 2,
      type: "storm",
      title: "Tormenta eléctrica",
      description: "Posibilidad de tormentas eléctricas en la zona sur. Precaución al circular.",
      severity: "medium",
      time: "Hace 25 min",
      location: "Zona Sur, Neiva",
      icon: "⛈️"
    },
    {
      id: 3,
      type: "heat",
      title: "Ola de calor",
      description: "Temperaturas superiores a 35°C. Mantente hidratado y usa protección solar.",
      severity: "medium",
      time: "Hace 1 hora",
      location: "Toda la ciudad",
      icon: "☀️"
    },
    {
      id: 4,
      type: "wind",
      title: "Vientos fuertes",
      description: "Ráfagas de viento de hasta 40 km/h en el sector norte. Precaución con estructuras.",
      severity: "low",
      time: "Hace 2 horas",
      location: "Zona Norte, Neiva",
      icon: "💨"
    },
    {
      id: 5,
      type: "flood",
      title: "Posible inundación",
      description: "Zonas bajas podrían presentar inundaciones por acumulación de agua.",
      severity: "high",
      time: "Hace 3 horas",
      location: "Comuna 10, Neiva",
      icon: "🌊"
    }
  ]);

  const [weatherData, setWeatherData] = useState({
    temperature: 32,
    feelsLike: 34,
    humidity: 65,
    windSpeed: 12,
    condition: "Parcialmente nublado",
    icon: "⛅",
    forecast: [
      { day: "Hoy", temp: 32, icon: "⛅", rain: "20%" },
      { day: "Mañana", temp: 31, icon: "🌧️", rain: "60%" },
      { day: "Miércoles", temp: 30, icon: "☁️", rain: "40%" },
      { day: "Jueves", temp: 33, icon: "☀️", rain: "10%" },
      { day: "Viernes", temp: 34, icon: "☀️", rain: "5%" }
    ]
  });

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "high": return isDarkMode ? "bg-red-900/30 text-red-400 border-red-500/30" : "bg-red-50 text-red-700 border-red-200";
      case "medium": return isDarkMode ? "bg-yellow-900/30 text-yellow-400 border-yellow-500/30" : "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low": return isDarkMode ? "bg-blue-900/30 text-blue-400 border-blue-500/30" : "bg-blue-50 text-blue-700 border-blue-200";
      default: return isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600";
    }
  };

  const getSeverityText = (severity) => {
    switch(severity) {
      case "high": return "Alta";
      case "medium": return "Media";
      case "low": return "Baja";
      default: return "";
    }
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const handleDismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const stats = {
    activeAlerts: alerts.length,
    highSeverity: alerts.filter(a => a.severity === "high").length,
    todayForecast: weatherData.condition,
    avgTemp: weatherData.temperature
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
      <header className={`relative ${isDarkMode ? 'bg-gray-800 border-b border-emerald-500/30' : 'bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700'} shadow-lg overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isDarkMode ? 'bg-gray-700 border border-emerald-500/30' : 'bg-white'}`}>
                <ActivityIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Alertas Climáticas</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>Clima en tiempo real para tu seguridad</p>
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

        {/* Tarjeta del clima actual */}
        <div className={`rounded-2xl p-6 mb-8 shadow-md border transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-6xl mb-2">{weatherData.icon}</div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{weatherData.condition}</p>
            </div>
            
            <div className="text-center">
              <p className={`text-5xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{weatherData.temperature}°C</p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sensación térmica: {weatherData.feelsLike}°C</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`px-4 py-2 rounded-xl text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Humedad</p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{weatherData.humidity}%</p>
              </div>
              <div className={`px-4 py-2 rounded-xl text-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Viento</p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{weatherData.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`rounded-xl p-4 shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alertas activas</p>
                <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.activeAlerts}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <AlertTriangleIcon size={20} className="text-emerald-500" />
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-4 shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alerta máxima</p>
                <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.highSeverity}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <span className="text-lg">⚠️</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-4 shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Temperatura promedio</p>
                <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.avgTemp}°C</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                <span className="text-lg">🌡️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pronóstico extendido */}
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>📅 Pronóstico extendido</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {weatherData.forecast.map((day, idx) => (
            <div key={idx} className={`rounded-xl p-3 text-center shadow-md border transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{day.day}</p>
              <div className="text-2xl my-1">{day.icon}</div>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{day.temp}°C</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Lluvia: {day.rain}</p>
            </div>
          ))}
        </div>

        {/* Lista de alertas */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>⚠️ Alertas activas</h2>
          <div className="flex gap-2">
            <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isDarkMode ? 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              Todas
            </button>
            <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isDarkMode ? 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              Alta
            </button>
            <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isDarkMode ? 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              Media
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl p-5 shadow-md transition-all hover:shadow-lg border ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex flex-wrap md:flex-nowrap gap-4 items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="text-3xl">{alert.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{alert.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getSeverityColor(alert.severity)}`}>
                        {getSeverityText(alert.severity)}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{alert.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <ClockIcon size={12} /> {alert.time}
                      </span>
                      <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <MapPinIcon size={12} /> {alert.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(alert)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${isDarkMode ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'}`}
                  >
                    Ver más
                  </button>
                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isDarkMode ? 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`}
                  >
                    Descartar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recomendaciones */}
        <div className={`rounded-2xl p-6 shadow-md border ${isDarkMode ? 'bg-gradient-to-br from-emerald-900/50 to-green-900/50 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/20' : 'bg-white'}`}>
              <LeafIcon size={20} className="text-emerald-500" />
            </div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>💡 Recomendaciones para hoy</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`flex items-center gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <span>🧥</span>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Lleva paraguas, hay probabilidad de lluvia</p>
            </div>
            <div className={`flex items-center gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <span>💧</span>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Mantente hidratado durante tu ruta</p>
            </div>
            <div className={`flex items-center gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <span>🚲</span>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Revisa el estado de tu bicicleta antes de salir</p>
            </div>
            <div className={`flex items-center gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <span>🧴</span>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Usa protector solar, la radiación es alta</p>
            </div>
          </div>
        </div>

        {/* Frase motivacional */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            Mantente informado y viaja seguro. El clima no es una sorpresa
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>

      {/* Modal de detalles */}
      {showModal && selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className={`max-w-md w-full rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className={`p-5 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} flex justify-between items-center`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedAlert.icon}</span>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{selectedAlert.title}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                ✕
              </button>
            </div>
            <div className="p-5">
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedAlert.description}</p>
              <div className={`p-3 rounded-lg mb-4 ${getSeverityColor(selectedAlert.severity)}`}>
                <p className="text-sm font-semibold">Nivel de severidad: {getSeverityText(selectedAlert.severity)}</p>
              </div>
              <div className="space-y-2 text-sm">
                <p className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <ClockIcon size={14} /> Publicado: {selectedAlert.time}
                </p>
                <p className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <MapPinIcon size={14} /> Área afectada: {selectedAlert.location}
                </p>
              </div>
            </div>
            <div className={`p-5 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} flex gap-3`}>
              <button
                onClick={() => setShowModal(false)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Cerrar
              </button>
              <button
                onClick={() => { handleDismissAlert(selectedAlert.id); setShowModal(false); }}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAlerts;