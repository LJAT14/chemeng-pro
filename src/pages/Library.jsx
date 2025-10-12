 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Filter, Loader, ExternalLink, Gamepad2, Trophy, Zap } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useToast } from '../context/ToastContext';

// Curated books list (always available, no API needed)
const CURATED_BOOKS = [
  {
    id: 'basic-english-1',
    title: 'Basic English Course - Lesson 1',
    description: 'Complete bilingual course (EN-PT) with grammar, reading, and listening',
    difficulty: 'Beginner',
    fileUrl: '/book/basic-english-1',
    source: 'Bacana English',
    pages: 5,
    category: 'Grammar',
    isBilingual: true,
  },
  {
    id: 'essential-grammar',
    title: 'Essential English Grammar',
    description: 'Complete grammar guide for beginners to advanced',
    difficulty: 'All Levels',
    fileUrl: 'https://ia803405.us.archive.org/4/items/essential-grammar-in-use-4th-edition/Essential%20Grammar%20in%20Use%204th%20Edition.pdf',
    source: 'Archive.org',
    pages: 319,
    category: 'Grammar'
  },
  {
    id: 'english-vocabulary',
    title: 'English Vocabulary in Use',
    description: 'Build your vocabulary systematically',
    difficulty: 'Intermediate',
    fileUrl: 'https://ia800305.us.archive.org/9/items/EnglishVocabularyInUseUpperIntermediate/English%20Vocabulary%20in%20Use%20-%20Upper-intermediate.pdf',
    source: 'Archive.org',
    pages: 316,
    category: 'Vocabulary'
  },
  {
    id: 'business-english',
    title: 'Business English Handbook',
    description: 'Professional English for the workplace',
    difficulty: 'Advanced',
    fileUrl: 'https://ia800806.us.archive.org/20/items/BusinessEnglishHandbook/Business%20English%20Handbook.pdf',
    source: 'Archive.org',
    pages: 178,
    category: 'Business'
  },
];

export default function Library() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [books, setBooks] = useState(CURATED_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('books');

  const categories = ['All', 'Grammar', 'Vocabulary', 'Business', 'Pronunciation'];

  // 2D Learning Games
  const learningGames = [
    {
      id: 'word-match',
      title: 'Word Match',
      description: 'Match English words with Portuguese translations',
      icon: '🎯',
      difficulty: 'Beginner',
      color: 'from-blue-500 to-cyan-500',
      playTime: '5-10 min',
      path: '/games/word-match',
      working: true
    },
    {
      id: 'spelling-bee',
      title: 'Spelling Bee',
      description: 'Listen and spell words correctly',
      icon: '🐝',
      difficulty: 'Intermediate',
      color: 'from-yellow-500 to-orange-500',
      playTime: '10-15 min',
      path: '/games/spelling-bee',
      working: false
    },
    {
      id: 'sentence-builder',
      title: 'Sentence Builder',
      description: 'Arrange words to form correct sentences',
      icon: '🏗️',
      difficulty: 'Intermediate',
      color: 'from-green-500 to-emerald-500',
      playTime: '10-15 min',
      path: '/games/sentence-builder',
      working: false
    },
    {
      id: 'vocabulary-race',
      title: 'Vocabulary Race',
      description: 'Race against time to match as many words as possible',
      icon: '🏃',
      difficulty: 'All Levels',
      color: 'from-purple-500 to-pink-500',
      playTime: '5 min',
      path: '/games/vocabulary-race',
      working: false
    },
    {
      id: 'grammar-quest',
      title: 'Grammar Quest',
      description: 'Adventure through grammar challenges',
      icon: '🗺️',
      difficulty: 'Advanced',
      color: 'from-red-500 to-orange-500',
      playTime: '15-20 min',
      path: '/games/grammar-quest',
      working: false
    },
    {
      id: 'pronunciation-challenge',
      title: 'Pronunciation Challenge',
      description: 'Record and compare your pronunciation',
      icon: '🎤',
      difficulty: 'All Levels',
      color: 'from-indigo-500 to-purple-500',
      playTime: '10 min',
      path: '/games/pronunciation-challenge',
      working: false
    },
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Upper-Intermediate':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <PageWrapper 
      title="Learning Library" 
      subtitle="Free books, games, and interactive learning resources"
    >
      {/* Tabs */}
      <div className="mb-8 flex gap-4 border-b border-white/20">
        <button
          onClick={() => setActiveTab('books')}
          className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'books'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          Books & Materials
        </button>
        <button
          onClick={() => setActiveTab('games')}
          className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'games'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          Learning Games
        </button>
      </div>

      {/* BOOKS TAB */}
      {activeTab === 'books' && (
        <>
          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for books..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-slate-400" />
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-6 bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
            <p className="text-blue-200 text-sm">
              📚 All books are free from Archive.org and Open Library. Click to read or download.
            </p>
          </div>

          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No books found</p>
              <p className="text-slate-500 text-sm mt-2">Try a different search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="group bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-all">
                      <BookOpen className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(book.difficulty)}`}>
                      {book.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {book.title}
                  </h3>

                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <span>{book.category}</span>
                    {book.pages && <span>{book.pages} pages</span>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (book.isBilingual) {
                          navigate(book.fileUrl);
                        } else {
                          window.open(book.fileUrl, '_blank');
                        }
                        showToast('Opening book...', 'info');
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      {book.isBilingual ? 'Start Lesson' : 'Read Now'}
                    </button>

                    {!book.isBilingual && (
                      <button
                        onClick={() => window.open(book.fileUrl, '_blank')}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* GAMES TAB */}
      {activeTab === 'games' && (
        <>
          <div className="mb-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Gamepad2 className="w-8 h-8 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Interactive Learning Games</h2>
            </div>
            <p className="text-slate-300">
              Learn English through fun, interactive 2D games!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningGames.map((game) => (
              <div
                key={game.id}
                className="group bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}>
                  {game.icon}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {game.title}
                  </h3>
                  <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                </div>

                <p className="text-slate-300 text-sm mb-4">
                  {game.description}
                </p>

                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>{game.playTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-purple-400" />
                    <span>+50 XP</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (game.working) {
                      navigate(game.path);
                    } else {
                      showToast('Game coming soon! 🎮', 'info');
                    }
                  }}
                  className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2`}
                >
                  <Gamepad2 className="w-5 h-5" />
                  {game.working ? 'Play Now' : 'Coming Soon'}
                </button>
              </div>
            ))}
          </div>

          {/* Coming Soon Banner */}
          <div className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Trophy className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  More Games Coming Soon! 🎮
                </h3>
                <p className="text-slate-300 mb-4">
                  We're developing more interactive games to make learning English fun and engaging.
                </p>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>✨ Listening comprehension games</li>
                  <li>✨ Multiplayer vocabulary battles</li>
                  <li>✨ Story-based adventure games</li>
                  <li>✨ Real-time pronunciation competitions</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );
}