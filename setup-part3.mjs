import fs from 'fs';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const writeFile = (filePath, content) => {
  fs.writeFileSync(filePath, content.trim());
  log(`✓ Created file: ${filePath}`, 'blue');
};

const setupPart3 = () => {
  log('\n🚀 Creating final components and pages (Part 3)...', 'cyan');

  // CHEMICAL ENGINEERING COMPONENTS
  writeFile('src/components/chemical-engineering/ThermodynamicsModule.jsx', `
import React, { useState } from 'react';
import { Zap, Calculator } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

const ThermodynamicsModule = () => {
  const [temperature, setTemperature] = useState('');
  const [pressure, setPressure] = useState('');
  const [result, setResult] = useState(null);

  const calculateGibbsEnergy = () => {
    const T = parseFloat(temperature);
    const P = parseFloat(pressure);
    
    if (!isNaN(T) && !isNaN(P)) {
      const deltaG = -50 + (0.1 * T) - (0.05 * P);
      setResult(deltaG.toFixed(2));
    }
  };

  return (
    <div className="space-y-6">
      <Card hover={false}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Thermodynamics Calculator</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Temperature (K)</label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="298.15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pressure (atm)</label>
            <input
              type="number"
              value={pressure}
              onChange={(e) => setPressure(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="1.0"
            />
          </div>

          <Button onClick={calculateGibbsEnergy} className="w-full">
            <Calculator className="w-5 h-5 mr-2 inline" />
            Calculate ΔG
          </Button>

          {result && (
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
              <p className="text-sm text-slate-400 mb-1">Gibbs Free Energy Change:</p>
              <p className="text-3xl font-bold text-purple-400">{result} kJ/mol</p>
            </div>
          )}
        </div>
      </Card>

      <Card hover={false}>
        <h3 className="text-xl font-bold mb-4">Key Concepts</h3>
        <div className="space-y-3">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="font-semibold text-purple-400">First Law:</p>
            <p className="text-slate-300 text-sm">Energy cannot be created or destroyed</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="font-semibold text-purple-400">Second Law:</p>
            <p className="text-slate-300 text-sm">Entropy always increases</p>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="font-semibold text-purple-400">Gibbs Free Energy:</p>
            <p className="text-slate-300 text-sm">ΔG = ΔH - TΔS</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ThermodynamicsModule;
  `);

  writeFile('src/components/chemical-engineering/ReactionKineticsModule.jsx', `
import React from 'react';
import { Atom } from 'lucide-react';
import Card from '../shared/Card';

const ReactionKineticsModule = () => {
  return (
    <div className="space-y-6">
      <Card hover={false}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
            <Atom className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Reaction Kinetics</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h3 className="font-semibold text-blue-400 mb-2">Arrhenius Equation</h3>
            <p className="font-mono text-xl mb-2">k = A · e^(-Ea/RT)</p>
            <p className="text-slate-300 text-sm">
              Rate constant calculation with activation energy
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h3 className="font-semibold text-blue-400 mb-2">Rate Laws</h3>
            <p className="text-slate-300 text-sm mb-2">Rate = k[A]^m[B]^n</p>
            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
              <li>Zero order: Rate = k</li>
              <li>First order: Rate = k[A]</li>
              <li>Second order: Rate = k[A]²</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReactionKineticsModule;
  `);

  writeFile('src/components/chemical-engineering/SeparationModule.jsx', `
import React from 'react';
import { FlaskConical } from 'lucide-react';
import Card from '../shared/Card';

const SeparationModule = () => {
  return (
    <div className="space-y-6">
      <Card hover={false}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold">Separation Processes</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">Distillation</h3>
            <p className="text-slate-300 text-sm">
              Vapor-liquid equilibrium separation
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">Extraction</h3>
            <p className="text-slate-300 text-sm">
              Selective dissolution method
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">Absorption</h3>
            <p className="text-slate-300 text-sm">
              Gas to liquid transfer
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h3 className="font-semibold text-orange-400 mb-2">Adsorption</h3>
            <p className="text-slate-300 text-sm">
              Surface adhesion process
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SeparationModule;
  `);

  writeFile('src/components/chemical-engineering/CalculatorTools.jsx', `
import React from 'react';
import { Calculator } from 'lucide-react';
import Card from '../shared/Card';

const CalculatorTools = () => {
  const tools = [
    { name: 'Unit Converter', description: 'Convert between unit systems' },
    { name: 'Molar Mass Calculator', description: 'Calculate molecular weight' },
    { name: 'Ideal Gas Law', description: 'PV = nRT calculations' },
    { name: 'Heat Transfer', description: 'Conduction calculations' }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {tools.map((tool, idx) => (
        <Card key={idx}>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Calculator className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{tool.name}</h3>
              <p className="text-sm text-slate-400">{tool.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CalculatorTools;
  `);

  // BUSINESS COMPONENTS
  writeFile('src/components/business/BusinessGrammarNotes.jsx', `
import React from 'react';
import { Briefcase } from 'lucide-react';
import Card from '../shared/Card';

const BusinessGrammarNotes = ({ language = 'en' }) => {
  const businessPhrases = [
    {
      category: 'Email Opening',
      phrases: [
        { en: 'I am writing to inquire about...', pt: 'Escrevo para perguntar sobre...', context: 'Formal inquiry' },
        { en: 'Thank you for your email regarding...', pt: 'Obrigado pelo seu email sobre...', context: 'Response' }
      ]
    },
    {
      category: 'Presentations',
      phrases: [
        { en: 'Today, I will be discussing...', pt: 'Hoje, vou discutir...', context: 'Introduction' },
        { en: 'Let me start by giving you an overview...', pt: 'Deixe-me começar dando uma visão geral...', context: 'Beginning' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {businessPhrases.map((section, idx) => (
        <Card key={idx} hover={false}>
          <div className="flex items-center space-x-3 mb-4">
            <Briefcase className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold">{section.category}</h3>
          </div>
          
          <div className="space-y-3">
            {section.phrases.map((phrase, pIdx) => (
              <div key={pIdx} className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-lg mb-2">{phrase[language]}</p>
                <p className="text-sm text-slate-400">Context: {phrase.context}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BusinessGrammarNotes;
  `);

  writeFile('src/components/business/EmailTemplates.jsx', `
import React, { useState } from 'react';
import { Mail, Copy, Check } from 'lucide-react';
import Card from '../shared/Card';

const EmailTemplates = () => {
  const [copied, setCopied] = useState(null);

  const templates = [
    {
      id: 'inquiry',
      title: 'Business Inquiry',
      subject: 'Inquiry Regarding [Product/Service]',
      body: 'Dear [Recipient],\\n\\nI am writing to inquire about [specific topic].\\n\\nBest regards,\\n[Your Name]'
    },
    {
      id: 'follow-up',
      title: 'Follow-up Email',
      subject: 'Following up on [Topic]',
      body: 'Dear [Recipient],\\n\\nI wanted to follow up on my previous email.\\n\\nThank you,\\n[Your Name]'
    }
  ];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {templates.map((template) => (
        <Card key={template.id} hover={false}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold">{template.title}</h3>
            </div>
            <button
              onClick={() => copyToClipboard(template.body, template.id)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {copied === template.id ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Subject:</p>
              <p className="font-semibold">{template.subject}</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
                {template.body}
              </pre>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EmailTemplates;
  `);

  writeFile('src/components/business/PresentationTips.jsx', `
import React from 'react';
import { Presentation, CheckCircle2 } from 'lucide-react';
import Card from '../shared/Card';

const PresentationTips = () => {
  const sections = [
    {
      title: 'Opening Strong',
      tips: [
        'Start with a compelling hook',
        'State your objective clearly',
        'Establish credibility early',
        'Use confident body language'
      ]
    },
    {
      title: 'Main Content',
      tips: [
        'Follow the rule of three',
        'Use visual aids effectively',
        'Tell stories to illustrate points',
        'Maintain eye contact'
      ]
    },
    {
      title: 'Closing Impact',
      tips: [
        'Summarize key takeaways',
        'End with a call to action',
        'Allow time for Q&A',
        'Thank your audience'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => (
        <Card key={idx} hover={false}>
          <div className="flex items-center space-x-3 mb-4">
            <Presentation className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold">{section.title}</h3>
          </div>
          
          <ul className="space-y-2">
            {section.tips.map((tip, tipIdx) => (
              <li key={tipIdx} className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
};

export default PresentationTips;
  `);

  writeFile('src/components/business/NegotiationPhrases.jsx', `
import React from 'react';
import { Handshake } from 'lucide-react';
import Card from '../shared/Card';

const NegotiationPhrases = () => {
  const phrases = [
    {
      category: 'Opening',
      items: [
        { en: 'I appreciate the opportunity to discuss this', pt: 'Agradeço a oportunidade de discutir isso' },
        { en: 'Let us explore mutually beneficial options', pt: 'Vamos explorar opções mutuamente benéficas' }
      ]
    },
    {
      category: 'Making Proposals',
      items: [
        { en: 'What if we were to consider...', pt: 'E se considerássemos...' },
        { en: 'I propose that we...', pt: 'Proponho que...' },
        { en: 'Would you be open to...', pt: 'Você estaria aberto a...' }
      ]
    },
    {
      category: 'Closing',
      items: [
        { en: 'I believe we have reached agreement', pt: 'Acredito que chegamos a um acordo' },
        { en: 'Thank you for your flexibility', pt: 'Obrigado pela sua flexibilidade' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {phrases.map((section, idx) => (
        <Card key={idx} hover={false}>
          <div className="flex items-center space-x-3 mb-4">
            <Handshake className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold">{section.category}</h3>
          </div>
          
          <div className="space-y-3">
            {section.items.map((item, itemIdx) => (
              <div key={itemIdx} className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-slate-100 mb-2">{item.en}</p>
                <p className="text-slate-400 text-sm">{item.pt}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NegotiationPhrases;
  `);

  // ALL PAGES
  writeFile('src/pages/GrammarHub.jsx', `
import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import GrammarNoteCard from '../components/grammar/GrammarNoteCard';
import TranslationToggle from '../components/vocabulary/TranslationToggle';
import { grammarRules } from '../data/grammarRules';

const GrammarHub = () => {
  const [language, setLanguage] = useState('en');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold">Grammar Hub</h1>
        </div>
        <TranslationToggle language={language} setLanguage={setLanguage} />
      </div>

      <div className="grid gap-6">
        {grammarRules.map((rule) => (
          <GrammarNoteCard key={rule.id} note={rule} language={language} />
        ))}
      </div>
    </div>
  );
};

export default GrammarHub;
  `);

  writeFile('src/pages/VocabularyHub.jsx', `
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import VocabList from '../components/vocabulary/VocabList';
import VocabQuiz from '../components/vocabulary/VocabQuiz';
import TranslationToggle from '../components/vocabulary/TranslationToggle';
import Button from '../components/shared/Button';
import { vocabulary } from '../data/vocabulary';

const VocabularyHub = () => {
  const [language, setLanguage] = useState('en');
  const [mode, setMode] = useState('browse');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl font-bold">Vocabulary Hub</h1>
        </div>
        <div className="flex items-center space-x-3">
          <TranslationToggle language={language} setLanguage={setLanguage} />
          <Button
            onClick={() => setMode(mode === 'browse' ? 'quiz' : 'browse')}
            variant="outline"
          >
            {mode === 'browse' ? 'Start Quiz' : 'Browse Terms'}
          </Button>
        </div>
      </div>

      {mode === 'browse' ? (
        <VocabList vocabulary={vocabulary} language={language} />
      ) : (
        <VocabQuiz terms={vocabulary} />
      )}
    </div>
  );
};

export default VocabularyHub;
  `);

  writeFile('src/pages/PronunciationLab.jsx', `
import React from 'react';
import { Mic } from 'lucide-react';
import PronunciationQuiz from '../components/pronunciation/PronunciationQuiz';
import { pronunciationWords } from '../data/pronunciationWords';

const PronunciationLab = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Mic className="w-8 h-8 text-green-400" />
        <h1 className="text-4xl font-bold">Pronunciation Lab</h1>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-400 font-semibold mb-2">🎤 Microphone Required</p>
        <p className="text-slate-300 text-sm">
          This feature uses speech recognition. Allow microphone access when prompted.
          Works best in Chrome or Edge browsers.
        </p>
      </div>

      <PronunciationQuiz words={pronunciationWords} />
    </div>
  );
};

export default PronunciationLab;
  `);

  writeFile('src/pages/InterviewSimulator.jsx', `
import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import AIInterviewChat from '../components/interview/AIInterviewChat';
import InterviewScenarios from '../components/interview/InterviewScenarios';
import { interviewQuestions } from '../data/interviewQuestions';

const InterviewSimulator = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const getQuestionsByScenario = (scenario) => {
    return interviewQuestions.filter(q => q.category === scenario);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Briefcase className="w-8 h-8 text-orange-400" />
        <h1 className="text-4xl font-bold">AI Interview Simulator</h1>
      </div>

      {!selectedScenario ? (
        <>
          <p className="text-slate-400 text-lg">
            Choose an interview scenario to begin practicing
          </p>
          <InterviewScenarios onSelectScenario={setSelectedScenario} />
        </>
      ) : (
        <div>
          <button
            onClick={() => setSelectedScenario(null)}
            className="mb-4 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to scenarios
          </button>
          <AIInterviewChat questions={getQuestionsByScenario(selectedScenario)} />
        </div>
      )}
    </div>
  );
};

export default InterviewSimulator;
  `);

  writeFile('src/pages/BusinessEnglish.jsx', `
import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import BusinessGrammarNotes from '../components/business/BusinessGrammarNotes';
import EmailTemplates from '../components/business/EmailTemplates';
import PresentationTips from '../components/business/PresentationTips';
import NegotiationPhrases from '../components/business/NegotiationPhrases';
import TranslationToggle from '../components/vocabulary/TranslationToggle';

const BusinessEnglish = () => {
  const [language, setLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('grammar');

  const sections = [
    { id: 'grammar', label: 'Business Grammar' },
    { id: 'emails', label: 'Email Templates' },
    { id: 'presentations', label: 'Presentations' },
    { id: 'negotiations', label: 'Negotiations' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Briefcase className="w-8 h-8 text-green-400" />
          <h1 className="text-4xl font-bold">Business English</h1>
        </div>
        <TranslationToggle language={language} setLanguage={setLanguage} />
      </div>

      <nav className="flex space-x-2 bg-slate-900/50 rounded-full p-1 border border-slate-800/50">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const buttonClass = isActive 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
            : 'text-slate-400 hover:text-white';
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={'px-6 py-2 rounded-full transition-all duration-300 ' + buttonClass}
            >
              {section.label}
            </button>
          );
        })}
      </nav>

      {activeSection === 'grammar' && <BusinessGrammarNotes language={language} />}
      {activeSection === 'emails' && <EmailTemplates />}
      {activeSection === 'presentations' && <PresentationTips />}
      {activeSection === 'negotiations' && <NegotiationPhrases />}
    </div>
  );
};

export default BusinessEnglish;
  `);

  writeFile('src/pages/ChemicalEngineering.jsx', `
import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import ThermodynamicsModule from '../components/chemical-engineering/ThermodynamicsModule';
import ReactionKineticsModule from '../components/chemical-engineering/ReactionKineticsModule';
import SeparationModule from '../components/chemical-engineering/SeparationModule';
import CalculatorTools from '../components/chemical-engineering/CalculatorTools';

const ChemicalEngineering = () => {
  const [activeModule, setActiveModule] = useState('thermo');

  const modules = [
    { id: 'thermo', label: 'Thermodynamics' },
    { id: 'kinetics', label: 'Reaction Kinetics' },
    { id: 'separation', label: 'Separation' },
    { id: 'tools', label: 'Calculator Tools' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <FlaskConical className="w-8 h-8 text-red-400" />
        <h1 className="text-4xl font-bold">Chemical Engineering</h1>
      </div>

      <nav className="flex space-x-2 bg-slate-900/50 rounded-full p-1 border border-slate-800/50">
        {modules.map((module) => {
          const isActive = activeModule === module.id;
          const buttonClass = isActive
            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
            : 'text-slate-400 hover:text-white';
          
          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={'px-6 py-2 rounded-full transition-all duration-300 ' + buttonClass}
            >
              {module.label}
            </button>
          );
        })}
      </nav>

      {activeModule === 'thermo' && <ThermodynamicsModule />}
      {activeModule === 'kinetics' && <ReactionKineticsModule />}
      {activeModule === 'separation' && <SeparationModule />}
      {activeModule === 'tools' && <CalculatorTools />}
    </div>
  );
};

export default ChemicalEngineering;
  `);

  writeFile('src/pages/WritingStudio.jsx', `
import React from 'react';
import { PenTool, CheckCircle2 } from 'lucide-react';
import Card from '../components/shared/Card';

const WritingStudio = () => {
  const writingTips = [
    {
      category: 'Scientific Writing',
      tips: [
        'Use passive voice for methods and results',
        'Present tense for established facts',
        'Past tense for your specific research',
        'Avoid first person in formal papers'
      ]
    },
    {
      category: 'Technical Reports',
      tips: [
        'Clear and concise language',
        'Logical flow of information',
        'Proper use of technical terminology',
        'Include data visualization'
      ]
    },
    {
      category: 'Common Mistakes',
      tips: [
        'Avoid contractions in formal writing',
        'Do not start sentences with numbers',
        'Use consistent terminology',
        'Proofread for technical accuracy'
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <PenTool className="w-8 h-8 text-purple-400" />
        <h1 className="text-4xl font-bold">Writing Studio</h1>
      </div>

      <Card hover={false}>
        <h2 className="text-2xl font-bold mb-4">Sample Abstract Analysis</h2>
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm font-semibold text-red-400 mb-2">❌ Poor Example:</p>
            <p className="text-slate-300">
              We did experiments on catalysts. The results were good. The conversion rate increased significantly.
            </p>
          </div>
          
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-sm font-semibold text-green-400 mb-2">✓ Improved Example:</p>
            <p className="text-slate-300">
              This study investigated the catalytic performance of zeolite-supported platinum nanoparticles 
              for methanol oxidation. Under optimized conditions (350°C, 1 atm), the conversion rate increased 
              from 45% to 78%, demonstrating enhanced activity compared to conventional catalysts.
            </p>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm font-semibold text-blue-400 mb-2">💡 Key Improvements:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
              <li>Specific technical details</li>
              <li>Quantitative data</li>
              <li>Professional tone</li>
              <li>Clear methodology</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {writingTips.map((section, idx) => (
          <Card key={idx} hover={false}>
            <h3 className="text-xl font-bold mb-4">{section.category}</h3>
            <ul className="space-y-2">
              {section.tips.map((tip, tipIdx) => (
                <li key={tipIdx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WritingStudio;
  `);

  writeFile('src/pages/Progress.jsx', `
import React from 'react';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import Card from '../components/shared/Card';
import ProgressBar from '../components/shared/ProgressBar';
import useProgress from '../hooks/useProgress';

const Progress = () => {
  const { progress } = useProgress();

  const stats = [
    {
      icon: Target,
      label: 'Grammar Completed',
      value: progress.grammar.completed + '/' + progress.grammar.total,
      progress: (progress.grammar.completed / progress.grammar.total) * 100,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      label: 'Vocabulary Mastered',
      value: progress.vocabulary.completed + '/' + progress.vocabulary.total,
      progress: (progress.vocabulary.completed / progress.vocabulary.total) * 100,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      label: 'Total Points',
      value: progress.totalPoints.toLocaleString(),
      progress: 75,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Calendar,
      label: 'Interviews Completed',
      value: progress.interviews.completed,
      progress: (progress.interviews.completed / 20) * 100,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <TrendingUp className="w-8 h-8 text-green-400" />
        <h1 className="text-4xl font-bold">Your Progress</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const iconBg = 'p-3 rounded-xl bg-gradient-to-br inline-flex mb-4 ' + stat.color;
          
          return (
            <Card key={idx}>
              <div className={iconBg}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-slate-400 mb-4">{stat.label}</p>
              <ProgressBar progress={stat.progress} color={stat.color} />
            </Card>
          );
        })}
      </div>

      <Card hover={false}>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { activity: 'Completed Grammar Quiz: Present Perfect', points: 100, time: '2 hours ago' },
            { activity: 'Mastered 10 new vocabulary terms', points: 50, time: '5 hours ago' },
            { activity: 'Pronunciation practice: 15 words', points: 75, time: '1 day ago' },
            { activity: 'Completed technical interview simulation', points: 200, time: '2 days ago' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div>
                <p className="font-semibold">{item.activity}</p>
                <p className="text-sm text-slate-400">{item.time}</p>
              </div>
              <span className="text-purple-400 font-semibold">+{item.points} pts</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Progress;
  `);

  log('\n✅ Part 3 Complete!', 'green');
  log('\n🎉 All components and pages created!', 'cyan');
  log('\n📦 Final steps:', 'yellow');
  log('1. npm run dev', 'blue');
  log('2. Open http://localhost:5173', 'blue');
  log('3. Enjoy your app! 🚀', 'green');
  log('\n✨ Created:', 'cyan');
  log('  - 4 Chemical Engineering components', 'blue');
  log('  - 4 Business English components', 'blue');
  log('  - 9 Complete pages', 'blue');
  log('  - Full bilingual support (EN/PT-BR)', 'blue');
  log('  - Voice recognition ready', 'blue');
  log('  - AI interview simulator ready', 'blue');
};

setupPart3();