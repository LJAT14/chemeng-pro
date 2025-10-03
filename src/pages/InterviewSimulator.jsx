import React, { useState } from 'react';
import { Briefcase, MessageCircle, Users, Code, BarChart, Building2 } from 'lucide-react';
import AIInterviewChat from '../components/interview/AIInterviewChat';
import Card from '../components/shared/Card';

// Interview modes
const modes = [
  {
    id: 'structured',
    name: 'Structured Interview',
    description: 'Traditional Q&A format with predefined questions',
    icon: Briefcase,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'conversational',
    name: 'Conversational Mode',
    description: 'Natural flowing conversation, transcript provided at end',
    icon: MessageCircle,
    color: 'from-purple-500 to-purple-600'
  }
];

// Role categories with questions
const roles = [
  {
    id: 'chemical-engineer',
    name: 'Chemical Engineer',
    icon: Building2,
    color: 'from-orange-500 to-red-500',
    questions: [
      "Describe your experience with process design and optimization.",
      "How do you approach troubleshooting a reactor that's not meeting specifications?",
      "Explain the principles of distillation and when you'd use it.",
      "What safety protocols do you follow when working with hazardous materials?",
      "Tell me about a time you improved process efficiency.",
      "How do you perform mass and energy balances?",
      "What's your experience with process simulation software?",
      "Describe a challenging chemical engineering project you've worked on."
    ]
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    icon: Code,
    color: 'from-green-500 to-emerald-500',
    questions: [
      "Describe your experience with full-stack development.",
      "How do you approach debugging a complex system issue?",
      "What's your preferred tech stack and why?",
      "Tell me about a time you optimized application performance.",
      "How do you ensure code quality in your projects?",
      "Describe your experience with API design.",
      "What's your approach to testing?",
      "How do you stay current with new technologies?"
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    icon: BarChart,
    color: 'from-blue-500 to-cyan-500',
    questions: [
      "Describe your experience with machine learning models.",
      "How do you handle missing or incomplete data?",
      "What's your approach to feature engineering?",
      "Tell me about a data analysis project you're proud of.",
      "How do you validate your models?",
      "Describe your experience with data visualization.",
      "What statistical methods do you use most often?",
      "How do you communicate findings to non-technical stakeholders?"
    ]
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    questions: [
      "How do you prioritize tasks when everything is high priority?",
      "Describe your experience managing cross-functional teams.",
      "How do you handle project delays or setbacks?",
      "What project management methodologies do you prefer?",
      "Tell me about a difficult stakeholder situation you resolved.",
      "How do you track and report project progress?",
      "Describe your approach to risk management.",
      "How do you motivate team members?"
    ]
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    icon: Briefcase,
    color: 'from-yellow-500 to-orange-500',
    questions: [
      "How do you gather and document requirements?",
      "Describe your experience with process improvement.",
      "How do you handle conflicting stakeholder requirements?",
      "What tools do you use for business analysis?",
      "Tell me about a time you identified a major business opportunity.",
      "How do you validate requirements with stakeholders?",
      "Describe your approach to creating user stories.",
      "How do you measure the success of your recommendations?"
    ]
  },
  {
    id: 'general',
    name: 'General Conversation',
    icon: MessageCircle,
    color: 'from-gray-500 to-slate-500',
    questions: [
      "Tell me about yourself and your background.",
      "What are your career goals?",
      "Why are you interested in this field?",
      "What's your biggest professional achievement?",
      "How do you handle workplace challenges?",
      "Describe your ideal work environment.",
      "What skills would you like to develop?",
      "How do you balance work and personal life?"
    ]
  }
];

const InterviewSimulator = () => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode.id);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id);
    setInterviewStarted(true);
  };

  const handleBack = () => {
    if (interviewStarted) {
      setInterviewStarted(false);
      setSelectedRole(null);
    } else if (selectedMode) {
      setSelectedMode(null);
    }
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  // Show interview chat
  if (interviewStarted && selectedRoleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            ← Back to Role Selection
          </button>
          
          <AIInterviewChat 
            questions={selectedRoleData.questions}
          />
        </div>
      </div>
    );
  }

  // Show role selection
  if (selectedMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            ← Back to Mode Selection
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Select Your Role
            </h1>
            <p className="text-xl text-gray-300">
              Choose the interview type that matches your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className="text-left w-full transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl"
                >
                  <Card className="h-full p-6 hover:shadow-2xl hover:shadow-purple-500/20 bg-white/5 backdrop-blur border border-white/10">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {role.name}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {role.questions.length} tailored questions
                    </p>
                  </Card>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Show mode selection (initial screen)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Interview Simulator
          </h1>
          <p className="text-xl text-gray-300">
            Practice with AI-powered interview scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => handleModeSelect(mode)}
                className="text-left w-full transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl"
              >
                <Card className="h-full p-8 hover:shadow-2xl hover:shadow-purple-500/20 bg-white/5 backdrop-blur border border-white/10">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {mode.name}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {mode.description}
                  </p>
                </Card>
              </button>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/20 rounded-full border border-purple-500/30">
            <MessageCircle className="w-5 h-5 text-purple-300" />
            <span className="text-purple-200">
              Voice recording and AI feedback powered by Groq & ElevenLabs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSimulator;