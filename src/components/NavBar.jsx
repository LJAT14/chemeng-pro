import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, Home, Library, MessageSquare, Mic, Trophy, User, LogOut, Gamepad2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isGuest, guestUser, signOut } = useAuth();
  const { showToast } = useToast();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    if (isLoggingOut) return; // Prevent double clicks
    
    setIsLoggingOut(true);
    
    try {
      console.log('🚪 Starting logout...');
      
      // Call signOut - it now ALWAYS succeeds
      await signOut();
      
      // Show success message
      showToast('Logged out successfully! 👋', 'success');
      
      // Clear any remaining data
      localStorage.clear();
      
      // Navigate to home
      navigate('/', { replace: true });
      
      // Force reload after a tiny delay
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      // This should never happen now, but just in case
      console.error('Unexpected logout error:', error);
      
      // Still clear everything and redirect
      localStorage.clear();
      showToast('Logged out', 'info');
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/library', label: 'Library', icon: Library },
    { path: '/chat', label: 'AI Tutor', icon: MessageSquare },
    { path: '/pronunciation', label: 'Pronunciation', icon: Mic },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  // Get display name
  const displayName = isGuest 
    ? (guestUser?.full_name || 'Guest')
    : (user?.full_name || user?.email?.split('@')[0] || 'User');

  return (
    <nav className="bg-slate-900/95 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section - Using public folder */}
          <Link to="/dashboard" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <img 
                src="/favicon.svg" 
                alt="Bacana English" 
                className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  // Fallback to text logo if image fails
                  console.log('Logo image failed to load');
                  e.target.style.display = 'none';
                  const fallback = e.target.nextElementSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* Fallback Text Logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg items-center justify-center hidden">
                <span className="text-white text-2xl font-bold">B</span>
              </div>
            </div>
            
            {/* Logo Text */}
            <div className="hidden sm:block">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Bacana
              </span>
              <span className="text-2xl font-bold text-white ml-1">
                English
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden lg:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isGuest ? (
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                {/* User Name Display */}
                <div className="text-right hidden lg:block">
                  <p className="text-white font-semibold">{displayName}</p>
                  <p className="text-slate-400 text-xs truncate max-w-[150px]">{user?.email}</p>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20"
                  >
                    <User className="w-5 h-5 text-purple-400" />
                  </button>

                  {showProfileMenu && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowProfileMenu(false)}
                      />
                      
                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl border border-white/20 py-2 z-50">
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-white font-semibold text-sm">{displayName}</p>
                          <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            handleSignOut();
                          }}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all disabled:opacity-50"
                        >
                          <LogOut className="w-4 h-4" />
                          {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Quick Logout Button */}
                <button
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xl:inline">
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-t border-white/10">
          <div className="px-4 py-4 space-y-2">
            {/* User Info - Mobile */}
            {!isGuest && user && (
              <div className="px-4 py-3 bg-white/5 rounded-lg mb-4">
                <p className="text-white font-semibold">{displayName}</p>
                <p className="text-slate-400 text-xs truncate">{user.email}</p>
              </div>
            )}

            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-white/10">
              {isGuest ? (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition-all"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all mt-2 disabled:opacity-50"
                  >
                    <LogOut className="w-5 h-5" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}