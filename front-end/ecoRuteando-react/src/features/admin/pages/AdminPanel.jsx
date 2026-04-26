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
  ClockIcon
} from "../../../shared/components/Icons";

const AdminPanel = ({ onNavigate, userRole }) => {
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
      bgColor: "from-teal-500 to-emerald-500",
      onClick: () => onNavigate("admin/users")
    },
    {
      id: "reports",
      icon: <ReportIcon size={28} />,
      title: "Reportes",
      subtitle: "Verificar y gestionar reportes",
      bgColor: "from-orange-500 to-red-500",
      onClick: () => onNavigate("admin/reports")
    },
    {
      id: "support",
      icon: <TicketIcon size={28} />,
      title: "Soporte",
      subtitle: "Tickets de ayuda y consultas",
      bgColor: "from-purple-500 to-pink-500",
      onClick: () => onNavigate("admin/support")
    },
    {
      id: "export",
      icon: <DownloadIcon size={28} />,
      title: "Exportar Datos",
      subtitle: "PDF, Excel y CSV",
      bgColor: "from-green-500 to-emerald-500",
      onClick: () => alert("Exportando datos...")
    },
    {
      id: "audit",
      icon: <ActivityIcon size={28} />,
      title: "Auditoría",
      subtitle: "Logs y actividad del sistema",
      bgColor: "from-amber-500 to-yellow-500",
      onClick: () => onNavigate("admin/audit")
    },
    {
      id: "settings",
      icon: <SettingsIcon size={28} />,
      title: "Configuración",
      subtitle: "Ajustes globales del sistema",
      bgColor: "from-gray-500 to-gray-600",
      onClick: () => onNavigate("admin/settings")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      
      {/* HEADER CON ESTILO NATURAL */}
      <header className="relative bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-40 -translate-y-40" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-40 translate-y-40" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* Círculo blanco con hoja */}
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <LeafIcon size={28} className="text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
                  <span className="px-3 py-1 text-xs font-bold bg-white/20 backdrop-blur-md text-white rounded-full border border-white/30">
                    ADMIN
                  </span>
                </div>
                <p className="text-emerald-100 text-sm">EcoRuteando - Sistema de gestión</p>
              </div>
            </div>
            
            <button
              onClick={() => onNavigate("dashboard")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold text-sm hover:bg-white/30 transition-all border border-white/30"
            >
              <ArrowLeft size={16} />
              Volver al Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* STATS CARDS - ESTILO NATURAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <UsersIcon size={22} className="text-teal-600" />
              </div>
              <span className="text-3xl font-black text-gray-800">{stats.users}</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">Usuarios</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <RouteIcon size={22} className="text-emerald-600" />
              </div>
              <span className="text-3xl font-black text-gray-800">{stats.routes}</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">Rutas</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ReportIcon size={22} className="text-orange-600" />
              </div>
              <span className="text-3xl font-black text-gray-800">{stats.reports}</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">Reportes</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TicketIcon size={22} className="text-purple-600" />
              </div>
              <span className="text-3xl font-black text-gray-800">{stats.tickets}</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">Tickets</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <LeafIcon size={22} white={true} />
              </div>
              <span className="text-3xl font-black">{stats.co2Saved} kg</span>
            </div>
            <p className="text-sm text-emerald-100 mt-3">CO₂ Ahorrado</p>
          </div>
        </div>

        {/* TÍTULO MÓDULOS */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md border border-emerald-200">
              <LeafIcon size={28} className="text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Módulos del Sistema</h2>
          <p className="text-gray-500 text-sm mt-1">Gestiona y controla toda la plataforma</p>
        </div>

        {/* MÓDULOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={module.onClick}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-emerald-100"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${module.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <span className="text-white">{module.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{module.title}</h3>
              <p className="text-sm text-gray-500">{module.subtitle}</p>
            </div>
          ))}
        </div>

        {/* IMPACTO AMBIENTAL Y ACCIONES PENDIENTES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Impacto Ambiental - ESTILO VERDE */}
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
              <h3 className="text-xl font-bold text-white mb-3">🌿 Impacto Ambiental</h3>
              <p className="text-emerald-100 text-sm mb-6">
                Gracias a los usuarios de EcoRuteando, se han ahorrado <strong className="text-white">{stats.co2Saved} kg de CO₂</strong> mediante el uso de rutas ecológicas.
              </p>
              <button
                onClick={() => onNavigate("admin/impact")}
                className="px-6 py-2.5 bg-white text-emerald-700 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Ver Estadísticas →
              </button>
            </div>
          </div>

          {/* Acciones Pendientes */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <ActivityIcon size={20} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">⚠️ Acciones Pendientes</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <ReportIcon size={18} className="text-orange-500" />
                  <div>
                    <p className="font-semibold text-gray-800">Reportes sin revisar</p>
                    <p className="text-xs text-gray-500">Requieren atención inmediata</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-orange-600">{stats.reports}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <TicketIcon size={18} className="text-purple-500" />
                  <div>
                    <p className="font-semibold text-gray-800">Tickets de soporte</p>
                    <p className="text-xs text-gray-500">Esperando respuesta</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-purple-600">{stats.tickets}</span>
              </div>
            </div>
            <button 
              onClick={() => onNavigate("admin/pending")}
              className="mt-4 w-full bg-emerald-50 text-emerald-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-100 transition-all"
            >
              Revisar todas →
            </button>
          </div>
        </div>

        {/* FRASE MOTIVACIONAL */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
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
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AdminPanel;