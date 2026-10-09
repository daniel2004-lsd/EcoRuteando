function Button({ children, className = "", ...props }) {
  return (
    <button 
      className={`btn-primary px-4 py-2 rounded-xl text-white font-bold transition-all ${className} disabled:opacity-50`}
      {...props} 
    >
      {children}
    </button>
  );
}

export default Button;