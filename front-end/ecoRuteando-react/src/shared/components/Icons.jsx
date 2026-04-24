import React from 'react';
// Importación de tu imagen real desde la raíz del proyecto
import logoImg from "../../../logo.png"; 

/**
 * 1. COMPONENTE DE IMAGEN DE LOGO
 */
export const LogoImage = ({ size = 24, className = "" }) => (
  <div 
    style={{ width: size, height: size }} 
    className={`flex items-center justify-center overflow-hidden ${className}`}
  >
    <img 
      src={logoImg} 
      alt="EcoRuteando Logo" 
      className="max-w-full max-h-full object-contain block"
    />
  </div>
);

/**
 * 2. COMPONENTE LOGO PRINCIPAL
 * Actualizado para evitar duplicados en el Home y mejorar visibilidad.
 */
export const Logo = ({ size = "md" }) => {
  const containerSz = size === "sm" ? "w-10 h-10" : size === "lg" ? "w-24 h-24" : size === "xl" ? "w-40 h-40" : "w-16 h-16";
  const imageSz = size === "sm" ? 24 : size === "lg" ? 60 : size === "xl" ? 110 : 40;
  const titleText = size === "sm" ? "text-lg" : size === "lg" ? "text-4xl" : size === "xl" ? "text-6xl" : "text-2xl";
  
  // Si es XL (Hero), usamos blanco; si es SM (Navbar), usamos el color del texto heredado
  const textColor = size === "xl" ? "text-white" : "text-inherit";

  return (
    <div className="flex flex-col items-center gap-3 animate-fade-in w-full text-center">
      <div className={`${containerSz} bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse-green border-4 border-white p-2`}>
        <LogoImage size={imageSz} />
      </div>
      <h1 className={`${titleText} ${textColor} font-black tracking-tighter leading-none`} style={{fontFamily: "'Playfair Display', serif"}}>
        EcoRuteando
      </h1>
      {(size === "lg" || size === "xl") && (
        <p className={`${size === 'xl' ? 'text-sm' : 'text-[11px]'} ${textColor} font-medium uppercase tracking-widest opacity-90`}>
          Movilidad sostenible para tu ciudad
        </p>
      )}
    </div>
  );
};

export const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
export const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 6-12 12M6 6l12 12"/></svg>
);
export const EyeIcon = ({ open = true }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#6b7280" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="1.8"/></svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/><line x1="1" x2="23" y1="1" y2="23" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/></svg>
);
export const MailIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-green-700" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>
);
export const KeyIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-green-700" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="5"/><path d="m12.5 10.5 9 9"/><path d="M18 14.5 21 17.5"/></svg>
);
export const ShieldIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-green-700" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z"/><path d="m9 12 2 2 4-4"/></svg>
);
export const CheckCircle = () => (
  <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#2e7d52" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-5"/></svg>
);
export const MapIcon = ({size=28}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" x2="8" y1="2" y2="18"/><line x1="16" x2="16" y1="6" y2="22"/></svg>
);
export const ActivityIcon = ({size=28}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);
export const HeartIcon = ({size=28}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
);
export const BikeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6h-3l-2 6 2 3h3l4-4.5L15 6z"/><path d="M5.5 17.5 10 8l2 5H7"/></svg>
);
export const BusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="3"/><path d="M2 9h20M8 17v2m8-2v2"/><circle cx="7" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/></svg>
);
export const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);
export const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
export const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.252 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
);
export const LeafIcon = ({ size = 24, white = false, blend = "normal" }) => (
  <div style={{ width: size, height: size, filter: white ? "brightness(0) invert(1)" : "none", mixBlendMode: blend }} className="flex items-center justify-center">
    <img src={logoImg} alt="Leaf" className="max-w-full max-h-full object-contain" />
  </div>
);
export const RouteIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 6h18M3 12h12M3 18h6" />
  </svg>
);

export const ClockIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

export const UsersIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="9" cy="7" r="4"/>
    <path d="M17 11c1.5 0 3 1.5 3 3v2h-6"/>
    <path d="M3 21v-2c0-2 2-4 6-4s6 2 6 4v2"/>
  </svg>
);
export const MessageCircleIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
    
      d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const ReportIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 17h6M9 13h6M9 9h6M7 21h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
export const DownloadIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3v10m0 0l4-4m-4 4l-4-4M5 21h14"
      stroke="currentColor" strokeWidth="2"/>
  </svg>
);
export const SettingsIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V22a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H2a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 6 3.2l.1.1a1.7 1.7 0 0 0 1.9.3H8a1.7 1.7 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 21 6l-.1.1a1.7 1.7 0 0 0-.3 1.9V8c0 .7.4 1.4 1.1 1.7H22a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);
export const TicketIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V7z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);
