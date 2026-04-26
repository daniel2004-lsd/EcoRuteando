import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { LeafIcon, MapIcon, ActivityIcon, HeartIcon, BikeIcon, BusIcon, CloseIcon } from "../../../shared/components/Icons";

/* ── Ícono globo inline ── */
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

/* ── Idiomas disponibles ── */
const LANGUAGES = [
  { code: "es", label: "Español",    flag: "🇨🇴" },
  { code: "en", label: "English",    flag: "🇺🇸" },
  { code: "pt", label: "Português",  flag: "🇧🇷" },
  { code: "fr", label: "Français",   flag: "🇫🇷" },
];

const HomePage = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("appLanguage") || i18n.language || 'es';
  });

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

  /* Cierra el dropdown de idioma al hacer clic fuera */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
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
  };

  const handleGuestMode = () => {
    onNavigate("dashboard");
  };

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 overflow-x-hidden">

      {/* ─── NAVBAR CORREGIDO - LOGO SIEMPRE VISIBLE ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md py-3"
            : "bg-gradient-to-r from-green-900 to-emerald-800 py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo - SIEMPRE CON FONDO BLANCO */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection("hero")}>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <LeafIcon size={16} className="text-green-600" />
            </div>
            <span className={`font-bold text-lg md:text-xl tracking-tight ${
              scrolled ? "text-green-800" : "text-white"
            }`} style={{ fontFamily: "'Playfair Display', serif" }}>
              EcoRuteando
            </span>
          </div>

          {/* MENÚ CENTRAL */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            <a href="#features" className={`transition-colors ${scrolled ? "text-gray-600 hover:text-green-600" : "text-white/90 hover:text-white"}`}>
              Features
            </a>
            <a href="#why" className={`transition-colors ${scrolled ? "text-gray-600 hover:text-green-600" : "text-white/90 hover:text-white"}`}>
              Why?
            </a>
            <button onClick={() => onNavigate("register")} className={`transition-colors ${scrolled ? "text-gray-600 hover:text-green-600" : "text-white/90 hover:text-white"}`}>
              Join
            </button>
          </div>

          {/* BOTONES DERECHA */}
          <div className="hidden md:flex gap-3 items-center">
            <button
              onClick={() => onNavigate("login")}
              className={`px-4 lg:px-5 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                scrolled 
                  ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white" 
                  : "border-white/80 text-white hover:bg-white hover:text-green-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => onNavigate("register")}
              className="px-4 lg:px-5 py-2 rounded-xl text-sm font-semibold shadow-md bg-green-600 hover:bg-green-700 text-white transition-all"
            >
              Register
            </button>
          </div>

          {/* Hamburguesa */}
          <button onClick={() => setMenuOpen(true)} className="md:hidden flex flex-col gap-1.5 p-2">
            <span className={`w-6 h-0.5 rounded-full transition-all ${scrolled ? "bg-green-800" : "bg-white"}`} />
            <span className={`w-6 h-0.5 rounded-full transition-all ${scrolled ? "bg-green-800" : "bg-white"}`} />
            <span className={`w-6 h-0.5 rounded-full transition-all ${scrolled ? "bg-green-800" : "bg-white"}`} />
          </button>
        </div>
      </nav>

      {/* ─── SIDEBAR ─── */}
      <div className={`fixed inset-0 z-[100] md:hidden ${menuOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMenuOpen(false)} />
        <div className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LeafIcon size={24} className="text-green-600" />
              <span className="font-bold text-lg text-green-800">EcoRuteando</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="text-gray-400 p-2 hover:text-green-600 transition-colors">
              <CloseIcon />
            </button>
          </div>
          <div className="flex-1 py-4 px-4 space-y-1">
            <button onClick={() => scrollToSection("features")} className="w-full flex items-center gap-4 p-4 rounded-2xl text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all font-medium text-left">
              <MapIcon size={22} /> {t('navbar.features')}
            </button>
            <button onClick={() => scrollToSection("why")} className="w-full flex items-center gap-4 p-4 rounded-2xl text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all font-medium text-left">
              <ActivityIcon size={22} /> {t('navbar.why')}
            </button>
            <button onClick={() => { onNavigate("register"); setMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all font-medium text-left">
              <HeartIcon size={22} /> {t('navbar.join')}
            </button>

            {/* Idiomas en el sidebar móvil */}
            <div className="pt-2 pb-1 px-1">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-3 mb-2">Idioma</p>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm transition-colors ${
                      language === lang.code
                        ? "bg-green-50 text-green-800 font-bold border border-green-200"
                        : "text-gray-600 hover:bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-5 bg-gray-50 flex flex-col gap-3 border-t border-gray-100">
            <button onClick={() => { onNavigate("register"); setMenuOpen(false); }} className="w-full py-4 rounded-2xl font-bold shadow-lg text-sm text-white bg-green-600 hover:bg-green-700 transition-all">
              {t('navbar.register')} →
            </button>
            <button onClick={() => { onNavigate("login"); setMenuOpen(false); }} className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all">
              {t('navbar.login')}
            </button>
            <button onClick={() => { handleGuestMode(); setMenuOpen(false); }} className="w-full bg-green-50 border border-green-200 text-green-700 py-4 rounded-2xl font-semibold text-sm hover:bg-green-100 transition-all">
              {t('hero.guestBtn') || "Modo Invitado"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-5 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-emerald-700 to-teal-800" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-40 -translate-y-40" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-40 translate-y-40" />

        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-float">
              <LeafIcon size={48} className="text-green-600" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight px-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            EcoRuteando
          </h1>

          <p className="text-xl md:text-2xl font-semibold text-green-100 mb-4 px-4">
            {t('hero.subtitle')}
          </p>

          <p className="max-w-2xl mx-auto mb-10 text-green-50 text-sm md:text-base leading-relaxed px-4">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <button onClick={() => onNavigate("register")} className="group w-full sm:w-auto bg-white text-green-700 px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              {t('hero.registerBtn')}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <button onClick={() => onNavigate("login")} className="w-full sm:w-auto bg-white/20 backdrop-blur-md text-white border border-white/40 px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
              {t('hero.loginBtn')}
            </button>
            <button onClick={handleGuestMode} className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300">
              {t('hero.guestBtn')}
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: FEATURES */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                <LeafIcon size={24} className="text-green-600" />
              </div>
            </div>
            <span className="text-green-600 text-sm font-semibold uppercase tracking-wider">Características</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('features.title')}
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">{t('features.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t('features.cards', { returnObjects: true }).map((card, i) => {
              const icons = [<MapIcon size={32} />, <ActivityIcon size={32} />, <HeartIcon size={32} />];
              const colors = ["from-green-500 to-emerald-500", "from-teal-500 to-cyan-500", "from-emerald-500 to-green-500"];

              return (
                <div key={i} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colors[i]} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <div className="text-white">{icons[i]}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: BENEFICIOS */}
      <section id="why" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                <LeafIcon size={28} className="text-green-600" />
              </div>
            </div>
            <span className="text-green-600 text-sm font-semibold uppercase tracking-wider">BENEFICIOS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Why choose EcoRuteando?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BikeIcon size={22} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Bike and public transport</h4>
                  <p className="text-gray-500 text-sm">Combine the best of both for efficient and healthy trips.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ActivityIcon size={22} className="text-teal-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Real-time info</h4>
                  <p className="text-gray-500 text-sm">Know estimated times and the best available options.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <LeafIcon size={22} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Environmental commitment</h4>
                  <p className="text-gray-500 text-sm">Every trip helps reduce pollution and improve air quality.</p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
                  <LeafIcon size={56} className="text-green-600 mb-2" />
                  <p className="text-3xl md:text-4xl font-black text-green-600">-30%</p>
                  <p className="text-xs text-gray-500 font-semibold">CO₂</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-800" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl animate-float">
              <LeafIcon size={40} className="text-green-600" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Start your sustainable journey today
          </h2>
          <p className="text-green-100 text-base mb-8 max-w-md mx-auto">
            Join EcoRuteando and make every trip count for the planet
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => onNavigate("register")} className="px-8 py-3 bg-white text-green-700 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Join the green revolution →
            </button>
            <button onClick={handleGuestMode} className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl font-medium hover:bg-white/30 transition-all duration-300">
              Guest Mode
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <LeafIcon size={16} className="text-green-600" />
            </div>
            <span className="font-bold text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              EcoRuteando
            </span>
          </div>
          
          <p className="text-gray-400 text-xs mb-4">
            © 2025 EcoRuteando — SENA · Neiva, Colombia
          </p>
          
          <div className="flex justify-center gap-6 text-xs text-gray-500">
            <button className="hover:text-white transition-colors">Privacy</button>
            <span className="text-gray-600">|</span>
            <button className="hover:text-white transition-colors">Terms</button>
            <span className="text-gray-600">|</span>
            <button className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

export default HomePage;
