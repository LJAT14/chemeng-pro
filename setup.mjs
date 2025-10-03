import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Create directory if it doesn't exist
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`✓ Created directory: ${dir}`, 'green');
  }
};

// Write file with content
const writeFile = (filePath, content) => {
  fs.writeFileSync(filePath, content.trim());
  log(`✓ Created file: ${filePath}`, 'blue');
};

// Main setup function
const setup = () => {
  log('\n🚀 Starting ChemEng Pro Project Setup...\n', 'cyan');

  const baseDir = './src';

  // Create all directories
  log('📁 Creating directory structure...', 'yellow');
  
  const dirs = [
    'src/components/layout',
    'src/components/shared',
    'src/components/grammar',
    'src/components/vocabulary',
    'src/components/pronunciation',
    'src/components/interview',
    'src/components/chemical-engineering',
    'src/components/business',
    'src/pages',
    'src/data/grammarRules',
    'src/data/vocabulary',
    'src/data/translations',
    'src/data/businessContent',
    'src/data/interviewQuestions',
    'src/hooks',
    'src/utils',
    'src/services',
    'src/contexts',
    'src/styles',
    'public/assets/audio/pronunciation-samples',
    'public/assets/images/grammar-illustrations'
  ];

  dirs.forEach(createDir);

  log('\n📝 Creating component files...', 'yellow');

  // ============================================
  // LAYOUT COMPONENTS
  // ============================================

  writeFile('src/components/layout/Header.jsx', `
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
  `);

  writeFile('src/components/layout/Sidebar.jsx', `
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
    <aside className={\`fixed lg:sticky top-16 left-0 h-screen bg-slate-900/50 border-r border-slate-800/50 backdrop-blur-xl transition-transform duration-300 z-40 \${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}\`}>
      <nav className="p-4 space-y-2 w-64">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={\`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 \${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }\`}
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
  `);

  writeFile('src/components/layout/Footer.jsx', `
import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-slate-400 text-sm">
          <p>© 2025 ChemEng Pro. Advanced Learning Platform for Chemical Engineers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  `);

  // SHARED COMPONENTS
  writeFile('src/components/shared/Button.jsx', `
import React from 'react';

const Button = ({ children, variant = 'primary', onClick, className = '', disabled = false }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-xl hover:scale-105',
    secondary: 'bg-slate-800 hover:bg-slate-700 border border-slate-700',
    outline: 'border border-purple-500 text-purple-400 hover:bg-purple-500/10'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`px-6 py-3 rounded-full font-semibold transition-all duration-300 \${variants[variant]} \${className} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
    >
      {children}
    </button>
  );
};

export default Button;
  `);

  writeFile('src/components/shared/Card.jsx', `
import React from 'react';

const Card = ({ children, className = '', hover = true, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={\`rounded-2xl bg-slate-900/50 border border-slate-800/50 p-6 transition-all duration-300 \${hover ? 'hover:border-slate-700 hover:scale-[1.02] cursor-pointer' : ''} \${className}\`}
    >
      {children}
    </div>
  );
};

export default Card;
  `);

  writeFile('src/components/shared/ProgressBar.jsx', `
import React from 'react';

const ProgressBar = ({ progress, color = 'from-purple-500 to-blue-500' }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">Progress</span>
        <span className="text-slate-300">{progress}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={\`h-full bg-gradient-to-r \${color} transition-all duration-500\`}
          style={{ width: \`\${progress}%\` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
  `);

  writeFile('src/components/shared/Badge.jsx', `
import React from 'react';

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300',
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-red-500/20 text-red-400',
    success: 'bg-emerald-500/20 text-emerald-400'
  };

  return (
    <span className={\`px-3 py-1 rounded-full text-xs font-semibold \${variants[variant]}\`}>
      {children}
    </span>
  );
};

export default Badge;
  `);

  writeFile('src/components/shared/Modal.jsx', `
import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
  `);

  // Create a simple Dashboard for now
  writeFile('src/pages/Dashboard.jsx', `
import React from 'react';
import { TrendingUp, BookOpen, MessageSquare, Award } from 'lucide-react';
import Card from '../components/shared/Card';
import ProgressBar from '../components/shared/ProgressBar';

const Dashboard = () => {
  const stats = [
    { label: 'Grammar Lessons', value: '24/50', icon: BookOpen, color: 'from-purple-500 to-pink-500', progress: 48 },
    { label: 'Vocabulary Mastered', value: '156/300', icon: MessageSquare, color: 'from-blue-500 to-cyan-500', progress: 52 },
    { label: 'Pronunciation Score', value: '85%', icon: TrendingUp, color: 'from-green-500 to-emerald-500', progress: 85 },
    { label: 'Total Points', value: '2,450', icon: Award, color: 'from-orange-500 to-red-500', progress: 75 }
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 p-8">
        <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
        <p className="text-slate-300 text-lg">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx}>
              <div className={\`inline-flex p-3 rounded-xl bg-gradient-to-br \${stat.color} mb-4\`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
              <p className="text-slate-400 text-sm mb-4">{stat.label}</p>
              <ProgressBar progress={stat.progress} color={stat.color} />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
  `);

  // Create placeholder pages
  const pages = ['GrammarHub', 'VocabularyHub', 'PronunciationLab', 'InterviewSimulator', 'BusinessEnglish', 'ChemicalEngineering', 'WritingStudio', 'Progress'];
  
  pages.forEach(page => {
    writeFile(`src/pages/${page}.jsx`, `
import React from 'react';

const ${page} = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">${page.replace(/([A-Z])/g, ' $1').trim()}</h1>
      <p className="text-slate-400">Content coming from setup-part2.mjs...</p>
    </div>
  );
};

export default ${page};
    `);
  });

  // Create basic data files
  writeFile('src/data/grammarRules.js', `
export const grammarRules = [
  {
    id: 'present-perfect',
    category: 'tenses',
    title: {
      en: 'Present Perfect',
      pt: 'Presente Perfeito'
    },
    explanation: {
      en: 'Used for actions that started in the past and continue to the present.',
      pt: 'Usado para ações que começaram no passado e continuam no presente.'
    },
    rules: [
      {
        en: 'Form: have/has + past participle',
        pt: 'Forma: have/has + particípio passado'
      }
    ],
    examples: [
      {
        en: 'I have worked here for 5 years',
        pt: 'Eu trabalho aqui há 5 anos'
      }
    ],
    difficulty: 'intermediate'
  }
];

export default grammarRules;
  `);

  writeFile('src/data/vocabulary.js', `
export const vocabulary = [
  {
    id: 'thermo-001',
    term: {
      en: 'Enthalpy',
      pt: 'Entalpia'
    },
    definition: {
      en: 'A thermodynamic quantity equivalent to the total heat content of a system',
      pt: 'Uma quantidade termodinâmica equivalente ao conteúdo total de calor de um sistema'
    },
    pronunciation: '/ˈenθəlpi/',
    audioFile: 'enthalpy.mp3',
    examples: {
      en: 'The enthalpy change is negative for exothermic reactions',
      pt: 'A mudança de entalpia é negativa para reações exotérmicas'
    },
    category: 'thermodynamics',
    difficulty: 'advanced'
  }
];

export default vocabulary;
  `);

  // Create simple Main App
  writeFile('src/App.jsx', `
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
  `);

  log('\n✅ Part 1 Complete! Run setup-part2.mjs next.', 'green');
  log('\n📦 Next: node setup-part2.mjs', 'cyan');
};

// Run setup
setup();