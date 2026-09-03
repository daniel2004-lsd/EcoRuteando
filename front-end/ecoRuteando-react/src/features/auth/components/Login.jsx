import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../app/context/ThemeContext";
import { useAuth } from "../../../hooks/useAuth";
import { redirectToOAuth } from "../../../shared/oauthRedirect";

function Login() {
    const { t } = useTranslation();
    const { isDarkMode, toggleTheme } = useTheme();
    const { loginUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", pw: "" });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [retrySeconds, setRetrySeconds] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

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

  const handleGoogleLogin = () => redirectToOAuth("google");

  const handleFacebookLogin = () => redirectToOAuth("facebook");

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

    const GoogleIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );

    const FacebookIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-green-950 to-emerald-950' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'} flex flex-col items-center justify-center px-4 py-6`}>

            <button
                onClick={toggleTheme}
                className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            >
                {isDarkMode ? "☀️" : "🌙"}
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
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border border-green-500/30' : 'bg-white'}`}>
                        <img src="/logo.png" alt={t("auth.login.logoAlt", "Logo")} className="w-10 h-10" />
                    </div>
                </div>
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-emerald-700'}`}>EcoRuteando</h1>
                <p className={`text-[10px] mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t("auth.login.sustainableMobility", "Movilidad sostenible")}</p>
            </div>

            <div className="w-full max-w-sm mx-auto">
                <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm border border-green-500/20' : 'bg-white border border-gray-100'}`}>

                    <div className="px-6 pt-5 pb-2 text-center">
                        <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t("auth.login.title", "Iniciar sesión")}</h2>
                        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t("auth.login.welcomeBack", "Bienvenido de vuelta")}</p>
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

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-xs font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`}>
                                    {t("auth.login.email", "Correo electrónico")}
                                </label>
                                <input
                                    type="email"
                                    placeholder={t("auth.login.emailPlaceholder", "tucorreo@email.com")}
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none transition-all duration-300 ${
                                        isDarkMode
                                            ? 'bg-gray-700/50 border-green-500/30 text-white placeholder-gray-400 focus:border-green-500'
                                            : 'border-gray-200 focus:border-emerald-400'
                                    }`}
                                />
                            </div>

                            <div>
                                <label className={`block text-xs font-medium mb-1 transition-colors duration-300 ${isDarkMode ? 'text-green-400' : 'text-gray-600'}`}>
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
                                                ? 'bg-gray-700/50 border-green-500/30 text-white placeholder-gray-400 focus:border-green-500'
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
                                <div className="text-right mt-1">
                                    <button onClick={() => navigate("/recover")} className={`text-[10px] hover:underline transition-colors ${isDarkMode ? 'text-green-400' : 'text-emerald-500'}`}>
                                        {t("auth.login.forgotPassword", "¿Olvidaste tu contraseña?")}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={loading || retrySeconds > 0}
                                className={`w-full py-2.5 mt-2 text-white font-medium text-sm rounded-lg transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isDarkMode
                                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500'
                                        : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                                }`}
                            >
                                {loading ? t("auth.login.loading", "Iniciando sesión...") : t("auth.login.submit", "Iniciar sesión")}
                            </button>

                            <div className="relative flex items-center gap-2 my-4">
                                <div className={`flex-1 h-px ${isDarkMode ? 'bg-green-500/20' : 'bg-gray-200'}`} />
                                <span className={`text-[10px] font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t("auth.login.orContinueWith", "O continúa con")}</span>
                                <div className={`flex-1 h-px ${isDarkMode ? 'bg-green-500/20' : 'bg-gray-200'}`} />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={retrySeconds > 0}
                                    className={`flex-1 border rounded-lg py-2 flex justify-center items-center gap-1.5 transition-all duration-300 ${retrySeconds > 0 ? 'opacity-50 cursor-not-allowed ' : ''}${isDarkMode
                                        ? 'border-green-500/30 hover:border-green-500 hover:bg-green-500/10'
                                        : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                                    }`}
                                >
                                    <GoogleIcon />
                                    <span className={`text-[10px] font-medium transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Google</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleFacebookLogin}
                                    disabled={retrySeconds > 0}
                                    className={`flex-1 border rounded-lg py-2 flex justify-center items-center gap-1.5 transition-all duration-300 ${retrySeconds > 0 ? 'opacity-50 cursor-not-allowed ' : ''}${isDarkMode
                                        ? 'border-green-500/30 hover:border-green-500 hover:bg-green-500/10'
                                        : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                                    }`}
                                >
                                    <FacebookIcon />
                                    <span className={`text-[10px] font-medium transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Facebook</span>
                                </button>
                            </div>
                        </div>

                        <div className="text-center mt-5 pt-3 border-t border-gray-100">
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {t("auth.login.noAccount", "¿No tienes cuenta?")}{" "}
                                <button onClick={() => navigate("/register")} className={`font-medium text-xs hover:underline transition-colors ${isDarkMode ? 'text-green-400' : 'text-emerald-600'}`}>
                                    {t("auth.login.registerHere", "Regístrate aquí")}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 text-center">
                <p className={`text-[10px] flex items-center justify-center gap-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {t("auth.login.tagline", "Cada viaje sostenible comienza con un paso")}
                </p>
            </div>
        </div>
    );
}

export default Login;
