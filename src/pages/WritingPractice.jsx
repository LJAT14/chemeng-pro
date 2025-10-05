 import React, { useState, useEffect } from 'react';
import { FileText, Send, Clock, Target, BookOpen, Award } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';
import PageWrapper from '../components/PageWrapper';
import { useToast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';

const writingPrompts = {
  toefl: [
    {
      id: 1,
      title: 'TOEFL Independent Task',
      prompt: 'Do you agree or disagree with the following statement? "Technology has made our lives more complicated rather than simpler." Use specific reasons and examples to support your answer.',
      timeLimit: 30,
      wordTarget: 300,
      type: 'opinion'
    },
    {
      id: 2,
      title: 'TOEFL Integrated Task',
      prompt: 'Summarize the points made in the lecture, explaining how they cast doubt on the points made in the reading passage about renewable energy sources.',
      timeLimit: 20,
      wordTarget: 225,
      type: 'integrated'
    },
    {
      id: 3,
      title: 'TOEFL Independent - Preference',
      prompt: 'Some people prefer to work independently, while others prefer to work in a team. Which do you prefer? Use specific reasons and examples.',
      timeLimit: 30,
      wordTarget: 300,
      type: 'preference'
    }
  ],
  technical: [
    {
      id: 4,
      title: 'Process Description',
      prompt: 'Write a detailed description of the distillation process in a chemical plant. Include safety considerations and key parameters.',
      timeLimit: 25,
      wordTarget: 250,
      type: 'technical'
    },
    {
      id: 5,
      title: 'Lab Report Summary',
      prompt: 'Write an abstract for a lab report investigating the effects of temperature on reaction rates in exothermic reactions.',
      timeLimit: 15,
      wordTarget: 150,
      type: 'academic'
    },
    {
      id: 6,
      title: 'Problem-Solution Essay',
      prompt: 'Discuss a common safety issue in chemical engineering facilities and propose solutions to address it.',
      timeLimit: 30,
      wordTarget: 300,
      type: 'problem-solution'
    }
  ],
  business: [
    {
      id: 7,
      title: 'Professional Email',
      prompt: 'Write an email to your supervisor explaining a delay in a project and proposing a revised timeline.',
      timeLimit: 15,
      wordTarget: 200,
      type: 'email'
    },
    {
      id: 8,
      title: 'Project Proposal',
      prompt: 'Write a brief proposal for implementing a new safety protocol in your department.',
      timeLimit: 20,
      wordTarget: 250,
      type: 'proposal'
    }
  ]
};

const WritingPractice = () => {
  const [selectedCategory, setSelectedCategory] = useState('toefl');
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [essay, setEssay] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const { sendMessage } = useAIChat();
  const toast = useToast();

  // Auto-save draft every 3 seconds
  useEffect(() => {
    if (essay && selectedPrompt) {
      const timer = setTimeout(() => {
        const draftKey = `draft_${selectedPrompt.id}`;
        localStorage.setItem(draftKey, essay);
        setLastSaved(new Date());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [essay, selectedPrompt]);

  // Load saved draft when prompt is selected
  useEffect(() => {
    if (selectedPrompt) {
      const draftKey = `draft_${selectedPrompt.id}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        setEssay(savedDraft);
        toast.info('Draft loaded from previous session');
      }
    }
  }, [selectedPrompt]);

  const startWriting = (prompt) => {
    setSelectedPrompt(prompt);
    setEssay('');
    setFeedback(null);
    setTimeRemaining(prompt.timeLimit * 60);
    setIsTimerActive(true);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const submitEssay = async () => {
    if (!essay.trim()) {
      toast.error('Please write something before submitting');
      return;
    }

    setLoading(true);
    setIsTimerActive(false);
    toast.info('Submitting your essay for AI feedback...');

    const wordCount = essay.trim().split(/\s+/).length;
    const prompt = `You are an English writing instructor. Evaluate this essay and provide detailed feedback.

Essay Prompt: ${selectedPrompt.prompt}

Student's Essay:
${essay}

Word Count: ${wordCount} (Target: ${selectedPrompt.wordTarget})

Please provide:
1. Overall Score (out of 10)
2. Grammar and Mechanics (identify specific errors)
3. Content and Ideas (assess relevance and depth)
4. Organization and Structure
5. Vocabulary and Style
6. Specific suggestions for improvement
7. Corrected version of major errors

Be constructive and specific.`;

    try {
      const response = await sendMessage(prompt);
      setFeedback({
        text: response,
        wordCount,
        score: extractScore(response)
      });
      
      // Clear draft after submission
      const draftKey = `draft_${selectedPrompt.id}`;
      localStorage.removeItem(draftKey);
      toast.success('Feedback received!');
    } catch (error) {
      toast.error('Failed to get feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const extractScore = (text) => {
    const match = text.match(/score:?\s*(\d+)\/10/i);
    return match ? parseInt(match[1]) : null;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  return (
    <PageWrapper title="Writing Practice" subtitle="Improve your writing skills with structured practice and AI feedback">
      <div className="space-y-6">
        {!selectedPrompt ? (
          <>
            {/* Category Selection */}
            <div className="flex gap-3 flex-wrap">
              {Object.keys(writingPrompts).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {category === 'toefl' ? 'TOEFL' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Prompt Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {writingPrompts[selectedCategory].map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500 transition-all cursor-pointer"
                  onClick={() => startWriting(prompt)}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">{prompt.title}</h3>
                      <p className="text-gray-400 text-sm">{prompt.type}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{prompt.prompt}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      {prompt.timeLimit} min
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Target className="w-4 h-4" />
                      {prompt.wordTarget} words
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Writing Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Writing Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Prompt Display */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-4">{selectedPrompt.title}</h2>
                  <p className="text-gray-300 mb-4">{selectedPrompt.prompt}</p>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>Time Limit: {selectedPrompt.timeLimit} minutes</span>
                    <span>Target: {selectedPrompt.wordTarget} words</span>
                  </div>
                </div>

                {/* Text Editor */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h3 className="text-white font-semibold text-lg">Your Essay</h3>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`text-sm ${wordCount < selectedPrompt.wordTarget ? 'text-yellow-400' : 'text-green-400'}`}>
                        {wordCount} / {selectedPrompt.wordTarget} words
                      </span>
                      {lastSaved && (
                        <span className="text-xs text-gray-500">
                          Saved {new Date(lastSaved).toLocaleTimeString()}
                        </span>
                      )}
                      {isTimerActive && (
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                          timeRemaining < 300 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          <Clock className="w-4 h-4" />
                          {formatTime(timeRemaining)}
                        </div>
                      )}
                    </div>
                  </div>

                  <textarea
                    value={essay}
                    onChange={(e) => setEssay(e.target.value)}
                    className="w-full h-96 bg-white/5 border border-white/20 rounded-xl p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Start writing your essay here..."
                  />

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={submitEssay}
                      disabled={loading || !essay.trim()}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" color="white" />
                          Getting Feedback...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit for Feedback
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPrompt(null);
                        setIsTimerActive(false);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar - Tips & Feedback */}
              <div className="space-y-6">
                {/* Writing Tips */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <h3 className="text-white font-semibold">Writing Tips</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Start with a clear thesis statement</li>
                    <li>• Use topic sentences for each paragraph</li>
                    <li>• Provide specific examples</li>
                    <li>• Use transition words</li>
                    <li>• Conclude by restating your main point</li>
                  </ul>
                </div>

                {/* AI Feedback */}
                {feedback && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-white font-semibold">AI Feedback</h3>
                    </div>

                    {feedback.score && (
                      <div className="mb-4 text-center">
                        <div className="text-4xl font-bold text-purple-400">{feedback.score}/10</div>
                        <div className="text-gray-400 text-sm">Overall Score</div>
                      </div>
                    )}

                    <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">{feedback.text}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                      <span>Words: {feedback.wordCount}</span>
                      <button
                        onClick={() => {
                          setSelectedPrompt(null);
                          setFeedback(null);
                          setEssay('');
                        }}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Try Another Prompt
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default WritingPractice;