import React, { useState } from 'react';
import Button from '../shared/Button';
import Card from '../shared/Card';

const GrammarExercise = ({ exercise }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">{exercise.question}</h3>
      <div className="space-y-3 mb-6">
        {exercise.options && exercise.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedAnswer(idx)}
            className={'w-full p-4 text-left rounded-xl border transition-all ' + (selectedAnswer === idx ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700')}
          >
            {option}
          </button>
        ))}
      </div>
      
      {showResult && (
        <div className={'p-4 rounded-xl border ' + (selectedAnswer === exercise.correctAnswer ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50')}>
          <p className="font-semibold">{selectedAnswer === exercise.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}</p>
        </div>
      )}
      
      {!showResult && (
        <Button onClick={() => setShowResult(true)} disabled={selectedAnswer === null}>
          Check Answer
        </Button>
      )}
    </Card>
  );
};

export default GrammarExercise;