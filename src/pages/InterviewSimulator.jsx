import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import AIInterviewChat from '../components/interview/AIInterviewChat';
import InterviewScenarios from '../components/interview/InterviewScenarios';
import { interviewQuestions } from '../data/interviewQuestions';

const InterviewSimulator = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const getQuestionsByScenario = (scenario) => {
    return interviewQuestions.filter(q => q.category === scenario);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Briefcase className="w-8 h-8 text-orange-400" />
        <h1 className="text-4xl font-bold">AI Interview Simulator</h1>
      </div>

      {!selectedScenario ? (
        <>
          <p className="text-slate-400 text-lg">Choose an interview scenario to begin practicing</p>
          <InterviewScenarios onSelectScenario={setSelectedScenario} />
        </>
      ) : (
        <div>
          <button onClick={() => setSelectedScenario(null)} className="mb-4 text-purple-400 hover:text-purple-300 transition-colors">
            ← Back to scenarios
          </button>
          <AIInterviewChat questions={getQuestionsByScenario(selectedScenario)} />
        </div>
      )}
    </div>
  );
};

export default InterviewSimulator;