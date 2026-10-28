import React from "react";
import { LockIcon } from "../../../../shared/components/Icons";

const SecurityTab = ({
  isDarkMode,
  userInfo,
  submitting2FA,
  setShowPasswordModal,
  handleStart2FASetup,
  handleOpenDisable2FA,
  handleOpenDeleteModal,
  t
}) => {
  return (
    <div className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-md space-y-6 ${
      isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"
    }`}>
      <div>
        <h3 className="text-lg font-bold">
          {t("profile.security.title", "Seguridad de la Cuenta")}
        </h3>
        <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {t("profile.security.subtitle", "Gestiona tu contraseña y credenciales de acceso")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Opción 1: Contraseña o Proveedor Google */}
        {!userInfo.hasPassword || userInfo.authProvider === "google" ? (
          <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
            isDarkMode ? "bg-[#111C20] border-blue-900/40" : "bg-blue-50/50 border-blue-200"
          }`}>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 border border-gray-200">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                  {t("profile.security.googleAccountTitle", "Cuenta vinculada a Google")}
                </span>
              </div>
              <h4 className="text-sm font-bold">
                {t("profile.security.googleAccountTitle", "Cuenta vinculada a Google")}
              </h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {t("profile.security.googleAccountDesc", "Iniciaste sesión con tu cuenta de Google. Tu contraseña y autenticación son administradas de forma segura y centralizada por Google.")}
              </p>
              <div className={`p-2.5 rounded-xl text-[11px] ${isDarkMode ? "bg-[#162329] text-gray-300" : "bg-white text-gray-600 border border-blue-100"}`}>
                🔒 {t("profile.security.googleNoPasswordNotice", "No requieres ni puedes cambiar una contraseña local en EcoRuteando.")}
              </div>
            </div>
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>{t("profile.security.googleManageSecurity", "Gestionar seguridad en Google")}</span>
              <span className="text-xs">↗</span>
            </a>
          </div>
        ) : (
          <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
            isDarkMode ? "bg-[#111C20] border-[#26383D] hover:border-emerald-500/50" : "bg-gray-50 border-gray-200 hover:border-emerald-400"
          }`}>
            <div className="space-y-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <LockIcon size={20} />
              </div>
              <h4 className="text-sm font-bold">
                {t("profile.security.changePassword", "Cambiar Contraseña")}
              </h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Actualiza periódicamente tu contraseña para mantener protegida tu cuenta.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all text-center"
            >
              {t("profile.security.changePassword", "Cambiar Contraseña")}
            </button>
          </div>
        )}

        {/* Opción 2: 2FA */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
          isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"
        }`}>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                userInfo.twoFactorEnabled ? "bg-emerald-500/10 text-emerald-500" : "bg-teal-500/10 text-teal-500"
              }`}>
                {userInfo.twoFactorEnabled ? "🛡️" : "🔐"}
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                userInfo.twoFactorEnabled
                  ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                  : "bg-gray-500/15 text-gray-400 border-gray-500/30"
              }`}>
                {userInfo.twoFactorEnabled ? `✓ ${t("profile.security.twoFactorActive", "2FA Habilitado")}` : t("profile.security.twoFactorInactive", "2FA Desactivado")}
              </span>
            </div>
            <h4 className="text-sm font-bold">
              {t("profile.security.twoFactorAuth", "Autenticación en Dos Pasos (2FA)")}
            </h4>
            <p className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {userInfo.twoFactorEnabled
                ? "Tu cuenta está protegida con verificación en dos pasos (TOTP / Authenticator)."
                : "Agrega una capa adicional de protección con Google Authenticator o Microsoft Authenticator."}
            </p>
          </div>
          {userInfo.twoFactorEnabled ? (
            <button
              type="button"
              onClick={handleOpenDisable2FA}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                isDarkMode
                  ? "bg-rose-950/20 border-rose-800/40 text-rose-400 hover:bg-rose-900/30"
                  : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
              }`}
            >
              {t("profile.security.disable2FA", "Desactivar 2FA")}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStart2FASetup}
              disabled={submitting2FA}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-md transition-all text-center disabled:opacity-50"
            >
              {submitting2FA ? "Cargando..." : t("profile.security.enable2FA", "Activar 2FA")}
            </button>
          )}
        </div>
      </div>

      {/* ZONA DE PELIGRO: ELIMINAR CUENTA */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDarkMode ? "bg-rose-950/20 border-rose-900/40" : "bg-rose-50/50 border-rose-200"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-rose-500 flex items-center gap-2">
              <span>⚠️</span>
              {t("profile.security.deleteAccount", "Eliminar mi cuenta")}
            </h4>
            <p className={`text-xs mt-1 max-w-xl ${isDarkMode ? "text-rose-300/70" : "text-rose-700/70"}`}>
              Esta acción es irreversible y eliminará todos tus datos, viajes e historial registrado en EcoRuteando.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenDeleteModal}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all shrink-0"
          >
            {t("profile.security.deleteAccount", "Eliminar mi cuenta")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
