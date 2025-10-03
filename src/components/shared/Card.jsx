// src/components/shared/Card.jsx
import React from 'react';

const Card = ({ children, className = '', hover = true, glow = false }) => {
  return (
    <div 
      className={`
        bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 
        border border-slate-800/50
        ${hover ? 'card-hover hover-glow cursor-pointer' : ''}
        ${glow ? 'pulse-glow' : ''}
        smooth-transition
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;