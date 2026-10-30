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
    <line x1="17" y1="7" x2="17.01" y2="17" />
  </svg>
);

export default function DownloadApkModal({ isOpen, onClose }) {
  const { isDarkMode } = useTheme();
  const [copied, setCopied] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(
    "https://github.com/daniel2004-lsd/EcoRuteando/releases/download/v1.0.7/ecoruteando.apk"
  );
  const [version, setVersion] = useState("1.0.7");

  // Cargar metadatos dinámicos del servidor al abrir el modal
  useEffect(() => {
    if (!isOpen) return;

    const loadMeta = async () => {
      try {
        let res = await fetch(`/downloads/version.json?_t=${Date.now()}`);
        if (!res.ok) res = await fetch(`/version.json?_t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.publicUrl) setDownloadUrl(data.publicUrl);
        if (data.version) setVersion(data.version);
      } catch (err) {
        console.warn("No se pudo cargar version.json:", err);
      }
    };
    loadMeta();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRefreshQr = () => {
    fetch(`/downloads/version.json?_t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : fetch(`/version.json?_t=${Date.now()}`).then((r) => (r.ok ? r.json() : null))))
      .then((data) => {
        if (!data) return;
        if (data.publicUrl) setDownloadUrl(data.publicUrl);
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
        {/* Header con gradiente ecológico y logo oficial */}
        <div className="relative p-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-xl p-2 flex items-center justify-center shrink-0 border-2 border-white/40">
              <img src="/logo.png" alt="EcoRuteando Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight">EcoRuteando Móvil</span>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-400 text-emerald-950 shadow-sm">
                  APK v{version}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
                Instalador oficial para dispositivos Android 8.0 o superior
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors text-white"
            aria-label="Cerrar modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Tarjeta de descarga y QR */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center gap-5 ${
              isDarkMode
                ? "bg-[#162329] border-[#26383D]"
                : "bg-emerald-50/70 border-emerald-200/60"
            }`}
          >
            {/* Código QR */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`p-2.5 rounded-2xl shadow-lg border relative group ${
                  isDarkMode
                    ? "bg-[#111C20] border-[#26383D]"
                    : "bg-white border-emerald-200"
                }`}
              >
                <QRCodeSVG
                  value={downloadUrl}
                  size={152}
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

            {/* Acciones de descarga directa HTTPS */}
            <div className="flex-1 flex flex-col justify-center gap-3 text-center sm:text-left w-full">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-emerald-700 dark:text-emerald-400">
                    Descarga Directa (HTTPS)
                  </h4>
                  <button
                    type="button"
                    onClick={handleRefreshQr}
                    className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    title="Actualizar enlace y refrescar QR"
                  >
                    🔄 Refrescar
                  </button>
                </div>
                <p className="text-xs opacity-80 mt-1 leading-relaxed">
                  Escanea el código QR con tu celular o pulsa el botón para descargar el instalador oficial (.apk).
                </p>
                <div
                  className="text-[11px] font-mono opacity-70 mt-2 truncate max-w-xs sm:max-w-sm bg-black/5 dark:bg-white/5 p-1.5 rounded-lg border border-black/5 dark:border-white/5"
                  title={downloadUrl}
                >
                  🔗 {downloadUrl}
                </div>
              </div>

              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="ecoruteando.apk"
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-emerald-600/30 bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <AndroidIcon size={18} />
                Descargar APK Ahora
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                  isDarkMode
                    ? "border-[#26383D] hover:bg-[#111C20] text-emerald-400"
                    : "border-emerald-300 hover:bg-emerald-100 text-emerald-700"
                }`}
              >
                {copied ? "✓ ¡Enlace copiado al portapapeles!" : "📋 Copiar enlace directo"}
              </button>
            </div>
          </div>

          {/* Consejos de descarga e instalación */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2 text-amber-800 dark:text-amber-300">
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <span>💡</span> Solución a problemas frecuentes:
            </div>
            <p className="leading-relaxed opacity-95 text-[11px]">
              • <strong>¿La descarga se detiene al 100% o no finaliza?</strong> En Android y Google Chrome, las descargas de archivos APK requieren confirmación de seguridad. Revisa las notificaciones de tu teléfono o la barra de descargas y pulsa <em>"Descargar de todos modos"</em> o <em>"Conservar archivo"</em> para que el archivo termine de guardarse.
            </p>
            <p className="leading-relaxed opacity-95 text-[11px]">
              • <strong>¿Dice "El paquete no es válido"?</strong> Si ya tenías instalada una versión previa de EcoRuteando, <em>desinstálala por completo antes de instalar esta nueva versión</em> para evitar conflicto con la firma digital anterior.
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
                  <strong>Permite la instalación:</strong> Si Android muestra una advertencia de seguridad, pulsa <em>"Configuración"</em> y activa <em>"Confiar en esta fuente"</em>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  3
                </span>
                <p className="opacity-90 leading-tight pt-0.5">
                  <strong>Instala y abre:</strong> Pulsa <em>"Instalar"</em>. Verás la app lista para usar con el logo oficial de EcoRuteando.
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
          <span className="flex items-center gap-2">
            <LeafIcon size={18} className="text-emerald-500" />
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
