import React from 'react';
import { Home, BookOpen, MessageSquare, Mic, Briefcase, FlaskConical, PenTool, TrendingUp } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'grammar', label: 'Grammar', icon: BookOpen },
    { id: 'vocabulary', label: 'Vocabulary', icon: MessageSquare },
    { id: 'pronunciation', label: 'Pronunciation', icon: Mic },
    { id: 'interview', label: 'AI Interview', icon: Briefcase },
    { id: 'business', label: 'Business English', icon: Briefcase },
    { id: 'chemistry', label: 'Chemical Eng.', icon: FlaskConical },
    { id: 'writing', label: 'Writing', icon: PenTool },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <aside className={`fixed lg:sticky top-16 left-0 h-screen bg-slate-900/50 border-r border-slate-800/50 backdrop-blur-xl transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <nav className="p-4 space-y-2 w-64">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;