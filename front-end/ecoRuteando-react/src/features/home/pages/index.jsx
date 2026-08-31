import React, { useState } from "react";
import { LogoImage } from "../../../shared/components/Icons";

/* ─── Íconos ─── */
const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8"  y1="23" x2="16" y2="23"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const HistoryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
    <polyline points="12 7 12 12 15 15"/>
  </svg>
);
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const CompassIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m10.29 3.86-8.43 14.88A2 2 0 0 0 3.58 22h16.84a2 2 0 0 0 1.72-3.26L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9"  x2="12"    y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const ReportIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const AdminShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

/* ─── Definición de tarjetas ─── */
const CARDS_ROW1 = [
  {
    icon:     <MapPinIcon />,
    title:    "Planear Ruta",
    desc:     "Encuentra rutas ecológicas",
    iconBg:   "bg-indigo-50",
    iconColor:"text-indigo-500",
    route:    "planear",
  },
  {
    icon:     <HistoryIcon />,
    title:    "Mi Historial",
    desc:     "Tu impacto ambiental",
    iconBg:   "bg-gray-100",
    iconColor:"text-gray-500",
    route:    "historial",
  },
  {
    icon:     <UserIcon />,
    title:    "Mi Perfil",
    desc:     "Configura tu cuenta",
    iconBg:   "bg-gray-100",
    iconColor:"text-gray-400",
    route:    "perfil",
  },
];

const CARDS_ROW2 = [
  {
    icon:     <CompassIcon />,
    title:    "Explorar",
    desc:     "Puntos de interés",
    iconBg:   "bg-blue-50",
    iconColor:"text-blue-500",
    route:    "explorar",
  },
  {
    icon:     <AlertIcon />,
    title:    "Alertas",
    desc:     "Clima en tiempo real",
    iconBg:   "bg-yellow-50",
    iconColor:"text-yellow-500",
    route:    "alertas",
  },
  {
    icon:     <ReportIcon />,
    title:    "Reportar",
    desc:     "Problemas en rutas",
    iconBg:   "bg-orange-50",
    iconColor:"text-orange-400",
    route:    "reportar",
  },
  {
    icon:      <AdminShieldIcon />,
    title:     "Admin",
    desc:      "Panel de gestión",
    iconBg:    "bg-purple-100",
    iconColor: "text-purple-600",
    route:     "admin",
    highlight: true,
  },
];

/* ─── Componente de tarjeta reutilizable ─── */
const MenuCard = ({ card, onClick }) => (
  <button
    onClick={() => onClick && onClick(card.route)}
    className={`
      text-left rounded-2xl p-6 border transition-all duration-200 group
      hover:shadow-lg hover:-translate-y-1
      ${card.highlight
        ? "bg-purple-50 border-purple-100 shadow-sm"
        : "bg-white border-gray-100 shadow-sm"
      }
    `}
  >
    <div
      className={`
        w-12 h-12 rounded-xl flex items-center justify-center mb-4
        ${card.iconBg} ${card.iconColor}
      `}
    >
      {card.icon}
    </div>
    <h3 className={`font-bold mb-1 ${card.highlight ? "text-purple-800" : "text-gray-800"}`}>
      {card.title}
    </h3>
    <p className={`text-sm ${card.highlight ? "text-purple-500" : "text-gray-400"}`}>
      {card.desc}
    </p>
  </button>
);

/* ─── Página principal del Dashboard ─── */
const DashboardIndex = ({ onNavigate, userEmail = "danielsalazarvargas953@gmail.com" }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f7f0" }}>

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-green-100 shadow-sm p-1 flex items-center justify-center bg-white">
              <LogoImage size={20} />
            </div>
            <span
              className="font-bold text-lg text-teal-700"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              EcoRuteando
            </span>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-full border-2 border-teal-400 flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors"
              title="Micrófono"
            >
              <MicIcon />
            </button>
            <button
              className="w-9 h-9 rounded-full border-2 border-teal-400 flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors"
              title="Idioma"
            >
              <GlobeIcon />
            </button>
            <button
              onClick={() => onNavigate && onNavigate("home")}
              className="flex items-center gap-1.5 ml-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogoutIcon />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Contenido ── */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Saludo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            ¡Hola de nuevo! <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-gray-500 text-sm">{userEmail}</p>
        </div>

        {/* Fila 1 — 3 tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {CARDS_ROW1.map((card) => (
            <MenuCard key={card.route} card={card} onClick={onNavigate} />
          ))}
        </div>

        {/* Fila 2 — 4 tarjetas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {CARDS_ROW2.map((card) => (
            <MenuCard key={card.route} card={card} onClick={onNavigate} />
          ))}
        </div>

        {/* Sección impacto */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-10 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Tu impacto en el planeta
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Cada trayecto ecológico cuenta. Pronto podrás ver aquí el CO<sub>2</sub> que has evitado emitir.
          </p>
          <button
            onClick={() => onNavigate && onNavigate("historial")}
            className="btn-primary px-8 py-3 rounded-full text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
          >
            Ver Estadísticas
          </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardIndex;
