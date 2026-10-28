import React from "react";

const StatsCards = ({ isDarkMode, stats, t }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Viajes Completados */}
      <div className={`p-5 rounded-2xl border transition-all shadow-sm ${
        isDarkMode ? "bg-[#162329]/80 border-[#26383D]" : "bg-white border-gray-100"
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {t("profile.stats.routesCompleted", "Viajes Completados")}
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            🗺️
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500">
          {stats.completedTrips}
        </p>
        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Trayectos registrados en la plataforma
        </p>
      </div>

      {/* CO2 Evitado */}
      <div className={`p-5 rounded-2xl border transition-all shadow-sm ${
        isDarkMode ? "bg-[#162329]/80 border-[#26383D]" : "bg-white border-gray-100"
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {t("profile.stats.co2Saved", "CO₂ Evitado")}
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            🌿
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500">
          {stats.co2Saved} <span className="text-sm font-semibold text-emerald-400">kg</span>
        </p>
        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Emisiones contaminantes mitigadas
        </p>
      </div>

      {/* Tiempo Sostenible */}
      <div className={`p-5 rounded-2xl border transition-all shadow-sm ${
        isDarkMode ? "bg-[#162329]/80 border-[#26383D]" : "bg-white border-gray-100"
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {t("profile.stats.activeTime", "Tiempo Sostenible")}
          </span>
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">
            ⏱️
          </div>
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-teal-500">
          {stats.totalMinutes} <span className="text-sm font-semibold text-teal-400">min</span>
        </p>
        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Desplazándote de forma activa y verde
        </p>
      </div>
    </div>
  );
};

export default StatsCards;
