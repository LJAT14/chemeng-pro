import React from 'react';
import { Play } from 'lucide-react';

export function ListeningChallenge() {
  const options = ['Hello', 'Goodbye', 'Thank you', 'Please'];

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-purple-600 mb-6">🎧 Listening Challenge</h2>
      
      <div className="bg-white rounded-xl p-8 text-center">
        <div className="inline-block p-6 bg-purple-100 rounded-full mb-6">
          <Play className="w-16 h-16 text-purple-600" />
        </div>
        <p className="text-xl text-gray-600 mb-8">Listen and choose the correct answer</p>
        
        <div className="grid grid-cols-1 gap-4">
          {options.map((option, idx) => (
            <button
              key={idx}
              className="bg-gradient-to-r from-purple-50 to-green-50 border-2 border-purple-200 px-6 py-4 rounded-xl font-bold text-lg hover:border-purple-600 hover:shadow-lg transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}