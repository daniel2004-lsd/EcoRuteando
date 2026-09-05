import { useState, useEffect } from "react";
import { LeafIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import ratingService from "../../../services/ratingService";

/**
 * CU09 (HU-11): permite calificar una ruta completada con 1-5 estrellas
 * y un comentario opcional. Se muestra únicamente en el detalle de un
 * trayecto finalizado.
 */
const RatingSection = ({ routeId }) => {
    const { isDarkMode } = useTheme();

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [summary, setSummary] = useState(null);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadExisting();
    }, [routeId]);

    const loadExisting = async () => {
        setLoading(true);
        setError(null);
        try {
            const [mine, routeRatings] = await Promise.all([
                ratingService.getMine(routeId),
                ratingService.getByRoute(routeId),
            ]);

            if (mine) {
                setRating(mine.ratingValue);
                setComment(mine.comment || "");
                setSaved(true);
            }
            setSummary(routeRatings);
        } catch (err) {
            console.error("Error cargando valoración:", err);
            setError("No se pudo cargar la valoración");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (rating < 1) {
            setError("Debes seleccionar una puntuación de 1 a 5 estrellas.");
            return;
        }

        setSaving(true);
        setError(null);
        try {
            await ratingService.rate(routeId, rating, comment);
            setSaved(true);
            const routeRatings = await ratingService.getByRoute(routeId);
            setSummary(routeRatings);
        } catch (err) {
            console.error("Error guardando valoración:", err);
            setError(
                err?.response?.data?.message ||
                "No se pudo guardar la valoración. Intenta de nuevo."
            );
        } finally {
            setSaving(false);
        }
    };

    const cardClass = `rounded-2xl p-6 shadow-md border ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
    }`;

    const labelClass = isDarkMode ? "text-gray-400" : "text-gray-500";
    const textClass = isDarkMode ? "text-white" : "text-gray-800";

    const renderStars = (value, interactive = false) => (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => interactive && setRating(star)}
                    onMouseEnter={() => interactive && setHoverRating(star)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                    className={`text-3xl leading-none transition-transform ${
                        interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
                    }`}
                    aria-label={`${star} estrellas`}
                >
                    <span
                        className={
                            star <= (interactive ? hoverRating || rating : value)
                                ? "text-amber-400"
                                : isDarkMode ? "text-gray-600" : "text-gray-300"
                        }
                    >
                        ★
                    </span>
                </button>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className={cardClass}>
                <p className={`text-sm ${labelClass}`}>Cargando valoración...</p>
            </div>
        );
    }

    return (
        <div className={`${cardClass} mb-8`}>
            <div className="flex items-center gap-2 mb-4">
                <LeafIcon size={20} className="text-emerald-500" />
                <h2 className={`text-lg font-bold ${textClass}`}>Califica esta ruta</h2>
            </div>

            {summary && (
                <div className={`flex items-center gap-3 mb-4 text-sm ${labelClass}`}>
                    <span className="text-2xl text-amber-400">★</span>
                    <span className="font-bold text-amber-500">
                        {summary.averageRating != null ? summary.averageRating : "—"}
                    </span>
                    <span>
                        ({summary.totalCount} valoración{summary.totalCount === 1 ? "" : "es"})
                    </span>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600 mb-3">{error}</p>
            )}

            {renderStars(rating, !saved)}

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={saved}
                rows={3}
                maxLength={1000}
                placeholder="Cuéntanos tu experiencia (opcional)..."
                className={`mt-4 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all resize-none ${
                    isDarkMode
                        ? "bg-gray-900 border-gray-600 text-white focus:border-emerald-500"
                        : "bg-gray-50 border-gray-200 text-gray-800 focus:border-emerald-500"
                }`}
            />

            {!saved ? (
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="mt-4 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? "Guardando..." : "Enviar valoración"}
                </button>
            ) : (
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-500">
                    <span>✓</span>
                    <span>¡Gracias por tu valoración!</span>
                </div>
            )}
        </div>
    );
};

export default RatingSection;