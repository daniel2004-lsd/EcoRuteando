import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";
import esTranslation from "./locales/es/translation.json";
import ptTranslation from "./locales/pt/translation.json";
import frTranslation from "./locales/fr/translation.json";

const savedLanguage =
  (typeof window !== "undefined" &&
    (localStorage.getItem("language") ||
      localStorage.getItem("appLanguage") ||
      localStorage.getItem("i18nextLng"))) ||
  "es";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      pt: { translation: ptTranslation },
      fr: { translation: frTranslation },
    },
    lng: savedLanguage,
    fallbackLng: "es",
    interpolation: { escapeValue: false },
  });

export default i18n;