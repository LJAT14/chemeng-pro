 import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  Mic,
  BookOpen,
  PenTool,
  Headphones,
  Trophy,
  TrendingUp,
  Target,
  Flame,
  Award,
  Calendar,
  CheckCircle2,
  Loader
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [stats, setStats] = useState({
    lessonsCompleted: 0,
    currentStreak: 0,
    totalPoints: 0,
    rank: '--',
    weeklyActivity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check for guest mode
        const guestMode = localStorage.getItem('guestMode') === 'true';
        
        if (guestMode) {
          const guestUser = JSON.parse(localStorage.getItem('guestUser') || '{}');
          setUser(guestUser);
          setIsGuest(true);
          
          // Load guest stats from localStorage
          const guestStats = JSON.parse(localStorage.getItem('guestStats') || '{}');
          setStats({
            lessonsCompleted: guestStats.lessonsCompleted || 0,
            currentStreak: guestStats.currentStreak || 0,
            totalPoints: guestStats.totalPoints || 0,
            rank: guestStats.rank || 'Guest',
            weeklyActivity: guestStats.weeklyActivity || 0,
          });
          setLoading(false);
          return;
        }

        // Load real user data from Supabase
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          setUser(authUser);
          
          // Fetch user progress with timeout
          const progressPromise = supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          const gamificationPromise = supabase
            .from('user_gamification')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          // Set 2 second timeout for data fetching
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 2000)
          );

          try {
            const [progressResult, gamificationResult] = await Promise.race([
              Promise.all([progressPromise, gamificationPromise]),
              timeoutPromise
            ]);

            if (progressResult) {
              const { data: progressData } = progressResult;
              const { data: gamificationData } = gamificationResult;

              setStats({
                lessonsCompleted: progressData?.lessons_completed || 0,
                currentStreak: gamificationData?.current_streak || 0,
                totalPoints: gamificationData?.total_points || 0,
                rank: gamificationData?.rank || '--',
                weeklyActivity: progressData?.weekly_activity || 0,
              });
            }
          } catch (error) {
            console.log('Using default stats due to timeout or error');
            // Continue with default stats
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const activities = [
    {
      icon: Mic,
      title: 'Interview Simulator',
      description: 'Practice technical interviews with AI feedback',
      path: '/interview',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Headphones,
      title: 'Pronunciation Lab',
      description: 'Perfect your English pronunciation',
      path: '/pronunciation',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: BookOpen,
      title: 'Vocabulary Builder',
      description: 'Expand your technical vocabulary',
      path: '/vocabulary',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: PenTool,
      title: 'Reading Comprehension',
      description: 'Improve reading skills with technical articles',
      path: '/reading',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: PenTool,
      title: 'Writing Practice',
      description: 'Enhance your technical writing skills',
      path: '/writing',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: BookOpen,
      title: 'Library',
      description: 'Access English lessons and books',
      path: '/library',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <PageWrapper
      title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'Guest'}! 👋`}
      subtitle="Continue your English learning journey"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">{stats.lessonsCompleted}</span>
          </div>
          <p className="text-slate-300 text-sm">Lessons Completed</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-8 h-8 text-orange-400" />
            <span className="text-2xl font-bold text-white">{stats.currentStreak}</span>
          </div>
          <p className="text-slate-300 text-sm">Day Streak</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{stats.totalPoints}</span>
          </div>
          <p className="text-slate-300 text-sm">Total Points</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">{stats.rank}</span>
          </div>
          <p className="text-slate-300 text-sm">Global Rank</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Continue Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity, index) => (
            <button
              key={index}
              onClick={() => navigate(activity.path)}
              className="group bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all text-left"
            >
              <div className={`w-12 h-12 rounded-lg ${activity.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <activity.icon className={`w-6 h-6 bg-gradient-to-r ${activity.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{activity.title}</h3>
              <p className="text-slate-400 text-sm">{activity.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Weekly Progress</h3>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Activity Days</span>
              <span className="text-white font-semibold">{stats.weeklyActivity}/7</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${(stats.weeklyActivity / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Daily Goal</h3>
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Today's Target</span>
              <span className="text-white font-semibold">20 minutes</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                style={{ width: '60%' }}
              />
            </div>
            <p className="text-slate-400 text-sm">12 minutes completed today</p>
          </div>
        </div>
      </div>

      {/* Guest Mode Notice */}
      {isGuest && (
        <div className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Award className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                Create an account to save your progress! 🚀
              </h3>
              <p className="text-slate-300 mb-4">
                Sign up now to track your learning journey, earn achievements, and compete on the leaderboard.
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem('guestMode');
                  localStorage.removeItem('guestUser');
                  navigate('/login');
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all"
              >
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}