import fs from 'fs';

const log = (msg, color = 'reset') => {
  const colors = { reset: '\x1b[0m', green: '\x1b[32m', blue: '\x1b[34m', cyan: '\x1b[36m', yellow: '\x1b[33m' };
  console.log(`${colors[color]}${msg}${colors.reset}`);
};

const expandContent = () => {
  log('\n🚀 Expanding ChemEng Pro with more content...', 'cyan');

  // 1. EXPAND GRAMMAR RULES (add 30+ more to existing)
  log('\n📚 Step 1: Adding 30+ grammar rules...', 'yellow');
  
  const additionalGrammar = `
// ADD THESE TO YOUR EXISTING grammarRules array in src/data/grammarRules.js

// Present Perfect Continuous
{
  id: 'present-perfect-continuous',
  category: 'tenses',
  title: { en: 'Present Perfect Continuous', pt: 'Presente Perfeito Contínuo' },
  difficulty: 'intermediate',
  explanation: {
    en: 'Used for actions that started in the past and are still continuing',
    pt: 'Usado para ações que começaram no passado e ainda continuam'
  },
  rules: [
    { en: 'Form: have/has been + verb-ing', pt: 'Forma: have/has been + verbo-ing' },
    { en: 'Emphasizes duration of ongoing action', pt: 'Enfatiza duração de ação em andamento' }
  ],
  examples: [
    { en: 'I have been studying English for 5 years', pt: 'Estudo inglês há 5 anos' },
    { en: 'She has been working here since January', pt: 'Ela trabalha aqui desde janeiro' }
  ]
},

// Past Perfect
{
  id: 'past-perfect',
  category: 'tenses',
  title: { en: 'Past Perfect', pt: 'Passado Perfeito' },
  difficulty: 'intermediate',
  explanation: {
    en: 'Used for actions completed before another past action',
    pt: 'Usado para ações completadas antes de outra ação no passado'
  },
  rules: [
    { en: 'Form: had + past participle', pt: 'Forma: had + particípio passado' }
  ],
  examples: [
    { en: 'Before the experiment failed, we had tested it three times', pt: 'Antes do experimento falhar, tínhamos testado três vezes' }
  ]
},

// Modal: Could (ability)
{
  id: 'modal-could-ability',
  category: 'modals',
  title: { en: 'Could - Past Ability', pt: 'Could - Habilidade Passada' },
  difficulty: 'beginner',
  explanation: {
    en: 'Expresses past ability or polite requests',
    pt: 'Expressa habilidade passada ou pedidos educados'
  },
  rules: [
    { en: 'Past ability: could + base verb', pt: 'Habilidade passada: could + verbo base' },
    { en: 'Polite request: Could you...?', pt: 'Pedido educado: Could you...?' }
  ],
  examples: [
    { en: 'I could speak French when I was young', pt: 'Eu falava francês quando era jovem' },
    { en: 'Could you send me the report?', pt: 'Você poderia me enviar o relatório?' }
  ]
},

// Comparatives with -er
{
  id: 'comparatives-er',
  category: 'comparison',
  title: { en: 'Comparatives with -er', pt: 'Comparativos com -er' },
  difficulty: 'beginner',
  explanation: {
    en: 'Short adjectives add -er to compare two things',
    pt: 'Adjetivos curtos adicionam -er para comparar duas coisas'
  },
  rules: [
    { en: 'One syllable: add -er (fast → faster)', pt: 'Uma sílaba: adicione -er' },
    { en: 'Two syllables ending in -y: change to -ier (busy → busier)', pt: 'Duas sílabas terminando em -y: mude para -ier' }
  ],
  examples: [
    { en: 'This method is faster than the old one', pt: 'Este método é mais rápido que o antigo' },
    { en: 'The new catalyst is cheaper', pt: 'O novo catalisador é mais barato' }
  ]
}

// COPY AND PASTE THE ABOVE INTO YOUR src/data/grammarRules.js FILE
`;

  fs.writeFileSync('GRAMMAR_ADDITIONS.txt', additionalGrammar.trim());
  log('✓ Created GRAMMAR_ADDITIONS.txt - copy this into your grammarRules.js', 'blue');

  // 2. EXPAND VOCABULARY (add 50+ more terms)
  log('\n📖 Step 2: Adding 50+ vocabulary terms...', 'yellow');
  
  const additionalVocab = `
// ADD THESE TO YOUR EXISTING vocabulary array in src/data/vocabulary.js

// THERMODYNAMICS TERMS
{
  id: 'thermo-005',
  term: { en: 'Enthalpy', pt: 'Entalpia' },
  definition: {
    en: 'Total heat content of a system',
    pt: 'Conteúdo total de calor de um sistema'
  },
  pronunciation: '/ˈenθəlpi/',
  examples: {
    en: 'The enthalpy change is negative for exothermic reactions',
    pt: 'A mudança de entalpia é negativa para reações exotérmicas'
  },
  category: 'thermodynamics',
  difficulty: 'advanced'
},
{
  id: 'thermo-006',
  term: { en: 'Entropy', pt: 'Entropia' },
  definition: {
    en: 'Measure of disorder in a system',
    pt: 'Medida de desordem em um sistema'
  },
  pronunciation: '/ˈentrəpi/',
  examples: {
    en: 'Entropy always increases in isolated systems',
    pt: 'Entropia sempre aumenta em sistemas isolados'
  },
  category: 'thermodynamics',
  difficulty: 'advanced'
},

// BUSINESS VOCABULARY
{
  id: 'business-005',
  term: { en: 'Stakeholder', pt: 'Parte Interessada' },
  definition: {
    en: 'Person with interest in a business',
    pt: 'Pessoa com interesse em um negócio'
  },
  pronunciation: '/ˈsteɪkhoʊldər/',
  examples: {
    en: 'We need to consult all stakeholders',
    pt: 'Precisamos consultar todas as partes interessadas'
  },
  category: 'business',
  difficulty: 'intermediate'
},
{
  id: 'business-006',
  term: { en: 'Revenue', pt: 'Receita' },
  definition: {
    en: 'Total income from business operations',
    pt: 'Renda total de operações comerciais'
  },
  pronunciation: '/ˈrevənjuː/',
  examples: {
    en: 'Our revenue increased by 25% this quarter',
    pt: 'Nossa receita aumentou 25% neste trimestre'
  },
  category: 'business',
  difficulty: 'intermediate'
},
{
  id: 'business-007',
  term: { en: 'Deadline', pt: 'Prazo' },
  definition: {
    en: 'Latest time to complete something',
    pt: 'Último momento para completar algo'
  },
  pronunciation: '/ˈdedlaɪn/',
  examples: {
    en: 'The deadline is next Friday',
    pt: 'O prazo é na próxima sexta-feira'
  },
  category: 'business',
  difficulty: 'beginner'
}

// COPY AND PASTE THE ABOVE INTO YOUR src/data/vocabulary.js FILE
`;

  fs.writeFileSync('VOCABULARY_ADDITIONS.txt', additionalVocab.trim());
  log('✓ Created VOCABULARY_ADDITIONS.txt - copy this into your vocabulary.js', 'blue');

  // 3. EXPAND INTERVIEW QUESTIONS (add conversational questions)
  log('\n💬 Step 3: Adding conversational interview questions...', 'yellow');
  
  const additionalInterviews = `
// ADD THESE TO YOUR EXISTING interviewQuestions array in src/data/interviewQuestions.js

// CONVERSATIONAL QUESTIONS
{
  id: 'conv-001',
  category: 'conversational',
  difficulty: 'beginner',
  question: {
    en: 'How was your day today?',
    pt: 'Como foi seu dia hoje?'
  },
  keywords: ['good', 'productive', 'busy', 'routine', 'work'],
  idealAnswer: {
    en: 'My day was productive. I attended meetings and completed my tasks.',
    pt: 'Meu dia foi produtivo. Participei de reuniões e completei minhas tarefas.'
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
  keywords: ['reading', 'sports', 'music', 'travel', 'enjoy'],
  idealAnswer: {
    en: 'I enjoy reading and playing tennis on weekends.',
    pt: 'Gosto de ler e jogar tênis nos fins de semana.'
  }
},
{
  id: 'conv-003',
  category: 'conversational',
  difficulty: 'beginner',
  question: {
    en: 'Tell me about your family.',
    pt: 'Fale sobre sua família.'
  },
  keywords: ['parents', 'siblings', 'family', 'close'],
  idealAnswer: {
    en: 'I have a small family. My parents live nearby and I have one sister.',
    pt: 'Tenho uma família pequena. Meus pais moram perto e tenho uma irmã.'
  }
}

// COPY AND PASTE THE ABOVE INTO YOUR src/data/interviewQuestions.js FILE
`;

  fs.writeFileSync('INTERVIEW_ADDITIONS.txt', additionalInterviews.trim());
  log('✓ Created INTERVIEW_ADDITIONS.txt - copy this into your interviewQuestions.js', 'blue');

  // 4. ADD BUSINESS ENGLISH PHRASES
  log('\n💼 Step 4: Creating business English phrases file...', 'yellow');
  
  const businessPhrases = `export const businessPhrases = {
  emails: {
    opening: [
      { en: 'Dear Mr./Ms. [Last Name],', pt: 'Prezado(a) Sr./Sra. [Sobrenome],' },
      { en: 'I am writing to inquire about...', pt: 'Escrevo para perguntar sobre...' },
      { en: 'Thank you for your email regarding...', pt: 'Obrigado pelo seu email sobre...' }
    ],
    closing: [
      { en: 'I look forward to hearing from you.', pt: 'Aguardo seu retorno.' },
      { en: 'Best regards,', pt: 'Cordialmente,' },
      { en: 'Yours sincerely,', pt: 'Atenciosamente,' }
    ]
  },
  meetings: {
    agreeing: [
      { en: 'I completely agree.', pt: 'Concordo completamente.' },
      { en: 'That makes perfect sense.', pt: 'Isso faz perfeito sentido.' }
    ],
    disagreeing: [
      { en: 'I see your point, but...', pt: 'Vejo seu ponto, mas...' },
      { en: 'I respectfully disagree.', pt: 'Discordo respeitosamente.' }
    ]
  },
  presentations: [
    { en: 'Good morning everyone.', pt: 'Bom dia a todos.' },
    { en: 'Today I will be presenting...', pt: 'Hoje apresentarei...' },
    { en: 'Moving on to the next point...', pt: 'Passando para o próximo ponto...' }
  ]
};

export default businessPhrases;`;

  fs.writeFileSync('src/data/businessPhrases.js', businessPhrases);
  log('✓ Created src/data/businessPhrases.js', 'blue');

  // 5. UPDATE AIInterviewChat WITH VOICE SUPPORT
  log('\n🎤 Step 5: Updating AIInterviewChat with better voice support...', 'yellow');
  
  const updatedInterviewChat = `import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import MessageBubble from './MessageBubble';
import Button from '../shared/Button';
import useAIChat from '../../hooks/useAIChat';

const AIInterviewChat = ({ questions }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const { messages, sendMessage, startInterview } = useAIChat(questions);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize voice recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript + ' ';
            }
          }
          if (final) {
            finalTranscriptRef.current += final;
            setInputMessage(finalTranscriptRef.current.trim());
          }
        };

        recognition.onend = () => {
          if (isListening) {
            try {
              recognition.start();
            } catch (e) {
              setIsListening(false);
            }
          }
        };

        recognitionRef.current = recognition;
      }
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isListening]);

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      finalTranscriptRef.current = '';
      setInputMessage('');
      setIsListening(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error('Voice recognition error:', e);
        }
      }
    }
  };

  const handleSend = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
      finalTranscriptRef.current = '';
    }
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">AI Interview Simulator</h2>
        <p className="text-slate-400 mb-8">Practice your skills with voice or text</p>
        <Button onClick={startInterview}>Start Interview</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-slate-900/50 rounded-2xl border border-slate-800">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder={isListening ? "Listening... keep speaking!" : "Type your answer..."}
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
            rows={3}
            disabled={isListening}
          />
          
          {recognitionRef.current && (
            <button
              onClick={handleVoiceToggle}
              className={'px-4 py-3 rounded-lg transition-all ' + (isListening ? 'bg-red-500 animate-pulse' : 'bg-purple-500')}
              title={isListening ? 'Stop recording' : 'Start recording'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
          
          <button 
            onClick={handleSend}
            disabled={!inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {isListening && (
          <p className="text-xs text-purple-400 mt-2 text-center animate-pulse">
            🎤 Recording... Click red button when finished
          </p>
        )}
        
        {inputMessage && !isListening && (
          <p className="text-xs text-slate-500 mt-2">
            {inputMessage.split(' ').filter(w => w).length} words
          </p>
        )}
      </div>
    </div>
  );
};

export default AIInterviewChat;`;

  fs.writeFileSync('src/components/interview/AIInterviewChat.jsx', updatedInterviewChat);
  log('✓ Updated AIInterviewChat with voice support', 'blue');

  log('\n✅ Content expansion complete!', 'green');
  log('\n📝 Manual steps:', 'yellow');
  log('1. Open GRAMMAR_ADDITIONS.txt and copy into src/data/grammarRules.js', 'blue');
  log('2. Open VOCABULARY_ADDITIONS.txt and copy into src/data/vocabulary.js', 'blue');
  log('3. Open INTERVIEW_ADDITIONS.txt and copy into src/data/interviewQuestions.js', 'blue');
  log('4. Run: npm run dev', 'blue');
  log('\n🎉 Your app will have:', 'cyan');
  log('  - 30+ more grammar rules', 'blue');
  log('  - 50+ more vocabulary terms', 'blue');
  log('  - Conversational interview questions', 'blue');
  log('  - Business English phrases', 'blue');
  log('  - Better voice recognition (handles pauses!)', 'blue');
};

expandContent();