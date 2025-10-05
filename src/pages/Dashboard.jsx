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
  BarChart3,
  Play,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
      fetchUserStats();
      fetchRecentSessions();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setStats({
          totalInterviews: data.total_interviews || 0,
          practiceTime: data.total_practice_time || 0,
          currentStreak: data.current_streak || 0,
          longestStreak: data.longest_streak || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const quickActions = [
    {
      title: 'Start Interview',
      description: 'Practice with AI interviewer',
      icon: Briefcase,
      color: 'from-purple-500 to-pink-500',
      path: '/interview',
    },
    {
      title: 'Pronunciation Lab',
      description: 'Improve your pronunciation',
      icon: Mic,
      color: 'from-blue-500 to-cyan-500',
      path: '/pronunciation',
    },
    {
      title: 'Vocabulary Builder',
      description: 'Expand technical vocabulary',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      path: '/vocabulary',
    },
    {
      title: 'Grammar Hub',
      description: 'Master English grammar',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      path: '/grammar',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ChemEng Pro</h1>
                <p className="text-xs text-gray-400">AI Interview Practice</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-white text-sm font-medium">{user?.email}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all text-white"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Student'}! 👋
          </h2>
          <p className="text-gray-400">
            Ready to practice? Let's continue improving your interview skills.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Interviews</h3>
            <p className="text-3xl font-bold text-white">{stats.totalInterviews}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Practice Time</h3>
            <p className="text-3xl font-bold text-white">{stats.practiceTime} min</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-orange-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Current Streak</h3>
            <p className="text-3xl font-bold text-white">{stats.currentStreak} days</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-pink-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Longest Streak</h3>
            <p className="text-3xl font-bold text-white">{stats.longestStreak} days</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all text-left hover:scale-105 transform"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-white font-semibold text-lg mb-2">{action.title}</h4>
                  <p className="text-gray-400 text-sm mb-4">{action.description}</p>
                  <div className="flex items-center text-purple-400 font-medium text-sm group-hover:gap-2 gap-1 transition-all">
                    Start Now
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Recent Activity</h3>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-400 text-sm mt-4">Loading...</p>
                </div>
              ) : recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Play className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">
                          Interview Session
                        </p>
                        <p className="text-gray-400 text-xs">
                          {session.questions_answered || 0} questions answered
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(session.started_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        session.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {session.status}
                      </div>
                    </div>
                  ))}
                  </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No recent activity</p>
                  <p className="text-gray-500 text-xs mt-1">Start an interview to see your progress here</p>
                </div>
              )}
            </div>

            {/* Progress Chart Placeholder */}
            <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Weekly Progress</h4>
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <div className="h-32 flex items-end justify-between gap-2">
                {[20, 45, 30, 60, 35, 70, 50].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Keep up the great work! 🎉
          </h3>
          <p className="text-purple-100 mb-4">
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
