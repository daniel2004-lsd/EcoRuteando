import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ReportIcon,
  ArrowLeft,
  LeafIcon,
  MapPinIcon,
  CheckCircle,
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import obstacleReportService from "../../../services/obstacleReportService";
import { NEIVA_COORDS } from "../../../services/weatherService";

const REPORT_TYPES = [
  "obstruction",
  "pothole",
  "signage",
  "traffic_light",
  "sewer",
  "lighting",
  "other",
];

const TYPE_META = {
  obstruction: "🚧",
  pothole: "🕳️",
  signage: "🚸",
  traffic_light: "🚦",
  sewer: "🌊",
  lighting: "💡",
  other: "📌",
};

const formatCoords = (lat, lng) => `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`;

// Cálculo de distancia euclidiana esférica (Haversine) en metros
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function formatDistance(meters) {
  if (meters == null) return null;
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return "Hace un momento";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} d`;
}

const ReporterProblem = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

  // Pestaña activa: "report" o "community"
  const [activeTab, setActiveTab] = useState("report");

  // Estado del formulario de creación
  const [formData, setFormData] = useState({
    reportType: "obstruction",
    description: "",
  });
  const [location, setLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Estado de validación comunitaria (CU22)
  const [activeReports, setActiveReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState(null);
  const [radiusFilter, setRadiusFilter] = useState("5"); // km (o "all")
  const [votingReportId, setVotingReportId] = useState(null);
  const [voteFeedback, setVoteFeedback] = useState({}); // { [reportId]: { message, type } }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const useGpsLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError(t("reporterProblem.errors.geolocationUnsupported", "Tu navegador no soporta geolocalización."));
      return;
    }

    setLocationError(null);
    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGettingLocation(false);
      },
      (err) => {
        console.error("Error obteniendo ubicación:", err);
        setGettingLocation(false);
        setLocationError(t("reporterProblem.errors.gpsFailed", "No se pudo obtener tu ubicación. Verifica los permisos del GPS."));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [t]);

  // Cargar reportes activos comunitarios
  const loadCommunityReports = useCallback(async () => {
    setLoadingReports(true);
    setReportsError(null);
    try {
      const userLat = location?.lat || NEIVA_COORDS.lat;
      const userLng = location?.lng || NEIVA_COORDS.lng;
      const radiusKm = radiusFilter === "all" ? null : parseFloat(radiusFilter);

      const data = await obstacleReportService.getActiveReports({
        latitude: userLat,
        longitude: userLng,
        radiusKm: radiusKm,
      });
      setActiveReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando reportes comunitarios:", err);
      setReportsError(t("reporterProblem.community.loadError", "No se pudieron cargar los reportes comunitarios."));
    } finally {
      setLoadingReports(false);
    }
  }, [location, radiusFilter, t]);

  // Cargar al cambiar a la pestaña comunitaria o cambiar filtros
  useEffect(() => {
    if (activeTab === "community") {
      loadCommunityReports();
    }
  }, [activeTab, radiusFilter, loadCommunityReports]);

  // Intentar obtener GPS automáticamente si no se tiene al abrir la pestaña comunitaria
  useEffect(() => {
    if (activeTab === "community" && !location && !gettingLocation) {
      useGpsLocation();
    }
  }, [activeTab, location, gettingLocation, useGpsLocation]);

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      setSubmitError(t("reporterProblem.errors.descriptionRequired", "Por favor describe el problema con detalle."));
      return;
    }

    if (!location) {
      setSubmitError(t("reporterProblem.errors.locationRequired", "Usa el GPS para indicar la ubicación del obstáculo."));
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await obstacleReportService.createReport({
        reportType: formData.reportType,
        description: formData.description,
        latitude: location.lat,
        longitude: location.lng,
        addressText: formatCoords(location.lat, location.lng),
      });

      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData({ reportType: "obstruction", description: "" });
        setLocation(null);
      }, 3000);
    } catch (err) {
      console.error("Error enviando reporte:", err);
      setIsSubmitting(false);
      setSubmitError(t("reporterProblem.errors.submitFailed", "No se pudo enviar el reporte. Intenta más tarde."));
    }
  };

  // Votar reporte comunitario (CU22)
  const handleVote = async (reportId, confirms) => {
    setVotingReportId(reportId);
    setVoteFeedback((prev) => ({ ...prev, [reportId]: null }));

    // Usar la ubicación actual del usuario para validar la restricción de ≤ 500m
    let voteLat = location?.lat;
    let voteLng = location?.lng;

    if (voteLat == null || voteLng == null) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
          });
        });
        voteLat = position.coords.latitude;
        voteLng = position.coords.longitude;
        setLocation({ lat: voteLat, lng: voteLng });
      } catch (e) {
        console.warn("No se pudo obtener GPS para votar:", e);
      }
    }

    try {
      const response = await obstacleReportService.voteReport(reportId, {
        confirms,
        latitude: voteLat,
        longitude: voteLng,
      });

      // Actualizar estado local del reporte
      setActiveReports((prev) =>
        prev.map((r) => {
          if (r.id === reportId) {
            return {
              ...r,
              confidenceScore: response.newConfidenceScore,
              effectiveConfidenceScore: response.newConfidenceScore,
              confirmationsCount: response.confirmationsCount,
              rejectionsCount: response.rejectionsCount,
              status: response.newStatus,
            };
          }
          return r;
        })
      );

      const successMsg = response.isCreatorVote
        ? t("reporterProblem.community.creatorVoteNotice", "Tu voto fue guardado (como creador no suma puntos extra)")
        : t("reporterProblem.community.voteSuccess", "¡Voto registrado!");

      setVoteFeedback((prev) => ({
        ...prev,
        [reportId]: { message: successMsg, type: "success" },
      }));
    } catch (err) {
      console.error("Error votando reporte:", err);
      const serverMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data ||
        "";

      let errorMsg = t("reporterProblem.community.loadError", "No se pudo registrar tu voto.");
      if (typeof serverMsg === "string" && serverMsg.toLowerCase().includes("500")) {
        errorMsg = t("reporterProblem.community.proximityWarning", "Debes estar a ≤ 500 m del incidente para validar");
      }

      setVoteFeedback((prev) => ({
        ...prev,
        [reportId]: { message: errorMsg, type: "error" },
      }));
    } finally {
      setVotingReportId(null);
    }
  };

  const getConfidenceBadgeColor = (score, status) => {
    if (status === "DISPUTED") {
      return isDarkMode
        ? "bg-rose-900/30 text-rose-300 border-rose-500/30"
        : "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (score >= 70 || status === "CONFIRMED") {
      return isDarkMode
        ? "bg-emerald-900/30 text-emerald-300 border-emerald-500/30"
        : "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (score >= 40) {
      return isDarkMode
        ? "bg-amber-900/30 text-amber-300 border-amber-500/30"
        : "bg-amber-50 text-amber-700 border-amber-200";
    }
    return isDarkMode
      ? "bg-slate-800 text-slate-300 border-slate-700"
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0B1215]" : "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"}`}>
      {/* Botón modo oscuro/claro */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Cambiar tema"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* HEADER */}
      <header className={`relative ${isDarkMode ? "bg-[#162329] border-b border-emerald-500/30" : "bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700"} shadow-lg overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isDarkMode ? "bg-[#162329] border border-emerald-500/30" : "bg-white"}`}>
                <ReportIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {activeTab === "report"
                    ? t("reporterProblem.title", "Reportar Problema")
                    : t("reporterProblem.community.title", "Validación Comunitaria de Incidentes")}
                </h1>
                <p className={`text-sm ${isDarkMode ? "text-emerald-400" : "text-green-100"}`}>
                  {activeTab === "report"
                    ? t("reporterProblem.subtitle", "Ayúdanos a mejorar las vías")
                    : t("reporterProblem.community.subtitle", "Confirma o descarta reportes cercanos para mantener seguras las vías")}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate("/dashboard")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? "bg-[#162329]/50 text-emerald-400 border border-emerald-500/30 hover:bg-[#1e293b]" : "bg-white/20 text-white hover:bg-white/30 border border-white/30"}`}
            >
              <ArrowLeft />
              {t("reporterProblem.back", "Volver")}
            </button>
          </div>

          {/* Selector de pestañas */}
          <div className="mt-6 flex gap-2 border-b border-white/10 pb-1">
            <button
              onClick={() => setActiveTab("report")}
              className={`px-4 py-2 font-semibold text-sm rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === "report"
                  ? "bg-white text-emerald-800 shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>📝</span>
              <span>{t("reporterProblem.tabReport", "Reportar Incidente")}</span>
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`px-4 py-2 font-semibold text-sm rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === "community"
                  ? "bg-white text-emerald-800 shadow-md"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>🤝</span>
              <span>{t("reporterProblem.tabCommunity", "Validación Comunitaria")}</span>
              {activeReports.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-emerald-600 text-white rounded-full">
                  {activeReports.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {activeTab === "report" ? (
          /* PESTAÑA 1: FORMULARIO DE REPORTE */
          <div className={`rounded-2xl shadow-md border overflow-hidden ${isDarkMode ? "bg-[#162329] border-emerald-800/20" : "bg-white border-gray-100"}`}>
            <div className={`px-6 py-4 border-b ${isDarkMode ? "border-emerald-800/20" : "border-gray-100"}`}>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                <span>⚠️</span> {t("reporterProblem.cardTitle", "Reportar incidente en la vía")}
              </h2>
              <p className={`text-xs ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"}`}>
                {t("reporterProblem.cardSubtitle", "Tu reporte ayuda a mantener las vías seguras para todos")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Tipo de Problema */}
              <div className="mb-5">
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"}`}>
                  {t("reporterProblem.reportTypeLabel", "Tipo de Problema")}
                </label>
                <select
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none ${isDarkMode ? "bg-[#162329] border border-gray-600 text-[#e2e8f0] focus:border-emerald-500" : "bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-400"}`}
                >
                  {REPORT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {TYPE_META[type]} {t(`reporterProblem.types.${type}`)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ubicación */}
              <div className="mb-5">
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"}`}>
                  📍 {t("reporterProblem.locationLabel", "Ubicación")}
                </label>
                <button
                  type="button"
                  onClick={useGpsLocation}
                  disabled={gettingLocation}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 ${isDarkMode ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30" : "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"}`}
                >
                  {gettingLocation ? (
                    <>
                      <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      {t("reporterProblem.gettingLocation", "Obteniendo tu ubicación...")}
                    </>
                  ) : (
                    <>
                      <MapPinIcon size={16} />
                      {t("reporterProblem.useGps", "Usar mi ubicación actual (GPS)")}
                    </>
                  )}
                </button>

                {location ? (
                  <div className={`mt-3 flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-sm ${isDarkMode ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                    <span className="flex items-center gap-2">
                      <MapPinIcon size={14} />
                      {t("reporterProblem.locationCaptured", "Ubicación capturada")}: {formatCoords(location.lat, location.lng)}
                    </span>
                    <span>✓</span>
                  </div>
                ) : locationError ? (
                  <div className={`mt-3 px-4 py-2.5 rounded-lg text-sm ${isDarkMode ? "bg-red-900/30 text-red-400 border border-red-500/30" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {locationError}
                  </div>
                ) : (
                  <p className={`mt-3 px-4 py-2.5 rounded-lg text-xs text-center ${isDarkMode ? "bg-[#162329] text-[#94a3b8]" : "bg-gray-50 text-gray-500"}`}>
                    {t("reporterProblem.locationHint", "Indica el punto exacto del obstáculo para que nuestro equipo pueda validarlo")}
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div className="mb-5">
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"}`}>
                  📝 {t("reporterProblem.descriptionLabel", "Descripción")}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t("reporterProblem.descriptionPlaceholder", "Describe el problema con detalle (ubicación, magnitud, sugerencias)...")}
                  rows={5}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none resize-vertical ${isDarkMode ? "bg-[#162329] border border-gray-600 text-[#e2e8f0] focus:border-emerald-500" : "bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-400"}`}
                />
              </div>

              {/* Error de envío */}
              {submitError && (
                <div className={`mb-4 p-3 rounded-lg text-sm text-center ${isDarkMode ? "bg-red-900/30 text-red-400 border border-red-500/30" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  {submitError}
                </div>
              )}

              {/* Botón Enviar */}
              <button
                type="submit"
                disabled={isSubmitting || gettingLocation}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isSubmitting || submitted
                    ? isDarkMode
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-gray-400 text-white cursor-not-allowed"
                    : isDarkMode
                    ? "bg-emerald-600 text-[#e2e8f0] hover:bg-emerald-700"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {isSubmitting ? (
                  <>{t("reporterProblem.submitting", "Enviando...")}</>
                ) : submitted ? (
                  <>{t("reporterProblem.submitted", "¡Reporte Enviado!")}</>
                ) : (
                  <>{t("reporterProblem.submit", "Enviar Reporte")}</>
                )}
              </button>

              {/* Aviso de revisión comunitaria */}
              <div className={`mt-4 p-3 rounded-lg text-xs text-center flex items-center justify-center gap-2 ${isDarkMode ? "bg-amber-900/30 text-amber-400 border border-amber-500/30" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                <span>🤝</span>
                <span>{t("reporterProblem.reviewNotice", "Tu reporte se publicará en la comunidad para que otros ciclistas y peatones puedan validarlo.")}</span>
              </div>
            </form>
          </div>
        ) : (
          /* PESTAÑA 2: VALIDACIÓN COMUNITARIA (CU22) */
          <div className="space-y-6">
            {/* Barra de control: Filtro de radio y estado de ubicación */}
            <div className={`p-4 rounded-2xl shadow-sm border flex flex-wrap items-center justify-between gap-4 ${isDarkMode ? "bg-[#162329] border-emerald-800/20" : "bg-white border-gray-100"}`}>
              <div className="flex items-center gap-3 flex-wrap">
                <label className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"}`}>
                  {t("reporterProblem.community.radiusLabel", "Radio")}:
                </label>
                <div className="flex gap-1.5">
                  {[
                    { label: "1 km", value: "1" },
                    { label: "3 km", value: "3" },
                    { label: "5 km", value: "5" },
                    { label: t("reporterProblem.community.radiusAll", "Toda la ciudad"), value: "all" },
                  ].map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRadiusFilter(r.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        radiusFilter === r.value
                          ? isDarkMode
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-emerald-600 text-white shadow-sm"
                          : isDarkMode
                          ? "bg-[#111C20] text-gray-300 hover:bg-[#1a2b32]"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={useGpsLocation}
                  disabled={gettingLocation}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    location
                      ? isDarkMode
                        ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : isDarkMode
                      ? "bg-amber-900/30 text-amber-400 border border-amber-500/30"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                  title={location ? "GPS activo" : "Activar GPS para calcular distancia"}
                >
                  <MapPinIcon size={14} />
                  <span>
                    {location
                      ? `${formatCoords(location.lat, location.lng)}`
                      : t("reporterProblem.community.gpsNeeded", "Activar GPS")}
                  </span>
                </button>

                <button
                  onClick={loadCommunityReports}
                  disabled={loadingReports}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isDarkMode
                      ? "bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/40 border border-emerald-500/30"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  <span className={loadingReports ? "animate-spin" : ""}>🔄</span>
                  <span>{t("reporterProblem.community.refresh", "Actualizar")}</span>
                </button>
              </div>
            </div>

            {/* Error o feedback */}
            {reportsError && (
              <div className={`p-4 rounded-xl text-sm border text-center ${isDarkMode ? "bg-red-900/30 text-red-400 border-red-500/30" : "bg-red-50 text-red-700 border-red-200"}`}>
                {reportsError}
              </div>
            )}

            {/* Estado de carga */}
            {loadingReports ? (
              <div className={`p-12 rounded-2xl border text-center space-y-3 ${isDarkMode ? "bg-[#162329] border-emerald-800/20" : "bg-white border-gray-100"}`}>
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {t("reporterProblem.community.loading", "Consultando reportes activos...")}
                </p>
              </div>
            ) : activeReports.length === 0 ? (
              /* Estado vacío */
              <div className={`p-12 rounded-2xl border text-center space-y-3 ${isDarkMode ? "bg-[#162329] border-emerald-800/20" : "bg-white border-gray-100"}`}>
                <span className="text-4xl block">✨</span>
                <h3 className={`text-base font-bold ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                  {t("reporterProblem.community.empty", "No hay obstáculos activos reportados en este radio.")}
                </h3>
                <p className={`text-xs ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"}`}>
                  {t("reporterProblem.community.emptyHint", "Sé el primero en reportar un incidente en la pestaña de Reportar.")}
                </p>
                <button
                  onClick={() => setActiveTab("report")}
                  className="mt-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all inline-block"
                >
                  {t("reporterProblem.tabReport", "Reportar Incidente")}
                </button>
              </div>
            ) : (
              /* Lista de reportes activos */
              <div className="space-y-4">
                {activeReports.map((report) => {
                  const distM =
                    location
                      ? getDistanceMeters(location.lat, location.lng, report.latitude, report.longitude)
                      : null;
                  const isWithin500m = distM != null ? distM <= 500 : true; // si no hay GPS, se valida al click
                  const feedback = voteFeedback[report.id];
                  const isVoting = votingReportId === report.id;
                  const score = report.effectiveConfidenceScore ?? report.confidenceScore ?? 40;

                  return (
                    <div
                      key={report.id}
                      className={`rounded-2xl shadow-sm border p-5 transition-all ${
                        isDarkMode
                          ? "bg-[#162329] border-emerald-800/20 hover:border-emerald-500/40"
                          : "bg-white border-gray-100 hover:border-emerald-300"
                      }`}
                    >
                      {/* Cabecera del reporte */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            {TYPE_META[report.reportType] || "📌"}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={`text-base font-bold ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                                {t(`reporterProblem.types.${report.reportType}`, report.reportType)}
                              </h3>
                              {report.isOwnReport && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isDarkMode ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-emerald-100 text-emerald-800"}`}>
                                  {t("reporterProblem.community.myReportBadge", "Tu reporte")}
                                </span>
                              )}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getConfidenceBadgeColor(
                                  score,
                                  report.status
                                )}`}
                              >
                                {report.status === "CONFIRMED"
                                  ? t("reporterProblem.community.statusConfirmed", "Confirmado")
                                  : report.status === "DISPUTED"
                                  ? t("reporterProblem.community.statusDisputed", "En disputa")
                                  : t("reporterProblem.community.statusActive", "Activo")}
                              </span>
                            </div>
                            <p className={`text-xs ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"} mt-0.5`}>
                              {formatTimeAgo(report.createdAt)}
                              {report.addressText ? ` · 📍 ${report.addressText}` : ""}
                            </p>
                          </div>
                        </div>

                        {/* Indicador de distancia GPS */}
                        {distM != null && (
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
                              isWithin500m
                                ? isDarkMode
                                  ? "bg-emerald-900/30 text-emerald-300 border-emerald-500/30"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isDarkMode
                                ? "bg-slate-800 text-slate-400 border-slate-700"
                                : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            <MapPinIcon size={12} />
                            <span>
                              {formatDistance(distM)} {isWithin500m ? "· En rango" : "· Lejos"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Descripción */}
                      {report.description && (
                        <p className={`mt-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                          {report.description}
                        </p>
                      )}

                      {/* Barra de Nivel de Confianza (CU22) */}
                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/60">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className={`font-semibold ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"}`}>
                            {t("reporterProblem.community.confidenceLabel", "Nivel de confianza")}:
                          </span>
                          <span className={`font-bold ${score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-rose-500"}`}>
                            {score} / 100 ({score}%)
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-gray-200"}`}>
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              score >= 70
                                ? "bg-gradient-to-r from-emerald-500 to-green-400"
                                : score >= 40
                                ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                : "bg-gradient-to-r from-rose-500 to-red-400"
                            }`}
                            style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
                          />
                        </div>

                        {/* Conteo de votos */}
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <span>👍</span> {report.confirmationsCount || 0}{" "}
                            {t("reporterProblem.community.confirmationsCount", "Confirmaciones")}
                          </span>
                          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                            <span>👎</span> {report.rejectionsCount || 0}{" "}
                            {t("reporterProblem.community.rejectionsCount", "Rechazos")}
                          </span>
                        </div>
                      </div>

                      {/* FEEDBACK DEL VOTO */}
                      {feedback && (
                        <div
                          className={`mt-3 p-2.5 rounded-lg text-xs border text-center flex items-center justify-center gap-2 ${
                            feedback.type === "success"
                              ? isDarkMode
                                ? "bg-emerald-950/60 text-emerald-300 border-emerald-800"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isDarkMode
                              ? "bg-rose-950/60 text-rose-300 border-rose-800"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {feedback.type === "success" && <CheckCircle size={14} />}
                          <span>{feedback.message}</span>
                        </div>
                      )}

                      {/* SECCIÓN "¿SIGUE OCURRIENDO?" */}
                      <div className={`mt-4 p-3.5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                        isDarkMode
                          ? "bg-[#111C20] border-emerald-500/20"
                          : "bg-emerald-50/50 border-emerald-100"
                      }`}>
                        <div className="text-center sm:text-left">
                          <p className={`text-xs font-bold ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                            {t("reporterProblem.community.stillHappening", "¿Sigue ocurriendo este obstáculo?")}
                          </p>
                          <p className={`text-[11px] ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {isWithin500m
                              ? "Valida para actualizar la visibilidad en el mapa"
                              : t("reporterProblem.community.proximityWarning", "Debes estar a ≤ 500 m del incidente para validar")}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleVote(report.id, true)}
                            disabled={isVoting}
                            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                              isVoting
                                ? "opacity-60 cursor-not-allowed bg-gray-400 text-white"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95"
                            }`}
                          >
                            <span>👍</span>
                            <span>{t("reporterProblem.community.confirmButton", "Sí, sigue ocurriendo")}</span>
                          </button>

                          <button
                            onClick={() => handleVote(report.id, false)}
                            disabled={isVoting}
                            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                              isVoting
                                ? "opacity-60 cursor-not-allowed bg-gray-400 text-white"
                                : isDarkMode
                                ? "bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 active:scale-95"
                                : "bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 active:scale-95"
                            }`}
                          >
                            <span>👎</span>
                            <span>{t("reporterProblem.community.rejectButton", "No, ya no está")}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Frase motivacional */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            {t("reporterProblem.footer", "Reportar problemas ayuda a construir una mejor movilidad para todos")}
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReporterProblem;