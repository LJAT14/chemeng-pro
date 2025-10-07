// src/utils/gamificationSystem.js

export const POINTS = {
  LESSON_COMPLETE: 50,
  QUIZ_PERFECT: 30,
  QUIZ_GOOD: 20,
  QUIZ_PASS: 10,
  VOCABULARY_LEARNED: 5,
  PRONUNCIATION_CORRECT: 10,
  WRITING_SUBMITTED: 40,
  BOOK_CHAPTER_READ: 15,
  DAILY_STREAK: 25,
  WEEKLY_STREAK: 100,
  REFERRAL: 200,
};

export const BADGES = [
  // Getting Started
  { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', points: 0 },
  { id: 'first_week', name: 'Week Warrior', description: '7-day practice streak', icon: '🔥', points: 0 },
  { id: 'first_month', name: 'Monthly Master', description: '30-day practice streak', icon: '🏆', points: 0 },
  
  // Vocabulary Mastery
  { id: 'vocab_10', name: 'Word Collector', description: 'Learn 10 vocabulary words', icon: '📚', points: 0 },
  { id: 'vocab_50', name: 'Word Master', description: 'Learn 50 vocabulary words', icon: '📖', points: 0 },
  { id: 'vocab_100', name: 'Word Genius', description: 'Learn 100 vocabulary words', icon: '🧠', points: 0 },
  { id: 'vocab_250', name: 'Walking Dictionary', description: 'Learn 250 vocabulary words', icon: '📕', points: 0 },
  
  // Pronunciation Excellence
  { id: 'pronunciation_10', name: 'Clear Speaker', description: '10 perfect pronunciations', icon: '🎤', points: 0 },
  { id: 'pronunciation_50', name: 'Native-Like', description: '50 perfect pronunciations', icon: '🗣️', points: 0 },
  { id: 'pronunciation_100', name: 'Speech Master', description: '100 perfect pronunciations', icon: '🎙️', points: 0 },
  
  // Lesson Achievements
  { id: 'lessons_5', name: 'Quick Learner', description: 'Complete 5 lessons', icon: '⭐', points: 0 },
  { id: 'lessons_20', name: 'Dedicated Student', description: 'Complete 20 lessons', icon: '🌟', points: 0 },
  { id: 'lessons_50', name: 'English Scholar', description: 'Complete 50 lessons', icon: '🎓', points: 0 },
  
  // Writing Excellence
  { id: 'writing_5', name: 'Writer', description: 'Submit 5 essays', icon: '✍️', points: 0 },
  { id: 'writing_20', name: 'Wordsmith', description: 'Submit 20 essays', icon: '📝', points: 0 },
  { id: 'perfect_essay', name: 'Perfect Essay', description: 'Get 10/10 on an essay', icon: '💎', points: 0 },
  
  // Reading Achievements
  { id: 'books_3', name: 'Book Worm', description: 'Complete 3 books', icon: '📚', points: 0 },
  { id: 'books_10', name: 'Avid Reader', description: 'Complete 10 books', icon: '📖', points: 0 },
  
  // Special Achievements
  { id: 'night_owl', name: 'Night Owl', description: 'Practice after 10pm', icon: '🦉', points: 0 },
  { id: 'early_bird', name: 'Early Bird', description: 'Practice before 7am', icon: '🐦', points: 0 },
  { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Practice on weekends for a month', icon: '⚔️', points: 0 },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Score 100% on 5 quizzes', icon: '💯', points: 0 },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete lesson in under 5 minutes', icon: '⚡', points: 0 },
];

export const LEVELS = [
  { level: 1, name: 'Beginner', minPoints: 0, maxPoints: 99, color: '#10b981' },
  { level: 2, name: 'Elementary', minPoints: 100, maxPoints: 299, color: '#3b82f6' },
  { level: 3, name: 'Pre-Intermediate', minPoints: 300, maxPoints: 599, color: '#8b5cf6' },
  { level: 4, name: 'Intermediate', minPoints: 600, maxPoints: 999, color: '#f59e0b' },
  { level: 5, name: 'Upper-Intermediate', minPoints: 1000, maxPoints: 1499, color: '#ef4444' },
  { level: 6, name: 'Advanced', minPoints: 1500, maxPoints: 2499, color: '#ec4899' },
  { level: 7, name: 'Proficient', minPoints: 2500, maxPoints: 3999, color: '#6366f1' },
  { level: 8, name: 'Expert', minPoints: 4000, maxPoints: 5999, color: '#8b5cf6' },
  { level: 9, name: 'Master', minPoints: 6000, maxPoints: 9999, color: '#f59e0b' },
  { level: 10, name: 'Native-Like', minPoints: 10000, maxPoints: Infinity, color: '#fbbf24' },
];

export function calculateLevel(points) {
  return LEVELS.find(level => points >= level.minPoints && points <= level.maxPoints) || LEVELS[0];
}

export function getProgressToNextLevel(points) {
  const currentLevel = calculateLevel(points);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  
  if (!nextLevel) return 100; // Max level
  
  const progress = ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100;
  return Math.min(Math.round(progress), 100);
}

export function checkBadgeEarned(badgeId, userStats) {
  const badges = {
    'first_lesson': userStats.lessonsCompleted >= 1,
    'first_week': userStats.currentStreak >= 7,
    'first_month': userStats.currentStreak >= 30,
    'vocab_10': userStats.vocabularyLearned >= 10,
    'vocab_50': userStats.vocabularyLearned >= 50,
    'vocab_100': userStats.vocabularyLearned >= 100,
    'vocab_250': userStats.vocabularyLearned >= 250,
    'pronunciation_10': userStats.perfectPronunciations >= 10,
    'pronunciation_50': userStats.perfectPronunciations >= 50,
    'pronunciation_100': userStats.perfectPronunciations >= 100,
    'lessons_5': userStats.lessonsCompleted >= 5,
    'lessons_20': userStats.lessonsCompleted >= 20,
    'lessons_50': userStats.lessonsCompleted >= 50,
    'writing_5': userStats.essaysSubmitted >= 5,
    'writing_20': userStats.essaysSubmitted >= 20,
    'perfect_essay': userStats.perfectEssays >= 1,
    'books_3': userStats.booksCompleted >= 3,
    'books_10': userStats.booksCompleted >= 10,
    'perfectionist': userStats.perfectQuizzes >= 5,
  };
  
  return badges[badgeId] || false;
}

export function awardPoints(pointType, userId, supabase) {
  const points = POINTS[pointType];
  
  return supabase
    .from('user_gamification')
    .upsert({
      user_id: userId,
      total_points: points,
    }, {
      onConflict: 'user_id',
      ignoreDuplicates: false,
    });
}

export default {
  POINTS,
  BADGES,
  LEVELS,
  calculateLevel,
  getProgressToNextLevel,
  checkBadgeEarned,
  awardPoints,
};