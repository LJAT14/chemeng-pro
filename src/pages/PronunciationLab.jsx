import React from 'react';
import { Mic } from 'lucide-react';
import PronunciationQuiz from '../components/pronunciation/PronunciationQuiz';
import { pronunciationWords } from '../data/pronunciationWords';

const PronunciationLab = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Mic className="w-8 h-8 text-green-400" />
        <h1 className="text-4xl font-bold">Pronunciation Lab</h1>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-400 font-semibold mb-2">🎤 Microphone Required</p>
        <p className="text-slate-300 text-sm">
          This feature uses speech recognition. Allow microphone access when prompted.
          Works best in Chrome or Edge browsers.
        </p>
      </div>

      <PronunciationQuiz words={pronunciationWords} />
    </div>
  );
};

export default PronunciationLab;