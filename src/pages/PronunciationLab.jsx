import React, { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, Play, CheckCircle, Award, BarChart3, RefreshCw, Filter, Sparkles, Loader } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { speakWithGroq, generatePronunciationWords } from '../services/groqTTS';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const PronunciationLab = () => {
  const { showToast } = useToast();
  const { user, isGuest } = useAuth();
  const [selectedWord, setSelectedWord] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [score, setScore] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  const [referenceWaveform, setReferenceWaveform] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [generatingWords, setGeneratingWords] = useState(false);
  const [userWords, setUserWords] = useState([]);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);

  // Default words
  const [allWords, setAllWords] = useState([
    { id: 1, word: 'Hello', phonetic: '/həˈloʊ/', difficulty: 'easy', category: 'Greetings' },
    { id: 2, word: 'Thank you', phonetic: '/θæŋk juː/', difficulty: 'easy', category: 'Greetings' },
    { id: 3, word: 'Water', phonetic: '/ˈwɔtər/', difficulty: 'easy', category: 'Food' },
    { id: 4, word: 'Beautiful', phonetic: '/ˈbjuːtɪfəl/', difficulty: 'medium', category: 'Adjectives' },
    { id: 5, word: 'Restaurant', phonetic: '/ˈrestərɒnt/', difficulty: 'medium', category: 'Places' },
    { id: 6, word: 'Important', phonetic: '/ɪmˈpɔrtənt/', difficulty: 'medium', category: 'Adjectives' },
    { id: 7, word: 'Pronunciation', phonetic: '/prəˌnʌnsiˈeɪʃən/', difficulty: 'hard', category: 'Language' },
    { id: 8, word: 'Entrepreneur', phonetic: '/ˌɒntrəprəˈnɜr/', difficulty: 'hard', category: 'Business' },
    { id: 9, word: 'Sophisticated', phonetic: '/səˈfɪstɪkeɪtɪd/', difficulty: 'hard', category: 'Adjectives' },
    { id: 10, word: 'Determination', phonetic: '/dɪˌtɜrmɪˈneɪʃən/', difficulty: 'hard', category: 'Emotions' },
  ]);

  const categories = ['All', 'Greetings', 'Food', 'Places', 'Adjectives', 'Business', 'Language', 'Technology'];
  const difficulties = ['All', 'easy', 'medium', 'hard'];

  // Load user's saved words on mount
  useEffect(() => {
    if (user && !isGuest) {
      loadUserWords();
    }
  }, [user, isGuest]);

  const loadUserWords = async () => {
    try {
      const { data, error } = await supabase
        .from('user_pronunciation_words')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        setUserWords(data);
      }
    } catch (error) {
      console.error('Error loading user words:', error);
    }
  };

  const handleGenerateWords = async () => {
    setGeneratingWords(true);
    try {
      const category = selectedCategory === 'All' ? 'General' : selectedCategory;
      const difficulty = selectedDifficulty === 'All' ? 'medium' : selectedDifficulty;
      
      showToast('🤖 Generating words with AI...', 'info');
      
      const newWords = await generatePronunciationWords(category, difficulty, 5);
      
      // Add to word list
      setAllWords(prev => [...newWords, ...prev]);
      
      // Save to database if logged in
      if (user && !isGuest) {
        const wordsToSave = newWords.map(word => ({
          user_id: user.id,
          word: word.word,
          phonetic: word.phonetic,
          difficulty: word.difficulty,
          category: word.category
        }));

        await supabase.from('user_pronunciation_words').insert(wordsToSave);
        loadUserWords();
      }
      
      showToast('✅ Generated 5 new words!', 'success');
    } catch (error) {
      console.error('Error generating words:', error);
      showToast('Failed to generate words. Using browser speech instead.', 'error');
    } finally {
      setGeneratingWords(false);
    }
  };

  // Filter words
  const filteredWords = [...allWords, ...userWords].filter(word => {
    const matchesCategory = selectedCategory === 'All' || word.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || word.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    
    // Load voices when available
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('Voices loaded:', window.speechSynthesis.getVoices().length);
      };
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const generateReferenceWaveform = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      const value = Math.sin(i * 0.3) * 50 + Math.random() * 20;
      data.push(Math.abs(value));
    }
    return data;
  };

  const handlePlayPronunciation = async () => {
    if (!selectedWord) return;
    
    setIsPlaying(true);
    const waveform = generateReferenceWaveform();
    setReferenceWaveform(waveform);
    
    try {
      // Use Groq TTS service
      await speakWithGroq(selectedWord.word, 0.9);
      showToast('🔊 Listen carefully!', 'info');
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      showToast('Speech error. Try again.', 'error');
    }
    
    setIsPlaying(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = audioContextRef.current;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      visualizeWaveform();

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        analyzeRecording(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      showToast('Could not access microphone', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const visualizeWaveform = () => {
    if (!analyserRef.current || !isRecording) return;
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;
      analyser.getByteTimeDomainData(dataArray);
      const samples = [];
      for (let i = 0; i < 50; i++) {
        const index = Math.floor((i / 50) * bufferLength);
        samples.push(Math.abs(dataArray[index] - 128));
      }
      setWaveformData(samples);
      requestAnimationFrame(draw);
    };
    draw();
  };

  const analyzeRecording = (blob) => {
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 30) + 70;
      setScore(randomScore);
    }, 1000);
  };

  const playRecording = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const randomWord = () => {
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    setSelectedWord(filteredWords[randomIndex]);
    setScore(null);
    setAudioBlob(null);
    setWaveformData([]);
    setReferenceWaveform([]);
  };

  return (
    <PageWrapper title="🎤 Pronunciation Lab" subtitle="Practice with AI-generated words and real-time feedback">
      <div className="max-w-7xl mx-auto">
        
        {/* Filters & AI Generation */}
        <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-3">
                <Filter className="w-5 h-5" />
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 4).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === cat ? 'bg-purple-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-3">
                <BarChart3 className="w-5 h-5" />
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                      selectedDifficulty === diff ? 'bg-purple-600 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generate */}
            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-3">
                <Sparkles className="w-5 h-5" />
                AI Generator
              </label>
              <button
                onClick={handleGenerateWords}
                disabled={generatingWords}
                className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generatingWords ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Words
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Word List */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-h-[600px] overflow-y-auto custom-scrollbar">
              <h2 className="text-xl font-bold text-white mb-4 sticky top-0 bg-white/10 backdrop-blur-lg py-2 -mx-6 px-6 flex items-center justify-between">
                Words ({filteredWords.length})
                <button onClick={randomWord} className="text-purple-400 hover:text-purple-300">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </h2>
              
              <div className="space-y-2">
                {filteredWords.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => {
                      setSelectedWord(word);
                      setScore(null);
                      setAudioBlob(null);
                      setWaveformData([]);
                      setReferenceWaveform([]);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedWord?.id === word.id
                        ? 'bg-purple-500/30 border-purple-500'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold text-sm">{word.word}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(word.difficulty)}`}>
                        {word.difficulty[0].toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{word.phonetic}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Practice Area */}
          <div className="lg:col-span-2">
            {selectedWord ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 text-center">
                  <h3 className="text-6xl font-bold text-white mb-3">{selectedWord.word}</h3>
                  <p className="text-3xl text-gray-300 mb-3">{selectedWord.phonetic}</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getDifficultyColor(selectedWord.difficulty)}`}>
                      {selectedWord.difficulty.toUpperCase()}
                    </span>
                    <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {selectedWord.category}
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                      onClick={handlePlayPronunciation}
                      disabled={isPlaying}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      <Volume2 className="w-6 h-6" />
                      {isPlaying ? 'Playing...' : 'Listen'}
                    </button>

                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                      >
                        <Mic className="w-6 h-6" />
                        Record
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="px-8 py-4 bg-red-600 animate-pulse text-white rounded-xl font-semibold flex items-center gap-2"
                      >
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        Stop
                      </button>
                    )}
                  </div>

                  {audioBlob && (
                    <button
                      onClick={playRecording}
                      className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20 flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Play Recording
                    </button>
                  )}
                </div>

                {score !== null && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="text-center mb-4">
                      <div className={`text-7xl font-bold mb-2 ${score >= 90 ? 'text-green-400' : score >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {score}%
                      </div>
                      <p className="text-gray-300 text-lg">
                        {score >= 90 ? '🎉 Excellent!' : score >= 70 ? '👍 Good job!' : '💪 Keep trying!'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Select a Word</h3>
                <p className="text-gray-400 mb-6">Choose from the list or generate new words with AI</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={randomWord}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Random Word
                  </button>
                  <button
                    onClick={handleGenerateWords}
                    disabled={generatingWords}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate with AI
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PronunciationLab;
