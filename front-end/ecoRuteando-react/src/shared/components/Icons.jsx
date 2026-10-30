  import React from 'react';
  // Importación de tu imagen real desde la raíz del proyecto
  import logoImg from "../../../logo.png"; 

  /**
   * 1. COMPONENTE DE IMAGEN DE LOGO
   */
  export const LogoImage = ({ size = 32, className = "" }) => (
    <div 
      style={{ width: size, height: size }} 
      className={`flex items-center justify-center overflow-hidden shrink-0 ${className}`}
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
    const containerSz = size === "sm" ? "w-14 h-14" : size === "lg" ? "w-28 h-28" : size === "xl" ? "w-44 h-44" : "w-20 h-20";
    const imageSz = size === "sm" ? 36 : size === "lg" ? 80 : size === "xl" ? 130 : 56;
    const titleText = size === "sm" ? "text-xl" : size === "lg" ? "text-4xl" : size === "xl" ? "text-6xl" : "text-3xl";
    
    const textColor = size === "xl" ? "text-white" : "text-inherit";

    return (
      <div className="flex flex-col items-center gap-3 animate-fade-in w-full text-center">
        <div className={`${containerSz} bg-white rounded-3xl flex items-center justify-center shadow-xl p-2.5 border-2 border-emerald-100 hover:scale-105 transition-transform`}>
          <LogoImage size={imageSz} />
        </div>
        <h1 className={`${titleText} ${textColor} font-black tracking-tight leading-none`} style={{fontFamily: "'Playfair Display', serif"}}>
          EcoRuteando
        </h1>
        {(size === "lg" || size === "xl") && (
          <p className={`${size === "xl" ? "text-base" : "text-xs"} ${textColor} font-medium uppercase tracking-widest opacity-90`}>
            Movilidad sostenible para tu ciudad
          </p>
        )}
      </div>
    );
  };

  export const ArrowLeft = ({ size = 16 } = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  );
  export const SearchIcon = ({ size = 22 } = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
  );
  export const TargetIcon = ({ size = 22 } = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
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
  export const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.252 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
  );
  export const LeafIcon = ({ size = 28, white = false, blend = "normal", className = "" }) => (
    <div style={{ width: size, height: size, filter: white ? "brightness(0) invert(1)" : "none", mixBlendMode: blend }} className={`flex items-center justify-center shrink-0 ${className}`}>
      <img src={logoImg} alt="EcoRuteando" className="max-w-full max-h-full object-contain block" />
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


  export const UserIcon = ({ size = 24, white = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  export const LockIcon = ({ size = 24, white = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );

  export const PhoneIcon = ({ size = 24, white = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );

  export const MapPinIcon = ({ size = 24, white = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  export const CalendarIcon = ({ size = 24, white = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );

  export const EditIcon = ({ size = 24, white = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2">
      <path d="M17 3l4 4-7 7H10v-4l7-7z"/>
      <path d="M4 20h16"/>
    </svg>
  );

  export const SaveIcon = ({ size = 24, white = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  );
  export const AwardIcon = ({ size = 24, white = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2">
      <circle cx="12" cy="8" r="7"/>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  );

  export const TreeIcon = ({ size = 24, white = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2">
      <path d="M12 2L12 2L12 2M12 2L12 2L12 2M12 2L12 2L12 2M12 2L12 2L12 2" />
      <path d="M12 2L9 7h6L12 2z"/>
      <path d="M12 7L8 13h8l-4-6z"/>
      <path d="M12 13v9"/>
    </svg>
  );
  // export const EyeIcon = ({ size = 16 }) => (
  //   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
  //     <circle cx="12" cy="12" r="3" />
  //   </svg>
  // );

  export const EyeOffIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
  export const AlertTriangleIcon = ({ size = 24, white = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2">
    <path d="M12 9v4M12 17h.01" strokeLinecap="round"/>
    <path d="M12 3L1 21h22L12 3z" strokeLinejoin="round"/>
  </svg>
);
export const ChartIcon = ({ size = 24, white = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2">
    <path d="M21 12v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3"/>
    <path d="M3 6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v3"/>
    <path d="M12 2v20"/>
    <path d="M8 10h.01"/>
    <path d="M16 10h.01"/>
    <path d="M10 16h4"/>
  </svg>
);

export const TrophyIcon = ({ size = 24, white = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M8 2h8v4a4 4 0 0 1-8 0V2z"/>
  </svg>
);
export const FileTextIcon = ({ size = 24, white = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "white" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
