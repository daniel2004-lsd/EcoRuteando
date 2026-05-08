import { useState } from "react";
import {
  RouteIcon,
  LeafIcon,
  ArrowLeft,
  ActivityIcon,
  ClockIcon,
  UsersIcon,
  MapIcon,
  ReportIcon,
  ShieldIcon
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";

const UserDashboard = ({ onNavigate, userRole }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const [stats] = useState({
    routes: 5,
    trips: 12,
    co2Saved: 3.2,
    points: 120
  });

  const baseModules = [
    {
      id: 'plan_ruta',
      icon: <MapIcon size={28} />,
      title: 'Planear Ruta',
      subtitle: 'Encuentra rutas ecológicas',
      onClick: () => onNavigate('/user/plan-route')
    },
    {
      id: 'historial',
      icon: <ClockIcon size={28} />,
      title: 'Mi Historial',
      subtitle: 'Tu impacto ambiental',
      onClick: () => onNavigate('/user/history')
    },
    {
      id: 'perfil',
      icon: <UsersIcon size={28} />,
      title: 'Mi Perfil',
      subtitle: 'Configura tu cuenta',
      onClick: () => onNavigate('/profile')
    },
    {
      id: 'explorar',
      icon: <RouteIcon size={28} />,
      title: 'Explorar',
      subtitle: 'Puntos de interés',
      onClick: () => onNavigate('/user/explore')
    },
    {
      id: 'alertas',
      icon: <ActivityIcon size={28} />,
      title: 'Alertas',
      subtitle: 'Clima en tiempo real',
      onClick: () => onNavigate('/user/alerts')
    },
    {
      id: 'reportar',
      icon: <ReportIcon size={28} />,
      title: 'Reportar',
      subtitle: 'Problemas en rutas',
      onClick: () => onNavigate('/user/reporter-problem')
    }
  ];

  const adminModule = {
    id: 'admin',
    icon: <ShieldIcon size={28} />,
    title: 'Admin',
    subtitle: 'Panel de gestión',
    onClick: () => onNavigate('/admin')
  };

  const modules = userRole === "admin" 
    ? [...baseModules, adminModule] 
    : baseModules;

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
                <LeafIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>EcoRuteando - Usuario</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/home')}
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

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <MapIcon size={22} />, value: stats.routes, label: "Rutas creadas" },
            { icon: <ClockIcon size={22} />, value: stats.trips, label: "Viajes realizados" },
            { icon: <LeafIcon size={22} />, value: `${stats.co2Saved} kg`, label: "CO₂ Ahorrado" },
            { icon: <ActivityIcon size={22} />, value: stats.points, label: "Puntos ecológicos" },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-4 shadow-md transition-all hover:shadow-lg hover:-translate-y-1 ${isDarkMode ? 'bg-gray-800 border border-gray-700 hover:border-emerald-500/50' : 'bg-white border border-gray-100 hover:border-emerald-200'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <span className="text-emerald-500">{card.icon}</span>
                </div>
                <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{card.value}</span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{card.label}</p>
            </div>
          ))}
        </div>

        {/* TÍTULO DE MÓDULOS */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
              <LeafIcon size={28} className="text-emerald-500" />
            </div>
          </div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tus Herramientas</h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Todo lo que necesitas para una movilidad sostenible</p>
        </div>

        {/* MÓDULOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={module.onClick}
              className={`rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-100 hover:border-emerald-200'}`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <span className="text-emerald-500">{module.icon}</span>
              </div>
              <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{module.title}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{module.subtitle}</p>
            </div>
          ))}
        </div>

        {/* IMPACTO AMBIENTAL */}
        <div className={`rounded-2xl p-8 text-center shadow-lg border ${isDarkMode ? 'bg-gradient-to-br from-emerald-900/50 to-green-900/50 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-200'}`}>
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/20' : 'bg-white'}`}>
              <LeafIcon size={36} className="text-emerald-500" />
            </div>
          </div>
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tu impacto en el planeta</h3>
          <p className={`text-sm max-w-md mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Cada trayecto ecológico cuenta. Has ahorrado <strong className="text-emerald-500">{stats.co2Saved} kg de CO₂</strong> usando rutas sostenibles.
          </p>
          <button
            onClick={() => onNavigate('/user/statistics')}
            className={`mt-4 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            Ver Estadísticas →
          </button>
        </div>

        {/* FRASE MOTIVACIONAL */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            Cada pequeño cambio cuenta. ¡Sigue así!
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;