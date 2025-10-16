import React, { useState } from 'react';

export function WordScramble() {
  const [answer, setAnswer] = useState('');
  const scrambled = 'LLOHE';
  const correct = 'HELLO';

  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-green-600 mb-6">🔀 Word Scramble</h2>
      
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Unscramble this word:</p>
        <div className="text-6xl font-bold text-purple-600 mb-8 tracking-wider">
          {scrambled}
        </div>
        
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="w-full max-w-md px-6 py-4 text-2xl text-center border-4 border-purple-200 rounded-xl focus:border-purple-600 focus:outline-none"
        />
        
        <button className="mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-4 rounded-xl text-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all">
          Submit Answer ✓
        </button>
      </div>
    </div>
  );
}