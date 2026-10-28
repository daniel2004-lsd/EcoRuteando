import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { LogoImage } from "../shared/components/Icons";
import LoadingOverlay from "../shared/components/LoadingOverlay";
import ConfirmModal from "../shared/components/ConfirmModal";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import TermsModal from "../shared/components/TermsModal";

// Auth pages
import Login from "../features/auth/components/Login";
import Register from "../features/auth/components/Register";
import Recover from "../features/auth/components/Recover";
import VerifyCode from "../features/auth/components/VerifyCode";
import VerifyEmailCode from "../features/auth/components/VerifyEmailCode";
import NewPassword from "../features/auth/components/NewPassword";
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
import AdminPanel from "../features/admin/pages/AdminPanel";
import RouteManage from "../features/home/pages/RouteManage";
import AdminStatistics from "../features/admin/pages/AdminStatistics";
import AdminTickets from "../features/admin/pages/AdminTickets";
import AdminExports from "../features/admin/pages/AdminExports";
import AdminAudit from "../features/admin/pages/AdminAudit";
import AdminUsers from "../features/admin/pages/AdminUsers";
import ReporterProblem from "../features/home/pages/ReporterProblem";

import "leaflet/dist/leaflet.css";

function AdminSection({ title }) {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const { t } = useTranslation();
    return (
        <div className={`min-h-screen flex flex-col items-center justify-center gap-3 ${isDarkMode ? 'bg-[#0B1215]' : "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"}`}>
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-[#e2e8f0]' : "text-gray-700"}`}>{t(title)}</h1>
            <p className={`text-sm ${isDarkMode ? 'text-[#94a3b8]' : "text-gray-500"}`}>{t("admin.section.underConstruction", "Sección en construcción")}</p>
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
    const { isDarkMode } = useTheme();
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [recoveryCode, setRecoveryCode] = useState(null);
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
        <div className={`relative min-h-screen font-sans antialiased ${isDarkMode ? 'dark' : ""}`}>
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
                    <Route path="/verify" element={<VerifyCode onCodeVerified={(code) => setRecoveryCode(code)} />} />
                    <Route path="/verify-email" element={<VerifyEmailCode />} />
                    <Route path="/newpassword" element={<NewPassword recoveryCode={recoveryCode} onClearRecoveryCode={() => setRecoveryCode(null)} />} />
                    <Route path="/verify-2fa" element={<TwoFactorVerify />} />
                    <Route path="/dashboard" element={<ProtectedRoute allowGuest><UserDashboard onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPanel onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/admin/tickets" element={<ProtectedRoute requiredRole="admin"><AdminTickets onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/admin/reports" element={<Navigate to="/admin/tickets" replace />} />
                    <Route path="/admin/audit" element={<ProtectedRoute requiredRole="admin"><AdminAudit onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/admin/impact" element={<ProtectedRoute requiredRole="admin"><AdminStatistics onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/admin/exports" element={<ProtectedRoute requiredRole="admin"><AdminExports onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><UserProfile onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/user/plan-route" element={<ProtectedRoute allowGuest><PlanRoute onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/user/routes" element={<ProtectedRoute><RouteManage onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/user/history" element={<ProtectedRoute><UserHistory onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/user/history/:usageId" element={<ProtectedRoute><TripDetail onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/user/statistics" element={<ProtectedRoute><UserStatistics onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/user/reporter-problem" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/user/alerts" element={<ProtectedRoute><UserAlerts onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="/user/favorites" element={<Navigate to="/user/routes" state={{ initialTab: "favorites" }} replace />} />
                    <Route path="/user/dashboard" element={<ProtectedRoute allowGuest><UserDashboard onNavigate={onNavigate} /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </main>

            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAccept={handleAcceptTerms}
                showAcceptButton={true}
            />
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
