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
  log(`✓ Created: ${filePath}`, 'blue');
};

const setupPart2 = () => {
  log('\n🚀 Part 2: Grammar, Vocabulary, Pronunciation, Interview...', 'cyan');

  // GRAMMAR COMPONENTS (4 files)
  writeFile('src/components/grammar/GrammarNoteCard.jsx', `
import React from 'react';
import { BookOpen, Globe } from 'lucide-react';
import Card from '../shared/Card';
import Badge from '../shared/Badge';

const GrammarNoteCard = ({ note, language = 'en' }) => {
  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{note.title[language]}</h3>
            <Badge variant={note.difficulty}>{note.difficulty}</Badge>
          </div>
        </div>
        <Globe className="w-5 h-5 text-slate-400" />
      </div>
      
      <p className="text-slate-300 mb-4">{note.explanation[language]}</p>
      
      <div className="space-y-2">
        <h4 className="font-semibold text-purple-400">Examples:</h4>
        {note.examples.map((example, idx) => (
          <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-slate-300">{example[language]}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GrammarNoteCard;
  `);

  writeFile('src/components/grammar/GrammarExercise.jsx', `
import React, { useState } from 'react';
import Button from '../shared/Button';
import Card from '../shared/Card';

const GrammarExercise = ({ exercise }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">{exercise.question}</h3>
      <div className="space-y-3 mb-6">
        {exercise.options && exercise.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedAnswer(idx)}
            className={'w-full p-4 text-left rounded-xl border transition-all ' + (selectedAnswer === idx ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700')}
          >
            {option}
          </button>
        ))}
      </div>
      
      {showResult && (
        <div className={'p-4 rounded-xl border ' + (selectedAnswer === exercise.correctAnswer ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50')}>
          <p className="font-semibold">{selectedAnswer === exercise.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}</p>
        </div>
      )}
      
      {!showResult && (
        <Button onClick={() => setShowResult(true)} disabled={selectedAnswer === null}>
          Check Answer
        </Button>
      )}
    </Card>
  );
};

export default GrammarExercise;
  `);

  writeFile('src/components/grammar/GrammarQuiz.jsx', `
import React, { useState } from 'react';
import Button from '../shared/Button';

const GrammarQuiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  if (quizComplete) {
    return (
      <div className="text-center p-8">
        <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-2xl text-purple-400">Score: {score}/{questions.length}</p>
        <Button onClick={() => { setCurrentQuestion(0); setScore(0); setQuizComplete(false); }} className="mt-6">
          Retry Quiz
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-slate-400 mb-6">Question {currentQuestion + 1} of {questions.length}</p>
      <Button onClick={() => currentQuestion < questions.length - 1 ? setCurrentQuestion(currentQuestion + 1) : setQuizComplete(true)} className="mt-4">
        {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
      </Button>
    </div>
  );
};

export default GrammarQuiz;
  `);

  writeFile('src/components/grammar/GrammarRuleDisplay.jsx', `
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Card from '../shared/Card';

const GrammarRuleDisplay = ({ rule, language = 'en' }) => {
  return (
    <Card hover={false}>
      <h3 className="text-2xl font-bold mb-4">{rule.title[language]}</h3>
      <p className="text-slate-300 mb-6">{rule.explanation[language]}</p>
      
      <h4 className="text-lg font-semibold text-purple-400 mb-3">Rules:</h4>
      <ul className="space-y-2">
        {rule.rules.map((r, idx) => (
          <li key={idx} className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-300">{r[language]}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default GrammarRuleDisplay;
  `);

  // VOCABULARY COMPONENTS (4 files)
  writeFile('src/components/vocabulary/VocabCard.jsx', `
import React, { useState } from 'react';
import { Volume2, Bookmark } from 'lucide-react';
import Card from '../shared/Card';

const VocabCard = ({ term, language = 'en' }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <Card onClick={() => setIsFlipped(!isFlipped)}>
      <div className="relative min-h-[200px] flex flex-col justify-between">
        <button
          onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
          className="absolute top-0 right-0"
        >
          <Bookmark className={isSaved ? 'fill-yellow-400 text-yellow-400 w-5 h-5' : 'text-slate-400 w-5 h-5'} />
        </button>
        
        {!isFlipped ? (
          <div>
            <h3 className="text-2xl font-bold mb-2">{term.term.en}</h3>
            <p className="text-slate-400 text-sm mb-4">{term.pronunciation}</p>
            <button className="flex items-center space-x-2 text-purple-400">
              <Volume2 className="w-5 h-5" />
              <span>Listen</span>
            </button>
          </div>
        ) : (
          <div>
            <h4 className="text-lg font-semibold text-purple-400 mb-2">Translation (PT-BR):</h4>
            <p className="text-xl mb-4">{term.term.pt}</p>
            <h4 className="text-lg font-semibold text-purple-400 mb-2">Definition:</h4>
            <p className="text-slate-300">{term.definition[language]}</p>
          </div>
        )}
        
        <p className="text-xs text-slate-500 mt-4">Click to flip</p>
      </div>
    </Card>
  );
};

export default VocabCard;
  `);

  writeFile('src/components/vocabulary/VocabList.jsx', `
import React from 'react';
import VocabCard from './VocabCard';

const VocabList = ({ vocabulary, language = 'en' }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vocabulary.map((term) => (
        <VocabCard key={term.id} term={term} language={language} />
      ))}
    </div>
  );
};

export default VocabList;
  `);

  writeFile('src/components/vocabulary/VocabQuiz.jsx', `
import React, { useState } from 'react';
import Button from '../shared/Button';
import Card from '../shared/Card';

const VocabQuiz = ({ terms }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const currentTerm = terms[currentIndex];

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % terms.length);
    setUserAnswer('');
    setShowAnswer(false);
  };

  return (
    <Card hover={false}>
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-2">Term {currentIndex + 1} of {terms.length}</p>
          <h3 className="text-3xl font-bold">{currentTerm.term.en}</h3>
          <p className="text-slate-400 mt-2">{currentTerm.pronunciation}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your Translation (PT-BR):</label>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="Digite a tradução..."
          />
        </div>

        {showAnswer && (
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-sm text-slate-400 mb-1">Correct Answer:</p>
            <p className="text-xl font-semibold text-purple-400">{currentTerm.term.pt}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <Button onClick={() => setShowAnswer(true)} variant="outline">Show Answer</Button>
          <Button onClick={handleNext}>Next Term</Button>
        </div>
      </div>
    </Card>
  );
};

export default VocabQuiz;
  `);

  writeFile('src/components/vocabulary/TranslationToggle.jsx', `
import React from 'react';
import { Languages } from 'lucide-react';

const TranslationToggle = ({ language, setLanguage }) => {
  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
      className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors border border-slate-700"
    >
      <Languages className="w-5 h-5" />
      <span className="font-medium">{language === 'en' ? 'EN' : 'PT-BR'}</span>
    </button>
  );
};

export default TranslationToggle;
  `);

  // PRONUNCIATION COMPONENTS (4 files)
  writeFile('src/components/pronunciation/PronunciationQuiz.jsx', `
import React, { useState } from 'react';
import { Mic, Volume2, CheckCircle, XCircle } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import useVoiceRecognition from '../../hooks/useVoiceRecognition';
import { calculatePronunciationScore, provideFeedback } from '../../utils/pronunciationAnalysis';

const PronunciationQuiz = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceRecognition();

  const currentWord = words[currentIndex];

  const handleRecord = () => {
    isListening ? stopListening() : startListening();
  };

  const checkPronunciation = () => {
    const pronunciationScore = calculatePronunciationScore(transcript, currentWord.word);
    setScore(pronunciationScore);
    setFeedback(provideFeedback(pronunciationScore));
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % words.length);
    setScore(null);
    setFeedback(null);
  };

  if (!isSupported) {
    return <Card><p className="text-red-400">Speech recognition not supported. Use Chrome or Edge.</p></Card>;
  }

  return (
    <Card hover={false}>
      <div className="space-y-6">
        <div className="text-center">
          <Badge variant={currentWord.difficulty}>{currentWord.difficulty}</Badge>
          <h2 className="text-4xl font-bold mt-4 mb-2">{currentWord.word}</h2>
          <p className="text-slate-400 text-xl mb-4">{currentWord.ipa}</p>
          
          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-lg">
            <Volume2 className="w-5 h-5" />
            <span>Listen</span>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleRecord}
            className={'w-32 h-32 rounded-full bg-gradient-to-br flex items-center justify-center mx-auto ' + (isListening ? 'from-red-500 to-pink-500 animate-pulse' : 'from-purple-500 to-blue-500')}
          >
            <Mic className="w-12 h-12" />
          </button>
          <p className="text-sm text-slate-400 mt-4">
            {isListening ? 'Listening...' : 'Click to record'}
          </p>
        </div>

        {transcript && (
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-sm text-slate-400 mb-1">You said:</p>
            <p className="text-xl font-semibold">{transcript}</p>
          </div>
        )}

        {score !== null && feedback && (
          <div className={'p-6 rounded-xl border-2 ' + (feedback.color === 'green' ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Score: {score}%</h3>
              {score >= 75 ? <CheckCircle className="w-8 h-8 text-green-400" /> : <XCircle className="w-8 h-8 text-red-400" />}
            </div>
            <p className="text-lg">{feedback.message}</p>
          </div>
        )}

        <div className="flex space-x-3">
          {transcript && !score && <Button onClick={checkPronunciation}>Check</Button>}
          {score !== null && <Button onClick={handleNext}>Next Word</Button>}
        </div>
      </div>
    </Card>
  );
};

export default PronunciationQuiz;
  `);

  writeFile('src/components/pronunciation/VoiceRecorder.jsx', `
import React, { useState } from 'react';
import { Mic, Square } from 'lucide-react';

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={'p-6 rounded-full transition-all ' + (isRecording ? 'bg-red-500' : 'bg-purple-500')}
        >
          {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;
  `);

  writeFile('src/components/pronunciation/WaveformVisualizer.jsx', `
import React from 'react';

const WaveformVisualizer = ({ isActive }) => {
  return (
    <canvas width={600} height={100} className="w-full h-24 rounded-lg bg-slate-900/50" />
  );
};

export default WaveformVisualizer;
  `);

  writeFile('src/components/pronunciation/FeedbackDisplay.jsx', `
import React from 'react';
import { CheckCircle } from 'lucide-react';

const FeedbackDisplay = ({ score, feedback }) => {
  return (
    <div className="p-6 rounded-2xl border-2 border-green-500 bg-green-500/10">
      <div className="flex items-center space-x-4 mb-4">
        <CheckCircle className="w-12 h-12 text-green-400" />
        <div>
          <h3 className="text-2xl font-bold">Score: {score}%</h3>
          <p className="text-slate-400">Pronunciation Accuracy</p>
        </div>
      </div>
      <p className="text-lg text-slate-300">{feedback}</p>
    </div>
  );
};

export default FeedbackDisplay;
  `);

  // INTERVIEW COMPONENTS (4 files)
  writeFile('src/components/interview/AIInterviewChat.jsx', `
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import MessageBubble from './MessageBubble';
import Button from '../shared/Button';
import useAIChat from '../../hooks/useAIChat';

const AIInterviewChat = ({ questions }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, sendMessage, startInterview } = useAIChat(questions);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">AI Interview Simulator</h2>
        <p className="text-slate-400 mb-8">Practice your skills</p>
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
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your answer..."
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <button onClick={handleSend} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewChat;
  `);

  writeFile('src/components/interview/MessageBubble.jsx', `
import React from 'react';
import { Bot, User } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={'flex ' + (isUser ? 'justify-end' : 'justify-start')}>
      <div className={'flex items-start space-x-3 max-w-[80%] ' + (isUser ? 'flex-row-reverse space-x-reverse' : '')}>
        <div className={'p-2 rounded-full ' + (isUser ? 'bg-purple-500' : 'bg-blue-500')}>
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>
        <div className={'p-4 rounded-2xl ' + (isUser ? 'bg-purple-500/20' : 'bg-slate-800')}>
          <p className="text-slate-100">{message.content}</p>
          <p className="text-xs text-slate-500 mt-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
  `);

  writeFile('src/components/interview/InterviewScenarios.jsx', `
import React from 'react';
import { Code, Users, TrendingUp } from 'lucide-react';
import Card from '../shared/Card';

const InterviewScenarios = ({ onSelectScenario }) => {
  const scenarios = [
    { id: 'technical', title: 'Technical Interview', description: 'Engineering concepts', icon: Code, color: 'from-purple-500 to-blue-500', questions: 8 },
    { id: 'behavioral', title: 'Behavioral Interview', description: 'Soft skills', icon: Users, color: 'from-green-500 to-emerald-500', questions: 10 },
    { id: 'case-study', title: 'Case Study', description: 'Real problems', icon: TrendingUp, color: 'from-orange-500 to-red-500', questions: 5 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {scenarios.map((scenario) => {
        const Icon = scenario.icon;
        return (
          <Card key={scenario.id} onClick={() => onSelectScenario(scenario.id)}>
            <div className={'p-4 rounded-xl bg-gradient-to-br mb-4 inline-flex ' + scenario.color}>
              <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">{scenario.title}</h3>
            <p className="text-slate-400 mb-4">{scenario.description}</p>
            <p className="text-sm text-slate-500">{scenario.questions} questions</p>
          </Card>
        );
      })}
    </div>
  );
};

export default InterviewScenarios;
  `);

  writeFile('src/components/interview/FeedbackPanel.jsx', `
import React from 'react';
import { TrendingUp, Award, Clock } from 'lucide-react';
import Card from '../shared/Card';

const FeedbackPanel = ({ feedback }) => {
  return (
    <Card hover={false}>
      <h3 className="text-2xl font-bold mb-4">Interview Performance</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{feedback.score}%</p>
          <p className="text-sm text-slate-400">Score</p>
        </div>
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{feedback.correctAnswers}/{feedback.totalQuestions}</p>
          <p className="text-sm text-slate-400">Correct</p>
        </div>
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{feedback.duration}m</p>
          <p className="text-sm text-slate-400">Duration</p>
        </div>
      </div>
    </Card>
  );
};

export default FeedbackPanel;
  `);

  // HOOKS (5 files)
  const hookFiles = {
    'useVoiceRecognition.js': `import { useState, useEffect } from 'react';

const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        setTranscript(event.results[0][0].transcript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening, isSupported: !!recognition };
};

export default useVoiceRecognition;`,

    'useLocalStorage.js': `import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;`,

    'useProgress.js': `import useLocalStorage from './useLocalStorage';

const useProgress = () => {
  const [progress, setProgress] = useLocalStorage('userProgress', {
    grammar: { completed: 0, total: 50 },
    vocabulary: { completed: 0, total: 300 },
    pronunciation: { score: 0 },
    interviews: { completed: 0 },
    totalPoints: 0
  });

  const updateProgress = (category, updates) => {
    setProgress(prev => ({
      ...prev,
      [category]: { ...prev[category], ...updates }
    }));
  };

  const addPoints = (points) => {
    setProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points
    }));
  };

  return { progress, updateProgress, addPoints };
};

export default useProgress;`,

    'useTranslation.js': `import { useState } from 'react';

const useTranslation = (defaultLanguage = 'en') => {
  const [language, setLanguage] = useState(defaultLanguage);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  const t = (translations) => {
    return translations[language] || translations.en;
  };

  return { language, setLanguage, toggleLanguage, t };
};

export default useTranslation;`,

    'useAIChat.js': `import { useState } from 'react';

const useAIChat = (interviewQuestions) => {
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const generateAIResponse = (userMessage) => {
    const question = interviewQuestions[currentQuestion];
    const keywords = question.keywords || [];
    
    const containsKeywords = keywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword.toLowerCase())
    );

    if (containsKeywords) {
      return "Great answer! You covered the key concepts. " + 
             (currentQuestion < interviewQuestions.length - 1 
               ? "Let's move to the next question." 
               : "Interview complete!");
    } else {
      return "Good start! Try to elaborate more. Consider mentioning: " + 
             keywords.slice(0, 2).join(', ');
    }
  };

  const sendMessage = (message) => {
    const userMessage = { role: 'user', content: message, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage = { role: 'assistant', content: aiResponse, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMessage]);
      
      if (currentQuestion < interviewQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          const nextQuestion = interviewQuestions[currentQuestion + 1];
          const questionMessage = { 
            role: 'assistant', 
            content: nextQuestion.question.en, 
            timestamp: Date.now() 
          };
          setMessages(prev => [...prev, questionMessage]);
        }, 1000);
      }
    }, 1000);
  };

  const startInterview = () => {
    const firstQuestion = interviewQuestions[0];
    setMessages([{ 
      role: 'assistant', 
      content: firstQuestion.question.en, 
      timestamp: Date.now() 
    }]);
    setCurrentQuestion(0);
  };

  return { messages, sendMessage, startInterview, currentQuestion };
};

export default useAIChat;`
  };

  Object.entries(hookFiles).forEach(([filename, content]) => {
    writeFile('src/hooks/' + filename, content);
  });

  // UTILS
  writeFile('src/utils/pronunciationAnalysis.js', `export const calculatePronunciationScore = (spokenWord, targetWord) => {
  const spoken = spokenWord.toLowerCase().trim();
  const target = targetWord.toLowerCase().trim();

  if (spoken === target) return 100;

  const distance = levenshteinDistance(spoken, target);
  const maxLength = Math.max(spoken.length, target.length);
  const similarity = (1 - distance / maxLength) * 100;

  return Math.max(0, Math.round(similarity));
};

const levenshteinDistance = (str1, str2) => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

export const provideFeedback = (score) => {
  if (score >= 90) return { message: 'Perfect pronunciation!', color: 'green' };
  if (score >= 75) return { message: 'Great job!', color: 'blue' };
  if (score >= 60) return { message: 'Good attempt. Keep practicing!', color: 'yellow' };
  return { message: 'Needs improvement. Try again!', color: 'red' };
};`);

  // DATA FILES
  writeFile('src/data/interviewQuestions.js', `export const interviewQuestions = [
  {
    id: 'tech-001',
    category: 'technical',
    difficulty: 'intermediate',
    question: {
      en: 'Explain the difference between exothermic and endothermic reactions.',
      pt: 'Explique a diferença entre reações exotérmicas e endotérmicas.'
    },
    keywords: ['energy', 'heat', 'temperature', 'enthalpy'],
    idealAnswer: {
      en: 'Exothermic reactions release energy.',
      pt: 'Reações exotérmicas liberam energia.'
    }
  },
  {
    id: 'behavioral-001',
    category: 'behavioral',
    difficulty: 'intermediate',
    question: {
      en: 'Tell me about a challenging team project.',
      pt: 'Conte sobre um projeto de equipe desafiador.'
    },
    keywords: ['teamwork', 'collaboration', 'problem-solving'],
    idealAnswer: {
      en: 'Focus on your role and outcome.',
      pt: 'Concentre-se no seu papel e resultado.'
    }
  },
  {
    id: 'case-study-001',
    category: 'case-study',
    difficulty: 'advanced',
    question: {
      en: 'How would you design a distillation column?',
      pt: 'Como projetaria uma coluna de destilação?'
    },
    keywords: ['McCabe-Thiele', 'reflux', 'stages'],
    idealAnswer: {
      en: 'Use McCabe-Thiele method.',
      pt: 'Use método McCabe-Thiele.'
    }
  }
];

export default interviewQuestions;`);

  writeFile('src/data/pronunciationWords.js', `export const pronunciationWords = [
  {
    id: 'chem-001',
    word: 'Thermodynamics',
    ipa: '/ˌθɜːrmoʊdaɪˈnæmɪks/',
    syllables: ['ther', 'mo', 'dy', 'nam', 'ics'],
    stressPattern: [0, 0, 1, 0, 0],
    audioFile: 'thermodynamics.mp3',
    difficulty: 'advanced',
    category: 'chemical-engineering'
  },
  {
    id: 'chem-002',
    word: 'Catalyst',
    ipa: '/ˈkætəlɪst/',
    syllables: ['cat', 'a', 'lyst'],
    stressPattern: [1, 0, 0],
    audioFile: 'catalyst.mp3',
    difficulty: 'intermediate',
    category: 'chemical-engineering'
  },
  {
    id: 'business-001',
    word: 'Negotiate',
    ipa: '/nɪˈɡoʊʃieɪt/',
    syllables: ['ne', 'go', 'ti', 'ate'],
    stressPattern: [0, 1, 0, 0],
    audioFile: 'negotiate.mp3',
    difficulty: 'intermediate',
    category: 'business'
  }
];

export default pronunciationWords;`);

  writeFile('src/data/businessContent.js', `export const businessContent = {
  emailWriting: [
    {
      id: 'email-opening',
      category: 'formal',
      title: {
        en: 'Professional Email Openings',
        pt: 'Aberturas de Email Profissional'
      },
      phrases: [
        {
          en: 'I am writing to inquire about...',
          pt: 'Escrevo para perguntar sobre...',
          context: 'First contact',
          formality: 'Very formal'
        }
      ]
    }
  ]
};

export default businessContent;`);

  log('\n✅ Part 2 Complete!', 'green');
  log('📦 Created: 16 Components + 5 Hooks + Utils + Data', 'cyan');
  log('🎯 Next: node setup-part3.mjs', 'yellow');
};

setupPart2();  