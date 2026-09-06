import { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LeafIcon,
  ArrowLeft,
  UsersIcon,
  RouteIcon,
  ActivityIcon,
  ChartIcon,
  ClockIcon,
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import { useTranslation } from "react-i18next";
import statsService from "../../../services/statsService";

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#a78bfa", "#94a3b8"];

const AdminStatistics = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const loadStats = useCallback(async (fromVal, toVal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await statsService.getStats(fromVal || null, toVal || null);
      setStats(data);
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
      setError(t("adminStatistics.loadError", "Error al cargar estadísticas"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadStats("", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = () => {
    loadStats(from, to);
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    loadStats("", "");
  };

  const isEmpty = stats && stats.completedTrips === 0;

  const kpis = stats
    ? [
        {
          icon: <RouteIcon size={20} />,
          value: stats.totalRoutesConsulted,
          label: t("adminStatistics.kpi.routesConsulted", "Rutas consultadas"),
        },
        {
          icon: <UsersIcon size={20} />,
          value: stats.activeUsers,
          label: t("adminStatistics.kpi.activeUsers", "Usuarios activos"),
        },
        {
          icon: <LeafIcon size={20} />,
          value: `${stats.totalCo2SavedKg} kg`,
          label: t("adminStatistics.kpi.co2Saved", "CO₂ ahorrado"),
        },
        {
          icon: <ActivityIcon size={20} />,
          value: stats.completedTrips,
          label: t("adminStatistics.kpi.completedTrips", "Recorridos completos"),
        },
        {
          icon: <ClockIcon size={20} />,
          value: `${stats.averageDistanceKm.toFixed(1)} km`,
          label: t("adminStatistics.kpi.avgDistance", "Distancia media"),
        },
      ]
    : [];

  const chartModeLabel = (mode) =>
    mode
      ? t(`adminStatistics.transport.${mode}`, mode)
      : t("adminStatistics.transport.unknown", "Sin especificar");

  const axisColor = isDarkMode ? "#9ca3af" : "#6b7280";
  const gridColor = isDarkMode ? "#374151" : "#e5e7eb";

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>

      {/* Botón modo oscuro */}
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
                <span className="text-emerald-500"><ChartIcon size={24} /></span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t("adminStatistics.title", "Portal de Estadísticas")}</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>{t("adminStatistics.subtitle", "Impacto del sistema en números")}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("/admin")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft size={16} />
              {t("adminStatistics.backToPanel", "Volver al Panel")}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Filtro de fechas */}
        <div className={`rounded-2xl p-5 mb-8 shadow-md border flex flex-col md:flex-row md:items-end gap-4 flex-wrap ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("adminStatistics.from", "Desde")}</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={`px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
            />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("adminStatistics.to", "Hasta")}</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={`px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
            />
          </div>
          <button
            onClick={handleApply}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md"
          >
            {t("adminStatistics.apply", "Aplicar filtro")}
          </button>
          <button
            onClick={handleClear}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isDarkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
          >
            {t("adminStatistics.clear", "Limpiar")}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 font-bold">✕</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("adminStatistics.loading", "Cargando estadísticas...")}</p>
          </div>
        )}

        {/* Sin información (excepción CU08) */}
        {!loading && !error && isEmpty && (
          <div className={`text-center py-20 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <span className={`block mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}><ChartIcon size={48} /></span>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("adminStatistics.emptyTitle", "Sin información")}</p>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t("adminStatistics.emptyMessage", "No hay datos disponibles para el rango seleccionado")}</p>
          </div>
        )}

        {/* Contenido con datos */}
        {!loading && !error && !isEmpty && stats && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {kpis.map((kpi, index) => (
                <div key={index} className={`rounded-xl p-4 text-center shadow-md transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700 hover:border-emerald-500/50' : 'bg-white border border-gray-100 hover:border-emerald-200'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-emerald-500 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                    {kpi.icon}
                  </div>
                  <p className={`text-xl md:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{typeof kpi.value === "number" ? kpi.value.toLocaleString() : kpi.value}</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CO₂ mensual */}
              <div className={`rounded-2xl p-6 shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t("adminStatistics.chart.monthlyCo2", "CO₂ ahorrado por mes")}
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stats.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="period" stroke={axisColor} fontSize={12} />
                    <YAxis stroke={axisColor} fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", border: "1px solid #10b981", borderRadius: 8, color: isDarkMode ? "#fff" : "#111827" }}
                      formatter={(value) => [`${value} kg`, t("adminStatistics.chart.co2Kg", "CO₂")]}
                    />
                    <Bar dataKey="co2Kg" name={t("adminStatistics.chart.co2Kg", "CO₂")} fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Modos de transporte */}
              <div className={`rounded-2xl p-6 shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t("adminStatistics.chart.byMode", "Recorridos por modo de transporte")}
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={stats.byTransportMode}
                      dataKey="trips"
                      nameKey="mode"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      label={(entry) => chartModeLabel(entry.mode)}
                    >
                      {stats.byTransportMode.map((entry, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", border: "1px solid #10b981", borderRadius: 8, color: isDarkMode ? "#fff" : "#111827" }}
                      formatter={(value) => [value, t("adminStatistics.chart.trips", "Recorridos")]}
                    />
                    <Legend formatter={(value) => chartModeLabel(value)} wrapperStyle={{ color: isDarkMode ? "#fff" : "#111827" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminStatistics;