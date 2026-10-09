import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../../src/app/context/LanguageContext"; // Importar el hook
import { 
  LeafIcon, ArrowLeft, UserIcon, LockIcon, SettingsIcon, 
  MailIcon, PhoneIcon, MapPinIcon, CalendarIcon, 
  EditIcon, SaveIcon, HeartIcon
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";

/* ─── CONSTANTES ────────────────────────────────────────────── */
const C = {
  dark: {
    bgMain: "linear-gradient(135deg, #0a0f1a 0%, #0f172a 100%)",
    bgSurface: "rgba(30, 41, 59, 0.7)",
    bgCard: "rgba(15, 23, 42, 0.8)",
    bgHeader: "rgba(10, 15, 26, 0.95)",
    border: "rgba(56, 189, 248, 0.15)",
    textMain: "#f1f5f9",
    textSec: "#94a3b8",
    accent: "#38bdf8",
    accentHover: "#0ea5e9",
    success: "#10b981",
    danger: "#ef4444",
    gradientStart: "#38bdf8",
    gradientEnd: "#2dd4bf"
  },
  light: {
    bgMain: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    bgSurface: "rgba(255, 255, 255, 0.7)",
    bgCard: "rgba(255, 255, 255, 0.9)",
    bgHeader: "rgba(255, 255, 255, 0.95)",
    border: "rgba(14, 165, 233, 0.15)",
    textMain: "#0f172a",
    textSec: "#475569",
    accent: "#0ea5e9",
    accentHover: "#0284c7",
    success: "#10b981",
    danger: "#ef4444",
    gradientStart: "#0ea5e9",
    gradientEnd: "#06b6d4"
  },
};

/* ─── COMPONENTES ──────────────────────────────────────────── */

const ThemeToggle = ({ isDarkMode, toggleTheme, theme }) => (
  <button
    onClick={toggleTheme}
    style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 50,
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      color: "#fff",
      border: "none",
      cursor: "pointer",
      fontSize: "20px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      transition: "all 0.3s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    {isDarkMode ? "☀️" : "🌙"}
  </button>
);

const Header = ({ theme, profile, onNavigate, t }) => (
  <header style={{
    background: theme.bgHeader,
    backdropFilter: "blur(10px)",
    borderBottom: `1px solid ${theme.border}`,
    position: "sticky",
    top: 0,
    zIndex: 40
  }}>
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px 24px"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap"
        }}>
          <div style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <LeafIcon size={26} white={true} />
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: "clamp(20px, 5vw, 24px)",
              fontWeight: 800,
              color: theme.textMain
            }}>
              {t("profile.title")}
            </h1>
            <p style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: theme.textSec
            }}>
              {profile.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "12px",
            background: theme.bgSurface,
            border: `1px solid ${theme.border}`,
            color: theme.textMain,
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <ArrowLeft size={14} /> {t("profile.back")}
        </button>
      </div>
    </div>
  </header>
);

