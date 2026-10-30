import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../app/context/ThemeContext";
import { register } from "../../../services/authService";
import toast from "react-hot-toast";

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);



const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.252 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);


function Register({ onShowTerms, termsAccepted, setTermsAccepted }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pw: "",
    confirmPw: ""
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);


  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const passwordChecks = [
    { label: "Mínimo 8 caracteres", ok: form.pw.length >= 8 },
    { label: "Al menos una mayúscula", ok: /[A-Z]/.test(form.pw) },
    { label: "Al menos un número", ok: /\d/.test(form.pw) },
    { label: "Al menos un carácter especial", ok: /[^A-Za-z0-9]/.test(form.pw) }
  ];

  const isFormValid = () => {
    return (
      form.firstName.trim() !== "" &&
      form.lastName.trim() !== "" &&
      validateEmail(form.email) &&
      passwordChecks.every((check) => check.ok) &&
      form.pw === form.confirmPw &&
      termsAccepted
    );
  };

  const handleRegister = async () => {
  console.log("Entró a handleRegister");
  setRegistrationError(null);

  if (!isFormValid()) {
    toast.error("Por favor, completa todos los campos correctamente");
    return;
  }

  try {
    await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.pw
    });

    toast.success(t("auth.register.successMessage", "¡Registro exitoso! Te enviamos un código a tu correo"), {
      duration: 2500,
      style: {
        background: "#065f46",
        color: "#fff",
        border: "1px solid #10b981"
      }
    });

    setTimeout(() => {
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    }, 1500);

  } catch (error) {
    console.error(error);

    if (error.response?.status === 429) {
      toast.error("Demasiadas solicitudes. Espera unos minutos e intenta de nuevo.", {
        duration: 6000,
        style: {
          background: "#78350f",
          color: "#fef3c7",
          border: "1px solid #f59e0b"
        }
      });
    } else if (error.response?.status === 409) {
      setRegistrationError(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "El correo electrónico ya está registrado."
      );
    } else {
      toast.error(t("auth.register.errorMessage", "No fue posible registrar el usuario"));
    }
  }
};

  const goToLogin = () => {
    window.location.href = "/login";
  };

  const goToHome = () => {
    window.location.href = "/";
  };


  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-[#0B1215] to-[#111C20]' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'} flex flex-col items-center justify-center px-4 py-6`}>

      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isDarkMode ? '☀️' : "🌙"}
      </button>

      <button
        onClick={goToHome}
        className="absolute top-6 right-6 flex items-center gap-1.5 text-sm font-medium transition-all z-10 text-gray-500 hover:text-green-600"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Volver
      </button>

      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-3 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-[#162329] border border-[#26383D]' : 'bg-white border border-emerald-100 shadow-emerald-600/10'}`}>
            <img src="/logo.png" alt="EcoRuteando" className="w-full h-full object-contain block" />
          </div>
        </div>
        <h1 className={`text-3xl font-extrabold tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-[#e2e8f0]' : 'text-emerald-700'}`} style={{ fontFamily: "'Playfair Display', serif" }}>EcoRuteando</h1>
        <p className={`text-xs mt-1 font-medium transition-colors duration-300 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>{t("auth.register.sustainableMobility", "Movilidad sostenible para tu ciudad")}</p>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#162329]/80 backdrop-blur-sm border border-[#26383D]' : 'bg-white border border-gray-100'}`}>

          <div className="px-6 pt-5 pb-2 text-center">
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>{t("auth.register.title", "Crear cuenta")}</h2>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>{t("auth.register.subtitle", "Comienza tu viaje sostenible")}</p>
          </div>

          <div className="px-6 pb-6">
            <div className="space-y-4">

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-green-400' : "text-gray-600"
                      }`}
                  >
                    {t("auth.register.firstName", "Nombre")}
                  </label>

                  <input
                    type="text"
                    placeholder={t("auth.register.firstNamePlaceholder", "Tu nombre")}
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        firstName: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-all duration-300 ${isDarkMode
                        ? "bg-gray-700/50 border-green-500/30 text-white placeholder-gray-400 focus:border-green-500"
                        : "border-gray-200 focus:border-emerald-400"
                      }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-green-400' : "text-gray-600"
                      }`}
                  >
                    {t("auth.register.lastName", "Apellido")}
                  </label>

                  <input
                    type="text"
                    placeholder="Salazar"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        lastName: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-all duration-300 ${isDarkMode
                        ? "bg-gray-700/50 border-green-500/30 text-white placeholder-gray-400 focus:border-green-500"
                        : "border-gray-200 focus:border-emerald-400"
                      }`}
                  />
                </div>

              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-[#34D399]' : 'text-gray-600'}`}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="tucorreo@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-all duration-300 ${isDarkMode
                    ? 'bg-[#162329]/50 border-[#26383D] text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#34D399]'
                    : 'border-gray-200 focus:border-emerald-400'
                    }`}
                />
                {form.email && validateEmail(form.email) && (
                  <p className="text-emerald-500 text-[10px] mt-1">Correo válido</p>
                )}
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-[#34D399]' : 'text-gray-600'}`}>
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={form.pw}
                    onChange={(e) => setForm({ ...form, pw: e.target.value })}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-all duration-300 pr-9 ${isDarkMode
                      ? 'bg-[#162329]/50 border-[#26383D] text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#34D399]'
                      : 'border-gray-200 focus:border-emerald-400'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500"
                  >
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {form.pw.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {passwordChecks.map((check, i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-1.5 text-[10px] transition-colors duration-200 ${
                          check.ok
                            ? "text-emerald-500"
                            : isDarkMode ? 'text-[#94a3b8]' : "text-gray-400"
                        }`}
                      >
                        <span>{check.ok ? "✓" : "○"}</span>
                        {check.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-[#34D399]' : 'text-gray-600'}`}>
                  {t("auth.register.confirmPassword", "Confirmar contraseña")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    placeholder={t("auth.register.confirmPasswordPlaceholder", "Repite tu contraseña")}
                    value={form.confirmPw}
                    onChange={(e) => setForm({ ...form, confirmPw: e.target.value })}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-all duration-300 pr-9 ${isDarkMode
                      ? 'bg-[#162329]/50 border-[#26383D] text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#34D399]'
                      : 'border-gray-200 focus:border-emerald-400'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500"
                  >
                    {showConfirmPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {form.confirmPw && form.pw === form.confirmPw && (
                  <p className="text-emerald-500 text-[10px] mt-1">Las contraseñas coinciden</p>
                )}
                {form.confirmPw && form.pw !== form.confirmPw && (
                  <p className="text-red-500 text-[10px] mt-1">Las contraseñas no coinciden</p>
                )}
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className={`w-4 h-4 rounded focus:ring-2 transition-colors ${isDarkMode ? 'text-emerald-600 focus:ring-emerald-500 bg-[#162329] border-gray-600' : 'text-emerald-600 focus:ring-emerald-500 border-gray-300'}`}
                />
                <label className={`text-xs transition-colors ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                  Acepto los{" "}
                  <button type="button" onClick={onShowTerms} className={`font-medium hover:underline transition-colors ${isDarkMode ? 'text-[#34D399]' : 'text-emerald-600'}`}>
                    Términos y Condiciones
                  </button>
                </label>
              </div>

              {registrationError && (
                <div className={`p-3 rounded-lg border text-center ${isDarkMode ? 'bg-amber-500/10 border-amber-500/40' : 'bg-amber-50 border-amber-200'}`}>
                  <p className={`text-xs ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>{registrationError}</p>
                  <button
                    type="button"
                    onClick={goToLogin}
                    className={`mt-1 text-xs font-semibold hover:underline transition-colors ${isDarkMode ? 'text-[#34D399]' : 'text-emerald-600'}`}
                  >
                    ¿Ya tienes cuenta? Inicia sesión aquí
                  </button>
                </div>
              )}

              <button
                onClick={handleRegister}
                disabled={!isFormValid()}
                className={`w-full py-2.5 mt-2 text-white font-medium text-sm rounded-lg transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500'
                  : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                  }`}
              >
                Registrarse
              </button>

            </div>

            <div className="text-center mt-5 pt-3 border-t border-gray-100 dark:border-green-500/20">
              <p className={`text-xs ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>
                ¿Ya tienes cuenta?{" "}
                <button onClick={goToLogin} className={`font-medium text-xs hover:underline transition-colors ${isDarkMode ? 'text-[#34D399]' : 'text-emerald-600'}`}>
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className={`text-[10px] flex items-center justify-center gap-1 transition-colors duration-300 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>
          Únete a la comunidad que cuida el planeta
        </p>
      </div>
    </div>
  );
}

export default Register;