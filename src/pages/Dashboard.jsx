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
  ChevronRight,
  FileText,
  Headphones
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import PageWrapper from '../components/PageWrapper';
import { LoadingSpinner } from '../components/LoadingSpinner';

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
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserStats();
      fetchRecentSessions();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (data && data.full_name) {
        setUserName(data.full_name);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUserName(user?.email?.split('@')[0] || 'Student');
    }
  };

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
      title: 'Writing Practice',
      description: 'TOEFL & technical writing',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      path: '/writing',
    },
    {
      title: 'Reading Practice',
      description: 'Articles with audio',
      icon: Headphones,
      color: 'from-orange-500 to-red-500',
      path: '/reading',
    },
  ];

  const weeklyData = [
    { day: 'Mon', minutes: 20 },
    { day: 'Tue', minutes: 45 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 60 },
    { day: 'Fri', minutes: 35 },
    { day: 'Sat', minutes: 70 },
    { day: 'Sun', minutes: 50 },
  ];

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes));

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Welcome back, {userName || 'Student'}! 👋
          </h2>
          <p className="text-gray-400">
            Ready to practice? Let's continue improving your skills.
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/10 rounded-2xl p-6 animate-pulse">
                <div className="h-12 bg-white/20 rounded mb-4"></div>
                <div className="h-8 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-purple-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Total Interviews</h3>
              <p className="text-3xl sm:text-4xl font-bold text-white">{stats.totalInterviews}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-blue-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Practice Time</h3>
              <p className="text-3xl sm:text-4xl font-bold text-white">{stats.practiceTime} min</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-orange-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Current Streak</h3>
              <p className="text-3xl sm:text-4xl font-bold text-white">{stats.currentStreak} days</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-pink-500 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-pink-400" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Longest Streak</h3>
              <p className="text-3xl sm:text-4xl font-bold text-white">{stats.longestStreak} days</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
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
                  className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all text-left hover:scale-105 transform"
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Recent Activity</h3>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                {recentSessions.length > 0 ? (
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
                    <p className="text-gray-500 text-xs mt-1">Start practicing to see your progress</p>
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Weekly Progress</h4>
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <div className="h-32 flex items-end justify-between gap-2">
                {weeklyData.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${(item.minutes / maxMinutes) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {item.day[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {stats.currentStreak > 0 ? `${stats.currentStreak} day streak! 🔥` : 'Start your streak today! 🎯'}
          </h3>
          <p className="text-purple-100 mb-4">
            {stats.currentStreak > 0 
              ? "Keep it going! Practice daily to maintain your streak." 
              : "Practice daily to build momentum and see faster progress."}
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
    </PageWrapper>
  );
};

export default Dashboard;