const StatsCards = ({ theme, stats, t }) => {
  const cards = [
    { value: stats.routes, labelKey: "profile.stats.routesCompleted" },
    { value: `${stats.co2Saved} kg`, labelKey: "profile.stats.co2Saved" }
  ];
  
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginBottom: "32px"
    }}>
      {cards.map((card, idx) => (
        <div key={idx} style={{
          background: theme.bgCard,
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.border}`,
          borderRadius: "20px",
          padding: "24px",
          textAlign: "center",
          transition: "all 0.3s"
        }}>
          <p style={{
            margin: 0,
            fontSize: "clamp(28px, 6vw, 36px)",
            fontWeight: 700,
            color: theme.textMain
          }}>
            {card.value}
          </p>
          <p style={{
            margin: "8px 0 0",
            fontSize: "13px",
            color: theme.textSec
          }}>
            {t(card.labelKey)}
          </p>
        </div>
      ))}
    </div>
  );
};

const ProfileTabs = ({ activeTab, setActiveTab, theme, t }) => {
  const TABS = [
    { id: "personal", labelKey: "profile.tabs.personal", icon: UserIcon },
    { id: "security", labelKey: "profile.tabs.security", icon: LockIcon },
    { id: "config", labelKey: "profile.tabs.config", icon: SettingsIcon }
  ];

  return (
    <div style={{
      background: theme.bgSurface,
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      padding: "6px",
      display: "flex",
      gap: "6px",
      marginBottom: "32px",
      border: `1px solid ${theme.border}`,
      flexWrap: "wrap"
    }}>
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              minWidth: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 600,
              transition: "all 0.2s",
              background: isActive ? `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})` : "transparent",
              color: isActive ? "#fff" : theme.textSec,
              cursor: "pointer",
              border: "none"
            }}
          >
            <Icon size={18} /> {t(tab.labelKey)}
          </button>
        );
      })}
    </div>
  );
};

const Avatar = ({ name, theme }) => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px"
  }}>
    <div style={{
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
    }}>
      <span style={{
        fontSize: "40px",
        fontWeight: 700,
        color: "#fff"
      }}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  </div>
);

const FormField = ({ labelKey, icon: Icon, name, value, isEditing, onChange, theme, type = "text", rows = null, t }) => (
  <div>
    <label style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "11px",
      fontWeight: 700,
      color: theme.textSec,
      marginBottom: "6px",
      textTransform: "uppercase"
    }}>
      <Icon size={12} /> {t(labelKey)}
    </label>
    {isEditing ? (
      rows ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          style={{
            width: "100%",
            padding: "10px 14px",
            fontSize: "14px",
            borderRadius: "8px",
            border: `1px solid ${theme.border}`,
            background: theme.bgSurface,
            color: theme.textMain,
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box"
          }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          style={{
            width: "100%",
            padding: "10px 14px",
            fontSize: "14px",
            borderRadius: "8px",
            border: `1px solid ${theme.border}`,
            background: theme.bgSurface,
            color: theme.textMain,
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      )
    ) : (
      <div style={{
        padding: "10px 14px",
        background: theme.bgSurface,
        borderRadius: "8px",
        border: `1px solid ${theme.border}`,
        color: theme.textMain,
        wordBreak: "break-word"
      }}>
        {value || "—"}
      </div>
    )}
  </div>
);

const PersonalPanel = ({ theme, profile, formData, isEditing, handleChange, handleSave, handleCancel, setIsEditing, t }) => (
  <div style={{
    background: theme.bgCard,
    backdropFilter: "blur(10px)",
    border: `1px solid ${theme.border}`,
    borderRadius: "24px",
    overflow: "hidden"
  }}>
    <div style={{
      padding: "20px 24px",
      background: `linear-gradient(135deg, ${theme.gradientStart}10, ${theme.gradientEnd}10)`,
      borderBottom: `1px solid ${theme.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "16px"
    }}>
      <div>
        <h2 style={{
          margin: 0,
          fontSize: "clamp(16px, 4vw, 18px)",
          fontWeight: 700,
          color: theme.textMain
        }}>
          {t("profile.personal.title")}
        </h2>
        <p style={{
          margin: "4px 0 0",
          fontSize: "12px",
          color: theme.textSec
        }}>
          {t("profile.personal.subtitle")}
        </p>
      </div>
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "10px",
            background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
            color: "#fff",
            fontSize: "12px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer"
          }}
        >
          <EditIcon size={14} /> {t("profile.personal.edit")}
        </button>
      ) : (
        <div style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={handleCancel}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              background: theme.bgSurface,
              border: `1px solid ${theme.border}`,
              color: theme.textSec,
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {t("profile.personal.cancel")}
          </button>
          <button
            onClick={handleSave}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer"
            }}
          >
            <SaveIcon size={14} /> {t("profile.personal.save")}
          </button>
        </div>
      )}
    </div>

    <div style={{
      padding: "clamp(20px, 5vw, 28px)"
    }}>
      <Avatar name={isEditing ? formData.name : profile.name} theme={theme} />
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px"
      }}>
        <FormField labelKey="profile.fields.fullName" icon={UserIcon} name="name" value={isEditing ? formData.name : profile.name} isEditing={isEditing} onChange={handleChange} theme={theme} t={t} />
        <FormField labelKey="profile.fields.email" icon={MailIcon} name="email" value={isEditing ? formData.email : profile.email} isEditing={isEditing} onChange={handleChange} theme={theme} type="email" t={t} />
        <FormField labelKey="profile.fields.phone" icon={PhoneIcon} name="phone" value={isEditing ? formData.phone : profile.phone} isEditing={isEditing} onChange={handleChange} theme={theme} type="tel" t={t} />
        <FormField labelKey="profile.fields.location" icon={MapPinIcon} name="location" value={isEditing ? formData.location : profile.location} isEditing={isEditing} onChange={handleChange} theme={theme} t={t} />
        <FormField labelKey="profile.fields.birthday" icon={CalendarIcon} name="birthday" value={isEditing ? formData.birthday : profile.birthday} isEditing={isEditing} onChange={handleChange} theme={theme} t={t} />
        <FormField labelKey="profile.fields.bio" icon={HeartIcon} name="bio" value={isEditing ? formData.bio : profile.bio} isEditing={isEditing} onChange={handleChange} theme={theme} rows={3} t={t} />
      </div>
    </div>
  </div>
);

