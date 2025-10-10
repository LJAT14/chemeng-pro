 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Filter, Loader, ExternalLink } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { CURATED_BOOKS, searchAllBooks } from '../services/booksAPI';

export default function Library() {
  const navigate = useNavigate();
  const [books, setBooks] = useState(CURATED_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Grammar', 'Vocabulary', 'Business', 'Pronunciation', 'Literature', 'ESL'];

  // Load more books from APIs
  const loadMoreBooks = async () => {
    setLoading(true);
    try {
      const query = searchQuery || 'english learning';
      const apiBooks = await searchAllBooks(query);
      setBooks(apiBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 2) {
      const timer = setTimeout(() => {
        loadMoreBooks();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Load default Open Library books on mount
      const loadDefaultBooks = async () => {
        setLoading(true);
        const defaultBooks = await searchAllBooks('english learning');
        setBooks(defaultBooks);
        setLoading(false);
      };
      loadDefaultBooks();
    }
  }, [searchQuery]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-400';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Advanced':
        return 'bg-red-500/20 text-red-400';
      case 'Upper-Intermediate':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <PageWrapper 
      title="English Learning Library" 
      subtitle="Free books, grammar guides, and learning resources"
    >
      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for books, topics, or authors..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {loading && (
            <Loader className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 animate-spin" />
          )}
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
          📚 All books are free and sourced from Project Gutenberg, Internet Archive, and Open Library.
          Click on any book to read online or download.
        </p>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No books found</p>
          <p className="text-slate-500 text-sm mt-2">Try a different search term or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="group bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-all">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(book.difficulty)}`}>
                  {book.difficulty}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {book.title}
              </h3>

              <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                {book.description}
              </p>

              <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                <span>{book.category}</span>
                {book.pages && <span>{book.pages} pages</span>}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <span>Source: {book.source}</span>
              </div>

              <div className="flex gap-2">
                {/* View in App Button */}
                <button
                  onClick={() => navigate(`/library/${book.id}`)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Now
                </button>

                {/* Open Direct Link Button */}
                <button
                  onClick={() => window.open(book.fileUrl, '_blank')}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all flex items-center justify-center"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!loading && searchQuery.length <= 2 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMoreBooks}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all border border-white/20"
          >
            Load More Books from Online Libraries
          </button>
        </div>
      )}
    </PageWrapper>
  );
}