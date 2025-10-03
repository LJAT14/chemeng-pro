// src/pages/PronunciationLab.jsx - With Voice Recognition
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, CheckCircle, XCircle, Award, Loader2 } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../shared/Button';
import groqWhisperService from '../services/groqWhisperService';

const PronunciationLab = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const pronunciationWords = [
    {
      {/* Selected Word Practice */}
      {selectedWord && (
        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Currently Practicing</h3>
              <button
                onClick={() => setSelectedWord(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center space-y-4 py-6">
              <h2 className="text-5xl font-bold text-purple-400 animate-pulse">
                {selectedWord.word}
              </h2>
              <p className="text-2xl text-slate-400">{selectedWord.phonetic}</p>
              
              <div className="flex justify-center space-x-4">
                <Button onClick={() => speakWord(selectedWord.word)}>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Listen
                </Button>
                
                {!isRecording && !isAnalyzing && (
                  <Button 
                    onClick={startRecording}
                    className="bg-gradient-to-r from-red-500 to-pink-500"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Start Recording
                  </Button>
                )}
                
                {isRecording && (
                  <Button 
                    onClick={stopRecording}
                    className="bg-red-600 animate-pulse"
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Stop Recording
                  </Button>
                )}
                
                {isAnalyzing && (
                  <Button disabled>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </Button>
                )}
              </div>

              <div className="bg-slate-800 rounded-lg p-4 text-left">
                <p className="text-sm text-slate-400 mb-1">💡 Pronunciation Tip:</p>
                <p className="text-slate-200">{selectedWord.tips}</p>
              </div>

              {lastResult && (
                <div className={`p-4 rounded-lg border-2 ${
                  lastResult.correct 
                    ? 'bg-green-500/10 border-green-500/50' 
                    : 'bg-red-500/10 border-red-500/50'
                }`}>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {lastResult.correct ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    <p className={`font-bold ${lastResult.correct ? 'text-green-400' : 'text-red-400'}`}>
                      {lastResult.message}
                    </p>
                  </div>
                  <p className="text-sm text-slate-400">
                    You said: "<span className="text-white">{lastResult.spoken}</span>"
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Word Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pronunciationWords.map((word) => (
          <Card 
            key={word.id} 
            hover
            className={selectedWord?.id === word.id ? 'border-purple-500 scale-105' : ''}
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
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center space-x-2 transition-colors"
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

export default PronunciationLab;id: 1,
      word: 'Thermodynamics',
      phonetic: '/ˌθɜːrmoʊdaɪˈnæmɪks/',
      difficulty: 'advanced',
      category: 'Chemical Engineering',
      tips: 'Break it down: THER-mo-dy-NAM-ics',
      alternates: ['thermodynamic', 'thermo dynamics']
    },
    {
      id: 2,
      word: 'Catalyst',
      phonetic: '/ˈkætəlɪst/',
      difficulty: 'intermediate',
      category: 'Chemistry',
      tips: 'Stress on first syllable: CAT-a-list',
      alternates: ['catalysts']
    },
    {
      id: 3,
      word: 'Equilibrium',
      phonetic: '/ˌiːkwɪˈlɪbriəm/',
      difficulty: 'intermediate',
      category: 'Chemistry',
      tips: 'Four syllables: e-qui-LI-bri-um',
      alternates: ['equilibria']
    },
    {
      id: 4,
      word: 'Phenomenon',
      phonetic: '/fəˈnɒmɪnən/',
      difficulty: 'intermediate',
      category: 'General',
      tips: 'Stress on second syllable: fe-NOM-e-non',
      alternates: ['phenomena']
    },
    {
      id: 5,
      word: 'Viscosity',
      phonetic: '/vɪˈskɒsəti/',
      difficulty: 'beginner',
      category: 'Physics',
      tips: 'vis-COS-i-ty',
      alternates: []
    },
    {
      id: 6,
      word: 'Synthesis',
      phonetic: '/ˈsɪnθəsɪs/',
      difficulty: 'beginner',
      category: 'Chemistry',
      tips: 'SYN-the-sis',
      alternates: ['synthesize', 'synthesized']
    },
    {
      id: 7,
      word: 'Negligible',
      phonetic: '/ˈneɡlɪdʒəbl/',
      difficulty: 'intermediate',
      category: 'General',
      tips: 'NEG-li-gi-ble',
      alternates: []
    },
    {
      id: 8,
      word: 'Stoichiometry',
      phonetic: '/ˌstɔɪkiˈɒmɪtri/',
      difficulty: 'advanced',
      category: 'Chemistry',
      tips: 'stoy-key-OM-e-tree',
      alternates: ['stoichiometric']
    }
  ];

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.6; // Very slow for pronunciation practice
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        stream.getTracks().forEach(track => track.stop());
        
        if (audioBlob.size > 2000) {
          await analyzePronunciation(audioBlob);
        } else {
          alert('Recording too short. Please speak the word clearly.');
          setIsRecording(false);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Recording error:', error);
      alert('Could not access microphone. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzePronunciation = async (audioBlob) => {
    setIsAnalyzing(true);
    try {
      const transcription = await groqWhisperService.transcribeAudio(audioBlob);
      console.log('Transcribed:', transcription);
      
      const spokenWord = transcription.toLowerCase().trim();
      const targetWord = selectedWord.word.toLowerCase();
      const alternates = selectedWord.alternates || [];
      
      // Check if pronunciation matches
      const isCorrect = spokenWord.includes(targetWord) || 
                       alternates.some(alt => spokenWord.includes(alt.toLowerCase()));
      
      setAttempts(attempts + 1);
      
      if (isCorrect) {
        setScore(score + 1);
        setLastResult({
          correct: true,
          spoken: transcription,
          message: 'Great job! Perfect pronunciation!'
        });
      } else {
        setLastResult({
          correct: false,
          spoken: transcription,
          message: `Try again! You said "${transcription}" but the word is "${selectedWord.word}"`
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Could not analyze pronunciation. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePractice = (word) => {
    setSelectedWord(word);
    setLastResult(null);
    speakWord(word.word);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl animate-float">
            <Mic className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text-animated">Pronunciation Lab</h1>
            <p className="text-slate-400 mt-1">Practice with AI voice recognition</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Attempts</p>
              <p className="text-3xl font-bold">{attempts}</p>
            </div>
            <Mic className="w-10 h-10 text-purple-400 opacity-50" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Correct</p>
              <p className="text-3xl font-bold text-green-400">{score}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400 opacity-50" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Accuracy</p>
              <p className="text-3xl font-bold text-blue-400">
                {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
              </p>
            </div>
            <Award className="w-10 h-10 text-blue-400 opacity-50" />
          </div>
        </Card>
      </div>

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