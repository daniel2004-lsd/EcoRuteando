import React from "react";
import toast from "react-hot-toast";

const PreferencesTab = ({
  isDarkMode,
  toggleTheme,
  language,
  changeLanguage,
  languages,
  t
}) => {
  return (
    <div className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-md space-y-6 ${
      isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"
    }`}>
      <div>
        <h3 className="text-lg font-bold">
          {t("profile.config.title", "Preferencias del Sistema")}
        </h3>
        <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {t("profile.config.subtitle", "Personaliza la apariencia y el idioma de EcoRuteando")}
        </p>
      </div>

      <div className="space-y-4">
        {/* Tema Oscuro / Claro */}
        <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
          isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"
        }`}>
          <div>
            <h4 className="text-sm font-bold">
              {t("profile.config.darkMode", "Modo Oscuro")}
            </h4>
            <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {t("profile.config.darkModeDesc", "Cambia entre el tema claro y oscuro de la aplicación")}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
              isDarkMode
                ? "bg-amber-400 text-gray-900 border-amber-300 shadow-md"
                : "bg-[#162329] text-gray-100 border-[#26383D] shadow-md"
            }`}
          >
            <span>{isDarkMode ? "☀️" : "🌙"}</span>
            <span>{isDarkMode ? t("profile.config.lightMode", "Modo Claro") : t("profile.config.darkMode", "Modo Oscuro")}</span>
          </button>
        </div>

        {/* Selector de Idioma */}
        <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"
        }`}>
          <div>
            <h4 className="text-sm font-bold">
              {t("profile.config.language", "Idioma del Sistema")}
            </h4>
            <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {t("profile.config.languageDesc", "Selecciona el idioma de tu preferencia")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  changeLanguage(lang.code);
                  toast.success(`Idioma cambiado a ${lang.name}`);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  language === lang.code
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-md"
                    : isDarkMode
                      ? "bg-[#162329] border-[#26383D] text-gray-300 hover:bg-[#1f3037]"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Banner informativo de responsividad */}
        <div className={`p-4 rounded-2xl border text-center text-xs font-medium ${
          isDarkMode ? "bg-[#111C20]/40 border-[#26383D]/40 text-gray-400" : "bg-emerald-50/50 border-emerald-100 text-emerald-800"
        }`}>
          🌿 {t("profile.config.responsive", "EcoRuteando está optimizado para dispositivos móviles y de escritorio.")}
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;
