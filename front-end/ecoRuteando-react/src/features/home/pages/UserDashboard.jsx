import { useState, useEffect } from "react";
import { me } from "../../../services/authService";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../../src/app/context/LanguageContext";
import { useAuth } from "../../../app/context/AuthContext";
import {
  RouteIcon,
  LeafIcon,
  ArrowLeft,
  ActivityIcon,
  ClockIcon,
  UsersIcon,
  MapIcon,
  ReportIcon,
  ShieldIcon,
  HeartIcon
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import routeService from "../../../services/routeService";
import tripService from "../../../services/tripService";

const UserDashboard = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout, userRole } = useAuth();
  const [showBackModal, setShowBackModal] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    routes: 0,
    trips: 0,
    co2Saved: 0,
    points: 0
  });

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

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Impacto real basado en los TRAYECTOS del usuario (los viajes completados),
        // no en el número de rutas guardadas (bug: mostraba routes.length como "viajes").
        const [routes, trips] = await Promise.all([
          routeService.getAll(),
          tripService.getAll(),
        ]);

        const completedTrips = (Array.isArray(trips) ? trips : []).filter((t) => t.completed);
        const totalCO2 = completedTrips.reduce((sum, r) => sum + (r.actualCo2Kg || 0), 0);
        const totalKm = completedTrips.reduce((sum, r) => sum + (r.actualDistanceKm || 0), 0);

        setStats({
          routes: (Array.isArray(routes) ? routes : []).length,
          trips: completedTrips.length,
          co2Saved: totalCO2.toFixed(1),
          points: Math.round(totalKm * 10)
        });
      } catch (error) {
        console.error("Error cargando stats:", error);
      }
    };
    loadStats();
  }, []);

  // Función para cerrar sesión
  const handleBack = () => {
    setShowBackModal(true);
  };

  const confirmBack = async () => {
    await logout();
    onNavigate('/');
  };

  const baseModules = [
    {
      id: 'plan_ruta',
      icon: <MapIcon size={26} />,
      titleKey: 'dashboard.modules.planRoute.title',
      subtitleKey: 'dashboard.modules.planRoute.subtitle',
      onClick: () => onNavigate('/user/plan-route')
    },
    {
      id: 'historial',
      icon: <ClockIcon size={26} />,
      titleKey: 'dashboard.modules.history.title',
      subtitleKey: 'dashboard.modules.history.subtitle',
      onClick: () => onNavigate('/user/history')
    },
    {
      id: 'favoritos',
      icon: <HeartIcon size={26} />,
      titleKey: 'dashboard.modules.favorites.title',
      subtitleKey: 'dashboard.modules.favorites.subtitle',
      onClick: () => onNavigate('/user/favorites')
    },
    {
      id: 'perfil',
      icon: <UsersIcon size={26} />,
      titleKey: 'dashboard.modules.profile.title',
      subtitleKey: 'dashboard.modules.profile.subtitle',
      onClick: () => onNavigate('/profile')
    },
    {
      id: 'alertas',
      icon: <ActivityIcon size={26} />,
      titleKey: 'dashboard.modules.alerts.title',
      subtitleKey: 'dashboard.modules.alerts.subtitle',
      onClick: () => onNavigate('/user/alerts')
    },
    {
      id: 'reportar',
      icon: <ReportIcon size={26} />,
      titleKey: 'dashboard.modules.report.title',
      subtitleKey: 'dashboard.modules.report.subtitle',
      onClick: () => onNavigate('/user/reporter-problem')
    }
  ];

  const adminModule = {
    id: 'admin',
    icon: <ShieldIcon size={26} />,
    titleKey: 'dashboard.modules.admin.title',
    subtitleKey: 'dashboard.modules.admin.subtitle',
    onClick: () => onNavigate('/admin')
  };

  const modules = userRole === "admin"
    ? [...baseModules, adminModule]
    : baseModules;

  const statsCards = [
    { icon: <MapIcon size={20} />, value: stats.routes, labelKey: "dashboard.stats.routesCreated" },
    { icon: <ClockIcon size={20} />, value: stats.trips, labelKey: "dashboard.stats.tripsCompleted" },
    { icon: <LeafIcon size={20} />, value: `${stats.co2Saved} kg`, labelKey: "dashboard.stats.co2Saved" },
    { icon: <ActivityIcon size={20} />, value: stats.points, labelKey: "dashboard.stats.ecoPoints" },
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
      <header className={`relative ${isDarkMode ? 'bg-gray-800 border-b border-emerald-500/30' : 'bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700'} shadow-xl overflow-hidden`}>
        {/* Textura decorativa de fondo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -bottom-16 left-1/3 w-72 h-72 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-7">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {user ? (
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm ring-4 ring-white/30 flex items-center justify-center text-white text-xl font-black uppercase shadow-xl">
                  {user.firstName?.charAt(0)}
                </div>
              ) : (
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ring-4 ${isDarkMode ? 'bg-gray-700 ring-emerald-500/20' : 'bg-white ring-white/30'}`}>
                  <LeafIcon size={26} className="text-emerald-500" />
                </div>
              )}
              <div>
                {user ? (
                  <>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      {t("dashboard.welcome")}, {user.firstName}
                    </h1>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-100'}`}>{user.email}</p>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      {t("dashboard.guest", "Modo invitado")}
                    </h1>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-100'}`}>
                      {t("dashboard.guestHint", "Explora sin crear una cuenta")}
                    </p>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleBack}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg ${isDarkMode ? 'bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700' : 'bg-white/15 text-white hover:bg-white/25 border border-white/40 backdrop-blur-sm'}`}
            >
              <ArrowLeft size={16} />
              {t("dashboard.back")}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 -mt-4">
          {statsCards.map((card, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-100 hover:border-emerald-300'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${isDarkMode ? 'bg-emerald-500/20' : 'bg-gradient-to-br from-emerald-500 to-teal-500'}`}>
                  <span className={isDarkMode ? 'text-emerald-400' : 'text-white'}>{card.icon}</span>
                </div>
              </div>
              <span className={`block text-3xl font-black leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{card.value}</span>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t(card.labelKey)}</p>
            </div>
          ))}
        </div>

        {/* TÍTULO DE MÓDULOS */}
        <div className="text-center mb-8">
          <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
            {t("dashboard.tools.title")}
          </span>
          <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t("dashboard.tools.title")}</h2>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("dashboard.tools.subtitle")}</p>
        </div>

        {/* MÓDULOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={module.onClick}
              className={`group relative rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-100 hover:border-emerald-300'}`}
            >
              {/* Acento decorativo */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mt-10 -mr-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-100'}`}></div>

              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-transform duration-300 group-hover:scale-110 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
                  <span className={isDarkMode ? 'text-emerald-400' : 'text-white'}>{module.icon}</span>
                </div>
                <h3 className={`text-lg font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t(module.titleKey)}</h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t(module.subtitleKey)}</p>

                <div className={`mt-4 flex items-center gap-1.5 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  <span>{t("dashboard.modules.open") || "Abrir"}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* IMPACTO AMBIENTAL */}
        <div className={`relative rounded-3xl p-8 md:p-10 text-center shadow-xl border overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-emerald-900/50 to-green-900/50 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-200'}`}>
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-white blur-3xl"></div>
          </div>
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-emerald-500/20' : 'bg-white/20 backdrop-blur-sm'}`}>
                <LeafIcon size={36} className={isDarkMode ? 'text-emerald-400' : 'text-white'} />
              </div>
            </div>
            <h3 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-white'}`}>{t("dashboard.impact.title")}</h3>
            <p className={`text-sm max-w-md mx-auto ${isDarkMode ? 'text-gray-300' : 'text-emerald-50'}`}>
              {t("dashboard.impact.description")} <strong className={isDarkMode ? 'text-emerald-400' : 'text-white'}>{stats.co2Saved} kg de CO₂</strong> {t("dashboard.impact.descriptionEnd")}
            </p>
            <button
              onClick={() => onNavigate('/user/statistics')}
              className={`mt-6 px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-white text-emerald-700 hover:bg-emerald-50'}`}
            >
              {t("dashboard.impact.button")} →
            </button>
          </div>
        </div>

        {/* FRASE MOTIVACIONAL */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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