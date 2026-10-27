import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../app/context/ThemeContext";
import { useAuth } from "../../../hooks/useAuth";

function Login() {
    const { t } = useTranslation();
    const { isDarkMode, toggleTheme } = useTheme();
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", pw: "" });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [retrySeconds, setRetrySeconds] = useState(0);

    // Si el usuario ya está autenticado y llega aquí por redirect interno,
    // se le permite ver el formulario para cambiar de cuenta.
    // El logout se hace desde el dashboard (botón "Cerrar sesión").

    useEffect(() => {
        if (retrySeconds <= 0) return;
        const id = setInterval(() => {
            setRetrySeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(id);
                    setError("");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [retrySeconds > 0]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
    };

    const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    const handleLogin = async () => {
        if (retrySeconds > 0) return;
        setError("");

        const email = form.email.trim().toLowerCase();
        const password = form.pw.trim();

        if (!email || !password) {
            setError(t("auth.login.errorRequired", "Completa todos los campos"));
            return;
        }
        if (!validateEmail(email)) {
            setError(t("auth.login.errorInvalidEmail", "Correo electrónico no válido"));
            return;
        }
        if (password.length < 8) {
            setError(t("auth.login.errorPasswordLength", "La contraseña debe tener al menos 8 caracteres"));
            return;
        }

        setLoading(true);
        try {
            const result = await loginUser(email, password);

            if (result.requiresTwoFactor) {
                sessionStorage.setItem("twoFactorToken", result.twoFactorToken);
                navigate("/verify-2fa");
                return;
            }

            if (result.requiresEmailVerification) {
                sessionStorage.setItem("pendingVerificationEmail", email);
                navigate("/verify-email");
                return;
            }

            navigate("/dashboard", { replace: true });
        } catch (err) {
            const data = err.response?.data;
            const retryAfterSeconds = Number(data?.retryAfterSeconds) || 0;
            const attemptsRemaining = data?.attemptsRemaining;

            if (err.response?.status === 429) {
                const retryAfter = parseInt(err.response?.headers?.["retry-after"], 10) || 900;
                setRetrySeconds(retryAfter);
                setError(t("auth.login.rateLimited", "Demasiados intentos. Espera {{time}} antes de intentar de nuevo.", { time: formatTime(retryAfter) }));
            } else if (retryAfterSeconds > 0) {
                setRetrySeconds(Math.ceil(retryAfterSeconds));
                setError(
                    data?.detail ||
                    t("auth.login.locked", "Cuenta bloqueada temporalmente. Intenta de nuevo al pasar el tiempo indicado.")
                );
            } else if (typeof attemptsRemaining === "number") {
                setError(
                    data?.detail ||
                    t("auth.login.errorInvalidCredentials", "Correo o contraseña incorrectos.")
                );
            } else {
                const message =
                    data?.detail ||
                    data?.message ||
                    t("auth.login.errorInvalidCredentials", "Correo o contraseña incorrectos.");
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

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



    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-[#0B1215] to-[#111C20]' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'} flex flex-col items-center justify-center px-4 py-6`}>

            <button
                onClick={toggleTheme}
                className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            >
                {isDarkMode ? '☀️' : "🌙"}
            </button>

            <button
                onClick={() => navigate("/")}
                className="absolute top-6 right-6 flex items-center gap-1.5 text-sm font-medium transition-all z-10 text-gray-500 hover:text-green-600"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                {t("auth.login.back", "Volver")}
            </button>

            <div className="text-center mb-6">
                <div className="flex justify-center mb-2">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 ${isDarkMode ? 'bg-[#162329] border border-[#26383D]' : 'bg-white'}`}>
                        <img src="/logo.png" alt={t("auth.login.logoAlt", "Logo")} className="w-10 h-10" />
                    </div>
                </div>
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-[#e2e8f0]' : 'text-emerald-700'}`}>EcoRuteando</h1>
                <p className={`text-[10px] mt-1 transition-colors duration-300 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>{t("auth.login.sustainableMobility", "Movilidad sostenible")}</p>
            </div>

            <div className="w-full max-w-sm mx-auto">
                <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#162329]/80 backdrop-blur-sm border border-[#26383D]' : 'bg-white border border-gray-100'}`}>

                    <div className="px-6 pt-5 pb-2 text-center">
                        <h2 className={`text-lg font-bold ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>{t("auth.login.title", "Iniciar sesión")}</h2>
                        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>{t("auth.login.welcomeBack", "Bienvenido de vuelta")}</p>
                    </div>

                    <div className="px-6 pb-6">
                        {error && (
                            <div className={`mb-3 p-2 rounded-lg text-xs text-center ${retrySeconds > 0 ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                                {error}
                                {retrySeconds > 0 && (
                                    <span className="block mt-1 font-mono font-bold text-sm">{formatTime(retrySeconds)}</span>
                                )}
                            </div>
                        )}

                        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
                            <div>
                                <label className={`block text-xs font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-[#34D399]' : 'text-gray-600'}`}>
                                    {t("auth.login.email", "Correo electrónico")}
                                </label>
                                <input
                                    type="email"
                                    placeholder={t("auth.login.emailPlaceholder", "tucorreo@email.com")}
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-all duration-300 ${
                                        isDarkMode
                                            ? 'bg-[#162329]/50 border-[#26383D] text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#34D399]'
                                            : 'border-gray-200 focus:border-emerald-400'
                                    }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-[#34D399]' : 'text-gray-600'}`}>
                                    {t("auth.login.password", "Contraseña")}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPw ? "text" : "password"}
                                        placeholder={t("auth.login.passwordPlaceholder", "Mínimo 8 caracteres")}
                                        value={form.pw}
                                        onChange={(e) => setForm({ ...form, pw: e.target.value })}
                                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-all duration-300 pr-9 ${
                                            isDarkMode
                                                ? 'bg-[#162329]/50 border-[#26383D] text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#34D399]'
                                                : 'border-gray-200 focus:border-emerald-400'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#94a3b8] hover:text-[#34D399]"
                                    >
                                        {showPw ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                <div className="text-right mt-1">
                                    <button type="button" onClick={() => navigate("/recover")} className={`text-[10px] hover:underline transition-colors ${isDarkMode ? 'text-[#34D399]' : 'text-emerald-500'}`}>
                                        {t("auth.login.forgotPassword", "¿Olvidaste tu contraseña?")}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || retrySeconds > 0}
                                className={`w-full py-2.5 mt-2 text-white font-medium text-sm rounded-lg transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isDarkMode
                                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500'
                                        : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                                }`}
                            >
                                {loading ? t("auth.login.loading", "Iniciando sesión...") : t("auth.login.submit", "Iniciar sesión")}
                            </button>

                        </form>

                        <div className="text-center mt-5 pt-3 border-t border-gray-100">
                            <p className={`text-xs ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>
                                {t("auth.login.noAccount", "¿No tienes cuenta?")}{" "}
                                <button onClick={() => navigate("/register")} className={`font-medium text-xs hover:underline transition-colors ${isDarkMode ? 'text-[#34D399]' : 'text-emerald-600'}`}>
                                    {t("auth.login.registerHere", "Regístrate aquí")}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 text-center">
                <p className={`text-[10px] flex items-center justify-center gap-1 transition-colors duration-300 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>
                    {t("auth.login.tagline", "Cada viaje sostenible comienza con un paso")}
                </p>
            </div>
        </div>
    );
}

export default Login;
