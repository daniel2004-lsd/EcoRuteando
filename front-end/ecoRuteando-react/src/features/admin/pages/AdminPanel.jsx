import { useState } from "react";
import {
  LeafIcon,
  ActivityIcon,
  ArrowLeft,
  UsersIcon,
  SettingsIcon,
  TicketIcon,
  ReportIcon,
  DownloadIcon,
  ShieldIcon
} from "../../../shared/components/Icons";

const AdminPanel = ({ onNavigate, userRole }) => {
  const [stats] = useState({
    users: 1,
    routes: 2,
    reports: 2,
    tickets: 0,
    co2Saved: 1.5
  });

  const modules = [
    {
      id: "users",
      icon: <UsersIcon size={28} />,
      title: "Gestión de Usuarios",
      subtitle: "Administrar cuentas",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      onClick: () => onNavigate("admin/users")
    },
    {
      id: "export",
      icon: <DownloadIcon size={28} />,
      title: "Exportar Datos",
      subtitle: "PDF y Excel",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      onClick: () => alert("Exportando datos...")
    },
    {
      id: "audit",
      icon: <ActivityIcon size={28} />,
      title: "Auditoría",
      subtitle: "Logs del sistema",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      onClick: () => onNavigate("admin/audit")
    },
    {
      id: "support",
      icon: <TicketIcon size={28} />,
      title: "Soporte",
      subtitle: "Tickets de ayuda",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      onClick: () => onNavigate("admin/support")
    },
    {
      id: "settings",
      icon: <SettingsIcon size={28} />,
      title: "Configuración",
      subtitle: "Ajustes del sistema",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      onClick: () => onNavigate("admin/settings")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldIcon size={24} white={true} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Panel de Administración
                </h1>
                <span className="px-3 py-1 text-xs font-bold bg-purple-100 text-purple-600 rounded-full">
                  ADMIN
                </span>
              </div>
              <p className="text-sm text-gray-500">
                EcoRuteando - Sistema de gestión
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
            Volver al Dashboard
          </button>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black text-blue-600">{stats.users}</p>
            <p className="text-sm text-gray-500">Usuarios</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black text-green-600">{stats.routes}</p>
            <p className="text-sm text-gray-500">Rutas</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black text-red-600">{stats.reports}</p>
            <p className="text-sm text-gray-500">Reportes</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black text-purple-600">{stats.tickets}</p>
            <p className="text-sm text-gray-500">Tickets</p>
          </div>
        </div>

        {/* MÓDULOS DEL SISTEMA */}
        <h2 className="text-xl font-bold mb-6 text-gray-800">📦 Módulos del Sistema</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={module.onClick}
              className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 ${module.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                <span className={module.iconColor}>{module.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">{module.title}</h3>
              <p className="text-sm text-gray-500">{module.subtitle}</p>
            </div>
          ))}
        </div>

        {/* IMPACTO AMBIENTAL */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl p-8 text-white mb-6">
          <div className="flex items-center gap-2 mb-3">
            <LeafIcon size={24} white={true} />
            <h3 className="text-xl font-bold">Impacto Ambiental</h3>
          </div>
          <p className="mb-4">
            Gracias a los usuarios de EcoRuteando, se han ahorrado <strong>{stats.co2Saved} kg de CO₂</strong> mediante el uso de rutas ecológicas.
          </p>
          <button
            onClick={() => onNavigate("admin/impact")}
            className="bg-white text-green-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-all"
          >
            Ver Estadísticas →
          </button>
        </div>

        {/* ACCIONES PENDIENTES */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-bold mb-4 text-gray-800">⚠️ Acciones Pendientes</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3">
                <ReportIcon size={20} className="text-red-500" />
                <div>
                  <p className="font-semibold text-gray-800">Reportes sin revisar</p>
                  <p className="text-xs text-gray-500">Requieren atención</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-red-600">{stats.reports}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <TicketIcon size={20} className="text-purple-500" />
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
            className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Revisar todas →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;