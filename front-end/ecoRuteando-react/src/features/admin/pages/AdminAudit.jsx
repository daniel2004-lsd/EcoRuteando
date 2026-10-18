import { useState, useEffect, useCallback } from "react";
import {
  ActivityIcon,
  ArrowLeft,
  SearchIcon,
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import { useTranslation } from "react-i18next";
import auditLogService from "../../../services/auditLogService";

const ACTION_STYLES = {
  CREATE: "bg-emerald-500/15 text-emerald-600 border-emerald-500/40",
  UPDATE: "bg-blue-500/15 text-blue-600 border-blue-500/40",
  DELETE: "bg-red-500/15 text-red-600 border-red-500/40",
  LOGIN: "bg-amber-500/15 text-amber-600 border-amber-500/40",
  default: "bg-gray-500/15 text-gray-600 border-gray-500/40",
};

const actionCategory = (action = "") => {
  const a = action.toUpperCase();
  if (a.includes("CREATE") || a.includes("ADD")) return "CREATE";
  if (a.includes("DELETE") || a.includes("REMOVE")) return "DELETE";
  if (a.includes("LOGIN") || a.includes("AUTH")) return "LOGIN";
  if (a.includes("UPDATE") || a.includes("CHANGE")) return "UPDATE";
  return "default";
};

const AdminAudit = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditLogService.getAuditLogs(300);
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando auditoría:", err);
      setError(t("adminAudit.loadError", "No se pudieron cargar los registros."));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso || "";
    }
  };

  const filtered = logs.filter((log) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (log.action || "").toLowerCase().includes(q) ||
      (log.userEmail || "").toLowerCase().includes(q) ||
      (log.entityName || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0B1215]' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>

      {/* Botón modo oscuro/claro */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isDarkMode ? '☀️' : "🌙"}
      </button>

      {/* HEADER */}
      <header className={`relative ${isDarkMode ? 'bg-[#162329] border-b border-emerald-500/30' : 'bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700'} shadow-lg overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isDarkMode ? 'bg-[#162329] border border-emerald-500/30' : 'bg-white'}`}>
                <ActivityIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t("adminAudit.title", "Auditoría del Sistema")}</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>{t("adminAudit.subtitle", "Registro de actividad de los usuarios")}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("/admin")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-[#162329]/50 text-emerald-400 border border-emerald-500/30 hover:bg-[#162329]' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft size={16} />
              {t("adminAudit.backToPanel", "Volver al Panel")}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Buscador */}
        <div className={`rounded-2xl p-4 mb-8 shadow-md border flex items-center gap-3 ${isDarkMode ? 'bg-[#162329] border-[#26383D]' : 'bg-white border-gray-100'}`}>
          <SearchIcon size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("adminAudit.searchPlaceholder", "Buscar por acción, usuario o entidad...")}
            className={`flex-1 bg-transparent text-sm outline-none ${isDarkMode ? 'text-[#e2e8f0] placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
          />
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
            {filtered.length} / {logs.length}
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadLogs} className="font-semibold underline">{t("adminAudit.retry", "Reintentar")}</button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className={`${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("adminAudit.loading", "Cargando registros...")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl ${isDarkMode ? 'bg-[#162329]' : 'bg-white'}`}>
            <span className={`block mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}><ActivityIcon size={48} /></span>
            <p className={`${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("adminAudit.empty", "Sin registros de auditoría")}</p>
          </div>
        ) : (
          <div className={`rounded-2xl shadow-md border overflow-hidden ${isDarkMode ? 'bg-[#162329] border-[#26383D]' : 'bg-white border-gray-100'}`}>
            {/* Cabecera tabla */}
            <div className={`hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase border-b ${isDarkMode ? 'bg-[#0B1215] border-[#26383D] text-[#94a3b8]' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
              <div className="col-span-3">{t("adminAudit.col.date", "Fecha")}</div>
              <div className="col-span-3">{t("adminAudit.col.action", "Acción")}</div>
              <div className="col-span-3">{t("adminAudit.col.user", "Usuario")}</div>
              <div className="col-span-3">{t("adminAudit.col.entity", "Entidad")}</div>
            </div>

            {filtered.map((log) => {
              const cat = actionCategory(log.action);
              return (
                <div
                  key={log.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 px-5 py-4 border-b last:border-b-0 ${isDarkMode ? 'border-[#26383D]' : 'border-gray-100'}`}
                >
                  <div className={`md:col-span-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatDate(log.createdAt)}
                  </div>
                  <div className="md:col-span-3">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${ACTION_STYLES[cat] || ACTION_STYLES.default}`}>
                      {log.action}
                    </span>
                  </div>
                  <div className={`md:col-span-3 text-sm break-all ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>
                    {log.userEmail || t("adminAudit.systemUser", "Sistema")}
                  </div>
                  <div className={`md:col-span-3 text-sm ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                    {log.entityName || "—"}
                    {log.entityId && (
                      <span className={`block text-xs break-all ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{log.entityId}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAudit;
