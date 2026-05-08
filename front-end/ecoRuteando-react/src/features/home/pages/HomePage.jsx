import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { LeafIcon, MapIcon, ActivityIcon, HeartIcon, BikeIcon, BusIcon, CloseIcon } from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";

/* ── Ícono globo inline ── */
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

/* ── Idiomas disponibles ── */
const LANGUAGES = [
  { code: "es", label: "Español", flag: "🇨🇴" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const HomePage = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("appLanguage") || i18n.language || 'es';
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("appLanguage", language);
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  const changeLanguage = (lng) => {
    setLanguage(lng);
    setLangDropdownOpen(false);
  };

  const handleGuestMode = () => {
    onNavigate("/dashboard");
  };

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>

      {/* ─── NAVBAR ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? isDarkMode ? "bg-gray-900/95 backdrop-blur-md shadow-lg py-3 border-b border-emerald-500/20" : "bg-white/95 backdrop-blur-md shadow-lg py-3"
            : isDarkMode ? "bg-black/80 backdrop-blur-md py-5" : "bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("hero")}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-emerald-500/20' : 'bg-white'}`}>
              <LeafIcon size={20} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
            </div>
            <span className={`font-bold text-xl md:text-2xl tracking-tight ${scrolled ? (isDarkMode ? "text-white" : "text-gray-800") : "text-white"
              }`} style={{ fontFamily: "'Playfair Display', serif" }}>
              EcoRuteando
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 lg:gap-10 text-base font-medium">
            <a href="#features" className={`transition-colors duration-300 hover:scale-105 ${scrolled
                ? (isDarkMode ? "text-gray-300 hover:text-emerald-400" : "text-gray-700 hover:text-emerald-600")
                : "text-white/90 hover:text-white"
              }`}>
              Características
            </a>
            <a href="#why" className={`transition-colors duration-300 hover:scale-105 ${scrolled
                ? (isDarkMode ? "text-gray-300 hover:text-emerald-400" : "text-gray-700 hover:text-emerald-600")
                : "text-white/90 hover:text-white"
              }`}>
              Beneficios
            </a>
            <button onClick={() => onNavigate("/register")} className={`transition-colors duration-300 hover:scale-105 ${scrolled
                ? (isDarkMode ? "text-gray-300 hover:text-emerald-400" : "text-gray-700 hover:text-emerald-600")
                : "text-white/90 hover:text-white"
              }`}>
              Unirse
            </button>
          </div>

          <div className="hidden md:flex gap-3 items-center">
            <button
              onClick={() => window.location.href = "/login"}
              className={`px-5 lg:px-6 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-300 hover:scale-105 ${scrolled
                  ? (isDarkMode ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black" : "border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white")
                  : "border-white/80 text-white hover:bg-white hover:text-emerald-900"
                }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => onNavigate("/register")}
              className={`px-5 lg:px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 ${isDarkMode ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
            >
              Registrarse
            </button>

            {/* Selector de idioma Desktop */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${scrolled
                    ? (isDarkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200")
                    : (isDarkMode ? "bg-gray-800/50 text-white hover:bg-gray-700 border border-white/20" : "bg-white/10 text-white hover:bg-white/20 border border-white/20")
                  }`}
              >
                <GlobeIcon />
                <span>{currentLang.flag}</span>
                <span className="text-xs">{currentLang.label}</span>
                <svg className={`w-3 h-3 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-40 rounded-xl shadow-lg overflow-hidden z-50 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${language === lang.code
                          ? (isDarkMode ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700')
                          : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50')
                        }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.label}</span>
                      {language === lang.code && (
                        <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setMenuOpen(true)} className="md:hidden flex flex-col gap-1.5 p-2">
            <span className={`w-6 h-0.5 rounded-full transition-all ${scrolled ? (isDarkMode ? "bg-white" : "bg-gray-800") : "bg-white"}`} />
            <span className={`w-6 h-0.5 rounded-full transition-all ${scrolled ? (isDarkMode ? "bg-white" : "bg-gray-800") : "bg-white"}`} />
            <span className={`w-6 h-0.5 rounded-full transition-all ${scrolled ? (isDarkMode ? "bg-white" : "bg-gray-800") : "bg-white"}`} />
          </button>
        </div>
      </nav>

      {/* ─── SIDEBAR ─── */}
      <div className={`fixed inset-0 z-[100] md:hidden ${menuOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/80' : 'bg-black/60'} backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMenuOpen(false)} />
        <div className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col shadow-2xl transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className={`p-5 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <LeafIcon size={24} className="text-emerald-500" />
              <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>EcoRuteando</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className={`${isDarkMode ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-400 hover:text-emerald-600'} p-2 transition-colors`}>
              <CloseIcon />
            </button>
          </div>
          <div className="flex-1 py-4 px-4 space-y-1">
            <button onClick={() => scrollToSection("features")} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-medium text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-emerald-400' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}>
              <MapIcon size={22} /> Características
            </button>
            <button onClick={() => scrollToSection("why")} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-medium text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-emerald-400' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}>
              <ActivityIcon size={22} /> Beneficios
            </button>
            <button onClick={() => { onNavigate("/register"); setMenuOpen(false); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-medium text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-emerald-400' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}>
              <HeartIcon size={22} /> Unirse
            </button>

            <div className="pt-4 pb-2 px-1">
              <p className={`text-[10px] font-bold uppercase tracking-widest px-3 mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Idioma</p>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm transition-colors ${language === lang.code
                        ? isDarkMode ? "bg-gray-700 text-emerald-400 font-bold border border-emerald-500" : "bg-emerald-50 text-gray-800 font-bold border border-emerald-200"
                        : isDarkMode ? "text-gray-400 hover:bg-gray-700 border border-gray-700" : "text-gray-600 hover:bg-gray-50 border border-gray-100"
                      }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={`p-5 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col gap-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <button onClick={() => { onNavigate("/register"); setMenuOpen(false); }} className="w-full py-4 rounded-2xl font-bold shadow-lg text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-all">
              Registrarse →
            </button>
            <button onClick={() => { onNavigate("/login"); setMenuOpen(false); }} className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
              Iniciar sesión
            </button>
            <button onClick={() => { handleGuestMode(); setMenuOpen(false); }} className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-800 border border-emerald-500/50 text-emerald-400 hover:bg-gray-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}>
              Modo Invitado
            </button>
          </div>
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section id="hero" className="relative min-h-[85vh] flex flex-col items-center justify-center px-5 text-center overflow-hidden">
        {/* Fondo condicional */}
        {isDarkMode ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 to-green-900/50" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full -translate-x-48 -translate-y-48" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 rounded-full translate-x-48 translate-y-48" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-green-700 to-teal-700" />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-x-64 -translate-y-64" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full translate-x-64 translate-y-64" />
            <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          </>
        )}

        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-float">
              <LeafIcon size={52} className="text-emerald-600" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight px-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            EcoRuteando
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-emerald-100 mb-4 px-4">
            {t('hero.subtitle')}
          </p>

          <p className={`max-w-3xl mx-auto mb-8 text-sm md:text-base leading-relaxed px-4 ${isDarkMode ? 'text-gray-200' : 'text-green-50'}`}>
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <button
              onClick={() => onNavigate("/register")}
              className={`group w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${isDarkMode
                  ? 'bg-white text-emerald-700 hover:bg-gray-100'
                  : 'bg-white text-emerald-700'
                }`}
            >
              {t('hero.registerBtn')}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-1">→</span>
            </button>
            <button
              onClick={() => onNavigate("/login")}
              className={`w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 rounded-2xl font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105 ${isDarkMode
                  ? 'bg-emerald-600/80 backdrop-blur-sm text-white border border-emerald-400/50 hover:bg-emerald-600'
                  : 'bg-white/20 backdrop-blur-md text-white border border-white/40 hover:bg-white/30'
                }`}
            >
              {t('hero.loginBtn')}
            </button>
            <button
              onClick={handleGuestMode}
              className={`w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 rounded-2xl font-medium text-base md:text-lg transition-all duration-300 hover:scale-105 ${isDarkMode
                  ? 'bg-gray-800/80 backdrop-blur-sm text-white border border-gray-600 hover:bg-gray-700'
                  : 'bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20'
                }`}
            >
              {t('hero.guestBtn')}
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-7 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1.5 h-2.5 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* SECCIÓN FEATURES */}
      <section id="features" className={`py-20 px-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-green-100'}`}>
                <LeafIcon size={28} className="text-emerald-500" />
              </div>
            </div>
            <span className="text-emerald-600 text-sm font-semibold uppercase tracking-wider">Características</span>
            <h2 className={`text-3xl md:text-4xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('features.title')}
            </h2>
            <p className={`mt-3 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('features.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t('features.cards', { returnObjects: true }).map((card, i) => {
              const icons = [<MapIcon size={36} />, <ActivityIcon size={36} />, <HeartIcon size={36} />];
              const colors = ["from-emerald-500 to-green-500", "from-teal-500 to-cyan-500", "from-green-500 to-emerald-500"];

              return (
                <div key={i} className={`group rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-100'}`}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${colors[i]} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <div className="text-white">{icons[i]}</div>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{card.title}</h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECCIÓN BENEFICIOS */}
      <section id="why" className={`py-20 px-6 ${isDarkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-green-100'}`}>
                <LeafIcon size={32} className="text-emerald-500" />
              </div>
            </div>
            <span className="text-emerald-600 text-sm font-semibold uppercase tracking-wider">BENEFICIOS</span>
            <h2 className={`text-3xl md:text-4xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
              Why choose EcoRuteando?
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              {t('why.reasons', { returnObjects: true }).map((reason, i) => {
                const icons = [<BikeIcon size={24} />, <ActivityIcon size={24} />, <LeafIcon size={24} />];
                const iconColors = ["text-emerald-600", "text-teal-600", "text-green-600"];
                const bgColors = ["bg-emerald-100", "bg-teal-100", "bg-green-100"];
                const darkBgColors = ["bg-emerald-900/30", "bg-teal-900/30", "bg-green-900/30"];

                return (
                  <div key={i} className={`flex gap-5 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${isDarkMode ? darkBgColors[i] : bgColors[i]}`}>
                      <div className={iconColors[i]}>{icons[i]}</div>
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{reason.title}</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{reason.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative flex justify-center">
              <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-52 h-52 md:w-60 md:h-60 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
                  <LeafIcon size={72} className="text-emerald-600 mb-3" />
                  <p className="text-4xl md:text-5xl font-black text-emerald-600">-30%</p>
                  <p className="text-sm text-gray-500 font-semibold">CO₂</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-700" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 rounded-full translate-x-48 translate-y-48" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-float">
              <LeafIcon size={40} className="text-emerald-600" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Start your sustainable journey today
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Join EcoRuteando and make every trip count for the planet
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button className="px-10 py-4 bg-white text-emerald-700 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-100">
              Join the green revolution →
            </button>
            <button className="px-10 py-4 bg-emerald-600/80 backdrop-blur-sm text-white border border-emerald-400/50 rounded-xl font-semibold text-lg hover:bg-emerald-600 transition-all duration-300 hover:scale-105">
              Guest Mode
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-10 px-6 ${isDarkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-gray-900'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <LeafIcon size={20} className="text-emerald-600" />
            </div>
            <span className="font-bold text-white text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              EcoRuteando
            </span>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            © 2025 EcoRuteando — SENA · Neiva, Colombia
          </p>

          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <button className="hover:text-emerald-400 transition-colors">Privacy</button>
            <span className="text-gray-600">|</span>
            <button className="hover:text-emerald-400 transition-colors">Terms</button>
            <span className="text-gray-600">|</span>
            <button className="hover:text-emerald-400 transition-colors">Contact</button>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

export default HomePage;