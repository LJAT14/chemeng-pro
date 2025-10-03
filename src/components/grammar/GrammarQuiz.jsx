import React, { useState } from 'react';
import Button from '../shared/Button';

const GrammarQuiz = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  if (quizComplete) {
    return (
      <div className="text-center p-8">
        <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-2xl text-purple-400">Score: {score}/{questions.length}</p>
        <Button onClick={() => { setCurrentQuestion(0); setScore(0); setQuizComplete(false); }} className="mt-6">
          Retry Quiz
        </Button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-slate-400 mb-6">Question {currentQuestion + 1} of {questions.length}</p>
      <Button onClick={() => currentQuestion < questions.length - 1 ? setCurrentQuestion(currentQuestion + 1) : setQuizComplete(true)} className="mt-4">
        {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
      </Button>
    </div>
  );
};

export default GrammarQuiz;