import { useState } from "react";
import { LeafIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import sharedRouteService from "../../../services/sharedRouteService";

const SOCIAL_NETWORKS = [
    { id: "whatsapp", label: "WhatsApp", color: "#25D366", icon: "💬" },
    { id: "facebook", label: "Facebook", color: "#1877F2", icon: "📘" },
    { id: "x", label: "X (Twitter)", color: "#000000", icon: "𝕏" },
    { id: "telegram", label: "Telegram", color: "#26A5E4", icon: "✈️" },
    { id: "link", label: "Copiar enlace", color: "#10B981", icon: "🔗" },
];

/**
 * CU20 (HU-14): Permite compartir un recorrido finalizado seleccionando
 * qué información hacer pública y el medio (red social o enlace).
 */
const ShareSection = ({ trip }) => {
    const { isDarkMode } = useTheme();

    const [selectedNetwork, setSelectedNetwork] = useState("whatsapp");
    const [includeRouteName, setIncludeRouteName] = useState(true);
    const [includeDistance, setIncludeDistance] = useState(true);
    const [includeDuration, setIncludeDuration] = useState(true);
    const [includeCo2, setIncludeCo2] = useState(true);
    const [shared, setShared] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [error, setError] = useState(null);

    const buildMessage = () => {
        const start = trip?.startName || trip?.routeName || "Origen";
        const destination = trip?.destinationName || "Destino";
        const items = [];
        if (includeRouteName) items.push(`${start} → ${destination}`);
        if (includeDistance && trip?.actualDistanceKm != null) items.push(`${trip.actualDistanceKm} km`);
        if (includeDuration && trip?.actualDurationMin != null) items.push(`${trip.actualDurationMin} min`);
        if (includeCo2 && trip?.actualCo2Kg != null) items.push(`${trip.actualCo2Kg} kg CO₂ evitados`);
        return `🌿 EcoRuteando · ${items.join(" · ")}`;
    };

    const buildSharedData = () => ({
        message: buildMessage(),
        distanceKm: includeDistance ? trip?.actualDistanceKm : null,
        durationMin: includeDuration ? trip?.actualDurationMin : null,
        co2SavedKg: includeCo2 ? trip?.actualCo2Kg : null,
        routeName: includeRouteName ? `${trip?.startName || ""} → ${trip?.destinationName || ""}` : null,
        privacy: "public-data-requested",
    });

    const copyToClipboard = async (text) => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch (e) {
            console.warn("navigator.clipboard fallo, usando fallback:", e);
        }
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const ok = document.execCommand("copy");
            document.body.removeChild(textArea);
            return ok;
        } catch (err) {
            console.error("Fallback copy fallo:", err);
            return false;
        }
    };

    const openShareUrl = (network, text) => {
        const shareUrl = window.location.href;
        const urls = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} — ${shareUrl}`)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`,
            x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text} — ${shareUrl}`)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
            link: null,
        };
        return urls[network];
    };

    const handleShare = async () => {
        const message = buildMessage();
        const shareUrl = window.location.href;
        const fullShareText = `${message} — ${shareUrl}`;

        // 1. Si la red es 'link', copiamos al portapapeles
        if (selectedNetwork === "link") {
            const copied = await copyToClipboard(fullShareText);
            if (copied) {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 3000);
            }
        } else {
            // Abrir la red social seleccionada
            const url = openShareUrl(selectedNetwork, message);
            if (url) {
                window.open(url, "_blank", "noopener,noreferrer");
            }
        }

        // 2. Si el dispositivo tiene API nativa de compartir y el usuario eligió compartir nativo
        setSharing(true);
        setError(null);

        try {
            const usageId = trip?.usageId || trip?.id;
            if (usageId) {
                await sharedRouteService.share(usageId, {
                    socialNetwork: selectedNetwork,
                    sharedData: buildSharedData(),
                });
            }
            setShared(true);
        } catch (err) {
            console.error("Error registrando recorrido compartido en backend:", err);
            // Si el backend falla por algo menor, aún permitimos que el usuario haya compartido
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "No se pudo sincronizar el registro de compartir."
            );
        } finally {
            setSharing(false);
        }
    };

    const handleNativeShare = async () => {
        const message = buildMessage();
        const shareUrl = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Mi ruta en EcoRuteando",
                    text: message,
                    url: shareUrl,
                });
                const usageId = trip?.usageId || trip?.id;
                if (usageId) {
                    await sharedRouteService.share(usageId, {
                        socialNetwork: "native",
                        sharedData: buildSharedData(),
                    });
                }
                setShared(true);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Error al compartir:", err);
                }
            }
        }
    };

    const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

    const cardClass = `rounded-2xl p-6 shadow-md border ${
        isDarkMode ? 'bg-[#162329] border-[#26383D]' : "bg-white border-gray-100"
    }`;
    const labelClass = isDarkMode ? 'text-[#94a3b8]' : "text-gray-500";
    const textClass = isDarkMode ? 'text-[#e2e8f0]' : "text-gray-800";

    const toggleClass = (active) =>
        `px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            active
                ? "bg-emerald-600 text-white shadow-sm"
                : isDarkMode
                    ? "bg-[#111C20] text-gray-400 border border-[#26383D] hover:bg-[#1f3037]"
                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200/60"
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
                        {trip?.routeName ? trip.routeName : "Origen → Destino"}
                    </button>
                    <button type="button" onClick={() => setIncludeDistance(!includeDistance)} className={toggleClass(includeDistance)}>
                        Distancia ({trip?.actualDistanceKm ?? "—"} km)
                    </button>
                    <button type="button" onClick={() => setIncludeDuration(!includeDuration)} className={toggleClass(includeDuration)}>
                        Duración ({trip?.actualDurationMin ?? "—"} min)
                    </button>
                    <button type="button" onClick={() => setIncludeCo2(!includeCo2)} className={toggleClass(includeCo2)}>
                        CO₂ ahorrado ({trip?.actualCo2Kg ?? "—"} kg)
                    </button>
                </div>
            </div>

            {/* Vista previa */}
            <div className={`mb-4 p-4 rounded-xl text-sm ${isDarkMode ? 'bg-[#0B1215] border border-[#26383D]' : "bg-gray-50 border border-gray-200"}`}>
                <p className={`text-xs mb-1 font-semibold ${labelClass}`}>Vista previa del mensaje</p>
                <p className={`font-medium ${textClass}`}>{buildMessage()}</p>
            </div>

            {/* Red social o medio */}
            <div className="mb-5">
                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${labelClass}`}>
                    Selecciona dónde compartir
                </p>
                <div className="flex flex-wrap gap-2">
                    {SOCIAL_NETWORKS.map((network) => (
                        <button
                            key={network.id}
                            type="button"
                            onClick={() => { setSelectedNetwork(network.id); setShared(false); setCopySuccess(false); }}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                selectedNetwork === network.id
                                    ? "bg-emerald-600 text-white shadow-md"
                                    : isDarkMode
                                        ? "bg-[#111C20] text-gray-300 border border-[#26383D] hover:bg-[#1a2b32]"
                                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                            }`}
                        >
                            <span>{network.icon}</span>
                            <span>{network.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="text-xs text-rose-500 mb-3 font-medium">{error}</p>}

            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={handleShare}
                    disabled={sharing}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {sharing ? "Compartiendo..." : selectedNetwork === "link" ? "Copiar y compartir enlace" : `Compartir en ${SOCIAL_NETWORKS.find(s => s.id === selectedNetwork)?.label || "red"}`}
                </button>

                {canNativeShare && (
                    <button
                        type="button"
                        onClick={handleNativeShare}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                            isDarkMode
                                ? "bg-[#111C20] text-emerald-400 border-[#26383D] hover:bg-[#1f3037]"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                        }`}
                    >
                        📲 Compartir con mi celular / apps
                    </button>
                )}
            </div>

            {copySuccess && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-500 animate-fade-in">
                    <span>✓</span>
                    <span>¡Enlace copiado al portapapeles con éxito!</span>
                </div>
            )}

            {shared && !copySuccess && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-500 animate-fade-in">
                    <span>✓</span>
                    <span>¡Recorrido compartido registrado exitosamente!</span>
                </div>
            )}
        </div>
    );
};

export default ShareSection;