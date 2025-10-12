// src/context/ToastContext.jsx
import { createContext, useContext, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a fallback that uses console instead of throwing error
    return {
      showToast: (message, type = 'info') => {
        console.log(`[${type.toUpperCase()}] ${message}`);
      }
    };
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/50 shadow-green-500/20';
      case 'error':
        return 'bg-red-500/20 border-red-500/50 shadow-red-500/20';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50 shadow-yellow-500/20';
      case 'info':
      default:
        return 'bg-blue-500/20 border-blue-500/50 shadow-blue-500/20';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className={`${getColors(toast.type)} backdrop-blur-lg rounded-lg p-4 border shadow-lg pointer-events-auto animate-slide-in flex items-start gap-3 min-w-[300px]`}
            style={{
              animation: 'slideIn 0.3s ease-out forwards',
              animationDelay: `${index * 0.1}s`
            }}
          >
            {getIcon(toast.type)}
            <p className="text-white flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export default ToastProvider;