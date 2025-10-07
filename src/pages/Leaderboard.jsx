// src/pages/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Users, Zap } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { calculateLevel } from '../utils/gamificationSystem';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeframe, setTimeframe] = useState('all_time'); // all_time, weekly, monthly
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
          user_id,
          total_points,
          lessons_completed,
          current_streak,
          user_profiles!inner(full_name, email)
        `)
        .order('total_points', { ascending: false })
        .limit(100);

      // Apply timeframe filter if needed
      if (timeframe === 'weekly') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('updated_at', weekAgo.toISOString());
      } else if (timeframe === 'monthly') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('updated_at', monthAgo.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const rankedData = data.map((entry, index) => ({
        rank: index + 1,
        userId: entry.user_id,
        name: entry.user_profiles?.full_name || entry.user_profiles?.email?.split('@')[0] || 'Anonymous',
        points: entry.total_points,
        lessonsCompleted: entry.lessons_completed,
        streak: entry.current_streak,
        level: calculateLevel(entry.total_points),
      }));

      setLeaderboardData(rankedData);

      // Find current user's rank
      if (user) {
        const userEntry = rankedData.find(entry => entry.userId === user.id);
        setUserRank(userEntry);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <span className="text-gray-400 font-bold">#{rank}</span>;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
    return 'bg-white/10 text-white';
  };

  return (
    <PageWrapper title="Leaderboard" subtitle="Compete with learners worldwide">
      <div className="space-y-6">
        {/* Timeframe Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all_time', label: 'All Time', icon: Trophy },
            { id: 'monthly', label: 'This Month', icon: TrendingUp },
            { id: 'weekly', label: 'This Week', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeframe(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                timeframe === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* User's Current Rank */}
        {userRank && (
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                  {getRankIcon(userRank.rank)}
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Your Rank</div>
                  <div className="text-3xl font-bold text-white">#{userRank.rank}</div>
                  <div className="text-purple-400 text-sm">Level {userRank.level.level} - {userRank.level.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{userRank.points}</div>
                <div className="text-gray-400 text-sm">Total Points</div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {!loading && leaderboardData.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-8">
            {/* 2nd Place */}
            <div className="flex-1 max-w-xs">
              <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-t-2xl p-6 text-center">
                <Medal className="w-12 h-12 text-white mx-auto mb-2" />
                <div className="text-white font-bold text-xl mb-1">{leaderboardData[1].name}</div>
                <div className="text-gray-100 text-sm mb-2">Level {leaderboardData[1].level.level}</div>
                <div className="text-2xl font-bold text-white">{leaderboardData[1].points}</div>
                <div className="text-gray-200 text-xs">points</div>
              </div>
              <div className="bg-gray-600 h-24 rounded-b-2xl"></div>
            </div>

            {/* 1st Place */}
            <div className="flex-1 max-w-xs">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-t-2xl p-8 text-center">
                <Crown className="w-16 h-16 text-white mx-auto mb-2 animate-bounce" />
                <div className="text-white font-bold text-2xl mb-1">{leaderboardData[0].name}</div>
                <div className="text-yellow-100 text-sm mb-2">Level {leaderboardData[0].level.level}</div>
                <div className="text-3xl font-bold text-white">{leaderboardData[0].points}</div>
                <div className="text-yellow-100 text-xs">points</div>
              </div>
              <div className="bg-yellow-700 h-32 rounded-b-2xl"></div>
            </div>

            {/* 3rd Place */}
            <div className="flex-1 max-w-xs">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-t-2xl p-6 text-center">
                <Medal className="w-12 h-12 text-white mx-auto mb-2" />
                <div className="text-white font-bold text-xl mb-1">{leaderboardData[2].name}</div>
                <div className="text-orange-100 text-sm mb-2">Level {leaderboardData[2].level.level}</div>
                <div className="text-2xl font-bold text-white">{leaderboardData[2].points}</div>
                <div className="text-orange-100 text-xs">points</div>
              </div>
              <div className="bg-orange-600 h-20 rounded-b-2xl"></div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Rankings</h3>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">User</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Level</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Lessons</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Streak</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {leaderboardData.slice(3).map((entry) => (
                    <tr 
                      key={entry.userId}
                      className={`hover:bg-white/5 transition-colors ${
                        entry.userId === user?.id ? 'bg-purple-500/20' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">{entry.name}</div>
                            {entry.userId === user?.id && (
                              <div className="text-purple-400 text-xs">You</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-white font-semibold">{entry.level.level}</span>
                      </td>
                      <td className="px-6 py-4 text-right text-white">{entry.lessonsCompleted}</td>
                      <td className="px-6 py-4 text-right text-orange-400 font-semibold">{entry.streak}🔥</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-yellow-400 font-bold text-lg">{entry.points}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Leaderboard;