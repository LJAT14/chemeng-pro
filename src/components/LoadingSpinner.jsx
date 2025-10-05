// src/components/LoadingSpinner.jsx
import React from 'react';

export const LoadingSpinner = ({ size = 'md', color = 'purple' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const colors = {
    purple: 'border-purple-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    blue: 'border-blue-500 border-t-transparent',
    pink: 'border-pink-500 border-t-transparent'
  };

  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} />
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-8 border border-white/20 flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" />
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export const LoadingCard = () => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 animate-pulse">
      <div className="h-6 bg-white/20 rounded w-3/4 mb-4" />
      <div className="h-4 bg-white/20 rounded w-full mb-2" />
      <div className="h-4 bg-white/20 rounded w-5/6" />
    </div>
  );
};

export const LoadingPage = ({ message = 'Loading page...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="text-white text-xl font-medium mt-6">{message}</p>
      </div>
    </div>
  );
};

export const ButtonLoading = ({ loading, children, ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" color="white" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingSpinner;