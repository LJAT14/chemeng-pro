// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Briefcase, 
  Mic, 
  FileText, 
  Brain, 
  BookOpen, 
  Volume2, 
  History,
  Settings,
  Trophy,
  Menu,
  X,
  Library
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/library', label: 'Library', icon: Library },
    { path: '/interview', label: 'Interview', icon: Briefcase },
    { path: '/pronunciation', label: 'Pronunciation', icon: Mic },
    { path: '/writing', label: 'Writing', icon: FileText },
    { path: '/grammar', label: 'Grammar', icon: Brain },
    { path: '/reading', label: 'Reading', icon: BookOpen },
    { path: '/vocabulary', label: 'Vocabulary', icon: Volume2 },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/history', label: 'History', icon: History },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">Bacana English</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.slice(0, 8).map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isActive(link.path)
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side - Profile & Settings */}
          <div className="flex items-center gap-3">
            {/* Leaderboard Button (Desktop) */}
            <Link
              to="/leaderboard"
              className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/leaderboard')
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Trophy className="w-4 h-4" />
            </Link>

            {/* Settings Button */}
            <button
              onClick={() => navigate('/settings')}
              className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/settings')
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Profile Button */}
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile?.full_name?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <span className="text-white text-sm font-medium hidden md:block">
                {profile?.full_name?.split(' ')[0] || 'User'}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(link.path)
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
            
            {/* Settings in Mobile */}
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/settings')
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;