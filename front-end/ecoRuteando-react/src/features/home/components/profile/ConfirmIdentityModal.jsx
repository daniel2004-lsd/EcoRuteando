import React from "react";
import { LockIcon } from "../../../../shared/components/Icons";

const ConfirmIdentityModal = ({
  isOpen,
  onClose,
  identityPassword,
  setIdentityPassword,
  handleConfirmSave,
  savingProfile,
  isDarkMode,
  t
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 transition-all ${
          isDarkMode ? "bg-[#162329] border-[#26383D] text-white" : "bg-white border-gray-200 text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <LockIcon size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold">
              {t("profile.confirmIdentity.title", "Confirmar Identidad")}
            </h3>
            <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {t("profile.confirmIdentity.subtitle", "Por seguridad, ingresa tu contraseña actual para confirmar los cambios.")}
            </p>
          </div>
        </div>

        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {t("profile.security.currentPassword", "Contraseña Actual")}
          </label>
          <input
            type="password"
            value={identityPassword}
            onChange={(e) => setIdentityPassword(e.target.value)}
            placeholder="••••••••"
            className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              isDarkMode ? "bg-[#111C20] border-[#26383D] text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
            autoFocus
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
            type="button"
            onClick={handleConfirmSave}
            disabled={savingProfile || !identityPassword}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all disabled:opacity-50"
          >
            {savingProfile ? "Guardando..." : t("profile.security.update", "Confirmar y Guardar")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmIdentityModal;
