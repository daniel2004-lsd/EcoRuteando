import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  LeafIcon, ArrowLeft, UserIcon, LockIcon, SettingsIcon, 
  MailIcon, PhoneIcon, MapPinIcon, CalendarIcon, 
  EditIcon, SaveIcon, HeartIcon
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";

/* ─── CONSTANTES ────────────────────────────────────────────── */
const C = {
  dark: {
    bgMain: "#0a1219", bgSurface: "#0f1a24", bgHeader: "#081018",
    bgCard: "#13212e", bgInput: "#1a2a3a", border: "#1e3a4d",
    textMain: "#b8e4c8", textSec: "#7acc8a", accent: "#3a8a5a",
    accentHover: "#4aaa6a", danger: "#c44a3a", warning: "#c48a3a",
  },
  light: {
    bgMain: "#e8f0f8", bgSurface: "#ffffff", bgHeader: "#1a4a6e",
    bgCard: "#ffffff", bgInput: "#f0f5fa", border: "#c8d8e8",
    textMain: "#1a3a4f", textSec: "#4a6a8a", accent: "#2a6b8f",
    accentHover: "#3a8aaa", danger: "#c44a3a", warning: "#c48a3a",
  },
};

const TABS = [
  { id: "personal", label: "Personal", icon: UserIcon },
  { id: "security", label: "Seguridad", icon: LockIcon },
  { id: "config", label: "Configuración", icon: SettingsIcon }
];

/* ─── COMPONENTES ──────────────────────────────────────────── */

// Botón de tema
const ThemeToggle = ({ isDarkMode, toggleTheme, theme }) => (
  <button
    onClick={toggleTheme}
    style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 50,
      width: 40, height: 40, borderRadius: "50%", background: theme.accent,
      color: "#fff", border: "none", cursor: "pointer", fontSize: 16,
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)", transition: "all 0.2s",
    }}
  >
    {isDarkMode ? "☀️" : "🌙"}
  </button>
);

// Cabecera
const Header = ({ theme, isDarkMode, profile, onNavigate }) => (
  <header style={{ background: theme.bgHeader, borderBottom: `2px solid ${theme.accent}` }}>
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: "18px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: `rgba(255,255,255,0.08)`,
            border: `1px solid ${theme.accent}`, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <LeafIcon size={24} white={isDarkMode} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>Mi Perfil</h1>
            <p style={{ margin: 0, fontSize: 11, color: theme.accent, textTransform: "uppercase" }}>{profile.email}</p>
          </div>
        </div>
        <button onClick={() => onNavigate("dashboard")} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
          borderRadius: 8, background: `rgba(255,255,255,0.08)`, border: `1px solid ${theme.accent}`,
          color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>
          <ArrowLeft size={14} /> Volver
        </button>
      </div>
    </div>
  </header>
);

