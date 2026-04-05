import React from 'react';
import { EyeIcon } from "./Icons";

function Input({ label, error, success, showToggle, onToggle, showPw, ...props }) {
  return (
    <div className="w-full text-left">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        <input
          {...props}
          type={showToggle ? (showPw ? "text" : "password") : props.type || "text"}
          className={`w-full px-4 py-3 rounded-xl border-2 input-eco text-sm outline-none transition-all
            ${error ? "input-error" : success ? "input-ok" : "border-transparent"}`}
        />
        {showToggle && (
          <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50">
            <EyeIcon open={showPw} />
          </button>
        )}
      </div>
      {error && <p className="text-[#dc2626] text-[10px] font-bold mt-1">⚠ {error}</p>}
    </div>
  );
}
export const Logo = ({ size = "md" }) => {
  const sz = size === "sm" ? "w-9 h-9" : size === "lg" ? "w-16 h-16" : "w-12 h-12";
  return (
    <div className="flex flex-col items-center gap-1 mb-6">
      {/* Esta es la sombra animada que mencionaste */}
      <div className={`${sz} bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse-green border border-green-100 p-2`}>
        <LeafIcon size={size === "lg" ? 32 : size === "sm" ? 18 : 24} blend="multiply" />
      </div>
      <h1 className="text-2xl font-bold text-green-900 tracking-tight" style={{fontFamily: "'Playfair Display', serif"}}>EcoRuteando</h1>
      <p className="text-xs text-green-700 font-medium">Movilidad sostenible para tu ciudad</p>
    </div>
  );
};
export default Input;