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
      icon: <MapIcon size={32} />,
      title: 'Planear Ruta',
      subtitle: 'Encuentra rutas ecológicas',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      onClick: () => onNavigate('user/plan-route')
    },
    {
      id: 'historial',
      icon: <ClockIcon size={32} />,
      title: 'Mi Historial',
      subtitle: 'Tu impacto ambiental',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      onClick: () => onNavigate('user/history')
    },
    {
      id: 'perfil',
      icon: <UsersIcon size={32} />,
      title: 'Mi Perfil',
      subtitle: 'Configura tu cuenta',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      onClick: () => onNavigate('user/profile')
    },
    {
      id: 'explorar',
      icon: <RouteIcon size={32} />,
      title: 'Explorar',
      subtitle: 'Puntos de interés',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      onClick: () => onNavigate('user/explore')
    },
    {
      id: 'alertas',
      icon: <ActivityIcon size={32} />,
      title: 'Alertas',
      subtitle: 'Clima en tiempo real',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      onClick: () => onNavigate('user/alerts')
    },
    {
      id: 'reportar',
      icon: <ReportIcon size={32} />,
      title: 'Reportar',
      subtitle: 'Problemas en rutas',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      onClick: () => onNavigate('user/report')
    }
  ];

  // Módulo de Admin (solo se muestra si userRole es admin)
  const adminModule = {
    id: 'admin',
    icon: <ShieldIcon size={32} />,
    title: 'Admin',
    subtitle: 'Panel de gestión',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    onClick: () => onNavigate('admin') // Navega al panel de admin
  };

  // Construir módulos según el rol
  const modules = userRole === "admin" 
    ? [...baseModules, adminModule] 
    : baseModules;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <LeafIcon size={24} white={true} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {userRole === "admin" ? "Dashboard Admin" : "Dashboard"}
              </h1>
              <p className="text-sm text-gray-500">
                {userRole === "admin" ? "EcoRuteando - Administrador" : "EcoRuteando - Usuario"}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </div>
      </header>

      {/* STATS */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black">{stats.routes}</p>
            <p className="text-sm text-gray-500">Rutas creadas</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black">{stats.trips}</p>
            <p className="text-sm text-gray-500">Viajes realizados</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black">{stats.co2Saved} kg</p>
            <p className="text-sm text-gray-500">CO₂ Ahorrado</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black">{stats.points}</p>
            <p className="text-sm text-gray-500">Puntos ecológicos</p>
          </div>
        </div>

        {/* MÓDULOS */}
        <h2 className="text-xl font-bold mb-6">
          {userRole === "admin" ? "Gestión del Sistema" : "Tus Herramientas"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={module.onClick}
              className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className={`w-16 h-16 ${module.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                <span className={module.iconColor}>{module.icon}</span>
              </div>
              <h3 className="text-lg font-bold">{module.title}</h3>
              <p className="text-sm text-gray-500">{module.subtitle}</p>
            </div>
          ))}
        </div>

        {/* IMPACTO AMBIENTAL */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold mb-3">🌱 Tu impacto en el planeta</h3>
          <p className="mb-4">
            Cada trayecto ecológico cuenta. Has ahorrado <strong>{stats.co2Saved} kg de CO₂</strong> usando rutas sostenibles.
          </p>
          <button
            onClick={() => onNavigate('user/statistics')}
            className="bg-white text-green-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-all"
          >
            Ver Estadísticas
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;