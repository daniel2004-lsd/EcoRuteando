import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../api/api";

function TwoFactorVerify() {
    const navigate = useNavigate();
    const { saveTokens } = useAuth();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setError("");

        if (code.length !== 6) {
            setError("El código debe tener 6 dígitos");
            return;
        }

        setLoading(true);
        try {
            const twoFactorToken = sessionStorage.getItem("twoFactorToken");

            // Send 2FA code with the temporary twoFactorToken
            const response = await api.post("/auth/2fa/verify", { code }, {
                headers: { Authorization: `Bearer ${twoFactorToken}` }
            });

            if (response.data.accessToken) {
                saveTokens(response.data.accessToken, response.data.refreshToken);
                sessionStorage.removeItem("twoFactorToken");
                navigate("/dashboard", { replace: true });
            }
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.title ||
                "Código inválido.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 bg-emerald-100 rounded-2xl flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800">Verificación en dos pasos</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Ingresa el código de 6 dígitos de tu aplicación de autenticación
                    </p>

                    {error && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
                            {error}
                        </div>
                    )}

                    <input
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000"
                        className="mt-4 w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 transition-all"
                        autoFocus
                    />

                    <button
                        onClick={handleVerify}
                        disabled={loading || code.length !== 6}
                        className="w-full mt-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium text-sm rounded-lg transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verificando..." : "Verificar"}
                    </button>

                    <button
                        onClick={() => navigate("/login")}
                        className="mt-3 text-xs text-gray-400 hover:text-emerald-500 transition-colors"
                    >
                        Volver al login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TwoFactorVerify;
