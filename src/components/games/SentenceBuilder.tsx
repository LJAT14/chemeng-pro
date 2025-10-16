import React, { useState } from 'react';

export function SentenceBuilder() {
  const words = ['I', 'am', 'learning', 'English', 'today'];
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-purple-600 mb-6">🔨 Build a Sentence</h2>
      
      <div className="min-h-24 bg-purple-50 rounded-xl p-4 mb-6 border-2 border-purple-200 border-dashed">
        <div className="flex flex-wrap gap-2">
          {selectedWords.map((word, idx) => (
            <span key={idx} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold">
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {words.map((word, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedWords([...selectedWords, word])}
            className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            {word}
          </button>
        ))}
      </div>

      <button className="w-full mt-6 bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors">
        ✓ Check Answer
      </button>
    </div>
  );
}