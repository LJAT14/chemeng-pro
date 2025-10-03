import React from 'react';
import { TrendingUp, Award, Clock } from 'lucide-react';
import Card from '../shared/Card';

const FeedbackPanel = ({ feedback }) => {
  return (
    <Card hover={false}>
      <h3 className="text-2xl font-bold mb-4">Interview Performance</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{feedback.score}%</p>
          <p className="text-sm text-slate-400">Score</p>
        </div>
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{feedback.correctAnswers}/{feedback.totalQuestions}</p>
          <p className="text-sm text-slate-400">Correct</p>
        </div>
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">{feedback.duration}m</p>
          <p className="text-sm text-slate-400">Duration</p>
        </div>
      </div>
    </Card>
  );
};

export default FeedbackPanel;