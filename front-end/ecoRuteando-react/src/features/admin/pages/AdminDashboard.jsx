import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LeafIcon,
  ActivityIcon,
  ArrowLeft,
  UsersIcon,
  MessageCircleIcon,
  SettingsIcon,
  RouteIcon,
  TicketIcon,
  ClockIcon,
  ReportIcon,
  DownloadIcon
} from "../../../shared/components/Icons.jsx";

const AdminDashboard = ({ onNavigate, userRole }) => {
  const { t } = useTranslation();

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
      icon: <UsersIcon size={32} />,
      title: t("admin.dashboard.modules.users.title", "Gestión de Usuarios"),
      subtitle: t("admin.dashboard.modules.users.subtitle", "Administrar cuentas"),
      onClick: () => onNavigate("admin/users")
    },
    {
      id: "reports",
      icon: <ReportIcon size={32} />,
      title: t("admin.dashboard.modules.reports.title", "Reportes"),
      subtitle: t("admin.dashboard.modules.reports.subtitle", "Verificar reportes"),
      onClick: () => onNavigate("admin/reports")
    },
    {
      id: "support",
      icon: <MessageCircleIcon size={32} />,
      title: t("admin.dashboard.modules.support.title", "Soporte"),
      subtitle: t("admin.dashboard.modules.support.subtitle", "Tickets de ayuda"),
      onClick: () => onNavigate("admin/support")
    },
    {
      id: "export",
      icon: <DownloadIcon size={32} />,
      title: t("admin.dashboard.modules.export.title", "Exportar Datos"),
      subtitle: t("admin.dashboard.modules.export.subtitle", "PDF y Excel"),
      onClick: () => alert(t("admin.dashboard.exporting", "Exportando..."))
    },
    {
      id: "audit",
      icon: <ActivityIcon size={32} />,
      title: t("admin.dashboard.modules.audit.title", "Auditoría"),
      subtitle: t("admin.dashboard.modules.audit.subtitle", "Logs del sistema"),
      onClick: () => onNavigate("admin/audit")
    },
    {
      id: "settings",
      icon: <SettingsIcon size={32} />,
      title: t("admin.dashboard.modules.settings.title", "Configuración"),
      subtitle: t("admin.dashboard.modules.settings.subtitle", "Ajustes del sistema"),
      onClick: () => onNavigate("admin/settings")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">

      {/* HEADER ESTILO USER + ADMIN BADGE */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <LeafIcon size={24} white={true} />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {t("admin.dashboard.title", "Admin Dashboard")}
                </h1>

                {/* 🔥 BADGE ADMIN */}
                {userRole === "admin" && (
                  <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-600 rounded-full">
                    ADMIN
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500">
                {t("admin.dashboard.controlPanelSubtitle", "Panel de control del sistema")}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-red-600 text-red-600 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
            {t("admin.dashboard.back", "Volver")}
          </button>
        </div>
      </header>

      {/* STATS */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black">{stats.users}</p>
            <p className="text-sm text-gray-500">{t("admin.dashboard.stats.users", "Usuarios")}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black">{stats.routes}</p>
            <p className="text-sm text-gray-500">{t("admin.dashboard.stats.routes", "Rutas")}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black">{stats.reports}</p>
            <p className="text-sm text-gray-500">{t("admin.dashboard.stats.reports", "Reportes")}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black">{stats.tickets}</p>
            <p className="text-sm text-gray-500">{t("admin.dashboard.stats.tickets", "Tickets")}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <p className="text-3xl font-black">{stats.co2Saved} kg</p>
            <p className="text-sm text-gray-500">{t("admin.dashboard.stats.co2", "CO₂")}</p>
          </div>

        </div>

        {/* MODULES */}
        <h2 className="text-xl font-bold mb-6">{t("admin.dashboard.administrationPanel", "Panel de administración")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((m) => (
            <div
              key={m.id}
              onClick={m.onClick}
              className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
            >
              {m.icon}
              <h3 className="text-lg font-bold mt-3">{m.title}</h3>
              <p className="text-sm text-gray-500">{m.subtitle}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;