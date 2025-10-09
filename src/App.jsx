// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/NavBar';

// Import pages with your actual file names
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InterviewSimulator from './pages/InterviewSimulator';
import PronunciationLab from './pages/PronunciationLab';
import WritingPractice from './pages/WritingPractice';
import GrammarHub from './pages/GrammarHub';
import ReadingComprehension from './pages/ReadingComprehension';
import VocabularyBuilder from './pages/VocabularyBuilder';
import Library from './pages/Library';
import LessonPlayer from './pages/LessonPlayer';
import PDFViewer from './pages/PDFViewer';
import InterviewHistory from './pages/InterviewHistory';
import Settings from './pages/Settings';
import Leaderboard from './pages/Leaderboard';
import Certificates from './pages/Certificates';
import PrivateLessons from './pages/PrivateLessons';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/interview" element={
          <ProtectedRoute>
            <InterviewSimulator />
          </ProtectedRoute>
        } />
        
        <Route path="/pronunciation" element={
          <ProtectedRoute>
            <PronunciationLab />
          </ProtectedRoute>
        } />
        
        <Route path="/writing" element={
          <ProtectedRoute>
            <WritingPractice />
          </ProtectedRoute>
        } />
        
        <Route path="/grammar" element={
          <ProtectedRoute>
            <GrammarHub />
          </ProtectedRoute>
        } />
        
        <Route path="/reading" element={
          <ProtectedRoute>
            <ReadingComprehension />
          </ProtectedRoute>
        } />
        
        <Route path="/vocabulary" element={
          <ProtectedRoute>
            <VocabularyBuilder />
          </ProtectedRoute>
        } />
        
        <Route path="/library" element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        } />
        
        <Route path="/lesson/:lessonId" element={
          <ProtectedRoute>
            <LessonPlayer />
          </ProtectedRoute>
        } />
        
        <Route path="/book/:bookId" element={
          <ProtectedRoute>
            <PDFViewer />
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <InterviewHistory />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        } />
        
        <Route path="/certificates" element={
          <ProtectedRoute>
            <Certificates />
          </ProtectedRoute>
        } />
        
        <Route path="/private-lessons" element={
          <ProtectedRoute>
            <PrivateLessons />
          </ProtectedRoute>
        } />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;