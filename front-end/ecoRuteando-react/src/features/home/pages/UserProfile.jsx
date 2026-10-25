import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../app/context/LanguageContext";
import { useTheme } from "../../../app/context/ThemeContext";
import { me, updateProfile, changePassword, deleteAccount, enable2FA, verify2FA, disable2FA } from "../../../services/authService";
import tripService from "../../../services/tripService";
import supportService from "../../../services/supportService";
import toast from "react-hot-toast";
import {
  LeafIcon,
  UserIcon,
  LockIcon,
  SettingsIcon,
  MailIcon
} from "../../../shared/components/Icons";
import {
  ProfileHeader,
  StatsCards,
  PersonalTab,
  SecurityTab,
  PreferencesTab,
  SupportTab,
  ConfirmIdentityModal,
  ChangePasswordModal,
  TwoFactorModal,
  DeleteAccountModal
} from "../components/profile";

const UserProfile = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [, setLoading] = useState(true);

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

  // Soporte Técnico / PQRS y Preguntas Frecuentes
  const [supportTickets, setSupportTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "general",
    message: ""
  });
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const loadSupportTickets = async () => {
    try {
      setLoadingTickets(true);
      const data = await supportService.getMyTickets();
      setSupportTickets(Array.isArray(data) ? data : (data?.items || []));
    } catch (err) {
      console.warn("Error cargando tickets de soporte:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      toast.error(t("support.fillRequired", "Por favor ingresa un asunto y el detalle de tu consulta."));
      return;
    }
    try {
      setSubmittingTicket(true);
      await supportService.createTicket({
        subject: `[${ticketForm.category.toUpperCase()}] ${ticketForm.subject.trim()}`,
        message: ticketForm.message.trim(),
        priority: 2
      });
      toast.success(t("support.ticketSuccess", "Tu consulta ha sido enviada con éxito. Te responderemos pronto."));
      setTicketForm({ subject: "", category: "general", message: "" });
      loadSupportTickets();
    } catch (err) {
      console.error("Error enviando ticket:", err);
      toast.error(err?.response?.data?.message || t("support.ticketError", "Error al enviar tu solicitud. Intenta más tarde."));
    } finally {
      setSubmittingTicket(false);
    }
  };

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

  const handleConfirmSave = () => {
    executeProfileUpdate(identityPassword);
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
      {/* HEADER SUPERIOR & HERO */}
      <ProfileHeader
        isDarkMode={isDarkMode}
        profile={profile}
        onNavigate={onNavigate}
        t={t}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* TARJETAS DE ESTADÍSTICAS ECOLÓGICAS */}
        <StatsCards
          isDarkMode={isDarkMode}
          stats={stats}
          t={t}
        />

        {/* NAVEGACIÓN POR PESTAÑAS */}
        <div className={`p-1.5 rounded-2xl border flex gap-1.5 flex-wrap ${
          isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-white border-gray-200 shadow-sm"
        }`}>
          {[
            { id: "personal", label: t("profile.tabs.personal", "Información Personal"), icon: UserIcon },
            { id: "security", label: t("profile.tabs.security", "Seguridad y Acceso"), icon: LockIcon },
            { id: "config", label: t("profile.tabs.config", "Configuración"), icon: SettingsIcon },
            { id: "support", label: t("profile.tabs.support", "Soporte y Preguntas"), icon: MailIcon },
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
        {activeTab === "personal" && (
          <PersonalTab
            isDarkMode={isDarkMode}
            isEditing={isEditing}
            formData={formData}
            profile={profile}
            handleChange={handleChange}
            handleStartEdit={handleStartEdit}
            handleCancelEdit={handleCancelEdit}
            handleSaveClick={handleSaveClick}
            t={t}
          />
        )}

        {activeTab === "security" && (
          <SecurityTab
            isDarkMode={isDarkMode}
            userInfo={userInfo}
            submitting2FA={submitting2FA}
            setShowPasswordModal={setShowPasswordModal}
            handleStart2FASetup={handleStart2FASetup}
            handleOpenDisable2FA={handleOpenDisable2FA}
            handleOpenDeleteModal={handleOpenDeleteModal}
            t={t}
          />
        )}

        {activeTab === "config" && (
          <PreferencesTab
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            language={language}
            changeLanguage={changeLanguage}
            languages={languages}
            t={t}
          />
        )}

        {activeTab === "support" && (
          <SupportTab
            isDarkMode={isDarkMode}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            ticketForm={ticketForm}
            setTicketForm={setTicketForm}
            submittingTicket={submittingTicket}
            handleTicketSubmit={handleTicketSubmit}
            supportTickets={supportTickets}
            loadingTickets={loadingTickets}
            loadSupportTickets={loadSupportTickets}
            t={t}
          />
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

      {/* MODALES MODULARIZADOS */}
      <ConfirmIdentityModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        identityPassword={identityPassword}
        setIdentityPassword={setIdentityPassword}
        handleConfirmSave={handleConfirmSave}
        savingProfile={savingProfile}
        isDarkMode={isDarkMode}
        t={t}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal && userInfo.hasPassword && userInfo.authProvider !== "google"}
        onClose={() => setShowPasswordModal(false)}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        savingPassword={savingPassword}
        handleChangePassword={handleChangePassword}
        isDarkMode={isDarkMode}
        t={t}
      />

      <TwoFactorModal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        twoFactorMode={twoFactorMode}
        twoFactorData={twoFactorData}
        twoFactorCode={twoFactorCode}
        setTwoFactorCode={setTwoFactorCode}
        submitting2FA={submitting2FA}
        handleVerify2FACode={handleVerify2FACode}
        handleConfirmDisable2FA={handleConfirmDisable2FA}
        copyToClipboard={copyToClipboard}
        isDarkMode={isDarkMode}
        t={t}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        deletingAccount={deletingAccount}
        handleConfirmDeleteAccount={handleConfirmDeleteAccount}
        isDarkMode={isDarkMode}
        t={t}
      />
    </div>
  );
};

export default UserProfile;