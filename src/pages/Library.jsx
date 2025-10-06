// src/pages/Library.jsx
import React, { useState } from 'react';
import { BookOpen, Play, Clock, BarChart, Search, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

// Books data - your uploaded PDFs
// ADD MORE BOOKS HERE AS YOU UPLOAD THEM
const books = [
  {
    id: 'intermediate-english',
    type: 'book',
    level: 'B1',
    title: 'Intermediate English',
    duration: 'PDF Book',
    difficulty: 'Intermediate',
    description: 'Complete intermediate level English course with comprehensive lessons',
    topics: ['Grammar', 'Vocabulary', 'Reading', 'Writing'],
  },
  // ADD YOUR NEW BOOKS HERE:
  // {
  //   id: 'basic-english',
  //   type: 'book',
  //   level: 'A1',
  //   title: 'Basic English Course',
  //   duration: 'PDF Book',
  //   difficulty: 'Beginner',
  //   description: 'Start your English journey',
  //   topics: ['Alphabet', 'Numbers', 'Greetings'],
  // },
];

// Interactive audio lessons
const lessons = [
  {
    id: 'a1-greetings',
    level: 'A1',
    title: 'Basic Greetings and Introductions',
    duration: '15 min',
    difficulty: 'Beginner',
    description: 'Learn essential phrases for meeting people',
    topics: ['Hello', 'Goodbye', 'My name is', 'Nice to meet you'],
  },
  {
    id: 'a1-numbers',
    level: 'A1',
    title: 'Numbers and Counting',
    duration: '20 min',
    difficulty: 'Beginner',
    description: 'Master numbers from 1-100',
    topics: ['Cardinal numbers', 'Ordinal numbers', 'Prices', 'Phone numbers'],
  },
  {
    id: 'a2-daily-routine',
    level: 'A2',
    title: 'Talking About Daily Routines',
    duration: '25 min',
    difficulty: 'Elementary',
    description: 'Describe your typical day in English',
    topics: ['Time expressions', 'Daily activities', 'Present simple', 'Frequency adverbs'],
  },
  {
    id: 'a2-shopping',
    level: 'A2',
    title: 'Shopping and Prices',
    duration: '20 min',
    difficulty: 'Elementary',
    description: 'Learn to shop and negotiate in English',
    topics: ['Asking for prices', 'Sizes and colors', 'Can I have...', 'How much is...'],
  },
  {
    id: 'b1-past-stories',
    level: 'B1',
    title: 'Telling Stories in the Past',
    duration: '30 min',
    difficulty: 'Intermediate',
    description: 'Master past tenses and narrative skills',
    topics: ['Past simple', 'Past continuous', 'Time connectors', 'Story structure'],
  },
  {
    id: 'b1-opinions',
    level: 'B1',
    title: 'Expressing Opinions and Agreeing',
    duration: '25 min',
    difficulty: 'Intermediate',
    description: 'Learn to share your views effectively',
    topics: ['I think that...', 'In my opinion', 'Agreeing/disagreeing', 'Giving reasons'],
  },
  {
    id: 'b2-debates',
    level: 'B2',
    title: 'Debate and Argumentation',
    duration: '35 min',
    difficulty: 'Upper-Intermediate',
    description: 'Develop advanced discussion skills',
    topics: ['Formal expressions', 'Counter-arguments', 'Evidence', 'Persuasion'],
  },
  {
    id: 'b2-business',
    level: 'B2',
    title: 'Business English Essentials',
    duration: '40 min',
    difficulty: 'Upper-Intermediate',
    description: 'Professional English for the workplace',
    topics: ['Emails', 'Meetings', 'Presentations', 'Negotiations'],
  },
];

const Library = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const levels = ['all', 'A1', 'A2', 'B1', 'B2'];

  // Combine books and lessons
  const allContent = [...books, ...lessons];

  const filteredContent = allContent.filter(item => {
    const matchesLevel = selectedLevel === 'all' || item.level === selectedLevel;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelColor = (level) => {
    const colors = {
      'A1': 'bg-green-500/20 text-green-400 border-green-500/30',
      'A2': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'B1': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'B2': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'C1': 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[level] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <PageWrapper title="English Lessons Library" subtitle="Interactive lessons and books from beginner to advanced">
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons and books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedLevel === level
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {level === 'all' ? 'All Levels' : level}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-gray-400 text-sm">
          {filteredContent.length} {filteredContent.length === 1 ? 'item' : 'items'} found
          {books.length > 0 && ` (${books.length} ${books.length === 1 ? 'book' : 'books'}, ${lessons.length} ${lessons.length === 1 ? 'lesson' : 'lessons'})`}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500 transition-all cursor-pointer group"
              onClick={() => navigate(item.type === 'book' ? `/book/${item.id}` : `/lesson/${item.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-lg border ${getLevelColor(item.level)}`}>
                  <span className="font-bold">{item.level}</span>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-all">
                  {item.type === 'book' ? (
                    <FileText className="w-6 h-6 text-purple-400" />
                  ) : (
                    <Play className="w-6 h-6 text-purple-400" />
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {item.title}
              </h3>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {item.duration}
                </div>
                <div className="flex items-center gap-1">
                  <BarChart className="w-4 h-4" />
                  {item.difficulty}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {item.topics.slice(0, 3).map((topic, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-white/5 rounded-md text-gray-400"
                  >
                    {topic}
                  </span>
                ))}
                {item.topics.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-white/5 rounded-md text-gray-400">
                    +{item.topics.length - 3} more
                  </span>
                )}
              </div>

              {/* Type badge */}
              {item.type === 'book' && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-xs text-purple-400 font-semibold">PDF BOOK</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No content found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Library;