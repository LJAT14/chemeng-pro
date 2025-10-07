// src/components/PageWrapper.jsx
import React from 'react';

const PageWrapper = ({ children, title, subtitle, maxWidth = '7xl' }) => {
  const widths = {
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl'
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className={`${widths[maxWidth]} mx-auto`}>
        {(title || subtitle) && (
          <div className="mb-6 sm:mb-8">
            {title && (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg text-gray-300">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;