// src/App.jsx - COMPLETE FIXED VERSION
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { ToastProvider } from './context/ToastContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InterviewSimulator from './pages/InterviewSimulator';
import PronunciationLab from './pages/PronunciationLab';
import VocabularyBuilder from './pages/VocabularyBuilder';
import ReadingComprehension from './pages/ReadingComprehension';
import WritingPractice from './pages/WritingPractice';
import Library from './pages/Library';
import PDFViewer from './pages/PDFViewer';
import BilingualBookViewer from './pages/BilingualBookViewer';
import Progress from './pages/Progress';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import PrivateLessons from './pages/PrivateLessons';

// Games
import WordMatchGame from './pages/games/WordMatchGame';

// Components
import Navbar from './components/NavBar';
import GuestModeBanner from './components/GuestModeBanner';
import { Loader } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let authSubscription = null;

    const initAuth = async () => {
      try {
        // Quick check for guest mode first (no API call)
        const guestMode = localStorage.getItem('guestMode') === 'true';
        
        if (guestMode) {
          if (isMounted) {
            const guestUser = JSON.parse(localStorage.getItem('guestUser') || '{}');
            setUser(guestUser);
            setIsGuest(true);
            setLoading(false);
          }
          return;
        }

        // Only check Supabase if not in guest mode
        const timeoutId = setTimeout(() => {
          if (isMounted) {
            console.log('Auth check timeout');
            setLoading(false);
          }
        }, 3000);

        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          clearTimeout(timeoutId);
          
          if (isMounted) {
            setUser(session?.user || null);
            setIsGuest(false);
            setLoading(false);
          }
        } catch (error) {
          clearTimeout(timeoutId);
          console.error('Session error:', error);
          if (isMounted) {
            setLoading(false);
          }
        }

        // Listen for auth changes
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (isMounted) {
            const currentlyGuest = localStorage.getItem('guestMode') === 'true';
            if (!currentlyGuest) {
              setUser(session?.user || null);
              setIsGuest(false);
            }
          }
        });
        
        authSubscription = data.subscription;

      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading Bacana English...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = Boolean(user) || isGuest;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {isAuthenticated && <Navbar />}
        {isAuthenticated && <GuestModeBanner />}
        
        <div className="page-transition">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/interview"
              element={isAuthenticated ? <InterviewSimulator /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/pronunciation"
              element={isAuthenticated ? <PronunciationLab /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/vocabulary"
              element={isAuthenticated ? <VocabularyBuilder /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/reading"
              element={isAuthenticated ? <ReadingComprehension /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/writing"
              element={isAuthenticated ? <WritingPractice /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/library"
              element={isAuthenticated ? <Library /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/library/:bookId"
              element={isAuthenticated ? <PDFViewer /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/book/:bookId"
              element={isAuthenticated ? <BilingualBookViewer /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/games/word-match"
              element={isAuthenticated ? <WordMatchGame /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/progress"
              element={isAuthenticated ? <Progress /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/leaderboard"
              element={isAuthenticated ? <Leaderboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/settings"
              element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/private-lessons"
              element={isAuthenticated ? <PrivateLessons /> : <Navigate to="/login" replace />}
            />

            {/* Catch all */}
            <Route 
              path="*" 
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
            />
          </Routes>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;