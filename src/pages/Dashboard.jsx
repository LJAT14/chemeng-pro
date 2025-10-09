// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  BookOpen, 
  Award, 
  Briefcase,
  FileText,
  Volume2,
  Brain,
  History,
  LogOut,
  Flame,
  Target,
  TrendingUp,
  Settings as SettingsIcon,
  Library,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import ProgressTracking from '../components/ProgressTracking';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      setGreeting(getGreeting());
    }
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch gamification stats
      const { data: gamificationData } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats(gamificationData || {
        total_points: 0,
        lessons_completed: 0,
        vocabulary_learned: 0,
        current_streak: 0,
        essays_submitted: 0,
        perfect_pronunciations: 0,
      });

      setRecentActivity(activityData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const quickActions = [
    {
      title: 'Interview Practice',
      description: 'Practice common interview questions',
      icon: Briefcase,
      color: 'from-purple-500 to-pink-500',
      path: '/interview',
      stats: `${stats?.lessons_completed || 0} completed`,
    },
    {
      title: 'Pronunciation Lab',
      description: 'Perfect your pronunciation',
      icon: Mic,
      color: 'from-blue-500 to-cyan-500',
      path: '/pronunciation',
      stats: `${stats?.perfect_pronunciations || 0} perfect`,
    },
    {
      title: 'Writing Practice',
      description: 'Improve your writing skills',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      path: '/writing',
      stats: `${stats?.essays_submitted || 0} essays`,
    },
    {
      title: 'Grammar Hub',
      description: 'Master English grammar',
      icon: Brain,
      color: 'from-orange-500 to-red-500',
      path: '/grammar',
      stats: 'Learn & practice',
    },
    {
      title: 'Reading',
      description: 'Enhance reading comprehension',
      icon: BookOpen,
      color: 'from-indigo-500 to-purple-500',
      path: '/reading',
      stats: 'Build fluency',
    },
    {
      title: 'Vocabulary',
      description: 'Expand your vocabulary',
      icon: Volume2,
      color: 'from-pink-500 to-rose-500',
      path: '/vocabulary',
      stats: `${stats?.vocabulary_learned || 0} words`,
    },
    {
      title: 'Library',
      description: 'Access lessons and books',
      icon: Library,
      color: 'from-teal-500 to-green-500',
      path: '/library',
      stats: 'Books & lessons',
    },
    {
      title: 'History',
      description: 'View your learning history',
      icon: History,
      color: 'from-gray-500 to-slate-500',
      path: '/history',
      stats: 'Track progress',
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lesson_complete': return BookOpen;
      case 'vocabulary_learned': return Volume2;
      case 'pronunciation_practice': return Mic;
      case 'writing_submitted': return FileText;
      default: return Target;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'lesson_complete': return 'text-blue-400';
      case 'vocabulary_learned': return 'text-green-400';
      case 'pronunciation_practice': return 'text-purple-400';
      case 'writing_submitted': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {greeting}, {profile?.full_name || 'Student'}! 👋
            </h1>
            <p className="text-gray-300">Ready to continue your English learning journey?</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all border border-white/20"
            >
              <SettingsIcon className="w-5 h-5" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-all border border-red-500/30"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-white">{stats.total_points}</span>
            </div>
            <p className="text-gray-300 font-medium">Total Points</p>
            <p className="text-sm text-gray-400 mt-1">Keep learning to earn more!</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-white">{stats.lessons_completed}</span>
            </div>
            <p className="text-gray-300 font-medium">Lessons Completed</p>
            <p className="text-sm text-gray-400 mt-1">Great progress!</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/30 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-3xl font-bold text-white">{stats.current_streak}</span>
            </div>
            <p className="text-gray-300 font-medium">Day Streak</p>
            <p className="text-sm text-gray-400 mt-1">Don't break the chain! 🔥</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-3xl font-bold text-white">{stats.vocabulary_learned}</span>
            </div>
            <p className="text-gray-300 font-medium">Words Learned</p>
            <p className="text-sm text-gray-400 mt-1">Expand your vocabulary!</p>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {stats.current_streak >= 7 ? '🔥 You\'re on fire!' : '🎯 Keep up the momentum!'}
              </h3>
              <p className="text-gray-300">
                {stats.current_streak >= 7 
                  ? `Amazing! You've studied for ${stats.current_streak} days straight. Keep going!`
                  : 'Study a little every day to build consistency and see faster progress.'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracking Component */}
        <div className="mb-8">
          <ProgressTracking />
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Learning Activities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all hover:scale-105 text-left"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{action.description}</p>
                  <p className="text-xs text-purple-400 font-semibold">{action.stats}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.activity_type);
                  const colorClass = getActivityColor(activity.activity_type);
                  
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${colorClass}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {activity.activity_name || activity.activity_type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-400">
                          {activity.points} points • {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {activity.duration_minutes > 0 && (
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          {activity.duration_minutes}m
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No activity yet. Start learning to see your progress here!</p>
              </div>
            )}
          </div>

          {/* Study Tips */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-xl font-bold text-white mb-4">💡 Study Tips</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Study Daily</h4>
                  <p className="text-gray-300 text-sm">Even 15 minutes a day builds momentum and creates lasting habits.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Mix It Up</h4>
                  <p className="text-gray-300 text-sm">Practice different skills (reading, writing, speaking) for balanced improvement.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Review Regularly</h4>
                  <p className="text-gray-300 text-sm">Revisit vocabulary and concepts to move them into long-term memory.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-400 font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Track Progress</h4>
                  <p className="text-gray-300 text-sm">Watch your stats grow and celebrate small wins along the way!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;