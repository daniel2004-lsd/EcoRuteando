import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LeafIcon, ArrowLeft, ClockIcon, MapPinIcon, CalendarIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import MapViewGoogle from "../../../features/auth/components/MapViewGoogle";
import tripService from "../../../services/tripService";

const TripDetail = ({ onNavigate }) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { usageId } = useParams();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const loadTrip = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await tripService.getById(usageId);
                setTrip(data);
            } catch (err) {
                console.error("Error cargando detalle del viaje:", err);
                setError("No se pudo cargar el detalle del viaje");
            } finally {
                setLoading(false);
            }
        };

        loadTrip();
    }, [usageId, reloadKey]);

    const retry = () => setReloadKey((k) => k + 1);

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
            walking: "Caminata",
            public_transport: "Transporte público",
            mixed: "Mixto",
        };
        return labels[mode] || mode || "—";
    };

    const routePoints = trip?.actualRoute || [];
    const mapCenter = routePoints.length > 0
        ? { lat: routePoints[0].latitude, lng: routePoints[0].longitude }
        : null;

    const mapGeometry = routePoints.length > 0
        ? routePoints.map((p) => ({ lat: p.latitude, lng: p.longitude }))
        : null;

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
                                <MapPinIcon size={24} className="text-emerald-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{trip?.routeName || "Detalle del Viaje"}</h1>
                                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>
                                    {trip ? `${formatDate(trip.startedAt)} · ${formatTime(trip.startedAt)}` : "Tu recorrido"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => onNavigate?.('/user/history')}
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

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cargando detalle...</p>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="text-center py-12 rounded-2xl bg-red-50 dark:bg-red-900/20">
                        <p className="text-red-600 text-sm">{error}</p>
                        <button onClick={retry} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                            Reintentar
                        </button>
                        <div className="mt-3">
                            <button onClick={() => onNavigate?.('/user/history')} className="px-4 py-2 text-emerald-600 text-sm">
                                Volver al historial
                            </button>
                        </div>
                    </div>
                )}

                {/* Detalle */}
                {!loading && !error && trip && (
                    <>
                        {/* Mapa del recorrido */}
                        <div className={`rounded-2xl overflow-hidden shadow-lg border mb-8 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                            <MapViewGoogle
                                height="420px"
                                center={mapCenter || { lat: 4.7110, lng: -74.0721 }}
                                zoom={14}
                                routeGeometry={mapGeometry}
                                showUserLocation={false}
                            />
                        </div>

                        {/* Métricas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className={`rounded-2xl p-5 text-center shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Distancia</p>
                                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {trip.actualDistanceKm != null ? `${trip.actualDistanceKm} km` : "—"}
                                </p>
                            </div>
                            <div className={`rounded-2xl p-5 text-center shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duración</p>
                                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {trip.actualDurationMin != null ? `${trip.actualDurationMin} min` : "—"}
                                </p>
                            </div>
                            <div className={`rounded-2xl p-5 text-center shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>CO₂ Ahorrado</p>
                                <p className={`text-2xl font-bold mt-1 text-emerald-500`}>
                                    {trip.actualCo2Kg != null ? `${trip.actualCo2Kg} kg` : "—"}
                                </p>
                            </div>
                            <div className={`rounded-2xl p-5 text-center shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Modo</p>
                                <p className={`text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {transportLabel(trip.transportMode)}
                                </p>
                            </div>
                        </div>

                        {/* Información */}
                        <div className={`rounded-2xl p-6 shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                            <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Información del viaje</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon size={16} className="text-emerald-500" />
                                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Inicio: {formatDate(trip.startedAt)} · {formatTime(trip.startedAt)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon size={16} className="text-emerald-500" />
                                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Fin: {trip.endedAt ? `${formatDate(trip.endedAt)} · ${formatTime(trip.endedAt)}` : "—"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <LeafIcon size={16} className="text-emerald-500" />
                                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Fuente: {trip.source || "—"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ClockIcon size={16} className="text-emerald-500" />
                                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Estado: {trip.completed ? "Completado" : "En curso"}</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TripDetail;
