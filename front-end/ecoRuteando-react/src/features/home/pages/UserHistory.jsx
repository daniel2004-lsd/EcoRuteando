import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LeafIcon, ArrowLeft, ClockIcon, MapPinIcon, CalendarIcon, DownloadIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import routeService from "../../../services/routeService";

const UserHistory = ({ onNavigate }) => {
    const { t } = useTranslation();
    const { isDarkMode, toggleTheme } = useTheme();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadRoutes();
    }, []);

    const loadRoutes = async () => {
        setLoading(true);
        setError(null);
        try {
            const routes = await routeService.getAll();
            setHistory(routes);
        } catch (err) {
            console.error("Error cargando rutas:", err);
            setError("No se pudieron cargar las rutas");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar esta ruta?")) return;
        try {
            await routeService.delete(id);
            setHistory(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error("Error eliminando ruta:", err);
        }
    };

    const totalCO2 = history.reduce((sum, route) => sum + (route.co2SavedKg || 0), 0).toFixed(2);

    const exportToPDF = () => {
        alert("Exportando a PDF...");
    };

    const exportToExcel = () => {
        alert("Exportando a Excel...");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        return d.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
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
                                <h1 className="text-2xl font-bold text-white">Mi Historial</h1>
                                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>Tus rutas y viajes realizados</p>
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

                {/* Tarjeta de CO₂ Total */}
                <div className={`rounded-2xl p-6 mb-8 text-center shadow-lg border ${isDarkMode ? 'bg-gradient-to-br from-emerald-900/50 to-green-900/50 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-200'}`}>
                    <div className="flex justify-center mb-3">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-500/20'}`}>
                            <LeafIcon size={32} className="text-emerald-500" />
                        </div>
                    </div>
                    <h3 className={`text-sm font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>CO₂ Total Ahorrado</h3>
                    <p className={`text-4xl md:text-5xl font-black mt-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{totalCO2} kg</p>
                    <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Equivalente a plantar {Math.round(totalCO2 * 2)} árboles</p>
                </div>

                {/* Título del historial */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Historial de Rutas</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={exportToPDF}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDarkMode ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}
                        >
                            <DownloadIcon size={16} />
                            PDF
                        </button>
                        <button
                            onClick={exportToExcel}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDarkMode ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/30' : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'}`}
                        >
                            <DownloadIcon size={16} />
                            Excel
                        </button>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cargando rutas...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-center py-12 rounded-2xl bg-red-50 dark:bg-red-900/20">
                        <p className="text-red-600 text-sm">{error}</p>
                        <button onClick={loadRoutes} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                            Reintentar
                        </button>
                    </div>
                )}

                {/* Lista de rutas */}
                {!loading && !error && (
                    <div className="space-y-4">
                        {history.map((route) => (
                            <div
                                key={route.id}
                                className={`rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-100 hover:border-emerald-200'}`}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Ruta */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPinIcon size={18} className="text-emerald-500" />
                                            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{route.startName}</span>
                                            <span className="text-gray-400">→</span>
                                            <MapPinIcon size={18} className="text-emerald-500" />
                                            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{route.destinationName}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <ClockIcon size={14} />
                                                <span>{route.estimatedTimeMin ? `${route.estimatedTimeMin} min` : "—"}</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <span>📏</span>
                                                <span>{route.distanceKm ? `${route.distanceKm} km` : "—"}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-emerald-500">
                                                <LeafIcon size={14} />
                                                <span className="font-medium">{route.co2SavedKg ? `${route.co2SavedKg} kg` : "—"}</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <CalendarIcon size={14} />
                                                <span>{formatDate(route.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onNavigate(`/user/plan-route`)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDarkMode ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'}`}
                                        >
                                            Ver Detalle
                                        </button>
                                        <button
                                            onClick={() => handleDelete(route.id)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isDarkMode ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mensaje si no hay historial */}
                {!loading && !error && history.length === 0 && (
                    <div className={`text-center py-12 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <LeafIcon size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No hay rutas en tu historial</p>
                        <button
                            onClick={() => onNavigate('/user/plan-route')}
                            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all"
                        >
                            Planear mi primera ruta
                        </button>
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

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
        </div>
    );
};

export default UserHistory;