// Tarjetas de estadísticas
const StatsCards = ({ theme, stats }) => {
  const cards = [
    { icon: MapPinIcon, value: stats.routes, label: "Rutas Completadas" },
    { icon: LeafIcon, value: `${stats.co2Saved} kg`, label: "CO₂ Ahorrado" }
  ];
  
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 32 }}>
      {cards.map((card, idx) => (
        <div key={idx} style={{
          background: theme.bgCard, border: `1px solid ${theme.border}`,
          borderRadius: 14, padding: "20px 24px", width: 240, textAlign: "center",
          transition: "all 0.2s",
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: `rgba(58,138,90,0.15)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <card.icon size={22} style={{ color: theme.accent }} />
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 700, color: theme.textMain }}>{card.value}</p>
          <p style={{ margin: "6px 0 0", fontSize: 11, color: theme.textSec }}>{card.label}</p>
        </div>
      ))}
    </div>
  );
};

// Tabs
const ProfileTabs = ({ activeTab, setActiveTab, theme, isDarkMode }) => (
  <div style={{
    background: isDarkMode ? `rgba(15,26,36,0.6)` : `rgba(255,255,255,0.6)`,
    backdropFilter: "blur(8px)", borderRadius: 14, padding: 4,
    display: "flex", gap: 4, marginBottom: 24, border: `1px solid ${theme.border}`,
  }}>
    {TABS.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, padding: "10px 16px", borderRadius: 10, fontSize: 13,
            fontWeight: 600, transition: "all 0.2s",
            background: isActive ? theme.accent : "transparent",
            color: isActive ? "#fff" : theme.textSec, cursor: "pointer", border: "none",
          }}
        >
          <Icon size={18} /> {tab.label}
        </button>
      );
    })}
  </div>
);

// Avatar
const Avatar = ({ name, theme }) => (
  <div style={{ gridColumn: "span 2", display: "flex", justifyContent: "center", marginBottom: 16 }}>
    <div style={{
      width: 100, height: 100, borderRadius: "50%",
      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    }}>
      <span style={{ fontSize: 40, fontWeight: 700, color: "#fff" }}>{name.charAt(0).toUpperCase()}</span>
    </div>
  </div>
);

// Campo de formulario
const FormField = ({ label, icon: Icon, name, value, isEditing, onChange, theme, type = "text", rows = null }) => (
  <div>
    <label style={{
      display: "block", fontSize: 11, fontWeight: 700, color: theme.textSec,
      marginBottom: 6, textTransform: "uppercase",
    }}>
      <Icon size={12} style={{ display: "inline", marginRight: 6 }} /> {label}
    </label>
    {isEditing ? (
      rows ? (
        <textarea name={name} value={value} onChange={onChange} rows={rows} style={{
          width: "100%", padding: "10px 14px", fontSize: 14, borderRadius: 8,
          border: `1px solid ${theme.border}`, background: theme.bgInput,
          color: theme.textMain, outline: "none", resize: "vertical",
        }} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} style={{
          width: "100%", padding: "10px 14px", fontSize: 14, borderRadius: 8,
          border: `1px solid ${theme.border}`, background: theme.bgInput,
          color: theme.textMain, outline: "none",
        }} />
      )
    ) : (
      <p style={{
        margin: 0, padding: "10px 14px", background: theme.bgInput,
        borderRadius: 8, color: theme.textMain, lineHeight: rows ? 1.5 : "normal"
      }}>{value}</p>
    )}
  </div>
);

// Panel Personal
const PersonalPanel = ({ theme, profile, formData, isEditing, handleChange, handleSave, handleCancel, setIsEditing }) => (
  <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: "hidden" }}>
    <div style={{
      background: theme.accent, padding: "16px 24px",
      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
    }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff" }}>Información Personal</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Actualiza tu información personal y de contacto</p>
      </div>
      {!isEditing ? (
        <button onClick={() => setIsEditing(true)} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
          borderRadius: 8, background: "#fff", color: theme.accent,
          fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
        }}>
          <EditIcon size={14} /> Editar Perfil
        </button>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleCancel} style={{
            padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.2)",
            color: "#fff", fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
          }}>Cancelar</button>
          <button onClick={handleSave} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
            borderRadius: 8, background: "#fff", color: theme.accent,
            fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
          }}><SaveIcon size={14} /> Guardar</button>
        </div>
      )}
    </div>

    <div style={{ padding: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        <Avatar name={profile.name} theme={theme} />
        <FormField label="Nombre Completo" icon={UserIcon} name="name" value={isEditing ? formData.name : profile.name} isEditing={isEditing} onChange={handleChange} theme={theme} />
        <FormField label="Correo Electrónico" icon={MailIcon} name="email" value={isEditing ? formData.email : profile.email} isEditing={isEditing} onChange={handleChange} theme={theme} type="email" />
        <FormField label="Teléfono" icon={PhoneIcon} name="phone" value={isEditing ? formData.phone : profile.phone} isEditing={isEditing} onChange={handleChange} theme={theme} type="tel" />
        <FormField label="Ubicación" icon={MapPinIcon} name="location" value={isEditing ? formData.location : profile.location} isEditing={isEditing} onChange={handleChange} theme={theme} />
        <FormField label="Fecha de Nacimiento" icon={CalendarIcon} name="birthday" value={isEditing ? formData.birthday : profile.birthday} isEditing={isEditing} onChange={handleChange} theme={theme} />
        <FormField label="Biografía" icon={HeartIcon} name="bio" value={isEditing ? formData.bio : profile.bio} isEditing={isEditing} onChange={handleChange} theme={theme} rows={3} />
      </div>
    </div>
  </div>
);

// Panel Seguridad
const SecurityPanel = ({ theme, onNavigate }) => (
  <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "24px" }}>
    <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: theme.textMain }}>🔐 Seguridad</h2>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button style={{
        padding: "16px", borderRadius: 12, background: theme.bgInput, border: `1px solid ${theme.border}`,
        textAlign: "left", cursor: "pointer", fontSize: 14, fontWeight: 500, color: theme.textMain,
      }}>
        Cambiar Contraseña
      </button>
      <button style={{
        padding: "16px", borderRadius: 12, background: theme.bgInput, border: `1px solid ${theme.border}`,
        textAlign: "left", cursor: "pointer", fontSize: 14, fontWeight: 500, color: theme.textMain,
      }}>
        Autenticación de Dos Factores (2FA)
      </button>
      <button style={{
        padding: "16px", borderRadius: 12, background: "#fee2e2", border: `1px solid ${theme.danger}`,
        textAlign: "left", cursor: "pointer", fontSize: 14, fontWeight: 500, color: theme.danger,
      }}>
        🗑️ Eliminar Cuenta
      </button>
    </div>
  </div>
);

// Panel Configuración
const ConfigPanel = ({ theme }) => (
  <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "24px" }}>
    <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: theme.textMain }}>⚙️ Configuración</h2>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
        <span style={{ color: theme.textMain }}>Notificaciones por email</span>
        <label style={{ position: "relative", display: "inline-block", width: 50, height: 24 }}>
          <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
          <span style={{
            position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: theme.border, borderRadius: 24, transition: "0.3s",
          }}></span>
        </label>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
        <span style={{ color: theme.textMain }}>Idioma</span>
        <select style={{ padding: "8px 12px", borderRadius: 8, background: theme.bgInput, border: `1px solid ${theme.border}`, color: theme.textMain }}>
          <option>Español</option>
          <option>English</option>
        </select>
      </div>
    </div>
  </div>
);

// Frase motivacional
const MotivationalFooter = ({ theme }) => (
  <div style={{ marginTop: 28, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: 0.55 }}>
    <LeafIcon size={12} style={{ color: theme.accent }} />
    <p style={{ margin: 0, fontSize: 11, color: theme.textSec }}>Cada pequeño cambio cuenta. ¡Sigue así!</p>
    <LeafIcon size={12} style={{ color: theme.accent }} />
  </div>
);

/* ─── COMPONENTE PRINCIPAL ─────────────────────────────────── */
const UserProfile = ({ onNavigate, userRole }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = isDarkMode ? C.dark : C.light;
  
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "Daniel Salazar Vargas",
    email: "danielsalazarvargas953@gmail.com",
    phone: "3001234567",
    location: "Neiva, Colombia",
    birthday: "15/05/1995",
    bio: "Apasionado por la movilidad sostenible y el cuidado del medio ambiente. Cada día es una oportunidad para reducir mi huella de carbono y disfrutar de la naturaleza."
  });

  const [formData, setFormData] = useState(profile);
  const userStats = { routes: 47, co2Saved: 32.5 };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSave = () => { setProfile(formData); setIsEditing(false); alert("¡Tus cambios han sido guardados exitosamente!"); };
  const handleCancel = () => { setFormData(profile); setIsEditing(false); };

  return (
    <div style={{ minHeight: "100vh", background: theme.bgMain, transition: "all 0.3s ease" }}>
      
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} theme={theme} />
      <Header theme={theme} isDarkMode={isDarkMode} profile={profile} onNavigate={onNavigate} />
      
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "26px 28px 48px" }}>
        <StatsCards theme={theme} stats={userStats} />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} isDarkMode={isDarkMode} />
        
        {activeTab === "personal" && (
          <PersonalPanel 
            theme={theme} profile={profile} formData={formData} isEditing={isEditing}
            handleChange={handleChange} handleSave={handleSave} handleCancel={handleCancel} setIsEditing={setIsEditing}
          />
        )}
        
        {activeTab === "security" && <SecurityPanel theme={theme} onNavigate={onNavigate} />}
        {activeTab === "config" && <ConfigPanel theme={theme} />}
        
        <MotivationalFooter theme={theme} />
      </div>
    </div>
  );
};

export default UserProfile;