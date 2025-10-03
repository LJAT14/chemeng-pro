// src/pages/GrammarHub.jsx - Visually enhanced
import React, { useState } from 'react';
import { BookOpen, Filter, Search, Award, TrendingUp } from 'lucide-react';
import Card from '../components/shared/Card';
import { grammarRules } from '../data/grammarRules';

const GrammarHub = () => {
  const [language, setLanguage] = useState('en');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRule, setExpandedRule] = useState(null);

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
  const categories = ['all', ...new Set(grammarRules.map(r => r.category))];

  const filteredRules = grammarRules.filter(rule => {
    const matchesDifficulty = selectedDifficulty === 'all' || rule.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || rule.category === selectedCategory;
    const matchesSearch = rule.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.title.pt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDifficulty && matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-yellow-500 to-orange-500';
      case 'advanced': return 'from-red-500 to-pink-500';
      default: return 'from-purple-500 to-blue-500';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      tenses: '⏰',
      conditionals: '❓',
      modals: '🔔',
      voice: '📢',
      articles: '📰',
      clauses: '🔗',
      comparison: '⚖️',
      speech: '💬'
    };
    return icons[category] || '📚';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl animate-float">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text-animated">Grammar Hub</h1>
            <p className="text-slate-400 mt-1">Master English grammar rules</p>
          </div>
        </div>
        
        {/* Language Toggle */}
        <div className="flex items-center bg-slate-800/50 rounded-xl p-1 border border-slate-700">
          <button
            onClick={() => setLanguage('en')}
            className={`px-6 py-2 rounded-lg transition-all ${
              language === 'en' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('pt')}
            className={`px-6 py-2 rounded-lg transition-all ${
              language === 'pt' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Português
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Rules</p>
              <p className="text-3xl font-bold text-purple-400">{grammarRules.length}</p>
            </div>
            <BookOpen className="w-10 h-10 text-purple-400 opacity-50" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Filtered Results</p>
              <p className="text-3xl font-bold text-green-400">{filteredRules.length}</p>
            </div>
            <Filter className="w-10 h-10 text-green-400 opacity-50" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Categories</p>
              <p className="text-3xl font-bold text-blue-400">{categories.length - 1}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search grammar rules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 transition-all"
        />
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Difficulty Filter */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-2 flex items-center">
            <Award className="w-4 h-4 mr-2" />
            Difficulty Level
          </h3>
          <div className="flex flex-wrap gap-2">
            {difficulties.map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDifficulty === diff
                    ? `bg-gradient-to-r ${getDifficultyColor(diff)} shadow-lg scale-105`
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grammar Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRules.map((rule) => {
          const isExpanded = expandedRule === rule.id;
          
          return (
            <Card 
              key={rule.id} 
              className={`transition-all duration-300 ${
                isExpanded ? 'lg:col-span-2 border-purple-500/50' : ''
              }`}
              hover
            >
              <div className="space-y-4">
                {/* Rule Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{getCategoryIcon(rule.category)}</span>
                      <h3 className="text-xl font-bold text-purple-400">
                        {rule.title[language]}
                      </h3>
                    </div>
                    <p className="text-slate-300">{rule.explanation[language]}</p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getDifficultyColor(rule.difficulty)}`}>
                    {rule.difficulty}
                  </span>
                </div>

                {/* Rules List */}
                {rule.rules && rule.rules.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-400">Rules:</h4>
                    {rule.rules.map((r, idx) => (
                      <div key={idx} className="flex items-start space-x-2 p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-purple-400 font-bold">•</span>
                        <p className="text-slate-200 text-sm">{r[language]}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Examples */}
                {rule.examples && rule.examples.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-400">Examples:</h4>
                    {rule.examples.map((ex, idx) => (
                      <div key={idx} className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-blue-300 italic">"{ex[language]}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                  className="w-full py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {isExpanded ? '▲ Show Less' : '▼ Show More'}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredRules.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-slate-400 text-lg">No grammar rules found matching your filters.</p>
          <button
            onClick={() => {
              setSelectedDifficulty('all');
              setSelectedCategory('all');
              setSearchTerm('');
            }}
            className="mt-4 px-6 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Clear Filters
          </button>
        </Card>
      )}
    </div>
  );
};

export default GrammarHub;