const SecurityPanel = ({ theme, t }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert(t("profile.security.passwordsNotMatch"));
      return;
    }
    if (newPassword.length < 6) {
      alert(t("profile.security.passwordMinLength"));
      return;
    }
    alert(t("profile.security.passwordUpdated"));
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div style={{
      background: theme.bgCard,
      backdropFilter: "blur(10px)",
      border: `1px solid ${theme.border}`,
      borderRadius: "24px",
      padding: "clamp(20px, 5vw, 28px)"
    }}>
      <h2 style={{
        margin: "0 0 8px",
        fontSize: "clamp(16px, 4vw, 20px)",
        fontWeight: 700,
        color: theme.textMain
      }}>
        {t("profile.security.title")}
      </h2>
      <p style={{
        margin: "0 0 24px",
        fontSize: "13px",
        color: theme.textSec
      }}>
        {t("profile.security.subtitle")}
      </p>
      
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        <button
          onClick={() => setShowPasswordModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "16px 20px",
            borderRadius: "16px",
            background: theme.bgSurface,
            border: `1px solid ${theme.border}`,
            textAlign: "left",
            cursor: "pointer",
            width: "100%"
          }}
        >
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: `${theme.accent}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0
          }}>
            <LockIcon size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              margin: 0,
              fontSize: "clamp(14px, 3vw, 15px)",
              fontWeight: 600,
              color: theme.textMain
            }}>
              {t("profile.security.changePassword")}
            </p>
          </div>
        </button>

        <button
          onClick={() => alert(t("profile.security.twoFactorInDevelopment"))}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "16px 20px",
            borderRadius: "16px",
            background: theme.bgSurface,
            border: `1px solid ${theme.border}`,
            textAlign: "left",
            cursor: "pointer",
            width: "100%"
          }}
        >
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: `${theme.accent}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0
          }}>
            <LockIcon size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              margin: 0,
              fontSize: "clamp(14px, 3vw, 15px)",
              fontWeight: 600,
              color: theme.textMain
            }}>
              {t("profile.security.twoFactorAuth")}
            </p>
          </div>
        </button>

        <button
          onClick={() => {
            if (window.confirm(t("profile.security.confirmDelete"))) {
              alert(t("profile.security.accountDeleted"));
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "16px 20px",
            borderRadius: "16px",
            background: `${theme.danger}10`,
            border: `1px solid ${theme.danger}40`,
            textAlign: "left",
            cursor: "pointer",
            width: "100%"
          }}
        >
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: `${theme.danger}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0
          }}>
            <span style={{ color: theme.danger }}>X</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{
              margin: 0,
              fontSize: "clamp(14px, 3vw, 15px)",
              fontWeight: 600,
              color: theme.danger
            }}>
              {t("profile.security.deleteAccount")}
            </p>
          </div>
        </button>
      </div>

      {/* Modal Cambiar Contraseña */}
      {showPasswordModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px"
        }} onClick={() => setShowPasswordModal(false)}>
          <div style={{
            background: theme.bgCard,
            borderRadius: "24px",
            padding: "24px",
            maxWidth: "400px",
            width: "100%"
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 16px", color: theme.textMain }}>{t("profile.security.changePassword")}</h3>
            <input
              type="password"
              placeholder={t("profile.security.currentPassword")}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
                background: theme.bgSurface,
                color: theme.textMain,
                boxSizing: "border-box"
              }}
            />
            <input
              type="password"
              placeholder={t("profile.security.newPassword")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
                background: theme.bgSurface,
                color: theme.textMain,
                boxSizing: "border-box"
              }}
            />
            <input
              type="password"
              placeholder={t("profile.security.confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
                background: theme.bgSurface,
                color: theme.textMain,
                boxSizing: "border-box"
              }}
            />
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowPasswordModal(false)} style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: theme.bgSurface,
                border: `1px solid ${theme.border}`,
                color: theme.textSec,
                cursor: "pointer"
              }}>{t("profile.personal.cancel")}</button>
              <button onClick={handleChangePassword} style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}>{t("profile.security.update")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ConfigPanel MODIFICADO para usar el contexto de idioma
const ConfigPanel = ({ theme, isDarkMode, toggleTheme, t }) => {
  const { language, changeLanguage } = useLanguage(); // Usar el contexto

  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
    { code: "pt", name: "Português" },
    { code: "fr", name: "Français" }
  ];

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
  };

  return (
    <div style={{
      background: theme.bgCard,
      backdropFilter: "blur(10px)",
      border: `1px solid ${theme.border}`,
      borderRadius: "24px",
      padding: "clamp(20px, 5vw, 28px)"
    }}>
      <h2 style={{
        margin: "0 0 8px",
        fontSize: "clamp(16px, 4vw, 20px)",
        fontWeight: 700,
        color: theme.textMain
      }}>
        {t("profile.config.title")}
      </h2>
      <p style={{
        margin: "0 0 24px",
        fontSize: "13px",
        color: theme.textSec
      }}>
        {t("profile.config.subtitle")}
      </p>
      
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          background: theme.bgSurface,
          borderRadius: "16px",
          border: `1px solid ${theme.border}`,
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <p style={{
              margin: 0,
              fontSize: "clamp(14px, 3vw, 15px)",
              fontWeight: 600,
              color: theme.textMain
            }}>
              {t("profile.config.darkMode")}
            </p>
            <p style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: theme.textSec
            }}>
              {t("profile.config.darkModeDesc")}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${theme.gradientStart}, ${theme.gradientEnd})`,
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer"
            }}
          >
            {isDarkMode ? t("profile.config.lightMode") : t("profile.config.darkMode")}
          </button>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          background: theme.bgSurface,
          borderRadius: "16px",
          border: `1px solid ${theme.border}`,
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <p style={{
              margin: 0,
              fontSize: "clamp(14px, 3vw, 15px)",
              fontWeight: 600,
              color: theme.textMain
            }}>
              {t("profile.config.language")}
            </p>
            <p style={{
              margin: "4px 0 0",
              fontSize: "12px",
              color: theme.textSec
            }}>
              {t("profile.config.languageDesc")}
            </p>
          </div>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              color: theme.textMain,
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        <div style={{
          padding: "16px",
          background: theme.bgSurface,
          borderRadius: "16px",
          border: `1px solid ${theme.border}`,
          textAlign: "center"
        }}>
          <p style={{
            margin: 0,
            fontSize: "13px",
            color: theme.textSec
          }}>
            {t("profile.config.responsive")}
          </p>
        </div>
      </div>
    </div>
  );
};

