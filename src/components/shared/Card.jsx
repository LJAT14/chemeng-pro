import React from 'react';

const Card = ({ children, className = '', hover = true, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl bg-slate-900/50 border border-slate-800/50 p-6 transition-all duration-300 ${hover ? 'hover:border-slate-700 hover:scale-[1.02] cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;