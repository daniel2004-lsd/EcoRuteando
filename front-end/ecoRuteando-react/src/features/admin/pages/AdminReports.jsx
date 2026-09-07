import { useState, useEffect, useCallback } from "react";
import {
  ReportIcon,
  ArrowLeft,
  MapPinIcon,
  ClockIcon,
  CheckCircle,
  XIcon,
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import { useTranslation } from "react-i18next";
import obstacleReportService from "../../../services/obstacleReportService";

const TYPE_META = {
  obstruction: "🚧",
  pothole: "🕳️",
  signage: "🚸",
  traffic_light: "🚦",
  sewer: "🌊",
  lighting: "💡",
  other: "📌",
};

const STATUS_ORDER = ["pending", "under_review", "validated", "rejected"];

const STATUS_STYLES = {
  pending: "bg-amber-500/15 text-amber-600 border-amber-500/40",
  under_review: "bg-blue-500/15 text-blue-600 border-blue-500/40",
  validated: "bg-emerald-500/15 text-emerald-600 border-emerald-500/40",
  rejected: "bg-red-500/15 text-red-600 border-red-500/40",
};

const formatCoords = (lat, lng) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

const AdminReports = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [statusFilter, setStatusFilter] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviewingId, setReviewingId] = useState(null);
  const [action, setAction] = useState("validated");
  const [note, setNote] = useState("");
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obstacleReportService.getReportsForAdmin();
      setReports(data);
    } catch (err) {
      console.error("Error cargando reportes:", err);
      setError(t("adminReports.loadError", "No se pudieron cargar los reportes."));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = reports.filter((r) => r.status === status).length;
    return acc;
  }, {});

  const visibleReports =
    statusFilter === "all"
      ? reports
      : reports.filter((r) => r.status === statusFilter);

  const startReview = (report, actionValue) => {
    if (report.status === "validated" || report.status === "rejected") {
      setReviewingId(null);
      return;
    }
    setReviewingId(report.id);
    setAction(actionValue);
    setNote("");
    setActionError(null);
  };

  const handleReview = async (report) => {
    if (!note.trim() && action === "rejected") {
      setActionError(
        t("adminReports.noteRequiredReject", "Indica un motivo de rechazo.")
      );
      return;
    }

    setActing(true);
    setActionError(null);

    try {
      await obstacleReportService.validateReport(report.id, {
        status: action,
        validationNote: note.trim() || null,
      });
      setReviewingId(null);
      setNote("");
      await loadReports();
    } catch (err) {
      console.error("Error al revisar reporte:", err);
      setActionError(t("adminReports.actionFailed", "No se pudo guardar la revisión."));
    } finally {
      setActing(false);
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso || "";
    }
  };

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
                <ReportIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t("adminReports.title", "Verificación de Reportes")}</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>{t("adminReports.subtitle", "Revisa y valida los reportes ciudadanos")}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("/admin")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft size={16} />
              {t("adminReports.backToPanel", "Volver al Panel")}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Filtros por estado */}
        <div className={`rounded-2xl p-4 mb-8 shadow-md border flex flex-wrap gap-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${statusFilter === "all"
              ? (isDarkMode ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-600 text-white border-emerald-600')
              : (isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50')}`}
          >
            {t("adminReports.filter.all", "Todos")} ({reports.length})
          </button>
          {STATUS_ORDER.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${statusFilter === status
                ? (isDarkMode ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-600 text-white border-emerald-600')
                : (isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50')}`}
            >
              {t(`adminReports.status.${status}`)} ({counts[status] || 0})
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className={`mb-6 p-4 rounded-xl text-sm flex items-center justify-between ${isDarkMode ? 'bg-red-900/30 text-red-400 border border-red-500/30' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 font-bold">✕</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("adminReports.loading", "Cargando reportes...")}</p>
          </div>
        )}

        {/* Vacío */}
        {!loading && !error && visibleReports.length === 0 && (
          <div className={`text-center py-20 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <ReportIcon size={48} className="mx-auto mb-4 text-gray-300" />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("adminReports.empty", "No hay reportes en este estado.")}</p>
          </div>
        )}

        {/* Lista */}
        {!loading && !error && visibleReports.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visibleReports.map((report) => (
              <div key={report.id} className={`rounded-2xl p-6 shadow-md border flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

                {/* Encabezado de la tarjeta */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {TYPE_META[report.reportType] || "📌"}
                    </div>
                    <div>
                      <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {t(`reporterProblem.types.${report.reportType}`, report.reportType)}
                      </h3>
                      <p className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <ClockIcon size={12} /> {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_STYLES[report.status] || STATUS_STYLES.pending}`}>
                    {t(`adminReports.status.${report.status}`)}
                  </span>
                </div>

                {/* Descripción */}
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{report.description}</p>

                {/* Ubicación */}
                <div className={`flex items-start gap-2 px-4 py-3 rounded-lg text-xs mb-4 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'}`}>
                  <MapPinIcon size={14} className="mt-0.5 text-emerald-500" />
                  <div>
                    <p>{report.addressText || formatCoords(report.latitude, report.longitude)}</p>
                  </div>
                </div>

                {/* Foto (si existe) */}
                {report.photoUrl && (
                  <img
                    src={report.photoUrl}
                    alt={t("adminReports.photoAlt", "Foto del reporte")}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Nota de validación previa */}
                {(report.status === "validated" || report.status === "rejected") && (
                  <div className={`mb-4 rounded-lg p-3 text-xs flex items-start gap-2 ${report.status === "validated"
                    ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
                    : (isDarkMode ? 'bg-red-900/30 text-red-400 border border-red-500/30' : 'bg-red-50 text-red-700 border border-red-200')}`}>
                    <span className="mt-0.5">{report.status === "validated" ? "✅" : "❌"}</span>
                    <div>
                      {report.validationNote && <p>{report.validationNote}</p>}
                      {report.validatedAt && (
                        <p className="mt-1 opacity-80">{t("adminReports.reviewedOn", "Revisado el")} {formatDate(report.validatedAt)}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Interfaz de revisión (solo pendientes) */}
                {reviewingId === report.id && (
                  <div className={`mt-auto mb-4 rounded-lg p-4 border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAction("validated")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${action === "validated"
                            ? 'bg-emerald-600 text-white'
                            : (isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100')}`}
                        >
                          ✅ {t("adminReports.actionValidated", "Validar")}
                        </button>
                        <button
                          onClick={() => setAction("rejected")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${action === "rejected"
                            ? 'bg-red-600 text-white'
                            : (isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100')}`}
                        >
                          ❌ {t("adminReports.actionRejected", "Rechazar")}
                        </button>
                      </div>
                      <button
                        onClick={() => setReviewingId(null)}
                        className={`p-1.5 rounded-lg text-xs font-bold ${isDarkMode ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'}`}
                        aria-label={t("adminReports.cancel", "Cancelar")}
                      >
                        <XIcon />
                      </button>
                    </div>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={t("adminReports.notePlaceholder", "Nota de revisión (obligatoria si rechazas)...")}
                      rows={2}
                      className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white focus:border-emerald-500' : 'bg-white border-gray-300 text-gray-800 focus:border-emerald-400'}`}
                    />
                    {actionError && (
                      <p className={`mt-2 text-xs ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{actionError}</p>
                    )}
                    <button
                      onClick={() => handleReview(report)}
                      disabled={acting}
                      className={`mt-3 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 ${action === "validated" ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {acting
                        ? t("adminReports.saving", "Guardando...")
                        : action === "validated"
                          ? t("adminReports.confirmValidated", "Confirmar validación")
                          : t("adminReports.confirmRejected", "Confirmar rechazo")}
                    </button>
                  </div>
                )}

                {/* Botones para iniciar revisión */}
                {reviewingId !== report.id && (report.status === "pending" || report.status === "under_review") && (
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => startReview(report, "validated")}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                      <CheckCircle size={16} /> {t("adminReports.actionValidated", "Validar")}
                    </button>
                    <button
                      onClick={() => startReview(report, "rejected")}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {t("adminReports.actionRejected", "Rechazar")}
                    </button>
                  </div>
                )}

                {/* Reportes ya revisados */}
                {reviewingId !== report.id && (report.status === "validated" || report.status === "rejected") && (
                  <div className="mt-auto pt-2 text-center">
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t("adminReports.alreadyReviewed", "Reporte ya revisado")}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;