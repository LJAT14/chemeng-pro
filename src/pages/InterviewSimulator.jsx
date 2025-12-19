import React, { useState } from 'react';
import { 
  Briefcase, MessageCircle, Users, Code, BarChart, Building2, 
  Coffee, Heart, Lightbulb, Wrench, GraduationCap, TrendingUp,
  ArrowLeft, PlayCircle
} from 'lucide-react';
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

// Helper function to convert simple strings to the format AIInterviewChat expects
const formatQuestions = (questionStrings, roleId) => {
  return questionStrings.map((q, index) => ({
    id: `${roleId}-${index + 1}`,
    question: {
      en: q,
      pt: q // Add Portuguese translations later if needed
    },
    category: 'general'
  }));
};

// Role categories with questions
const roles = [
  {
    id: 'chemical-engineer',
    name: 'Chemical Engineer',
    icon: Building2,
    color: 'from-orange-500 to-red-500',
    category: 'Technical',
    questionStrings: [
      "Describe your experience with process design and optimization.",
      "How do you approach troubleshooting a reactor that's not meeting specifications?",
      "Explain the principles of distillation and when you'd use it.",
      "What safety protocols do you follow when working with hazardous materials?",
      "Tell me about a time you improved process efficiency.",
      "How do you perform mass and energy balances?",
      "What's your experience with process simulation software like Aspen Plus or HYSYS?",
      "Describe a challenging chemical engineering project you've worked on.",
      "How do you ensure compliance with environmental regulations?",
      "What's your approach to scale-up from lab to production?"
    ]
  },
  {
    id: 'process-engineer',
    name: 'Process Engineer',
    icon: Wrench,
    color: 'from-cyan-500 to-blue-500',
    category: 'Technical',
    questionStrings: [
      "How do you optimize existing processes for better efficiency?",
      "Describe your experience with heat exchangers and their design.",
      "What tools do you use for process flow diagrams?",
      "Tell me about a time you reduced production costs.",
      "How do you handle process deviations?",
      "What's your experience with Six Sigma or Lean methodologies?",
      "Describe how you conduct root cause analysis.",
      "How do you ensure process safety in your designs?"
    ]
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    icon: Code,
    color: 'from-green-500 to-emerald-500',
    category: 'Technical',
    questionStrings: [
      "Describe your experience with full-stack development.",
      "How do you approach debugging a complex system issue?",
      "What's your preferred tech stack and why?",
      "Tell me about a time you optimized application performance.",
      "How do you ensure code quality in your projects?",
      "Describe your experience with API design and RESTful services.",
      "What's your approach to testing?",
      "How do you stay current with new technologies?",
      "Explain your experience with version control and CI/CD.",
      "How do you handle technical debt?"
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    icon: BarChart,
    color: 'from-blue-500 to-cyan-500',
    category: 'Technical',
    questionStrings: [
      "Describe your experience with machine learning models.",
      "How do you handle missing or incomplete data?",
      "What's your approach to feature engineering?",
      "Tell me about a data analysis project you're proud of.",
      "How do you validate your models and prevent overfitting?",
      "Describe your experience with data visualization tools.",
      "What statistical methods do you use most often?",
      "How do you communicate findings to non-technical stakeholders?",
      "What's your experience with big data technologies?",
      "How do you approach A/B testing?"
    ]
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    category: 'Management',
    questionStrings: [
      "How do you prioritize tasks when everything is high priority?",
      "Describe your experience managing cross-functional teams.",
      "How do you handle project delays or setbacks?",
      "What project management methodologies do you prefer?",
      "Tell me about a difficult stakeholder situation you resolved.",
      "How do you track and report project progress?",
      "Describe your approach to risk management.",
      "How do you motivate team members?",
      "What tools do you use for project management?",
      "How do you handle scope creep?"
    ]
  },
  {
    id: 'team-lead',
    name: 'Team Lead',
    icon: Users,
    color: 'from-indigo-500 to-purple-500',
    category: 'Management',
    questionStrings: [
      "How do you delegate tasks effectively?",
      "Describe a time you resolved a conflict within your team.",
      "How do you provide constructive feedback?",
      "What's your approach to mentoring junior team members?",
      "How do you balance technical work with leadership responsibilities?",
      "Tell me about a time you had to make an unpopular decision.",
      "How do you foster innovation in your team?",
      "What's your leadership style?"
    ]
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    icon: Briefcase,
    color: 'from-yellow-500 to-orange-500',
    category: 'Business',
    questionStrings: [
      "How do you gather and document requirements?",
      "Describe your experience with process improvement.",
      "How do you handle conflicting stakeholder requirements?",
      "What tools do you use for business analysis?",
      "Tell me about a time you identified a major business opportunity.",
      "How do you validate requirements with stakeholders?",
      "Describe your approach to creating user stories.",
      "How do you measure the success of your recommendations?",
      "What's your experience with data analytics?",
      "How do you present findings to executives?"
    ]
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    icon: Lightbulb,
    color: 'from-rose-500 to-pink-500',
    category: 'Business',
    questionStrings: [
      "How do you prioritize features in a product roadmap?",
      "Describe your experience with user research.",
      "How do you define product success metrics?",
      "Tell me about a product launch you led.",
      "How do you balance user needs with business goals?",
      "What frameworks do you use for product decisions?",
      "How do you work with engineering teams?",
      "Describe your approach to competitive analysis."
    ]
  },
  {
    id: 'general-professional',
    name: 'General Professional',
    icon: MessageCircle,
    color: 'from-gray-500 to-slate-500',
    category: 'General',
    questionStrings: [
      "Tell me about yourself and your background.",
      "What are your career goals for the next 5 years?",
      "Why are you interested in this field?",
      "What's your biggest professional achievement?",
      "How do you handle workplace challenges?",
      "Describe your ideal work environment.",
      "What skills would you like to develop?",
      "How do you balance work and personal life?",
      "Tell me about a time you failed and what you learned.",
      "What motivates you in your work?"
    ]
  },
  {
    id: 'casual-conversation',
    name: 'Casual Conversation',
    icon: Coffee,
    color: 'from-amber-500 to-yellow-500',
    category: 'General',
    questionStrings: [
      "What do you enjoy doing in your free time?",
      "Tell me about a book or article you read recently.",
      "What's something interesting you've learned lately?",
      "How do you stay motivated and productive?",
      "What are you passionate about?",
      "Tell me about a recent accomplishment you're proud of.",
      "What's your approach to learning new things?",
      "How do you handle stress?",
      "What's important to you in a workplace culture?",
      "Where do you see yourself growing professionally?"
    ]
  },
  {
    id: 'behavioral-interview',
    name: 'Behavioral Interview',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    category: 'General',
    questionStrings: [
      "Tell me about a time you had to work with a difficult colleague.",
      "Describe a situation where you had to meet a tight deadline.",
      "How do you handle criticism?",
      "Tell me about a time you showed leadership.",
      "Describe a situation where you had to learn something quickly.",
      "How do you prioritize when you have multiple urgent tasks?",
      "Tell me about a time you made a mistake. What did you learn?",
      "Describe a situation where you had to adapt to change.",
      "How do you handle disagreements with your manager?",
      "Tell me about a time you went above and beyond."
    ]
  },
  {
    id: 'student-intern',
    name: 'Student/Intern',
    icon: GraduationCap,
    color: 'from-green-500 to-teal-500',
    category: 'General',
    questionStrings: [
      "What interests you about this field of study or work?",
      "Describe a challenging course or project you've completed.",
      "How do you balance academics with other activities?",
      "What skills from your studies are you eager to apply?",
      "Tell me about a group project you worked on.",
      "What are you hoping to learn from this experience?",
      "How do you approach learning new concepts?",
      "What's your favorite subject and why?",
      "Describe a time you had to meet a difficult academic deadline.",
      "What are your career aspirations?"
    ]
  }
];

const InterviewSimulator = () => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const handleModeSelect = (mode) => {
    console.log('Mode selected:', mode.id);
    setSelectedMode(mode.id);
  };

  const handleRoleSelect = (role) => {
    console.log('Role selected:', role.id);
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
    // Convert question strings to the format AIInterviewChat expects
    const formattedQuestions = formatQuestions(
      selectedRoleData.questionStrings, 
      selectedRoleData.id
    );
    
    console.log('Starting interview with formatted questions:', formattedQuestions);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Role Selection
          </button>
          
          <div className="mb-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedRoleData.color} flex items-center justify-center`}>
                {React.createElement(selectedRoleData.icon, { className: 'w-6 h-6 text-white' })}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedRoleData.name}</h2>
                <p className="text-gray-300 text-sm">{selectedRoleData.questionStrings.length} questions</p>
              </div>
            </div>
          </div>
          
          <AIInterviewChat 
            questions={formattedQuestions}
            mode={selectedMode}
          />
        </div>
      </div>
    );
  }

  // Show role selection
  if (selectedMode) {
    const groupedRoles = roles.reduce((acc, role) => {
      if (!acc[role.category]) {
        acc[role.category] = [];
      }
      acc[role.category].push(role);
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBack}
            className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mode Selection
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Select Your Interview Scenario
            </h1>
            <p className="text-xl text-gray-300">
              Choose from {roles.length} different interview types
            </p>
          </div>

          {Object.entries(groupedRoles).map(([category, categoryRoles]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                {category} Roles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryRoles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role)}
                      className="text-left w-full transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl"
                    >
                      <Card className="h-full p-6 hover:shadow-2xl hover:shadow-purple-500/20 bg-white/5 backdrop-blur border border-white/10">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {role.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-2">
                          {role.questionStrings.length} questions
                        </p>
                        <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                          <PlayCircle className="w-4 h-4" />
                          <span>Start Interview</span>
                        </div>
                      </Card>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show mode selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Interview Simulator
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Practice with AI-powered interview scenarios
          </p>
          <p className="text-gray-400">
            {roles.length} interview scenarios available
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