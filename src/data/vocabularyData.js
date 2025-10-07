// src/data/vocabularyData.js

export const VOCABULARY_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: 'bg-orange-500/20 text-orange-400' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'business', name: 'Business', icon: '💼', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'daily', name: 'Daily Life', icon: '🏠', color: 'bg-green-500/20 text-green-400' },
  { id: 'emotions', name: 'Emotions', icon: '😊', color: 'bg-pink-500/20 text-pink-400' },
];

export const vocabularyData = [
  // Food & Dining
  { id: 1, term: 'Restaurant', definition: 'A place where meals are served', example: 'We ate at a nice restaurant', category: 'food', difficulty: 'beginner' },
  { id: 2, term: 'Menu', definition: 'List of dishes available', example: 'Can I see the menu?', category: 'food', difficulty: 'beginner' },
  { id: 3, term: 'Delicious', definition: 'Very pleasant to taste', example: 'The food was delicious', category: 'food', difficulty: 'beginner' },
  
  // Travel
  { id: 4, term: 'Airport', definition: 'Place where planes take off', example: 'I need to get to the airport', category: 'travel', difficulty: 'beginner' },
  { id: 5, term: 'Passport', definition: 'Official travel document', example: 'Don\'t forget your passport', category: 'travel', difficulty: 'beginner' },
  
  // Business
  { id: 6, term: 'Meeting', definition: 'Gathering for discussion', example: 'We have a meeting at 10am', category: 'business', difficulty: 'beginner' },
  { id: 7, term: 'Deadline', definition: 'Time limit for completion', example: 'The deadline is Friday', category: 'business', difficulty: 'intermediate' },
  
  // Daily Life
  { id: 8, term: 'Routine', definition: 'Regular way of doing things', example: 'This is my morning routine', category: 'daily', difficulty: 'beginner' },
  { id: 9, term: 'Schedule', definition: 'Planned activities', example: 'What\'s your schedule today?', category: 'daily', difficulty: 'intermediate' },
  
  // Emotions
  { id: 10, term: 'Happy', definition: 'Feeling joy', example: 'I\'m so happy to see you', category: 'emotions', difficulty: 'beginner' },
  { id: 11, term: 'Excited', definition: 'Enthusiastic and eager', example: 'I\'m excited about the trip', category: 'emotions', difficulty: 'beginner' },
];

export default vocabularyData;