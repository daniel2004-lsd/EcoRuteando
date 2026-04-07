import { useState } from "react";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { Logo, GoogleIcon, FacebookIcon, XIcon, ArrowLeft } from "../../../shared/components/Icons";

function Login({ onNavigate }) {
  const [form, setForm] = useState({ email: "", pw: "" });
  const [showPw, setShowPw] = useState(false);

  // Validación básica idéntica al original
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  return (
    <div className="min-h-screen bg-[#edf4ef] flex flex-col items-center justify-center px-4 py-10 animate-fade-in">
      {/* Botón Volver arriba a la derecha */}
      <button 
        onClick={() => onNavigate("home")} 
        className="absolute top-6 right-6 flex items-center gap-1 text-gray-400 hover:text-green-800 text-sm font-medium transition-colors"
      >
        <ArrowLeft /> Volver
      </button>

      <div className="mb-8 scale-90 md:scale-100">
        <Logo size="md" />
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 border border-green-50 animate-slide-up">
        <h2 className="text-2xl font-bold text-green-900 mb-1">Iniciar sesión</h2>
        <p className="text-gray-500 text-sm mb-6 font-medium text-left">Bienvenido de vuelta a EcoRuteando.</p>

        <div className="space-y-4">
          <Input
            label="Correo electrónico"
            placeholder="tucorreo@email.com"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            success={form.email && validateEmail(form.email) ? "Correo válido" : ""}
          />
          
          <div>
            <Input
              label="Contraseña"
              placeholder="Mín. 8 caracteres"
              showToggle
              showPw={showPw}
              onToggle={() => setShowPw(!showPw)}
              value={form.pw}
              onChange={(e) => setForm({...form, pw: e.target.value})}
            />
            {/* Link "¿Olvidaste tu contraseña?" a la derecha */}
            <div className="text-right mt-2">
              <button 
                onClick={() => onNavigate("recover")} 
                className="text-green-700 text-xs font-bold hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          <Button 
            className="w-full py-3.5 mt-2 shadow-md" 
            disabled={!validateEmail(form.email) || form.pw.length < 8}
          >
            Iniciar sesión
          </Button>
          
          {/* Social Buttons: Solo logos centrados */}
          <div className="relative flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] text-gray-400 font-bold uppercase">Continuar con</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          
          <div className="flex gap-3">
            <button className="flex-1 border border-gray-200 rounded-xl py-2 flex justify-center items-center hover:bg-gray-50 transition-all">
              <GoogleIcon />
            </button>
            <button className="flex-1 border border-gray-200 rounded-xl py-2 flex justify-center items-center hover:bg-gray-50 transition-all">
              <FacebookIcon />
            </button>
            <button className="flex-1 border border-gray-200 rounded-xl py-2 flex justify-center items-center hover:bg-gray-50 transition-all">
              <XIcon />
            </button>
          </div>
        </div>
        
        {/* Enlace al registro al final */}
        <p className="text-center text-sm text-gray-500 mt-8">
          ¿No tienes cuenta? <button onClick={() => onNavigate("register")} className="text-green-700 font-bold hover:underline">Regístrate aquí.</button>
        </p>
      </div>
    </div>
  );
}

export default Login;