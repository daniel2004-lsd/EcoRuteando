// ReporterProblem.js (nombre exacto del archivo)
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

  // Colores según el tema
  const getColors = () => {
    if (isDarkMode) {
      return {
        bgMain: "#0a1219",
        bgHeader: "#081018",
        bgCard: "#13212e",
        bgInput: "#1a2a3a",
        border: "#1e3a4d",
        textMain: "#b8e4c8",
        textSec: "#7acc8a",
        accent: "#3a8a5a",
        accentHover: "#4aaa6a",
        warning: "#c48a3a",
      };
    } else {
      return {
        bgMain: "#e8f0f8",
        bgHeader: "#1a4a6e",
        bgCard: "#ffffff",
        bgInput: "#f0f5fa",
        border: "#c8d8e8",
        textMain: "#1a3a4f",
        textSec: "#4a6a8a",
        accent: "#2a6b8f",
        accentHover: "#3a8aaa",
        warning: "#c48a3a",
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
    <div style={{ 
      minHeight: "100vh", 
      background: colors.bgMain, 
      fontFamily: "'Georgia', 'Palatino', serif", 
      transition: "all 0.3s ease" 
    }}>
      
      {/* Botón modo oscuro/claro */}
      <button
        onClick={toggleTheme}
        style={{
          position: "fixed", 
          bottom: 20, 
          right: 20, 
          zIndex: 50,
          width: 40, 
          height: 40, 
          borderRadius: "50%",
          background: colors.accent, 
          color: "#fff", 
          border: "none",
          cursor: "pointer", 
          fontSize: 16,
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          transition: "all 0.2s",
        }}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* HEADER */}
      <header style={{ background: colors.bgHeader, borderBottom: `2px solid ${colors.accent}` }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "18px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 48, 
                height: 48, 
                borderRadius: 12,
                background: `rgba(255,255,255,0.08)`, 
                border: `1px solid ${colors.accent}`,
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
              }}>
                <span style={{ fontSize: 24 }}>⚠️</span>
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                  Reportar Problema
                </h1>
                <p style={{ margin: 0, fontSize: 11, color: colors.accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Ayúdanos a mejorar las vías
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate("/dashboard")}
              style={{
                display: "flex", 
                alignItems: "center", 
                gap: 6,
                padding: "8px 16px", 
                borderRadius: 8,
                background: `rgba(255,255,255,0.08)`, 
                border: `1px solid ${colors.accent}`,
                color: "#fff", 
                fontSize: 12, 
                fontWeight: 600,
                cursor: "pointer", 
                fontFamily: "sans-serif",
                transition: "all 0.2s",
              }}
            >
              <ArrowLeft size={14} /> Volver
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "26px 28px 48px" }}>
        
        {/* Tarjeta del formulario */}
        <div style={{
          background: colors.bgCard,
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          overflow: "hidden",
          maxWidth: 700,
          margin: "0 auto",
        }}>
          {/* Encabezado de la tarjeta */}
          <div style={{
            background: colors.accent,
            padding: "16px 24px",
          }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
              <span>⚠️</span> Reportar incidente en la vía
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
              Tu reporte ayuda a mantener las vías seguras para todos
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
            {/* Tipo de Problema */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                color: colors.textSec,
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.06em"
              }}>
                🚧 Tipo de Problema
              </label>
              <select
                name="tipoProblema"
                value={formData.tipoProblema}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: 14,
                  borderRadius: 10,
                  border: `1px solid ${colors.border}`,
                  background: colors.bgInput,
                  color: colors.textMain,
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "inherit"
                }}
              >
                {tiposProblema.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                color: colors.textSec,
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.06em"
              }}>
                📝 Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe el problema con detalle (ubicación, magnitud, sugerencias)..."
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: 14,
                  borderRadius: 10,
                  border: `1px solid ${colors.border}`,
                  background: colors.bgInput,
                  color: colors.textMain,
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit"
                }}
              />
            </div>

            {/* Botón Enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 10,
                border: "none",
                background: isSubmitting ? colors.textSec : colors.accent,
                color: "#fff",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
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
            <div style={{
              marginTop: 20,
              padding: "12px 16px",
              background: isDarkMode ? "rgba(58,138,90,0.1)" : "rgba(42,107,143,0.08)",
              borderRadius: 10,
              borderLeft: `4px solid ${colors.warning}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 12,
              color: colors.textSec
            }}>
              <span>🕒</span>
              <span>Tu reporte será revisado por nuestro equipo antes de ser publicado.</span>
            </div>
          </form>
        </div>

        {/* Frase motivacional */}
        <div style={{ 
          marginTop: 40, 
          textAlign: "center", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: 8, 
          opacity: 0.55 
        }}>
          <LeafIcon size={12} style={{ color: colors.accent }} />
          <p style={{ margin: 0, fontSize: 11, color: colors.textSec }}>
            Reportar problemas ayuda a construir una mejor movilidad para todos
          </p>
          <LeafIcon size={12} style={{ color: colors.accent }} />
        </div>
      </div>
    </div>
  );
};

export default ReporterProblem;