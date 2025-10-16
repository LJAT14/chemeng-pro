import { useState } from 'react';
import { Play, Mic } from 'lucide-react';

function PronunciationPractice() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);

  const words = [
    { word: 'Beautiful', pronunciation: 'BYOO-tuh-ful', difficulty: 'Medium' },
    { word: 'Entrepreneur', pronunciation: 'ahn-truh-pruh-NUR', difficulty: 'Hard' },
    { word: 'Schedule', pronunciation: 'SKED-jool', difficulty: 'Easy' },
    { word: 'Comfortable', pronunciation: 'KUMF-ter-bul', difficulty: 'Medium' },
    { word: 'Restaurant', pronunciation: 'RES-ter-ahnt', difficulty: 'Easy' },
  ];

  const word = words[currentWord];

  const playPronunciation = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      alert('Great job! 🎉');
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-4xl font-bold text-white mb-8">🗣️ Pronunciation Practice</h2>

          <div className="bg-white/5 rounded-xl p-12 mb-8">
            <p className="text-6xl font-bold text-center text-purple-400 mb-4">
              {word.word}
            </p>
            
            <p className="text-2xl text-center text-white/60 mb-8">
              {word.pronunciation}
            </p>

            <div className="flex justify-center mb-8">
              <span className={`px-6 py-2 rounded-full font-bold ${
                word.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                word.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {word.difficulty}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={playPronunciation}
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-xl text-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                <Play className="w-6 h-6" />
                Listen
              </button>

              <button
                onClick={startRecording}
                disabled={isRecording}
                className={`flex items-center justify-center gap-3 text-white px-10 py-4 rounded-xl text-xl font-bold transition-all ${
                  isRecording
                    ? 'bg-red-600 animate-pulse'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                <Mic className="w-6 h-6" />
                {isRecording ? 'Recording...' : 'Record Your Voice'}
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentWord(Math.max(0, currentWord - 1))}
              disabled={currentWord === 0}
              className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 disabled:opacity-50"
            >
              ← Previous
            </button>
            
            <p className="text-white/60 flex items-center">
              {currentWord + 1} / {words.length}
            </p>

            <button
              onClick={() => setCurrentWord(Math.min(words.length - 1, currentWord + 1))}
              disabled={currentWord === words.length - 1}
              className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PronunciationPractice;