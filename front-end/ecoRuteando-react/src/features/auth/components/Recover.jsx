import { useState } from "react";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { Logo, MailIcon, ArrowLeft } from "../../../shared/components/Icons";

const Recover = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // Esta es la función que faltaba y causaba el error
  const handleSend = () => {
    if (validateEmail(email)) {
      setSent(true);
    }
  };

  if (sent) return (
    <div className="min-h-screen bg-[#edf4ef] flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="mb-8"><Logo size="md" /></div>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 text-center border border-green-50 animate-slide-up">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <MailIcon />
        </div>
        <h2 className="text-xl font-bold text-green-900 mb-3 text-center">Revisa tu correo</h2>
        <p className="text-gray-500 text-sm mb-2 leading-relaxed">Hemos enviado un enlace de verificación a:</p>
        <p className="text-green-800 font-bold text-base mb-6 break-all">{email}</p>
        <Button onClick={() => onNavigate("verify")} className="w-full py-3 mb-3">Ya tengo el código →</Button>
        <button onClick={() => setSent(false)} className="text-green-700 text-sm font-bold hover:underline block mx-auto mb-4">¿Correo incorrecto? Cambiarlo</button>
        <button onClick={() => onNavigate("login")} className="flex items-center gap-1 text-gray-400 text-sm font-medium mx-auto hover:text-gray-600 transition-colors">
          <ArrowLeft /> Volver al inicio de sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#edf4ef] flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="mb-8"><Logo size="md" /></div>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 border border-green-50 animate-slide-up">
        <h2 className="text-xl font-bold text-green-900 mb-2 text-center">Recuperar contraseña</h2>
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto my-4"><MailIcon /></div>
        <p className="text-gray-500 text-[13px] text-center mb-6 leading-relaxed">
          Ingresa tu correo electrónico y te enviaremos un código de verificación para restablecer tu contraseña.
        </p>
        <div className="space-y-4">
          <Input 
            label="Correo electrónico" 
            placeholder="tucorreo@email.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            success={validateEmail(email) ? "Correo válido" : ""} 
          />
          <Button onClick={handleSend} className="w-full py-3.5" disabled={!validateEmail(email)}>Enviar código</Button>
        </div>
        <button onClick={() => onNavigate("login")} className="flex items-center gap-1 text-green-700 text-sm font-bold mt-6 mx-auto hover:underline">
          <ArrowLeft /> Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
};
export default Recover;