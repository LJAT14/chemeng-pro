// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Menu, 
  X, 
  Briefcase, 
  Mic, 
  FileText, 
  BookOpen, 
  Target,
  Headphones,
  LogOut,
  User,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/interview', label: 'Interview', icon: Briefcase },
    { path: '/pronunciation', label: 'Pronunciation', icon: Mic },
    { path: '/writing', label: 'Writing', icon: FileText },
    { path: '/grammar', label: 'Grammar', icon: Target },
    { path: '/vocabulary', label: 'Vocabulary', icon: BookOpen },
    { path: '/reading', label: 'Reading', icon: Headphones },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900/95 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ChemEng Pro
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(link.path)
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-sm">Dashboard</span>
                </button>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white text-sm max-w-32 truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-300 hover:text-white"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-all"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.path}
                    onClick={() => {
                      navigate(link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(link.path)
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-white/10">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="font-medium">Dashboard</span>
                    </button>
                    <div className="px-4 py-3 text-gray-400 text-sm">
                      Logged in as: {user.email}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Login / Sign Up</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;