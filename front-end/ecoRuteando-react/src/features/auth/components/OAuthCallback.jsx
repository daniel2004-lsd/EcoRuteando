import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithOAuth } = useAuth();
    const [error, setError] = useState("");

    useEffect(() => {
        const handleCallback = async () => {
            // El flujo implícito devuelve los datos en el fragmento (#access_token=...)
            const hashParams = new URLSearchParams(
                window.location.hash.substring(1)
            );

            const accessToken =
                hashParams.get("access_token") || searchParams.get("access_token");
            const errorParam =
                searchParams.get("error") || hashParams.get("error");

            if (errorParam) {
                setError("El inicio de sesión fue cancelado.");
                setTimeout(() => navigate("/login", { replace: true }), 3000);
                return;
            }

            if (!accessToken) {
                setError("No se recibió el token del proveedor.");
                setTimeout(() => navigate("/login", { replace: true }), 3000);
                return;
            }

            // El proveedor viaja en el parámetro state que enviamos al redirigir
            const state =
                searchParams.get("state") || hashParams.get("state") || "";
            const provider = state.includes("facebook") ? "facebook" : "google";

            try {
                await loginWithOAuth(provider, accessToken);
                navigate("/dashboard", { replace: true });
            } catch (err) {
                if (err.response?.status === 429) {
                    setError("Demasiadas solicitudes. Espera unos minutos e intenta de nuevo.");
                } else {
                    setError(
                        err.response?.data?.message ||
                            "Error al iniciar sesión con OAuth."
                    );
                }
                setTimeout(() => navigate("/login", { replace: true }), 4000);
            }
        };

        handleCallback();
    }, [searchParams, navigate, loginWithOAuth]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
            <div className="text-center">
                {error ? (
                    <div>
                        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-500 text-2xl">✕</span>
                        </div>
                        <p className="text-gray-600 text-sm">{error}</p>
                        <p className="text-gray-400 text-xs mt-2">
                            Redirigiendo al login...
                        </p>
                    </div>
                ) : (
                    <div>
                        <div className="w-12 h-12 mx-auto mb-4 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-600 text-sm">
                            Procesando inicio de sesión...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OAuthCallback;
