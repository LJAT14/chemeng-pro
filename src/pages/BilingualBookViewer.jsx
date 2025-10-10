// src/pages/BilingualBookViewer.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Volume2, 
  CheckCircle,
  MessageCircle,
  Globe,
  Headphones
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

// Sample bilingual content - You can expand this
const BILINGUAL_LESSONS = {
  'basic-english-1': {
    id: 'basic-english-1',
    title: 'Basic English - Lesson 1: Greetings',
    totalPages: 5,
    pages: [
      {
        pageNumber: 1,
        english: {
          title: 'Greetings and Introductions',
          content: `Hello! Welcome to your first English lesson.

In this lesson, you will learn:
• How to greet people in English
• Basic introductions
• Common phrases for daily conversation
• Pronunciation tips

Let's start with the most common greetings:
- Hello / Hi
- Good morning
- Good afternoon  
- Good evening
- How are you?
- Nice to meet you`,
          vocabulary: [
            { word: 'Hello', phonetic: '/həˈloʊ/', meaning: 'A greeting' },
            { word: 'Morning', phonetic: '/ˈmɔrnɪŋ/', meaning: 'Early part of the day' },
          ],
        },
        portuguese: {
          title: 'Cumprimentos e Apresentações',
          content: `Olá! Bem-vindo à sua primeira aula de inglês.

Nesta lição, você aprenderá:
• Como cumprimentar pessoas em inglês
• Apresentações básicas
• Frases comuns para conversação diária
• Dicas de pronúncia

Vamos começar com os cumprimentos mais comuns:
- Olá / Oi
- Bom dia
- Boa tarde
- Boa noite
- Como você está?
- Prazer em conhecê-lo`,
          vocabulary: [
            { word: 'Hello', fonetica: '/həˈloʊ/', significado: 'Um cumprimento' },
            { word: 'Morning', fonetica: '/ˈmɔrnɪŋ/', significado: 'Parte inicial do dia' },
          ],
        },
        audio: 'https://example.com/audio/lesson1-page1.mp3',
      },
      {
        pageNumber: 2,
        english: {
          title: 'Grammar Notes: Present Simple',
          content: `The Present Simple tense is used for:
• Habits and routines
• General truths
• Permanent situations

Structure:
Subject + Verb (base form)
I/You/We/They + verb
He/She/It + verb + s/es

Examples:
✓ I speak English.
✓ She speaks Portuguese.
✓ They work every day.
✓ He studies at night.

Practice:
1. I _____ (work) in an office.
2. She _____ (teach) English.
3. We _____ (learn) Portuguese.`,
        },
        portuguese: {
          title: 'Notas Gramaticais: Presente Simples',
          content: `O tempo Presente Simples é usado para:
• Hábitos e rotinas
• Verdades gerais
• Situações permanentes

Estrutura:
Sujeito + Verbo (forma base)
I/You/We/They + verbo
He/She/It + verbo + s/es

Exemplos:
✓ Eu falo inglês.
✓ Ela fala português.
✓ Eles trabalham todos os dias.
✓ Ele estuda à noite.

Prática:
1. Eu _____ (trabalho) em um escritório.
2. Ela _____ (ensina) inglês.
3. Nós _____ (aprendemos) português.`,
        },
      },
      {
        pageNumber: 3,
        english: {
          title: 'Reading Practice: Meeting Someone New',
          content: `John: Hello! My name is John. What's your name?
Maria: Hi John! I'm Maria. Nice to meet you.
John: Nice to meet you too! Where are you from?
Maria: I'm from Brazil. And you?
John: I'm from the United States. Do you speak English?
Maria: Yes, I'm learning English. I speak Portuguese too.
John: That's great! I'm also learning Portuguese.

Comprehension Questions:
1. What is the man's name?
2. Where is Maria from?
3. What languages does Maria speak?
4. Is John learning a new language?`,
        },
        portuguese: {
          title: 'Prática de Leitura: Conhecendo Alguém Novo',
          content: `John: Olá! Meu nome é John. Qual é o seu nome?
Maria: Oi John! Eu sou Maria. Prazer em conhecê-lo.
John: Prazer em conhecê-la também! De onde você é?
Maria: Eu sou do Brasil. E você?
John: Eu sou dos Estados Unidos. Você fala inglês?
Maria: Sim, estou aprendendo inglês. Eu também falo português.
John: Que ótimo! Eu também estou aprendendo português.

Perguntas de Compreensão:
1. Qual é o nome do homem?
2. De onde é a Maria?
3. Que idiomas Maria fala?
4. John está aprendendo um novo idioma?`,
        },
      },
      {
        pageNumber: 4,
        english: {
          title: 'Listening Exercise',
          content: `🎧 Listen to the audio and fill in the blanks:

Conversation at a Café:

Waiter: Good _______, how can I help you?
Customer: Hello! I'd like a _______ please.
Waiter: Would you like milk with that?
Customer: Yes, _______.
Waiter: Anything else?
Customer: No, that's all. _______ you!

Words to use: morning, coffee, please, thank

After listening, answer:
1. Where does this conversation happen?
2. What does the customer order?
3. Does the customer want milk?`,
          tips: [
            'Listen multiple times',
            'Focus on key words',
            'Pay attention to pronunciation',
          ],
        },
        portuguese: {
          title: 'Exercício de Escuta',
          content: `🎧 Ouça o áudio e preencha os espaços:

Conversa em um Café:

Garçom: Bom _______, como posso ajudá-lo?
Cliente: Olá! Eu gostaria de um _______ por favor.
Garçom: Você gostaria de leite com isso?
Cliente: Sim, _______.
Garçom: Mais alguma coisa?
Cliente: Não, isso é tudo. _______ você!

Palavras para usar: dia, café, por favor, obrigado

Depois de ouvir, responda:
1. Onde acontece esta conversa?
2. O que o cliente pede?
3. O cliente quer leite?`,
          tips: [
            'Ouça várias vezes',
            'Concentre-se nas palavras-chave',
            'Preste atenção à pronúncia',
          ],
        },
        audio: 'https://example.com/audio/lesson1-cafe.mp3',
      },
      {
        pageNumber: 5,
        english: {
          title: 'Quiz: Test Your Knowledge',
          content: `Complete this lesson by taking the quiz below:

1. How do you greet someone in the morning?
   a) Good night
   b) Good morning ✓
   c) Good evening
   d) Goodbye

2. "Nice to meet you" means:
   a) Prazer em conhecê-lo ✓
   b) Como você está?
   c) De nada
   d) Tchau

3. Complete: "She _____ English."
   a) speak
   b) speaks ✓
   c) speaking
   d) spoken

4. Which is correct?
   a) I am from Brazil. ✓
   b) I from Brazil.
   c) I am of Brazil.
   d) I be from Brazil.

Score: ___/4

Next Lesson: Family and Relationships →`,
        },
        portuguese: {
          title: 'Quiz: Teste Seus Conhecimentos',
          content: `Complete esta lição fazendo o quiz abaixo:

1. Como você cumprimenta alguém pela manhã?
   a) Boa noite
   b) Bom dia ✓
   c) Boa tarde
   d) Tchau

2. "Nice to meet you" significa:
   a) Prazer em conhecê-lo ✓
   b) Como você está?
   c) De nada
   d) Tchau

3. Complete: "Ela _____ inglês."
   a) falar
   b) fala ✓
   c) falando
   d) falado

4. Qual está correto?
   a) Eu sou do Brasil. ✓
   b) Eu do Brasil.
   c) Eu sou de Brasil.
   d) Eu ser do Brasil.

Pontuação: ___/4

Próxima Lição: Família e Relacionamentos →`,
        },
      },
    ],
  },
};

export default function BilingualBookViewer() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [showTranslation, setShowTranslation] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const lesson = BILINGUAL_LESSONS[bookId] || BILINGUAL_LESSONS['basic-english-1'];
  const page = lesson.pages[currentPage];

  const goToNextPage = () => {
    if (currentPage < lesson.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const playAudio = () => {
    if (page.audio) {
      setIsPlaying(true);
      // Implement actual audio playback
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  return (
    <PageWrapper
      title={lesson.title}
      subtitle={`Page ${currentPage + 1} of ${lesson.totalPages}`}
    >
      {/* Controls Bar */}
      <div className="mb-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={() => navigate('/library')}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
        >
          <BookOpen className="w-4 h-4" />
          Back to Library
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              showTranslation 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            {showTranslation ? 'Hide' : 'Show'} Portuguese
          </button>

          {page.audio && (
            <button
              onClick={playAudio}
              disabled={isPlaying}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-all"
            >
              {isPlaying ? (
                <Headphones className="w-4 h-4 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              {isPlaying ? 'Playing...' : 'Listen'}
            </button>
          )}
        </div>
      </div>

      {/* Book Content - Side by Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* English Side */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 min-h-[600px] transition-all duration-500 ease-in-out">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/20">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-400 font-bold">EN</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{page.english.title}</h2>
          </div>

          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed">
              {page.english.content}
            </pre>
          </div>

          {/* Vocabulary Section */}
          {page.english.vocabulary && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-400" />
                Key Vocabulary
              </h3>
              <div className="space-y-2">
                {page.english.vocabulary.map((item, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{item.word}</span>
                      <span className="text-purple-400 text-sm">{item.phonetic}</span>
                    </div>
                    <p className="text-slate-300 text-sm mt-1">{item.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips Section */}
          {page.english.tips && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">💡 Tips</h3>
              <ul className="space-y-2">
                {page.english.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Portuguese Side */}
        {showTranslation && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 min-h-[600px] transition-all duration-500 ease-in-out">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/20">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 font-bold">PT</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{page.portuguese.title}</h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed">
                {page.portuguese.content}
              </pre>
            </div>

            {/* Vocabulary Section (Portuguese) */}
            {page.portuguese.vocabulary && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                  Vocabulário Chave
                </h3>
                <div className="space-y-2">
                  {page.portuguese.vocabulary.map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{item.word}</span>
                        <span className="text-purple-400 text-sm">{item.fonetica}</span>
                      </div>
                      <p className="text-slate-300 text-sm mt-1">{item.significado}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips Section (Portuguese) */}
            {page.portuguese.tips && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">💡 Dicas</h3>
                <ul className="space-y-2">
                  {page.portuguese.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="text-white font-medium">
            Page {currentPage + 1} / {lesson.totalPages}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === lesson.totalPages - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Page Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {lesson.pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentPage
                  ? 'bg-purple-500 w-8'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}