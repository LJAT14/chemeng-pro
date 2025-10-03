// src/pages/PronunciationLab.jsx
import React, { useState } from 'react';
import { Mic, Volume2, CheckCircle, XCircle, Award } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

const PronunciationLab = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const pronunciationWords = [
    {
      id: 1,
      word: 'Thermodynamics',
      phonetic: '/ˌθɜːrmoʊdaɪˈnæmɪks/',
      difficulty: 'advanced',
      category: 'Chemical Engineering',
      tips: 'Break it down: THER-mo-dy-NAM-ics'
    },
    {
      id: 2,
      word: 'Catalyst',
      phonetic: '/ˈkætəlɪst/',
      difficulty: 'intermediate',
      category: 'Chemistry',
      tips: 'Stress on first syllable: CAT-a-list'
    },
    {
      id: 3,
      word: 'Equilibrium',
      phonetic: '/ˌiːkwɪˈlɪbriəm/',
      difficulty: 'intermediate',
      category: 'Chemistry',
      tips: 'Four syllables: e-qui-LI-bri-um'
    },
    {
      id: 4,
      word: 'Phenomenon',
      phonetic: '/fəˈnɒmɪnən/',
      difficulty: 'intermediate',
      category: 'General',
      tips: 'Stress on second syllable: fe-NOM-e-non'
    },
    {
      id: 5,
      word: 'Viscosity',
      phonetic: '/vɪˈskɒsəti/',
      difficulty: 'beginner',
      category: 'Physics',
      tips: 'vis-COS-i-ty'
    },
    {
      id: 6,
      word: 'Synthesis',
      phonetic: '/ˈsɪnθəsɪs/',
      difficulty: 'beginner',
      category: 'Chemistry',
      tips: 'SYN-the-sis'
    },
    {
      id: 7,
      word: 'Negligible',
      phonetic: '/ˈneɡlɪdʒəbl/',
      difficulty: 'intermediate',
      category: 'General',
      tips: 'NEG-li-gi-ble'
    },
    {
      id: 8,
      word: 'Stoichiometry',
      phonetic: '/ˌstɔɪkiˈɒmɪtri/',
      difficulty: 'advanced',
      category: 'Chemistry',
      tips: 'stoy-key-OM-e-tree'
    }
  ];

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.7; // Slower for pronunciation practice
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handlePractice = (word) => {
    setSelectedWord(word);
    speakWord(word.word);
  };

  const handleRecordAttempt = (word) => {
    // This would integrate with voice recognition
    // For now, just track attempts
    setAttempts(attempts + 1);
    alert(`Recording would start here. You'd say: "${word.word}"`);
    // In a real implementation, this would:
    // 1. Record user saying the word
    // 2. Compare with correct pronunciation
    // 3. Give feedback
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Mic className="w-8 h-8 text-green-400" />
        <h1 className="text-4xl font-bold">Pronunciation Lab</h1>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-400 font-semibold mb-2">🎤 How it works</p>
        <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
          <li>Click "Listen" to hear the correct pronunciation</li>
          <li>Read the phonetic spelling and tips</li>
          <li>Practice saying the word out loud</li>
          <li>Click "Record" to test yourself (feature in development)</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Words Practiced</p>
              <p className="text-3xl font-bold">{attempts}</p>
            </div>
            <Award className="w-10 h-10 text-green-400" />
          </div>
        </Card>
      </div>

      {selectedWord && (
        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Currently Practicing</h3>
              <button
                onClick={() => setSelectedWord(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center space-y-4 py-6">
              <h2 className="text-5xl font-bold text-purple-400">
                {selectedWord.word}
              </h2>
              <p className="text-2xl text-slate-400">{selectedWord.phonetic}</p>
              
              <div className="flex justify-center space-x-4">
                <Button onClick={() => speakWord(selectedWord.word)}>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Listen Again
                </Button>
                <Button variant="outline" onClick={() => handleRecordAttempt(selectedWord)}>
                  <Mic className="w-5 h-5 mr-2" />
                  Record Myself
                </Button>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 text-left">
                <p className="text-sm text-slate-400 mb-1">💡 Pronunciation Tip:</p>
                <p className="text-slate-200">{selectedWord.tips}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pronunciationWords.map((word) => (
          <Card 
            key={word.id} 
            hover
            className={selectedWord?.id === word.id ? 'border-purple-500' : ''}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{word.word}</h3>
                  <p className="text-sm text-slate-500">{word.phonetic}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  word.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                  word.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {word.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-400">{word.category}</p>

              <div className="flex space-x-2">
                <button
                  onClick={() => speakWord(word.word)}
                  className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">Listen</span>
                </button>
                <button
                  onClick={() => handlePractice(word)}
                  className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Mic className="w-4 h-4" />
                  <span className="text-sm">Practice</span>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PronunciationLab;