import React, { useState, useEffect } from "react";
import { LeafIcon, MapIcon, ActivityIcon, HeartIcon, BikeIcon, BusIcon } from "../../../shared/components/Icons";

const HomePage = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* ─── NAVBAR RESPONSIVE ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? "bg-white shadow-md py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-green-100 p-1">
               <LeafIcon size={16} blend="multiply" />
            </div>
            <span className={`font-bold text-xl tracking-tight ${scrolled || menuOpen ? "text-green-900" : "text-white"}`} style={{fontFamily: "'Playfair Display', serif"}}>
              EcoRuteando
            </span>
          </div>

          {/* Menú Desktop (Se oculta en móvil) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className={`nav-link transition-colors ${scrolled ? "text-gray-600 hover:text-green-800" : "text-white/90 hover:text-white"}`}>Características</a>
            <a href="#why" className={`nav-link transition-colors ${scrolled ? "text-gray-600 hover:text-green-800" : "text-white/90 hover:text-white"}`}>¿Por qué?</a>
            <button onClick={() => onNavigate("register")} className={`nav-link transition-colors ${scrolled ? "text-gray-600 hover:text-green-800" : "text-white/90 hover:text-white"}`}>Únete</button>
          </div>

          {/* Botones Desktop (Se ocultan en móvil) */}
          <div className="hidden md:flex gap-3">
            <button onClick={() => onNavigate("login")} className={`px-5 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${scrolled ? "border-green-700 text-green-700 hover:bg-green-700 hover:text-white" : "border-white/80 text-white hover:bg-white hover:text-green-900"}`}>Iniciar sesión</button>
            <button onClick={() => onNavigate("register")} className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${scrolled ? "btn-primary text-white" : "bg-white text-green-900 shadow-md hover:bg-green-50"}`}>Registrarse</button>
          </div>

          {/* Icono Hamburguesa Móvil (Visible solo en móvil) */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5 p-2 z-50">
            <span className={`w-6 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""} ${scrolled || menuOpen ? "bg-green-900" : "bg-white"}`} />
            <span className={`w-6 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0" : ""} ${scrolled || menuOpen ? "bg-green-900" : "bg-white"}`} />
            <span className={`w-6 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""} ${scrolled || menuOpen ? "bg-green-900" : "bg-white"}`} />
          </button>
        </div>

        {/* Menú Vertical Desplegable Móvil */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="bg-[#2c5f3f] p-6 flex flex-col gap-3">
            <button onClick={() => {onNavigate("register"); setMenuOpen(false);}} className="w-full bg-white text-green-900 py-3.5 rounded-2xl font-bold text-sm shadow-lg">Registrarse →</button>
            <button onClick={() => {onNavigate("login"); setMenuOpen(false);}} className="w-full bg-transparent border border-white/40 text-white py-3.5 rounded-2xl font-bold text-sm">Iniciar sesión</button>
            <div className="flex flex-col items-center gap-1 mt-4 opacity-50">
              <LeafIcon size={42} white={true} />
              <span className="text-white text-[10px] font-bold uppercase tracking-widest">Modo invitado</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="gradient-hero min-h-[85vh] md:min-h-[90vh] flex flex-col items-center justify-center pt-28 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{backgroundImage:"radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)"}}/>
        
        <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
          <span className="tag-eco inline-block mb-6 text-[10px] md:text-sm px-4 py-1.5 rounded-full font-bold shadow-sm">
            🌱 Plataforma de movilidad ecológica · Neiva, Colombia
          </span>
          
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse-green p-3 md:p-4">
             <LeafIcon size={40} blend="multiply" />
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white mb-5 leading-tight tracking-tight px-2" style={{fontFamily: "'Playfair Display', serif"}}>
            EcoRuteando
          </h1>
          
          <p className="text-lg md:text-2xl font-semibold text-green-100 mb-4 px-4">
            Tu guía hacia una movilidad sostenible
          </p>
          
          <p className="max-w-2xl mx-auto mb-10 text-green-50 opacity-90 text-xs md:text-base leading-relaxed px-6">
            Descubre rutas ecológicas que combinan transporte público y bicicleta. Cada trayecto es una oportunidad para cuidar el planeta y reducir tu huella de carbono en la ciudad.
          </p>
          
          {/* Botones del Hero: Se ocultan en móvil para dejar el diseño limpio */}
          <div className="hidden md:flex flex-row gap-4 justify-center items-center px-6">
            <button onClick={() => onNavigate("register")} className="bg-white text-green-900 px-10 py-4 rounded-2xl font-bold text-base shadow-xl hover:-translate-y-1 transition-all duration-300">Regístrate ahora →</button>
            <button onClick={() => onNavigate("login")} className="bg-white/20 backdrop-blur-md text-white border border-white/40 px-10 py-4 rounded-2xl font-semibold text-base hover:bg-white/30 transition-all">Iniciar sesión</button>
            <button onClick={() => onNavigate("landing")} className="bg-transparent text-white border border-white/30 px-10 py-4 rounded-2xl font-semibold text-base hover:bg-white/10 transition-all">Modo invitado</button>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: MOVILIDAD INTELIGENTE (3 TARJETAS) */}
      <section id="features" className="py-16 md:py-24 px-6 bg-ivory">
        <div className="max-w-6xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4" style={{fontFamily: "'Playfair Display', serif"}}>Movilidad inteligente y sostenible</h2>
          <p className="text-gray-500 text-sm md:text-lg max-w-2xl mx-auto px-4">EcoRuteando te ayuda a moverte de forma eficiente mientras cuidas el medio ambiente.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: <MapIcon />, title: "Rutas optimizadas", color: "text-green-700", desc: "Encuentra las mejores rutas combinando transporte público y bicicleta, optimizadas para tiempo y sostenibilidad." },
            { icon: <ActivityIcon />, title: "Impacto ambiental", color: "text-teal-600", desc: "Visualiza cuánto CO₂ evitas en cada viaje y contribuye activamente a reducir la huella de carbono de tu ciudad." },
            { icon: <HeartIcon />, title: "Fácil de usar", color: "text-emerald-600", desc: "Interfaz intuitiva que te permite planificar tus trayectos en segundos desde cualquier dispositivo." }
          ].map((card, i) => (
            <div key={i} className="bg-white p-8 md:p-10 rounded-2xl text-center card-hover shadow-sm border border-stone-50 group">
              <div className={`w-14 h-14 md:w-16 md:h-16 feature-icon-bg rounded-2xl flex items-center justify-center mx-auto mb-6 ${card.color} group-hover:scale-110 transition-transform`}><span className="scale-90 md:scale-100">{card.icon}</span></div>
              <h3 className="text-base md:text-lg font-bold text-green-900 mb-3">{card.title}</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 3: ¿POR QUÉ ELEGIR? */}
      <section id="why" className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8" style={{fontFamily: "'Playfair Display', serif"}}>¿Por qué elegir EcoRuteando?</h2>
            <div className="space-y-4">
              {[
                { icon: <BikeIcon />, title: "Combina bicicleta y transporte público", desc: "Aprovecha lo mejor de ambos mundos para trayectos más eficientes y saludables." },
                { icon: <BusIcon />, title: "Información en tiempo real", desc: "Conoce los tiempos estimados y las mejores opciones disponibles para tu recorrido." },
                { icon: <LeafIcon size={18} />, title: "Compromiso con el Medio Ambiente", desc: "Cada trayecto ecológico ayuda a reducir la contaminación y mejorar el aire." }
              ].map((reason, i) => (
                <div key={i} className="flex gap-4 p-4 md:p-5 bg-ivory rounded-2xl card-hover shadow-sm items-center border border-stone-50">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 text-green-700 shadow-sm">{reason.icon}</div>
                  <div>
                    <h4 className="text-sm md:text-base font-bold text-gray-800">{reason.title}</h4>
                    <p className="text-[11px] md:text-xs text-gray-500">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex justify-center order-1 lg:order-2 pb-10 lg:pb-0">
             <div className="w-48 h-48 md:w-64 md:h-64 bg-[#d1f5e1] rounded-full flex items-center justify-center shadow-inner animate-pulse-green">
               <LeafIcon size={90} blend="multiply" className="opacity-80" />
             </div>
             <div className="absolute top-0 right-4 md:right-10 bg-white p-3 rounded-xl shadow-lg animate-slide-up"><p className="text-xl font-black text-green-700 leading-none">34+</p><p className="text-[10px] text-gray-400 font-bold uppercase">Funciones</p></div>
             <div className="absolute bottom-4 left-4 md:left-10 bg-white p-3 rounded-xl shadow-lg animate-slide-up" style={{animationDelay: "0.2s"}}><p className="text-xl font-black text-emerald-600 leading-none">CO₂↓</p><p className="text-[10px] text-gray-400 font-bold uppercase">Reducción</p></div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="gradient-hero py-16 md:py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)"}} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4" style={{fontFamily: "'Playfair Display', serif"}}>Comienza tu viaje sostenible hoy</h2>
          <p className="text-green-50 text-sm md:text-base mb-10 opacity-90 leading-relaxed px-4">Regístrate gratis y descubre cómo EcoRuteando puede transformar tu forma de moverte por la ciudad.</p>
          <button onClick={() => onNavigate("register")} className="bg-white text-green-900 px-10 py-4 rounded-2xl font-bold text-base shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 mx-auto">
            Únete a la revolución verde <LeafIcon size={20} blend="multiply" />
          </button>
        </div>
      </section>

      {/* FOOTER ─── */}
      <footer className="bg-[#0a210f] text-green-200 py-10 md:py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <LeafIcon size={20} white={true} blend="screen" />
          <span className="font-bold text-white tracking-wide text-lg">EcoRuteando</span>
        </div>
        <p className="mb-6 opacity-70 text-[10px] md:text-xs leading-relaxed max-w-md mx-auto">© 2025 EcoRuteando — SENA · Programa Desarrollo de Software · Neiva, Colombia</p>
        <div className="flex justify-center gap-4 text-[10px] md:text-xs text-green-500 font-bold uppercase tracking-wider">
          <button className="hover:text-white transition-colors">Privacidad</button><span className="opacity-20">|</span>
          <button className="hover:text-white transition-colors">Términos</button><span className="opacity-20">|</span>
          <button className="hover:text-white transition-colors">Contacto</button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;