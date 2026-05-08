import React, { useState, useEffect } from "react";
import HomePage from "../features/home/pages/HomePage";
import Login from "../features/auth/components/Login";
import Register from "../features/auth/components/Register";
import Recover from "../features/auth/components/Recover";
import VerifyCode from "../features/auth/components/VerifyCode";
import NewPassword from "../features/auth/components/NewPassword";
import { LogoImage } from "../shared/components/Icons";
import UserDashboard from "../features/home/pages/UserDashboard";
import AdminPanel from "../features/admin/pages/AdminPanel";
import UserProfile from "../features/home/pages/UserProfile";
import LoadingOverlay from "../shared/components/LoadingOverlay";
import ConfirmModal from "../shared/components/ConfirmModal";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import PlanRoute from "../features/home/pages/PlanRoute";
import UserHistory from "../features/home/pages/UserHistory";
import UserStatistics from "../features/home/pages/UserStatistics";
import ReporterProblem from "../features/home/pages/ReporterProblem";

function AppContent() {
  const { isDarkMode, toggleTheme } = useTheme();

  // Estado de la página basado en la URL
  const [page, setPage] = useState(() => {
    const path = window.location.pathname;
    if (path === "/" || path === "") return "home";
    if (path === "/dashboard") return "dashboard";
    if (path === "/login") return "login";
    if (path === "/register") return "register";
    if (path === "/admin") return "admin";
    if (path === "/profile") return "profile";
    if (path === "/recover") return "recover";
    if (path === "/verify") return "verify";
    if (path === "/newpassword") return "newpassword";
    if (path === "/user/plan-route") return "user/plan-route";
    if (path === "/user/history") return "user/history";
    if (path === "/user/statistics") return "user/statistics";
    if (path === "/user/reporter-problem") return "user/reporter-problem"; // ✅ CORREGIDO (minúsculas y guión)
    return "home";
  });

  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userRole, setUserRole] = useState(() => {
    const savedRole = localStorage.getItem("userRole");
    return savedRole || "user";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    pendingAction: null,
    title: "",
    message: "",
    confirmText: "",
    cancelText: "",
    type: "warning"
  });

  // Escuchar cambios en la URL (popstate)
  useEffect(() => {
    const handlePathChange = () => {
      const path = window.location.pathname;
      if (path === "/" || path === "") setPage("home");
      else if (path === "/dashboard") setPage("dashboard");
      else if (path === "/login") setPage("login");
      else if (path === "/register") setPage("register");
      else if (path === "/admin") setPage("admin");
      else if (path === "/profile") setPage("profile");
      else if (path === "/recover") setPage("recover");
      else if (path === "/verify") setPage("verify");
      else if (path === "/newpassword") setPage("newpassword");
      else if (path === "/user/plan-route") setPage("user/plan-route");
      else if (path === "/user/history") setPage("user/history");
      else if (path === "/user/statistics") setPage("user/statistics");
      else if (path === "/user/reporter-problem") setPage("user/reporter-problem"); // ✅ AGREGADO
      else setPage("home");
    };

    window.addEventListener("popstate", handlePathChange);
    return () => window.removeEventListener("popstate", handlePathChange);
  }, []);

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTerms(false);
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, pendingAction: null, title: "", message: "", confirmText: "", cancelText: "", type: "warning" });
  };

  const executePendingAction = () => {
    if (confirmModal.pendingAction) {
      confirmModal.pendingAction();
    }
  };

  // Función para navegar - CORREGIDA para que funcione sin recargar
  const navigate = (path) => {
    // Asegurar que la ruta empiece con /
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    window.history.pushState({}, "", fullPath);
    
    // Actualizar el estado basado en la nueva ruta
    if (fullPath === "/" || fullPath === "") setPage("home");
    else if (fullPath === "/dashboard") setPage("dashboard");
    else if (fullPath === "/login") setPage("login");
    else if (fullPath === "/register") setPage("register");
    else if (fullPath === "/admin") setPage("admin");
    else if (fullPath === "/profile") setPage("profile");
    else if (fullPath === "/recover") setPage("recover");
    else if (fullPath === "/verify") setPage("verify");
    else if (fullPath === "/newpassword") setPage("newpassword");
    else if (fullPath === "/user/plan-route") setPage("user/plan-route");
    else if (fullPath === "/user/history") setPage("user/history");
    else if (fullPath === "/user/statistics") setPage("user/statistics");
    else if (fullPath === "/user/reporter-problem") setPage("user/reporter-problem");
    else setPage("home");
  };

  return (
    <div className={`relative min-h-screen font-sans antialiased ${isDarkMode ? "dark" : ""}`}>
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {isLoading && <LoadingOverlay message="Cargando..." />}

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
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "dashboard" && <UserDashboard onNavigate={navigate} userRole={userRole} />}
        {page === "login" && <Login setUserRole={setUserRole} />}
        {page === "admin" && <AdminPanel onNavigate={navigate} userRole={userRole} />}
        {page === "profile" && <UserProfile onNavigate={navigate} userRole={userRole} />}
        {page === "register" && (
          <Register
            onShowTerms={() => setShowTerms(true)}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
          />
        )}
        {page === "recover" && <Recover onNavigate={navigate} />}
        {page === "verify" && <VerifyCode onNavigate={navigate} />}
        {page === "newpassword" && <NewPassword onNavigate={navigate} />}
        {page === "user/plan-route" && <PlanRoute onNavigate={navigate} />}
        {page === "user/history" && <UserHistory onNavigate={navigate} />}
        {page === "user/statistics" && <UserStatistics onNavigate={navigate} />}
        {page === "user/reporter-problem" && <ReporterProblem onNavigate={navigate} />} {/* ✅ CORREGIDO */}
      </main>

      {/* MODAL DE TÉRMINOS Y CONDICIONES */}
      {showTerms && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowTerms(false)}>
          <div className="modal-box animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowTerms(false)} className="absolute top-6 right-6 text-gray-400 hover:text-green-800 transition-colors text-xl">✕</button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-green-100 p-1 shadow-sm">
                <LogoImage size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-900">Términos y Condiciones</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">EcoRuteando · Enero 2025</p>
              </div>
            </div>

            <div className="modal-content text-sm text-gray-600 space-y-5 leading-relaxed text-justify pr-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
              <section>
                <h3 className="font-bold text-green-800 mb-1">1. Aceptación de los Términos</h3>
                <p>Al registrarse y utilizar los servicios de EcoRuteando, usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguno de los términos aquí establecidos, le recomendamos no hacer uso de la plataforma.</p>
              </section>

              <section>
                <h3 className="font-bold text-green-800 mb-1">2. Descripción del Servicio</h3>
                <p>EcoRuteando es una plataforma de movilidad sostenible desarrollada en el marco del programa de Desarrollo de Software del SENA, sede Neiva, Colombia. Su propósito es facilitar la planificación de rutas ecológicas que combinan transporte público y bicicleta.</p>
              </section>

              <section>
                <h3 className="font-bold text-green-800 mb-1">3. Registro de Usuario</h3>
                <p>Para acceder a las funcionalidades completas de la plataforma, el usuario deberá crear una cuenta con información veraz, completa y actualizada. El usuario es responsable de mantener la confidencialidad de sus credenciales.</p>
              </section>

              <section>
                <h3 className="font-bold text-green-800 mb-1">4. Uso Aceptable</h3>
                <p>Queda expresamente prohibido: compartir contenido ofensivo, usar la plataforma para actividades ilegales o intentar vulnerar la seguridad del sistema.</p>
              </section>

              <section>
                <h3 className="font-bold text-green-800 mb-1">10. Ley Aplicable y Jurisdicción</h3>
                <p>Estos Términos y Condiciones se rigen por las leyes de la República de Colombia. Cualquier disputa será resuelta ante los tribunales competentes de la ciudad de Neiva, Huila.</p>
              </section>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowTerms(false)} className="flex-1 py-3.5 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all text-sm">Cerrar</button>
              <button
                onClick={handleAcceptTerms}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-green-200 transition-all text-sm"
              >
                Acepto los términos
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
      <AppContent />
    </ThemeProvider>
  );
}

export default App;