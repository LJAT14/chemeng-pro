import { useState, useEffect } from 'react';

function VocabSpeedMatch() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedPair, setSelectedPair] = useState({ en: null, pt: null });

  const words = [
    { english: 'Hello', portuguese: 'Olá' },
    { english: 'Thank you', portuguese: 'Obrigado' },
    { english: 'Goodbye', portuguese: 'Tchau' },
    { english: 'Beautiful', portuguese: 'Bonito' },
    { english: 'Friend', portuguese: 'Amigo' },
    { english: 'Water', portuguese: 'Água' },
    { english: 'Food', portuguese: 'Comida' },
    { english: 'Happy', portuguese: 'Feliz' },
  ];

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, timeLeft]);

  const handleMatch = (word) => {
    if (!selectedPair.en) {
      setSelectedPair({ ...selectedPair, en: word });
    } else if (!selectedPair.pt) {
      if (word.english === selectedPair.en.english) {
        setScore(score + 10);
        setSelectedPair({ en: null, pt: null });
      } else {
        setTimeout(() => setSelectedPair({ en: null, pt: null }), 500);
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-white">⚡ Speed Match</h2>
            <div className="flex gap-4">
              <div className="bg-white/20 px-6 py-3 rounded-xl">
                <span className="text-2xl font-bold text-green-400">🎯 {score}</span>
              </div>
              <div className="bg-white/20 px-6 py-3 rounded-xl">
                <span className="text-2xl font-bold text-purple-400">⏰ {timeLeft}s</span>
              </div>
            </div>
          </div>

          {!gameStarted ? (
            <div className="text-center py-16">
              <p className="text-2xl text-white/80 mb-8">Match English words with Portuguese translations!</p>
              <button
                onClick={() => setGameStarted(true)}
                className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-12 py-4 rounded-xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                🎮 Start Game
              </button>
            </div>
          ) : timeLeft === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-4xl font-bold text-white mb-4">Game Over!</h3>
              <p className="text-2xl text-purple-300 mb-8">Final Score: {score}</p>
              <button
                onClick={() => {
                  setScore(0);
                  setTimeLeft(60);
                  setGameStarted(false);
                }}
                className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-12 py-4 rounded-xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Play Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white mb-4">English</h3>
                {words.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMatch(word)}
                    className={`w-full p-4 rounded-xl font-bold text-lg transition-all ${
                      selectedPair.en?.english === word.english
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {word.english}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white mb-4">Português</h3>
                {words.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMatch(word)}
                    className="w-full bg-white/20 text-white p-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all"
                  >
                    {word.portuguese}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VocabSpeedMatch;
