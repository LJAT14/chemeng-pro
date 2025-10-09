 

export const DIFFICULTY_LEVELS = {
  AGAIN: 0,     // Forgot the word
  HARD: 1,      // Difficult to recall
  GOOD: 2,      // Recalled with some effort
  EASY: 3,      // Recalled easily
};

export const INITIAL_INTERVAL = 1; // days
export const MINIMUM_EASE_FACTOR = 1.3;
export const DEFAULT_EASE_FACTOR = 2.5;

/**
 * Calculate the next review date for a vocabulary word
 * @param {number} difficulty - User's performance (0-3)
 * @param {number} repetitions - Number of times reviewed
 * @param {number} easeFactor - Current ease factor
 * @param {number} interval - Current interval in days
 * @returns {object} Updated review schedule
 */
export function calculateNextReview(difficulty, repetitions = 0, easeFactor = DEFAULT_EASE_FACTOR, interval = INITIAL_INTERVAL) {
  let newRepetitions = repetitions;
  let newInterval = interval;
  let newEaseFactor = easeFactor;

  // Update ease factor based on difficulty
  newEaseFactor = easeFactor + (0.1 - (3 - difficulty) * (0.08 + (3 - difficulty) * 0.02));
  
  // Ensure ease factor doesn't go below minimum
  if (newEaseFactor < MINIMUM_EASE_FACTOR) {
    newEaseFactor = MINIMUM_EASE_FACTOR;
  }

  // Calculate new interval
  if (difficulty < DIFFICULTY_LEVELS.GOOD) {
    // If answered incorrectly or with difficulty, reset
    newRepetitions = 0;
    newInterval = INITIAL_INTERVAL;
  } else {
    // If answered correctly
    newRepetitions = repetitions + 1;
    
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    repetitions: newRepetitions,
    interval: newInterval,
    easeFactor: newEaseFactor,
    nextReview: nextReviewDate.toISOString(),
  };
}

/**
 * Determine if a word is due for review
 * @param {string} nextReviewDate - ISO date string
 * @returns {boolean}
 */
export function isDueForReview(nextReviewDate) {
  if (!nextReviewDate) return true;
  
  const reviewDate = new Date(nextReviewDate);
  const now = new Date();
  
  return now >= reviewDate;
}

/**
 * Get words that are due for review
 * @param {Array} vocabularyProgress - Array of vocabulary progress objects
 * @returns {Array} Words due for review
 */
export function getDueWords(vocabularyProgress) {
  return vocabularyProgress.filter(word => isDueForReview(word.next_review));
}

/**
 * Calculate mastery level based on repetitions and ease factor
 * @param {number} repetitions
 * @param {number} easeFactor
 * @returns {string} Mastery level
 */
export function getMasteryLevel(repetitions, easeFactor) {
  if (repetitions === 0) return 'New';
  if (repetitions < 3) return 'Learning';
  if (repetitions < 6 && easeFactor < 2.0) return 'Reviewing';
  if (repetitions < 10 && easeFactor >= 2.0) return 'Familiar';
  if (repetitions >= 10 && easeFactor >= 2.5) return 'Mastered';
  return 'Familiar';
}

/**
 * Get color for mastery level
 * @param {string} level
 * @returns {string} Tailwind color class
 */
export function getMasteryColor(level) {
  const colors = {
    'New': 'text-gray-400 bg-gray-500/20',
    'Learning': 'text-blue-400 bg-blue-500/20',
    'Reviewing': 'text-yellow-400 bg-yellow-500/20',
    'Familiar': 'text-purple-400 bg-purple-500/20',
    'Mastered': 'text-green-400 bg-green-500/20',
  };
  return colors[level] || colors['New'];
}

/**
 * Get days until next review
 * @param {string} nextReviewDate - ISO date string
 * @returns {number} Days until review (negative if overdue)
 */
export function getDaysUntilReview(nextReviewDate) {
  if (!nextReviewDate) return 0;
  
  const reviewDate = new Date(nextReviewDate);
  const now = new Date();
  const diffTime = reviewDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Sort words by priority for review
 * Overdue words first, then by difficulty
 * @param {Array} words - Array of vocabulary progress objects
 * @returns {Array} Sorted words
 */
export function sortByReviewPriority(words) {
  return words.sort((a, b) => {
    const aDaysUntil = getDaysUntilReview(a.next_review);
    const bDaysUntil = getDaysUntilReview(b.next_review);
    
    // Overdue words come first
    if (aDaysUntil < 0 && bDaysUntil >= 0) return -1;
    if (bDaysUntil < 0 && aDaysUntil >= 0) return 1;
    
    // Among overdue, most overdue first
    if (aDaysUntil < 0 && bDaysUntil < 0) {
      return aDaysUntil - bDaysUntil;
    }
    
    // Among not due, soonest first
    return aDaysUntil - bDaysUntil;
  });
}

/**
 * Calculate study statistics
 * @param {Array} vocabularyProgress - Array of vocabulary progress objects
 * @returns {object} Statistics
 */
export function calculateStudyStats(vocabularyProgress) {
  const total = vocabularyProgress.length;
  const dueToday = getDueWords(vocabularyProgress).length;
  
  const masteryLevels = vocabularyProgress.reduce((acc, word) => {
    const level = getMasteryLevel(word.times_practiced || 0, word.ease_factor || DEFAULT_EASE_FACTOR);
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});
  
  const mastered = masteryLevels['Mastered'] || 0;
  const learning = (masteryLevels['Learning'] || 0) + (masteryLevels['New'] || 0);
  
  return {
    total,
    dueToday,
    mastered,
    learning,
    masteryLevels,
    masteryPercentage: total > 0 ? Math.round((mastered / total) * 100) : 0,
  };
}

export default {
  DIFFICULTY_LEVELS,
  calculateNextReview,
  isDueForReview,
  getDueWords,
  getMasteryLevel,
  getMasteryColor,
  getDaysUntilReview,
  sortByReviewPriority,
  calculateStudyStats,
};