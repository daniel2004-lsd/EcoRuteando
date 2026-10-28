import React from "react";

const DeleteAccountModal = ({
  isOpen,
  onClose,
  deletingAccount,
  handleConfirmDeleteAccount,
  isDarkMode,
  t
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => !deletingAccount && onClose()}
    >
      <div
        className={`w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 transition-all ${
          isDarkMode ? "bg-[#162329] border-[#26383D] text-white" : "bg-white border-gray-200 text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl shrink-0">
            ⚠️
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-500">
              {t("profile.security.deleteAccountModalTitle", "¿Eliminar cuenta permanentemente?")}
            </h3>
            <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {t("profile.security.deleteAccountModalWarning", "Esta acción es irreversible y eliminará todos tus datos personales, preferencias e historial de rutas registradas en EcoRuteando.")}
            </p>
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl text-xs border ${
          isDarkMode ? "bg-rose-950/30 border-rose-900/50 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-700"
        }`}>
          <p className="font-semibold">⚠️ Advertencia importante:</p>
          <p className="mt-0.5">Se cerrará tu sesión de inmediato y no podrás recuperar tu historial de viajes ni datos guardados.</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={deletingAccount}
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              isDarkMode ? "border-[#26383D] text-gray-300 hover:bg-[#111C20]" : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {t("profile.personal.cancel", "Cancelar")}
          </button>
          <button
            type="button"
            disabled={deletingAccount}
            onClick={handleConfirmDeleteAccount}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {deletingAccount ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Eliminando...</span>
              </>
            ) : (
              t("profile.security.deleteAccountModalConfirm", "Sí, eliminar definitivamente")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
