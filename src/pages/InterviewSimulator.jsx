// src/pages/InterviewSimulator.jsx - Multiple modes and roles
import React, { useState } from 'react';
import { Briefcase, MessageCircle, Users, Code, Stethoscope, Building } from 'lucide-react';
import AIInterviewChat from '../components/interview/AIInterviewChat';
import Card from '../components/shared/Card';
import { interviewQuestions } from '../data/interviewQuestions';

const InterviewSimulator = () => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const modes = [
    {
      id: 'structured',
      name: 'Structured Interview',
      description: 'Traditional Q&A format with immediate feedback',
      icon: Briefcase,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'conversation',
      name: 'Conversation Mode',
      description: 'Natural conversation - feedback at the end',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const roles = [
    {
      id: 'chemical-engineer',
      name: 'Chemical Engineer',
      description: 'Technical and process engineering questions',
      icon: '🧪',
      categories: ['technical', 'case-study']
    },
    {
      id: 'software-engineer',
      name: 'Software Engineer',
      description: 'Coding, algorithms, and system design',
      icon: '💻',
      categories: ['technical', 'behavioral']
    },
    {
      id: 'data-scientist',
      name: 'Data Scientist',
      description: 'Statistics, ML, and data analysis',
      icon: '📊',
      categories: ['technical', 'case-study']
    },
    {
      id: 'project-manager',
      name: 'Project Manager',
      description: 'Leadership and project management',
      icon: '📋',
      categories: ['behavioral', 'case-study']
    },
    {
      id: 'business-analyst',
      name: 'Business Analyst',
      description: 'Business strategy and analysis',
      icon: '💼',
      categories: ['behavioral', 'case-study']
    },
    {
      id: 'general',
      name: 'General / Casual Chat',
      description: 'Practice conversational English',
      icon: '💬',
      categories: ['conversational']
    }
  ];

  const getQuestionsByRole = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return [];

    return interviewQuestions.filter(q => 
      role.categories.includes(q.category)
    );
  };

  if (!selectedMode) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl animate-float">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text-animated">Interview Simulator</h1>
            <p className="text-slate-400 mt-1">Choose your interview mode</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div 
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className="cursor-pointer"
              >
                <Card hover>
                  <div className="space-y-4">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${mode.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{mode.name}</h3>
                      <p className="text-slate-400">{mode.description}</p>
                    </div>
                    <button className={`w-full py-3 rounded-lg bg-gradient-to-r ${mode.color} hover:shadow-lg transition-all font-semibold`}>
                      Select This Mode
                    </button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
          <div className="flex items-start space-x-3">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Mode Differences:</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><strong>Structured:</strong> Traditional interview - AI asks question → you answer → immediate feedback → next question</li>
                <li><strong>Conversation:</strong> Natural chat - have a full conversation → feedback given at the end with transcript</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!selectedRole) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-8 h-8 text-orange-400" />
            <div>
              <h1 className="text-4xl font-bold">Choose Your Role</h1>
              <p className="text-slate-400 mt-1">
                Mode: <span className="text-purple-400 font-semibold">
                  {modes.find(m => m.id === selectedMode)?.name}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedMode(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            ← Change Mode
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const questionCount = getQuestionsByRole(role.id).length;
            
            return (
              <div 
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className="cursor-pointer"
              >
                <Card hover>
                  <div className="space-y-4">
                    <div className="text-5xl">{role.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{role.name}</h3>
                      <p className="text-sm text-slate-400 mb-3">{role.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span>{questionCount} questions</span>
                        <span>•</span>
                        <span>{role.categories.join(', ')}</span>
                      </div>
                    </div>
                    <button className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg transition-all font-semibold">
                      Practice This Role
                    </button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const selectedRoleData = roles.find(r => r.id === selectedRole);
  const questions = getQuestionsByRole(selectedRole);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">{selectedRoleData.icon}</span>
          <div>
            <h1 className="text-3xl font-bold">{selectedRoleData.name} Interview</h1>
            <p className="text-slate-400">
              {selectedMode === 'conversation' ? 'Conversation Mode' : 'Structured Interview'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedRole(null);
            setSelectedMode(null);
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          ← Start Over
        </button>
      </div>

      {selectedMode === 'conversation' && (
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <p className="text-yellow-300 text-sm">
            <strong>Conversation Mode:</strong> Have a natural conversation with the AI. 
            Feedback and transcript will be provided at the end of the conversation.
          </p>
        </Card>
      )}

      <AIInterviewChat 
        questions={questions} 
        mode={selectedMode}
        role={selectedRoleData.name}
      />
    </div>
  );
};

export default InterviewSimulator;