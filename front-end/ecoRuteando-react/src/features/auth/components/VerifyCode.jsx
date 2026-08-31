import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../../../shared/components/Button";
import {
    Logo,
    ArrowLeft,
    ShieldIcon
} from "../../../shared/components/Icons";
import { forgotPassword } from "../../../services/authService";

const VerifyCode = ({ onCodeVerified }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [resendMessage, setResendMessage] = useState("");
    const [resending, setResending] = useState(false);
    const inputs = useRef([]);

    const handleResend = async () => {
        const email = sessionStorage.getItem("passwordRecoveryEmail");

        if (!email) {
            setResendMessage(t("auth.verifyCode.noEmailError", "No hay un correo guardado. Vuelve a solicitar el código."));
            return;
        }

        setResending(true);
        setResendMessage("");

        try {
            await forgotPassword(email);
            setResendMessage(t("auth.verifyCode.codeResent", "Código reenviado. Revisa tu correo."));
        } catch (err) {
            if (err.response?.status === 429) {
                setResendMessage(t("auth.verifyCode.rateLimited", "Demasiadas solicitudes. Espera unos minutos e intenta de nuevo."));
            } else {
                setResendMessage(t("auth.verifyCode.resendError", "No fue posible reenviar el código. Intenta nuevamente."));
            }
        } finally {
            setResending(false);
        }
    };

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

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

    const handleVerify = () => {
        const otp = code.join("");

        if (otp.length !== 6) {
            return;
        }

        // Guardamos el OTP para utilizarlo en NewPassword
        if (onCodeVerified) {
            onCodeVerified(otp);
        }

        navigate("/newpassword");
    };

    return (
        <div className="w-full max-w-md mx-auto">

            {/* Barra de progreso */}
            <div className="flex items-center justify-between mb-8 px-2">

                <div className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                    </div>

                    <span className="text-[10px] font-bold text-green-700 uppercase">
                        {t("auth.verifyCode.stepEmail", "Correo")}
                    </span>
                </div>

                <div className="flex-1 h-[2px] bg-green-100 mx-2 mb-4" />

                <div className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full bg-[#4a7c59] text-white flex items-center justify-center text-xs font-bold">
                        2
                    </div>

                    <span className="text-[10px] font-bold text-green-700 uppercase">
                        {t("auth.verifyCode.stepCode", "Código")}
                    </span>
                </div>

                <div className="flex-1 h-[2px] bg-gray-100 mx-2 mb-4" />

                <div className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold">
                        3
                    </div>

                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {t("auth.verifyCode.stepPassword", "Contraseña")}
                    </span>
                </div>

            </div>

            {/* Encabezado */}
            <div className="text-center mb-6">

                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 shadow-sm">
                    <ShieldIcon />
                </div>

                <h2 className="text-xl font-bold text-green-900 mb-2">
                    {t("auth.verifyCode.title", "Verificar código")}
                </h2>

                <p className="text-gray-500 text-sm">
                    {t("auth.verifyCode.subtitle", "Introduce el código de 6 dígitos que recibiste en tu correo.")}
                </p>

            </div>

            {/* OTP */}
            <div className="flex gap-2 justify-center mb-4">

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

            <p className="text-center text-sm text-gray-500 mb-2">
                {t("auth.verifyCode.noCodeReceived", "¿No recibiste el código?")}{" "}
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-green-700 font-bold hover:underline disabled:opacity-50"
                >
                    {resending ? t("auth.verifyCode.resending", "Reenviando...") : t("auth.verifyCode.resend", "Reenviar")}
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
                disabled={code.includes("")}
            >
                {t("auth.verifyCode.verifyButton", "Verificar código")}
            </Button>

            <button
                type="button"
                onClick={() => navigate("/recover")}
                className="flex items-center gap-1 text-green-700 text-sm font-bold mx-auto hover:underline"
            >
                <ArrowLeft />
                {t("auth.verifyCode.back", "Volver")}
            </button>

        </div>
    );
};

export default VerifyCode;

