// src/pages/InterviewHistory.jsx
import React, { useState, useEffect } from 'react';
import { Search, Calendar, TrendingUp, ChevronDown, Eye, Trash2, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import PageWrapper from '../components/PageWrapper';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';

const InterviewHistory = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedSession, setExpandedSession] = useState(null);
  const [sessionAnswers, setSessionAnswers] = useState({});

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchTerm, filterStatus]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Could not load interview history');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionAnswers = async (sessionId) => {
    if (sessionAnswers[sessionId]) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('interview_answers')
        .select('*')
        .eq('session_id', sessionId)
        .order('question_number', { ascending: true });

      if (error) throw error;

      setSessionAnswers(prev => ({
        ...prev,
        [sessionId]: data || []
      }));
    } catch (error) {
      console.error('Error fetching answers:', error);
      toast.error('Could not load interview details');
    }
  };

  const filterSessions = () => {
    let filtered = sessions;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        new Date(s.started_at).toLocaleDateString().toLowerCase().includes(term) ||
        s.status.toLowerCase().includes(term)
      );
    }

    setFilteredSessions(filtered);
  };

  const toggleSession = async (sessionId) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
      await fetchSessionAnswers(sessionId);
    }
  };

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this interview session?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('interview_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast.success('Interview session deleted');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Could not delete session');
    }
  };

  const downloadTranscript = (session, e) => {
    e.stopPropagation();
    
    const answers = sessionAnswers[session.id] || [];
    let transcript = `Interview Session - ${new Date(session.started_at).toLocaleString()}\n`;
    transcript += `Status: ${session.status}\n`;
    transcript += `Questions Answered: ${session.questions_answered}\n\n`;
    transcript += '='.repeat(50) + '\n\n';

    answers.forEach((answer, idx) => {
      transcript += `Question ${idx + 1}:\n${answer.question_text}\n\n`;
      transcript += `Your Answer:\n${answer.user_answer}\n\n`;
      if (answer.ai_feedback) {
        transcript += `AI Feedback:\n${answer.ai_feedback}\n\n`;
      }
      transcript += '-'.repeat(50) + '\n\n';
    });

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${new Date(session.started_at).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Transcript downloaded');
  };

  const calculateDuration = (startedAt, completedAt) => {
    if (!completedAt) return 'In progress';
    
    const start = new Date(startedAt);
    const end = new Date(completedAt);
    const minutes = Math.floor((end - start) / 60000);
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <PageWrapper title="Interview History" subtitle="Review your past interview sessions">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Interview History" subtitle="Review your past interview sessions and track your progress">
      <div className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">Total Sessions</p>
            <p className="text-3xl font-bold text-white">{sessions.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-400">
              {sessions.filter(s => s.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">In Progress</p>
            <p className="text-3xl font-bold text-yellow-400">
              {sessions.filter(s => s.status === 'in_progress').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by date or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No interview sessions found</h3>
            <p className="text-gray-400">Start your first interview to see it here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden hover:border-purple-500 transition-all"
              >
                <button
                  onClick={() => toggleSession(session.id)}
                  className="w-full p-4 sm:p-6 flex items-center justify-between text-left hover:bg-white/5 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-white font-semibold text-lg">
                        Interview Session
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        session.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.started_at).toLocaleDateString()}
                      </span>
                      <span>{session.questions_answered || 0} questions</span>
                      <span>{calculateDuration(session.started_at, session.completed_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => downloadTranscript(session, e)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                      title="Download transcript"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => deleteSession(session.id, e)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-all text-gray-400 hover:text-red-400"
                      title="Delete session"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedSession === session.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {expandedSession === session.id && (
                  <div className="border-t border-white/20 p-4 sm:p-6 bg-white/5">
                    {sessionAnswers[session.id] ? (
                      <div className="space-y-4">
                        {sessionAnswers[session.id].map((answer, idx) => (
                          <div key={answer.id} className="bg-white/5 rounded-lg p-4">
                            <div className="mb-3">
                              <span className="text-purple-400 font-semibold text-sm">
                                Question {idx + 1}
                              </span>
                              <p className="text-white mt-1">{answer.question_text}</p>
                            </div>
                            <div className="mb-3">
                              <span className="text-blue-400 font-semibold text-sm">Your Answer</span>
                              <p className="text-gray-300 mt-1">{answer.user_answer}</p>
                              <p className="text-gray-500 text-xs mt-1">
                                {answer.word_count} words
                              </p>
                            </div>
                            {answer.ai_feedback && (
                              <div>
                                <span className="text-green-400 font-semibold text-sm">AI Feedback</span>
                                <p className="text-gray-300 mt-1">{answer.ai_feedback}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default InterviewHistory;