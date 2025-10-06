// src/pages/Library.jsx
import React, { useState } from 'react';
import { BookOpen, Play, Clock, BarChart, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

// Sample lessons structure - add your content here
const lessons = [
  {
    id: 1,
    title: 'Introducing Yourself',
    level: 'A1',
    duration: '5 min',
    audioUrl: '/lessons/a1/lesson1.mp3',
    transcript: 'Hello, my name is...',
    vocabulary: ['name', 'from', 'work', 'study'],
    questions: [
      { q: 'What is the speaker\'s name?', options: ['John', 'Mary', 'Peter'], correct: 0 },
    ]
  },
  {
    id: 2,
    title: 'Daily Routines',
    level: 'A1',
    duration: '6 min',
    audioUrl: '/lessons/a1/lesson2.mp3',
    transcript: 'I wake up at 7am...',
    vocabulary: ['wake up', 'breakfast', 'go to work', 'evening'],
    questions: [
      { q: 'What time does the speaker wake up?', options: ['6am', '7am', '8am'], correct: 1 },
    ]
  },
  {
    id: 3,
    title: 'Shopping and Money',
    level: 'A2',
    duration: '7 min',
    audioUrl: '/lessons/a2/lesson1.mp3',
    transcript: 'I need to buy...',
    vocabulary: ['buy', 'expensive', 'cheap', 'pay'],
    questions: []
  },
  {
    id: 4,
    title: 'Describing People',
    level: 'A2',
    duration: '6 min',
    audioUrl: '/lessons/a2/lesson2.mp3',
    transcript: 'She has long hair...',
    vocabulary: ['tall', 'short', 'hair', 'eyes', 'friendly'],
    questions: []
  },
  {
    id: 5,
    title: 'Travel Experiences',
    level: 'B1',
    duration: '8 min',
    audioUrl: '/lessons/b1/lesson1.mp3',
    transcript: 'Last summer I visited...',
    vocabulary: ['journey', 'destination', 'accommodation', 'experience'],
    questions: []
  },
  {
    id: 6,
    title: 'Work and Career',
    level: 'B1',
    duration: '9 min',
    audioUrl: '/lessons/b1/lesson2.mp3',
    transcript: 'My career path...',
    vocabulary: ['position', 'responsibilities', 'colleagues', 'promotion'],
    questions: []
  },
  {
    id: 7,
    title: 'Environmental Issues',
    level: 'B2',
    duration: '10 min',
    audioUrl: '/lessons/b2/lesson1.mp3',
    transcript: 'Climate change affects...',
    vocabulary: ['sustainability', 'pollution', 'renewable', 'conservation'],
    questions: []
  },
  {
    id: 8,
    title: 'Technology and Society',
    level: 'B2',
    duration: '11 min',
    audioUrl: '/lessons/b2/lesson2.mp3',
    transcript: 'Digital transformation...',
    vocabulary: ['innovation', 'artificial intelligence', 'impact', 'evolve'],
    questions: []
  },
];

const Library = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const levels = ['A1', 'A2', 'B1', 'B2'];

  const filteredLessons = lessons.filter(lesson => {
    const matchesLevel = selectedLevel === 'all' || lesson.level === selectedLevel;
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelColor = (level) => {
    const colors = {
      'A1': 'bg-green-500/20 text-green-400 border-green-500',
      'A2': 'bg-blue-500/20 text-blue-400 border-blue-500',
      'B1': 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      'B2': 'bg-orange-500/20 text-orange-400 border-orange-500',
    };
    return colors[level] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <PageWrapper 
      title="English Lessons Library" 
      subtitle="Learn English from A1 to B2 with audio lessons and interactive exercises"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedLevel === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              All Levels
            </button>
            {levels.map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedLevel === level
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {levels.map(level => {
            const count = lessons.filter(l => l.level === level).length;
            return (
              <div key={level} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="text-gray-400 text-sm mb-1">{level} Level</div>
                <div className="text-2xl font-bold text-white">{count} lessons</div>
              </div>
            );
          })}
        </div>

        {/* Lessons Grid */}
        {filteredLessons.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No lessons found</h3>
            <p className="text-gray-400">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                className="group bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-500 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-3 py-1 rounded-lg border ${getLevelColor(lesson.level)}`}>
                    {lesson.level}
                  </div>
                  <Play className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="text-white font-semibold text-lg mb-3">{lesson.title}</h3>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {lesson.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {lesson.vocabulary.length} words
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {lesson.vocabulary.slice(0, 3).map((word, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded"
                    >
                      {word}
                    </span>
                  ))}
                  {lesson.vocabulary.length > 3 && (
                    <span className="text-xs px-2 py-1 text-gray-500">
                      +{lesson.vocabulary.length - 3}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Library;