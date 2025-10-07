// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock, 
  Target, 
  LogOut,
  Briefcase,
  Flame,
  Calendar,
  ChevronRight,
  BarChart3,
  FileText,
  Headphones,
  Book,
  Zap,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import GamificationDashboard from '../components/GamificationDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    practiceTime: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch user progress stats
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressData) {
        setStats({
          totalInterviews: progressData.total_interviews || 0,
          practiceTime: progressData.total_practice_time || 0,
          currentStreak: progressData.current_streak || 0,
          longestStreak: progressData.longest_streak || 0,
        });
      }

      // Fetch recent interview sessions
      const { data: sessionsData } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(5);

      if (sessionsData) {
        setRecentSessions(sessionsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const quickActions = [
    {
      icon: Briefcase,
      title: 'Interview Practice',
      description: 'Simulate real interviews',
      path: '/interview',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Mic,
      title: 'Pronunciation Lab',
      description: 'Perfect your accent',
      path: '/pronunciation',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: FileText,
      title: 'Writing Practice',
      description: 'Improve your essays',
      path: '/writing',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: BookOpen,
      title: 'Grammar Hub',
      description: 'Master grammar rules',
      path: '/grammar',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Headphones,
      title: 'Reading & Listening',
      description: 'Comprehension exercises',
      path: '/reading',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Target,
      title: 'Vocabulary Builder',
      description: 'Expand your word bank',
      path: '/vocabulary',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Book,
      title: 'Library',
      description: 'Books & lessons',
      path: '/library',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Interview History',
      description: 'Review past sessions',
      path: '/history',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Student'}! 👋
            </h1>
            <p className="text-gray-300">Ready to continue your English learning journey?</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-lg border border-orange-500/30">
              <Flame className="w-5 h-5 text-orange-400" />
              <div>
                <div className="text-xs text-gray-400">Current Streak</div>
                <div className="text-lg font-bold text-white">{stats.currentStreak} days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-gray-400 text-sm">Interviews</div>
                <div className="text-2xl font-bold text-white">{stats.totalInterviews}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-gray-400 text-sm">Practice Time</div>
                <div className="text-2xl font-bold text-white">{formatTime(stats.practiceTime)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-gray-400 text-sm">Current Streak</div>
                <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-gray-400 text-sm">Longest Streak</div>
                <div className="text-2xl font-bold text-white">{stats.longestStreak}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Gamification Dashboard */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Your Progress
          </h2>
          <GamificationDashboard />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500 transition-all text-left"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sessions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Recent Sessions
              </h3>
              <button
                onClick={() => navigate('/history')}
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentSessions.length > 0 ? (
                recentSessions.map((session, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer"
                    onClick={() => navigate('/history')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-medium">
                        Interview Session
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        session.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {session.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{formatDate(session.started_at)}</span>
                      <span>•</span>
                      <span>{session.questions_answered || 0} / {session.total_questions || 0} questions</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No recent activity</p>
                  <p className="text-gray-500 text-xs mt-1">Start an interview to see your progress here</p>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Weekly Progress
              </h3>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {[20, 45, 30, 60, 35, 70, 50].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all hover:opacity-80 cursor-pointer group relative"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                      {height} min
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Keep up the great work! 🎉
          </h3>
          <p className="text-purple-100 mb-6">
            You're making excellent progress. Practice daily to maintain your streak!
          </p>
          <button
            onClick={() => navigate('/interview')}
            className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all inline-flex items-center gap-2"
          >
            Start Practice Session
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;