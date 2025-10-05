import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InterviewSimulator from './pages/InterviewSimulator';
import PronunciationLab from './pages/PronunciationLab';
import VocabularyHub from './pages/VocabularyHub';
import GrammarHub from './pages/GrammarHub';
import BusinessEnglish from './pages/BusinessEnglish';
import WritingStudio from './pages/WritingStudio';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/interviews" element={
            <ProtectedRoute>
              <InterviewSimulator />
            </ProtectedRoute>
          } />
          
          <Route path="/pronunciation" element={
            <ProtectedRoute>
              <PronunciationLab />
            </ProtectedRoute>
          } />
          
          <Route path="/vocabulary" element={
            <ProtectedRoute>
              <VocabularyHub />
            </ProtectedRoute>
          } />
          
          <Route path="/grammar" element={
            <ProtectedRoute>
              <GrammarHub />
            </ProtectedRoute>
          } />
          
          <Route path="/business-english" element={
            <ProtectedRoute>
              <BusinessEnglish />
            </ProtectedRoute>
          } />
          
          <Route path="/writing" element={
            <ProtectedRoute>
              <WritingStudio />
            </ProtectedRoute>
          } />
          
          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;