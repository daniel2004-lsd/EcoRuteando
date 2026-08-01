import { useState } from "react";
import { useEffect } from "react";
import { me } from "../../../services/authService";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../../src/app/context/LanguageContext";
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
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showBackModal, setShowBackModal] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {

    const loadUser = async () => {

      try {

        const response = await me();

        setUser(response);

      } catch (error) {

        console.error(error);

      }
    };

    loadUser();

  }, []);

  const [stats] = useState({
    routes: 5,
    trips: 12,
    co2Saved: 3.2,
    points: 120
  });

  // Función para volver
  const handleBack = () => {
    setShowBackModal(true);
  };

  const confirmBack = () => {
    onNavigate('/');
  };

  const baseModules = [
    {
      id: 'plan_ruta',
      icon: <MapIcon size={28} />,
      titleKey: 'dashboard.modules.planRoute.title',
      subtitleKey: 'dashboard.modules.planRoute.subtitle',
      onClick: () => onNavigate('/user/plan-route')
    },
    {
      id: 'historial',
      icon: <ClockIcon size={28} />,
      titleKey: 'dashboard.modules.history.title',
      subtitleKey: 'dashboard.modules.history.subtitle',
      onClick: () => onNavigate('/user/history')
    },
    {
      id: 'perfil',
      icon: <UsersIcon size={28} />,
      titleKey: 'dashboard.modules.profile.title',
      subtitleKey: 'dashboard.modules.profile.subtitle',
      onClick: () => onNavigate('/profile')
    },
    {
      id: 'alertas',
      icon: <ActivityIcon size={28} />,
      titleKey: 'dashboard.modules.alerts.title',
      subtitleKey: 'dashboard.modules.alerts.subtitle',
      onClick: () => onNavigate('/user/alerts')
    },
    {
      id: 'reportar',
      icon: <ReportIcon size={28} />,
      titleKey: 'dashboard.modules.report.title',
      subtitleKey: 'dashboard.modules.report.subtitle',
      onClick: () => onNavigate('/user/reporter-problem')
    }
  ];

  const adminModule = {
    id: 'admin',
    icon: <ShieldIcon size={28} />,
    titleKey: 'dashboard.modules.admin.title',
    subtitleKey: 'dashboard.modules.admin.subtitle',
    onClick: () => onNavigate('/admin')
  };

  const modules = userRole === "admin"
    ? [...baseModules, adminModule]
    : baseModules;

  const statsCards = [
    { icon: <MapIcon size={22} />, value: stats.routes, labelKey: "dashboard.stats.routesCreated" },
    { icon: <ClockIcon size={22} />, value: stats.trips, labelKey: "dashboard.stats.tripsCompleted" },
    { icon: <LeafIcon size={22} />, value: `${stats.co2Saved} kg`, labelKey: "dashboard.stats.co2Saved" },
    { icon: <ActivityIcon size={22} />, value: stats.points, labelKey: "dashboard.stats.ecoPoints" },
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
                <LeafIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t("dashboard.title")}</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>{t("dashboard.subtitle")}</p>
                {user && (
                  <div className="mt-2 text-white">
                    <p className="font-semibold">
                      {t("dashboard.welcome")}, {user.firstName}
                    </p>

                    <p className="text-sm opacity-90">
                      {user.email}
                    </p>

                    <p className="text-xs opacity-75">
                      Rol: {user.role}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleBack}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft size={16} />
              {t("dashboard.back")}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsCards.map((card, idx) => (
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
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t(card.labelKey)}</p>
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
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t("dashboard.tools.title")}</h2>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("dashboard.tools.subtitle")}</p>
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
              <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t(module.titleKey)}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t(module.subtitleKey)}</p>
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
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t("dashboard.impact.title")}</h3>
          <p className={`text-sm max-w-md mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t("dashboard.impact.description")} <strong className="text-emerald-500">{stats.co2Saved} kg de CO₂</strong> {t("dashboard.impact.descriptionEnd")}
          </p>
          <button
            onClick={() => onNavigate('/user/statistics')}
            className={`mt-4 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            {t("dashboard.impact.button")} →
          </button>
        </div>

        {/* FRASE MOTIVACIONAL */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            {t("dashboard.footer")}
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>

      {/* MODAL PARA VOLVER AL HOME */}
      {showBackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowBackModal(false)}>
          <div className={`max-w-md w-full rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className={`p-5 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} flex items-center gap-3`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                <span className="text-xl">⚠️</span>
              </div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t("dashboard.modal.title")}</h3>
            </div>
            <div className="p-5">
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t("dashboard.modal.message")}
              </p>
            </div>
            <div className={`p-5 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} flex gap-3`}>
              <button
                onClick={() => setShowBackModal(false)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {t("dashboard.modal.cancel")}
              </button>
              <button
                onClick={confirmBack}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                {t("dashboard.modal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;