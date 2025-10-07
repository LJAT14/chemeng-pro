// src/pages/VocabularyBuilder.jsx
import React, { useState } from 'react';
import { BookOpen, Volume2, CheckCircle, XCircle, Star, Play, Filter } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useToast } from '../components/Toast';
import { vocabularyData, VOCABULARY_CATEGORIES } from '../data/vocabularyData';
import { speakText } from '../services/elevenLabsTTS';

const VocabularyBuilder = () => {
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [mode, setMode] = useState('browse'); // browse, flashcard, quiz
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [savedWords, setSavedWords] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredVocab = vocabularyData.filter(w => {
    const categoryMatch = selectedCategory === 'all' || w.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || w.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const playAudio = async (text) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      await speakText(text, 0.8);
    } catch (error) {
      toast.error('Audio playback failed');
    } finally {
      setIsPlaying(false);
    }
  };

  const toggleSave = (wordId) => {
    const newSaved = savedWords.includes(wordId) 
      ? savedWords.filter(id => id !== wordId)
      : [...savedWords, wordId];
    setSavedWords(newSaved);
    localStorage.setItem('savedWords', JSON.stringify(newSaved));
    
    toast.success(
      savedWords.includes(wordId) ? 'Word removed from favorites' : 'Word saved to favorites'
    );
  };

  const startQuiz = () => {
    setMode('quiz');
    setQuizAnswers([]);
    setShowQuizResults(false);
  };

  const handleQuizAnswer = (wordId, isCorrect) => {
    setQuizAnswers(prev => [...prev, { wordId, isCorrect }]);
  };

  const calculateQuizScore = () => {
    const correct = quizAnswers.filter(a => a.isCorrect).length;
    return { correct, total: quizAnswers.length };
  };

  const getCategoryInfo = (categoryId) => {
    return VOCABULARY_CATEGORIES.find(c => c.id === categoryId) || VOCABULARY_CATEGORIES[0];
  };

  return (
    <PageWrapper title="Vocabulary Builder" subtitle="Master English words by category">
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setMode('browse')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'browse' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setMode('flashcard')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'flashcard' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={startQuiz}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'quiz' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Quiz Mode
          </button>
        </div>

        {/* Category Grid - Enhanced Display */}
        {mode === 'browse' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`p-4 rounded-xl transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 ring-2 ring-purple-400'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="text-3xl mb-2">📚</div>
                <div className="text-white font-semibold text-sm">All Words</div>
                <div className="text-gray-400 text-xs">{vocabularyData.length}</div>
              </button>
              
              {VOCABULARY_CATEGORIES.map((category) => {
                const count = vocabularyData.filter(w => w.category === category.id).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-xl transition-all ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 ring-2 ring-purple-400'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <div className="text-white font-semibold text-sm">{category.name}</div>
                    <div className="text-gray-400 text-xs">{count} words</div>
                  </button>
                );
              })}
            </div>

            {/* Filters */}
            <div className="flex gap-3 items-center flex-wrap">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <div className="ml-auto text-gray-300">
                {filteredVocab.length} words
              </div>
            </div>
          </>
        )}

        {/* Browse Mode */}
        {mode === 'browse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVocab.map((word) => {
              const categoryInfo = getCategoryInfo(word.category);
              return (
                <div
                  key={word.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-500 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{categoryInfo.icon}</span>
                        <h3 className="text-2xl font-bold text-white">{word.term}</h3>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          word.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                          word.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {word.difficulty}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${categoryInfo.color}`}>
                          {categoryInfo.name}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSave(word.id)}
                      className="ml-2"
                    >
                      <Star className={`w-6 h-6 ${savedWords.includes(word.id) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                    </button>
                  </div>

                  <p className="text-gray-300 mb-3">{word.definition}</p>
                  <div className="bg-white/5 rounded-lg p-3 mb-3">
                    <p className="text-gray-400 text-sm italic">"{word.example}"</p>
                  </div>

                  <button
                    onClick={() => playAudio(word.term)}
                    disabled={isPlaying}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-all disabled:opacity-50"
                  >
                    <Volume2 className="w-4 h-4" />
                    Hear pronunciation
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Flashcard Mode */}
        {mode === 'flashcard' && filteredVocab.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 text-center text-gray-300">
              Card {currentIndex + 1} of {filteredVocab.length}
            </div>

            <div
              onClick={() => setShowDefinition(!showDefinition)}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 cursor-pointer hover:border-purple-500 transition-all min-h-96 flex flex-col items-center justify-center"
            >
              {!showDefinition ? (
                <div className="text-center">
                  <div className="text-5xl mb-4">{getCategoryInfo(filteredVocab[currentIndex].category).icon}</div>
                  <h2 className="text-5xl font-bold text-white mb-6">
                    {filteredVocab[currentIndex]?.term}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(filteredVocab[currentIndex]?.term);
                    }}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg mx-auto"
                  >
                    <Play className="w-5 h-5" />
                    Hear it
                  </button>
                  <p className="text-gray-400 mt-8">Click to see definition</p>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {filteredVocab[currentIndex]?.term}
                  </h3>
                  <p className="text-xl text-gray-300 mb-4">
                    {filteredVocab[currentIndex]?.definition}
                  </p>
                  <div className="bg-white/5 rounded-lg p-4 mb-6">
                    <p className="text-gray-400 italic">
                      "{filteredVocab[currentIndex]?.example}"
                    </p>
                  </div>
                  <p className="text-gray-400">Click to flip back</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => {
                  setCurrentIndex(Math.max(0, currentIndex - 1));
                  setShowDefinition(false);
                }}
                disabled={currentIndex === 0}
                className="bg-white/10 hover:bg-white/20 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all"
              >
                Previous
              </button>

              <button
                onClick={() => {
                  setCurrentIndex(Math.min(filteredVocab.length - 1, currentIndex + 1));
                  setShowDefinition(false);
                }}
                disabled={currentIndex === filteredVocab.length - 1}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Quiz Mode */}
        {mode === 'quiz' && !showQuizResults && filteredVocab.length > 0 && (
          <div className="max-w-2xl mx-auto">
            {filteredVocab.slice(0, 10).map((word, idx) => (
              <div
                key={word.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-4 border border-white/20"
              >
                <p className="text-white font-semibold mb-4">
                  {idx + 1}. What does "{word.term}" mean?
                </p>

                <div className="space-y-2">
                  {[word.definition, 'A type of chemical reaction', 'A safety procedure', 'A measurement unit']
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3)
                    .concat(word.definition)
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .slice(0, 4)
                    .map((option, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleQuizAnswer(word.id, option === word.definition)}
                        disabled={quizAnswers.some(a => a.wordId === word.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          quizAnswers.find(a => a.wordId === word.id)
                            ? option === word.definition
                              ? 'bg-green-600 text-white'
                              : 'bg-white/5 text-gray-500'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                </div>
              </div>
            ))}

            {quizAnswers.length === Math.min(10, filteredVocab.length) && (
              <button
                onClick={() => setShowQuizResults(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all"
              >
                See Results
              </button>
            )}
          </div>
        )}

        {/* Quiz Results */}
        {mode === 'quiz' && showQuizResults && (
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-4xl font-bold text-purple-400 mb-6">
              {calculateQuizScore().correct} / {calculateQuizScore().total}
            </p>

            <button
              onClick={startQuiz}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default VocabularyBuilder;