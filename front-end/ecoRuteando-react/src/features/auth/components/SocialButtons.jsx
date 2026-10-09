import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { GoogleIcon, FacebookIcon, XIcon } from "../../../shared/components/Icons";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

function SocialButtons({ label = "Continuar con" }) {
    const { loginWithOAuth } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        const redirectUri = `${window.location.origin}/auth/callback`;
        const scope = "openid email profile";
        const url = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;
        window.location.href = url;
    };

    const handleFacebookLogin = () => {
        const redirectUri = `${window.location.origin}/auth/callback`;
        const scope = "email";
        const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
        window.location.href = url;
    };

    return (
        <div className="mt-6">
            <div className="relative flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    {label}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex-1 flex justify-center py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                    title="Google"
                >
                    <GoogleIcon />
                </button>

                <button
                    type="button"
                    onClick={handleFacebookLogin}
                    className="flex-1 flex justify-center py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                    title="Facebook"
                >
                    <FacebookIcon />
                </button>

                <button
                    type="button"
                    disabled
                    className="flex-1 flex justify-center py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all active:scale-95 opacity-40 cursor-not-allowed"
                    title="X (Twitter) — Próximamente"
                >
                    <XIcon />
                </button>
            </div>
        </div>
    );
}

export default SocialButtons;
