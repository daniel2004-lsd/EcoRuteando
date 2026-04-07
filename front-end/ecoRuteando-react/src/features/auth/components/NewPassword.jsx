import { useState } from "react";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { Logo, KeyIcon, CheckCircle } from "../../../shared/components/Icons";

const NewPassword = ({ onNavigate }) => {
  const [form, setForm] = useState({ pw: "", pw2: "" });
  const [showPw, setShowPw] = useState(false);
  const [success, setSuccess] = useState(false);

  // Lógica de fuerza de contraseña
  const pwStrength = form.pw.length === 0 ? 0 : form.pw.length < 6 ? 1 : form.pw.length < 10 ? 2 : (/[A-Z]/.test(form.pw) && /[0-9]/.test(form.pw)) ? 4 : 3;
  const strengthColors = ["bg-gray-200", "bg-red-400", "bg-yellow-400", "bg-green-500", "bg-emerald-600"];
  const strengthLabels = ["", "Muy débil", "Media", "Fuerte", "Muy fuerte"];
  const strengthClass = ["", "text-red-500", "text-yellow-600", "text-green-600", "text-emerald-600"];

  if (success) return (
    <div className="min-h-screen bg-[#edf4ef] flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="mb-8"><Logo size="md" /></div>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 text-center border border-green-50 animate-slide-up">
        <div className="flex justify-center mb-5"><CheckCircle /></div>
        <h2 className="text-xl font-bold text-green-900 mb-3">¡Contraseña actualizada!</h2>
        <p className="text-gray-500 text-sm mb-6 text-center leading-relaxed">Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <Button onClick={() => onNavigate("login")} className="w-full py-3.5">Iniciar sesión</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#edf4ef] flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="mb-8"><Logo size="md" /></div>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 border border-green-50 animate-slide-up">
        
        {/* Barra de progreso Paso 3 */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex flex-col items-center gap-1"><div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">✓</div><span className="text-[10px] font-bold text-green-700 uppercase">Correo</span></div>
          <div className="flex-1 h-[2px] bg-green-600 mx-2 mb-4" />
          <div className="flex flex-col items-center gap-1"><div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">✓</div><span className="text-[10px] font-bold text-green-700 uppercase">Código</span></div>
          <div className="flex-1 h-[2px] bg-green-100 mx-2 mb-4" />
          <div className="flex flex-col items-center gap-1"><div className="w-7 h-7 rounded-full bg-[#4a7c59] text-white flex items-center justify-center text-xs font-bold">3</div><span className="text-[10px] font-bold text-green-700 uppercase">Contraseña</span></div>
        </div>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 text-green-700 shadow-sm"><KeyIcon /></div>
          <h2 className="text-xl font-bold text-green-900 mb-2">Nueva contraseña</h2>
          <p className="text-gray-500 text-sm">Elige una contraseña segura para proteger tu cuenta.</p>
        </div>

        <div className="space-y-4">
          <div>
            <Input 
              label="Nueva contraseña" 
              placeholder="Mín. 8 caracteres"
              showToggle showPw={showPw} onToggle={() => setShowPw(!showPw)}
              value={form.pw} onChange={e => setForm({...form, pw: e.target.value})}
              hint="Usa mayúsculas y números"
            />
            {form.pw && (
              <div className="mt-2 animate-fade-in">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`strength-bar flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= pwStrength ? strengthColors[pwStrength] : "bg-gray-200"}`} />
                  ))}
                </div>
                <p className={`text-[10px] font-bold uppercase ${strengthClass[pwStrength]}`}>{strengthLabels[pwStrength]}</p>
              </div>
            )}
          </div>

          <Input 
            label="Confirmar nueva contraseña" 
            type="password" placeholder="Repite tu contraseña"
            value={form.pw2} onChange={e => setForm({...form, pw2: e.target.value})}
            error={form.pw2 && form.pw !== form.pw2 ? "Las contraseñas no coinciden" : ""}
            success={form.pw2 && form.pw === form.pw2 ? "Las contraseñas coinciden" : ""}
          />

          <Button onClick={() => setSuccess(true)} className="w-full py-3.5 mt-2 shadow-md" disabled={form.pw.length < 8 || form.pw !== form.pw2}>
            Restablecer contraseña
          </Button>
        </div>
      </div>
    </div>
  );
};
export default NewPassword;