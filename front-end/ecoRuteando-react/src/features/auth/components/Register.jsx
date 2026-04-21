import { useState } from "react";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { Logo, ArrowLeft } from "../../../shared/components/Icons";

function Register({ onNavigate, onShowTerms, termsAccepted, setTermsAccepted }) {
  const [form, setForm] = useState({ name: "", lastName: "", email: "", pw: "", pw2: "" });
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validaciones de contraseña
  const hasMinLength = form.pw.length >= 8;
  const hasUppercase = /[A-Z]/.test(form.pw);
  const hasNumber = /[0-9]/.test(form.pw);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(form.pw);
  const isPwValid = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:7000/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          lastName: form.lastName,
          email: form.email,
          password: form.pw
        }),
      });

      if (response.ok) {
        alert("¡Usuario creado con éxito!");
        onNavigate("login");
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.message || "No se pudo crear la cuenta"));
      }
    } catch (error) {
      alert("Error de conexión. Asegúrate de que la API en Docker esté corriendo.");
    } finally {
      setIsLoading(false);
    }
  };

  // El botón se habilita solo si TODO es válido
  const isFormValid = 
    form.name.trim() !== "" && 
    form.lastName.trim() !== "" &&
    validateEmail(form.email) && 
    isPwValid && 
    form.pw === form.pw2 && 
    termsAccepted;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans antialiased tracking-tight bg-white overflow-hidden">
      <div className="flex flex-col justify-center items-center px-8 md:px-16 py-12 animate-fade-in-left">
        <div className="w-full max-w-[380px] flex flex-col space-y-6">
          
          <div className="relative flex flex-col items-center mb-4">
            <button onClick={() => onNavigate("home")} className="absolute -top-10 right-0 flex items-center gap-1.5 text-gray-400 hover:text-green-800 text-xs font-bold transition-all uppercase tracking-widest">
              <ArrowLeft /> Volver
            </button>
            <div className="scale-110 mb-2"><Logo size="md" /></div>
            <h1 className="text-3xl font-black text-gray-900 mt-2 leading-none tracking-tighter text-center">EcoRuteando</h1>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 italic">Crear Cuenta</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Input 
                placeholder="Nombre" 
                value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})} 
                className="bg-green-50/30 border-none rounded-xl"
              />
              <Input 
                placeholder="Apellido" 
                value={form.lastName} 
                onChange={(e) => setForm({...form, lastName: e.target.value})} 
                className="bg-green-50/30 border-none rounded-xl"
              />
            </div>
            
            <Input 
              placeholder="tucorreo@email.com" 
              value={form.email} 
              onChange={(e) => setForm({...form, email: e.target.value})} 
              className="bg-green-50/30 border-none rounded-xl"
            />

            <Input 
              placeholder="Contraseña" 
              showToggle showPw={showPw} 
              onToggle={() => setShowPw(!showPw)} 
              value={form.pw} 
              onChange={(e) => setForm({...form, pw: e.target.value})} 
              className="bg-green-50/30 border-none rounded-xl"
              type={showPw ? "text" : "password"}
            />

            <Input 
              type="password"
              placeholder="Confirmar contraseña" 
              value={form.pw2} 
              onChange={(e) => setForm({...form, pw2: e.target.value})} 
              error={form.pw2 && form.pw !== form.pw2 ? "No coinciden" : ""} 
              className="bg-green-50/30 border-none rounded-xl"
            />

            {/* Checkbox de Términos (Indispensable para habilitar el botón) */}
            <div className="flex items-center gap-2 px-1">
              <input 
                type="checkbox" 
                id="terms" 
                checked={termsAccepted} 
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 accent-green-800 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer">
                Acepto los <span className="text-green-800 font-bold underline" onClick={onShowTerms}>términos y condiciones</span>
              </label>
            </div>

            <Button 
              onClick={handleRegister}
              className="w-full py-3.5 bg-green-800 hover:bg-green-900 text-white font-bold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? "Registrando..." : "Crear cuenta gratuita"}
            </Button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              ¿Ya tienes cuenta? <button onClick={() => onNavigate("login")} className="text-green-800 font-bold hover:underline">Iniciar sesión</button>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-green-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900 via-green-950 to-black opacity-70" />
          <div className="relative z-10 flex flex-col justify-center items-center h-full p-10 text-white text-center">
            <h3 className="text-4xl md:text-5xl font-black mb-6 italic tracking-tighter">Conduce el futuro.</h3>
            <p className="text-gray-100 text-base max-w-sm">Descubre rutas eficientes y reduce tu huella de carbono.</p>
          </div>
      </div>
    </div>
  );
}

export default Register;