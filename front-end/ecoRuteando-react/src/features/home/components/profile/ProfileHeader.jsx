import React from "react";
import {
  LeafIcon,
  ArrowLeft,
  MapPinIcon,
  MailIcon,
  PhoneIcon
} from "../../../../shared/components/Icons";

const ProfileHeader = ({ isDarkMode, profile, onNavigate, t }) => {
  return (
    <>
      {/* HEADER SUPERIOR */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
        isDarkMode ? "bg-[#162329]/90 border-[#26383D]" : "bg-white/90 border-gray-100 shadow-sm"
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/20 text-white font-bold">
              <LeafIcon size={22} white={true} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {t("profile.title", "Mi Perfil")}
              </h1>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {profile.email || "usuario@ecoruteando.org"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("/dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border shadow-sm ${
              isDarkMode
                ? "bg-[#111C20] border-[#26383D] text-gray-200 hover:bg-[#1f3037]"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-emerald-300"
            }`}
          >
            <ArrowLeft size={16} />
            <span>{t("profile.back", "Volver al Dashboard")}</span>
          </button>
        </div>
      </header>

      {/* TARJETA HERO DEL USUARIO */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all backdrop-blur-sm relative overflow-hidden shadow-lg ${
        isDarkMode
          ? "bg-gradient-to-br from-[#162329] to-[#0D1A20] border-[#26383D]"
          : "bg-white/95 border-emerald-100"
      }`}>
        {/* Acento decorativo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* AVATAR ESTILIZADO */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 p-1 shadow-xl flex items-center justify-center">
              <div className={`w-full h-full rounded-[22px] flex items-center justify-center font-extrabold text-3xl sm:text-4xl text-white shadow-inner ${
                isDarkMode ? "bg-[#111C20]" : "bg-emerald-600"
              }`}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111C20] shadow-md flex items-center justify-center text-[10px] text-white">
              ✓
            </span>
          </div>

          {/* INFORMACIÓN DEL USUARIO */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {profile.name || "Usuario EcoRuteando"}
              </h2>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                isDarkMode
                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                  : "bg-emerald-100 text-emerald-800 border-emerald-200"
              }`}>
                <span>🌱</span>
                <span>Movilidad Sostenible</span>
              </span>
            </div>

            <p className={`text-sm max-w-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {profile.bio}
            </p>

            <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              <span className="flex items-center gap-1.5">
                <MapPinIcon size={14} className="text-emerald-500" />
                {profile.location}
              </span>
              <span className="flex items-center gap-1.5">
                <MailIcon size={14} className="text-emerald-500" />
                {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <PhoneIcon size={14} className="text-emerald-500" />
                  {profile.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
