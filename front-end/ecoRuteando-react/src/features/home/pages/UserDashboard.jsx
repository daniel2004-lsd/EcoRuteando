import { useState, useEffect } from "react";
import { me } from "../../../services/authService";
import { useTranslation } from "react-i18next";
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

// ---------------------------------------------------------------------------
// Configuración de estilos por módulo.
//
// Por qué un objeto y no clases construidas con template strings:
// Tailwind escanea el código fuente en build-time buscando nombres de clase
// COMPLETOS y literales. Si arma "bg-" + color + "-500" en runtime, esa clase
// nunca aparece en el archivo fuente tal cual, así que el compilador JIT no
// la genera y el elemento queda sin estilo. Por eso cada variante se define
// como string completo aquí, una sola vez, y el render solo elige cuál usar.
//
// Además, esto separa la decisión de "qué color tiene cada módulo" de la
// lógica de render (Single Responsibility): si mañana agregan un módulo
// nuevo, solo se agrega una entrada acá, sin tocar el JSX.
// ---------------------------------------------------------------------------
const MODULE_STYLES = {
  plan_ruta: {
    icon: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
    iconDark: "bg-emerald-500/20 text-emerald-400"
  },
  mis_rutas: {
    icon: "bg-gradient-to-br from-cyan-500 to-sky-600 text-white",
    iconDark: "bg-cyan-500/20 text-cyan-400"
  },
  historial: {
    icon: "bg-gradient-to-br from-purple-500 to-violet-600 text-white",
    iconDark: "bg-purple-500/20 text-purple-400"
  },
  favoritos: {
    icon: "bg-gradient-to-br from-rose-500 to-red-500 text-white",
    iconDark: "bg-rose-500/20 text-rose-400"
  },
  perfil: {
    icon: "bg-gradient-to-br from-teal-500 to-cyan-700 text-white",
    iconDark: "bg-teal-500/20 text-teal-400"
  },
  alertas: {
    icon: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
    iconDark: "bg-amber-500/20 text-amber-400"
  },
  reportar: {
    icon: "bg-gradient-to-br from-emerald-700 to-green-800 text-white",
    iconDark: "bg-emerald-700/20 text-emerald-400"
  },
  admin: {
    icon: "bg-gradient-to-br from-slate-600 to-slate-800 text-white",
    iconDark: "bg-slate-600/20 text-slate-300"
  },
  default: {
    icon: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
    iconDark: "bg-emerald-500/20 text-emerald-400"
  }
};

// ---------------------------------------------------------------------------
// Subcomponentes de presentación.
//
// Reciben todo lo que necesitan por props (incluido `t` e `isDarkMode`) en
// vez de leer contexto o hooks por su cuenta. Esto es Inversión de
// Dependencias aplicada a nivel de componente: StatCard y ModuleCard no
// saben de dónde vienen sus datos, así que se pueden testear o reutilizar
// en otra pantalla sin arrastrar el resto del dashboard.
// ---------------------------------------------------------------------------
const StatCard = ({ icon, value, labelKey, isDarkMode, t }) => (
  <div
    className={`rounded-2xl p-5 shadow-sm border transition-colors ${
      isDarkMode ? 'bg-[#0B1215]/40 border-[#26383D]' : "bg-white border-gray-100"
    }`}
  >
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
        isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
      }`}
    >
      {icon}
    </div>
    <span className={`block text-3xl font-black leading-none mb-1 ${isDarkMode ? 'text-emerald-50' : "text-gray-800"}`}>
      {value}
    </span>
    <p className={`text-xs font-medium ${isDarkMode ? 'text-emerald-400/90' : "text-gray-500"}`}>{t(labelKey)}</p>
  </div>
);

const ModuleCard = ({ module, isDarkMode, t }) => {
  const style = MODULE_STYLES[module.id] ?? MODULE_STYLES.default;

  // role="button" + tabIndex + onKeyDown: un <div onClick> no es alcanzable
  // ni operable por teclado por defecto. Es un error de accesibilidad común
  // convertir un elemento clickeable en un div sin más; con esto el módulo
  // se puede enfocar con Tab y activar con Enter/Espacio, como un botón real.
  return (
    <div
      onClick={module.onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          module.onClick();
        }
      }}
      className={`group rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 hover:border-emerald-500/50"
          : "bg-white border-gray-100 hover:border-emerald-200"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? style.iconDark : style.icon}`}>
          {module.icon}
        </div>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-transform duration-200 group-hover:translate-x-0.5 ${
            isDarkMode ? 'bg-[#0B1215]/40 text-[#94a3b8]' : "bg-gray-50 text-gray-400"
          }`}
        >
          →
        </span>
      </div>
      <h3 className={`text-lg font-bold mb-1.5 ${isDarkMode ? 'text-emerald-50' : "text-gray-800"}`}>{t(module.titleKey)}</h3>
      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-emerald-400/90' : "text-gray-500"}`}>
        {t(module.subtitleKey)}
      </p>
    </div>
  );
};

