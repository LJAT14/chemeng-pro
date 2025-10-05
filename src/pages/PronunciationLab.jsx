// src/pages/PronunciationLab.jsx
import React, { useState, useRef } from 'react';
import { Mic, Volume2, CheckCircle, XCircle, Play, Pause, Gauge } from 'lucide-react';
import Card from '../components/shared/Card';
import { transcribeAudio } from '../services/groqWhisperService';

const pronunciationWords = [
  // Beginner (10)
  { id: 1, word: 'Thermodynamics', phonetic: '/ˌθɜːrmoʊdaɪˈnæmɪks/', difficulty: 'beginner', category: 'Chemistry' },
  { id: 2, word: 'Catalyst', phonetic: '/ˈkætəlɪst/', difficulty: 'beginner', category: 'Chemistry' },
  { id: 3, word: 'Oxidation', phonetic: '/ˌɑːksɪˈdeɪʃən/', difficulty: 'beginner', category: 'Chemistry' },
  { id: 4, word: 'Equilibrium', phonetic: '/ˌiːkwɪˈlɪbriəm/', difficulty: 'beginner', category: 'Chemistry' },
  { id: 5, word: 'Viscosity', phonetic: '/vɪˈskɑːsəti/', difficulty: 'beginner', category: 'Physics' },
  { id: 6, word: 'Distillation', phonetic: '/ˌdɪstɪˈleɪʃən/', difficulty: 'beginner', category: 'Engineering' },
  { id: 7, word: 'Molecule', phonetic: '/ˈmɑːlɪkjuːl/', difficulty: 'beginner', category: 'Chemistry' },
  { id: 8, word: 'Polymer', phonetic: '/ˈpɑːlɪmər/', difficulty: 'beginner', category: 'Chemistry' },
  { id: 9, word: 'Pressure', phonetic: '/ˈpreʃər/', difficulty: 'beginner', category: 'Physics' },
  { id: 10, word: 'Temperature', phonetic: '/ˈtemprətʃər/', difficulty: 'beginner', category: 'Physics' },

  // Intermediate (20)
  { id: 11, word: 'Stoichiometry', phonetic: '/ˌstɔɪkiˈɑːmətri/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 12, word: 'Chromatography', phonetic: '/ˌkroʊməˈtɑːɡrəfi/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 13, word: 'Crystallization', phonetic: '/ˌkrɪstəlaɪˈzeɪʃən/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 14, word: 'Exothermic', phonetic: '/ˌeksəˈθɜːrmɪk/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 15, word: 'Hydrocarbon', phonetic: '/ˌhaɪdrəˈkɑːrbən/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 16, word: 'Isomerization', phonetic: '/aɪˌsɑːmərəˈzeɪʃən/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 17, word: 'Neutralization', phonetic: '/ˌnuːtrələˈzeɪʃən/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 18, word: 'Electrochemistry', phonetic: '/ɪˌlektroʊˈkemɪstri/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 19, word: 'Precipitation', phonetic: '/prɪˌsɪpɪˈteɪʃən/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 20, word: 'Semiconductor', phonetic: '/ˌsemikənˈdʌktər/', difficulty: 'intermediate', category: 'Technology' },
  { id: 21, word: 'Fluorescence', phonetic: '/flʊˈresəns/', difficulty: 'intermediate', category: 'Physics' },
  { id: 22, word: 'Spectroscopy', phonetic: '/spekˈtrɑːskəpi/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 23, word: 'Titration', phonetic: '/taɪˈtreɪʃən/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 24, word: 'Volatile', phonetic: '/ˈvɑːlətl/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 25, word: 'Coefficient', phonetic: '/ˌkoʊɪˈfɪʃənt/', difficulty: 'intermediate', category: 'Math' },
  { id: 26, word: 'Diffusion', phonetic: '/dɪˈfjuːʒən/', difficulty: 'intermediate', category: 'Physics' },
  { id: 27, word: 'Entropy', phonetic: '/ˈentrəpi/', difficulty: 'intermediate', category: 'Physics' },
  { id: 28, word: 'Heterogeneous', phonetic: '/ˌhetərəˈdʒiːniəs/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 29, word: 'Homogeneous', phonetic: '/ˌhoʊməˈdʒiːniəs/', difficulty: 'intermediate', category: 'Chemistry' },
  { id: 30, word: 'Polymerization', phonetic: '/pəˌlɪmərəˈzeɪʃən/', difficulty: 'intermediate', category: 'Chemistry' },

  // Advanced (20)
  { id: 31, word: 'Endothermic', phonetic: '/ˌendoʊˈθɜːrmɪk/', difficulty: 'advanced', category: 'Chemistry' },
  { id: 32, word: 'Photosynthesis', phonetic: '/ˌfoʊtoʊˈsɪnθəsɪs/', difficulty: 'advanced', category: 'Biology' },
  { id: 33, word: 'Biosynthesis', phonetic: '/ˌbaɪoʊˈsɪnθəsɪs/', difficulty: 'advanced', category: 'Biology' },
  { id: 34, word: 'Nanotechnology', phonetic: '/ˌnænoʊtekˈnɑːlədʒi/', difficulty: 'advanced', category: 'Technology' },
  { id: 35, word: 'Thermochemistry', phonetic: '/ˌθɜːrmoʊˈkemɪstri/', difficulty: 'advanced', category: 'Chemistry' },
  { id: 36, word: 'Pharmaceutical', phonetic: '/ˌfɑːrməˈsuːtɪkəl/', difficulty: 'advanced', category: 'Medicine' },
  { id: 37, word: 'Biochemistry', phonetic: '/ˌbaɪoʊˈkemɪstri/', difficulty: 'advanced', category: 'Chemistry' },
  { id: 38, word: 'Stoichiometric', phonetic: '/ˌstɔɪkiəˈmetrɪk/', difficulty: 'advanced', category: 'Chemistry' },
  { id: 39, word: 'Chromatographic', phonetic: '/ˌkroʊmətəˈɡræfɪk/', difficulty: 'advanced', category: 'Chemistry' },
  { id: 40, word: 'Electrochemical', phonetic: '/ɪˌlektroʊˈkemɪkəl/', difficulty: 'advanced', category: 'Chemistry' },
  { id: 41, word: 'Bioavailability', phonetic: '/ˌbaɪoʊəˌveɪləˈbɪləti/', difficulty: 'advanced', category: 'Biology' },
  { id: 42, word: 'Thermogravimetric', phonetic: '/ˌθɜːrmoʊˌɡrævɪˈmetrɪk/', difficulty: 'advanced', category: 'Chemistry' },
  { id: 43, word: 'Spectrophotometry', phonetic: '/ˌspektrəfoʊˈtɑːmətri/', difficulty: 'advanced', category: 'Chemistry' },
  { id: 44, word: 'Anisotropy', phonetic: '/ˌænɪˈsɑːtrəpi/', difficulty: 'advanced', category: 'Physics' },
  { id: 45, word: 'Oligomerization', phonetic: '/ˌɑːlɪɡəmərəˈzeɪʃən/', difficulty: 'advanced', category: 'Chemistry' },
  { id: 46, word: 'Metallurgy', phonetic: '/ˈmetələrdʒi/', difficulty: 'advanced', category: 'Engineering' },
  { id: 47, word: 'Rheology', phonetic: '/riˈɑːlədʒi/', difficulty: 'advanced', category: 'Physics' },
  { id: 48, word: 'Calorimetry', phonetic: '/ˌkæləˈrɪmətri/', difficulty: 'advanced', category: 'Chemistry' },
  { id: 49, word: 'Copolymerization', phonetic: '/koʊpəˌlɪmərəˈzeɪʃən/', difficulty: 'advanced', category: 'Chemistry' },
  { id: 50, word: 'Supercritical', phonetic: '/ˌsuːpərˈkrɪtɪkəl/', difficulty: 'advanced', category: 'Physics' },
];

const PronunciationLab = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [userTranscript, setUserTranscript] = useState('');
  const [accuracy, setAccuracy] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.75);
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const utteranceRef = useRef(null);

  const filteredWords = filterDifficulty === 'all' 
    ? pronunciationWords 
    : pronunciationWords.filter(w => w.difficulty === filterDifficulty);

  const playPronunciation = () => {
    if (!selectedWord) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(selectedWord.word);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en-US')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      alert('Speech synthesis failed. Please check browser settings.');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
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
        
        if (audioBlob.size > 0) {
          try {
            const transcript = await transcribeAudio(audioBlob);
            setUserTranscript(transcript);
            calculateAccuracy(transcript);
          } catch (error) {
            console.error('Transcription error:', error);
            alert('Could not transcribe audio. Please try again.');
          }
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      recordingStartTimeRef.current = Date.now();
      setRecordingDuration(0);
      
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
        setRecordingDuration(elapsed);
      }, 100);

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone error:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      clearInterval(durationIntervalRef.current);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const calculateAccuracy = (transcript) => {
    const target = selectedWord.word.toLowerCase().trim();
    const spoken = transcript.toLowerCase().trim();
    
    const distance = levenshteinDistance(target, spoken);
    const maxLen = Math.max(target.length, spoken.length);
    const accuracyScore = Math.max(0, ((maxLen - distance) / maxLen) * 100);
    
    setAccuracy(Math.round(accuracyScore));
    
    if (accuracyScore >= 70) {
      setStats(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setStats(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const levenshteinDistance = (a, b) => {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    
    return matrix[b.length][a.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Pronunciation Lab</h1>
          <p className="text-gray-300">Practice chemical engineering terminology with voice recognition</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-gray-300 text-sm">Words Practiced</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-gray-300 text-sm">Correct</div>
            <div className="text-3xl font-bold text-green-400">{stats.correct}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-gray-300 text-sm">Accuracy</div>
            <div className="text-3xl font-bold text-purple-400">
              {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-3 flex-wrap">
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterDifficulty(level)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filterDifficulty === level
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {/* Instruction Banner */}
        {!selectedWord && (
          <div className="mb-6 bg-blue-500/20 border border-blue-500 rounded-xl p-4 text-center">
            <p className="text-blue-200">Click on any word card below to start practicing</p>
          </div>
        )}

        {/* Selected Word Practice Area */}
        {selectedWord && (
          <div className="mb-6 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-5xl font-bold text-white mb-2">{selectedWord.word}</h2>
              <p className="text-2xl text-purple-300 mb-1">{selectedWord.phonetic}</p>
              <p className="text-gray-400">{selectedWord.category} • {selectedWord.difficulty}</p>
            </div>

            {/* Playback Speed Control */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Gauge className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300 text-sm">Speed:</span>
              {[0.5, 0.75, 1.0].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    playbackSpeed === speed
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {speed === 0.5 ? 'Very Slow' : speed === 0.75 ? 'Slow' : 'Normal'}
                </button>
              ))}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 justify-center mb-6">
              <button
                onClick={playPronunciation}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl transition-all"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                {isPlaying ? 'Stop' : 'Listen'}
              </button>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl transition-all ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Mic className="w-6 h-6" />
                {isRecording ? `Recording... ${recordingDuration}s` : 'Record'}
              </button>
            </div>

            {/* Results */}
            {userTranscript && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-lg">Your Pronunciation:</h3>
                  {accuracy !== null && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      accuracy >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {accuracy >= 70 ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className={accuracy >= 70 ? 'text-green-400' : 'text-red-400'}>
                        {accuracy}% accurate
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-2xl text-white mb-2">{userTranscript}</p>
                {accuracy < 70 && (
                  <p className="text-yellow-400 text-sm">Try again! Listen carefully and repeat slowly.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Word Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredWords.map((word) => (
            <Card
              key={word.id}
              onClick={() => setSelectedWord(word)}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedWord?.id === word.id ? 'ring-4 ring-purple-500' : ''
              }`}
            >
              <div className="p-4 text-center">
                <p className="text-xl font-bold text-white mb-1">{word.word}</p>
                <p className="text-sm text-purple-300">{word.phonetic}</p>
                <p className="text-xs text-gray-400 mt-2">{word.category}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PronunciationLab;