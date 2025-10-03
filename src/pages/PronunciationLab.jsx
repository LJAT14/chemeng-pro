import React, { useState, useRef } from 'react';
import { Mic, Volume2, CheckCircle, XCircle, Award, Loader2 } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
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
      id: 1,
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
    },
    {
      id: 9,
      word: 'Pharmaceutical',
      phonetic: '/ˌfɑːrməˈsuːtɪkəl/',
      difficulty: 'advanced',
      category: 'Medicine',
      tips: 'far-ma-SOO-ti-cal',
      alternates: ['pharmaceuticals']
    },
    {
      id: 10,
      word: 'Algorithm',
      phonetic: '/ˈælɡərɪðəm/',
      difficulty: 'beginner',
      category: 'Computer Science',
      tips: 'AL-go-rith-m',
      alternates: ['algorithms', 'algorithmic']
    },
    {
      id: 11,
      word: 'Entrepreneur',
      phonetic: '/ˌɑːntrəprəˈnɜːr/',
      difficulty: 'intermediate',
      category: 'Business',
      tips: 'on-tre-pre-NUR',
      alternates: ['entrepreneurial']
    },
    {
      id: 12,
      word: 'Pronunciation',
      phonetic: '/prəˌnʌnsiˈeɪʃn/',
      difficulty: 'intermediate',
      category: 'General',
      tips: 'pro-nun-see-A-shun (not pro-NOWN-ciation)',
      alternates: []
    },
    {
      id: 13,
      word: 'Infrastructure',
      phonetic: '/ˈɪnfrəstrʌktʃər/',
      difficulty: 'intermediate',
      category: 'Engineering',
      tips: 'IN-fra-struc-ture',
      alternates: []
    },
    {
      id: 14,
      word: 'Photosynthesis',
      phonetic: '/ˌfoʊtoʊˈsɪnθəsɪs/',
      difficulty: 'intermediate',
      category: 'Biology',
      tips: 'fo-to-SIN-the-sis',
      alternates: []
    },
    {
      id: 15,
      word: 'Bureaucracy',
      phonetic: '/bjʊˈrɒkrəsi/',
      difficulty: 'advanced',
      category: 'Government',
      tips: 'byoo-ROK-ra-see',
      alternates: ['bureaucratic']
    },
    {
      id: 16,
      word: 'Specific',
      phonetic: '/spəˈsɪfɪk/',
      difficulty: 'beginner',
      category: 'General',
      tips: 'spe-SI-fik (not pa-SI-fik)',
      alternates: ['specifically']
    },
    {
      id: 17,
      word: 'Statistics',
      phonetic: '/stəˈtɪstɪks/',
      difficulty: 'beginner',
      category: 'Mathematics',
      tips: 'sta-TIS-tiks',
      alternates: ['statistical']
    },
    {
      id: 18,
      word: 'Prestigious',
      phonetic: '/preˈstɪdʒəs/',
      difficulty: 'intermediate',
      category: 'General',
      tips: 'pre-STI-jus',
      alternates: ['prestige']
    },
    {
      id: 19,
      word: 'Hierarchy',
      phonetic: '/ˈhaɪərɑːrki/',
      difficulty: 'intermediate',
      category: 'General',
      tips: 'HI-er-ar-key',
      alternates: ['hierarchical']
    },
    {
      id: 20,
      word: 'Exponential',
      phonetic: '/ˌekspəˈnenʃl/',
      difficulty: 'intermediate',
      category: 'Mathematics',
      tips: 'ex-po-NEN-shal',
      alternates: ['exponentially']
    },
    {
      id: 21,
      word: 'Homogeneous',
      phonetic: '/ˌhoʊməˈdʒiːniəs/',
      difficulty: 'advanced',
      category: 'Chemistry',
      tips: 'ho-mo-JEE-nee-us',
      alternates: ['homogeneity']
    },
    {
      id: 22,
      word: 'Deteriorate',
      phonetic: '/dɪˈtɪriəreɪt/',
      difficulty: 'intermediate',
      category: 'General',
      tips: 'de-TEER-ee-or-ate',
      alternates: ['deterioration']
    },
    {
      id: 23,
      word: 'Miscellaneous',
      phonetic: '/ˌmɪsəˈleɪniəs/',
      difficulty: 'advanced',
      category: 'General',
      tips: 'mis-el-LAY-nee-us',
      alternates: []
    },
    {
      id: 24,
      word: 'Temperature',
      phonetic: '/ˈtemprətʃər/',
      difficulty: 'beginner',
      category: 'Science',
      tips: 'TEM-per-a-ture (not tem-PER-a-ture)',
      alternates: ['temperatures']
    },
    {
      id: 25,
      word: 'Anonymous',
      phonetic: '/əˈnɒnɪməs/',
      difficulty: 'intermediate',
      category: 'General',
      tips: 'a-NON-i-mus',
      alternates: ['anonymity']
    }
  ];

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.6;
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

      const mimeType = 'audio/webm';
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
    } catch (error) {
      console.error('Recording error:', error);
      alert('Could not access microphone.');
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
      
      const spokenWord = transcription.toLowerCase().trim();
      const targetWord = selectedWord.word.toLowerCase();
      const alternates = selectedWord.alternates || [];
      
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
          message: `Try again! You said "${transcription}"`
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Could not analyze pronunciation.');
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
      <div className="flex items-center space-x-3">
        <Mic className="w-8 h-8 text-green-400" />
        <h1 className="text-4xl font-bold">Pronunciation Lab</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-slate-400">Attempts</p>
          <p className="text-3xl font-bold">{attempts}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Correct</p>
          <p className="text-3xl font-bold text-green-400">{score}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Accuracy</p>
          <p className="text-3xl font-bold text-blue-400">
            {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
          </p>
        </Card>
      </div>

      {selectedWord && (
        <Card>
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-2xl font-bold">Practice</h3>
              <button onClick={() => setSelectedWord(null)}>✕</button>
            </div>
            
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-bold text-purple-400">{selectedWord.word}</h2>
              <p className="text-2xl text-slate-400">{selectedWord.phonetic}</p>
              
              <div className="flex justify-center space-x-4">
                <Button onClick={() => speakWord(selectedWord.word)}>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Listen
                </Button>
                
                {!isRecording && !isAnalyzing && (
                  <Button onClick={startRecording}>
                    <Mic className="w-5 h-5 mr-2" />
                    Record
                  </Button>
                )}
                
                {isRecording && (
                  <Button onClick={stopRecording} className="bg-red-600">
                    <Mic className="w-5 h-5 mr-2" />
                    Stop
                  </Button>
                )}
                
                {isAnalyzing && (
                  <Button disabled>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing
                  </Button>
                )}
              </div>

              <div className="bg-slate-800 rounded-lg p-4 text-left">
                <p className="text-sm text-slate-400">Tip:</p>
                <p className="text-slate-200">{selectedWord.tips}</p>
              </div>

              {lastResult && (
                <div className={`p-4 rounded-lg ${
                  lastResult.correct ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                  <div className="flex items-center space-x-2">
                    {lastResult.correct ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    <p className="font-bold">{lastResult.message}</p>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    You said: {lastResult.spoken}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pronunciationWords.map((word) => (
          <Card key={word.id} hover>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-bold">{word.word}</h3>
                  <p className="text-sm text-slate-500">{word.phonetic}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-slate-800 rounded">
                  {word.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400">{word.category}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => speakWord(word.word)}
                  className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg"
                >
                  Listen
                </button>
                <button
                  onClick={() => handlePractice(word)}
                  className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg"
                >
                  Practice
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