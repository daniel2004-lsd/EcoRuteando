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

function App() {
  // Cargar la página guardada en localStorage o usar "home" por defecto
  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem("currentPage");
    return savedPage || "home";
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

  // Guardar la página actual en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("currentPage", page);
  }, [page]);

  // Guardar el rol del usuario en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("userRole", userRole);
  }, [userRole]);

  // Navegación con loading y confirmación
  const navigate = async (p, skipConfirm = false) => {
    // Confirmar al salir del dashboard o admin
    if (!skipConfirm && (page === "dashboard" || page === "admin" || page === "profile") && p === "home") {
      setConfirmModal({
        isOpen: true,
        pendingAction: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          performNavigation(p);
        },
        title: "¿Salir del dashboard?",
        message: "¿Estás seguro de que deseas salir?",
        confirmText: "Sí, salir",
        cancelText: "Cancelar",
        type: "warning"
      });
      return;
    }
    performNavigation(p);
  };

  const performNavigation = async (p) => {
    setIsLoading(true);
    // 3 segundos de carga
    await new Promise(resolve => setTimeout(resolve, 3000));
    setPage(p);
    window.scrollTo(0, 0);
    setIsLoading(false);
  };

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

  return (
    <div className="relative min-h-screen font-sans antialiased text-gray-900">
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay message="Cargando..." />}

      {/* Confirm Modal */}
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
        {page === "login" && <Login onNavigate={navigate} setUserRole={setUserRole} />}
        {page === "admin" && <AdminPanel onNavigate={navigate} userRole={userRole} />}
        {page === "profile" && <UserProfile onNavigate={navigate} userRole={userRole} />}
        {page === "register" && (
          <Register
            onNavigate={navigate}
            onShowTerms={() => setShowTerms(true)}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
          />
        )}
        {page === "recover" && <Recover onNavigate={navigate} />}
        {page === "verify" && <VerifyCode onNavigate={navigate} />}
        {page === "newpassword" && <NewPassword onNavigate={navigate} />}
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

export default App;