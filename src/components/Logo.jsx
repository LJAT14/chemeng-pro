 import { useState } from 'react';
import { BookOpen } from 'lucide-react';

export default function Logo({ size = 'md' }) {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const fallbackSizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
    xl: 'w-16 h-16 text-3xl'
  };

  // If your logo loads successfully, show it
  if (!imageError) {
    return (
      <img 
        src="/logo.svg" 
        alt="Bacana English Logo" 
        className={`${sizes[size]} object-contain`}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback if logo doesn't load
  return (
    <div className={`${fallbackSizes[size]} bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg relative`}>
      <BookOpen className="w-1/2 h-1/2 text-white" />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">B</span>
      </div>
    </div>
  );
}

// Alternative text-based logo (if you want to use text instead)
export function TextLogo({ size = 'md' }) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`${sizes[size]} font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
      Bacana
    </div>
  );
}