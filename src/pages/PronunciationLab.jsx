// src/pages/PronunciationLab.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, CheckCircle, XCircle, Play, Pause, Gauge, Award, X } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useToast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { speakText } from '../services/elevenLabsTTS';
import { transcribeAudio } from '../services/groqWhisper';
import TutorialSystem from '../components/TutorialSystem';

const pronunciationWords = [
  // Beginner (20 words)
  { id: 1, word: 'Hello', difficulty: 'beginner', phonetic: '/həˈloʊ/' },
  { id: 2, word: 'Water', difficulty: 'beginner', phonetic: '/ˈwɔːtər/' },
  { id: 3, word: 'Please', difficulty: 'beginner', phonetic: '/pliːz/' },
  { id: 4, word: 'Thank you', difficulty: 'beginner', phonetic: '/θæŋk juː/' },
  { id: 5, word: 'Goodbye', difficulty: 'beginner', phonetic: '/ɡʊdˈbaɪ/' },
  { id: 6, word: 'Yes', difficulty: 'beginner', phonetic: '/jes/' },
  { id: 7, word: 'No', difficulty: 'beginner', phonetic: '/noʊ/' },
  { id: 8, word: 'Help', difficulty: 'beginner', phonetic: '/help/' },
  { id: 9, word: 'Food', difficulty: 'beginner', phonetic: '/fuːd/' },
  { id: 10, word: 'House', difficulty: 'beginner', phonetic: '/haʊs/' },
  { id: 11, word: 'Friend', difficulty: 'beginner', phonetic: '/frend/' },
  { id: 12, word: 'Book', difficulty: 'beginner', phonetic: '/bʊk/' },
  { id: 13, word: 'School', difficulty: 'beginner', phonetic: '/skuːl/' },
  { id: 14, word: 'Work', difficulty: 'beginner', phonetic: '/wɜːrk/' },
  { id: 15, word: 'Family', difficulty: 'beginner', phonetic: '/ˈfæməli/' },
  { id: 16, word: 'Happy', difficulty: 'beginner', phonetic: '/ˈhæpi/' },
  { id: 17, word: 'Time', difficulty: 'beginner', phonetic: '/taɪm/' },
  { id: 18, word: 'Good', difficulty: 'beginner', phonetic: '/ɡʊd/' },
  { id: 19, word: 'Day', difficulty: 'beginner', phonetic: '/deɪ/' },
  { id: 20, word: 'Night', difficulty: 'beginner', phonetic: '/naɪt/' },
  
  // Intermediate (20 words)
  { id: 21, word: 'Beautiful', difficulty: 'intermediate', phonetic: '/ˈbjuːtɪfəl/' },
  { id: 22, word: 'Important', difficulty: 'intermediate', phonetic: '/ɪmˈpɔːrtənt/' },
  { id: 23, word: 'Understand', difficulty: 'intermediate', phonetic: '/ˌʌndərˈstænd/' },
  { id: 24, word: 'Different', difficulty: 'intermediate', phonetic: '/ˈdɪfrənt/' },
  { id: 25, word: 'Together', difficulty: 'intermediate', phonetic: '/təˈɡeðər/' },
  { id: 26, word: 'Business', difficulty: 'intermediate', phonetic: '/ˈbɪznəs/' },
  { id: 27, word: 'Development', difficulty: 'intermediate', phonetic: '/dɪˈveləpmənt/' },
  { id: 28, word: 'Environment', difficulty: 'intermediate', phonetic: '/ɪnˈvaɪrənmənt/' },
  { id: 29, word: 'Temperature', difficulty: 'intermediate', phonetic: '/ˈtemprətʃər/' },
  { id: 30, word: 'Comfortable', difficulty: 'intermediate', phonetic: '/ˈkʌmftəbəl/' },
  { id: 31, word: 'Restaurant', difficulty: 'intermediate', phonetic: '/ˈrestrɑːnt/' },
  { id: 32, word: 'Vegetable', difficulty: 'intermediate', phonetic: '/ˈvedʒtəbəl/' },
  { id: 33, word: 'Chocolate', difficulty: 'intermediate', phonetic: '/ˈtʃɔːklət/' },
  { id: 34, word: 'Interesting', difficulty: 'intermediate', phonetic: '/ˈɪntrəstɪŋ/' },
  { id: 35, word: 'Necessary', difficulty: 'intermediate', phonetic: '/ˈnesəseri/' },
  { id: 36, word: 'Government', difficulty: 'intermediate', phonetic: '/ˈɡʌvərnmənt/' },
  { id: 37, word: 'Technology', difficulty: 'intermediate', phonetic: '/tekˈnɑːlədʒi/' },
  { id: 38, word: 'Education', difficulty: 'intermediate', phonetic: '/ˌedʒuˈkeɪʃən/' },
  { id: 39, word: 'Information', difficulty: 'intermediate', phonetic: '/ˌɪnfərˈmeɪʃən/' },
  { id: 40, word: 'Communication', difficulty: 'intermediate', phonetic: '/kəˌmjuːnɪˈkeɪʃən/' },
  
  // Advanced (10 words)
  { id: 41, word: 'Pronunciation', difficulty: 'advanced', phonetic: '/prəˌnʌnsiˈeɪʃən/' },
  { id: 42, word: 'Entrepreneurship', difficulty: 'advanced', phonetic: '/ˌɑːntrəprəˈnɜːrʃɪp/' },
  { id: 43, word: 'Conscientious', difficulty: 'advanced', phonetic: '/ˌkɑːnʃiˈenʃəs/' },
  { id: 44, word: 'Phenomenon', difficulty: 'advanced', phonetic: '/fəˈnɑːmɪnɑːn/' },
  { id: 45, word: 'Peculiar', difficulty: 'advanced', phonetic: '/pɪˈkjuːliər/' },
  { id: 46, word: 'Sophisticated', difficulty: 'advanced', phonetic: '/səˈfɪstɪkeɪtɪd/' },
  { id: 47, word: 'Anonymity', difficulty: 'advanced', phonetic: '/ˌænəˈnɪməti/' },
  { id: 48, word: 'Worcestershire', difficulty: 'advanced', phonetic: '/ˈwʊstərʃər/' },
  { id: 49, word: 'Colonel', difficulty: 'advanced', phonetic: '/ˈkɜːrnəl/' },
  { id: 50, word: 'Hyperbole', difficulty: 'advanced', phonetic: '/haɪˈpɜːrbəli/' },
];

