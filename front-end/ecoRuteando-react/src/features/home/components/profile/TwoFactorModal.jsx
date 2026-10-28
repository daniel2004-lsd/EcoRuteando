import React from "react";
import { QRCodeSVG } from "qrcode.react";

const TwoFactorModal = ({
  isOpen,
  onClose,
  twoFactorMode,
  twoFactorData,
  twoFactorCode,
  setTwoFactorCode,
  submitting2FA,
  handleVerify2FACode,
  handleConfirmDisable2FA,
  copyToClipboard,
  isDarkMode,
  t
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => !submitting2FA && onClose()}
    >
      <div
        className={`w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 transition-all max-h-[90vh] overflow-y-auto ${
          isDarkMode ? "bg-[#162329] border-[#26383D] text-white" : "bg-white border-gray-200 text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {twoFactorMode === "setup" && (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center text-xl font-bold">
                🔐
              </div>
              <div>
                <h3 className="text-base font-bold">
                  {t("profile.security.twoFactorSetupTitle", "Configurar Autenticación en Dos Pasos (TOTP)")}
                </h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Usa Google Authenticator, Microsoft Authenticator o Authy
                </p>
              </div>
            </div>

            {/* Código QR (generado localmente sin transmitir secreto TOTP a terceros - H-03) */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-200">
              {twoFactorData.qrCodeUri ? (
                <QRCodeSVG
                  value={twoFactorData.qrCodeUri}
                  size={176}
                  level="M"
                  className="rounded-lg"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-xs text-gray-400">
                  Cargando QR...
                </div>
              )}
              <p className="text-[11px] text-gray-500 mt-2 text-center">
                {t("profile.security.twoFactorScanQR", "Escanea este código QR con tu app de autenticación")}
              </p>
            </div>

            {/* Clave Manual */}
            {twoFactorData.secret && (
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {t("profile.security.twoFactorManualKey", "O copia esta clave secreta manualmente:")}
                </label>
                <div className="flex items-center gap-2">
                  <code className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono tracking-wider border truncate ${
                    isDarkMode ? "bg-[#111C20] border-[#26383D] text-emerald-400" : "bg-gray-100 border-gray-300 text-emerald-700"
                  }`}>
                    {twoFactorData.secret}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(twoFactorData.secret)}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 border border-emerald-600/30 transition-all shrink-0"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}

            {/* Input código de 6 dígitos */}
            <form onSubmit={handleVerify2FACode} className="space-y-4 pt-1">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {t("profile.security.twoFactorEnterCode", "Ingresa el código de 6 dígitos:")}
                </label>
                <input
                  type="text"
                  maxLength="6"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className={`w-full px-4 py-3 rounded-xl text-center text-2xl tracking-[0.3em] font-mono font-bold border focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                    isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    isDarkMode ? "border-[#26383D] text-gray-300 hover:bg-[#111C20]" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {t("profile.personal.cancel", "Cancelar")}
                </button>
                <button
                  type="submit"
                  disabled={submitting2FA || twoFactorCode.length < 6}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-md transition-all disabled:opacity-50"
                >
                  {submitting2FA ? "Verificando..." : t("profile.security.twoFactorVerifyBtn", "Verificar y Activar")}
                </button>
              </div>
            </form>
          </>
        )}

        {twoFactorMode === "success" && (
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-3xl font-bold">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-500">
                ¡Autenticación en Dos Pasos Activada!
              </h3>
              <p className={`text-xs mt-1 max-w-sm mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {t("profile.security.twoFactorSuccess", "¡2FA activado exitosamente! Guarda tus códigos de recuperación en un lugar seguro.")}
              </p>
            </div>

            {twoFactorData.recoveryCodes && twoFactorData.recoveryCodes.length > 0 && (
              <div className={`p-4 rounded-2xl border text-left ${
                isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"
              }`}>
                <p className="text-xs font-bold text-amber-500 mb-2">
                  🔑 Códigos de Recuperación de Emergencia:
                </p>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs text-center">
                  {twoFactorData.recoveryCodes.map((code, idx) => (
                    <div key={idx} className={`p-1.5 rounded-lg border ${
                      isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-200"
                    }`}>
                      {code}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(twoFactorData.recoveryCodes.join("\n"))}
                  className="mt-3 w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30 transition-all text-center"
                >
                  Copiar todos los códigos
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all"
            >
              Entendido y Finalizar
            </button>
          </div>
        )}

        {twoFactorMode === "disable" && (
          <form onSubmit={handleConfirmDisable2FA} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-xl font-bold">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-500">
                  {t("profile.security.twoFactorDisableTitle", "Desactivar Autenticación en Dos Pasos")}
                </h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Tu cuenta será menos segura sin 2FA
                </p>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {t("profile.security.twoFactorDisableConfirm", "Ingresa tu código de 6 dígitos actual:")}
              </label>
              <input
                type="text"
                maxLength="6"
                inputMode="numeric"
                pattern="[0-9]*"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className={`w-full px-4 py-3 rounded-xl text-center text-2xl tracking-[0.3em] font-mono font-bold border focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                  isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                autoFocus
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  isDarkMode ? "border-[#26383D] text-gray-300 hover:bg-[#111C20]" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("profile.personal.cancel", "Cancelar")}
              </button>
              <button
                type="submit"
                disabled={submitting2FA || twoFactorCode.length < 6}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all disabled:opacity-50"
              >
                {submitting2FA ? "Desactivando..." : t("profile.security.disable2FA", "Desactivar 2FA")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TwoFactorModal;
