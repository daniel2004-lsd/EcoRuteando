import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { GoogleIcon } from "../../../shared/components/Icons";
import { redirectToOAuth } from "../../../shared/oauthRedirect";

function SocialButtons({ label = "Continuar con" }) {
    const { loginWithOAuth } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        redirectToOAuth("google");
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

            <div className="flex">
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex justify-center py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all active:scale-95 items-center gap-2"
                    title="Google"
                >
                    <GoogleIcon />
                    <span className="text-xs font-medium text-gray-600">Google</span>
                </button>
            </div>
        </div>
    );
}

export default SocialButtons;
