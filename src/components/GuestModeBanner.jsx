import { useNavigate } from 'react-router-dom';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function GuestModeBanner() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const isGuest = localStorage.getItem('guestMode') === 'true';

  if (!isGuest || !isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-yellow-500/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">
                You're browsing as a guest
              </p>
              <p className="text-slate-300 text-xs mt-1">
                Create an account to save your progress and unlock all features
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                localStorage.removeItem('guestMode');
                localStorage.removeItem('guestUser');
                navigate('/login');
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Sign Up
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}