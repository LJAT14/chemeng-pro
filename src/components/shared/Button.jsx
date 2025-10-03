import React from 'react';

const Button = ({ children, variant = 'primary', onClick, className = '', disabled = false }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-xl hover:scale-105',
    secondary: 'bg-slate-800 hover:bg-slate-700 border border-slate-700',
    outline: 'border border-purple-500 text-purple-400 hover:bg-purple-500/10'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;