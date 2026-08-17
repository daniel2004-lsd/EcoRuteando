import { useState } from "react";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { Logo, MailIcon, ArrowLeft } from "../../../shared/components/Icons";
import { forgotPassword } from "../../../services/authService";

const Recover = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSend = async () => {
    if (!validateEmail(email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await forgotPassword(email.trim());
      sessionStorage.setItem(
        "passwordRecoveryEmail",
        email.trim()
      );

      // El backend ya generó y envió el OTP.
      setSent(true);
    } catch (error) {
      console.error("Error al solicitar recuperación:", error);

      setError(
        error.response?.data?.message ||
        "No fue posible enviar el código. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-md mx-auto text-center">

        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <MailIcon />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Revisa tu correo
          </h2>

          <p className="text-gray-600">
            Hemos enviado un código de verificación a:
          </p>

          <p className="font-bold text-gray-800 mt-2">
            {email}
          </p>
        </div>

        <Button
          onClick={() => onNavigate("verify")}
          className="w-full py-3 mb-3"
        >
          Ya tengo el código →
        </Button>

        <button
          onClick={() => setSent(false)}
          className="text-green-700 text-sm font-bold hover:underline block mx-auto mb-4"
        >
          ¿Correo incorrecto? Cambiarlo
        </button>

        <button
          onClick={() => onNavigate("login")}
          className="flex items-center gap-1 text-gray-400 text-sm font-medium mx-auto hover:text-gray-600 transition-colors"
        >
          <ArrowLeft />
          Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">

      <div className="flex justify-center mb-6">
        <Logo />
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Recuperar contraseña
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed">
          Ingresa tu correo electrónico y te enviaremos un código
          de verificación de 6 dígitos para restablecer tu contraseña.
        </p>
      </div>

      <Input
        label="Correo electrónico"
        placeholder="tucorreo@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        success={
          email.length > 0 && validateEmail(email)
            ? "Correo válido"
            : ""
        }
      />

      {error && (
        <p className="text-red-600 text-sm mt-2">
          {error}
        </p>
      )}

      <Button
        onClick={handleSend}
        disabled={loading || !validateEmail(email)}
        className="w-full py-3 mt-5"
      >
        {loading ? "Enviando código..." : "Enviar código"}
      </Button>

      <button
        onClick={() => onNavigate("login")}
        className="flex items-center gap-1 text-green-700 text-sm font-bold mt-6 mx-auto hover:underline"
      >
        <ArrowLeft />
        Volver al inicio de sesión
      </button>
    </div>
  );
};

export default Recover;

