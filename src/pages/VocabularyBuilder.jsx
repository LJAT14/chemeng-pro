import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, CheckCircle, XCircle, Star, Play, Filter, Brain, TrendingUp, Calendar } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { vocabularyData, VOCABULARY_CATEGORIES } from '../data/vocabularyData';
import { 
  calculateNextReview, 
  isDueForReview, 
  getDueWords, 
  getMasteryLevel, 
  getMasteryColor,
  getDaysUntilReview,
  sortByReviewPriority,
  calculateStudyStats,
  DIFFICULTY_LEVELS 
} from '../utils/spacedRepetition';

const VocabularyBuilder = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState('review'); // 'review', 'browse', 'quiz'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userProgress, setUserProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('vocabulary_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setUserProgress(data || []);
      
      // Calculate stats
      if (data && data.length > 0) {
        const studyStats = calculateStudyStats(data);
        setStats(studyStats);
      } else {
        setStats({
          total: 0,
          dueToday: vocabularyData.length,
          mastered: 0,
          learning: 0,
          masteryPercentage: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching vocabulary progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWordProgress = (wordId) => {
    return userProgress.find(p => p.word_id === wordId) || null;
  };

  const getWordsForReview = () => {
    // Get words that are due for review
    const wordsWithProgress = vocabularyData.map(word => {
      const progress = getWordProgress(word.id);
      return {
        ...word,
        progress,
        isDue: !progress || isDueForReview(progress.next_review),
      };
    });

    // Filter by category
    const filtered = selectedCategory === 'all' 
      ? wordsWithProgress 
      : wordsWithProgress.filter(w => w.category === selectedCategory);

    // In review mode, only show due words
    if (mode === 'review') {
      const dueWords = filtered.filter(w => w.isDue);
      return sortByReviewPriority(dueWords.map(w => w.progress).filter(p => p));
    }

    return filtered;
  };

  const handleReview = async (difficulty) => {
    const words = getWordsForReview();
    const currentWord = words[currentWordIndex];
    const progress = getWordProgress(currentWord.id);

    // Calculate next review schedule
    const schedule = calculateNextReview(
      difficulty,
      progress?.times_practiced || 0,
      progress?.ease_factor || 2.5,
      progress?.interval || 1
    );

    try {
      // Update or insert progress
      const { error } = await supabase
        .from('vocabulary_progress')
        .upsert({
          user_id: user.id,
          word_id: currentWord.id,
          times_practiced: schedule.repetitions,
          ease_factor: schedule.easeFactor,
          interval: schedule.interval,
          next_review: schedule.nextReview,
          last_practiced: new Date().toISOString(),
          mastered: schedule.repetitions >= 10,
        }, {
          onConflict: 'user_id,word_id'
        });

      if (error) throw error;

      // Log activity
      await supabase.from('activity_log').insert({
        user_id: user.id,
        activity_type: 'vocabulary_learned',
        activity_name: currentWord.term,
        points: difficulty >= DIFFICULTY_LEVELS.GOOD ? 5 : 2,
      });

      // Update gamification if word mastered
      if (schedule.repetitions === 10) {
        await supabase.rpc('increment_user_stat', {
          p_user_id: user.id,
          p_stat_name: 'vocabulary_learned',
          p_increment: 1,
        });
      }

      // Refresh progress
      await fetchUserProgress();

      // Move to next word
      setShowAnswer(false);
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
      } else {
        setCurrentWordIndex(0);
      }
    } catch (error) {
      console.error('Error updating vocabulary progress:', error);
    }
  };

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const words = getWordsForReview();
  const currentWord = words[currentWordIndex];

  if (loading) {
    return <PageWrapper title="Vocabulary Builder"><div className="text-white">Loading...</div></PageWrapper>;
  }

  return (
    <PageWrapper title="Vocabulary Builder" subtitle="Master English vocabulary with spaced repetition">
      <div className="max-w-6xl mx-auto">
        
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30">
            <Calendar className="w-8 h-8 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats?.dueToday || 0}</p>
            <p className="text-sm text-gray-400">Due Today</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
            <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats?.mastered || 0}</p>
            <p className="text-sm text-gray-400">Mastered</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/30">
            <Brain className="w-8 h-8 text-yellow-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats?.learning || 0}</p>
            <p className="text-sm text-gray-400">Learning</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30">
            <TrendingUp className="w-8 h-8 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">{stats?.masteryPercentage || 0}%</p>
            <p className="text-sm text-gray-400">Mastery</p>
          </div>
        </div>

        {/* Mode & Category Selection */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('review')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                mode === 'review' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'
              }`}
            >
              Review ({stats?.dueToday || 0})
            </button>
            <button
              onClick={() => setMode('browse')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                mode === 'browse' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'
              }`}
            >
              Browse All
            </button>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentWordIndex(0);
            }}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            {VOCABULARY_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id} className="bg-slate-800">
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Flashcard Area */}
        {words.length > 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6">
            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-400">
                Card {currentWordIndex + 1} / {words.length}
              </span>
              {currentWord.progress && (
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-lg ${getMasteryColor(getMasteryLevel(currentWord.progress.times_practiced, currentWord.progress.ease_factor))}`}>
                    {getMasteryLevel(currentWord.progress.times_practiced, currentWord.progress.ease_factor)}
                  </span>
                  {!isDueForReview(currentWord.progress?.next_review) && (
                    <span className="text-xs text-gray-500">
                      Review in {getDaysUntilReview(currentWord.progress.next_review)} days
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Flashcard */}
            <div 
              className="min-h-64 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <div className="text-center mb-6">
                <h2 className="text-5xl font-bold text-white mb-4">{currentWord.term}</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(currentWord.term);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all mx-auto"
                >
                  <Volume2 className="w-5 h-5" />
                  Pronounce
                </button>
              </div>

              {showAnswer ? (
                <div className="text-center space-y-4 animate-fade-in">
                  <p className="text-2xl text-gray-300">{currentWord.definition}</p>
                  <p className="text-lg text-gray-400 italic">"{currentWord.example}"</p>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm ${VOCABULARY_CATEGORIES.find(c => c.id === currentWord.category)?.color || 'bg-gray-500/20 text-gray-400'}`}>
                    {VOCABULARY_CATEGORIES.find(c => c.id === currentWord.category)?.name}
                  </span>
                </div>
              ) : (
                <p className="text-gray-500 text-center">Click to reveal definition</p>
              )}
            </div>

            {/* Review Buttons */}
            {showAnswer && mode === 'review' && (
              <div className="grid grid-cols-4 gap-3 mt-8">
                <button
                  onClick={() => handleReview(DIFFICULTY_LEVELS.AGAIN)}
                  className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all border border-red-500/30"
                >
                  Again<br/><span className="text-xs">1 day</span>
                </button>
                <button
                  onClick={() => handleReview(DIFFICULTY_LEVELS.HARD)}
                  className="px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg font-semibold transition-all border border-yellow-500/30"
                >
                  Hard<br/><span className="text-xs">2 days</span>
                </button>
                <button
                  onClick={() => handleReview(DIFFICULTY_LEVELS.GOOD)}
                  className="px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-semibold transition-all border border-green-500/30"
                >
                  Good<br/><span className="text-xs">6 days</span>
                </button>
                <button
                  onClick={() => handleReview(DIFFICULTY_LEVELS.EASY)}
                  className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-semibold transition-all border border-blue-500/30"
                >
                  Easy<br/><span className="text-xs">10+ days</span>
                </button>
              </div>
            )}

            {/* Navigation */}
            {mode === 'browse' && (
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setCurrentWordIndex(Math.max(0, currentWordIndex - 1))}
                  disabled={currentWordIndex === 0}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentWordIndex(Math.min(words.length - 1, currentWordIndex + 1))}
                  disabled={currentWordIndex === words.length - 1}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">All Done for Today! 🎉</h3>
            <p className="text-gray-400">
              {mode === 'review' 
                ? "You've reviewed all due words. Great job! Come back tomorrow for more."
                : "No words in this category. Try selecting a different category."}
            </p>
          </div>
        )}

        {/* Study Tips */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-xl font-bold text-white mb-4">💡 How Spaced Repetition Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
            <div>
              <p className="font-semibold text-white mb-1">Review Schedule</p>
              <p>Words you find easy are shown less frequently, while difficult words appear more often.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Optimal Learning</p>
              <p>Review words just before you forget them for maximum retention.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Be Honest</p>
              <p>Rate difficulty accurately to get the best learning schedule.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Daily Practice</p>
              <p>Review every day to build vocabulary systematically.</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default VocabularyBuilder;