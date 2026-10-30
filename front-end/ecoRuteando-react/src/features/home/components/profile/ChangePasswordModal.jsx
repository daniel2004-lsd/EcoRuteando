import React from "react";
import { LockIcon } from "../../../../shared/components/Icons";

const ChangePasswordModal = ({
  isOpen,
  onClose,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  savingPassword,
  handleChangePassword,
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
              {t("profile.security.changePassword", "Cambiar Contraseña")}
            </h3>
            <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Introduce tu clave actual y define una nueva contraseña segura
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {t("profile.security.currentPassword", "Contraseña Actual")}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {t("profile.security.newPassword", "Nueva Contraseña")}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {t("profile.security.confirmPassword", "Confirmar Nueva Contraseña")}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
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
              disabled={savingPassword}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all disabled:opacity-50"
            >
              {savingPassword ? "Actualizando..." : t("profile.security.update", "Actualizar")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
