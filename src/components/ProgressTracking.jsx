// src/components/ProgressTracking.jsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Clock, Award, BookOpen, Mic, FileText, Brain } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const ProgressTracking = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const fetchProgressData = async () => {
    try {
      // Fetch gamification stats
      const { data: gamificationData } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch activity logs for the past 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: activityData } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      // Process weekly data
      const weeklyStats = processWeeklyData(activityData || []);
      
      setStats(gamificationData || {
        total_points: 0,
        lessons_completed: 0,
        vocabulary_learned: 0,
        essays_submitted: 0,
        current_streak: 0,
        study_time_minutes: 0,
      });

      setWeeklyData(weeklyStats);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processWeeklyData = (activities) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.created_at);
        return activityDate.toDateString() === date.toDateString();
      });

      const points = dayActivities.reduce((sum, activity) => sum + (activity.points || 0), 0);
      const lessons = dayActivities.filter(a => a.activity_type === 'lesson_complete').length;

      weekData.push({
        day: dayName,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        points,
        lessons,
        active: dayActivities.length > 0,
      });
    }

    return weekData;
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-white/10 rounded-2xl"></div>
        <div className="h-64 bg-white/10 rounded-2xl"></div>
      </div>
    );
  }

  const maxPoints = Math.max(...weeklyData.map(d => d.points), 1);

  return (
    <div className="space-y-6">
      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-3xl font-bold text-white">{stats.total_points}</span>
          </div>
          <p className="text-gray-300 font-medium">Total Points</p>
          <p className="text-sm text-gray-400 mt-1">+{weeklyData.reduce((sum, d) => sum + d.points, 0)} this week</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-3xl font-bold text-white">{stats.lessons_completed}</span>
          </div>
          <p className="text-gray-300 font-medium">Lessons Completed</p>
          <p className="text-sm text-gray-400 mt-1">{weeklyData.reduce((sum, d) => sum + d.lessons, 0)} this week</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-3xl font-bold text-white">{stats.current_streak}</span>
          </div>
          <p className="text-gray-300 font-medium">Day Streak</p>
          <p className="text-sm text-gray-400 mt-1">Keep it up! 🔥</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-3xl font-bold text-white">{Math.floor(stats.study_time_minutes || 0)}</span>
          </div>
          <p className="text-gray-300 font-medium">Minutes Studied</p>
          <p className="text-sm text-gray-400 mt-1">This month</p>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Weekly Activity</h3>
        
        <div className="space-y-4">
          {weeklyData.map((day, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300 font-medium w-20">{day.day}</span>
                <span className="text-gray-400 text-xs">{day.date}</span>
                <span className="text-white font-semibold w-16 text-right">{day.points} pts</span>
              </div>
              <div className="relative h-8 bg-white/5 rounded-lg overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-lg transition-all duration-500 ${
                    day.active
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gray-700'
                  }`}
                  style={{ width: `${(day.points / maxPoints) * 100}%` }}
                />
                {day.lessons > 0 && (
                  <div className="absolute inset-0 flex items-center px-3">
                    <span className="text-xs text-white font-semibold">
                      {day.lessons} lesson{day.lessons > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Skills Progress</h3>
          
          <div className="space-y-4">
            {[
              { label: 'Vocabulary', value: stats.vocabulary_learned, target: 100, icon: Brain, color: 'purple' },
              { label: 'Pronunciation', value: stats.perfect_pronunciations, target: 50, icon: Mic, color: 'blue' },
              { label: 'Writing', value: stats.essays_submitted, target: 20, icon: FileText, color: 'green' },
              { label: 'Reading', value: stats.books_completed, target: 10, icon: BookOpen, color: 'orange' },
            ].map((skill, index) => {
              const Icon = skill.icon;
              const percentage = getProgressPercentage(skill.value, skill.target);
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 text-${skill.color}-400`} />
                      <span className="text-gray-300 font-medium">{skill.label}</span>
                    </div>
                    <span className="text-white text-sm">
                      {skill.value} / {skill.target}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-${skill.color}-500 to-${skill.color}-400 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements Preview */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Recent Achievements</h3>
          
          <div className="space-y-3">
            {[
              { title: 'First Steps', description: 'Completed your first lesson', date: '2 days ago', icon: '🎯' },
              { title: 'Week Warrior', description: '7-day learning streak', date: '1 week ago', icon: '🔥' },
              { title: 'Vocabulary Novice', description: 'Learned 10 new words', date: '2 weeks ago', icon: '📚' },
            ].map((achievement, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{achievement.title}</h4>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Study Goals */}
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-4">Your Goals</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Daily Goal', value: '15 minutes', progress: 80, achieved: 12, total: 15 },
            { label: 'Weekly Goal', value: '5 lessons', progress: 60, achieved: 3, total: 5 },
            { label: 'Monthly Goal', value: '100 words', progress: 45, achieved: 45, total: 100 },
          ].map((goal, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 font-medium text-sm">{goal.label}</span>
                <span className="text-white font-bold">{goal.progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">
                {goal.achieved} / {goal.total} {goal.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;