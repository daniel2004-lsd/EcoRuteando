import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LeafIcon, ArrowLeft, BikeIcon, BusIcon, TrophyIcon, ChartIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";

const UserStatistics = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

  // Datos de ejemplo
  const [stats] = useState({
    totalCO2: 1.5,
    treesEquivalent: 0.07,
    monthlyCO2: [0.12, 0.15, 0.18, 0.22, 0.28, 0.35],
    weeklyKm: [5.2, 6.8, 7.5, 8.2, 9.1, 10.5, 11.2, 12.8],
    transportType: {
      bike: 65,
      public: 35
    }
  });

  const months = ["Dic", "Ene", "Feb", "Mar", "Abr", "May"];
  const weeks = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"];

  const achievements = [
    { name: "Primera ruta", completed: true, icon: "🚀" },
    { name: "10 rutas", completed: true, icon: "🌟", value: "10/10" },
    { name: "50 rutas", completed: false, icon: "🏆", value: "12/50" },
    { name: "100 kg CO₂", completed: false, icon: "🌿", value: "32/100" },
    { name: "500 kg CO₂", completed: false, icon: "💚", value: "32/500" },
    { name: "100 km recorridos", completed: true, icon: "🚲", value: "156/100" }
  ];

  const maxCO2 = Math.max(...stats.monthlyCO2);
  const maxKm = Math.max(...stats.weeklyKm);

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
                <ChartIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mis Estadísticas</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>Tu impacto ambiental en números</p>
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

        {/* Tarjeta principal CO₂ */}
        <div className={`rounded-2xl p-8 mb-8 text-center shadow-md border transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <LeafIcon size={36} className="text-emerald-500" />
            </div>
          </div>
          <h3 className={`text-xs font-bold uppercase tracking-wide mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>CO₂ AHORRADO</h3>
          <p className={`text-5xl md:text-6xl font-black mt-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{stats.totalCO2} kg</p>
          <p className={`text-sm mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Equivale a plantar <span className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{stats.treesEquivalent}</span> árboles
          </p>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* CO₂ ahorrado por mes */}
          <div className={`rounded-2xl p-6 shadow-md border transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>CO₂ ahorrado por mes</h3>
            <div className="flex items-end justify-between h-52 gap-2">
              {stats.monthlyCO2.map((value, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${(value / maxCO2) * 140}px`,
                      background: isDarkMode ? '#3a8a5a' : '#2a6b8f',
                    }}
                  />
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{months[idx]}</span>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{value} kg</span>
                </div>
              ))}
            </div>
          </div>

          {/* Km recorridos */}
          <div className={`rounded-2xl p-6 shadow-md border transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Km recorridos (últimas 8 semanas)</h3>
            <div className="flex items-end justify-between h-52 gap-2">
              {stats.weeklyKm.map((value, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${(value / maxKm) * 140}px`,
                      background: isDarkMode ? '#10b981' : '#059669',
                    }}
                  />
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{weeks[idx]}</span>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{value} km</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transporte y Logros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Tipo de transporte */}
          <div className={`rounded-2xl p-6 shadow-md border transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-bold mb-5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tipo de transporte</h3>
            
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BikeIcon size={18} className="text-emerald-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Bicicleta</span>
                </div>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{stats.transportType.bike}%</span>
              </div>
              <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${stats.transportType.bike}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BusIcon size={18} className="text-blue-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Transporte Público</span>
                </div>
                <span className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>{stats.transportType.public}%</span>
              </div>
              <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${stats.transportType.public}%` }} />
              </div>
            </div>
          </div>

          {/* Logros */}
          <div className={`rounded-2xl p-6 shadow-md border transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              <TrophyIcon size={20} className="text-amber-500" />
              Logros
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl text-center transition-all ${achievement.completed 
                    ? (isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200')
                    : (isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200')
                  } ${achievement.completed ? '' : 'opacity-60'}`}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{achievement.name}</p>
                  {achievement.value && (
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{achievement.value}</p>
                  )}
                  {achievement.completed && (
                    <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>✓ Completado</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frase motivacional */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            Sigue así, cada kilómetro cuenta para un futuro más verde
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;