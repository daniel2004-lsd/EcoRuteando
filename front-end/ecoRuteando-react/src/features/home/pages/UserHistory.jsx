import { useState, useEffect } from "react";
import { LeafIcon, ArrowLeft, ClockIcon, MapPinIcon, CalendarIcon, DownloadIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import tripService from "../../../services/tripService";
import exportService from "../../../services/exportService";
import downloadBlob from "../../../services/downloadFile";
import toast from "react-hot-toast";

const UserHistory = ({ onNavigate }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await tripService.getAll();
            setTrips(data);
        } catch (err) {
            console.error("Error cargando historial de viajes:", err);
            setError("No se pudieron cargar los viajes");
        } finally {
            setLoading(false);
        }
    };

    const completedTrips = trips.filter((trip) => trip.completed);

    const totalCO2 = completedTrips
        .reduce((sum, trip) => sum + (trip.actualCo2Kg || 0), 0)
        .toFixed(2);

    const totalKm = completedTrips
        .reduce((sum, trip) => sum + (trip.actualDistanceKm || 0), 0)
        .toFixed(2);

    const [exporting, setExporting] = useState(null);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const clearDates = () => {
        setFromDate("");
        setToDate("");
    };

    // Filtro por rango de fechas (RF29.2): solo viajes iniciados dentro del período.
    const filteredTrips = trips.filter((trip) => {
        if (!trip.startedAt) return true;
        const d = new Date(trip.startedAt);
        if (fromDate) {
            const f = new Date(fromDate);
            f.setHours(0, 0, 0, 0);
            if (d < f) return false;
        }
        if (toDate) {
            const t = new Date(toDate);
            t.setHours(23, 59, 59, 999);
            if (d > t) return false;
        }
        return true;
    });

    const exportToExcel = async () => {
        if (exporting || filteredTrips.length === 0) return;
        setExporting("xlsx");
        try {
            const result = await exportService.exportUserTrips("xlsx", { from: fromDate || null, to: toDate || null });
            downloadBlob(result.blob, result.fileName);
        } catch (err) {
            console.error("Error exportando historial:", err);
            toast.error(err?.detail || "No se pudo exportar el historial");
        } finally {
            setExporting(null);
        }
    };

    const exportToCsv = async () => {
        if (exporting || filteredTrips.length === 0) return;
        setExporting("csv");
        try {
            const result = await exportService.exportUserTrips("csv", { from: fromDate || null, to: toDate || null });
            downloadBlob(result.blob, result.fileName);
        } catch (err) {
            console.error("Error exportando historial:", err);
            toast.error(err?.detail || "No se pudo exportar el historial");
        } finally {
            setExporting(null);
        }
    };

    const escapeHtml = (value) =>
        String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    const exportToPDF = () => {
        if (exporting || filteredTrips.length === 0) return;

        const rowsHtml = filteredTrips.map((trip) => `<tr>
            <td>${escapeHtml(trip.routeName)}</td>
            <td>${escapeHtml(transportLabel(trip.transportMode))}</td>
            <td>${escapeHtml(formatDate(trip.startedAt))} ${escapeHtml(formatTime(trip.startedAt))}</td>
            <td>${trip.actualDurationMin != null ? `${trip.actualDurationMin} min` : "—"}</td>
            <td>${trip.actualDistanceKm != null ? `${trip.actualDistanceKm} km` : "—"}</td>
            <td>${trip.actualCo2Kg != null ? `${trip.actualCo2Kg} kg CO₂` : "—"}</td>
            <td>${trip.completed ? "Completado" : "En curso"}</td>
        </tr>`).join("");

        const win = window.open("", "_blank", "width=960,height=700");
        if (!win) {
            toast.error("Permite las ventanas emergentes para generar el PDF.");
            return;
        }

        win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Historial de Trayectos</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #111827; margin: 40px; }
  h1 { color: #047857; border-bottom: 2px solid #d1fae5; padding-bottom: 8px; }
  .summary { margin: 12px 0 20px; color: #374151; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { border: 1px solid #d1d5db; padding: 8px 10px; text-align: left; }
  th { background: #ecfdf5; color: #065f46; }
  tr:nth-child(even) td { background: #f9fafb; }
  .footer { margin-top: 24px; font-size: 12px; color: #6b7280; }
</style>
</head>
<body>
<h1>Historial de Trayectos</h1>
<p class="summary">
  CO₂ ahorrado: <strong>${totalCO2} kg</strong> · Distancia recorrida: <strong>${totalKm} km</strong> · Trayectos completados: <strong>${completedTrips.length}</strong>
</p>
<table>
  <thead><tr>
    <th>Ruta</th><th>Modo</th><th>Fecha</th><th>Duración</th><th>Distancia</th><th>CO₂</th><th>Estado</th>
  </tr></thead>
  <tbody>${rowsHtml}</tbody>
</table>
<p class="footer">Generado con EcoRuteando · ${escapeHtml(new Date().toLocaleString())}</p>
</body>
</html>`);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 300);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
    };

    const transportLabel = (mode) => {
        const labels = {
            bike: "Bicicleta",
            car: "Automóvil",
            walking: "Caminata",
            public_transport: "Transporte público",
            mixed: "Mixto",
        };
        return labels[mode] || mode || "—";
    };

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
                                <ClockIcon size={24} className="text-emerald-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Mi Historial de Viajes</h1>
                                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>Tus trayectos realizados</p>
                            </div>
                        </div>

                        <button
                            onClick={() => window.history.back()}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
                        >
                            <ArrowLeft size={16} />
                            Volver
                        </button>
                    </div>
                </div>
            </header>

            {/* CONTENIDO */}
            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* Resumen de impacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className={`rounded-2xl p-6 text-center shadow-lg border ${isDarkMode ? 'bg-gradient-to-br from-emerald-900/50 to-green-900/50 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-200'}`}>
                        <div className="flex justify-center mb-3">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-emerald-500/20">
                                <LeafIcon size={32} className="text-emerald-500" />
                            </div>
                        </div>
                        <h3 className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>CO₂ Ahorrado</h3>
                        <p className={`text-4xl md:text-5xl font-black mt-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{totalCO2} kg</p>
                        <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Equivalente a plantar {Math.round(totalCO2 * 2)} árboles</p>
                    </div>
                    <div className={`rounded-2xl p-6 text-center shadow-lg border ${isDarkMode ? 'bg-gradient-to-br from-teal-900/50 to-emerald-900/50 border-teal-500/30' : 'bg-gradient-to-br from-teal-100 to-emerald-100 border-teal-200'}`}>
                        <div className="flex justify-center mb-3">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-teal-500/20">
                                <MapPinIcon size={32} className="text-teal-500" />
                            </div>
                        </div>
                        <h3 className={`text-sm font-medium ${isDarkMode ? 'text-teal-300' : 'text-teal-600'}`}>Distancia Recorrida</h3>
                        <p className={`text-4xl md:text-5xl font-black mt-2 ${isDarkMode ? 'text-teal-400' : 'text-teal-700'}`}>{totalKm} km</p>
                        <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{completedTrips.length} viaje(s) completado(s)</p>
                    </div>
                </div>

                {/* Título del historial */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Historial de Viajes</h2>
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Filtro por rango de fechas (RF29.2) */}
                        <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <CalendarIcon size={16} className="text-emerald-500" />
                            <input
                                type="date"
                                value={fromDate}
                                max={toDate || undefined}
                                onChange={(e) => setFromDate(e.target.value)}
                                className={`bg-transparent text-sm outline-none ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                            />
                            <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>→</span>
                            <input
                                type="date"
                                value={toDate}
                                min={fromDate || undefined}
                                onChange={(e) => setToDate(e.target.value)}
                                className={`bg-transparent text-sm outline-none ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                            />
                            {(fromDate || toDate) && (
                                <button
                                    onClick={clearDates}
                                    className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                        <button
                            onClick={exportToPDF}
                            disabled={exporting || loading || filteredTrips.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}
                        >
                            <DownloadIcon size={16} />
                            PDF
                        </button>
                        <button
                            onClick={exportToExcel}
                            disabled={exporting || loading || filteredTrips.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/30' : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'}`}
                        >
                            <DownloadIcon size={16} />
                            {exporting === "xlsx" ? "Generando..." : "Excel"}
                        </button>
                        <button
                            onClick={exportToCsv}
                            disabled={exporting || loading || filteredTrips.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'}`}
                        >
                            <DownloadIcon size={16} />
                            {exporting === "csv" ? "Generando..." : "CSV"}
                        </button>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cargando viajes...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-center py-12 rounded-2xl bg-red-50 dark:bg-red-900/20">
                        <p className="text-red-600 text-sm">{error}</p>
                        <button onClick={loadTrips} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                            Reintentar
                        </button>
                    </div>
                )}

                {/* Lista de viajes */}
                {!loading && !error && (
                    <div className="space-y-4">
                        {filteredTrips.map((trip) => (
                            <div
                                key={trip.usageId}
                                className={`rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-100 hover:border-emerald-200'}`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Viaje */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <LeafIcon size={18} className="text-emerald-500" />
                                            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{trip.routeName}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                                {transportLabel(trip.transportMode)}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <ClockIcon size={14} />
                                                <span>{trip.actualDurationMin != null ? `${trip.actualDurationMin} min` : "—"}</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <span>📏</span>
                                                <span>{trip.actualDistanceKm != null ? `${trip.actualDistanceKm} km` : "—"}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-emerald-500">
                                                <LeafIcon size={14} />
                                                <span className="font-medium">{trip.actualCo2Kg != null ? `${trip.actualCo2Kg} kg CO₂` : "—"}</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <CalendarIcon size={14} />
                                                <span>{formatDate(trip.startedAt)} · {formatTime(trip.startedAt)}</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${trip.completed ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                <span>●</span>
                                                <span>{trip.completed ? "Completado" : "En curso"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onNavigate(`/user/history/${trip.usageId}`)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDarkMode ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'}`}
                                        >
                                            Ver Detalle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mensaje si no hay historial (o el filtro no deja resultados) */}
                {!loading && !error && filteredTrips.length === 0 && (
                    <div className={`text-center py-12 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <LeafIcon size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {trips.length === 0
                                ? "Aún no tienes viajes registrados"
                                : "Sin información disponible para el período seleccionado"}
                        </p>
                        {trips.length === 0 ? (
                            <button
                                onClick={() => onNavigate('/user/plan-route')}
                                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all"
                            >
                                Planear mi primera ruta
                            </button>
                        ) : (
                            <button
                                onClick={clearDates}
                                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all"
                            >
                                Limpiar filtro
                            </button>
                        )}
                    </div>
                )}

                {/* Frase motivacional */}
                <div className="mt-8 text-center">
                    <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <LeafIcon size={14} className="text-emerald-500" />
                        Sigue así, cada viaje cuenta para un futuro más verde
                        <LeafIcon size={14} className="text-emerald-500" />
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserHistory;
