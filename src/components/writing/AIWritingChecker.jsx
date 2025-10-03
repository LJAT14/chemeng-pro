import React, { useState } from 'react';
import { PenTool, CheckCircle2, AlertTriangle, Info, Sparkles } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import groqService from '../../services/groqService';

const AIWritingChecker = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    
    try {
      const prompt = `Analyze this text for grammar, style, and clarity. Provide feedback in JSON format:

{
  "overallScore": [0-100],
  "grammar": {"score": [0-100], "issues": [{"text": "error", "correction": "fix", "explanation": "why"}]},
  "style": {"score": [0-100], "suggestions": ["suggestion"]},
  "clarity": {"score": [0-100], "improvements": ["improvement"]},
  "strengths": ["strength"],
  "summary": "assessment"
}

Text: "${text}"

Respond ONLY with valid JSON.`;

      const response = await groqService.chat(prompt, { type: 'grammar', temperature: 0.3 });

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0]);
        setAnalysis(analysisData);
      } else {
        setAnalysis({
          overallScore: 75,
          summary: response,
          grammar: { score: 75, issues: [] },
          style: { score: 75, suggestions: [] },
          clarity: { score: 75, improvements: [] },
          strengths: []
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400 border-green-500 bg-green-500/10';
    if (score >= 75) return 'text-blue-400 border-blue-500 bg-blue-500/10';
    if (score >= 60) return 'text-yellow-400 border-yellow-500 bg-yellow-500/10';
    return 'text-red-400 border-red-500 bg-red-500/10';
  };

  return (
    <div className="space-y-6">
      <Card hover={false}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Writing Checker</h2>
            <p className="text-slate-400 text-sm">Get instant feedback on your writing</p>
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
            placeholder="Paste your text here for AI analysis..."
          />
          <p className="text-xs text-slate-500">
            {text.length} characters • {text.split(/\s+/).filter(w => w).length} words
          </p>

          <Button onClick={analyzeText} disabled={!text.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? 'Analyzing...' : 'Analyze Writing'}
          </Button>
        </div>
      </Card>

      {analysis && (
        <Card hover={false}>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
            <div className="text-6xl font-bold mb-2 text-green-400">
              {analysis.overallScore}<span className="text-2xl">/100</span>
            </div>
            <p className="text-slate-300">{analysis.summary}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AIWritingChecker;