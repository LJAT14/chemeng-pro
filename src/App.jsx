// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InterviewSimulator from './pages/InterviewSimulator';
import InterviewHistory from './pages/InterviewHistory';
import PronunciationLab from './pages/PronunciationLab';
import WritingPractice from './pages/WritingPractice';
import GrammarHub from './pages/GrammarHub';
import VocabularyBuilder from './pages/VocabularyBuilder';
import ReadingComprehension from './pages/ReadingComprehension';
import Library from './pages/Library';
import LessonPlayer from './pages/LessonPlayer';
import LandingPage from './pages/LandingPage';
import Navbar from './components/NavBar';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
              <Routes>
                {/* Routes WITHOUT Navbar */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                
                {/* Routes WITH Navbar */}
                <Route path="/*" element={
                  <>
                    <Navbar />
                    <Routes>
                      <Route path="/interview" element={<InterviewSimulator />} />
                      <Route path="/interview-history" element={<InterviewHistory />} />
                      <Route path="/pronunciation" element={<PronunciationLab />} />
                      <Route path="/writing" element={<WritingPractice />} />
                      <Route path="/grammar" element={<GrammarHub />} />
                      <Route path="/vocabulary" element={<VocabularyBuilder />} />
                      <Route path="/reading" element={<ReadingComprehension />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                  </>
                } />
              </Routes>
            </div>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;