// src/pages/PronunciationLab.jsx
import React, { useState, useRef } from 'react';
import { Mic, Volume2, CheckCircle, XCircle, Play, Pause, Gauge, Award } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useToast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { transcribeAudio } from '../services/groqWhisperService';
import { speakText } from '../services/elevenLabsTTS';

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
  const toast = useToast();
  const [selectedWord, setSelectedWord] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [userTranscript, setUserTranscript] = useState('');
  const [accuracy, setAccuracy] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.75);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const durationIntervalRef = useRef(null);

  const filteredWords = filterDifficulty === 'all' 
    ? pronunciationWords 
    : pronunciationWords.filter(w => w.difficulty === filterDifficulty);

  const playPronunciation = async () => {
    if (!selectedWord) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsLoadingAudio(true);
    setIsPlaying(true);

    try {
      // Try ElevenLabs first
      await speakText(selectedWord.word, playbackSpeed);
      toast.success('Playing pronunciation');
    } catch (error) {
      console.error('ElevenLabs failed, using browser TTS:', error);
      
      // Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(selectedWord.word);
      utterance.rate = playbackSpeed;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en-US')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        toast.error('Audio playback failed');
      };

      window.speechSynthesis.speak(utterance);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

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
        
        if (audioBlob.size > 0 && recordingDuration >= 1) {
          setIsProcessing(true);
          try {
            const transcript = await transcribeAudio(audioBlob);
            setUserTranscript(transcript);
            calculateAccuracy(transcript);
            toast.success('Pronunciation analyzed!');
          } catch (error) {
            console.error('Transcription error:', error);
            toast.error('Could not analyze pronunciation. Please try again.');
          } finally {
            setIsProcessing(false);
          }
        } else {
          toast.warning('Recording too short. Please speak for at least 1 second.');
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
      toast.info('Recording started - speak clearly');
    } catch (error) {
      console.error('Microphone error:', error);
      toast.error('Could not access microphone. Please check permissions.');
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
    
    // Levenshtein distance algorithm
    const distance = levenshteinDistance(target, spoken);
    const maxLen = Math.max(target.length, spoken.length);
    const accuracyScore = Math.max(0, ((maxLen - distance) / maxLen) * 100);
    
    setAccuracy(Math.round(accuracyScore));
    
    if (accuracyScore >= 70) {
      setStats(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      toast.success(`Great job! ${Math.round(accuracyScore)}% accurate`);
    } else {
      setStats(prev => ({ ...prev, total: prev.total + 1 }));
      toast.warning(`${Math.round(accuracyScore)}% - Try again!`);
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
    <PageWrapper title="Pronunciation Lab" subtitle="Master technical terminology with AI-powered voice recognition">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="text-gray-300 text-sm mb-1">Words Practiced</div>
            <div className="text-3xl sm:text-4xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="text-gray-300 text-sm mb-1">Correct</div>
            <div className="text-3xl sm:text-4xl font-bold text-green-400">{stats.correct}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="text-gray-300 text-sm mb-1">Accuracy</div>
            <div className="text-3xl sm:text-4xl font-bold text-purple-400">
              {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-3 flex-wrap">
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterDifficulty(level)}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all ${
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
          <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4 text-center">
            <p className="text-blue-200">Click on any word card below to start practicing with AI pronunciation feedback</p>
          </div>
        )}

        {/* Selected Word Practice Area */}
        {selectedWord && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2">{selectedWord.word}</h2>
              <p className="text-xl sm:text-2xl text-purple-300 mb-1">{selectedWord.phonetic}</p>
              <p className="text-gray-400">{selectedWord.category} • {selectedWord.difficulty}</p>
            </div>

            {/* Playback Speed Control */}
            <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
              <Gauge className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300 text-sm">Pronunciation Speed:</span>
              {[
                { value: 0.5, label: 'Very Slow' },
                { value: 0.75, label: 'Slow' },
                { value: 1.0, label: 'Normal' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setPlaybackSpeed(value)}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-sm ${
                    playbackSpeed === value
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3 sm:gap-4 justify-center mb-6 flex-wrap">
              <button
                onClick={playPronunciation}
                disabled={isLoadingAudio}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-700 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all"
              >
                {isLoadingAudio ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : isPlaying ? (
                  <Pause className="w-5 sm:w-6 h-5 sm:h-6" />
                ) : (
                  <Play className="w-5 sm:w-6 h-5 sm:h-6" />
                )}
                <span className="text-sm sm:text-base">{isPlaying ? 'Stop' : 'Hear Pronunciation'}</span>
              </button>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-700 disabled:cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <Mic className="w-5 sm:w-6 h-5 sm:h-6" />
                )}
                <span className="text-sm sm:text-base">
                  {isProcessing ? 'Analyzing...' : isRecording ? `Recording... ${recordingDuration}s` : 'Record Your Voice'}
                </span>
              </button>
            </div>

            {/* Results */}
            {userTranscript && (
              <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h3 className="text-white font-semibold text-base sm:text-lg">Your Pronunciation:</h3>
                  {accuracy !== null && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      accuracy >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {accuracy >= 70 ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className={`text-sm sm:text-base ${accuracy >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                        {accuracy}% accurate
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xl sm:text-2xl text-white mb-2">{userTranscript}</p>
                {accuracy < 70 && (
                  <p className="text-yellow-400 text-sm">Listen to the correct pronunciation again and practice slowly!</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Word Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredWords.map((word) => (
            <button
              key={word.id}
              onClick={() => {
                setSelectedWord(word);
                setUserTranscript('');
                setAccuracy(null);
              }}
              className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-purple-500 transition-all text-left ${
                selectedWord?.id === word.id ? 'ring-4 ring-purple-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg sm:text-xl font-bold text-white">{word.word}</p>
                <Volume2 className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-xs sm:text-sm text-purple-300 mb-2">{word.phonetic}</p>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  word.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                  word.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {word.difficulty}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                  {word.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default PronunciationLab;