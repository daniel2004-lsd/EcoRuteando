import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../app/context/LanguageContext";
import { useTheme } from "../../../app/context/ThemeContext";
import { me, updateProfile, changePassword, deleteAccount, enable2FA, verify2FA, disable2FA } from "../../../services/authService";
import tripService from "../../../services/tripService";
import toast from "react-hot-toast";
import {
  LeafIcon,
  ArrowLeft,
  UserIcon,
  LockIcon,
  SettingsIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  EditIcon,
  SaveIcon,
  HeartIcon,
  ClockIcon
} from "../../../shared/components/Icons";

const UserProfile = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Neiva, Huila",
    birthday: "15 de mayo, 1995",
    bio: "Comprometido con la movilidad sostenible y la reducción de la huella de carbono."
  });

  const [formData, setFormData] = useState(profile);
  const [stats, setStats] = useState({
    completedTrips: 0,
    co2Saved: "0.00",
    totalMinutes: 0
  });

  // Información extendida de usuario (OAuth / 2FA)
  const [userInfo, setUserInfo] = useState({
    hasPassword: true,
    twoFactorEnabled: false,
    authProvider: "local"
  });

  // Modales
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [identityPassword, setIdentityPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Modal 2FA
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorMode, setTwoFactorMode] = useState("setup"); // "setup" | "success" | "disable"
  const [twoFactorData, setTwoFactorData] = useState({ secret: "", qrCodeUri: "", recoveryCodes: [] });
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [submitting2FA, setSubmitting2FA] = useState(false);

  // Modal Web Eliminar Cuenta
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Cargar perfil y estadísticas reales de viajes
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const u = await me();
        if (mounted && u) {
          setUserInfo({
            hasPassword: u.hasPassword !== false,
            twoFactorEnabled: !!u.twoFactorEnabled,
            authProvider: u.authProvider || (u.hasPassword === false ? "google" : "local")
          });

          const loadedName = [u.firstName, u.lastName].filter(Boolean).join(" ") || "Usuario Eco";
          setProfile((prev) => {
            const next = {
              ...prev,
              name: loadedName,
              email: u.email || "",
              phone: u.phoneNumber || ""
            };
            setFormData(next);
            return next;
          });
        }
      } catch (err) {
        console.warn("Error cargando perfil:", err);
      }

      try {
        const trips = await tripService.getAll();
        if (mounted && Array.isArray(trips)) {
          const completed = trips.filter((t) => t.completed);
          const co2 = completed.reduce((sum, t) => sum + (t.actualCo2Kg || 0), 0).toFixed(2);
          const mins = completed.reduce((sum, t) => sum + (t.actualDurationMin || 0), 0);
          setStats({
            completedTrips: completed.length,
            co2Saved: co2,
            totalMinutes: mins
          });
        }
      } catch (err) {
        console.warn("Error cargando estadísticas de viajes:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStartEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  // Ejecución de guardado de perfil
  const executeProfileUpdate = async (password) => {
    setSavingProfile(true);
    try {
      const parts = formData.name.trim().split(/\s+/);
      const firstName = parts[0] ?? formData.name;
      const lastName = parts.slice(1).join(" ") || null;

      const updated = await updateProfile({
        firstName,
        lastName,
        email: formData.email,
        phoneNumber: formData.phone || null,
        currentPassword: password || null
      });

      const updatedName = [updated.firstName, updated.lastName].filter(Boolean).join(" ");
      const newProfile = {
        ...profile,
        name: updatedName,
        email: updated.email,
        phone: updated.phoneNumber || "",
        location: formData.location,
        birthday: formData.birthday,
        bio: formData.bio
      };

      setProfile(newProfile);
      setFormData(newProfile);
      setIsEditing(false);
      setShowConfirmModal(false);
      setIdentityPassword("");
      toast.success(t("profile.changesSaved", "¡Cambios guardados con éxito!"));
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      const errorDetail = err?.response?.data?.detail || err?.response?.data?.message || t("profile.saveError", "No se pudieron actualizar los datos.");
      toast.error(errorDetail);
    } finally {
      setSavingProfile(false);
    }
  };

  // Guardar datos personales sin requerir contraseña
  const handleSaveClick = () => {
    executeProfileUpdate("");
  };

  // Cambio de contraseña
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!userInfo.hasPassword || userInfo.authProvider === "google") {
      toast.error("Tu cuenta está vinculada a Google. Administra tu seguridad en Google.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("profile.security.passwordsNotMatch", "Las contraseñas no coinciden"));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t("profile.security.passwordMinLength", "La contraseña debe tener al menos 8 caracteres"));
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success(t("profile.security.passwordUpdated", "Contraseña actualizada exitosamente"));
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.errors?.NewPassword?.[0] || t("profile.security.passwordUpdateFailed", "No se pudo actualizar la contraseña.");
      toast.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  // Gestión de 2FA
  const handleStart2FASetup = async () => {
    setSubmitting2FA(true);
    setTwoFactorCode("");
    try {
      const data = await enable2FA();
      setTwoFactorData(data || { secret: "", qrCodeUri: "", recoveryCodes: [] });
      setTwoFactorMode("setup");
      setShow2FAModal(true);
    } catch (err) {
      console.error("Error al iniciar 2FA:", err);
      toast.error(err?.response?.data?.detail || "No se pudo iniciar la configuración de 2FA.");
    } finally {
      setSubmitting2FA(false);
    }
  };

  const handleVerify2FACode = async (e) => {
    e?.preventDefault();
    const cleanCode = twoFactorCode.trim();
    if (!cleanCode || cleanCode.length < 6) {
      toast.error("Ingresa el código de 6 dígitos.");
      return;
    }

    setSubmitting2FA(true);
    try {
      await verify2FA(cleanCode);
      setUserInfo((prev) => ({ ...prev, twoFactorEnabled: true }));
      setTwoFactorMode("success");
      toast.success(t("profile.security.twoFactorSuccess", "¡2FA activado exitosamente!"));
    } catch (err) {
      console.error("Error al verificar código 2FA:", err);
      toast.error(err?.response?.data?.detail || "Código 2FA incorrecto o expirado.");
    } finally {
      setSubmitting2FA(false);
    }
  };

  const handleOpenDisable2FA = () => {
    setTwoFactorCode("");
    setTwoFactorMode("disable");
    setShow2FAModal(true);
  };

  const handleConfirmDisable2FA = async (e) => {
    e?.preventDefault();
    const cleanCode = twoFactorCode.trim();
    if (!cleanCode || cleanCode.length < 6) {
      toast.error("Ingresa tu código de 6 dígitos actual.");
      return;
    }

    setSubmitting2FA(true);
    try {
      await disable2FA(cleanCode);
      setUserInfo((prev) => ({ ...prev, twoFactorEnabled: false }));
      setShow2FAModal(false);
      setTwoFactorCode("");
      toast.success(t("profile.security.twoFactorDisabled", "2FA desactivado correctamente."));
    } catch (err) {
      console.error("Error al desactivar 2FA:", err);
      toast.error(err?.response?.data?.detail || "Código 2FA incorrecto.");
    } finally {
      setSubmitting2FA(false);
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(t("profile.security.copied", "¡Copiado al portapapeles!"));
  };

  // Eliminar cuenta con Modal Web
  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await deleteAccount();
      toast.success(t("profile.security.accountDeleted", "Tu cuenta ha sido eliminada."));
      setShowDeleteModal(false);
      onNavigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.detail || t("profile.security.accountDeleteFailed", "No se pudo eliminar la cuenta."));
    } finally {
      setDeletingAccount(false);
    }
  };

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "fr", name: "Français", flag: "🇫🇷" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-[#0B1215] text-[#e2e8f0]" : "bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 text-gray-800"}`}>
      {/* HEADER SUPERIOR */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
        isDarkMode ? "bg-[#162329]/90 border-[#26383D]" : "bg-white/90 border-gray-100 shadow-sm"
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/20 text-white font-bold">
              <LeafIcon size={22} white={true} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {t("profile.title", "Mi Perfil")}
              </h1>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {profile.email || "usuario@ecoruteando.org"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("/user/dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border shadow-sm ${
              isDarkMode
                ? "bg-[#111C20] border-[#26383D] text-gray-200 hover:bg-[#1f3037]"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-emerald-300"
            }`}
          >
            <ArrowLeft size={16} />
            <span>{t("profile.back", "Volver al Dashboard")}</span>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* TARJETA HERO DEL USUARIO */}
        <div className={`p-6 sm:p-8 rounded-3xl border transition-all backdrop-blur-sm relative overflow-hidden shadow-lg ${
          isDarkMode
            ? "bg-gradient-to-br from-[#162329] to-[#0D1A20] border-[#26383D]"
            : "bg-white/95 border-emerald-100"
        }`}>
          {/* Acento decorativo */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* AVATAR ESTILIZADO */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-green-600 p-1 shadow-xl flex items-center justify-center">
                <div className={`w-full h-full rounded-[22px] flex items-center justify-center font-extrabold text-3xl sm:text-4xl text-white shadow-inner ${
                  isDarkMode ? "bg-[#111C20]" : "bg-emerald-600"
                }`}>
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111C20] shadow-md flex items-center justify-center text-[10px] text-white">
                ✓
              </span>
            </div>

            {/* INFORMACIÓN DEL USUARIO */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {profile.name || "Usuario EcoRuteando"}
                </h2>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isDarkMode
                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                    : "bg-emerald-100 text-emerald-800 border-emerald-200"
                }`}>
                  <span>🌱</span>
                  <span>Movilidad Sostenible</span>
                </span>
              </div>

              <p className={`text-sm max-w-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {profile.bio}
              </p>

              <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs font-medium ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                <span className="flex items-center gap-1.5">
                  <MapPinIcon size={14} className="text-emerald-500" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <MailIcon size={14} className="text-emerald-500" />
                  {profile.email}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-1.5">
                    <PhoneIcon size={14} className="text-emerald-500" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TARJETAS DE ESTADÍSTICAS ECOLÓGICAS (SIN ECOPUNTOS) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-5 rounded-2xl border transition-all shadow-sm ${
            isDarkMode ? "bg-[#162329]/80 border-[#26383D]" : "bg-white border-gray-100"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {t("profile.stats.routesCompleted", "Viajes Completados")}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                🗺️
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500">
              {stats.completedTrips}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Trayectos registrados en la plataforma
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-all shadow-sm ${
            isDarkMode ? "bg-[#162329]/80 border-[#26383D]" : "bg-white border-gray-100"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {t("profile.stats.co2Saved", "CO₂ Evitado")}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                🌿
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500">
              {stats.co2Saved} <span className="text-sm font-semibold text-emerald-400">kg</span>
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Emisiones contaminantes mitigadas
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-all shadow-sm ${
            isDarkMode ? "bg-[#162329]/80 border-[#26383D]" : "bg-white border-gray-100"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {t("profile.stats.activeTime", "Tiempo Sostenible")}
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">
                ⏱️
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-teal-500">
              {stats.totalMinutes} <span className="text-sm font-semibold text-teal-400">min</span>
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Desplazándote de forma activa y verde
            </p>
          </div>
        </div>

        {/* NAVEGACIÓN POR PESTAÑAS */}
        <div className={`p-1.5 rounded-2xl border flex gap-1.5 flex-wrap ${
          isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-white border-gray-200 shadow-sm"
        }`}>
          {[
            { id: "personal", label: t("profile.tabs.personal", "Información Personal"), icon: UserIcon },
            { id: "security", label: t("profile.tabs.security", "Seguridad y Acceso"), icon: LockIcon },
            { id: "config", label: t("profile.tabs.config", "Configuración"), icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                    : isDarkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-[#162329]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENIDO DE PESTAÑAS */}

        {/* PESTAÑA 1: INFORMACIÓN PERSONAL */}
        {activeTab === "personal" && (
          <div className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-md ${
            isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b gap-4 border-gray-200 dark:border-[#26383D]">
              <div>
                <h3 className="text-lg font-bold">
                  {t("profile.personal.title", "Datos Personales")}
                </h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {t("profile.personal.subtitle", "Administra tu información de cuenta y contacto")}
                </p>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all self-start sm:self-auto"
                >
                  <EditIcon size={16} />
                  <span>{t("profile.personal.edit", "Editar Perfil")}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                      isDarkMode
                        ? "border-[#26383D] text-gray-300 hover:bg-[#111C20]"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {t("profile.personal.cancel", "Cancelar")}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all"
                  >
                    <SaveIcon size={16} />
                    <span>{t("profile.personal.save", "Guardar Cambios")}</span>
                  </button>
                </div>
              )}
            </div>

            {/* FORMULARIO DE CAMPOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nombre Completo */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  <UserIcon size={14} className="text-emerald-500" />
                  {t("profile.fields.fullName", "Nombre Completo")}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                      isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                ) : (
                  <div className={`px-4 py-2.5 rounded-xl text-sm border font-medium ${
                    isDarkMode ? "bg-[#111C20]/60 border-[#26383D]/60 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
                  }`}>
                    {profile.name || "—"}
                  </div>
                )}
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  <MailIcon size={14} className="text-emerald-500" />
                  {t("profile.fields.email", "Correo Electrónico")}
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                      isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                ) : (
                  <div className={`px-4 py-2.5 rounded-xl text-sm border font-medium ${
                    isDarkMode ? "bg-[#111C20]/60 border-[#26383D]/60 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
                  }`}>
                    {profile.email || "—"}
                  </div>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  <PhoneIcon size={14} className="text-emerald-500" />
                  {t("profile.fields.phone", "Teléfono")}
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+57 300 123 4567"
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                      isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                ) : (
                  <div className={`px-4 py-2.5 rounded-xl text-sm border font-medium ${
                    isDarkMode ? "bg-[#111C20]/60 border-[#26383D]/60 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
                  }`}>
                    {profile.phone || "—"}
                  </div>
                )}
              </div>

              {/* Ubicación */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  <MapPinIcon size={14} className="text-emerald-500" />
                  {t("profile.fields.location", "Ciudad / Ubicación")}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                      isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                ) : (
                  <div className={`px-4 py-2.5 rounded-xl text-sm border font-medium ${
                    isDarkMode ? "bg-[#111C20]/60 border-[#26383D]/60 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
                  }`}>
                    {profile.location || "—"}
                  </div>
                )}
              </div>

              {/* Fecha de Cumpleaños */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  <CalendarIcon size={14} className="text-emerald-500" />
                  {t("profile.fields.birthday", "Fecha de Cumpleaños")}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                      isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                ) : (
                  <div className={`px-4 py-2.5 rounded-xl text-sm border font-medium ${
                    isDarkMode ? "bg-[#111C20]/60 border-[#26383D]/60 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
                  }`}>
                    {profile.birthday || "—"}
                  </div>
                )}
              </div>

              {/* Biografía */}
              <div className="md:col-span-2">
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  <HeartIcon size={14} className="text-emerald-500" />
                  {t("profile.fields.bio", "Sobre Mí")}
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                      isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                ) : (
                  <div className={`px-4 py-2.5 rounded-xl text-sm border font-medium ${
                    isDarkMode ? "bg-[#111C20]/60 border-[#26383D]/60 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
                  }`}>
                    {profile.bio || "—"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: SEGURIDAD Y ACCESO */}
        {activeTab === "security" && (
          <div className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-md space-y-6 ${
            isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"
          }`}>
            <div>
              <h3 className="text-lg font-bold">
                {t("profile.security.title", "Seguridad de la Cuenta")}
              </h3>
              <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {t("profile.security.subtitle", "Gestiona tu contraseña y credenciales de acceso")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Opción 1: Contraseña o Proveedor Google */}
              {!userInfo.hasPassword || userInfo.authProvider === "google" ? (
                <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-[#111C20] border-blue-900/40" : "bg-blue-50/50 border-blue-200"
                }`}>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 border border-gray-200">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        {t("profile.security.googleAccountTitle", "Cuenta vinculada a Google")}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold">
                      {t("profile.security.googleAccountTitle", "Cuenta vinculada a Google")}
                    </h4>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {t("profile.security.googleAccountDesc", "Iniciaste sesión con tu cuenta de Google. Tu contraseña y autenticación son administradas de forma segura y centralizada por Google.")}
                    </p>
                    <div className={`p-2.5 rounded-xl text-[11px] ${isDarkMode ? "bg-[#162329] text-gray-300" : "bg-white text-gray-600 border border-blue-100"}`}>
                      🔒 {t("profile.security.googleNoPasswordNotice", "No requieres ni puedes cambiar una contraseña local en EcoRuteando.")}
                    </div>
                  </div>
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>{t("profile.security.googleManageSecurity", "Gestionar seguridad en Google")}</span>
                    <span className="text-xs">↗</span>
                  </a>
                </div>
              ) : (
                <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-[#111C20] border-[#26383D] hover:border-emerald-500/50" : "bg-gray-50 border-gray-200 hover:border-emerald-400"
                }`}>
                  <div className="space-y-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <LockIcon size={20} />
                    </div>
                    <h4 className="text-sm font-bold">
                      {t("profile.security.changePassword", "Cambiar Contraseña")}
                    </h4>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Actualiza periódicamente tu contraseña para mantener protegida tu cuenta.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all text-center"
                  >
                    {t("profile.security.changePassword", "Cambiar Contraseña")}
                  </button>
                </div>
              )}

              {/* Opción 2: 2FA */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"
              }`}>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      userInfo.twoFactorEnabled ? "bg-emerald-500/10 text-emerald-500" : "bg-teal-500/10 text-teal-500"
                    }`}>
                      {userInfo.twoFactorEnabled ? "🛡️" : "🔐"}
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      userInfo.twoFactorEnabled
                        ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                        : "bg-gray-500/15 text-gray-400 border-gray-500/30"
                    }`}>
                      {userInfo.twoFactorEnabled ? `✓ ${t("profile.security.twoFactorActive", "2FA Habilitado")}` : t("profile.security.twoFactorInactive", "2FA Desactivado")}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold">
                    {t("profile.security.twoFactorAuth", "Autenticación en Dos Pasos (2FA)")}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {userInfo.twoFactorEnabled
                      ? "Tu cuenta está protegida con verificación en dos pasos (TOTP / Authenticator)."
                      : "Agrega una capa adicional de protección con Google Authenticator o Microsoft Authenticator."}
                  </p>
                </div>
                {userInfo.twoFactorEnabled ? (
                  <button
                    type="button"
                    onClick={handleOpenDisable2FA}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                      isDarkMode
                        ? "bg-rose-950/20 border-rose-800/40 text-rose-400 hover:bg-rose-900/30"
                        : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                    }`}
                  >
                    {t("profile.security.disable2FA", "Desactivar 2FA")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStart2FASetup}
                    disabled={submitting2FA}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-md transition-all text-center disabled:opacity-50"
                  >
                    {submitting2FA ? "Cargando..." : t("profile.security.enable2FA", "Activar 2FA")}
                  </button>
                )}
              </div>
            </div>

            {/* ZONA DE PELIGRO: ELIMINAR CUENTA */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isDarkMode ? "bg-rose-950/20 border-rose-900/40" : "bg-rose-50/50 border-rose-200"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-rose-500 flex items-center gap-2">
                    <span>⚠️</span>
                    {t("profile.security.deleteAccount", "Eliminar mi cuenta")}
                  </h4>
                  <p className={`text-xs mt-1 max-w-xl ${isDarkMode ? "text-rose-300/70" : "text-rose-700/70"}`}>
                    Esta acción es irreversible y eliminará todos tus datos, viajes e historial registrado en EcoRuteando.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenDeleteModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all shrink-0"
                >
                  {t("profile.security.deleteAccount", "Eliminar mi cuenta")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: CONFIGURACIÓN */}
        {activeTab === "config" && (
          <div className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-md space-y-6 ${
            isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"
          }`}>
            <div>
              <h3 className="text-lg font-bold">
                {t("profile.config.title", "Preferencias del Sistema")}
              </h3>
              <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {t("profile.config.subtitle", "Personaliza la apariencia y el idioma de EcoRuteando")}
              </p>
            </div>

            <div className="space-y-4">
              {/* Tema Oscuro / Claro */}
              <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"
              }`}>
                <div>
                  <h4 className="text-sm font-bold">
                    {t("profile.config.darkMode", "Modo Oscuro")}
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {t("profile.config.darkModeDesc", "Cambia entre el tema claro y oscuro de la aplicación")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-amber-400 text-gray-900 border-amber-300 shadow-md"
                      : "bg-[#162329] text-gray-100 border-[#26383D] shadow-md"
                  }`}
                >
                  <span>{isDarkMode ? "☀️" : "🌙"}</span>
                  <span>{isDarkMode ? t("profile.config.lightMode", "Modo Claro") : t("profile.config.darkMode", "Modo Oscuro")}</span>
                </button>
              </div>

              {/* Selector de Idioma */}
              <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"
              }`}>
                <div>
                  <h4 className="text-sm font-bold">
                    {t("profile.config.language", "Idioma del Sistema")}
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {t("profile.config.languageDesc", "Selecciona el idioma de tu preferencia")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        changeLanguage(lang.code);
                        toast.success(`Idioma cambiado a ${lang.name}`);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                        language === lang.code
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-md"
                          : isDarkMode
                            ? "bg-[#162329] border-[#26383D] text-gray-300 hover:bg-[#1f3037]"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Banner informativo de responsividad */}
              <div className={`p-4 rounded-2xl border text-center text-xs font-medium ${
                isDarkMode ? "bg-[#111C20]/40 border-[#26383D]/40 text-gray-400" : "bg-emerald-50/50 border-emerald-100 text-emerald-800"
              }`}>
                🌿 {t("profile.config.responsive", "EcoRuteando está optimizado para dispositivos móviles y de escritorio.")}
              </div>
            </div>
          </div>
        )}

        {/* PIE MOTIVACIONAL */}
        <div className={`p-5 rounded-2xl border text-center transition-all ${
          isDarkMode ? "bg-[#162329]/50 border-[#26383D]/50 text-gray-400" : "bg-white/80 border-gray-200 text-gray-500"
        }`}>
          <p className="text-xs sm:text-sm flex items-center justify-center gap-2">
            <LeafIcon size={14} className="text-emerald-500" />
            <span>{t("profile.footer", "Cada viaje sostenible cuenta para un futuro más verde y consciente.")}</span>
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </main>

      {/* MODAL: CONFIRMAR IDENTIDAD CON CONTRASEÑA ACTUAL PARA GUARDAR DATOS */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className={`w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 transition-all ${
              isDarkMode ? "bg-[#162329] border-[#26383D] text-white" : "bg-white border-gray-200 text-gray-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <LockIcon size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold">
                  {t("profile.confirmIdentity.title", "Confirmar Identidad")}
                </h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {t("profile.confirmIdentity.subtitle", "Por seguridad, ingresa tu contraseña actual para confirmar los cambios.")}
                </p>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {t("profile.security.currentPassword", "Contraseña Actual")}
              </label>
              <input
                type="password"
                value={identityPassword}
                onChange={(e) => setIdentityPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                  isDarkMode ? "bg-[#111C20] border-[#26383D] text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  isDarkMode ? "border-[#26383D] text-gray-300 hover:bg-[#111C20]" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("profile.personal.cancel", "Cancelar")}
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={savingProfile || !identityPassword}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all disabled:opacity-50"
              >
                {savingProfile ? "Guardando..." : t("profile.security.update", "Confirmar y Guardar")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CAMBIAR CONTRASEÑA */}
      {showPasswordModal && userInfo.hasPassword && userInfo.authProvider !== "google" && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className={`w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 transition-all ${
              isDarkMode ? "bg-[#162329] border-[#26383D] text-white" : "bg-white border-gray-200 text-gray-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <LockIcon size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold">
                  {t("profile.security.changePassword", "Cambiar Contraseña")}
                </h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Introduce tu clave actual y define una nueva contraseña segura
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {t("profile.security.currentPassword", "Contraseña Actual")}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {t("profile.security.newPassword", "Nueva Contraseña")}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {t("profile.security.confirmPassword", "Confirmar Nueva Contraseña")}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    isDarkMode ? "border-[#26383D] text-gray-300 hover:bg-[#111C20]" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {t("profile.personal.cancel", "Cancelar")}
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all disabled:opacity-50"
                >
                  {savingPassword ? "Actualizando..." : t("profile.security.update", "Actualizar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL WEB: 2FA (AUTENTICACIÓN EN DOS PASOS) */}
      {show2FAModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => !submitting2FA && setShow2FAModal(false)}
        >
          <div
            className={`w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 transition-all max-h-[90vh] overflow-y-auto ${
              isDarkMode ? "bg-[#162329] border-[#26383D] text-white" : "bg-white border-gray-200 text-gray-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {twoFactorMode === "setup" && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center text-xl font-bold">
                    🔐
                  </div>
                  <div>
                    <h3 className="text-base font-bold">
                      {t("profile.security.twoFactorSetupTitle", "Configurar Autenticación en Dos Pasos (TOTP)")}
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Usa Google Authenticator, Microsoft Authenticator o Authy
                    </p>
                  </div>
                </div>

                {/* Código QR */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-200">
                  {twoFactorData.qrCodeUri ? (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(twoFactorData.qrCodeUri)}`}
                      alt="Código QR 2FA"
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-xs text-gray-400">
                      Cargando QR...
                    </div>
                  )}
                  <p className="text-[11px] text-gray-500 mt-2 text-center">
                    {t("profile.security.twoFactorScanQR", "Escanea este código QR con tu app de autenticación")}
                  </p>
                </div>

                {/* Clave Manual */}
                {twoFactorData.secret && (
                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {t("profile.security.twoFactorManualKey", "O copia esta clave secreta manualmente:")}
                    </label>
                    <div className="flex items-center gap-2">
                      <code className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono tracking-wider border truncate ${
                        isDarkMode ? "bg-[#111C20] border-[#26383D] text-emerald-400" : "bg-gray-100 border-gray-300 text-emerald-700"
                      }`}>
                        {twoFactorData.secret}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(twoFactorData.secret)}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 border border-emerald-600/30 transition-all shrink-0"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                )}

                {/* Input código de 6 dígitos */}
                <form onSubmit={handleVerify2FACode} className="space-y-4 pt-1">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {t("profile.security.twoFactorEnterCode", "Ingresa el código de 6 dígitos:")}
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      className={`w-full px-4 py-3 rounded-xl text-center text-2xl tracking-[0.3em] font-mono font-bold border focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                        isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                      }`}
                      autoFocus
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShow2FAModal(false)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        isDarkMode ? "border-[#26383D] text-gray-300 hover:bg-[#111C20]" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {t("profile.personal.cancel", "Cancelar")}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting2FA || twoFactorCode.length < 6}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-md transition-all disabled:opacity-50"
                    >
                      {submitting2FA ? "Verificando..." : t("profile.security.twoFactorVerifyBtn", "Verificar y Activar")}
                    </button>
                  </div>
                </form>
              </>
            )}

            {twoFactorMode === "success" && (
              <div className="space-y-4 text-center py-2">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-3xl font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-500">
                    ¡Autenticación en Dos Pasos Activada!
                  </h3>
                  <p className={`text-xs mt-1 max-w-sm mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {t("profile.security.twoFactorSuccess", "¡2FA activado exitosamente! Guarda tus códigos de recuperación en un lugar seguro.")}
                  </p>
                </div>

                {twoFactorData.recoveryCodes && twoFactorData.recoveryCodes.length > 0 && (
                  <div className={`p-4 rounded-2xl border text-left ${
                    isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"
                  }`}>
                    <p className="text-xs font-bold text-amber-500 mb-2">
                      🔑 Códigos de Recuperación de Emergencia:
                    </p>
                    <div className="grid grid-cols-2 gap-2 font-mono text-xs text-center">
                      {twoFactorData.recoveryCodes.map((code, idx) => (
                        <div key={idx} className={`p-1.5 rounded-lg border ${
                          isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-200"
                        }`}>
                          {code}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(twoFactorData.recoveryCodes.join("\n"))}
                      className="mt-3 w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30 transition-all text-center"
                    >
                      Copiar todos los códigos
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShow2FAModal(false)}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all"
                >
                  Entendido y Finalizar
                </button>
              </div>
            )}

            {twoFactorMode === "disable" && (
              <form onSubmit={handleConfirmDisable2FA} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-xl font-bold">
                    ⚠️
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-rose-500">
                      {t("profile.security.twoFactorDisableTitle", "Desactivar Autenticación en Dos Pasos")}
                    </h3>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Tu cuenta será menos segura sin 2FA
                    </p>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {t("profile.security.twoFactorDisableConfirm", "Ingresa tu código de 6 dígitos actual:")}
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className={`w-full px-4 py-3 rounded-xl text-center text-2xl tracking-[0.3em] font-mono font-bold border focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                      isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                    autoFocus
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShow2FAModal(false)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      isDarkMode ? "border-[#26383D] text-gray-300 hover:bg-[#111C20]" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {t("profile.personal.cancel", "Cancelar")}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting2FA || twoFactorCode.length < 6}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all disabled:opacity-50"
                  >
                    {submitting2FA ? "Desactivando..." : t("profile.security.disable2FA", "Desactivar 2FA")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL WEB: ELIMINAR CUENTA (MODAL EN LA WEB, NO DEL NAVEGADOR) */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => !deletingAccount && setShowDeleteModal(false)}
        >
          <div
            className={`w-full max-w-md p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 transition-all ${
              isDarkMode ? "bg-[#162329] border-[#26383D] text-white" : "bg-white border-gray-200 text-gray-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-500">
                  {t("profile.security.deleteAccountModalTitle", "¿Eliminar cuenta permanentemente?")}
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {t("profile.security.deleteAccountModalWarning", "Esta acción es irreversible y eliminará todos tus datos personales, preferencias e historial de rutas registradas en EcoRuteando.")}
                </p>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl text-xs border ${
              isDarkMode ? "bg-rose-950/30 border-rose-900/50 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-700"
            }`}>
              <p className="font-semibold">⚠️ Advertencia importante:</p>
              <p className="mt-0.5">Se cerrará tu sesión de inmediato y no podrás recuperar tu historial de viajes ni datos guardados.</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deletingAccount}
                onClick={() => setShowDeleteModal(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  isDarkMode ? "border-[#26383D] text-gray-300 hover:bg-[#111C20]" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {t("profile.personal.cancel", "Cancelar")}
              </button>
              <button
                type="button"
                disabled={deletingAccount}
                onClick={handleConfirmDeleteAccount}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {deletingAccount ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Eliminando...</span>
                  </>
                ) : (
                  t("profile.security.deleteAccountModalConfirm", "Sí, eliminar definitivamente")
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;