// src/pages/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Users, Zap, Award, Flame } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeframe, setTimeframe] = useState('all-time'); // 'all-time', 'monthly', 'weekly'
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('user_gamification')
        .select(`
          *,
          user_profiles (full_name, avatar_url)
        `)
        .order('total_points', { ascending: false })
        .limit(50);

      const { data, error } = await query;

      if (error) throw error;

      // Add rank to each user
      const rankedData = data.map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

      setLeaderboardData(rankedData);

      // Find current user's rank
      if (user) {
        const currentUserRank = rankedData.find(item => item.user_id === user.id);
        setUserRank(currentUserRank);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-500/30 to-orange-500/30 border-yellow-500/50';
    if (rank === 2) return 'from-gray-400/30 to-gray-500/30 border-gray-400/50';
    if (rank === 3) return 'from-orange-400/30 to-orange-500/30 border-orange-400/50';
    return 'from-white/5 to-white/10 border-white/20';
  };

  const timeframes = [
    { id: 'all-time', label: 'All Time', icon: Trophy },
    { id: 'monthly', label: 'This Month', icon: TrendingUp },
    { id: 'weekly', label: 'This Week', icon: Zap },
  ];

  if (loading) {
    return (
      <PageWrapper title="Leaderboard" subtitle="See how you rank against other learners">
        <div className="animate-pulse space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-20 bg-white/10 rounded-2xl"></div>
          ))}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Leaderboard" subtitle="See how you rank against other learners">
      <div className="max-w-5xl mx-auto">
        
        {/* Timeframe Selector */}
        <div className="flex justify-center gap-3 mb-8">
          {timeframes.map((tf) => {
            const Icon = tf.icon;
            return (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  timeframe === tf.id
                    ? 'bg-purple-600 text-white scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tf.label}
              </button>
            );
          })}
        </div>

        {/* User's Current Rank (if not in top 3) */}
        {userRank && userRank.rank > 3 && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">#{userRank.rank}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Your Current Rank</p>
                  <p className="text-gray-300 text-sm">{userRank.total_points} points</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Keep learning to climb higher!</p>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {leaderboardData.slice(0, 3).map((player, index) => {
            const positions = [1, 0, 2]; // Middle, Left, Right for visual effect
            const actualRank = [2, 1, 3][index];
            const heights = ['h-48', 'h-56', 'h-40'];
            
            return (
              <div key={player.user_id} className={`order-${positions[index]}`}>
                <div className={`bg-gradient-to-br ${getRankColor(actualRank)} backdrop-blur-lg rounded-2xl p-6 border ${heights[index]} flex flex-col items-center justify-end relative overflow-hidden`}>
                  {/* Rank Badge */}
                  <div className="absolute top-4 right-4">
                    {getRankIcon(actualRank)}
                  </div>
                  
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mb-3 overflow-hidden">
                    {player.user_profiles?.avatar_url ? (
                      <img src={player.user_profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      player.user_profiles?.full_name?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>
                  
                  {/* Name */}
                  <h3 className="text-white font-bold text-center truncate w-full px-2">
                    {player.user_profiles?.full_name || 'Anonymous'}
                  </h3>
                  
                  {/* Points */}
                  <p className="text-2xl font-bold text-white mb-2">
                    {player.total_points}
                  </p>
                  <p className="text-gray-300 text-sm">points</p>
                  
                  {/* Position Number */}
                  <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{actualRank}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6" />
              Full Rankings
            </h3>
            <p className="text-gray-400">{leaderboardData.length} learners</p>
          </div>

          <div className="space-y-2">
            {leaderboardData.slice(3).map((player) => {
              const isCurrentUser = user && player.user_id === user.id;
              
              return (
                <div
                  key={player.user_id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isCurrentUser
                      ? 'bg-purple-500/30 border-2 border-purple-500'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">#{player.rank}</span>
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                    {player.user_profiles?.avatar_url ? (
                      <img src={player.user_profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      player.user_profiles?.full_name?.[0]?.toUpperCase() || 'U'
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate">
                      {player.user_profiles?.full_name || 'Anonymous'}
                      {isCurrentUser && <span className="text-purple-400 ml-2">(You)</span>}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {player.lessons_completed} lessons
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {player.current_streak} day streak
                      </p>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{player.total_points}</p>
                    <p className="text-sm text-gray-400">points</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{leaderboardData[0]?.total_points || 0}</p>
            <p className="text-sm text-gray-400">Highest Score</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{leaderboardData.length}</p>
            <p className="text-sm text-gray-400">Active Learners</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center">
            <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {Math.max(...leaderboardData.map(p => p.current_streak || 0), 0)}
            </p>
            <p className="text-sm text-gray-400">Longest Streak</p>
          </div>
        </div>

        {/* Motivational Message */}
        {userRank && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30 mt-6">
            <h3 className="text-xl font-bold text-white mb-2">Keep Climbing! 🚀</h3>
            <p className="text-gray-300">
              {userRank.rank === 1 
                ? "You're at the top! Keep up the amazing work to maintain your position."
                : userRank.rank <= 10
                ? `You're in the top 10! Keep learning to reach the #1 spot.`
                : `You're doing great! Complete more lessons and practice daily to climb higher on the leaderboard.`}
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Leaderboard;