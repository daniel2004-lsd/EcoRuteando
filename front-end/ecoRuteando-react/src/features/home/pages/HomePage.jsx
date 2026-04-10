import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LeafIcon, MapIcon, ActivityIcon, HeartIcon, BikeIcon, BusIcon, CloseIcon } from "../../../shared/components/Icons";

const HomePage = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language || 'es');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const scrollToSection = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const changeLanguage = (lng) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ─── NAVBAR PRINCIPAL ─── */}
     <nav
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled
      ? "bg-white shadow-md py-3 text-green-900"
      : "bg-black/30 backdrop-blur-md py-5 text-white"
  }`}
>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-green-100 p-1">
              <LeafIcon size={16} blend="multiply" />
            </div>
            <span className="font-bold text-xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              EcoRuteando
            </span>
          </div>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className={`nav-link transition-colors ${scrolled ? "text-gray-600 hover:text-green-800" : "text-white/90 hover:text-white"}`}>
              {t('navbar.features')}
            </a>
            <a href="#why" className={`nav-link transition-colors ${scrolled ? "text-gray-600 hover:text-green-800" : "text-white/90 hover:text-white"}`}>
              {t('navbar.why')}
            </a>
            <button onClick={() => onNavigate("register")} className={`nav-link transition-colors ${scrolled ? "text-gray-600 hover:text-green-800" : "text-white/90 hover:text-white"}`}>
              {t('navbar.join')}
            </button>
          </div>

          {/* Botones Desktop */}
          <div className="hidden md:flex gap-3">
            <button 
              onClick={() => onNavigate("login")} 
              className={`px-5 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${scrolled ? "border-green-700 text-green-700 hover:bg-green-700 hover:text-white" : "border-white/80 text-white hover:bg-white hover:text-green-900"}`}
            >
              {t('navbar.login')}
            </button>
            <button 
              onClick={() => onNavigate("register")} 
              className="btn-primary text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md"
            >
              {t('navbar.register')}
            </button>
            <select 
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-white text-green-900 border border-green-700 rounded-xl px-3 py-1 font-bold shadow-sm cursor-pointer"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
          </div>

          {/* Icono Hamburguesa Móvil */}
          <button 
            onClick={() => setMenuOpen(true)} 
            className="md:hidden flex flex-col gap-1.5 p-2 z-50 active:scale-90 transition-transform"
            aria-label="Abrir menú"
          >
            <span className={`w-6 h-0.5 transition-all ${scrolled || menuOpen ? "bg-green-900" : "bg-white"}`} />
             <span className={`w-6 h-0.5 transition-all ${scrolled || menuOpen ? "bg-green-900" : "bg-white"}`} />
            <span className={`w-6 h-0.5 transition-all ${scrolled || menuOpen ? "bg-green-900" : "bg-white"}`} />
          </button>
        </div>
      </nav>

      {/* ─── SIDEBAR RESPONSIVE ─── */}
      <div className={`fixed inset-0 z-[100] md:hidden ${menuOpen ? "visible" : "invisible"}`}>
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`} 
          onClick={() => setMenuOpen(false)} 
        />
        <div className={`absolute top-0 right-0 bottom-0 w-[75%] max-w-sm bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-900">
              <LeafIcon size={24} />
              <span className="font-bold text-lg">EcoRuteando</span>
            </div>
            <button 
              onClick={() => setMenuOpen(false)} 
              className="text-gray-400 p-2 hover:text-green-800 transition-colors"
              aria-label="Cerrar menú"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <button 
              onClick={() => scrollToSection("features")} 
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-gray-600 hover:bg-green-50 hover:text-green-900 transition-all font-medium text-left"
            >
              <MapIcon size={20} /> {t('navbar.features')}
            </button>
            <button 
              onClick={() => scrollToSection("why")} 
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-gray-600 hover:bg-green-50 hover:text-green-900 transition-all font-medium text-left"
            >
              <ActivityIcon size={20} /> {t('navbar.why')}
            </button>
            <button 
              onClick={() => { onNavigate("register"); setMenuOpen(false); }} 
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-gray-600 hover:bg-green-50 hover:text-green-900 transition-all font-medium text-left"
            >
              <HeartIcon size={20} /> {t('navbar.join')}
            </button>
          </div>
          <div className="p-6 bg-gray-50 flex flex-col gap-3">
            <button 
              onClick={() => { onNavigate("register"); setMenuOpen(false); }} 
              className="w-full btn-primary py-4 rounded-2xl font-bold shadow-lg text-sm text-white"
            >
              {t('navbar.register')} →
            </button>
            <button 
              onClick={() => { onNavigate("login"); setMenuOpen(false); }} 
              className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold text-sm"
            >
              {t('navbar.login')}
            </button>
            <button 
              onClick={() => { onNavigate("landing"); setMenuOpen(false); }} 
              className="w-full bg-transparent text-gray-400 py-2 rounded-2xl font-bold text-[10px] uppercase tracking-widest mt-2"
            >
              {t('hero.guestBtn')}
            </button>
          </div>
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section className="gradient-hero min-h-[85vh] md:min-h-[40vh] flex flex-col items-center justify-center pt-32 md:pt-28 pb-16 px-6 text-center relative overflow-hidden text-white">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
          <span className="tag-eco inline-block mb-6 text-[10px] md:text-sm px-4 py-1.5 rounded-full font-bold shadow-sm text-green-900">
            {t('hero.tagline')}
          </span>
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse-green p-3 md:p-4">
            <LeafIcon size={40} blend="multiply" />
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-5 leading-tight tracking-tight px-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-2xl font-semibold text-green-100 mb-4 px-4">
            {t('hero.subtitle')}
          </p>
          <p className="max-w-2xl mx-auto mb-10 text-green-50 opacity-90 text-xs md:text-base leading-relaxed px-6">
            {t('hero.description')}
          </p>
          <div className="hidden md:flex flex-row gap-4 justify-center items-center px-6">
            <button 
              onClick={() => onNavigate("register")} 
              className="bg-white text-green-900 px-10 py-4 rounded-2xl font-bold text-base shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {t('hero.registerBtn')}
            </button>
            <button 
              onClick={() => onNavigate("login")} 
              className="bg-white/20 backdrop-blur-md text-white border border-white/40 px-10 py-4 rounded-2xl font-semibold text-base hover:bg-white/30 transition-all"
            >
              {t('hero.loginBtn')}
            </button>
            <button 
              onClick={() => onNavigate("landing")} 
              className="bg-white/20 backdrop-blur-md text-white border border-white/40 px-10 py-4 rounded-2xl font-semibold text-base hover:bg-white/30 transition-all"
            >
              {t('hero.guestBtn')}
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: MOVILIDAD INTELIGENTE */}
      <section id="features" className="py-16 md:py-24 px-6 bg-ivory">
        <div className="max-w-6xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('features.title')}
          </h2>
          <p className="text-gray-500 text-sm md:text-lg max-w-2xl mx-auto px-4">
            {t('features.description')}
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
          {t('features.cards', { returnObjects: true }).map((card, i) => {
            const icons = [<MapIcon size={28} />, <ActivityIcon size={28} />, <HeartIcon size={28} />];
            const colors = ["text-green-700", "text-teal-600", "text-emerald-600"];
            
            return (
              <div key={i} className="bg-white p-8 md:p-10 rounded-2xl card-hover shadow-sm border border-stone-50 group">
                <div className={`w-14 h-14 md:w-16 md:h-16 feature-icon-bg rounded-2xl flex items-center justify-center mx-auto mb-6 ${colors[i]} group-hover:scale-110 transition-transform`}>
                  {icons[i]}
                </div>
                <h3 className="text-base md:text-lg font-bold text-green-900 mb-3">{card.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECCIÓN 3: ¿POR QUÉ ELEGIR? */}
      <section id="why" className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('why.title')}
            </h2>
            <div className="space-y-4">
              {t('why.reasons', { returnObjects: true }).map((reason, i) => {
                const icons = [<BikeIcon size={18} />, <BusIcon size={18} />, <LeafIcon size={18} />];
                
                return (
                  <div key={i} className="flex gap-4 p-4 md:p-5 bg-ivory rounded-2xl card-hover shadow-sm items-center border border-stone-50">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 text-green-700 shadow-sm">
                      {icons[i]}
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-gray-800">{reason.title}</h4>
                      <p className="text-[11px] md:text-xs text-gray-500">{reason.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative flex justify-center order-1 lg:order-2">
            <div className="w-48 h-48 md:w-64 md:h-64 bg-[#d1f5e1] rounded-full flex items-center justify-center shadow-inner animate-pulse-green">
              <LeafIcon size={90} blend="multiply" className="opacity-80" />
            </div>
            <div className="absolute top-0 right-4 bg-white p-3 rounded-xl shadow-lg animate-slide-up">
              <p className="text-xl font-black text-green-700 leading-none">34+</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Funciones</p>
            </div>
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-xl shadow-lg animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-xl font-black text-emerald-600 leading-none">CO₂↓</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Reducción</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="gradient-hero py-16 md:py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('hero.ctaTitle')}
          </h2>
          <p className="text-green-50 text-sm md:text-base mb-10 opacity-90 leading-relaxed px-4">
            {t('hero.ctaDescription')}
          </p>
          <button 
            onClick={() => onNavigate("register")} 
            className="bg-white text-green-900 px-10 py-4 rounded-2xl font-bold text-base shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            {t('hero.ctaBtn')} <LeafIcon size={20} blend="multiply" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a210f] text-green-200 py-10 md:py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <LeafIcon size={20} white={true} blend="screen" />
          <span className="font-bold text-white tracking-wide text-lg">EcoRuteando</span>
        </div>
        <p className="mb-6 opacity-70 text-[10px] md:text-xs leading-relaxed max-w-md mx-auto">
          {t('footer.copyright')}
        </p>
        <div className="flex justify-center gap-4 text-[10px] md:text-xs text-green-500 font-bold uppercase tracking-wider">
          <button className="hover:text-white transition-colors">{t('footer.privacy')}</button>
          <span className="opacity-20">|</span>
          <button className="hover:text-white transition-colors">{t('footer.terms')}</button>
          <span className="opacity-20">|</span>
          <button className="hover:text-white transition-colors">{t('footer.contact')}</button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;