const MotivationalFooter = ({ theme, t }) => (
  <div style={{
    marginTop: "40px",
    textAlign: "center",
    padding: "20px",
    background: theme.bgSurface,
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    border: `1px solid ${theme.border}`
  }}>
    <p style={{
      margin: 0,
      fontSize: "12px",
      color: theme.textSec
    }}>
      {t("profile.footer")}
    </p>
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
    phone: "+57 300 123 4567",
    location: "Neiva, Huila, Colombia",
    birthday: t("profile.personal.defaultBirthday", "15 de mayo, 1995"),
    bio: t("profile.personal.defaultBio", "Apasionado por la movilidad sostenible y el cuidado del medio ambiente.")
  });

  const [formData, setFormData] = useState(profile);
  const userStats = { routes: 47, co2Saved: 32.5 };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSave = () => { setProfile(formData); setIsEditing(false); alert(t("profile.changesSaved")); };
  const handleCancel = () => { setFormData(profile); setIsEditing(false); };

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bgMain,
      transition: "all 0.3s ease"
    }}>
      <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} theme={theme} />
      <Header theme={theme} profile={profile} onNavigate={onNavigate} t={t} />
      
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "clamp(20px, 5vw, 32px)"
      }}>
        <StatsCards theme={theme} stats={userStats} t={t} />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} t={t} />
        
        {activeTab === "personal" && (
          <PersonalPanel 
            theme={theme}
            profile={profile}
            formData={formData}
            isEditing={isEditing}
            handleChange={handleChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
            setIsEditing={setIsEditing}
            t={t}
          />
        )}
        
        {activeTab === "security" && <SecurityPanel theme={theme} t={t} />}
        {activeTab === "config" && <ConfigPanel theme={theme} isDarkMode={isDarkMode} toggleTheme={toggleTheme} t={t} />}
        
        <MotivationalFooter theme={theme} t={t} />
      </div>
    </div>
  );
};

export default UserProfile;