import { useState } from "react";
import {
  ArrowLeft,
  DownloadIcon,
  LeafIcon,
  CalendarIcon,
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import exportService from "../../../services/exportService";
import downloadBlob from "../../../services/downloadFile";

const FORMATS = [
  { id: "csv", labelKey: "adminExports.formatCsv", color: "green" },
  { id: "xlsx", labelKey: "adminExports.formatXlsx", color: "teal" },
  { id: "json", labelKey: "adminExports.formatJson", color: "blue" },
];

const AdminExports = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [exporting, setExporting] = useState(null);

  const handleExport = async (format) => {
    if (exporting) return;
    setExporting(format);
    try {
      const result = await exportService.exportStats(format, {
        from: from || null,
        to: to || null,
      });
      downloadBlob(result.blob, result.fileName);
    } catch (err) {
      console.error("Error exportando estadísticas:", err);
      toast.error(err?.detail || t("adminExports.exportError", "No se pudo generar el archivo. Intenta más tarde."));
    } finally {
      setExporting(null);
    }
  };

  const buttonStyles = {
    green: isDarkMode
      ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30"
      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200",
    teal: isDarkMode
      ? "bg-teal-600/20 text-teal-400 hover:bg-teal-600/30 border border-teal-500/30"
      : "bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-200",
    blue: isDarkMode
      ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30"
      : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200",
  };

  const dateInputClass = `w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
    isDarkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-200 text-gray-800"
  }`;

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
                <DownloadIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t("adminExports.title", "Exportar Datos")}</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>{t("adminExports.subtitle", "Descarga informes del sistema en CSV, Excel o JSON")}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("/admin")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft size={16} />
              {t("adminExports.backToPanel", "Volver al Panel")}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Tarjeta de exportación de estadísticas */}
        <div className={`rounded-2xl p-6 shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex items-center gap-4 mb-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <LeafIcon size={24} className="text-emerald-500" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {t("adminExports.statsTitle", "Estadísticas del portal")}
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t("adminExports.statsSubtitle", "Rutas consultadas, CO₂ ahorrado y desgloses por modo de transporte y mes")}
              </p>
            </div>
          </div>

          {/* Filtro por rango de fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-6">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t("adminExports.from", "Desde")}
              </label>
              <div className="relative">
                <CalendarIcon size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className={`${dateInputClass} pl-9`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t("adminExports.to", "Hasta")}
              </label>
              <div className="relative">
                <CalendarIcon size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className={`${dateInputClass} pl-9`}
                />
              </div>
            </div>
          </div>

          {/* Formato de descarga */}
          <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-gray-900/40 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
            <p className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t("adminExports.formatsLabel", "Formato del archivo")}
            </p>
            <div className="flex flex-wrap gap-3">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => handleExport(fmt.id)}
                  disabled={!!exporting}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${buttonStyles[fmt.color]}`}
                >
                  <DownloadIcon size={16} />
                  {exporting === fmt.id
                    ? t("adminExports.exporting", "Generando...")
                    : t(fmt.labelKey)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className={`text-sm mt-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {t("adminExports.footnote", "Los archivos CSV y Excel abren directamente en herramientas de oficina; el JSON es ideal para integraciones técnicas.")}
        </p>

        {/* Frase motivacional */}
        <div className="mt-6 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            {t("adminExports.motivationalPhrase", "Los datos abiertos impulsan una movilidad más sostenible")}
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminExports;