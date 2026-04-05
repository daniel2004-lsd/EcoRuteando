import { useState } from "react";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { Logo, GoogleIcon, FacebookIcon, XIcon, ArrowLeft } from "../../../shared/components/Icons";

function Register({ onNavigate, onShowTerms, termsAccepted, setTermsAccepted }) {
  const [form, setForm] = useState({ name: "", email: "", pw: "", pw2: "" });
  const [showPw, setShowPw] = useState(false);

  // 1. VALIDACIONES DE CONTRASEÑA (Deben ir antes de ser usadas)
  const hasMinLength = form.pw.length >= 8;
  const hasUppercase = /[A-Z]/.test(form.pw);
  const hasNumber = /[0-9]/.test(form.pw);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(form.pw);
  const isPwValid = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  // 2. LÓGICA DE FUERZA DE CONTRASEÑA
  const getStrength = () => {
    let s = 0;
    if (form.pw.length > 0) s++;
    if (hasMinLength) s++;
    if (hasUppercase && hasNumber) s++;
    if (hasSpecial) s++;
    return s;
  };

  const pwStrength = getStrength();
  const strengthColors = ["bg-gray-200", "bg-red-400", "bg-yellow-400", "bg-blue-500", "bg-emerald-600"];
  const strengthLabels = ["", "Débil", "Aceptable", "Fuerte", "Excelente"];
  const strengthClass = ["", "text-red-500", "text-yellow-600", "text-blue-600", "text-emerald-600"];

  // 3. VALIDACIONES GENERALES
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const validateName = (v) => v.trim().length >= 2;

  const handleCheckboxClick = (e) => {
    if (!termsAccepted) {
      e.preventDefault(); 
      onShowTerms();
    } else {
      setTermsAccepted(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf4ef] flex flex-col items-center justify-center px-4 py-10 animate-fade-in text-left">
      <button onClick={() => onNavigate("home")} className="absolute top-6 right-6 flex items-center gap-1 text-gray-400 hover:text-green-800 text-sm font-medium transition-colors">
        <ArrowLeft /> Volver
      </button>

      <div className="mb-8 scale-90 md:scale-100">
        <Logo size="md" />
      </div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 border border-green-50 animate-slide-up">
        <h2 className="text-2xl font-bold text-green-900 mb-1 text-center">Crear Cuenta</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">Únete a la comunidad de movilidad sostenible</p>

        <div className="space-y-4">
          <Input 
            label="Nombre completo" 
            placeholder="Tu nombre" 
            value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})} 
            success={form.name && validateName(form.name) ? "Nombre válido" : ""} 
          />
          
          <Input 
            label="Correo electrónico" 
            placeholder="tucorreo@email.com" 
            value={form.email} 
            onChange={(e) => setForm({...form, email: e.target.value})} 
            success={form.email && validateEmail(form.email) ? "Correo válido" : ""} 
          />

          {/* Sección de Contraseña con Checklist */}
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
            
            {form.pw && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 animate-fade-in">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= pwStrength ? strengthColors[pwStrength] : "bg-gray-200"}`} />
                  ))}
                </div>
                
                {/* Checklist de requisitos visual */}
                <div className="grid grid-cols-2 gap-y-1">
                  <p className={`text-[9px] flex items-center gap-1 font-bold ${hasMinLength ? "text-green-600" : "text-gray-400"}`}>
                    {hasMinLength ? "✓" : "○"} 8+ caracteres
                  </p>
                  <p className={`text-[9px] flex items-center gap-1 font-bold ${hasUppercase ? "text-green-600" : "text-gray-400"}`}>
                    {hasUppercase ? "✓" : "○"} Una Mayúscula
                  </p>
                  <p className={`text-[9px] flex items-center gap-1 font-bold ${hasNumber ? "text-green-600" : "text-gray-400"}`}>
                    {hasNumber ? "✓" : "○"} Un Número
                  </p>
                  <p className={`text-[9px] flex items-center gap-1 font-bold ${hasSpecial ? "text-green-600" : "text-gray-400"}`}>
                    {hasSpecial ? "✓" : "○"} Carácter esp.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Input 
            label="Confirmar contraseña" 
            type="password" 
            placeholder="Repite tu contraseña" 
            value={form.pw2} 
            onChange={(e) => setForm({...form, pw2: e.target.value})} 
            error={form.pw2 && form.pw !== form.pw2 ? "Las contraseñas no coinciden" : ""} 
          />

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={termsAccepted} 
                onChange={handleCheckboxClick}
                className="accent-green-600 mt-1 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-gray-600 text-left">
                Acepto los <button type="button" onClick={onShowTerms} className="text-green-700 font-bold hover:underline">términos y condiciones</button>
              </span>
            </label>
          </div>

          <Button 
            className="w-full py-3.5 mt-2 shadow-md" 
            disabled={!termsAccepted || !validateEmail(form.email) || form.pw !== form.pw2 || !isPwValid}
          >
            Crear cuenta
          </Button>
          
          <div className="relative flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-100" /><span className="text-[10px] text-gray-400 font-bold uppercase">Continuar con</span><div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="flex gap-3">
            <button className="flex-1 border border-gray-200 rounded-xl py-2 flex justify-center items-center hover:bg-gray-50 transition-all"><GoogleIcon /></button>
            <button className="flex-1 border border-gray-200 rounded-xl py-2 flex justify-center items-center hover:bg-gray-50 transition-all"><FacebookIcon /></button>
            <button className="flex-1 border border-gray-200 rounded-xl py-2 flex justify-center items-center hover:bg-gray-50 transition-all"><XIcon /></button>
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta? <button onClick={() => onNavigate("login")} className="text-green-700 font-bold hover:underline">Iniciar sesión</button>
        </p>
      </div>
    </div>
  );
}

export default Register;