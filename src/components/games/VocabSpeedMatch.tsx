import React, { useState } from 'react';

export function VocabSpeedMatch() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);

  const words = [
    { english: 'Hello', portuguese: 'Olá' },
    { english: 'Thank you', portuguese: 'Obrigado' },
    { english: 'Goodbye', portuguese: 'Tchau' },
    { english: 'Beautiful', portuguese: 'Bonito' },
    { english: 'Friend', portuguese: 'Amigo' },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-100 to-green-100 rounded-2xl p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-purple-600">⚡ Speed Match</h2>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-2 rounded-full shadow">
            <span className="text-xl font-bold text-green-600">🎯 {score}</span>
          </div>
          <div className="bg-white px-6 py-2 rounded-full shadow">
            <span className="text-xl font-bold text-purple-600">⏰ {timeLeft}s</span>
          </div>
        </div>
      </div>

      {!gameStarted ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-6">Match words as fast as you can!</p>
          <button
            onClick={() => setGameStarted(true)}
            className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all"
          >
            🎮 Start Game
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {words.map((word, idx) => (
            <button
              key={idx}
              onClick={() => setScore(score + 10)}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              <p className="text-2xl font-bold text-purple-600">{word.english}</p>
              <p className="text-lg text-gray-600 mt-2">{word.portuguese}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}