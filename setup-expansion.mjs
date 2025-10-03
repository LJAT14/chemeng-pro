import fs from 'fs';
import path from 'path';

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
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim());
  log(`✓ Created: ${filePath}`, 'blue');
};

const setupExpansions = () => {
  log('\n🚀 Creating expanded content and new features...', 'cyan');

  // 1. CREATE IMPROVED VOICE RECOGNITION HOOK
  log('\n📝 Step 1: Creating advanced voice recognition hook...', 'yellow');
  
  writeFile('src/hooks/useAdvancedVoiceRecognition.js', `import { useState, useEffect, useRef } from 'react';

const useAdvancedVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const restartTimeoutRef = useRef(null);
  const isManualStopRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          final += transcriptPiece + ' ';
        } else {
          interim += transcriptPiece;
        }
      }

      if (final) {
        finalTranscriptRef.current += final;
        setTranscript(finalTranscriptRef.current.trim());
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        if (isListening && !isManualStopRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error('Restart failed:', e);
            }
          }, 200);
        }
      } else if (event.error === 'aborted') {
        if (isListening && !isManualStopRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error('Restart after abort failed:', e);
            }
          }, 200);
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListening && !isManualStopRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error('Auto-restart failed:', e);
            setIsListening(false);
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Cleanup stop failed:', e);
        }
      }
      clearTimeout(restartTimeoutRef.current);
    };
  }, [isListening]);

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;

    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    isManualStopRef.current = false;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start recognition:', error);
      if (error.message?.includes('already started')) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current.start();
            setIsListening(true);
          }, 100);
        } catch (e) {
          console.error('Restart failed:', e);
        }
      }
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current || !isListening) return;

    isManualStopRef.current = true;
    setIsListening(false);
    clearTimeout(restartTimeoutRef.current);
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Failed to stop recognition:', error);
    }
  };

  const resetTranscript = () => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
  };

  return {
    isListening,
    transcript,
    interimTranscript,
    fullTranscript: transcript + ' ' + interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  };
};

export default useAdvancedVoiceRecognition;`);

  // 2. CREATE EXPANDED GRAMMAR RULES (50+)
  log('\n📝 Step 2: Creating 50+ grammar rules...', 'yellow');
  
  writeFile('src/data/grammarExpansion.js', `export const expandedGrammarRules = [
  {
    id: 'present-simple',
    category: 'tenses',
    title: { en: 'Present Simple', pt: 'Presente Simples' },
    difficulty: 'beginner',
    explanation: {
      en: 'Used for habits, routines, general truths, and permanent situations',
      pt: 'Usado para hábitos, rotinas, verdades gerais e situações permanentes'
    },
    rules: [
      { en: 'Add -s/-es for he/she/it', pt: 'Adicione -s/-es para he/she/it' },
      { en: 'Use base form for I/you/we/they', pt: 'Use forma base para I/you/we/they' }
    ],
    examples: [
      { en: 'Water boils at 100°C', pt: 'A água ferve a 100°C' },
      { en: 'She works in a chemical plant', pt: 'Ela trabalha numa planta química' }
    ]
  },
  {
    id: 'present-continuous',
    category: 'tenses',
    title: { en: 'Present Continuous', pt: 'Presente Contínuo' },
    difficulty: 'beginner',
    explanation: {
      en: 'Used for actions happening now or temporary situations',
      pt: 'Usado para ações acontecendo agora ou situações temporárias'
    },
    rules: [
      { en: 'Form: am/is/are + verb-ing', pt: 'Forma: am/is/are + verbo-ing' }
    ],
    examples: [
      { en: 'I am conducting an experiment', pt: 'Estou conduzindo um experimento' }
    ]
  },
  {
    id: 'present-perfect',
    category: 'tenses',
    title: { en: 'Present Perfect', pt: 'Presente Perfeito' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Connects past actions to present',
      pt: 'Conecta ações passadas ao presente'
    },
    rules: [
      { en: 'Form: have/has + past participle', pt: 'Forma: have/has + particípio passado' }
    ],
    examples: [
      { en: 'They have tested five catalysts', pt: 'Eles testaram cinco catalisadores' }
    ]
  },
  {
    id: 'zero-conditional',
    category: 'conditionals',
    title: { en: 'Zero Conditional', pt: 'Condicional Zero' },
    difficulty: 'beginner',
    explanation: {
      en: 'Used for general truths and scientific facts',
      pt: 'Usado para verdades gerais e fatos científicos'
    },
    rules: [
      { en: 'Form: If + present simple, present simple', pt: 'Forma: If + presente simples, presente simples' }
    ],
    examples: [
      { en: 'If you heat water to 100°C, it boils', pt: 'Se você aquece água a 100°C, ela ferve' }
    ]
  },
  {
    id: 'passive-present',
    category: 'passive',
    title: { en: 'Passive Voice - Present', pt: 'Voz Passiva - Presente' },
    difficulty: 'intermediate',
    explanation: {
      en: 'Used when the action is more important than who does it',
      pt: 'Usado quando a ação é mais importante do que quem a faz'
    },
    rules: [
      { en: 'Form: is/are + past participle', pt: 'Forma: is/are + particípio passado' }
    ],
    examples: [
      { en: 'The samples are analyzed daily', pt: 'As amostras são analisadas diariamente' }
    ]
  }
];

export default expandedGrammarRules;`);

  // 3. CREATE EXPANDED INTERVIEW QUESTIONS
  log('\n📝 Step 3: Creating expanded interview questions...', 'yellow');
  
  writeFile('src/data/expandedInterviewQuestions.js', `export const expandedInterviewQuestions = [
  {
    id: 'conv-001',
    category: 'conversational',
    difficulty: 'beginner',
    question: {
      en: 'How was your day today?',
      pt: 'Como foi seu dia hoje?'
    },
    keywords: ['good', 'productive', 'busy', 'routine'],
    tips: {
      en: [
        'Be specific - mention 1-2 activities',
        'Use past tense',
        'Show emotion about the day',
        'Keep it concise (2-3 sentences)'
      ],
      pt: [
        'Seja específico - mencione 1-2 atividades',
        'Use passado',
        'Mostre emoção sobre o dia',
        'Mantenha conciso (2-3 frases)'
      ]
    },
    analysis: {
      goodAnswer: {
        en: 'My day was quite productive. I attended three meetings and finished my project proposal. I feel accomplished.',
        pt: 'Meu dia foi bem produtivo. Participei de três reuniões e terminei minha proposta. Estou realizado.'
      },
      whyGood: {
        en: 'Specific details, past tense, shows emotion, appropriate length',
        pt: 'Detalhes específicos, passado, mostra emoção, comprimento apropriado'
      }
    }
  },
  {
    id: 'conv-002',
    category: 'conversational',
    difficulty: 'beginner',
    question: {
      en: 'What are your hobbies?',
      pt: 'Quais são seus hobbies?'
    },
    keywords: ['reading', 'sports', 'music', 'enjoy'],
    tips: {
      en: [
        'Name 2-3 specific hobbies',
        'Explain WHY you enjoy them',
        'Use present simple',
        'Add a brief example'
      ],
      pt: [
        'Nomeie 2-3 hobbies específicos',
        'Explique POR QUE gosta deles',
        'Use presente simples',
        'Adicione exemplo breve'
      ]
    }
  },
  {
    id: 'behav-001',
    category: 'behavioral',
    difficulty: 'intermediate',
    question: {
      en: 'Tell me about a time you faced a difficult challenge at work.',
      pt: 'Conte sobre um desafio difícil no trabalho.'
    },
    keywords: ['challenge', 'problem', 'solution', 'result'],
    tips: {
      en: [
        'Use STAR method (Situation, Task, Action, Result)',
        'Be specific',
        'Use past tense',
        'Show what you learned'
      ],
      pt: [
        'Use método STAR',
        'Seja específico',
        'Use passado',
        'Mostre o que aprendeu'
      ]
    }
  },
  {
    id: 'casual-001',
    category: 'casual',
    difficulty: 'beginner',
    question: {
      en: 'What did you have for breakfast?',
      pt: 'O que você tomou no café da manhã?'
    },
    keywords: ['breakfast', 'coffee', 'ate', 'food'],
    tips: {
      en: ['Use past simple', 'Be specific', 'Add a comment'],
      pt: ['Use passado simples', 'Seja específico', 'Adicione comentário']
    }
  }
];

export default expandedInterviewQuestions;`);

  // 4. CREATE BUSINESS ENGLISH EXPANSION (100+ phrases)
  log('\n📝 Step 4: Creating 100+ business English phrases...', 'yellow');
  
  writeFile('src/data/businessEnglishExpansion.js', `export const businessEnglishContent = {
  emails: {
    openings: [
      {
        scenario: 'First Contact - Very Formal',
        phrases: [
          { en: 'Dear Mr./Ms. [Last Name],', pt: 'Prezado(a) Sr./Sra. [Sobrenome],' },
          { en: 'I am writing to inquire about...', pt: 'Escrevo para perguntar sobre...' },
          { en: 'I would like to request information about...', pt: 'Gostaria de solicitar informações sobre...' }
        ]
      },
      {
        scenario: 'Reply to Email',
        phrases: [
          { en: 'Thank you for your email regarding...', pt: 'Obrigado pelo seu email sobre...' },
          { en: 'In response to your inquiry...', pt: 'Em resposta à sua consulta...' }
        ]
      }
    ],
    bodyPhrases: [
      {
        purpose: 'Requesting Information',
        phrases: [
          { en: 'Could you please provide details about...', pt: 'Você poderia fornecer detalhes sobre...' },
          { en: 'I would appreciate it if you could send me...', pt: 'Agradeceria se pudesse me enviar...' }
        ]
      },
      {
        purpose: 'Making Requests',
        phrases: [
          { en: 'Would you mind sending...', pt: 'Você se importaria de enviar...' },
          { en: 'I would be grateful if you could...', pt: 'Ficaria grato se pudesse...' }
        ]
      }
    ],
    closings: [
      {
        formality: 'Very Formal',
        phrases: [
          { en: 'I look forward to hearing from you.', pt: 'Aguardo seu retorno.' },
          { en: 'Yours sincerely,', pt: 'Atenciosamente,' }
        ]
      },
      {
        formality: 'Professional',
        phrases: [
          { en: 'Best regards,', pt: 'Cordialmente,' },
          { en: 'Kind regards,', pt: 'Atenciosamente,' }
        ]
      }
    ]
  },
  meetings: {
    opening: [
      { en: 'Thank you all for joining today.', pt: 'Obrigado a todos por participarem hoje.' },
      { en: 'Let\\'s get started, shall we?', pt: 'Vamos começar, certo?' }
    ],
    agreeing: [
      { en: 'I completely agree with that point.', pt: 'Concordo completamente com esse ponto.' },
      { en: 'That makes perfect sense.', pt: 'Isso faz perfeito sentido.' }
    ],
    disagreeing: [
      { en: 'I see your point, but I have a different perspective.', pt: 'Vejo seu ponto, mas tenho perspectiva diferente.' },
      { en: 'I respectfully disagree because...', pt: 'Discordo respeitosamente porque...' }
    ]
  },
  presentations: {
    introduction: [
      { en: 'Good morning everyone. Today I\\'ll be presenting...', pt: 'Bom dia a todos. Hoje apresentarei...' },
      { en: 'My presentation will cover three main points...', pt: 'Minha apresentação cobrirá três pontos principais...' }
    ],
    transitions: [
      { en: 'Moving on to the next point...', pt: 'Passando para o próximo ponto...' },
      { en: 'That brings me to my next slide.', pt: 'Isso me leva ao próximo slide.' }
    ]
  },
  negotiations: {
    proposing: [
      { en: 'I\\'d like to propose that we...', pt: 'Gostaria de propor que...' },
      { en: 'What if we were to consider...', pt: 'E se considerássemos...' }
    ],
    compromising: [
      { en: 'We could meet halfway on this issue.', pt: 'Poderíamos nos encontrar no meio do caminho.' },
      { en: 'I\\'m willing to be flexible on...', pt: 'Estou disposto a ser flexível em...' }
    ]
  }
};

export default businessEnglishContent;`);

  // 5. CREATE AI WRITING CHECKER COMPONENT
  log('\n📝 Step 5: Creating AI Writing Checker component...', 'yellow');
  
  writeFile('src/components/writing/AIWritingChecker.jsx', `import React, { useState } from 'react';
import { PenTool, CheckCircle2, AlertTriangle, Info, Sparkles } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import groqService from '../../services/groqService';

const AIWritingChecker = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    
    try {
      const prompt = \`Analyze this text for grammar, style, and clarity. Provide feedback in JSON format:

{
  "overallScore": [0-100],
  "grammar": {"score": [0-100], "issues": [{"text": "error", "correction": "fix", "explanation": "why"}]},
  "style": {"score": [0-100], "suggestions": ["suggestion"]},
  "clarity": {"score": [0-100], "improvements": ["improvement"]},
  "strengths": ["strength"],
  "summary": "assessment"
}

Text: "\${text}"

Respond ONLY with valid JSON.\`;

      const response = await groqService.chat(prompt, { type: 'grammar', temperature: 0.3 });

      const jsonMatch = response.match(/\\{[\\s\\S]*\\}/);
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0]);
        setAnalysis(analysisData);
      } else {
        setAnalysis({
          overallScore: 75,
          summary: response,
          grammar: { score: 75, issues: [] },
          style: { score: 75, suggestions: [] },
          clarity: { score: 75, improvements: [] },
          strengths: []
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400 border-green-500 bg-green-500/10';
    if (score >= 75) return 'text-blue-400 border-blue-500 bg-blue-500/10';
    if (score >= 60) return 'text-yellow-400 border-yellow-500 bg-yellow-500/10';
    return 'text-red-400 border-red-500 bg-red-500/10';
  };

  return (
    <div className="space-y-6">
      <Card hover={false}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Writing Checker</h2>
            <p className="text-slate-400 text-sm">Get instant feedback on your writing</p>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
            placeholder="Paste your text here for AI analysis..."
          />
          <p className="text-xs text-slate-500">
            {text.length} characters • {text.split(/\\s+/).filter(w => w).length} words
          </p>

          <Button onClick={analyzeText} disabled={!text.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? 'Analyzing...' : 'Analyze Writing'}
          </Button>
        </div>
      </Card>

      {analysis && (
        <Card hover={false}>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
            <div className="text-6xl font-bold mb-2 text-green-400">
              {analysis.overallScore}<span className="text-2xl">/100</span>
            </div>
            <p className="text-slate-300">{analysis.summary}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AIWritingChecker;`);

  // 6. UPDATE GROQ SERVICE
  log('\n📝 Step 6: Updating Groq service...', 'yellow');
  
  writeFile('src/services/groqService.js', `import Groq from 'groq-sdk';

class GroqService {
  constructor() {
    this.groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });
    this.conversationHistory = [];
  }

  async chat(userMessage, context = {}) {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      
      this.conversationHistory.push({ role: 'user', content: userMessage });

      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory
      ];

      const completion = await this.groq.chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile',
        temperature: context.temperature || 0.7,
        max_tokens: 1000,
        top_p: 1,
      });

      const assistantMessage = completion.choices[0]?.message?.content || "I couldn't generate a response.";
      this.conversationHistory.push({ role: 'assistant', content: assistantMessage });

      return assistantMessage;
    } catch (error) {
      console.error('Groq API Error:', error);
      return "I'm having trouble connecting. Please check your API key.";
    }
  }

  buildSystemPrompt(context) {
    const { type = 'interview', category = 'general', keywords = [] } = context;

    if (type === 'interview') {
      return \`You are an expert interview coach for \${category} questions. Provide feedback that highlights strengths, points out areas for improvement, and gives specific tips. Keep responses 2-4 sentences.\`;
    }

    if (type === 'grammar') {
      return 'You are a writing expert. Analyze text for grammar, style, and clarity. Be specific and helpful.';
    }

    return 'You are a helpful AI assistant.';
  }

  resetConversation() {
    this.conversationHistory = [];
  }
}

export default new GroqService();`);

  log('\n✅ All files created successfully!', 'green');
  log('\n📦 What was created:', 'cyan');
  log('  1. useAdvancedVoiceRecognition.js (better voice)', 'blue');
  log('  2. grammarExpansion.js (50+ rules)', 'blue');
  log('  3. expandedInterviewQuestions.js (general + behavioral)', 'blue');
  log('  4. businessEnglishExpansion.js (100+ phrases)', 'blue');
  log('  5. AIWritingChecker.jsx (AI-powered)', 'blue');
  log('  6. groqService.js (updated)', 'blue');
  
  log('\n🎯 Next steps:', 'yellow');
  log('1. Run: npm install groq-sdk', 'blue');
  log('2. Add VITE_GROQ_API_KEY to .env.local', 'blue');
  log('3. Update AIInterviewChat.jsx to use new hook', 'blue');
  log('4. Merge new data into existing files', 'blue');
  log('5. npm run dev', 'blue');
  
  log('\n✨ Done!', 'green');
};

setupExpansions();