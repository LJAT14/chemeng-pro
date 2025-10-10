// src/App.jsx - OPTIMIZED VERSION (NO ROUTER - already in main.jsx)
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

    const initAuth = async () => {
      try {
        // Quick check for guest mode first (no API call)
        const guestMode = localStorage.getItem('guestMode') === 'true';
        
        if (guestMode && isMounted) {
          const guestUser = JSON.parse(localStorage.getItem('guestUser') || '{}');
          setUser(guestUser);
          setIsGuest(true);
          setLoading(false);
          return;
        }

        // Only check Supabase if not in guest mode
        // Set a timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          if (isMounted && loading) {
            console.log('Auth check timeout - continuing without auth');
            setLoading(false);
          }
        }, 3000); // 3 second timeout

        const { data: { session } } = await supabase.auth.getSession();
        
        clearTimeout(timeoutId);
        
        if (isMounted) {
          setUser(session?.user || null);
          setIsGuest(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes (only if not guest)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (isMounted && !isGuest) {
          setUser(session?.user || null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Loading screen
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

  // Check if user is authenticated (real user OR guest)
  const isAuthenticated = user || isGuest;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {isAuthenticated && <Navbar />}
        {isAuthenticated && <GuestModeBanner />}
        
        {/* Wrap Routes in a div with page transition */}
        <div className="page-transition">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/interview"
              element={isAuthenticated ? <InterviewSimulator /> : <Navigate to="/login" />}
            />
            <Route
              path="/pronunciation"
              element={isAuthenticated ? <PronunciationLab /> : <Navigate to="/login" />}
            />
            <Route
              path="/vocabulary"
              element={isAuthenticated ? <VocabularyBuilder /> : <Navigate to="/login" />}
            />
            <Route
              path="/reading"
              element={isAuthenticated ? <ReadingComprehension /> : <Navigate to="/login" />}
            />
            <Route
              path="/writing"
              element={isAuthenticated ? <WritingPractice /> : <Navigate to="/login" />}
            />
            <Route
              path="/library"
              element={isAuthenticated ? <Library /> : <Navigate to="/login" />}
            />
            <Route
              path="/library/:bookId"
              element={isAuthenticated ? <PDFViewer /> : <Navigate to="/login" />}
            />
            <Route
              path="/book/:bookId"
              element={isAuthenticated ? <BilingualBookViewer /> : <Navigate to="/login" />}
            />
            <Route
              path="/progress"
              element={isAuthenticated ? <Progress /> : <Navigate to="/login" />}
            />
            <Route
              path="/leaderboard"
              element={isAuthenticated ? <Leaderboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/settings"
              element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
            />
            <Route
              path="/private-lessons"
              element={isAuthenticated ? <PrivateLessons /> : <Navigate to="/login" />}
            />

            {/* Catch all - redirect to dashboard if authenticated, login if not */}
            <Route 
              path="*" 
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
            />
          </Routes>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;