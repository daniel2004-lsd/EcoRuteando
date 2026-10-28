import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { LeafIcon, CloseIcon } from "./Icons";
import { useTheme } from "../../app/context/ThemeContext";

const AndroidIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.005 12 8.005c-1.8533 0-3.5902.4066-5.1368.9447L4.8409 5.4467a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
  </svg>
);

const QrIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
    <line x1="17" y1="17" x2="17.01" y2="17" />
    <line x1="7" y1="17" x2="7.01" y2="17" />
    <line x1="17" y1="7" x2="17.01" y2="7" />
  </svg>
);

export default function DownloadApkModal({ isOpen, onClose }) {
  const { isDarkMode } = useTheme();
  const [copied, setCopied] = useState(false);
  const [networkMode, setNetworkMode] = useState("internet"); // "internet" | "local"
  const [localIp, setLocalIp] = useState("10.3.234.116");
  const [internetUrl, setInternetUrl] = useState("https://github.com/daniel2004-lsd/EcoRuteando/releases/download/v1.0.7/ecoruteando.apk");
  const [version, setVersion] = useState("1.0.7");

  // Cargar metadatos dinámicos del servidor al abrir el modal
  useEffect(() => {
    if (!isOpen) return;

    // Si ya estamos navegando por una IP o dominio público (no localhost), usarlo por defecto
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host && host !== "localhost" && host !== "127.0.0.1") {
        setLocalIp(host);
      }
    }

    const loadMeta = async () => {
      try {
        let res = await fetch(`/downloads/version.json?_t=${Date.now()}`);
        if (!res.ok) res = await fetch(`/version.json?_t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.publicUrl) setInternetUrl(data.publicUrl);
        if (data.localIp && (!window || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
          setLocalIp(data.localIp);
        }
        if (data.version) setVersion(data.version);
        setQrTimestamp(Date.now());
      } catch (err) {
        console.warn("No se pudo cargar version.json:", err);
      }
    };
    loadMeta();
  }, [isOpen]);

  if (!isOpen) return null;

  // Determinar URL de descarga activa
  const localDownloadUrl = `http://${localIp || "10.90.222.239"}:3007/downloads/ecoruteando.apk`;
  const activeDownloadUrl =
    networkMode === "local" ? localDownloadUrl : internetUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeDownloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRefreshQr = () => {
    fetch(`/version.json?_t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.publicUrl) setInternetUrl(data.publicUrl);
        if (data.localIp) setLocalIp(data.localIp);
        if (data.version) setVersion(data.version);
      })
      .catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border transition-all ${
          isDarkMode
            ? "bg-[#0E171B] border-[#26383D] text-[#e2e8f0]"
            : "bg-white border-emerald-100 text-gray-800"
        }`}
      >
        {/* Header con gradiente ecológico */}
        <div className="relative p-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <AndroidIcon size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">EcoRuteando Móvil</span>
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-400 text-emerald-950">
                  APK v{version}
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Para dispositivos Android 8.0 o superior
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Selector de modo de red */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-0.5">
              <span className="font-bold opacity-80">Elige cómo vas a descargar:</span>
              <button
                type="button"
                onClick={handleRefreshQr}
                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                title="Volver a consultar enlace y refrescar el QR"
              >
                🔄 Refrescar enlace
              </button>
            </div>

            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/5 dark:bg-black/30 gap-1 border border-black/5 dark:border-white/5">
              <button
                type="button"
                onClick={() => {
                  setNetworkMode("internet");
                  setQrTimestamp(Date.now());
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  networkMode === "internet"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/30"
                    : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <span>🌐</span> Internet (Cloudflare HTTPS)
              </button>
              <button
                type="button"
                onClick={() => {
                  setNetworkMode("local");
                  setQrTimestamp(Date.now());
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  networkMode === "local"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/30"
                    : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <span>📶</span> WiFi Local (Red LAN)
              </button>
            </div>

            {/* Configuración de IP local editable */}
            {networkMode === "local" && (
              <div
                className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fadeIn ${
                  isDarkMode
                    ? "bg-[#111C20] border-[#26383D] text-[#94a3b8]"
                    : "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                }`}
              >
                <div className="flex-1">
                  <span className="font-semibold block">IP de tu computadora:</span>
                  <span className="text-[11px] opacity-75">
                    Tu celular debe estar conectado a la misma red WiFi que esta PC.
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={localIp}
                    onChange={(e) => {
                      setLocalIp(e.target.value.trim());
                      setQrTimestamp(Date.now());
                    }}
                    placeholder="10.90.222.239"
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 w-36 ${
                      isDarkMode
                        ? "bg-[#162329] border-[#26383D] text-white"
                        : "bg-white border-emerald-300 text-gray-800"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tarjeta de descarga y QR */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center gap-5 ${
              isDarkMode
                ? "bg-[#162329] border-[#26383D]"
                : "bg-emerald-50/70 border-emerald-200/60"
            }`}
          >
            {/* Código QR con recarga garantizada */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`p-2 rounded-2xl shadow-lg border relative group ${
                  isDarkMode
                    ? "bg-[#111C20] border-[#26383D]"
                    : "bg-white border-emerald-200"
                }`}
              >
                <QRCodeSVG
                  value={activeDownloadUrl}
                  size={144}
                  level="M"
                  fgColor={isDarkMode ? "#34D399" : "#059669"}
                  bgColor={isDarkMode ? "#111C20" : "#ffffff"}
                  className="rounded-xl block"
                />
              </div>
              <span className="text-[11px] mt-2 font-medium flex items-center gap-1 opacity-75">
                <QrIcon size={12} /> Escanea con la cámara del celular
              </span>
            </div>

            {/* Acciones de descarga directa */}
            <div className="flex-1 flex flex-col justify-center gap-3 text-center sm:text-left w-full">
              <div>
                <h4 className="font-bold text-base">Descarga Directa</h4>
                <p className="text-xs opacity-80 mt-1 leading-relaxed">
                  Escanea el código QR con tu celular o pulsa el botón para descargar el archivo instalador (.apk).
                </p>
                <p className="text-[11px] font-mono opacity-60 mt-1.5 truncate max-w-xs sm:max-w-sm" title={activeDownloadUrl}>
                  🔗 {activeDownloadUrl}
                </p>
              </div>

              <a
                href={activeDownloadUrl}
                download="ecoruteando.apk"
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm text-white shadow-lg shadow-emerald-600/30 bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <AndroidIcon size={18} />
                Descargar APK Ahora
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  isDarkMode
                    ? "border-[#26383D] hover:bg-[#111C20] text-emerald-400"
                    : "border-emerald-300 hover:bg-emerald-100 text-emerald-700"
                }`}
              >
                {copied ? "✓ ¡Enlace copiado al portapapeles!" : "📋 Copiar enlace directo"}
              </button>
            </div>
          </div>

          {/* Alerta de instalación limpia y solución a paquete no válido */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5 text-amber-800 dark:text-amber-300">
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <span>⚠️</span> ¿Te sale "El paquete no es válido"?
            </div>
            <p className="leading-relaxed opacity-95 text-[11px]">
              • <strong>Desinstala la versión anterior:</strong> Si ya tenías EcoRuteando en tu celular, <em>bórrala antes de instalar</em> para evitar conflicto de firmas.
            </p>
            <p className="leading-relaxed opacity-95 text-[11px]">
              • <strong>Descarga completa (~56 MB):</strong> Si tu navegador descargó solo 12 MB o 20 MB, el archivo quedó incompleto. Elige la pestaña <strong>"WiFi Local (Red LAN)"</strong> para bajarlo completo y ultrarrápido sin cortes.
            </p>
          </div>

          {/* Guía de instalación rápida */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider mb-2.5 opacity-70">
              Pasos para instalar en Android
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  1
                </span>
                <p className="opacity-90 leading-tight pt-0.5">
                  <strong>Descarga el archivo:</strong> Escanea el QR o pulsa <em>"Descargar APK Ahora"</em>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  2
                </span>
                <p className="opacity-90 leading-tight pt-0.5">
                  <strong>Permite la instalación:</strong> Si Android muestra una advertencia, toca <em>"Configuración"</em> y habilita <em>"Confiar en esta fuente"</em>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  3
                </span>
                <p className="opacity-90 leading-tight pt-0.5">
                  <strong>Instala y abre:</strong> Pulsa <em>"Instalar"</em>. Verás la app con el nuevo logo oficial de EcoRuteando.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between text-xs ${
            isDarkMode
              ? "bg-[#0B1215] border-[#26383D] text-gray-400"
              : "bg-gray-50 border-gray-100 text-gray-500"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <LeafIcon size={14} className="text-emerald-500" />
            100% oficial, seguro y libre de publicidad
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-[#162329] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
