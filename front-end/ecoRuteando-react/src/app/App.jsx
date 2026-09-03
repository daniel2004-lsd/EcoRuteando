import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { LogoImage } from "../shared/components/Icons";
import LoadingOverlay from "../shared/components/LoadingOverlay";
import ConfirmModal from "../shared/components/ConfirmModal";

// Auth pages
import Login from "../features/auth/components/Login";
import Register from "../features/auth/components/Register";
import Recover from "../features/auth/components/Recover";
import VerifyCode from "../features/auth/components/VerifyCode";
import VerifyEmailCode from "../features/auth/components/VerifyEmailCode";
import NewPassword from "../features/auth/components/NewPassword";
import OAuthCallback from "../features/auth/components/OAuthCallback";
import TwoFactorVerify from "../features/auth/components/TwoFactorVerify";

// App pages
import HomePage from "../features/home/pages/HomePage";
import UserDashboard from "../features/home/pages/UserDashboard";
import UserProfile from "../features/home/pages/UserProfile";
import UserHistory from "../features/home/pages/UserHistory";
import TripDetail from "../features/home/pages/TripDetail";
import UserStatistics from "../features/home/pages/UserStatistics";
import UserAlerts from "../features/home/pages/UserAlert";
import Favorites from "../features/home/pages/Favorites";
import PlanRoute from "../features/home/pages/PlanRoute";
import ReporterProblem from "../features/home/pages/ReporterProblem";
import AdminPanel from "../features/admin/pages/AdminPanel";
import PoiManage from "../features/admin/pages/PoiManage";

import "leaflet/dist/leaflet.css";

function AdminSection({ title }) {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const { t } = useTranslation();
    return (
        <div className={`min-h-screen flex flex-col items-center justify-center gap-3 ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"}`}>
            <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-700"}`}>{t(title)}</h1>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{t("admin.section.underConstruction", "Sección en construcción")}</p>
            <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
                {t("admin.section.backToPanel", "Volver al panel")}
            </button>
        </div>
    );
}

