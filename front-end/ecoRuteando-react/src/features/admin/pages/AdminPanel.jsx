import { useState } from "react";
import {
  LeafIcon,
  ActivityIcon,
  ArrowLeft,
  UsersIcon,
  SettingsIcon,
  RouteIcon,
  TicketIcon,
  ReportIcon,
  DownloadIcon,
  ShieldIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";

const AdminPanel = ({ onNavigate, userRole }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const [stats] = useState({
    users: 245,
    routes: 67,
    reports: 23,
    tickets: 8,
    co2Saved: 1245.8
  });

  const modules = [
    {
      id: "users",
      icon: <UsersIcon size={28} />,
      title: "Gestión de Usuarios",
      subtitle: "Administrar cuentas y permisos",
      onClick: () => onNavigate("admin/users")
    },
    {
      id: "reports",
      icon: <ReportIcon size={28} />,
      title: "Reportes",
      subtitle: "Verificar y gestionar reportes",
      onClick: () => onNavigate("admin/reports")
    },
    {
      id: "support",
      icon: <TicketIcon size={28} />,
      title: "Soporte",
      subtitle: "Tickets de ayuda y consultas",
      onClick: () => onNavigate("admin/support")
    },
    {
      id: "export",
      icon: <DownloadIcon size={28} />,
      title: "Exportar Datos",
      subtitle: "PDF, Excel y CSV",
      onClick: () => alert("Exportando datos...")
    },
    {
      id: "audit",
      icon: <ActivityIcon size={28} />,
      title: "Auditoría",
      subtitle: "Logs y actividad del sistema",
      onClick: () => onNavigate("admin/audit")
    },
    {
      id: "settings",
      icon: <SettingsIcon size={28} />,
      title: "Configuración",
      subtitle: "Ajustes globales del sistema",
      onClick: () => onNavigate("admin/settings")
    }
  ];

  const pendingActions = [
    { id: "reports", icon: <ReportIcon size={18} />, label: "Reportes sin revisar", desc: "Requieren atención inmediata", count: stats.reports, color: "orange" },
    { id: "tickets", icon: <TicketIcon size={18} />, label: "Tickets de soporte", desc: "Esperando respuesta", count: stats.tickets, color: "purple" }
  ];

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
                <ShieldIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>EcoRuteando - Sistema de gestión</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate("dashboard")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft size={16} />
              Volver al Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Tarjeta de CO₂ Total */}
        <div className={`rounded-2xl p-6 mb-8 text-center shadow-lg border ${isDarkMode ? 'bg-gradient-to-br from-emerald-900/50 to-green-900/50 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-200'}`}>
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-emerald-500/20">
              <LeafIcon size={32} className="text-emerald-500" />
            </div>
          </div>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>CO₂ Total Ahorrado</h3>
          <p className={`text-4xl md:text-5xl font-black mt-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{stats.co2Saved} kg</p>
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Equivalente a plantar {Math.round(stats.co2Saved * 2)} árboles</p>
        </div>

        {/* Grid de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {/* Usuarios */}
          <div className={`rounded-xl p-4 text-center shadow-md transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700 hover:border-emerald-500/50' : 'bg-white border border-gray-100 hover:border-emerald-200'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <UsersIcon size={20} className="text-emerald-500" />
            </div>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.users}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Usuarios</p>
          </div>

          {/* Rutas */}
          <div className={`rounded-xl p-4 text-center shadow-md transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700 hover:border-emerald-500/50' : 'bg-white border border-gray-100 hover:border-emerald-200'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <RouteIcon size={20} className="text-emerald-500" />
            </div>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.routes}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rutas</p>
          </div>

          {/* Reportes */}
          <div className={`rounded-xl p-4 text-center shadow-md transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700 hover:border-emerald-500/50' : 'bg-white border border-gray-100 hover:border-emerald-200'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <ReportIcon size={20} className="text-emerald-500" />
            </div>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.reports}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reportes</p>
          </div>

          {/* Tickets */}
          <div className={`rounded-xl p-4 text-center shadow-md transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700 hover:border-emerald-500/50' : 'bg-white border border-gray-100 hover:border-emerald-200'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <TicketIcon size={20} className="text-emerald-500" />
            </div>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.tickets}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tickets</p>
          </div>

          {/* Puntos */}
          <div className={`rounded-xl p-4 text-center shadow-md transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700 hover:border-emerald-500/50' : 'bg-white border border-gray-100 hover:border-emerald-200'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <ShieldIcon size={20} className="text-emerald-500" />
            </div>
            <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>120</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Puntos ECO</p>
          </div>
        </div>

        {/* Título de módulos */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Módulos del Sistema</h2>
        </div>

        {/* Módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={module.onClick}
              className={`rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-100 hover:border-emerald-200'}`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <span className="text-emerald-500">{module.icon}</span>
              </div>
              <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{module.title}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{module.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Acciones Pendientes */}
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>⚠️ Acciones Pendientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {pendingActions.map((action) => (
            <div
              key={action.id}
              className={`rounded-2xl p-5 shadow-md transition-all hover:shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-100 hover:border-emerald-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/20' : action.color === 'orange' ? 'bg-orange-100' : 'bg-purple-100'}`}>
                    <span className={action.color === 'orange' ? 'text-orange-500' : 'text-purple-500'}>{action.icon}</span>
                  </div>
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{action.label}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{action.desc}</p>
                  </div>
                </div>
                <p className={`text-2xl font-black ${action.color === 'orange' ? 'text-orange-500' : 'text-purple-500'}`}>{action.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Impacto Ambiental */}
        <div className={`rounded-2xl p-6 text-center shadow-lg border ${isDarkMode ? 'bg-gradient-to-br from-emerald-900/50 to-green-900/50 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-200'}`}>
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-emerald-500/20">
              <LeafIcon size={32} className="text-emerald-500" />
            </div>
          </div>
          <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>🌿 Impacto Ambiental</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-md mx-auto`}>
            Gracias a los usuarios de EcoRuteando, se han ahorrado <strong className="text-emerald-500">{stats.co2Saved} kg de CO₂</strong> mediante el uso de rutas ecológicas.
          </p>
          <button
            onClick={() => onNavigate("admin/impact")}
            className={`mt-4 px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 mx-auto ${isDarkMode ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            Ver Estadísticas →
          </button>
        </div>

        {/* Frase motivacional */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            Cada acción cuenta para un futuro más verde
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;