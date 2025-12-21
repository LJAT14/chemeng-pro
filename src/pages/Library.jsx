 import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Upload, Search, Filter } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useToast } from '../context/ToastContext';
import BookLibrary from './BookLibrary'; // Import your existing component!

// Curated free books
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
  const [activeTab, setActiveTab] = useState('free-books');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Grammar', 'Vocabulary', 'Business', 'Pronunciation'];

  const filteredBooks = CURATED_BOOKS.filter(book => {
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
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <PageWrapper 
      title="📚 Learning Library" 
      subtitle="Free books, your uploaded PDFs, and AI-powered learning"
    >
      {/* Tabs */}
      <div className="mb-8">
        <div className="flex gap-4 border-b border-white/20">
          <button
            onClick={() => setActiveTab('free-books')}
            className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'free-books'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Free Books
          </button>
          
          <button
            onClick={() => setActiveTab('my-books')}
            className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'my-books'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-5 h-5" />
            My Uploaded Books
          </button>
        </div>
      </div>

      {/* FREE BOOKS TAB */}
      {activeTab === 'free-books' && (
        <>
          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
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

                <button
                  onClick={() => {
                    if (book.isBilingual) {
                      navigate(book.fileUrl);
                    } else {
                      window.open(book.fileUrl, '_blank');
                    }
                    showToast('Opening book...', 'info');
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  {book.isBilingual ? 'Start Lesson' : 'Read Now'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MY BOOKS TAB - Import your existing BookLibrary component! */}
      {activeTab === 'my-books' && (
        <div className="mt-4">
          {/* Render your existing BookLibrary component here! */}
          <BookLibrary />
        </div>
      )}
    </PageWrapper>
  );
}