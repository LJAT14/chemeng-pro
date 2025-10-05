// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InterviewSimulator from './pages/InterviewSimulator';
import PronunciationLab from './pages/PronunciationLab';
import WritingPractice from './pages/WritingPractice';
import GrammarHub from './pages/GrammarHub';
import VocabularyBuilder from './pages/VocabularyBuilder';
import ReadingComprehension from './pages/ReadingComprehension';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes - No login required */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Guest Mode Routes - Available to everyone */}
          <Route path="/interview" element={<InterviewSimulator />} />
          <Route path="/pronunciation" element={<PronunciationLab />} />
          <Route path="/writing" element={<WritingPractice />} />
          <Route path="/grammar" element={<GrammarHub />} />
          <Route path="/vocabulary" element={<VocabularyBuilder />} />
          <Route path="/reading" element={<ReadingComprehension />} />
          
          {/* Dashboard requires login */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;