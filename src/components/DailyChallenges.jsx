// src/components/DailyChallenges.jsx
import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Clock, Star, Trophy, Zap } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const DAILY_CHALLENGES = [
  {
    id: 'complete_lesson',
    title: 'Complete a Lesson',
    description: 'Finish any lesson from the library',
    icon: '📚',
    points: 50,
    type: 'lesson',
  },
  {
    id: 'learn_5_words',
    title: 'Learn 5 New Words',
    description: 'Practice 5 vocabulary words',
    icon: '📖',
    points: 25,
    type: 'vocabulary',
  },
  {
    id: 'perfect_pronunciation',
    title: 'Perfect Pronunciation',
    description: 'Get 3 words correct in pronunciation lab',
    icon: '🎤',
    points: 30,
    type: 'pronunciation',
  },
  {
    id: 'write_essay',
    title: 'Write an Essay',
    description: 'Submit a writing practice essay',
    icon: '✍️',
    points: 40,
    type: 'writing',
  },
  {
    id: 'interview_practice',
    title: 'Interview Practice',
    description: 'Complete an interview simulation',
    icon: '💼',
    points: 50,
    type: 'interview',
  },
];

const DailyChallenges = () => {
  const { user } = useAuth();
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTodayChallenges();
    }
  }, [user]);

  const fetchTodayChallenges = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data } = await supabase
        .from('daily_challenges_completed')
        .select('challenge_id')
        .eq('user_id', user.id)
        .gte('completed_at', today);

      if (data) {
        setCompletedChallenges(data.map(d => d.challenge_id));
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = DAILY_CHALLENGES.reduce((sum, c) => sum + c.points, 0);
  const earnedPoints = DAILY_CHALLENGES
    .filter(c => completedChallenges.includes(c.id))
    .reduce((sum, c) => sum + c.points, 0);
  const progress = Math.round((earnedPoints / totalPoints) * 100);

  return (
    <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Daily Challenges</h3>
            <p className="text-gray-400 text-sm">
              {completedChallenges.length} of {DAILY_CHALLENGES.length} completed
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400">{earnedPoints}</div>
          <div className="text-gray-400 text-xs">of {totalPoints} pts</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Daily Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-3">
        {DAILY_CHALLENGES.map((challenge) => {
          const isCompleted = completedChallenges.includes(challenge.id);
          return (
            <div
              key={challenge.id}
              className={`relative p-4 rounded-xl transition-all ${
                isCompleted
                  ? 'bg-green-500/20 border-2 border-green-500/50'
                  : 'bg-white/5 border-2 border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{challenge.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold">{challenge.title}</h4>
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{challenge.description}</p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                  isCompleted ? 'bg-green-500/20' : 'bg-yellow-500/20'
                }`}>
                  <Star className={`w-4 h-4 ${
                    isCompleted ? 'text-green-400' : 'text-yellow-400'
                  }`} />
                  <span className={`text-sm font-bold ${
                    isCompleted ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    +{challenge.points}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Bonus */}
      {completedChallenges.length === DAILY_CHALLENGES.length && (
        <div className="mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 text-center">
          <Trophy className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-white font-bold">All Challenges Complete!</p>
          <p className="text-yellow-100 text-sm">Bonus: +50 points 🎉</p>
        </div>
      )}

      {/* Reset Timer */}
      <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-sm">
        <Clock className="w-4 h-4" />
        <span>Resets in {getTimeUntilMidnight()}</span>
      </div>
    </div>
  );
};

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

export default DailyChallenges;