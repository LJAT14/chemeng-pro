// src/pages/VocabularyHub.jsx
import React, { useState } from 'react';
import { MessageSquare, Search, BookOpen, Award } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { vocabulary } from '../data/vocabulary';

const VocabularyHub = () => {
  const [language, setLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  // Get unique categories
  const categories = ['all', ...new Set(vocabulary.map(v => v.category))];

  // Filter vocabulary
  const filteredVocab = vocabulary.filter(item => {
    const matchesSearch = item.term.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.term.pt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const startQuiz = () => {
    setShowQuiz(true);
    setQuizScore(0);
    setCurrentQuizIndex(0);
  };

  const handleQuizAnswer = (isCorrect) => {
    if (isCorrect) setQuizScore(quizScore + 1);
    
    if (currentQuizIndex < filteredVocab.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      alert(`Quiz complete! Score: ${quizScore + (isCorrect ? 1 : 0)}/${filteredVocab.length}`);
      setShowQuiz(false);
    }
  };

  if (showQuiz) {
    const currentTerm = filteredVocab[currentQuizIndex];
    
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Vocabulary Quiz</h1>
          <Button onClick={() => setShowQuiz(false)} variant="outline">
            Exit Quiz
          </Button>
        </div>

        <Card>
          <div className="text-center space-y-6">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Question {currentQuizIndex + 1}/{filteredVocab.length}</span>
              <span>Score: {quizScore}</span>
            </div>

            <div className="py-8">
              <p className="text-sm text-slate-400 mb-2">What does this mean?</p>
              <h2 className="text-4xl font-bold text-purple-400">
                {currentTerm.term[language]}
              </h2>
              {currentTerm.pronunciation && (
                <p className="text-slate-500 mt-2">{currentTerm.pronunciation}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleQuizAnswer(true)}
                className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors"
              >
                {currentTerm.definition[language === 'en' ? 'pt' : 'en']}
              </button>
              <button
                onClick={() => handleQuizAnswer(false)}
                className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors"
              >
                Wrong answer (placeholder)
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl font-bold">Vocabulary Hub</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              language === 'en' ? 'bg-purple-500' : 'bg-slate-800'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('pt')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              language === 'pt' ? 'bg-purple-500' : 'bg-slate-800'
            }`}
          >
            Português
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search vocabulary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>
        <Button onClick={startQuiz} className="whitespace-nowrap">
          <Award className="w-5 h-5 mr-2" />
          Start Quiz
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedCategory === cat
                ? 'bg-purple-500'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVocab.map((item) => (
          <Card key={item.id} hover>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-purple-400">
                    {item.term[language]}
                  </h3>
                  {item.pronunciation && (
                    <p className="text-sm text-slate-500 mt-1">
                      {item.pronunciation}
                    </p>
                  )}
                </div>
                <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
                  {item.difficulty}
                </span>
              </div>

              <p className="text-slate-300">{item.definition[language]}</p>

              {item.examples && (
                <div className="pt-3 border-t border-slate-800">
                  <p className="text-sm text-slate-400 mb-1">Example:</p>
                  <p className="text-sm italic text-slate-300">
                    "{item.examples[language]}"
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-500">{item.category}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredVocab.length === 0 && (
        <Card>
          <p className="text-center text-slate-400">
            No vocabulary found. Try a different search or category.
          </p>
        </Card>
      )}
    </div>
  );
};

export default VocabularyHub;