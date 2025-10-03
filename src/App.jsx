import React, { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import GrammarHub from './pages/GrammarHub';
import VocabularyHub from './pages/VocabularyHub';
import PronunciationLab from './pages/PronunciationLab';
import InterviewSimulator from './pages/InterviewSimulator';
import BusinessEnglish from './pages/BusinessEnglish';
import ChemicalEngineering from './pages/ChemicalEngineering';
import WritingStudio from './pages/WritingStudio';
import Progress from './pages/Progress';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'grammar': return <GrammarHub />;
      case 'vocabulary': return <VocabularyHub />;
      case 'pronunciation': return <PronunciationLab />;
      case 'interview': return <InterviewSimulator />;
      case 'business': return <BusinessEnglish />;
      case 'chemistry': return <ChemicalEngineering />;
      case 'writing': return <WritingStudio />;
      case 'progress': return <Progress />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} />
        
        <main className="flex-1 relative">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {renderPage()}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;