import React from "react";
import { useTranslation } from "react-i18next";

export const FrequentAddressesBar = ({ addressHistory, onSelectAddress, isDarkMode }) => {
  const { t } = useTranslation();

  if (!addressHistory || addressHistory.length === 0) return null;

  return (
    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-[#26383D]">
      <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1">
        <span>🕒</span>
        <span>{t("planRoute.frequentAddresses", "Direcciones frecuentes (CU27)")}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
        {addressHistory.slice(0, 5).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectAddress(item)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors truncate max-w-[220px] ${
              isDarkMode
                ? "bg-[#162329] border-[#26383D] text-gray-300 hover:border-emerald-500"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-emerald-500"
            }`}
            title={item.searchText}
          >
            📍 {item.searchText}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FrequentAddressesBar;
