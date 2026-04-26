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

const UserDashboard = ({ onNavigate, userRole }) => {
  const [stats, setStats] = useState({
    routes: 5,
    trips: 12,
    co2Saved: 3.2,
    points: 120
  });

  // Módulos base para todos los usuarios
  const baseModules = [
    {
      id: 'plan_ruta',
      icon: <MapIcon size={28} />,
      title: 'Planear Ruta',
      subtitle: 'Encuentra rutas ecológicas',
      bgColor: 'from-green-500 to-emerald-500',
      iconColor: 'text-white',
      onClick: () => onNavigate('user/plan-route')
    },
    {
      id: 'historial',
      icon: <ClockIcon size={28} />,
      title: 'Mi Historial',
      subtitle: 'Tu impacto ambiental',
      bgColor: 'from-blue-500 to-cyan-500',
      iconColor: 'text-white',
      onClick: () => onNavigate('user/history')
    },
    {
      id: 'perfil',
      icon: <UsersIcon size={28} />,
      title: 'Mi Perfil',
      subtitle: 'Configura tu cuenta',
      bgColor: 'from-purple-500 to-pink-500',
      iconColor: 'text-white',
      onClick: () => onNavigate('profile')
    },
    {
      id: 'explorar',
      icon: <RouteIcon size={28} />,
      title: 'Explorar',
      subtitle: 'Puntos de interés',
      bgColor: 'from-teal-500 to-cyan-500',
      iconColor: 'text-white',
      onClick: () => onNavigate('user/explore')
    },
    {
      id: 'alertas',
      icon: <ActivityIcon size={28} />,
      title: 'Alertas',
      subtitle: 'Clima en tiempo real',
      bgColor: 'from-yellow-500 to-orange-500',
      iconColor: 'text-white',
      onClick: () => onNavigate('user/alerts')
    },
    {
      id: 'reportar',
      icon: <ReportIcon size={28} />,
      title: 'Reportar',
      subtitle: 'Problemas en rutas',
      bgColor: 'from-red-500 to-rose-500',
      iconColor: 'text-white',
      onClick: () => onNavigate('user/report')
    }
  ];

  // Módulo de Admin - solo una tarjeta para acceder al panel
  const adminModule = {
    id: 'admin',
    icon: <ShieldIcon size={28} />,
    title: 'Admin',
    subtitle: 'Panel de gestión',
    bgColor: 'from-purple-600 to-indigo-600',
    iconColor: 'text-white',
    onClick: () => onNavigate('admin')
  };

  const modules = userRole === "admin" 
    ? [...baseModules, adminModule] 
    : baseModules;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      
      {/* HEADER */}
      <header className="relative bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-40 -translate-y-40" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-40 translate-y-40" />
        
        <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Círculo blanco con hoja */}
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <LeafIcon size={24} className="text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-green-100 text-sm">EcoRuteando - Usuario</p>
              </div>
            </div>
            
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold text-sm hover:bg-white/30 transition-all border border-white/30"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MapIcon size={22} className="text-green-600" />
              </div>
              <span className="text-3xl font-black text-gray-800">{stats.routes}</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">Rutas creadas</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ClockIcon size={22} className="text-blue-600" />
              </div>
              <span className="text-3xl font-black text-gray-800">{stats.trips}</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">Viajes realizados</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <LeafIcon size={22} className="text-emerald-600" />
              </div>
              <span className="text-3xl font-black text-gray-800">{stats.co2Saved} kg</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">CO₂ Ahorrado</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ActivityIcon size={22} className="text-purple-600" />
              </div>
              <span className="text-3xl font-black text-gray-800">{stats.points}</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">Puntos ecológicos</p>
          </div>
        </div>

        {/* TÍTULO DE MÓDULOS */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md border border-green-200">
              <LeafIcon size={24} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Tus Herramientas</h2>
          <p className="text-gray-500 text-sm mt-1">Todo lo que necesitas para una movilidad sostenible</p>
        </div>

        {/* MÓDULOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={module.onClick}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-gray-100"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${module.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <span className={module.iconColor}>{module.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{module.title}</h3>
              <p className="text-sm text-gray-500">{module.subtitle}</p>
            </div>
          ))}
        </div>

        {/* IMPACTO AMBIENTAL - ESTILO VERDE NATURAL */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-green-700" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-20 translate-y-20" />
          <div className="relative z-10 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl animate-float">
                <LeafIcon size={32} className="text-emerald-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">🌱 Tu impacto en el planeta</h3>
            <p className="text-emerald-100 text-sm md:text-base mb-6 max-w-2xl mx-auto">
              Cada trayecto ecológico cuenta. Has ahorrado <strong className="text-white">{stats.co2Saved} kg de CO₂</strong> usando rutas sostenibles.
            </p>
            <button
              onClick={() => onNavigate('user/statistics')}
              className="px-6 py-2.5 bg-white text-emerald-700 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Ver Estadísticas →
            </button>
          </div>
        </div>

        {/* FRASE MOTIVACIONAL */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <LeafIcon size={14} className="text-emerald-500" />
            Cada pequeño cambio cuenta. ¡Sigue así!
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default UserDashboard;