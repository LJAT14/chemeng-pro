import { useState } from 'react';

function SentenceBuilder() {
  const [selectedWords, setSelectedWords] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);

  const levels = [
    {
      words: ['I', 'am', 'learning', 'English'],
      correct: ['I', 'am', 'learning', 'English'],
      translation: 'Eu estou aprendendo inglês'
    },
    {
      words: ['She', 'likes', 'to', 'read', 'books'],
      correct: ['She', 'likes', 'to', 'read', 'books'],
      translation: 'Ela gosta de ler livros'
    },
    {
      words: ['We', 'are', 'studying', 'together'],
      correct: ['We', 'are', 'studying', 'together'],
      translation: 'Nós estamos estudando juntos'
    }
  ];

  const currentLevelData = levels[currentLevel];
  const shuffledWords = [...currentLevelData.words].sort(() => Math.random() - 0.5);

  const checkAnswer = () => {
    const isCorrect = JSON.stringify(selectedWords) === JSON.stringify(currentLevelData.correct);
    if (isCorrect) {
      alert('Correct! 🎉');
      if (currentLevel < levels.length - 1) {
        setCurrentLevel(currentLevel + 1);
        setSelectedWords([]);
      } else {
        alert('You completed all levels! 🏆');
      }
    } else {
      alert('Try again! 💪');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-4xl font-bold text-white mb-4">🔨 Sentence Builder</h2>
          <p className="text-white/70 mb-8">Level {currentLevel + 1} of {levels.length}</p>

          <div className="mb-8">
            <p className="text-white/80 mb-2">Translation:</p>
            <p className="text-xl text-purple-300 font-semibold">{currentLevelData.translation}</p>
          </div>

          <div className="min-h-32 bg-purple-900/30 rounded-xl p-6 mb-8 border-2 border-purple-500/50">
            <div className="flex flex-wrap gap-3">
              {selectedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWords(selectedWords.filter((_, i) => i !== idx))}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {shuffledWords.map((word, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedWords([...selectedWords, word])}
                disabled={selectedWords.includes(word)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {word}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={checkAnswer}
              className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all"
            >
              ✓ Check Answer
            </button>
            <button
              onClick={() => setSelectedWords([])}
              className="flex-1 bg-white/20 text-white py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SentenceBuilder;