const tutorialSteps = [
  {
    title: 'Welcome to Pronunciation Lab!',
    description: 'Learn to speak English words correctly with AI-powered voice recognition. Practice at your own pace with adjustable speed controls.',
    tips: [
      'Start with beginner words if you\'re new',
      'Use headphones for best audio quality',
      'Find a quiet place to practice',
    ],
  },
  {
    title: 'How to Practice',
    description: 'Click a word to select it, choose your speed, then click "Hear Pronunciation" to listen. When ready, click "Record Your Voice" to practice speaking.',
    tips: [
      'Very Slow mode is great for beginners',
      'Listen multiple times before recording',
      'Speak clearly into your microphone',
    ],
  },
  {
    title: 'Get Instant Feedback',
    description: 'Our AI will analyze your pronunciation and give you a score. Aim for 70% or higher for good pronunciation!',
    tips: [
      'Green checkmark means great job (70%+)',
      'Red X means try again',
      'Practice the same word until you get it right',
    ],
  },
];

const PronunciationLab = () => {
  const toast = useToast();
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [speed, setSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [stats, setStats] = useState({
    totalPracticed: 0,
    correctCount: 0,
    accuracy: 0,
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Stop audio when component unmounts or word changes
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Stop audio when word selection changes
  useEffect(() => {
    if (selectedWord) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [selectedWord]);

  const filteredWords = pronunciationWords.filter(w => 
    selectedDifficulty === 'all' || w.difficulty === selectedDifficulty
  );

  const playPronunciation = async () => {
    if (!selectedWord) {
      toast.warning('Please select a word first');
      return;
    }

    // Stop any currently playing audio
    window.speechSynthesis.cancel();

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setLoading(true);
    setIsPlaying(true);

    try {
      await speakText(selectedWord.word, speed);
      setIsPlaying(false);
    } catch (error) {
      console.error('Audio playback error:', error);
      toast.error('Failed to play audio');
      setIsPlaying(false);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    if (!selectedWord) {
      toast.warning('Please select a word first');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await analyzeRecording(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording... Click again to stop');
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const analyzeRecording = async (audioBlob) => {
    if (!selectedWord) return;

    setLoading(true);

    try {
      const transcription = await transcribeAudio(audioBlob);
      const userSaid = transcription.toLowerCase().trim();
      const targetWord = selectedWord.word.toLowerCase().trim();

      // Calculate similarity using Levenshtein distance
      const similarity = calculateSimilarity(userSaid, targetWord);
      const accuracyPercent = Math.round(similarity * 100);

      const isCorrect = accuracyPercent >= 70;

      setResults({
        ...results,
        [selectedWord.id]: {
          userSaid,
          accuracy: accuracyPercent,
          correct: isCorrect,
        },
      });

      setStats(prev => ({
        totalPracticed: prev.totalPracticed + 1,
        correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
        accuracy: Math.round(((isCorrect ? prev.correctCount + 1 : prev.correctCount) / (prev.totalPracticed + 1)) * 100),
      }));

      if (isCorrect) {
        toast.success(`Great job! ${accuracyPercent}% accuracy`);
      } else {
        toast.info(`${accuracyPercent}% accuracy. Try again!`);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze pronunciation');
    } finally {
      setLoading(false);
    }
  };

  const calculateSimilarity = (s1, s2) => {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1, str2) => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  const clearSelection = () => {
    window.speechSynthesis.cancel();
    setSelectedWord(null);
    setIsPlaying(false);
    setIsRecording(false);
  };

  return (
    <PageWrapper title="Pronunciation Lab" subtitle="Master English pronunciation with AI-powered voice recognition">
      <TutorialSystem 
        steps={tutorialSteps}
        storageKey="pronunciation-tutorial-completed"
      />

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-gray-400 text-sm">Words Practiced</div>
            <div className="text-3xl font-bold text-white">{stats.totalPracticed}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-gray-400 text-sm">Correct</div>
            <div className="text-3xl font-bold text-green-400">{stats.correctCount}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-gray-400 text-sm">Accuracy</div>
            <div className="text-3xl font-bold text-purple-400">{stats.accuracy}%</div>
          </div>
        </div>

        {/* Selected Word Panel */}
        {selectedWord && (
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-4xl font-bold text-white">{selectedWord.word}</h3>
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    selectedWord.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    selectedWord.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedWord.difficulty}
                  </span>
                </div>
                <p className="text-gray-300 text-lg">{selectedWord.phonetic}</p>
              </div>
              <button
                onClick={clearSelection}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Speed Controls */}
            <div className="flex items-center gap-4 mb-4">
              <Gauge className="w-5 h-5 text-purple-400" />
              <div className="flex gap-2">
                <button
                  onClick={() => setSpeed(0.5)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    speed === 0.5 ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Very Slow
                </button>
                <button
                  onClick={() => setSpeed(0.75)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    speed === 0.75 ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Slow
                </button>
                <button
                  onClick={() => setSpeed(1.0)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    speed === 1.0 ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Normal
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={playPronunciation}
                disabled={loading}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                {loading && !isRecording ? (
                  <LoadingSpinner size="sm" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                {isPlaying ? 'Stop' : 'Hear Pronunciation'}
              </button>

              <button
                onClick={toggleRecording}
                disabled={loading && !isRecording}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {loading && isRecording ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
                )}
                {isRecording ? 'Stop Recording' : 'Record Your Voice'}
              </button>
            </div>

            {/* Result */}
            {results[selectedWord.id] && (
              <div className={`mt-4 p-4 rounded-lg ${
                results[selectedWord.id].correct ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {results[selectedWord.id].correct ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={results[selectedWord.id].correct ? 'text-green-400' : 'text-red-400'}>
                    {results[selectedWord.id].accuracy}% Accuracy
                  </span>
                </div>
                <p className="text-white text-sm">
                  You said: "{results[selectedWord.id].userSaid}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Difficulty Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'beginner', 'intermediate', 'advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedDifficulty === diff
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>

        {/* Word Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredWords.map((word) => (
            <button
              key={word.id}
              onClick={() => setSelectedWord(word)}
              className={`p-4 rounded-xl transition-all ${
                selectedWord?.id === word.id
                  ? 'bg-purple-600 ring-2 ring-purple-400'
                  : 'bg-white/10 hover:bg-white/20'
              } ${
                results[word.id]?.correct
                  ? 'ring-2 ring-green-400'
                  : results[word.id]
                  ? 'ring-2 ring-red-400'
                  : ''
              }`}
            >
              <div className="text-white font-semibold text-lg">{word.word}</div>
              <div className="text-gray-400 text-xs mt-1">{word.phonetic}</div>
              {results[word.id] && (
                <div className="mt-2">
                  {results[word.id].correct ? (
                    <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>

        {filteredWords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No words found in this category</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default PronunciationLab;