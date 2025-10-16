import React from 'react';
import { Play } from 'lucide-react';

export function PronunciationPractice() {
  return (
    <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold text-purple-600 mb-6">🗣️ Pronunciation</h2>
      
      <div className="bg-white rounded-xl p-8">
        <p className="text-4xl font-bold text-center text-purple-600 mb-8">
          Beautiful
        </p>
        
        <div className="text-center mb-8">
          <button className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all">
            <Play className="w-6 h-6" />
            Listen
          </button>
        </div>

        <button className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
          🎤 Record Your Pronunciation
        </button>
      </div>
    </div>
  );
}