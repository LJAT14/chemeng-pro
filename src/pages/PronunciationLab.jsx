import React, { useState, useRef } from 'react';
import { Mic, Volume2, CheckCircle, XCircle, TrendingUp, Award } from 'lucide-react';
import Card from '../components/shared/Card';
import { transcribeAudio } from '../services/groqWhisperService';

// Expanded pronunciation words with phonetics
const pronunciationWords = [
  // Beginner (5)
  { 
    id: 1, 
    word: 'Thermodynamics', 
    phonetic: '/ˌθɜːrmoʊdaɪˈnæmɪks/', 
    difficulty: 'beginner',
    category: 'Chemistry',
    tip: 'Break it down: THER-mo-dy-NAM-ics. Stress on "nam".',
    acceptableVariations: ['thermodynamics', 'thermo dynamics']
  },
  { 
    id: 2, 
    word: 'Catalyst', 
    phonetic: '/ˈkætəlɪst/', 
    difficulty: 'beginner',
    category: 'Chemistry',
    tip: 'CAT-a-list. Stress on first syllable.',
    acceptableVariations: ['catalyst', 'cata list']
  },
  { 
    id: 3, 
    word: 'Molecule', 
    phonetic: '/ˈmɒlɪkjuːl/', 
    difficulty: 'beginner',
    category: 'Chemistry',
    tip: 'MOL-eh-kyool. Three syllables.',
    acceptableVariations: ['molecule', 'molly cule']
  },
  { 
    id: 4, 
    word: 'Algorithm', 
    phonetic: '/ˈælɡərɪðəm/', 
    difficulty: 'beginner',
    category: 'Technology',
    tip: 'AL-go-rith-um. Stress on first syllable.',
    acceptableVariations: ['algorithm', 'algo rhythm']
  },
  { 
    id: 5, 
    word: 'Efficiency', 
    phonetic: '/ɪˈfɪʃənsi/', 
    difficulty: 'beginner',
    category: 'Engineering',
    tip: 'ef-FISH-en-see. Stress on second syllable.',
    acceptableVariations: ['efficiency', 'a fish in sea']
  },

  // Intermediate (10)
  { 
    id: 6, 
    word: 'Stoichiometry', 
    phonetic: '/ˌstɔɪkiˈɒmətri/', 
    difficulty: 'intermediate',
    category: 'Chemistry',
    tip: 'stoy-key-OM-eh-tree. Watch the "ch" sound.',
    acceptableVariations: ['stoichiometry', 'stoichio metry']
  },
  { 
    id: 7, 
    word: 'Heterogeneous', 
    phonetic: '/ˌhetərəˈdʒiːniəs/', 
    difficulty: 'intermediate',
    category: 'Chemistry',
    tip: 'het-er-oh-JEE-nee-us. Five syllables.',
    acceptableVariations: ['heterogeneous', 'hetero genius']
  },
  { 
    id: 8, 
    word: 'Precipitation', 
    phonetic: '/prɪˌsɪpɪˈteɪʃən/', 
    difficulty: 'intermediate',
    category: 'Chemistry',
    tip: 'pre-sip-ih-TAY-shun. Stress on fourth syllable.',
    acceptableVariations: ['precipitation', 'precipi tation']
  },
  { 
    id: 9, 
    word: 'Viscosity', 
    phonetic: '/vɪsˈkɒsəti/', 
    difficulty: 'intermediate',
    category: 'Engineering',
    tip: 'vis-KOS-ih-tee. Stress on second syllable.',
    acceptableVariations: ['viscosity', 'vis cosity']
  },
  { 
    id: 10, 
    word: 'Equilibrium', 
    phonetic: '/ˌiːkwɪˈlɪbriəm/', 
    difficulty: 'intermediate',
    category: 'Chemistry',
    tip: 'ee-kwi-LIB-ree-um. Stress on third syllable.',
    acceptableVariations: ['equilibrium', 'equilibri um']
  },
  { 
    id: 11, 
    word: 'Pharmaceutical', 
    phonetic: '/ˌfɑːrməˈsuːtɪkəl/', 
    difficulty: 'intermediate',
    category: 'Medicine',
    tip: 'far-ma-SOO-tih-kul. Watch the "ceu" sound.',
    acceptableVariations: ['pharmaceutical', 'pharma suit tical']
  },
  { 
    id: 12, 
    word: 'Chromatography', 
    phonetic: '/ˌkroʊməˈtɒɡrəfi/', 
    difficulty: 'intermediate',
    category: 'Chemistry',
    tip: 'kro-ma-TOG-ra-fee. Silent "h" at start.',
    acceptableVariations: ['chromatography', 'chroma tography']
  },
  { 
    id: 13, 
    word: 'Polymerization', 
    phonetic: '/pəˌlɪmərəˈzeɪʃən/', 
    difficulty: 'intermediate',
    category: 'Chemistry',
    tip: 'puh-lim-er-ih-ZAY-shun. Six syllables.',
    acceptableVariations: ['polymerization', 'polymer ization']
  },
  { 
    id: 14, 
    word: 'Sustainability', 
    phonetic: '/səˌsteɪnəˈbɪləti/', 
    difficulty: 'intermediate',
    category: 'Engineering',
    tip: 'sus-tay-na-BIL-ih-tee. Stress on fourth syllable.',
    acceptableVariations: ['sustainability', 'sustain ability']
  },
  { 
    id: 15, 
    word: 'Spectroscopy', 
    phonetic: '/spekˈtrɒskəpi/', 
    difficulty: 'intermediate',
    category: 'Chemistry',
    tip: 'spek-TROS-ko-pee. Stress on second syllable.',
    acceptableVariations: ['spectroscopy', 'spectro scopy']
  },

  // Advanced (10)
  { 
    id: 16, 
    word: 'Endothermic', 
    phonetic: '/ˌendoʊˈθɜːrmɪk/', 
    difficulty: 'advanced',
    category: 'Chemistry',
    tip: 'en-doh-THER-mik. "th" like in "think".',
    acceptableVariations: ['endothermic', 'endo thermic']
  },
  { 
    id: 17, 
    word: 'Exothermic', 
    phonetic: '/ˌeksoʊˈθɜːrmɪk/', 
    difficulty: 'advanced',
    category: 'Chemistry',
    tip: 'ek-soh-THER-mik. Compare with endothermic.',
    acceptableVariations: ['exothermic', 'exo thermic']
  },
  { 
    id: 18, 
    word: 'Electrochemistry', 
    phonetic: '/ɪˌlektroʊˈkemɪstri/', 
    difficulty: 'advanced',
    category: 'Chemistry',
    tip: 'ee-lek-troh-KEM-is-tree. Seven syllables.',
    acceptableVariations: ['electrochemistry', 'electro chemistry']
  },
  { 
    id: 19, 
    word: 'Nanotechnology', 
    phonetic: '/ˌnænoʊtekˈnɒlədʒi/', 
    difficulty: 'advanced',
    category: 'Technology',
    tip: 'nan-oh-tek-NOL-oh-jee. Watch the stress.',
    acceptableVariations: ['nanotechnology', 'nano technology']
  },
  { 
    id: 20, 
    word: 'Biodegradable', 
    phonetic: '/ˌbaɪoʊdɪˈɡreɪdəbəl/', 
    difficulty: 'advanced',
    category: 'Engineering',
    tip: 'by-oh-dih-GRAY-da-bul. Five syllables.',
    acceptableVariations: ['biodegradable', 'bio degradable']
  },
  { 
    id: 21, 
    word: 'Crystallization', 
    phonetic: '/ˌkrɪstəlaɪˈzeɪʃən/', 
    difficulty: 'advanced',
    category: 'Chemistry',
    tip: 'kris-tal-ih-ZAY-shun. Six syllables.',
    acceptableVariations: ['crystallization', 'crystal ization']
  },
  { 
    id: 22, 
    word: 'Turbulence', 
    phonetic: '/ˈtɜːrbjələns/', 
    difficulty: 'advanced',
    category: 'Engineering',
    tip: 'TUR-byoo-lence. Stress on first syllable.',
    acceptableVariations: ['turbulence', 'turbu lence']
  },
  { 
    id: 23, 
    word: 'Semiconductor', 
    phonetic: '/ˌsemikənˈdʌktər/', 
    difficulty: 'advanced',
    category: 'Technology',
    tip: 'sem-ee-kon-DUK-ter. Stress on fourth syllable.',
    acceptableVariations: ['semiconductor', 'semi conductor']
  },
  { 
    id: 24, 
    word: 'Photosynthesis', 
    phonetic: '/ˌfoʊtoʊˈsɪnθəsɪs/', 
    difficulty: 'advanced',
    category: 'Biology',
    tip: 'foh-toh-SIN-thuh-sis. Five syllables.',
    acceptableVariations: ['photosynthesis', 'photo synthesis']
  },
  { 
    id: 25, 
    word: 'Electromagnetic', 
    phonetic: '/ɪˌlektroʊmæɡˈnetɪk/', 
    difficulty: 'advanced',
    category: 'Physics',
    tip: 'ee-lek-troh-mag-NET-ik. Six syllables.',
    acceptableVariations: ['electromagnetic', 'electro magnetic']
  }
];

