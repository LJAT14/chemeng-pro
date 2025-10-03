import React from 'react';
import { CheckCircle } from 'lucide-react';

const FeedbackDisplay = ({ score, feedback }) => {
  return (
    <div className="p-6 rounded-2xl border-2 border-green-500 bg-green-500/10">
      <div className="flex items-center space-x-4 mb-4">
        <CheckCircle className="w-12 h-12 text-green-400" />
        <div>
          <h3 className="text-2xl font-bold">Score: {score}%</h3>
          <p className="text-slate-400">Pronunciation Accuracy</p>
        </div>
      </div>
      <p className="text-lg text-slate-300">{feedback}</p>
    </div>
  );
};

export default FeedbackDisplay;