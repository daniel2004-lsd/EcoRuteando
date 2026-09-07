import { useState } from "react";
import { LeafIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import sharedRouteService from "../../../services/sharedRouteService";

const SOCIAL_NETWORKS = [
    { id: "whatsapp", label: "WhatsApp", color: "#25D366" },
    { id: "facebook", label: "Facebook", color: "#1877F2" },
    { id: "x", label: "X (Twitter)", color: "#000000" },
    { id: "telegram", label: "Telegram", color: "#26A5E4" },
    { id: "link", label: "Copiar enlace", color: "#6B7280" },
];

/**
 * CU20 (HU-14): permite compartir un recorrido finalizado seleccionando
 * qué información hacer pública (RF32) y el medio (red social o enlace).
 * Solo se omiten datos privados; se guarda el registro vía API.
 */
const ShareSection = ({ trip }) => {
    const { isDarkMode } = useTheme();

    const [selectedNetwork, setSelectedNetwork] = useState("link");
    const [includeRouteName, setIncludeRouteName] = useState(true);
    const [includeDistance, setIncludeDistance] = useState(true);
    const [includeDuration, setIncludeDuration] = useState(true);
    const [includeCo2, setIncludeCo2] = useState(true);
    const [shared, setShared] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [error, setError] = useState(null);

    const buildMessage = () => {
        const start = trip.startName || trip.routeName || "Origen";
        const destination = trip.destinationName || "Destino";
        const items = [];
        if (includeRouteName) items.push(`${start} → ${destination}`);
        if (includeDistance) items.push(`${trip.actualDistanceKm} km`);
        if (includeDuration) items.push(`${trip.actualDurationMin} min`);
        if (includeCo2) items.push(`${trip.actualCo2Kg} kg CO₂ ahorrados`);
        return `🌿 EcoRuteando · ${items.join(" · ")}`;
    };

    const buildSharedData = () => ({
        message: buildMessage(),
        distanceKm: includeDistance ? trip.actualDistanceKm : null,
        durationMin: includeDuration ? trip.actualDurationMin : null,
        co2SavedKg: includeCo2 ? trip.actualCo2Kg : null,
        routeName: includeRouteName ? `${trip.startName || ""} → ${trip.destinationName || ""}` : null,
        privacy: "public-data-requested",
    });

    const openShareUrl = (network, text) => {
        const urls = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`,
            x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`,
            link: null,
        };
        return urls[network];
    };

    const handleShare = async () => {
        const message = buildMessage();
        if (selectedNetwork === "link") {
            try {
                await navigator.clipboard.writeText(`${message} — ${window.location.href}`);
            } catch (err) {
                console.error("Error copiando enlace:", err);
            }
        } else {
            const url = openShareUrl(selectedNetwork, message);
            if (url) window.open(url, "_blank", "noopener,noreferrer");
        }

        setSharing(true);
        setError(null);
        try {
            await sharedRouteService.share(trip.usageId || trip.id, {
                socialNetwork: selectedNetwork === "link" ? "link" : selectedNetwork,
                sharedData: buildSharedData(),
            });
            setShared(true);
        } catch (err) {
            console.error("Error guardando recorrido compartido:", err);
            setError(
                err?.response?.data?.message ||
                "No se pudo guardar el recorrido compartido."
            );
        } finally {
            setSharing(false);
        }
    };

    const cardClass = `rounded-2xl p-6 shadow-md border ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
    }`;
    const labelClass = isDarkMode ? "text-gray-400" : "text-gray-500";
    const textClass = isDarkMode ? "text-white" : "text-gray-800";

    const toggleClass = (active) =>
        `px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
            active
                ? "bg-emerald-500 text-white"
                : isDarkMode
                    ? "bg-gray-900 text-gray-500 border border-gray-700"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
        }`;

    return (
        <div className={`${cardClass} mb-8`}>
            <div className="flex items-center gap-2 mb-1">
                <LeafIcon size={20} className="text-emerald-500" />
                <h2 className={`text-lg font-bold ${textClass}`}>Compartir recorrido</h2>
            </div>
            <p className={`text-xs mb-4 ${labelClass}`}>
                Elige qué información hacer pública y el medio. Los datos personales quedan ocultos.
            </p>

            {/* Datos a incluir */}
            <div className="mb-4">
                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${labelClass}`}>
                    Datos a incluir
                </p>
                <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setIncludeRouteName(!includeRouteName)} className={toggleClass(includeRouteName)}>
                        {trip.routeName ? trip.routeName : "Origen → Destino"}
                    </button>
                    <button type="button" onClick={() => setIncludeDistance(!includeDistance)} className={toggleClass(includeDistance)}>
                        Distancia ({trip.actualDistanceKm ?? "—"} km)
                    </button>
                    <button type="button" onClick={() => setIncludeDuration(!includeDuration)} className={toggleClass(includeDuration)}>
                        Duración ({trip.actualDurationMin ?? "—"} min)
                    </button>
                    <button type="button" onClick={() => setIncludeCo2(!includeCo2)} className={toggleClass(includeCo2)}>
                        CO₂ ahorrado ({trip.actualCo2Kg ?? "—"} kg)
                    </button>
                </div>
            </div>

            {/* Vista previa */}
            <div className={`mb-4 p-4 rounded-xl text-sm ${isDarkMode ? "bg-gray-900 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
                <p className={`text-xs mb-1 ${labelClass}`}>Vista previa</p>
                <p className={textClass}>{buildMessage()}</p>
            </div>

            {/* Red social */}
            <div className="mb-4">
                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${labelClass}`}>
                    Compartir en
                </p>
                <div className="flex flex-wrap gap-2">
                    {SOCIAL_NETWORKS.map((network) => (
                        <button
                            key={network.id}
                            type="button"
                            onClick={() => { setSelectedNetwork(network.id); setShared(false); }}
                            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                                selectedNetwork === network.id
                                    ? "bg-emerald-600 text-white"
                                    : isDarkMode
                                        ? "bg-gray-900 text-gray-400 border border-gray-700 hover:border-emerald-500"
                                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-emerald-400"
                            }`}
                        >
                            <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: network.color }} />
                            {network.label}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

            <button
                onClick={handleShare}
                disabled={sharing}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {sharing ? "Compartiendo..." : "Compartir recorrido"}
            </button>

            {shared && (
                <div className="mt-4 flex items-center gap-2 text-sm text-emerald-500">
                    <span>✓</span>
                    <span>¡Recorrido compartido!</span>
                </div>
            )}
        </div>
    );
};

export default ShareSection;