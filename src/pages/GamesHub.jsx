import { useNavigate } from 'react-router-dom';
import { Zap, Hammer, Shuffle, Headphones, Mic, Target } from 'lucide-react';

function GamesHub() {
  const navigate = useNavigate();

  const games = [
    {
      id: 'word-match',
      name: 'Word Match',
      description: 'Match English words with their Portuguese translations',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      difficulty: 'Beginner',
      time: '5-10 min',
      path: '/games/word-match'
    },
    {
      id: 'speed-match',
      name: 'Speed Match',
      description: 'Race against time to match vocabulary words',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      difficulty: 'Intermediate',
      time: '3-5 min',
      path: '/games/speed-match'
    },
    {
      id: 'sentence-builder',
      name: 'Sentence Builder',
      description: 'Build perfect English sentences from word blocks',
      icon: Hammer,
      color: 'from-green-500 to-green-600',
      difficulty: 'Intermediate',
      time: '5-10 min',
      path: '/games/sentence-builder'
    },
    {
      id: 'word-scramble',
      name: 'Word Scramble',
      description: 'Unscramble letters to form English words',
      icon: Shuffle,
      color: 'from-yellow-500 to-orange-500',
      difficulty: 'Beginner',
      time: '3-5 min',
      path: '/games/word-scramble'
    },
    {
      id: 'listening',
      name: 'Listening Challenge',
      description: 'Listen to audio and choose the correct answer',
      icon: Headphones,
      color: 'from-pink-500 to-rose-600',
      difficulty: 'Advanced',
      time: '10-15 min',
      path: '/games/listening'
    },
    {
      id: 'pronunciation',
      name: 'Pronunciation Practice',
      description: 'Perfect your English pronunciation with AI feedback',
      icon: Mic,
      color: 'from-indigo-500 to-purple-600',
      difficulty: 'All Levels',
      time: '5-10 min',
      path: '/games/pronunciation'
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Advanced':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎮 Game Center
          </h1>
          <p className="text-xl text-purple-200">
            Learn English through fun interactive games!
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">6</div>
              <div className="text-white/70">Total Games</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">∞</div>
              <div className="text-white/70">Play Unlimited</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">🏆</div>
              <div className="text-white/70">Earn Achievements</div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <button
                key={game.id}
                onClick={() => navigate(game.path)}
                className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl text-left"
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${game.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Game Name */}
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {game.name}
                </h3>

                {/* Description */}
                <p className="text-white/70 mb-4 line-clamp-2">
                  {game.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </div>
                  <div className="text-white/50 text-sm">
                    ⏱️ {game.time}
                  </div>
                </div>

                {/* Play Button */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-purple-300 font-semibold group-hover:text-purple-200">
                    <span>Play Now</span>
                    <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Fun Fact Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-600/20 to-green-600/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-start gap-6">
            <div className="text-5xl">💡</div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Did You Know?
              </h3>
              <p className="text-white/80 text-lg">
                Playing educational games for just 10 minutes a day can improve your vocabulary retention by up to 60%! 
                Choose a game above and start your learning journey today! 🚀
              </p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span>🎯</span> For Beginners
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>• Start with Word Match or Word Scramble</li>
              <li>• Play 5-10 minutes daily for best results</li>
              <li>• Don't worry about making mistakes!</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span>🚀</span> For Advanced Learners
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>• Challenge yourself with Listening games</li>
              <li>• Set time limits for Speed Match</li>
              <li>• Practice pronunciation daily</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamesHub;
