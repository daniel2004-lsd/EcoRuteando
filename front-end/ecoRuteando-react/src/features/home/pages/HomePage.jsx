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

/* ── Marcador de ruta ── */
const PinDot = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" className="flex-shrink-0">
    <circle cx="5" cy="5" r="4" fill="currentColor" />
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
  
  // ✅ INICIALIZAR IDIOMA DESDE localStorage
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("appLanguage");
    return saved || i18n.language || 'es';
  });
  
  const dropdownRef = useRef(null);

  // ✅ GUARDAR IDIOMA CUANDO CAMBIA
  useEffect(() => {
    localStorage.setItem("appLanguage", language);
    i18n.changeLanguage(language);
    console.log('🔄 Idioma guardado:', language);
  }, [language, i18n]);

  // ✅ RESTAURAR IDIOMA AL CARGAR LA PÁGINA (NUEVO)
  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage");
    if (savedLang && savedLang !== i18n.language) {
      console.log('🔄 Restaurando idioma guardado:', savedLang);
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang);
    }
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
  
  // ✅ FALLBACKS PARA FEATURES CARDS
  const rawFeatureCards = t('features.cards', { returnObjects: true });
  const featureCards = Array.isArray(rawFeatureCards) && rawFeatureCards.length > 0 
    ? rawFeatureCards 
    : [
        { title: "Rutas Inteligentes", desc: "Combina bicicleta y transporte público con tiempos exactos y alternativas verdes." },
        { title: "Ahorro de CO₂", desc: "Cada trayecto suma. Visualiza el impacto positivo de tus decisiones de movilidad." },
        { title: "Comunidad Activa", desc: "Únete a una red de personas comprometidas con la movilidad sostenible en tu ciudad." }
      ];

  // ✅ FALLBACKS PARA WHY REASONS
  const rawWhyReasons = t('why.reasons', { returnObjects: true });
  const whyReasons = Array.isArray(rawWhyReasons) && rawWhyReasons.length > 0
    ? rawWhyReasons
    : [
        { title: "Movilidad integrada", desc: "Conecta fácilmente tramos en bicicleta con rutas de transporte público." },
        { title: "Salud y bienestar", desc: "Fomenta el ejercicio diario y mejora tu calidad de vida mientras te desplazas." },
        { title: "Impacto ambiental real", desc: "Cada kilómetro en bicicleta evita emisiones. Tu contribución cuenta." }
      ];

  // ✅ CHIPS DE IMPACTO CON FALLBACKS
  const heroStats = [
    { icon: BikeIcon, text: t('hero.chips.bike') || "Bici, bus o a pie" },
    { icon: LeafIcon, text: t('hero.chips.co2') || "-30% huella de CO₂" },
    { icon: MapIcon, text: t('hero.chips.routes') || "Rutas en segundos" },
  ];

  // ✅ TEXTO DEL HERO CON FALLBACKS
  const heroSubtitle = t('hero.subtitle') || "Tu guía para la movilidad sostenible";
  const heroDescription = t('hero.description') || "Descubre rutas ecológicas combinando transporte público y bicicleta. Cada viaje es una oportunidad para cuidar el planeta y reducir tu huella de carbono.";
  const heroRegisterBtn = t('hero.registerBtn') || "Regístrate ahora";
  const heroLoginBtn = t('hero.loginBtn') || "Iniciar sesión";
  const heroGuestBtn = t('hero.guestBtn') || "Modo Invitado";
  const heroBadge = t('hero.badge') || "Movilidad sostenible · SENA Neiva";

  // ✅ NAV CON FALLBACKS
  const navFeatures = t('nav.features') || "Características";
  const navBenefits = t('nav.benefits') || "Beneficios";
  const navJoin = t('nav.join') || "Unirse";
  const navLogin = t('nav.login') || "Iniciar sesión";
  const navRegister = t('nav.register') || "Registrarse";
  const navGuest = t('nav.guest') || "Modo Invitado";
  const navLanguage = t('nav.language') || "Idioma";

  // ✅ FEATURES CON FALLBACKS
  const featuresTag = t('features.tag') || "Características";
  const featuresTitle = t('features.title') || "Tres pasos hacia un viaje sostenible";
  const featuresDescription = t('features.description') || "Diseñado para que planifiques rutas ecológicas de forma rápida y sencilla";
  const featuresStop = t('features.stop') || "Parada";

  // ✅ WHY CON FALLBACKS
  const whyTag = t('why.tag') || "Beneficios";
  const whyTitle = t('why.title') || "¿Por qué elegir EcoRuteando?";
  const whyCo2 = t('why.co2') || "EMISIONES DE CO₂";

  // ✅ CTA CON FALLBACKS
  const ctaTitle = t('cta.title') || "Empieza hoy tu ruta sostenible";
  const ctaDescription = t('cta.description') || "Únete a EcoRuteando y haz que cada trayecto cuente para el planeta";
  const ctaButton = t('cta.button') || "Unirme a la revolución verde →";

  // ✅ FOOTER CON FALLBACKS
  const footerPrivacy = t('footer.privacy') || "Privacidad";
  const footerTerms = t('footer.terms') || "Términos";
  const footerContact = t('footer.contact') || "Contacto";

  return (
    <div className={`min-h-screen overflow-x-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>

      {/* ─── NAVBAR ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? isDarkMode ? "bg-gray-900/95 backdrop-blur-md shadow-lg py-3 border-b border-emerald-500/20" : "bg-white/90 backdrop-blur-md shadow-lg py-3 border-b border-emerald-100"
            : isDarkMode ? "bg-black/80 backdrop-blur-md py-5" : "bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg"
            onClick={() => scrollToSection("hero")}
          >
            <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-emerald-500/20' : 'bg-white'}`}>
              <LeafIcon size={20} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
            </div>
            <span className={`font-bold text-xl md:text-2xl tracking-tight ${scrolled ? (isDarkMode ? "text-white" : "text-gray-800") : "text-white"
              }`} style={{ fontFamily: "'Playfair Display', serif" }}>
              EcoRuteando
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8 lg:gap-10 text-base font-medium">
            <a href="#features" className={`relative pb-1 transition-colors duration-300 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full ${scrolled
                ? (isDarkMode ? "text-gray-300 hover:text-emerald-400" : "text-gray-700 hover:text-emerald-600")
                : "text-white/90 hover:text-white"
              }`}>
              {navFeatures}
            </a>
            <a href="#why" className={`relative pb-1 transition-colors duration-300 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full ${scrolled
                ? (isDarkMode ? "text-gray-300 hover:text-emerald-400" : "text-gray-700 hover:text-emerald-600")
                : "text-white/90 hover:text-white"
              }`}>
              {navBenefits}
            </a>
            <button onClick={() => onNavigate("/register")} className={`relative pb-1 transition-colors duration-300 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full ${scrolled
                ? (isDarkMode ? "text-gray-300 hover:text-emerald-400" : "text-gray-700 hover:text-emerald-600")
                : "text-white/90 hover:text-white"
              }`}>
              {navJoin}
            </button>
          </div>

          <div className="hidden md:flex gap-3 items-center">
            <button
              onClick={() => window.location.href = "/login"}
              className={`px-5 lg:px-6 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${scrolled
                  ? (isDarkMode ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black" : "border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white")
                  : "border-white/80 text-white hover:bg-white hover:text-emerald-900"
                }`}
            >
              {navLogin}
            </button>
            <button
              onClick={() => onNavigate("/register")}
              className={`px-5 lg:px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${isDarkMode ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
            >
              {navRegister}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-label="Cambiar idioma"
                aria-expanded={langDropdownOpen}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${scrolled
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

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            className="md:hidden flex flex-col gap-1.5 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg"
          >
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
            <button onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" className={`${isDarkMode ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-400 hover:text-emerald-600'} p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg`}>
              <CloseIcon />
            </button>
          </div>
          <div className="flex-1 py-4 px-4 space-y-1">
            <button onClick={() => scrollToSection("features")} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-medium text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-emerald-400' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}>
              <MapIcon size={22} /> {navFeatures}
            </button>
            <button onClick={() => scrollToSection("why")} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-medium text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-emerald-400' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}>
              <ActivityIcon size={22} /> {navBenefits}
            </button>
            <button onClick={() => { onNavigate("/register"); setMenuOpen(false); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-medium text-left ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-emerald-400' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}>
              <HeartIcon size={22} /> {navJoin}
            </button>

            <div className="pt-4 pb-2 px-1">
              <p className={`text-[10px] font-bold uppercase tracking-widest px-3 mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{navLanguage}</p>
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
              {navRegister} →
            </button>
            <button onClick={() => { onNavigate("/login"); setMenuOpen(false); }} className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
              {navLogin}
            </button>
            <button onClick={() => { handleGuestMode(); setMenuOpen(false); }} className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-800 border border-emerald-500/50 text-emerald-400 hover:bg-gray-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}>
              {navGuest}
            </button>
          </div>
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section id="hero" className="relative min-h-[88vh] flex flex-col items-center justify-center px-5 text-center overflow-hidden">
        {isDarkMode ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-gray-900 to-teal-950" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full -translate-x-48 -translate-y-48" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full translate-x-48 translate-y-48" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-green-700 to-teal-700" />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-x-64 -translate-y-64" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-400/10 rounded-full translate-x-64 translate-y-64" />
            <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          </>
        )}

        <svg className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 600" fill="none">
          <path d="M-20 480 C 180 480, 220 340, 380 320 S 600 200, 700 180 S 920 80, 1020 60" stroke="white" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" />
        </svg>

        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative w-28 h-28 md:w-32 md:h-32 bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-float">
              <LeafIcon size={52} className="text-emerald-600" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 ring-4 ring-emerald-700/30" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-white/10 border border-white/25 backdrop-blur-sm text-emerald-50 text-xs font-semibold tracking-wide uppercase">
            <span className="text-amber-400"><PinDot /></span>
            {heroBadge}
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight px-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            EcoRuteando
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-emerald-100 mb-4 px-4">
            {heroSubtitle}
          </p>

          <p className={`max-w-3xl mx-auto mb-9 text-sm md:text-base leading-relaxed px-4 ${isDarkMode ? 'text-gray-200' : 'text-green-50'}`}>
            {heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 mb-10">
            <button
              onClick={() => onNavigate("/register")}
              className="group w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white text-emerald-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              {heroRegisterBtn}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-1">→</span>
            </button>
            <button
              onClick={() => onNavigate("/login")}
              className={`w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 rounded-2xl font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${isDarkMode
                  ? 'bg-emerald-600/80 backdrop-blur-sm text-white border border-emerald-400/50 hover:bg-emerald-600'
                  : 'bg-white/15 backdrop-blur-md text-white border border-white/40 hover:bg-white/25'
                }`}
            >
              {heroLoginBtn}
            </button>
            <button
              onClick={handleGuestMode}
              className={`w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 rounded-2xl font-medium text-base md:text-lg text-white/85 underline-offset-4 hover:underline transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60`}
            >
              {heroGuestBtn}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 px-4">
            {heroStats.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-emerald-50 text-sm font-medium">
                <Icon size={16} className="text-amber-300" />
                {text}
              </div>
            ))}
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
          <div className="text-center mb-14">
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-green-100'}`}>
                <LeafIcon size={28} className="text-emerald-500" />
              </div>
            </div>
            <span className="text-emerald-600 text-sm font-semibold uppercase tracking-wider">{featuresTag}</span>
            <h2 className={`text-3xl md:text-4xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
              {featuresTitle}
            </h2>
            <p className={`mt-3 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{featuresDescription}</p>
          </div>

          <div className="hidden md:grid grid-cols-3 relative mb-5 px-[8%]">
            <div
              className={`absolute top-1/2 left-[16.5%] right-[16.5%] border-t-2 border-dashed -translate-y-1/2 ${isDarkMode ? 'border-emerald-700/60' : 'border-emerald-300'}`}
            />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex justify-center relative z-10">
                <div className={`w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md ring-4 ${isDarkMode ? 'bg-emerald-500 ring-gray-900' : 'bg-emerald-600 ring-white'}`}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards.map((card, i) => {
              const icons = [MapIcon, ActivityIcon, HeartIcon];
              const Icon = icons[i] || LeafIcon;
              const colors = ["from-emerald-500 to-green-500", "from-teal-500 to-cyan-500", "from-amber-500 to-orange-500"];

              return (
                <div key={i} className={`group rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-100'}`}>
                  <div className="md:hidden text-xs font-bold text-emerald-500 mb-2 tracking-widest uppercase">{featuresStop} {i + 1}</div>
                  <div className={`w-20 h-20 bg-gradient-to-br ${colors[i % colors.length]} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <Icon size={36} className="text-white" />
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
            <span className="text-emerald-600 text-sm font-semibold uppercase tracking-wider">{whyTag}</span>
            <h2 className={`text-3xl md:text-4xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
              {whyTitle}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              {whyReasons.map((reason, i) => {
                const icons = [BikeIcon, BusIcon, LeafIcon];
                const Icon = icons[i] || LeafIcon;
                const iconColors = ["text-emerald-600", "text-teal-600", "text-amber-500"];
                const bgColors = ["bg-emerald-100", "bg-teal-100", "bg-amber-100"];
                const darkBgColors = ["bg-emerald-900/30", "bg-teal-900/30", "bg-amber-900/20"];

                return (
                  <div key={i} className={`flex gap-5 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${isDarkMode ? darkBgColors[i % darkBgColors.length] : bgColors[i % bgColors.length]}`}>
                      <Icon size={24} className={iconColors[i % iconColors.length]} />
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
              <svg className="absolute w-[110%] h-[110%] -z-0 opacity-40" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke={isDarkMode ? "#10b981" : "#10b981"} strokeWidth="0.6" strokeDasharray="1.5 4" />
              </svg>
              <div className="relative w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <span className="absolute top-6 right-10 w-4 h-4 rounded-full bg-amber-400 shadow-md" />
                <div className="w-52 h-52 md:w-60 md:h-60 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
                  <LeafIcon size={72} className="text-emerald-600 mb-3" />
                  <p className="text-4xl md:text-5xl font-black text-emerald-600">-30%</p>
                  <p className="text-sm text-gray-500 font-semibold tracking-wide">{whyCo2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 to-green-700" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full -translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full translate-x-48 translate-y-48" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-float">
              <LeafIcon size={40} className="text-emerald-600" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {ctaTitle}
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            {ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button
              onClick={() => onNavigate("/register")}
              className="px-10 py-4 bg-white text-emerald-700 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              {ctaButton}
            </button>
            <button
              onClick={handleGuestMode}
              className="px-10 py-4 bg-emerald-600/80 backdrop-blur-sm text-white border border-emerald-400/50 rounded-xl font-semibold text-lg hover:bg-emerald-600 transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {navGuest}
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
            <button className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded">{footerPrivacy}</button>
            <span className="text-gray-600">|</span>
            <button className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded">{footerTerms}</button>
            <span className="text-gray-600">|</span>
            <button className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded">{footerContact}</button>
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

        @media (prefers-reduced-motion: reduce) {
          .animate-float, .animate-bounce, .animate-pulse {
            animation: none !important;
          }
          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;