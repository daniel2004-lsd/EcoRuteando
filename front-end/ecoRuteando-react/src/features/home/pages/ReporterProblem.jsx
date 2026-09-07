import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ReportIcon,
  ArrowLeft,
  LeafIcon,
  MapPinIcon,
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import obstacleReportService from "../../../services/obstacleReportService";

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

const formatCoords = (lat, lng) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

const ReporterProblem = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const useGpsLocation = () => {
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
  };

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
      <header className={`relative ${isDarkMode ? 'bg-gray-800 border-b border-emerald-500/30' : 'bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700'} shadow-lg overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isDarkMode ? 'bg-gray-700 border border-emerald-500/30' : 'bg-white'}`}>
                <ReportIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t("reporterProblem.title", "Reportar Problema")}</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>{t("reporterProblem.subtitle", "Ayúdanos a mejorar las vías")}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate("/dashboard")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft />
              {t("reporterProblem.back", "Volver")}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Tarjeta del formulario */}
        <div className={`rounded-2xl shadow-md border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

          {/* Encabezado de la tarjeta */}
          <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              <span>⚠️</span> {t("reporterProblem.cardTitle", "Reportar incidente en la vía")}
            </h2>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t("reporterProblem.cardSubtitle", "Tu reporte ayuda a mantener las vías seguras para todos")}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Tipo de Problema */}
            <div className="mb-5">
              <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t("reporterProblem.reportTypeLabel", "Tipo de Problema")}
              </label>
              <select
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none ${isDarkMode ? 'bg-gray-700 border border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-400'}`}
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
              <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                📍 {t("reporterProblem.locationLabel", "Ubicación")}
              </label>
              <button
                type="button"
                onClick={useGpsLocation}
                disabled={gettingLocation}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 ${isDarkMode ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'}`}
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
                <div className={`mt-3 flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-sm ${isDarkMode ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  <span className="flex items-center gap-2">
                    <MapPinIcon size={14} />
                    {t("reporterProblem.locationCaptured", "Ubicación capturada")}: {formatCoords(location.lat, location.lng)}
                  </span>
                  <span>✓</span>
                </div>
              ) : locationError ? (
                <div className={`mt-3 px-4 py-2.5 rounded-lg text-sm ${isDarkMode ? 'bg-red-900/30 text-red-400 border border-red-500/30' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {locationError}
                </div>
              ) : (
                <p className={`mt-3 px-4 py-2.5 rounded-lg text-xs text-center ${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                  {t("reporterProblem.locationHint", "Indica el punto exacto del obstáculo para que nuestro equipo pueda validarlo")}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="mb-5">
              <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                📝 {t("reporterProblem.descriptionLabel", "Descripción")}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t("reporterProblem.descriptionPlaceholder", "Describe el problema con detalle (ubicación, magnitud, sugerencias)...")}
                rows={5}
                className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none resize-vertical ${isDarkMode ? 'bg-gray-700 border border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-400'}`}
              />
            </div>

            {/* Error de envío */}
            {submitError && (
              <div className={`mb-4 p-3 rounded-lg text-sm text-center ${isDarkMode ? 'bg-red-900/30 text-red-400 border border-red-500/30' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {submitError}
              </div>
            )}

            {/* Botón Enviar */}
            <button
              type="submit"
              disabled={isSubmitting || gettingLocation}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isSubmitting || submitted
                ? (isDarkMode ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-gray-400 text-white cursor-not-allowed')
                : (isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700')
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

            {/* Aviso de revisión */}
            <div className={`mt-4 p-3 rounded-lg text-xs text-center flex items-center justify-center gap-2 ${isDarkMode ? 'bg-amber-900/30 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
              <span>🕒</span>
              <span>{t("reporterProblem.reviewNotice", "Tu reporte será revisado por nuestro equipo antes de ser publicado.")}</span>
            </div>
          </form>
        </div>

        {/* Frase motivacional */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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