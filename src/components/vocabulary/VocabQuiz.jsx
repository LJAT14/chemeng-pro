import React, { useState } from 'react';
import Button from '../shared/Button';
import Card from '../shared/Card';

const VocabQuiz = ({ terms }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  const currentTerm = terms[currentIndex];

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % terms.length);
    setUserAnswer('');
    setShowAnswer(false);
  };

  return (
    <Card hover={false}>
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-2">Term {currentIndex + 1} of {terms.length}</p>
          <h3 className="text-3xl font-bold">{currentTerm.term.en}</h3>
          <p className="text-slate-400 mt-2">{currentTerm.pronunciation}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Your Translation (PT-BR):</label>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="Digite a tradução..."
          />
        </div>

        {showAnswer && (
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-sm text-slate-400 mb-1">Correct Answer:</p>
            <p className="text-xl font-semibold text-purple-400">{currentTerm.term.pt}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <Button onClick={() => setShowAnswer(true)} variant="outline">Show Answer</Button>
          <Button onClick={handleNext}>Next Term</Button>
        </div>
      </div>
    </Card>
  );
};

export default VocabQuiz;