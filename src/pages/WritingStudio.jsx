// src/pages/WritingStudio.jsx
import React from 'react';
import { PenTool } from 'lucide-react';
import WritingChecker from '../components/writing/WritingChecker';

const WritingStudio = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <PenTool className="w-8 h-8 text-purple-400" />
        <div>
          <h1 className="text-4xl font-bold">Writing Studio</h1>
          <p className="text-slate-400 mt-2">Improve your technical and business writing with AI-powered analysis</p>
        </div>
      </div>

      <WritingChecker />
    </div>
  );
};

export default WritingStudio;