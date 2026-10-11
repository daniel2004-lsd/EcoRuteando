// LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(() => {
    return (
      localStorage.getItem("language") ||
      localStorage.getItem("appLanguage") ||
      i18n.language ||
      "es"
    );
  });

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
      localStorage.setItem("language", language);
      localStorage.setItem("appLanguage", language);
      localStorage.setItem("i18nextLng", language);
      document.documentElement.lang = language;
    }
  }, [language, i18n]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};