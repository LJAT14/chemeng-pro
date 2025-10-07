// src/components/StreakTracker.jsx
import React, { useState, useEffect } from 'react';
import { Flame, Calendar, CheckCircle, Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const StreakTracker = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    practiceHistory: [], // Last 30 days
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStreakData();
    }
  }, [user]);

  const fetchStreakData = async () => {
    try {
      // Fetch user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('current_streak, longest_streak, last_practice_date')
        .eq('user_id', user.id)
        .single();

      // Fetch practice history for last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: activityData } = await supabase
        .from('achievements_log')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Create array of last 30 days
      const history = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const hasPracticed = activityData?.some(activity => 
          activity.created_at.split('T')[0] === dateString
        );

        history.push({
          date: dateString,
          practiced: hasPracticed,
          dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        });
      }

      setStreakData({
        currentStreak: progressData?.current_streak || 0,
        longestStreak: progressData?.longest_streak || 0,
        practiceHistory: history,
      });
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStreakMessage = () => {
    const { currentStreak } = streakData;
    if (currentStreak === 0) return "Start your streak today!";
    if (currentStreak < 3) return "Keep going!";
    if (currentStreak < 7) return "You're on fire! 🔥";
    if (currentStreak < 30) return "Incredible dedication!";
    return "Legendary streak! 👑";
  };

  const getStreakColor = (streak) => {
    if (streak === 0) return 'from-gray-500 to-gray-600';
    if (streak < 3) return 'from-orange-400 to-orange-500';
    if (streak < 7) return 'from-orange-500 to-red-500';
    if (streak < 30) return 'from-red-500 to-pink-500';
    return 'from-yellow-400 to-orange-500';
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/20 rounded w-1/2"></div>
          <div className="h-24 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      {/* Streak Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 bg-gradient-to-br ${getStreakColor(streakData.currentStreak)} rounded-full flex items-center justify-center shadow-lg`}>
            <Flame className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{streakData.currentStreak} Days</div>
            <div className="text-gray-400 text-sm">{getStreakMessage()}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-400 text-sm">Personal Best</div>
          <div className="text-xl font-bold text-purple-400">{streakData.longestStreak} days</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Next Milestone</span>
          <span>{streakData.currentStreak} / {getNextMilestone(streakData.currentStreak)}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getStreakColor(streakData.currentStreak)} rounded-full transition-all duration-500`}
            style={{ width: `${(streakData.currentStreak % getNextMilestone(streakData.currentStreak)) / getNextMilestone(streakData.currentStreak) * 100}%` }}
          />
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm">Last 30 Days</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {streakData.practiceHistory.map((day, index) => (
            <div
              key={index}
              className="relative group"
              title={`${day.date} - ${day.practiced ? 'Practiced' : 'Missed'}`}
            >
              <div className={`aspect-square rounded-lg transition-all ${
                day.practiced
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 hover:scale-110'
                  : 'bg-white/5 hover:bg-white/10'
              }`}>
                {day.practiced ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Lock className="w-3 h-3 text-gray-600" />
                  </div>
                )}
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-black/90 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  {new Date(day.date).toLocaleDateString()}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 text-center">
        <p className="text-white font-semibold mb-1">
          {streakData.currentStreak === 0 
            ? "Practice today to start your streak!" 
            : streakData.currentStreak === 1
            ? "Great start! Come back tomorrow to keep it going!"
            : `Don't break your ${streakData.currentStreak}-day streak!`}
        </p>
        <p className="text-gray-400 text-sm">
          Consistent practice is the key to mastery
        </p>
      </div>
    </div>
  );
};

function getNextMilestone(currentStreak) {
  const milestones = [7, 14, 30, 60, 90, 180, 365];
  return milestones.find(m => m > currentStreak) || 365;
}

export default StreakTracker;