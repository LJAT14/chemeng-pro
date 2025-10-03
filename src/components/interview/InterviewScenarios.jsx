import React from 'react';
import { Code, Users, TrendingUp } from 'lucide-react';
import Card from '../shared/Card';

const InterviewScenarios = ({ onSelectScenario }) => {
  const scenarios = [
    { id: 'technical', title: 'Technical Interview', description: 'Engineering concepts', icon: Code, color: 'from-purple-500 to-blue-500', questions: 8 },
    { id: 'behavioral', title: 'Behavioral Interview', description: 'Soft skills', icon: Users, color: 'from-green-500 to-emerald-500', questions: 10 },
    { id: 'case-study', title: 'Case Study', description: 'Real problems', icon: TrendingUp, color: 'from-orange-500 to-red-500', questions: 5 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {scenarios.map((scenario) => {
        const Icon = scenario.icon;
        return (
          <Card key={scenario.id} onClick={() => onSelectScenario(scenario.id)}>
            <div className={'p-4 rounded-xl bg-gradient-to-br mb-4 inline-flex ' + scenario.color}>
              <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">{scenario.title}</h3>
            <p className="text-slate-400 mb-4">{scenario.description}</p>
            <p className="text-sm text-slate-500">{scenario.questions} questions</p>
          </Card>
        );
      })}
    </div>
  );
};

export default InterviewScenarios;