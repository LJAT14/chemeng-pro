// src/components/GamificationDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Target, Award, TrendingUp } from 'lucide-react';
import { calculateLevel, getProgressToNextLevel, BADGES, checkBadgeEarned } from '../utils/gamificationSystem';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const GamificationDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPoints: 0,
    lessonsCompleted: 0,
    vocabularyLearned: 0,
    perfectPronunciations: 0,
    essaysSubmitted: 0,
    perfectEssays: 0,
    booksCompleted: 0,
    perfectQuizzes: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGamificationData();
    }
  }, [user]);

  const fetchGamificationData = async () => {
    try {
      // Fetch user gamification stats
      const { data: gamificationData } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (gamificationData) {
        setStats({
          totalPoints: gamificationData.total_points || 0,
          lessonsCompleted: gamificationData.lessons_completed || 0,
          vocabularyLearned: gamificationData.vocabulary_learned || 0,
          perfectPronunciations: gamificationData.perfect_pronunciations || 0,
          essaysSubmitted: gamificationData.essays_submitted || 0,
          perfectEssays: gamificationData.perfect_essays || 0,
          booksCompleted: gamificationData.books_completed || 0,
          perfectQuizzes: gamificationData.perfect_quizzes || 0,
          currentStreak: gamificationData.current_streak || 0,
          longestStreak: gamificationData.longest_streak || 0,
        });

        // Check which badges are earned
        const earned = BADGES.filter(badge => checkBadgeEarned(badge.id, gamificationData));
        setEarnedBadges(earned);
      }
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentLevel = calculateLevel(stats.totalPoints);
  const progressToNext = getProgressToNextLevel(stats.totalPoints);

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
    <div className="space-y-6">
      {/* Level Progress */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="text-2xl font-bold text-white">Level {currentLevel.level}</h3>
                <p className="text-gray-300">{currentLevel.name}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{stats.totalPoints}</div>
            <div className="text-gray-400 text-sm">Total Points</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>Progress to Level {currentLevel.level + 1}</span>
            <span>{progressToNext}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-gray-400 text-sm">Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
          <div className="text-xs text-gray-500">Longest: {stats.longestStreak}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 text-sm">Lessons</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.lessonsCompleted}</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 text-sm">Vocabulary</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.vocabularyLearned}</div>
          <div className="text-xs text-gray-500">Words learned</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-gray-400 text-sm">Badges</span>
          </div>
          <div className="text-2xl font-bold text-white">{earnedBadges.length}</div>
          <div className="text-xs text-gray-500">Earned</div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Badges</h3>
          <span className="text-gray-400 text-sm">({earnedBadges.length}/{BADGES.length})</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {BADGES.map((badge) => {
            const isEarned = earnedBadges.some(b => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`relative group cursor-pointer transition-all ${
                  isEarned ? 'opacity-100' : 'opacity-30 grayscale'
                }`}
                title={badge.description}
              >
                <div className={`text-5xl text-center mb-1 ${isEarned ? 'animate-bounce-slow' : ''}`}>
                  {badge.icon}
                </div>
                <div className="text-xs text-center text-white font-medium">{badge.name}</div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-black/90 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                    {badge.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      {earnedBadges.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-white">Recent Achievements</h3>
          </div>
          <div className="space-y-3">
            {earnedBadges.slice(0, 5).map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                <div className="text-3xl">{badge.icon}</div>
                <div className="flex-1">
                  <div className="text-white font-semibold">{badge.name}</div>
                  <div className="text-gray-400 text-sm">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationDashboard;