<<<<<<< Updated upstream
  import React, { useState } from "react";
  // Importación de las páginas principales
  import HomePage from "../features/home/pages/HomePage";
  import Login from "../features/auth/components/Login";
  import Register from "../features/auth/components/Register";
  import Recover from "../features/auth/components/Recover";
  import VerifyCode from "../features/auth/components/VerifyCode";
  import NewPassword from "../features/auth/components/NewPassword";
  import Navbar  from "../features/auth/components/Navbar";
  // Solo necesitamos LogoImage e iconos generales aquí
  import { LogoImage } from "../shared/components/Icons";

  function App() {
    const [page, setPage] = useState("home");
    const [showTerms, setShowTerms] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const navigate = (p) => {
      setPage(p);
      window.scrollTo(0, 0);
    };

    const handleAcceptTerms = () => {
      setTermsAccepted(true);
      setShowTerms(false);
    };

    return (
      <div className="relative min-h-screen font-sans antialiased text-gray-900">
        
        <main>
          {page === "home" && <HomePage onNavigate={navigate} />}
          {page === "login" && <Login onNavigate={navigate} />}
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
=======
import React, { useState } from "react";
import HomePage from "../features/home/pages/HomePage";
import Login from "../features/auth/components/Login";
import Register from "../features/auth/components/Register";
import Recover from "../features/auth/components/Recover";
import VerifyCode from "../features/auth/components/VerifyCode";
import NewPassword from "../features/auth/components/NewPassword";
import { LogoImage } from "../shared/components/Icons";
import UserDashboard from "../features/home/pages/UserDashboard";
import AdminPanel from "../features/admin/pages/AdminPanel";

function App() {
  const [page, setPage] = useState("home");
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userRole, setUserRole] = useState("user");

  const navigate = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };
  
  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTerms(false);
  };

  return (
    <div className="relative min-h-screen font-sans antialiased text-gray-900">
      <main>
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "dashboard" && <UserDashboard onNavigate={navigate} userRole={userRole} />}
        {page === "login" && <Login onNavigate={navigate} setUserRole={setUserRole} />}
        {page === "admin" && <AdminPanel onNavigate={navigate} userRole={userRole} />}
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
>>>>>>> Stashed changes
