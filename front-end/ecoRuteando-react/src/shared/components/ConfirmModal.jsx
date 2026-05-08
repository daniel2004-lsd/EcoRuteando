import React from "react";
import { LeafIcon, CloseIcon } from "./Icons"; // ← Corregir importación

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar acción", 
  message = "¿Estás seguro de que deseas realizar esta acción?",
  confirmText = "Sí, continuar",
  cancelText = "Cancelar"
}) => {
  if (!isOpen) return null;

  // Prevenir scroll cuando el modal está abierto
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-md w-full animate-slide-up overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-5 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <LeafIcon size={20} white={true} />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <CloseIcon />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse-light">
              <LeafIcon size={28} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-gray-600 text-center leading-relaxed">{message}</p>
        </div>
        
        <div className="p-4 bg-emerald-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border-2 border-emerald-300 text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg"
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-light {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-pulse-light { animation: pulse-light 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ConfirmModal;