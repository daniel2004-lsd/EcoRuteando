// ReporterProblem.js
import React, { useState } from "react";
import { useTheme } from "../../../app/context/ThemeContext";
import { LeafIcon, ArrowLeft } from "../../../shared/components/Icons";

const ReporterProblem = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    tipoProblema: "Obstrucción en la vía",
    descripcion: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const tiposProblema = [
    "Obstrucción en la vía",
    "Bache / deterioro",
    "Falta de señalización",
    "Semáforo dañado",
    "Alcantarilla tapada",
    "Iluminación pública",
    "Otro"
  ];

  // Colores unificados con el estilo actual
  const getColors = () => {
    if (isDarkMode) {
      return {
        bgMain: "#111827",        // gray-900
        bgHeader: "#1f2937",      // gray-800
        bgCard: "#1f2937",        // gray-800
        bgInput: "#374151",       // gray-700
        border: "#374151",        // gray-700
        textMain: "#f9fafb",      // white
        textSec: "#9ca3af",       // gray-400
        accent: "#10b981",        // emerald-500
        accentHover: "#059669",   // emerald-600
        warning: "#f59e0b",       // amber-500
      };
    } else {
      return {
        bgMain: "#ecfdf5",        // emerald-50
        bgHeader: "#047857",      // emerald-700
        bgCard: "#ffffff",        // white
        bgInput: "#f9fafb",       // gray-50
        border: "#e5e7eb",        // gray-200
        textMain: "#111827",      // gray-900
        textSec: "#6b7280",       // gray-500
        accent: "#059669",        // emerald-600
        accentHover: "#047857",   // emerald-700
        warning: "#d97706",       // amber-600
      };
    }
  };

  const colors = getColors();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.descripcion.trim()) {
      alert("Por favor describe el problema con detalle.");
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log("Reporte enviado:", formData);
      setIsSubmitting(false);
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          tipoProblema: "Obstrucción en la vía",
          descripcion: ""
        });
      }, 2000);
    }, 1000);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>

      {/* Botón modo oscuro/claro */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* HEADER */}
      <header className={`relative ${isDarkMode ? 'bg-gray-800 border-b border-emerald-500/30' : 'bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700'} shadow-lg overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isDarkMode ? 'bg-gray-700 border border-emerald-500/30' : 'bg-white'}`}>
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Reportar Problema</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>Ayúdanos a mejorar las vías</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate("/dashboard")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft size={16} />
              Volver
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Tarjeta del formulario */}
        <div className={`rounded-2xl shadow-md border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          
          {/* Encabezado de la tarjeta */}
          <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              <span>⚠️</span> Reportar incidente en la vía
            </h2>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tu reporte ayuda a mantener las vías seguras para todos</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Tipo de Problema */}
            <div className="mb-5">
              <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                🚧 Tipo de Problema
              </label>
              <select
                name="tipoProblema"
                value={formData.tipoProblema}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none ${isDarkMode ? 'bg-gray-700 border border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-400'}`}
              >
                {tiposProblema.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div className="mb-5">
              <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                📝 Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe el problema con detalle (ubicación, magnitud, sugerencias)..."
                rows={5}
                className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none resize-vertical ${isDarkMode ? 'bg-gray-700 border border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-400'}`}
              />
            </div>

            {/* Botón Enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isSubmitting || submitted
                ? (isDarkMode ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-gray-400 text-white cursor-not-allowed')
                : (isDarkMode ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700')
              }`}
            >
              {isSubmitting ? (
                <>⏳ Enviando...</>
              ) : submitted ? (
                <>✓ ¡Reporte Enviado!</>
              ) : (
                <>📤 Enviar Reporte</>
              )}
            </button>

            {/* Aviso de revisión */}
            <div className={`mt-4 p-3 rounded-lg text-xs text-center flex items-center justify-center gap-2 ${isDarkMode ? 'bg-amber-900/30 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
              <span>🕒</span>
              <span>Tu reporte será revisado por nuestro equipo antes de ser publicado.</span>
            </div>
          </form>
        </div>

        {/* Frase motivacional */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            Reportar problemas ayuda a construir una mejor movilidad para todos
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReporterProblem;