import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  DownloadIcon,
  LeafIcon,
  CalendarIcon,
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import toast from "react-hot-toast";
import exportService from "../../../services/exportService";
import downloadBlob from "../../../services/downloadFile";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminExports = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [activePreset, setActivePreset] = useState("all");
  const [statsData, setStatsData] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [exportingFormat, setExportingFormat] = useState(null);

  // Cargar vista previa de estadísticas según el rango seleccionado
  const loadPreview = useCallback(async (fromDate, toDate) => {
    setLoadingPreview(true);
    try {
      const data = await exportService.getStatsData({
        from: fromDate || null,
        to: toDate || null,
      });
      setStatsData(data);
    } catch (err) {
      console.warn("No se pudo cargar la vista previa de estadísticas:", err);
      // No bloquear la UI si la vista previa falla
    } finally {
      setLoadingPreview(false);
    }
  }, []);

  useEffect(() => {
    loadPreview(from, to);
  }, [from, to, loadPreview]);

  // Aplicar atajos de fechas rápidas
  const applyPreset = (preset) => {
    setActivePreset(preset);
    const today = new Date();
    const toStr = today.toISOString().slice(0, 10);

    if (preset === "all") {
      setFrom("");
      setTo("");
    } else if (preset === "7d") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      setFrom(d.toISOString().slice(0, 10));
      setTo(toStr);
    } else if (preset === "30d") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setFrom(d.toISOString().slice(0, 10));
      setTo(toStr);
    } else if (preset === "month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setFrom(firstDay.toISOString().slice(0, 10));
      setTo(toStr);
    }
  };

  // Generador de informe PDF formal
  const handleExportPdf = () => {
    if (!statsData) {
      toast.error("No hay datos disponibles para generar el informe PDF.");
      return;
    }
    setExportingFormat("pdf");
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Banda de encabezado institucional
      doc.setFillColor(16, 185, 129); // emerald-500
      doc.rect(0, 0, pageWidth, 26, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("ECORUTEANDO — SISTEMA DE MOVILIDAD SOSTENIBLE", 14, 12);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.text("Informe Ejecutivo Oficial de Estadísticas y Trazabilidad Operativa", 14, 20);

      // Metadatos del informe
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Fecha de emisión:", 14, 34);
      doc.setFont("helvetica", "normal");
      doc.text(new Date().toLocaleString("es-CO"), 48, 34);

      doc.setFont("helvetica", "bold");
      doc.text("Período evaluado:", 14, 40);
      doc.setFont("helvetica", "normal");
      const rangoStr = from || to ? `Desde: ${from || "Inicio"}  —  Hasta: ${to || "Hoy"}` : "Histórico consolidado completo";
      doc.text(rangoStr, 48, 40);

      doc.setFont("helvetica", "bold");
      doc.text("Carácter del documento:", 14, 46);
      doc.setFont("helvetica", "normal");
      doc.text("Documento oficial de control y auditoría administrativa", 55, 46);

      // Tabla 1: Indicadores Clave de Desempeño
      const resumen = statsData?.resumen || {};
      const kpiRows = [
        ["Total de rutas consultadas", String(resumen.rutasConsultadas ?? 0)],
        ["Usuarios activos registrados", String(resumen.usuariosActivos ?? 0)],
        ["Volumen total de CO₂ mitigado", `${Number(resumen.co2AhorradoKg ?? 0).toFixed(2)} kg`],
        ["Trayectos completados exitosamente", String(resumen.trayectosCompletados ?? 0)],
        ["Distancia promedio recorrida", `${Number(resumen.distanciaPromedioKm ?? 0).toFixed(2)} km`],
      ];

      autoTable(doc, {
        startY: 52,
        head: [["Indicador Clave de Desempeño (KPI)", "Valor Consolidado"]],
        body: kpiRows,
        theme: "striped",
        headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: "bold" },
        styles: { fontSize: 9, cellPadding: 3.5 },
      });

      // Tabla 2: Desglose por modo de movilidad
      const lastY1 = doc.lastAutoTable.finalY + 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(5, 150, 105);
      doc.text("1. Distribución por Modos de Movilidad Sostenible", 14, lastY1);

      const modeLabels = {
        car: "Automóvil",
        walking: "Caminata ecológica",
        bike: "Bicicleta",
        bicycle: "Bicicleta",
        public_transport: "Transporte público",
      };

      const modeRows = (statsData?.porModo || []).map((m) => [
        modeLabels[m.modo] || m.modo || "Sin especificar",
        String(m.trayectos ?? 0),
        `${Number(m.co2Kg ?? 0).toFixed(2)} kg`,
        String(m.usuarios ?? 0),
      ]);

      autoTable(doc, {
        startY: lastY1 + 3,
        head: [["Modo de Transporte", "Trayectos Registrados", "CO₂ Mitigado", "Usuarios Participantes"]],
        body: modeRows.length > 0 ? modeRows : [["Sin registros para el rango seleccionado", "-", "-", "-"]],
        theme: "striped",
        headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255], fontStyle: "bold" },
        styles: { fontSize: 8.5, cellPadding: 3 },
      });

      // Tabla 3: Evolución cronológica mensual
      const lastY2 = doc.lastAutoTable.finalY + 8;
      const startYMonthly = lastY2 > 230 ? (doc.addPage(), 20) : lastY2;

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(5, 150, 105);
      doc.text("2. Evolución Cronológica y Tendencias Mensuales", 14, startYMonthly);

      const monthlyRows = (statsData?.mensual || []).map((m) => [
        m.periodo || "-",
        String(m.trayectos ?? 0),
        `${Number(m.co2Kg ?? 0).toFixed(2)} kg`,
      ]);

      autoTable(doc, {
        startY: startYMonthly + 3,
        head: [["Período (Año - Mes)", "Trayectos Realizados", "CO₂ Ahorrado Acumulado"]],
        body: monthlyRows.length > 0 ? monthlyRows : [["Sin registros cronológicos en el rango", "-", "-"]],
        theme: "striped",
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: "bold" },
        styles: { fontSize: 8.5, cellPadding: 3 },
      });

      // Pie de página oficial en todas las páginas
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(156, 163, 175);
        doc.text(
          `EcoRuteando © 2026 · Certificación de Datos Oficiales · Página ${i} de ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: "center" }
        );
      }

      const fileName = `ecoruteando-informe-estadisticas-${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
      toast.success("¡Informe PDF oficial descargado exitosamente! 📄");
    } catch (err) {
      console.error("Error generando PDF:", err);
      toast.error("No se pudo generar el documento PDF. Intenta más tarde.");
    } finally {
      setExportingFormat(null);
    }
  };

  // Exportar Excel nativo (.xlsx)
  const handleExportExcel = async () => {
    setExportingFormat("xlsx");
    try {
      const result = await exportService.exportStats("xlsx", {
        from: from || null,
        to: to || null,
      });
      downloadBlob(result.blob, result.fileName);
      toast.success("¡Libro de cálculo Excel (.xlsx) descargado exitosamente! 📊");
    } catch (err) {
      console.error("Error exportando a Excel:", err);
      toast.error(err?.detail || "No se pudo generar el archivo Excel.");
    } finally {
      setExportingFormat(null);
    }
  };

  const modeLabel = (mode) => {
    const labels = {
      car: "Automóvil",
      walking: "Caminata",
      bike: "Bicicleta",
      bicycle: "Bicicleta",
      public_transport: "Transporte público",
    };
    return labels[mode] || mode || "Sin especificar";
  };

  const resumen = statsData?.resumen || {};

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
                <DownloadIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Centro de Exportación de Datos</h1>
                <p className={`text-sm ${isDarkMode ? "text-emerald-400" : "text-green-100"}`}>
                  Generación de informes ejecutivos e indicadores de movilidad en formatos oficiales Excel y PDF
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("/admin")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isDarkMode
                  ? "bg-[#162329]/50 text-emerald-400 border border-emerald-500/30 hover:bg-[#162329]"
                  : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              }`}
            >
              <ArrowLeft size={16} />
              Volver al Panel
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* 1. SECCIÓN DE FILTROS Y RANGO TEMPORAL */}
        <div className={`rounded-2xl p-6 shadow-md border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className={`text-base font-bold ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                Período y Rango del Reporte
              </h2>
              <p className={`text-xs ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"}`}>
                Selecciona un rango de fechas personalizado o utiliza uno de los atajos predefinidos
              </p>
            </div>

            {/* Atajos de tiempo */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Histórico Completo" },
                { id: "30d", label: "Últimos 30 días" },
                { id: "7d", label: "Últimos 7 días" },
                { id: "month", label: "Este mes" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    activePreset === p.id
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : isDarkMode
                      ? "bg-[#111C20] text-gray-300 border-[#26383D] hover:bg-[#162329]"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? "text-[#94a3b8]" : "text-gray-600"}`}>
                Fecha Inicial (Desde):
              </label>
              <div className="relative">
                <CalendarIcon size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? "text-[#94a3b8]" : "text-gray-400"}`} />
                <input
                  type="date"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setActivePreset("custom");
                  }}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode ? "bg-[#111C20] border-[#26383D] text-[#e2e8f0]" : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? "text-[#94a3b8]" : "text-gray-600"}`}>
                Fecha Final (Hasta):
              </label>
              <div className="relative">
                <CalendarIcon size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? "text-[#94a3b8]" : "text-gray-400"}`} />
                <input
                  type="date"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    setActivePreset("custom");
                  }}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode ? "bg-[#111C20] border-[#26383D] text-[#e2e8f0]" : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. VISTA PREVIA DETALLADA: ¿QUÉ VA A EXPORTAR EL ADMINISTRADOR? */}
        <div className={`rounded-2xl p-6 shadow-md border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <LeafIcon size={20} />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                  Vista Previa del Conjunto de Datos a Exportar
                </h2>
                <p className={`text-xs ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"}`}>
                  Revisa con claridad las métricas consolidadas que conformarán los archivos oficiales
                </p>
              </div>
            </div>

            {loadingPreview && (
              <span className="text-xs text-emerald-500 font-semibold animate-pulse">
                Actualizando indicadores...
              </span>
            )}
          </div>

          {/* Tarjetas de Indicadores Clave */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className={`p-4 rounded-xl border text-center ${isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-emerald-50/50 border-emerald-100"}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Rutas Consultadas
              </p>
              <p className={`text-xl font-bold mt-1 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                {resumen.rutasConsultadas ?? 0}
              </p>
            </div>

            <div className={`p-4 rounded-xl border text-center ${isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-emerald-50/50 border-emerald-100"}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Usuarios Activos
              </p>
              <p className={`text-xl font-bold mt-1 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                {resumen.usuariosActivos ?? 0}
              </p>
            </div>

            <div className={`p-4 rounded-xl border text-center ${isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-emerald-50/50 border-emerald-100"}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                CO₂ Mitigado
              </p>
              <p className="text-xl font-bold mt-1 text-emerald-500">
                {Number(resumen.co2AhorradoKg ?? 0).toFixed(1)} kg
              </p>
            </div>

            <div className={`p-4 rounded-xl border text-center ${isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-emerald-50/50 border-emerald-100"}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Trayectos Hechos
              </p>
              <p className={`text-xl font-bold mt-1 ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                {resumen.trayectosCompletados ?? 0}
              </p>
            </div>

            <div className={`p-4 rounded-xl border text-center ${isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-emerald-50/50 border-emerald-100"}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Distancia Media
              </p>
              <p className={`text-xl font-bold mt-1 ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                {Number(resumen.distanciaPromedioKm ?? 0).toFixed(1)} km
              </p>
            </div>
          </div>

          {/* Tabla de desgloses por modo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-800"}`}>
                <span>🚲</span> Desglose por Modos de Movilidad
              </h3>
              {Array.isArray(statsData?.porModo) && statsData.porModo.length > 0 ? (
                <div className="space-y-2">
                  {statsData.porModo.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-xs border ${
                        isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-200"
                      }`}
                    >
                      <span className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                        {modeLabel(item.modo)}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isDarkMode ? "bg-emerald-950 text-emerald-300" : "bg-emerald-100 text-emerald-800"}`}>
                          {item.trayectos} viajes
                        </span>
                        <span className="text-emerald-500 font-bold">
                          {Number(item.co2Kg || 0).toFixed(1)} kg CO₂
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-xs italic py-4 text-center ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                  No hay trayectos registrados para este rango.
                </p>
              )}
            </div>

            <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-800"}`}>
                <span>📅</span> Serie Cronológica Mensual
              </h3>
              {Array.isArray(statsData?.mensual) && statsData.mensual.length > 0 ? (
                <div className="space-y-2">
                  {statsData.mensual.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-xs border ${
                        isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-200"
                      }`}
                    >
                      <span className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                        Período: {item.periodo}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                          {item.trayectos} trayectos
                        </span>
                        <span className="text-emerald-500 font-bold">
                          {Number(item.co2Kg || 0).toFixed(1)} kg CO₂
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-xs italic py-4 text-center ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Sin serie mensual registrada en el período.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 3. SELECCIÓN EXCLUSIVA DE FORMATOS: SOLO EXCEL Y PDF */}
        <div className={`rounded-2xl p-6 shadow-lg border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
          <div className="mb-6">
            <h2 className={`text-base font-bold ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
              Descarga Oficial de Informes Administrativos
            </h2>
            <p className={`text-xs ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"}`}>
              Formatos oficiales adaptados para análisis gerencial, cálculo operativo y auditoría
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* OPCIÓN 1: EXCEL (.XLSX) */}
            <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all hover:border-emerald-500/50 ${
              isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gradient-to-br from-emerald-50/50 to-white border-emerald-200"
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-600/30 flex items-center justify-center text-emerald-600 text-2xl">
                    📊
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">
                    Libro Excel (.xlsx)
                  </span>
                </div>
                <h3 className={`text-base font-bold mb-1.5 ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                  Libro de Datos Microsoft Excel
                </h3>
                <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? "text-[#94a3b8]" : "text-gray-600"}`}>
                  Estructurado en 3 hojas de cálculo independientes: <strong>Resumen de KPIs</strong>, <strong>Desglose por Modos</strong> y <strong>Serie Histórica Mensual</strong>. Ideal para tablas dinámicas y reportería financiera.
                </p>
                <div className="space-y-1.5 mb-6 text-[11px]">
                  <div className={`flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <span className="text-emerald-500">✓</span> Compatibilidad con Microsoft Excel, Google Sheets y LibreOffice
                  </div>
                  <div className={`flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <span className="text-emerald-500">✓</span> Columnas con formato numérico y tipos de datos precisos
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!!exportingFormat}
                onClick={handleExportExcel}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-900/20 transition-all disabled:opacity-50"
              >
                <DownloadIcon size={18} />
                {exportingFormat === "xlsx" ? "Generando Libro Excel..." : "Descargar Libro Excel (.xlsx)"}
              </button>
            </div>

            {/* OPCIÓN 2: PDF (.PDF) */}
            <div className={`rounded-2xl p-5 border flex flex-col justify-between transition-all hover:border-red-500/50 ${
              isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gradient-to-br from-red-50/30 to-white border-red-200"
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-600 text-2xl">
                    📄
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-wider">
                    Documento PDF (.pdf)
                  </span>
                </div>
                <h3 className={`text-base font-bold mb-1.5 ${isDarkMode ? "text-[#e2e8f0]" : "text-gray-800"}`}>
                  Dossier Ejecutivo Oficial PDF
                </h3>
                <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? "text-[#94a3b8]" : "text-gray-600"}`}>
                  Documento formal con membrete corporativo, tablas de presentación ejecutiva de indicadores de sostenibilidad y certificación de auditoría del sistema.
                </p>
                <div className="space-y-1.5 mb-6 text-[11px]">
                  <div className={`flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <span className="text-red-500">✓</span> Listo para impresión y archivo institucional de gerencia
                  </div>
                  <div className={`flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <span className="text-red-500">✓</span> Sello de verificación, paginación y fecha de emisión oficial
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!!exportingFormat}
                onClick={handleExportPdf}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-900/20 transition-all disabled:opacity-50"
              >
                <DownloadIcon size={18} />
                {exportingFormat === "pdf" ? "Construyendo PDF Oficial..." : "Descargar Informe PDF (.pdf)"}
              </button>
            </div>

          </div>
        </div>

        {/* Pie y Lema Institucional */}
        <div className="text-center pt-2">
          <p className={`text-xs flex items-center justify-center gap-2 ${isDarkMode ? "text-[#94a3b8]" : "text-gray-500"}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            <span>EcoRuteando · Plataforma de Control y Gestión de Movilidad Sostenible</span>
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminExports;