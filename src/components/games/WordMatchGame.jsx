 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Timer, Check, RefreshCw } from 'lucide-react';
import PageWrapper from '../PageWrapper';
import { useToast } from '../../context/ToastContext';

// Word pairs (English - Portuguese)
const wordPairs = [
  { english: 'Hello', portuguese: 'Olá', category: 'Greetings' },
  { english: 'Goodbye', portuguese: 'Tchau', category: 'Greetings' },
  { english: 'Thank you', portuguese: 'Obrigado', category: 'Greetings' },
  { english: 'Please', portuguese: 'Por favor', category: 'Greetings' },
  { english: 'Good morning', portuguese: 'Bom dia', category: 'Greetings' },
  { english: 'Good night', portuguese: 'Boa noite', category: 'Greetings' },
  { english: 'Water', portuguese: 'Água', category: 'Food' },
  { english: 'Bread', portuguese: 'Pão', category: 'Food' },
  { english: 'Coffee', portuguese: 'Café', category: 'Food' },
  { english: 'Milk', portuguese: 'Leite', category: 'Food' },
  { english: 'House', portuguese: 'Casa', category: 'Places' },
  { english: 'School', portuguese: 'Escola', category: 'Places' },
  { english: 'Book', portuguese: 'Livro', category: 'Objects' },
  { english: 'Computer', portuguese: 'Computador', category: 'Objects' },
  { english: 'Phone', portuguese: 'Telefone', category: 'Objects' },
  { english: 'Happy', portuguese: 'Feliz', category: 'Emotions' },
  { english: 'Sad', portuguese: 'Triste', category: 'Emotions' },
  { english: 'Love', portuguese: 'Amor', category: 'Emotions' },
  { english: 'Friend', portuguese: 'Amigo', category: 'People' },
  { english: 'Family', portuguese: 'Família', category: 'People' },
];

export default function WordMatchGame() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [gameWords, setGameWords] = useState({ left: [], right: [] });
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matches, setMatches] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Initialize game
  const startGame = () => {
    // Select 8 random word pairs
    const shuffled = [...wordPairs].sort(() => Math.random() - 0.5).slice(0, 8);
    
    // Create shuffled arrays
    const leftWords = shuffled.map((pair, idx) => ({
      id: `left-${idx}`,
      word: pair.english,
      pairId: idx,
      matched: false
    }));
    
    const rightWords = shuffled
      .map((pair, idx) => ({
        id: `right-${idx}`,
        word: pair.portuguese,
        pairId: idx,
        matched: false
      }))
      .sort(() => Math.random() - 0.5);

    setGameWords({ left: leftWords, right: rightWords });
    setMatches([]);
    setScore(0);
    setTimer(0);
    setIsPlaying(true);
    setGameOver(false);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (isPlaying && !gameOver) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  // Check for match
  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      const leftWord = gameWords.left[selectedLeft];
      const rightWord = gameWords.right[selectedRight];

      if (leftWord.pairId === rightWord.pairId) {
        // Correct match!
        setTimeout(() => {
          const newMatches = [...matches, leftWord.pairId];
          setMatches(newMatches);
          setScore(score + 10);
          showToast('Perfect match! +10 points 🎉', 'success');

          // Mark as matched
          const newLeft = [...gameWords.left];
          const newRight = [...gameWords.right];
          newLeft[selectedLeft].matched = true;
          newRight[selectedRight].matched = true;
          setGameWords({ left: newLeft, right: newRight });

          setSelectedLeft(null);
          setSelectedRight(null);

          // Check if game is complete
          if (newMatches.length === 8) {
            setGameOver(true);
            setIsPlaying(false);
            showToast(`Game Complete! Score: ${score + 10} | Time: ${timer}s`, 'success');
          }
        }, 500);
      } else {
        // Wrong match
        setTimeout(() => {
          showToast('Try again!', 'error');
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 1000);
      }
    }
  }, [selectedLeft, selectedRight]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PageWrapper
      title="Word Match Game"
      subtitle="Match English words with Portuguese translations"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={() => navigate('/library')}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>

        {/* Stats */}
        {isPlaying && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{score} points</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <Timer className="w-5 h-5 text-blue-400" />
              <span className="text-white font-bold">{formatTime(timer)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Game Area */}
      {!isPlaying && !gameOver ? (
        // Start Screen
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
            🎯
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Word Match Challenge</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-md mx-auto">
            Match English words with their Portuguese translations as fast as you can!
          </p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-semibold rounded-xl transition-all"
          >
            Start Game
          </button>
        </div>
      ) : gameOver ? (
        // Game Over Screen
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
            🏆
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Congratulations!</h2>
          <p className="text-slate-300 text-lg mb-6">
            You completed the game!
          </p>
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">{score}</div>
              <div className="text-slate-400">Points</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">{formatTime(timer)}</div>
              <div className="text-slate-400">Time</div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg font-semibold rounded-xl transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Play Again
            </button>
            <button
              onClick={() => navigate('/library')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl transition-all"
            >
              Back to Library
            </button>
          </div>
        </div>
      ) : (
        // Game Board
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - English */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">EN</span>
              </div>
              <h3 className="text-xl font-bold text-white">English</h3>
            </div>
            {gameWords.left.map((word, idx) => (
              <button
                key={word.id}
                onClick={() => !word.matched && setSelectedLeft(idx)}
                disabled={word.matched}
                className={`w-full p-4 rounded-xl font-semibold text-lg transition-all ${
                  word.matched
                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50 cursor-not-allowed'
                    : selectedLeft === idx
                    ? 'bg-blue-600 text-white border-2 border-blue-400 scale-105'
                    : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 hover:scale-105'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{word.word}</span>
                  {word.matched && <Check className="w-5 h-5" />}
                </div>
              </button>
            ))}
          </div>

          {/* Right Column - Portuguese */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">PT</span>
              </div>
              <h3 className="text-xl font-bold text-white">Português</h3>
            </div>
            {gameWords.right.map((word, idx) => (
              <button
                key={word.id}
                onClick={() => !word.matched && setSelectedRight(idx)}
                disabled={word.matched}
                className={`w-full p-4 rounded-xl font-semibold text-lg transition-all ${
                  word.matched
                    ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50 cursor-not-allowed'
                    : selectedRight === idx
                    ? 'bg-green-600 text-white border-2 border-green-400 scale-105'
                    : 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 hover:scale-105'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{word.word}</span>
                  {word.matched && <Check className="w-5 h-5" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {isPlaying && !gameOver && (
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h4 className="text-lg font-bold text-white mb-3">How to Play:</h4>
          <ul className="space-y-2 text-slate-300">
            <li>1. Click a word in English (left column)</li>
            <li>2. Click its Portuguese translation (right column)</li>
            <li>3. Match all 8 pairs as fast as you can!</li>
            <li>4. Each correct match = +10 points</li>
          </ul>
        </div>
      )}
    </PageWrapper>
  );
}