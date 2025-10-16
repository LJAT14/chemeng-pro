import { useState } from 'react';

function WordScramble() {
  const [answer, setAnswer] = useState('');
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);

  const words = [
    { scrambled: 'LLOHE', correct: 'HELLO', hint: 'A greeting' },
    { scrambled: 'NFREID', correct: 'FRIEND', hint: 'Someone close to you' },
    { scrambled: 'YPPAH', correct: 'HAPPY', hint: 'Feeling joy' },
    { scrambled: 'KOLBO', correct: 'BOOK', hint: 'Something to read' },
    { scrambled: 'SMUIC', correct: 'MUSIC', hint: 'Something to listen to' },
  ];

  const word = words[currentWord];

  const checkAnswer = () => {
    if (answer.toUpperCase() === word.correct) {
      setScore(score + 10);
      alert('Correct! 🎉');
      if (currentWord < words.length - 1) {
        setCurrentWord(currentWord + 1);
        setAnswer('');
      } else {
        alert(`Game complete! Final score: ${score + 10}`);
      }
    } else {
      alert('Try again! 💪');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-white">🔀 Word Scramble</h2>
            <div className="bg-white/20 px-6 py-3 rounded-xl">
              <span className="text-2xl font-bold text-green-400">🎯 {score}</span>
            </div>
          </div>

          <div className="text-center py-12">
            <p className="text-white/70 mb-4">Unscramble this word:</p>
            <div className="text-7xl font-bold text-purple-400 mb-8 tracking-wider">
              {word.scrambled}
            </div>

            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-8">
              <p className="text-yellow-200">💡 Hint: {word.hint}</p>
            </div>

            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full max-w-md px-8 py-4 text-2xl text-center bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/50 focus:border-purple-500 focus:outline-none mb-8"
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            />

            <button
              onClick={checkAnswer}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-16 py-4 rounded-xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Submit Answer ✓
            </button>

            <p className="text-white/50 mt-6">
              Word {currentWord + 1} of {words.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordScramble;