function AppContent() {
    const { isDarkMode, toggleTheme } = useTheme();
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [userRole, setUserRole] = useState(() => localStorage.getItem("userRole") || "user");
    const [showTerms, setShowTerms] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false, pendingAction: null, title: "", message: "",
        confirmText: "", cancelText: "", type: "warning"
    });

    // Normaliza rutas relativas ("admin/users" -> "/admin/users")
    // Acepta un segundo argumento `state` para pasar datos entre páginas (p.ej. una ruta a "Usar ruta").
    const onNavigate = useCallback((path, state) => {
        if (typeof path !== "string" || !path) return;
        navigate(path.startsWith("/") ? path : `/${path}`, state);
    }, [navigate]);

    const handleAcceptTerms = () => {
        setTermsAccepted(true);
        setShowTerms(false);
    };

    const closeConfirmModal = () => {
        setConfirmModal({ isOpen: false, pendingAction: null, title: "", message: "", confirmText: "", cancelText: "", type: "warning" });
    };

    const executePendingAction = () => {
        if (confirmModal.pendingAction) confirmModal.pendingAction();
    };

    return (
        <div className={`relative min-h-screen font-sans antialiased ${isDarkMode ? "dark" : ""}`}>
            <button
                onClick={toggleTheme}
                className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            >
                {isDarkMode ? "☀️" : "🌙"}
            </button>

            <LoadingOverlay isLoading={isLoading} isDarkMode={isDarkMode} message="Cargando..." />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={executePendingAction}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                type={confirmModal.type}
            />

            <main>
                <Routes>
                    <Route path="/" element={<HomePage key={i18n.language} onNavigate={onNavigate} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={
                        <Register
                            onShowTerms={() => setShowTerms(true)}
                            termsAccepted={termsAccepted}
                            setTermsAccepted={setTermsAccepted}
                        />
                    } />
                    <Route path="/recover" element={<Recover />} />
                    <Route path="/verify" element={<VerifyCode onCodeVerified={(code) => sessionStorage.setItem("passwordRecoveryCode", code)} />} />
                    <Route path="/verify-email" element={<VerifyEmailCode />} />
                    <Route path="/newpassword" element={<NewPassword />} />
                    <Route path="/auth/callback" element={<OAuthCallback />} />
                    <Route path="/verify-2fa" element={<TwoFactorVerify />} />
                    <Route path="/dashboard" element={<UserDashboard userRole={userRole} onNavigate={onNavigate} />} />
                    <Route path="/admin" element={<AdminPanel userRole={userRole} onNavigate={onNavigate} />} />
                    <Route path="/admin/users" element={<AdminSection title="admin.section.users" />} />
                    <Route path="/admin/reports" element={<AdminSection title="admin.section.reports" />} />
                    <Route path="/admin/support" element={<AdminSection title="admin.section.support" />} />
                    <Route path="/admin/audit" element={<AdminSection title="admin.section.audit" />} />
                    <Route path="/admin/settings" element={<AdminSection title="admin.section.settings" />} />
                    <Route path="/admin/impact" element={<AdminSection title="admin.section.impact" />} />
                    <Route path="/admin/pois" element={<PoiManage onNavigate={onNavigate} />} />
                    <Route path="/profile" element={<UserProfile userRole={userRole} onNavigate={onNavigate} />} />
                    <Route path="/user/plan-route" element={<PlanRoute onNavigate={onNavigate} />} />
                    <Route path="/user/history" element={<UserHistory onNavigate={onNavigate} />} />
                    <Route path="/user/history/:usageId" element={<TripDetail onNavigate={onNavigate} />} />
                    <Route path="/user/statistics" element={<UserStatistics onNavigate={onNavigate} />} />
                    <Route path="/user/reporter-problem" element={<ReporterProblem onNavigate={onNavigate} />} />
                    <Route path="/user/alerts" element={<UserAlerts onNavigate={onNavigate} />} />
                    <Route path="/user/favorites" element={<Favorites onNavigate={onNavigate} />} />
                </Routes>
            </main>

            {showTerms && (
                <div className="modal-overlay animate-fade-in" onClick={() => setShowTerms(false)}>
                    <div className="modal-box animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowTerms(false)} className="absolute top-6 right-6 text-gray-400 hover:text-green-800 transition-colors text-xl">✕</button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-green-100 p-1 shadow-sm">
                                <LogoImage size={22} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-green-900">{t("terms.title", "Términos y Condiciones")}</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t("terms.date", "EcoRuteando · Enero 2025")}</p>
                            </div>
                        </div>

                        <div className="modal-content text-sm text-gray-600 space-y-5 leading-relaxed text-justify pr-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
                            <section>
                                <h3 className="font-bold text-green-800 mb-1">{t("terms.acceptance.title", "1. Aceptación de los Términos")}</h3>
                                <p>{t("terms.acceptance.text", "Al registrarse y utilizar los servicios de EcoRuteando, usted acepta quedar vinculado por estos Términos y Condiciones.")}</p>
                            </section>
                            <section>
                                <h3 className="font-bold text-green-800 mb-1">{t("terms.service.title", "2. Descripción del Servicio")}</h3>
                                <p>{t("terms.service.text", "EcoRuteando es una plataforma de movilidad sostenible desarrollada en el marco del programa de Desarrollo de Software del SENA.")}</p>
                            </section>
                            <section>
                                <h3 className="font-bold text-green-800 mb-1">{t("terms.userRegistration.title", "3. Registro de Usuario")}</h3>
                                <p>{t("terms.userRegistration.text", "El usuario deberá crear una cuenta con información veraz, completa y actualizada.")}</p>
                            </section>
                            <section>
                                <h3 className="font-bold text-green-800 mb-1">{t("terms.acceptableUse.title", "4. Uso Aceptable")}</h3>
                                <p>{t("terms.acceptableUse.text", "Queda expresamente prohibido: compartir contenido ofensivo, usar la plataforma para actividades ilegales.")}</p>
                            </section>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowTerms(false)} className="flex-1 py-3.5 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all text-sm">{t("terms.close", "Cerrar")}</button>
                            <button
                                onClick={handleAcceptTerms}
                                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-green-200 transition-all text-sm"
                            >
                                {t("terms.accept", "Acepto los términos")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <AppContent />
                    </BrowserRouter>
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;