const UserDashboard = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout, userRole } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    routes: 0,
    trips: 0,
    co2Saved: 0,
    points: 0
  });

  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      try {
        const response = await me();
        if (mounted) setUser(response);
      } catch (error) {
        // Sin token: modo invitado (no error, solo console)
        if (mounted) setUser(null);
      }
    };
    loadUser();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Impacto real basado en los TRAYECTOS del usuario (los viajes completados),
        // no en el número de rutas guardadas (bug: mostraba routes.length como "viajes").
        if (!user) return; // Modo invitado: no cargar stats
        const [routes, trips] = await Promise.all([routeService.getAll(), tripService.getAll()]);

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

  // Antes se llamaba handleBack/confirmBack/showBackModal, pero la función
  // en realidad cierra sesión (llama a logout()) y navega a "/". Ese nombre
  // era engañoso: alguien leyendo el código esperaría que "volver" solo
  // cambia de ruta, no que invalida la sesión. Nombrar por lo que la función
  // realmente hace evita ese tipo de sorpresas.
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    await logout();
    onNavigate("/");
  };

  const baseModules = [
    {
      id: "plan_ruta",
      icon: <MapIcon size={24} />,
      titleKey: "dashboard.modules.planRoute.title",
      subtitleKey: "dashboard.modules.planRoute.subtitle",
      onClick: () => onNavigate("/user/plan-route")
    },
    {
      id: "mis_rutas",
      icon: <RouteIcon size={24} />,
      titleKey: "dashboard.modules.routes.title",
      subtitleKey: "dashboard.modules.routes.subtitle",
      onClick: () => onNavigate("/user/routes")
    },
    {
      id: "historial",
      icon: <ClockIcon size={24} />,
      titleKey: "dashboard.modules.history.title",
      subtitleKey: "dashboard.modules.history.subtitle",
      onClick: () => onNavigate("/user/history")
    },
    {
      id: "favoritos",
      icon: <HeartIcon size={24} />,
      titleKey: "dashboard.modules.favorites.title",
      subtitleKey: "dashboard.modules.favorites.subtitle",
      onClick: () => onNavigate("/user/favorites")
    },
    {
      id: "perfil",
      icon: <UsersIcon size={24} />,
      titleKey: "dashboard.modules.profile.title",
      subtitleKey: "dashboard.modules.profile.subtitle",
      onClick: () => onNavigate("/profile")
    },
    {
      id: "alertas",
      icon: <ActivityIcon size={24} />,
      titleKey: "dashboard.modules.alerts.title",
      subtitleKey: "dashboard.modules.alerts.subtitle",
      onClick: () => onNavigate("/user/alerts")
    },
    {
      id: "reportar",
      icon: <ReportIcon size={24} />,
      titleKey: "dashboard.modules.report.title",
      subtitleKey: "dashboard.modules.report.subtitle",
      onClick: () => onNavigate("/user/reporter-problem")
    }
  ];

  const adminModule = {
    id: "admin",
    icon: <ShieldIcon size={24} />,
    titleKey: "dashboard.modules.admin.title",
    subtitleKey: "dashboard.modules.admin.subtitle",
    onClick: () => onNavigate("/admin")
  };

  const modules = userRole === "admin" ? [...baseModules, adminModule] : baseModules;

  const statsCards = [
    { icon: <MapIcon size={20} />, value: stats.routes, labelKey: "dashboard.stats.routesCreated" },
    { icon: <ClockIcon size={20} />, value: stats.trips, labelKey: "dashboard.stats.tripsCompleted" },
    { icon: <LeafIcon size={20} />, value: `${stats.co2Saved} kg`, labelKey: "dashboard.stats.co2Saved" },
    { icon: <ActivityIcon size={20} />, value: stats.points, labelKey: "dashboard.stats.ecoPoints" }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0B1215]' : "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"}`}>
      {/* BARRA SUPERIOR: marca, tema, cerrar sesión, avatar */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-sm ${
          isDarkMode ? 'bg-[#162329]/95 border-b border-[#26383D]' : "bg-white/95 border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shrink-0">
              <LeafIcon size={20} className="text-white" />
            </div>
            <div>
              <h1 className={`text-lg font-black leading-none ${isDarkMode ? 'text-emerald-50' : "text-gray-800"}`}>
                Ecoruteando
              </h1>
              </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogoutClick}
              aria-label={t("dashboard.logout", "Cerrar sesión")}
              className={`flex items-center justify-center rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                isDarkMode ? 'bg-[#162329] text-[#e2e8f0] hover:bg-[#26383D]' : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } sm:w-auto sm:px-4 sm:py-2.5 sm:text-sm`}
              title={t("dashboard.logout", "Cerrar sesión")}
            >
              <ArrowLeft size={18} className="sm:mr-2" />
              <span className="hidden sm:inline">{t("dashboard.logout", "Cerrar sesión")}</span>
            </button>

            {user && (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black uppercase shrink-0 ${
                  isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {user.firstName?.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* SALUDO + ESTADÍSTICAS */}
        <section
          className={`rounded-3xl p-6 md:p-8 shadow-lg border mb-10 ${
            isDarkMode ? 'bg-[#162329] border-[#26383D]' : "bg-white border-emerald-100"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
            <div>
              {user ? (
                <>
                  <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isDarkMode ? 'text-emerald-50' : "text-gray-800"}`}>
                    {t("dashboard.welcome", "Hola")}, {user.firstName}
                  </h2>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-emerald-400/90' : "text-gray-500"}`}>
                    {t("dashboard.panel.subtitle", "Tus rutas sostenibles, todo en un lugar.")}
                  </p>
                </>
              ) : (
                <>
                  <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isDarkMode ? 'text-emerald-50' : "text-gray-800"}`}>
                    {t("dashboard.guest", "Modo invitado")}
                  </h2>
                  <p className={`text-sm mt-2 ${isDarkMode ? 'text-emerald-400/90' : "text-gray-500"}`}>
                    {t("dashboard.guestHint", "Explora sin crear una cuenta")}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsCards.map((card) => (
              <StatCard key={card.labelKey} {...card} isDarkMode={isDarkMode} t={t} />
            ))}
          </div>
        </section>

        {/* TÍTULO DE MÓDULOS */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-emerald-50' : "text-gray-800"}`}>
              {t("dashboard.tools.title", "Tus herramientas")}
            </h2>
            <p className={`text-sm mt-2 ${isDarkMode ? 'text-emerald-400/90' : "text-gray-500"}`}>
              {t("dashboard.tools.subtitle", "Todo lo que necesitas para moverte mejor.")}
            </p>
          </div>
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-emerald-400/90' : "text-gray-400"}`}>
            {t("dashboard.tools.count", { defaultValue: "{{count}} módulos", count: modules.length })}
          </span>
        </div>

        {/* MÓDULOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} isDarkMode={isDarkMode} t={t} />
          ))}
        </div>

        {/* IMPACTO AMBIENTAL */}
        <section
          className={`relative rounded-3xl p-8 md:p-10 shadow-xl border overflow-hidden ${
            isDarkMode
              ? "bg-gradient-to-br from-emerald-900/50 to-green-900/50 border-emerald-500/30"
              : "bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-200"
          }`}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-4 ${
                  isDarkMode ? 'bg-[#162329]/40' : "bg-white/20 backdrop-blur-sm"
                }`}
              >
                <RouteIcon size={26} className="text-white" />
              </div>
              <span className={`inline-block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-emerald-400' : "text-emerald-100"}`}>
                {t("dashboard.impact.eyebrow", "Tu impacto ambiental")}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                {t("dashboard.impact.title", "Cada trayecto cuenta.")}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-[#cbd5e1]' : "text-emerald-50"}`}>
                {t("dashboard.impact.description", "Has evitado")}{" "}
                <strong className="text-white">{stats.co2Saved} kg de CO₂</strong>{" "}
                {t("dashboard.impact.descriptionEnd", "eligiendo rutas más verdes. Tu constancia hace la diferencia.")}
              </p>
            </div>

            <button
              onClick={() => onNavigate("/user/statistics")}
              className={`shrink-0 px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                isDarkMode ? 'bg-emerald-700 text-emerald-50 hover:bg-emerald-600' : "bg-white text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              {t("dashboard.impact.button", "Ver mis estadísticas")} →
            </button>
          </div>
        </section>

        {/* FRASE MOTIVACIONAL */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 font-medium ${isDarkMode ? 'text-emerald-400/90' : "text-gray-500"}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            {t("dashboard.footer", "Cada kilómetro cuenta para un planeta mejor")}
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>

      {/* TOGGLE TEMA: botón fijo abajo a la derecha */}
      <button
        onClick={toggleTheme}
        aria-label={t("dashboard.toggleTheme", "Cambiar tema")}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-lg transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        style={{
          background: isDarkMode ? 'linear-gradient(135deg, #0B1215, #162329)' : 'linear-gradient(135deg, #cde4d5, #f2f8f4)',
          color: isDarkMode ? '#4ade80' : '#2c5f3f',
          border: isDarkMode ? '2px solid rgba(52,211,153,0.3)' : '2px solid rgba(74,143,101,0.2)'
        }}
      >
        {isDarkMode ? '☀️' : "🌙"}
      </button>

      {/* MODAL DE CONFIRMACIÓN PARA CERRAR SESIÓN */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className={`max-w-md w-full rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#162329]' : "bg-white"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-5 border-b ${isDarkMode ? 'border-[#26383D]' : "border-gray-100"} flex items-center gap-3`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-yellow-900/30' : "bg-yellow-100"}`}>
                <span className="text-xl">⚠️</span>
              </div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-emerald-50' : "text-gray-800"}`}>{t("dashboard.modal.title")}</h3>
            </div>
            <div className="p-5">
              <p className={`${isDarkMode ? 'text-[#cbd5e1]' : "text-gray-600"}`}>{t("dashboard.modal.message")}</p>
            </div>
            <div className={`p-5 border-t ${isDarkMode ? 'border-[#26383D]' : "border-gray-100"} flex gap-3`}>
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isDarkMode ? 'bg-[#0B1215]/40 text-[#94a3b8] hover:bg-[#26383D]' : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t("dashboard.modal.cancel")}
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all bg-emerald-600 text-white hover:bg-emerald-700"
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
