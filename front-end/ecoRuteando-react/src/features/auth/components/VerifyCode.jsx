import { useState, useRef } from "react";
import Button from "../../../shared/components/Button";
import {
    Logo,
    ArrowLeft,
    ShieldIcon
} from "../../../shared/components/Icons";

const VerifyCode = ({ onNavigate, onCodeVerified }) => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputs = useRef([]);

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

        onNavigate("newpassword");
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
                        Correo
                    </span>
                </div>

                <div className="flex-1 h-[2px] bg-green-100 mx-2 mb-4" />

                <div className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full bg-[#4a7c59] text-white flex items-center justify-center text-xs font-bold">
                        2
                    </div>

                    <span className="text-[10px] font-bold text-green-700 uppercase">
                        Código
                    </span>
                </div>

                <div className="flex-1 h-[2px] bg-gray-100 mx-2 mb-4" />

                <div className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold">
                        3
                    </div>

                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                        Contraseña
                    </span>
                </div>

            </div>

            {/* Encabezado */}
            <div className="text-center mb-6">

                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-700 shadow-sm">
                    <ShieldIcon />
                </div>

                <h2 className="text-xl font-bold text-green-900 mb-2">
                    Verificar código
                </h2>

                <p className="text-gray-500 text-sm">
                    Introduce el código de 6 dígitos que recibiste en tu correo.
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

            <p className="text-center text-sm text-gray-500 mb-6">
                ¿No recibiste el código?{" "}
                <button
                    type="button"
                    className="text-green-700 font-bold hover:underline"
                >
                    Reenviar
                </button>
            </p>

            <Button
                onClick={handleVerify}
                className="w-full py-3.5 mb-4 shadow-md"
                disabled={code.includes("")}
            >
                Verificar código
            </Button>

            <button
                type="button"
                onClick={() => onNavigate("recover")}
                className="flex items-center gap-1 text-green-700 text-sm font-bold mx-auto hover:underline"
            >
                <ArrowLeft />
                Volver
            </button>

        </div>
    );
};

export default VerifyCode;

