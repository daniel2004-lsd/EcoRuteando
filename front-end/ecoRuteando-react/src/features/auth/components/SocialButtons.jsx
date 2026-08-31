import { GoogleIcon, FacebookIcon, XIcon } from "../../../shared/components/Icons";

function SocialButtons({ label = "Continuar con" }) {
  return (
    <div className="mt-6">
      {/* Línea divisoria con texto central */}
      <div className="relative flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
          {label}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Contenedor de botones */}
      <div className="flex gap-3">
        <button 
          type="button" 
          className="flex-1 flex justify-center py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          title="Google"
        >
          <GoogleIcon />
        </button>

        <button 
          type="button" 
          className="flex-1 flex justify-center py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          title="Facebook"
        >
          <FacebookIcon />
        </button>

        <button 
          type="button" 
          className="flex-1 flex justify-center py-2.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
          title="X (Twitter)"
        >
          <XIcon />
        </button>
      </div>
    </div>
  );
}

export default SocialButtons;