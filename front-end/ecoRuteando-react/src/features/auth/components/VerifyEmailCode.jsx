import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../../shared/components/Button";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    ShieldIcon
} from "../../../shared/components/Icons";
import { sendVerificationEmail, verifyEmail } from "../../../services/authService";

const VerifyEmailCode = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [error, setError] = useState("");
    const inputs = useRef([]);

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        setError("");
        const next = [...code];
        next[index] = value;
        setCode(next);

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKey = (event, index) => {
        if (
            event.key === "Backspace" &&
            !code[index] &&
            index > 0
        ) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (event) => {
        const pasted = event.clipboardData.getData("text").replace(/\D/g, "");

        if (!pasted) return;

        event.preventDefault();
        const next = [...code];

        for (let i = 0; i < 6; i++) {
            next[i] = pasted[i] || "";
        }

        setCode(next);
        inputs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleVerify = async () => {
        const otp = code.join("");

        if (otp.length !== 6) return;

        setVerifying(true);
        setError("");

        try {
            await verifyEmail(otp);

            toast.success(t("auth.verifyEmail.successToast", "¡Correo verificado! Ya puedes iniciar sesión"), {
                duration: 3000,
                style: {
                    background: "#065f46",
                    color: "#fff",
                    border: "1px solid #10b981"
                }
            });

            navigate("/login", { replace: true });
        } catch (err) {
            if (err.response?.status === 429) {
                setError(t("auth.verifyEmail.rateLimited", "Demasiadas solicitudes. Espera unos minutos e intenta de nuevo."));
            } else {
                const message =
                    err.response?.data?.detail ||
                    t("auth.verifyEmail.invalidCodeError", "Código inválido o expirado. Inténtalo de nuevo.");
                setError(message);
            }
            setCode(["", "", "", "", "", ""]);
            inputs.current[0]?.focus();
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            setResendMessage(t("auth.verifyEmail.noEmailError", "No hay un correo al cual reenviar. Regístrate de nuevo."));
            return;
        }

        setResending(true);
        setResendMessage("");

        try {
            await sendVerificationEmail(email);
            setResendMessage(t("auth.verifyEmail.codeResent", "Código reenviado. Revisa tu correo."));
        } catch (err) {
            if (err.response?.status === 429) {
                setResendMessage(t("auth.verifyEmail.rateLimitedResend", "Demasiadas solicitudes. Espera unos minutos e intenta de nuevo."));
            } else {
                setResendMessage(t("auth.verifyEmail.resendError", "No fue posible reenviar el código. Intenta nuevamente."));
            }
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">

            <div className="text-center mb-6">

                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 shadow-sm">
                    <ShieldIcon />
                </div>

                <h2 className="text-xl font-bold text-green-900 mb-2">
                    {t("auth.verifyEmail.title", "Verifica tu correo")}
                </h2>

                <p className="text-gray-500 text-sm">
                    {email ? (
                        <>{t("auth.verifyEmail.sentTo", "Enviamos un código de 6 dígitos a")} <strong>{email}</strong>. {t("auth.verifyEmail.enterToActivate", "Ingrésalo para activar tu cuenta.")}</>
                    ) : (
                        <>{t("auth.verifyEmail.subtitleNoEmail", "Introduce el código de 6 dígitos que enviamos a tu correo.")}</>
                    )}
                </p>

            </div>

            <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>

                {code.map((value, index) => (
                    <input
                        key={index}
                        ref={(element) => {
                            inputs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={value}
                        onChange={(event) =>
                            handleChange(event.target.value, index)
                        }
                        onKeyDown={(event) =>
                            handleKey(event, index)
                        }
                        className="w-11 h-14 text-center text-xl font-bold bg-[#f9f6f0] border-2 border-transparent rounded-xl focus:border-green-600 focus:bg-white outline-none transition-all"
                    />
                ))}

            </div>

            {error && (
                <p className="text-center text-xs mb-4 text-red-600 font-medium">
                    {error}
                </p>
            )}

            <p className="text-center text-sm text-gray-500 mb-2">
                ¿No recibiste el código?{" "}
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-green-700 font-bold hover:underline disabled:opacity-50"
                >
                    {resending ? "Reenviando..." : "Reenviar"}
                </button>
            </p>

            {resendMessage && (
                <p className={`text-center text-xs mb-4 ${resendMessage.includes("reenviado") ? "text-green-600" : "text-red-600"}`}>
                    {resendMessage}
                </p>
            )}

            <Button
                onClick={handleVerify}
                className="w-full py-3.5 mb-4 shadow-md"
                disabled={code.includes("") || verifying}
            >
                {verifying ? "Verificando..." : "Verificar correo"}
            </Button>

            <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex items-center gap-1 text-green-700 text-sm font-bold mx-auto hover:underline"
            >
                <ArrowLeft />
                Volver al login
            </button>

        </div>
    );
};

export default VerifyEmailCode;
