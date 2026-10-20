import { useState, useEffect, useCallback } from "react";
import {
  ActivityIcon,
  ArrowLeft,
  SearchIcon,
  ClockIcon,
  UsersIcon,
  ShieldIcon,
  CloseIcon
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import { useTranslation } from "react-i18next";
import auditLogService from "../../../services/auditLogService";
import toast from "react-hot-toast";

const ACTION_CATEGORIES = {
  ALL: { label: "Todos", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  CREATE: { label: "Creación", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40" },
  UPDATE: { label: "Modificación", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/40" },
  DELETE: { label: "Eliminación", color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40" },
  LOGIN: { label: "Autenticación", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40" },
};

const getActionCategory = (action = "") => {
  const a = action.toUpperCase();
  if (a.includes("CREATE") || a.includes("ADD") || a.includes("REGISTER")) return "CREATE";
  if (a.includes("DELETE") || a.includes("REMOVE") || a.includes("PURGE")) return "DELETE";
  if (a.includes("LOGIN") || a.includes("AUTH") || a.includes("2FA") || a.includes("PASSWORD")) return "LOGIN";
  if (a.includes("UPDATE") || a.includes("CHANGE") || a.includes("EDIT") || a.includes("PATCH")) return "UPDATE";
  return "UPDATE";
};

const AdminAudit = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditLogService.getAuditLogs(300);
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando auditoría:", err);
      setError(t("adminAudit.loadError", "No se pudieron cargar los registros de auditoría."));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString("es-CO", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    } catch {
      return iso || "";
    }
  };

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const renderJsonPretty = (dataString) => {
    if (!dataString) return <span className="italic text-gray-400">Sin datos registrados</span>;
    try {
      const parsed = typeof dataString === "string" ? JSON.parse(dataString) : dataString;
      return (
        <pre className="text-[11px] font-mono leading-relaxed p-3 rounded-xl bg-black/40 text-emerald-300 overflow-x-auto max-h-48 custom-scrollbar">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return (
        <div className="text-xs p-3 rounded-xl bg-black/20 text-gray-300 font-mono break-all max-h-48 overflow-y-auto">
          {dataString}
        </div>
      );
    }
  };

  const filtered = logs.filter((log) => {
    const cat = getActionCategory(log.action);
    const matchesCat = categoryFilter === "ALL" || cat === categoryFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (log.action || "").toLowerCase().includes(q) ||
      (log.userEmail || "").toLowerCase().includes(q) ||
      (log.entityName || "").toLowerCase().includes(q) ||
      (log.sourceIp || "").toLowerCase().includes(q) ||
      (log.entityId || "").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0B1215]" : "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"}`}>
      {/* Botón modo oscuro/claro */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* HEADER */}
      <header className={`relative ${isDarkMode ? "bg-[#162329] border-b border-emerald-500/30" : "bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700"} shadow-lg overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isDarkMode ? "bg-[#162329] border border-emerald-500/30" : "bg-white"}`}>
                <ActivityIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Auditoría y Trazabilidad del Sistema</h1>
                <p className={`text-sm ${isDarkMode ? "text-emerald-400" : "text-green-100"}`}>
                  Registro detallado de acciones, seguridad e integridad operativa
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("admin")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isDarkMode ? "bg-[#162329]/50 text-emerald-400 border border-emerald-500/30 hover:bg-[#162329]" : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              }`}
            >
              <ArrowLeft size={16} />
              Volver al Panel
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* BARRA DE FILTROS Y BÚSQUEDA */}
        <div className={`p-4 sm:p-5 rounded-3xl border shadow-sm space-y-4 ${
          isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"
        }`}>
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Buscador */}
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por acción, usuario, IP, entidad o ID..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                  isDarkMode
                    ? "bg-[#111C20] border-[#26383D] text-white placeholder-gray-500"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400"
                }`}
              />
              <SearchIcon size={16} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
              <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? "bg-[#111C20] border-[#26383D] text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
                Mostrando: {filtered.length} de {logs.length} eventos
              </span>
              <button
                type="button"
                onClick={loadLogs}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-500 hover:underline"
              >
                Actualizar
              </button>
            </div>
          </div>

          {/* Categorías de acción */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {Object.entries(ACTION_CATEGORIES).map(([catKey, cat]) => (
              <button
                key={catKey}
                onClick={() => setCategoryFilter(catKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  categoryFilter === catKey
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : isDarkMode
                    ? "bg-[#111C20] text-gray-400 border-[#26383D] hover:bg-[#162329]"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* LISTADO DE EVENTOS DE AUDITORÍA */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Cargando registros de auditoría...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-center text-rose-600 text-sm">
            <p>{error}</p>
            <button onClick={loadLogs} className="mt-2 text-xs font-bold underline">Reintentar</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
            <span className="text-4xl block mb-2">📋</span>
            <h3 className="text-base font-bold mb-1">Sin registros que coincidan</h3>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Prueba cambiando los términos de búsqueda o los filtros de acción.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((log) => {
              const cat = getActionCategory(log.action);
              const catConfig = ACTION_CATEGORIES[cat] || ACTION_CATEGORIES.UPDATE;
              const isExpanded = expandedId === log.id;

              return (
                <div
                  key={log.id}
                  className={`rounded-2xl border transition-all shadow-sm overflow-hidden ${
                    isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"
                  }`}
                >
                  {/* Fila principal */}
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${catConfig.color}`}>
                          {log.action}
                        </span>
                        <span className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          • {formatDate(log.createdAt)}
                        </span>
                        {log.sourceIp && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                            isDarkMode ? "bg-[#111C20] border-[#26383D] text-gray-300" : "bg-gray-100 border-gray-200 text-gray-700"
                          }`}>
                            IP: {log.sourceIp}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400">Usuario:</span>
                          <span className={`font-semibold ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                            {log.userEmail || "Sistema Automático"}
                          </span>
                        </div>

                        {log.entityName && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400">Entidad:</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {log.entityName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botón para expandir más información */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                          isExpanded
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : isDarkMode
                            ? "bg-[#111C20] text-gray-300 border-[#26383D] hover:bg-[#162329]"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <span>{isExpanded ? "Ocultar Información" : "Mostrar Más Información"}</span>
                        <span className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        title="Abrir en modal completo"
                        className={`p-1.5 rounded-xl border transition-all ${
                          isDarkMode ? "border-[#26383D] text-gray-400 hover:text-white" : "border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        🔍
                      </button>
                    </div>
                  </div>

                  {/* PANEL EXPANDIBLE: MÁS INFORMACIÓN TÉCNICA */}
                  {isExpanded && (
                    <div className={`px-5 py-4 border-t space-y-4 animate-fadeIn text-xs ${
                      isDarkMode ? "bg-[#111C20]/70 border-[#26383D]" : "bg-gray-50/80 border-gray-100"
                    }`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-200"}`}>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">ID del Registro</span>
                          <span className="font-mono text-[11px] break-all select-all font-semibold text-emerald-500">
                            {log.id}
                          </span>
                        </div>

                        <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-200"}`}>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">ID de Usuario</span>
                          <span className="font-mono text-[11px] break-all select-all text-gray-700 dark:text-gray-300">
                            {log.userId || "—"}
                          </span>
                        </div>

                        <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-200"}`}>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">ID de Entidad Afectada</span>
                          <span className="font-mono text-[11px] break-all select-all text-gray-700 dark:text-gray-300">
                            {log.entityId || "—"}
                          </span>
                        </div>

                        <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-200"}`}>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Dirección IP y Origen</span>
                          <span className="font-mono text-[11px] font-semibold text-blue-500">
                            {log.sourceIp || "Interno / Local"}
                          </span>
                        </div>
                      </div>

                      {/* Dispositivo / User Agent */}
                      {log.userAgent && (
                        <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-200"}`}>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Dispositivo / User-Agent</span>
                          <p className="font-mono text-[11px] text-gray-700 dark:text-gray-300 break-all">
                            {log.userAgent}
                          </p>
                        </div>
                      )}

                      {/* Comparativa de cambios: BeforeData vs AfterData */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                              Datos Anteriores (BeforeData)
                            </span>
                            {log.beforeData && (
                              <button
                                type="button"
                                onClick={() => copyToClipboard(log.beforeData, "Datos Anteriores")}
                                className="text-[10px] text-emerald-500 hover:underline font-semibold"
                              >
                                Copiar
                              </button>
                            )}
                          </div>
                          {renderJsonPretty(log.beforeData)}
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                              Datos Posteriores / Cambios (AfterData)
                            </span>
                            {log.afterData && (
                              <button
                                type="button"
                                onClick={() => copyToClipboard(log.afterData, "Datos Nuevos")}
                                className="text-[10px] text-emerald-500 hover:underline font-semibold"
                              >
                                Copiar
                              </button>
                            )}
                          </div>
                          {renderJsonPretty(log.afterData)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DETALLADO PARA INSPECCIÓN COMPLETA */}
      {selectedLog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
              isDarkMode ? "bg-[#162329] border-[#26383D] text-white" : "bg-white border-gray-200 text-gray-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera */}
            <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? "border-[#26383D]" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <ActivityIcon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold">Detalle del Registro de Auditoría</h3>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {selectedLog.action} · {formatDate(selectedLog.createdAt)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-[#111C20] text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Contenido con scroll */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"}`}>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Usuario Responsable</span>
                  <p className="font-semibold text-sm text-emerald-500 mt-0.5">{selectedLog.userEmail || "Sistema"}</p>
                  <p className="font-mono text-[10px] text-gray-400 mt-1">ID: {selectedLog.userId || "—"}</p>
                </div>

                <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"}`}>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Entidad Afectada</span>
                  <p className="font-semibold text-sm mt-0.5">{selectedLog.entityName || "General"}</p>
                  <p className="font-mono text-[10px] text-gray-400 mt-1">ID: {selectedLog.entityId || "—"}</p>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border ${isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"}`}>
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Información de Red y Dispositivo</span>
                <p className="font-mono text-[11px] text-blue-400 mb-1">IP Origen: {selectedLog.sourceIp || "No registrada"}</p>
                <p className="font-mono text-[11px] text-gray-400 break-all">{selectedLog.userAgent || "No disponible"}</p>
              </div>

              {/* JSON Comparativo */}
              <div className="space-y-3">
                <div>
                  <span className="font-bold text-xs uppercase text-gray-400 block mb-1.5">Datos Anteriores</span>
                  {renderJsonPretty(selectedLog.beforeData)}
                </div>
                <div>
                  <span className="font-bold text-xs uppercase text-gray-400 block mb-1.5">Datos Posteriores / Cambios</span>
                  {renderJsonPretty(selectedLog.afterData)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAudit;
