// src/components/DailyChallenges.jsx
import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Clock, Star, Trophy, Zap, BookOpen, Mic, FileText, Volume2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DailyChallenges = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [completedToday, setCompletedToday] = useState([]);
  const [loading, setLoading] = useState(true);

  const dailyChallenges = [
    {
      id: 'complete_lesson',
      title: 'Complete a Lesson',
      description: 'Finish any lesson from the library',
      points: 50,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      action: '/library',
    },
    {
      id: 'practice_vocabulary',
      title: 'Learn 5 New Words',
      description: 'Practice vocabulary in any category',
      points: 25,
      icon: Volume2,
      color: 'from-purple-500 to-pink-500',
      action: '/vocabulary',
    },
    {
      id: 'pronunciation_practice',
      title: 'Perfect 3 Pronunciations',
      description: 'Get 80%+ score on 3 words',
      points: 30,
      icon: Mic,
      color: 'from-green-500 to-emerald-500',
      action: '/pronunciation',
    },
    {
      id: 'write_essay',
      title: 'Write an Essay',
      description: 'Submit a writing practice essay',
      points: 40,
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      action: '/writing',
    },
    {
      id: 'daily_streak',
      title: 'Maintain Your Streak',
      description: 'Study today to keep your streak alive',
      points: 20,
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      action: null, // Auto-completes with any activity
    },
  ];

  useEffect(() => {
    if (user) {
      fetchDailyChallenges();
    }
  }, [user]);

  const fetchDailyChallenges = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_challenges_completed')
        .select('challenge_id')
        .eq('user_id', user.id)
        .eq('completion_date', today);

      if (error) throw error;

      const completedIds = data.map(item => item.challenge_id);
      setCompletedToday(completedIds);
      
      // Add completion status to challenges
      const challengesWithStatus = dailyChallenges.map(challenge => ({
        ...challenge,
        completed: completedIds.includes(challenge.id),
      }));
      
      setChallenges(challengesWithStatus);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setChallenges(dailyChallenges.map(c => ({ ...c, completed: false })));
    } finally {
      setLoading(false);
    }
  };

  const markChallengeComplete = async (challengeId) => {
    try {
      const { error } = await supabase
        .from('daily_challenges_completed')
        .insert([
          {
            user_id: user.id,
            challenge_id: challengeId,
            completion_date: new Date().toISOString().split('T')[0],
          }
        ]);

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }

      // Refresh challenges
      fetchDailyChallenges();
    } catch (error) {
      console.error('Error marking challenge complete:', error);
    }
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const totalChallenges = challenges.length;
  const progressPercentage = (completedCount / totalChallenges) * 100;

  const handleChallengeClick = (challenge) => {
    if (challenge.action) {
      navigate(challenge.action);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 animate-pulse">
        <div className="h-32 bg-white/5 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Daily Challenges</h3>
            <p className="text-gray-300 text-sm">Complete all 5 to earn bonus points!</p>
          </div>
        </div>
        
        {completedCount === totalChallenges && (
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
            <Trophy className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">All Done! 🎉</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
          <span>Daily Progress</span>
          <span className="font-bold text-white">{completedCount} / {totalChallenges}</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        {completedCount === totalChallenges && (
          <p className="text-center text-green-400 text-sm mt-2 font-semibold">
            +50 Bonus Points Earned! 🌟
          </p>
        )}
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => {
          const Icon = challenge.icon;
          
          return (
            <button
              key={challenge.id}
              onClick={() => !challenge.completed && handleChallengeClick(challenge)}
              disabled={challenge.completed}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                challenge.completed
                  ? 'bg-green-500/20 border-green-500/50 cursor-default'
                  : 'bg-white/10 border-white/20 hover:bg-white/20 hover:scale-105 cursor-pointer'
              }`}
            >
              {/* Completion Badge */}
              {challenge.completed && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${challenge.color} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h4 className="text-white font-bold mb-1">{challenge.title}</h4>
              <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>

              {/* Points */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4" />
                  <span className="font-semibold">{challenge.points} pts</span>
                </div>
                
                {challenge.completed ? (
                  <span className="text-green-400 text-sm font-semibold">Completed ✓</span>
                ) : (
                  <span className="text-purple-400 text-sm font-semibold">Start →</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Time Remaining */}
      <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
        <Clock className="w-4 h-4" />
        <span>Challenges reset at midnight</span>
      </div>

      {/* Motivational Message */}
      {completedCount > 0 && completedCount < totalChallenges && (
        <div className="mt-4 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
          <p className="text-blue-400 font-semibold">
            {completedCount === totalChallenges - 1
              ? "Just one more challenge! You're almost there! 💪"
              : `Great start! ${totalChallenges - completedCount} challenges remaining. Keep going! 🚀`}
          </p>
        </div>
      )}
    </div>
  );
};

export default DailyChallenges;