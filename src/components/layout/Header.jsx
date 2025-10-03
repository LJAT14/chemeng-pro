import React from 'react';
import { Beaker, Menu } from 'lucide-react';

const Header = ({ onMenuToggle }) => {
  return (
    <header className="border-b border-slate-800/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-75"></div>
              <div className="relative bg-slate-900 p-2 rounded-lg">
                <Beaker className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                ChemEng Pro
              </h1>
              <p className="text-xs text-slate-400">Advanced Learning Platform</p>
            </div>
          </div>
          
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;