const PronunciationLab = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [userPronunciation, setUserPronunciation] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [scores, setScores] = useState({});
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Text-to-speech function
  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8; // Slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        if (audioBlob.size < 2000) {
          setFeedback({
            success: false,
            message: 'Recording too short or no audio detected. Please speak clearly and hold for at least 2 seconds.'
          });
          return;
        }

        try {
          const transcription = await transcribeAudio(audioBlob);
          setUserPronunciation(transcription);
          checkPronunciation(transcription);
        } catch (error) {
          console.error('Transcription error:', error);
          setFeedback({
            success: false,
            message: 'Could not transcribe audio. Please try again.'
          });
        }

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setFeedback(null);
    } catch (error) {
      console.error('Microphone access error:', error);
      setFeedback({
        success: false,
        message: 'Could not access microphone. Please grant permission.'
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Check pronunciation accuracy
  const checkPronunciation = (transcription) => {
    if (!selectedWord) return;

    const userText = transcription.toLowerCase().trim();
    const targetWord = selectedWord.word.toLowerCase();
    
    // Check if the word matches (allowing for variations)
    const variations = selectedWord.acceptableVariations || [targetWord];
    const isCorrect = variations.some(variation => 
      userText.includes(variation.toLowerCase())
    );

    // Calculate similarity score (simple approach)
    let accuracy = 0;
    if (isCorrect) {
      accuracy = 100;
    } else {
      // Calculate Levenshtein-like similarity
      const similarity = calculateSimilarity(userText, targetWord);
      accuracy = Math.round(similarity * 100);
    }

    // Update scores
    setScores(prev => ({
      ...prev,
      [selectedWord.id]: Math.max(prev[selectedWord.id] || 0, accuracy)
    }));

    setFeedback({
      success: accuracy >= 70,
      accuracy,
      message: accuracy >= 90 
        ? 'Perfect pronunciation!' 
        : accuracy >= 70 
        ? 'Good job! Very close.' 
        : accuracy >= 50
        ? 'Not bad, but needs improvement. Try again!'
        : 'Keep practicing. Listen carefully and try again.'
    });
  };

  // Simple similarity calculation
  const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  // Levenshtein distance
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

  // Filter words by difficulty
  const filteredWords = filterDifficulty === 'all' 
    ? pronunciationWords 
    : pronunciationWords.filter(w => w.difficulty === filterDifficulty);

  // Calculate overall progress
  const totalWords = pronunciationWords.length;
  const practisedWords = Object.keys(scores).length;
  const averageScore = Object.values(scores).length > 0
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Pronunciation Lab
          </h1>
          <p className="text-xl text-gray-300">
            Practice technical terms with AI-powered voice recognition
          </p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm mb-1">Words Practiced</p>
                <p className="text-3xl font-bold text-white">{practisedWords}/{totalWords}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-300" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm mb-1">Average Score</p>
                <p className="text-3xl font-bold text-white">{averageScore}%</p>
              </div>
              <Award className="w-12 h-12 text-green-300" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm mb-1">Best Score</p>
                <p className="text-3xl font-bold text-white">
                  {Object.values(scores).length > 0 ? Math.max(...Object.values(scores)) : 0}%
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-purple-300" />
            </div>
          </Card>
        </div>

        {/* Difficulty Filter */}
        <div className="mb-8 flex justify-center gap-4">
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterDifficulty(level)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                filterDifficulty === level
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {/* Word List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWords.map((word) => {
            const score = scores[word.id];
            const isSelected = selectedWord?.id === word.id;

            return (
              <Card
                key={word.id}
                className={`p-6 cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-purple-500 bg-purple-500/10'
                    : 'hover:bg-white/5'
                } ${score >= 90 ? 'border-green-500/50' : ''}`}
                onClick={() => setSelectedWord(word)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {word.word}
                    </h3>
                    <p className="text-sm text-gray-400">{word.phonetic}</p>
                  </div>
                  {score !== undefined && (
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      score >= 90 ? 'bg-green-500/20 text-green-300' :
                      score >= 70 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {score}%
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    word.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                    word.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {word.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-300">
                    {word.category}
                  </span>
                </div>

                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-300 mb-4">{word.tip}</p>
                    
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWord(word.word);
                        }}
                        disabled={isSpeaking}
                        className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                        {isSpeaking ? 'Playing...' : 'Listen'}
                      </button>

                      <button
                        onMouseDown={startRecording}
                        onMouseUp={stopRecording}
                        onTouchStart={startRecording}
                        onTouchEnd={stopRecording}
                        className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          isRecording
                            ? 'bg-red-600 scale-95'
                            : 'bg-purple-600 hover:bg-purple-700'
                        } text-white`}
                      >
                        <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
                        {isRecording ? 'Recording...' : 'Record'}
                      </button>
                    </div>

                    {userPronunciation && (
                      <div className="mb-3 p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">You said:</p>
                        <p className="text-sm text-white">{userPronunciation}</p>
                      </div>
                    )}

                    {feedback && (
                      <div className={`p-3 rounded-lg flex items-start gap-2 ${
                        feedback.success
                          ? 'bg-green-500/20 border border-green-500/30'
                          : 'bg-red-500/20 border border-red-500/30'
                      }`}>
                        {feedback.success ? (
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          {feedback.accuracy !== undefined && (
                            <p className={`font-bold mb-1 ${
                              feedback.success ? 'text-green-300' : 'text-red-300'
                            }`}>
                              Accuracy: {feedback.accuracy}%
                            </p>
                          )}
                          <p className={`text-sm ${
                            feedback.success ? 'text-green-200' : 'text-red-200'
                          }`}>
                            {feedback.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PronunciationLab;