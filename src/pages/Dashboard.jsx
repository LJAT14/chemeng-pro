import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { TrendingUp, Award, Clock, Target, BookOpen, Mic2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/shared/Card';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalPracticeTime: 0,
    currentStreak: 0,
    longestStreak: 0
  });
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
    fetchRecentInterviews();
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setStats({
          totalInterviews: data.total_interviews || 0,
          totalPracticeTime: data.total_practice_time || 0,
          currentStreak: data.current_streak || 0,
          longestStreak: data.longest_streak || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentInterviews = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(5);

      if (data) {
        setRecentInterviews(data);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user?.user_metadata?.full_name || 'Student'}!
            </h1>
            <p className="text-gray-300">Here's your learning progress</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-300" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-300" />
            </div>
            <p className="text-blue-200 text-sm mb-1">Total Interviews</p>
            <p className="text-3xl font-bold text-white">{stats.totalInterviews}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/30 rounded-lg">
                <Clock className="w-6 h-6 text-purple-300" />
              </div>
            </div>
            <p className="text-purple-200 text-sm mb-1">Practice Time</p>
            <p className="text-3xl font-bold text-white">{formatTime(stats.totalPracticeTime)}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/30 rounded-lg">
                <Target className="w-6 h-6 text-green-300" />
              </div>
            </div>
            <p className="text-green-200 text-sm mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-white">{stats.currentStreak} days</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/30 rounded-lg">
                <Award className="w-6 h-6 text-orange-300" />
              </div>
            </div>
            <p className="text-orange-200 text-sm mb-1">Longest Streak</p>
            <p className="text-3xl font-bold text-white">{stats.longestStreak} days</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/interviews')}
              className="p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl hover:scale-105 transition-transform"
            >
              <Mic2 className="w-12 h-12 text-purple-300 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Start Interview</h3>
              <p className="text-gray-300 text-sm">Practice with AI mock interviews</p>
            </button>

            <button
              onClick={() => navigate('/pronunciation')}
              className="p-6 bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 rounded-xl hover:scale-105 transition-transform"
            >
              <BookOpen className="w-12 h-12 text-green-300 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Pronunciation Lab</h3>
              <p className="text-gray-300 text-sm">Practice 50 technical terms</p>
            </button>

            <button
              onClick={() => navigate('/vocabulary')}
              className="p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl hover:scale-105 transition-transform"
            >
              <Award className="w-12 h-12 text-orange-300 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Vocabulary</h3>
              <p className="text-gray-300 text-sm">Expand your technical vocabulary</p>
            </button>
          </div>
        </div>

        {/* Recent Interviews */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Interviews</h2>
          {recentInterviews.length > 0 ? (
            <div className="space-y-4">
              {recentInterviews.map((interview) => (
                <Card key={interview.id} className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">
                        {interview.status === 'completed' ? 'Completed Interview' : 'In Progress'}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(interview.started_at).toLocaleDateString()} at{' '}
                        {new Date(interview.started_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-300 font-semibold">
                        {interview.questions_answered || 0}/{interview.total_questions} questions
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {interview.status === 'completed' ? 'Complete' : 'In Progress'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 bg-white/5 border-white/10 text-center">
              <p className="text-gray-400 text-lg">No interviews yet</p>
              <p className="text-gray-500 text-sm mt-2">Start your first interview to see your progress here</p>
              <button
                onClick={() => navigate('/interviews')}
                className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
              >
                Start First Interview
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;