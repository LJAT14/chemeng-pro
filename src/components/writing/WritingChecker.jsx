// src/components/writing/WritingChecker.jsx
import React, { useState } from 'react';
import { PenTool, CheckCircle2, AlertTriangle, Lightbulb, Sparkles, FileText } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import groqService from '../../services/groqService';

const WritingChecker = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const prompt = `Analyze this text for grammar, style, and clarity. Provide feedback in this format:

**Grammar Issues:**
- List any grammar errors found (or "No major issues")

**Style Suggestions:**
- 2-3 specific improvements for better writing

**Clarity:**
- 1-2 ways to make the text clearer

**Overall Rating:** X/10

Text to analyze:
"${text}"

Be specific, constructive, and helpful.`;

      const response = await groqService.chat(prompt, { 
        type: 'grammar',
        temperature: 0.3 
      });

      setAnalysis({
        feedback: response,
        wordCount: text.split(/\s+/).filter(w => w).length,
        charCount: text.length,
        sentences: text.split(/[.!?]+/).filter(s => s.trim()).length
      });
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysis({
        feedback: 'Unable to analyze. Please check your internet connection and Groq API key.',
        error: true
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearText = () => {
    setText('');
    setAnalysis(null);
  };

  const exampleTexts = [
    {
      label: 'Technical Email',
      text: 'Dear team, I am writing to inform you about the new procedure. The results shows significant improvement. Please review the data and provide feedback by Friday.'
    },
    {
      label: 'Lab Report',
      text: 'The experiment was conducted at room temperature. Results was recorded every hour. The catalyst increased reaction rate significantly which is good for industrial applications.'
    },
    {
      label: 'Business Proposal',
      text: 'We propose to implement a new system. This will help improve efficiency. The cost is estimated at $50,000. Implementation time is 3 months.'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-purple-400" />
          Try an example:
        </h3>
        <div className="flex flex-wrap gap-2">
          {exampleTexts.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setText(example.text)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              {example.label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <PenTool className="w-4 h-4 mr-2" />
              Your Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here... (emails, reports, essays, etc.)"
              className="w-full h-48 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {text && (
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>
                {text.split(/\s+/).filter(w => w).length} words • {text.length} characters • {text.split(/[.!?]+/).filter(s => s.trim()).length} sentences
              </span>
            </div>
          )}

          <div className="flex space-x-3">
            <Button 
              onClick={analyzeText} 
              disabled={!text.trim() || isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing with Groq AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
            {text && (
              <button
                onClick={clearText}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </Card>

      {analysis && (
        <Card className={analysis.error ? 'border-red-500/50' : 'border-green-500/50'}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {analysis.error ? (
                <AlertTriangle className="w-6 h-6 text-red-400" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              )}
              <h3 className="text-xl font-bold">Analysis Results</h3>
            </div>

            {!analysis.error && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900/50 rounded-lg">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Words</p>
                  <p className="text-2xl font-bold text-blue-400">{analysis.wordCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Characters</p>
                  <p className="text-2xl font-bold text-purple-400">{analysis.charCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Sentences</p>
                  <p className="text-2xl font-bold text-green-400">{analysis.sentences}</p>
                </div>
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <div className="p-4 bg-slate-900/50 rounded-lg whitespace-pre-wrap text-slate-200 leading-relaxed">
                {analysis.feedback}
              </div>
            </div>

            {!analysis.error && (
              <div className="flex items-start space-x-2 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-semibold mb-1">Pro Tip</p>
                  <p>Apply these suggestions to improve clarity and professionalism. Consider reading your text aloud to catch awkward phrasing.</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WritingChecker;