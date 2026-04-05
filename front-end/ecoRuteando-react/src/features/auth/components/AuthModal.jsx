import { CloseIcon } from "../../../shared/components/Icons";
import Button from "../../../shared/components/Button"; // ✅ Ruta verificada

function AuthModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box animate-fade-in">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          <CloseIcon />
        </button>
        
        <h2 className="text-xl font-bold text-green-900 mb-4">{title}</h2>
        
        <div className="text-sm text-gray-600 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {children}
        </div>
        
        <Button onClick={onClose} className="w-full mt-6 py-3">
          Cerrar
        </Button>
      </div>
    </div>
  );
}

export default AuthModal;