import React, { useEffect, useState } from "react";
import { LeafIcon } from "./Icons";

const LoadingOverlay = ({ message = "Cargando..." }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex flex-col items-center justify-center">
      {/* Círculos decorativos animados */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-48 -translate-y-48 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48 animate-pulse-slow animation-delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-slow animation-delay-2000" />
      
      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Logo con animación principal */}
      <div className="relative z-10 text-center">
        <div className="relative">
          {/* Círculo externo pulsante */}
          <div className="absolute inset-0 w-32 h-32 mx-auto bg-white/10 rounded-full animate-ping-slow" />
          <div className="absolute inset-0 w-32 h-32 mx-auto bg-white/20 rounded-full animate-pulse-ring" />
          
          {/* Logo */}
          <div className="relative w-32 h-32 mx-auto mb-6 bg-white rounded-3xl flex items-center justify-center shadow-2xl animate-float-bounce">
            <LeafIcon size={60} className="text-emerald-600 animate-spin-slow" />
          </div>
        </div>
        
        {/* Texto de carga con puntos animados */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="flex gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce-dot" style={{ animationDelay: "0s" }} />
            <div className="w-3 h-3 bg-white rounded-full animate-bounce-dot" style={{ animationDelay: "0.15s" }} />
            <div className="w-3 h-3 bg-white rounded-full animate-bounce-dot" style={{ animationDelay: "0.3s" }} />
            <div className="w-3 h-3 bg-white rounded-full animate-bounce-dot" style={{ animationDelay: "0.45s" }} />
          </div>
          
          <p className="text-white font-medium text-base tracking-wide">
            {message}
            <span className="inline-block w-6 text-left">{dots}</span>
          </p>
          
          <p className="text-emerald-200 text-xs mt-4 animate-pulse">
            🌿 EcoRuteando - Movilidad sostenible 🌿
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float-bounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes ping-slow {
          0% { transform: scale(0.8); opacity: 0.8; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.2; }
          100% { transform: scale(0.9); opacity: 0.5; }
        }
        @keyframes float-particle {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        .animate-float-bounce { animation: float-bounce 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-bounce-dot { animation: bounce-dot 1.2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 4s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;