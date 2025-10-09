 import React, { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, Play, Pause, CheckCircle, XCircle, Award, BarChart3 } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { speakText } from '../services/elevenLabsTTS';

const PronunciationLab = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [score, setScore] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  const [referenceWaveform, setReferenceWaveform] = useState([]);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);

  const words = [
    { id: 1, word: 'Hello', phonetic: '/həˈloʊ/', difficulty: 'easy', category: 'Greetings' },
    { id: 2, word: 'Beautiful', phonetic: '/ˈbjuːtɪfəl/', difficulty: 'medium', category: 'Adjectives' },
    { id: 3, word: 'Restaurant', phonetic: '/ˈrestərɑːnt/', difficulty: 'medium', category: 'Places' },
    { id: 4, word: 'Pronunciation', phonetic: '/prəˌnʌnsiˈeɪʃən/', difficulty: 'hard', category: 'Language' },
    { id: 5, word: 'Throughout', phonetic: '/θruːˈaʊt/', difficulty: 'hard', category: 'Prepositions' },
    { id: 6, word: 'Wednesday', phonetic: '/ˈwenzdeɪ/', difficulty: 'medium', category: 'Days' },
    { id: 7, word: 'Comfortable', phonetic: '/ˈkʌmftəbl/', difficulty: 'medium', category: 'Adjectives' },
    { id: 8, word: 'Entrepreneur', phonetic: '/ˌɑːntrəprəˈnɜːr/', difficulty: 'hard', category: 'Business' },
  ];

  useEffect(() => {
    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const generateReferenceWaveform = () => {
    // Generate a simulated reference waveform
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
      await speakText(selectedWord.word, 0.9);
    } catch (error) {
      console.error('Error playing pronunciation:', error);
    }
    
    setIsPlaying(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio analyser for waveform
      const audioContext = audioContextRef.current;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start waveform visualization
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
      alert('Could not access microphone. Please check permissions.');
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
      
      // Sample data points for waveform
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
    // Simulate pronunciation analysis
    // In a real app, you'd send this to a speech recognition API
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 30) + 70; // 70-100
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
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <PageWrapper title="Pronunciation Lab" subtitle="Practice and perfect your English pronunciation">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Word List */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Practice Words</h2>
              
              <div className="space-y-2">
                {words.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => {
                      setSelectedWord(word);
                      setScore(null);
                      setAudioBlob(null);
                      setWaveformData([]);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedWord?.id === word.id
                        ? 'bg-purple-500/30 border-purple-500'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-semibold">{word.word}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(word.difficulty)}`}>
                        {word.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{word.phonetic}</p>
                    <p className="text-xs text-gray-500 mt-1">{word.category}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {selectedWord ? (
              <>
                {/* Selected Word Display */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 text-center">
                  <h3 className="text-5xl font-bold text-white mb-3">{selectedWord.word}</h3>
                  <p className="text-2xl text-gray-300 mb-2">{selectedWord.phonetic}</p>
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getDifficultyColor(selectedWord.difficulty)}`}>
                    {selectedWord.difficulty.toUpperCase()}
                  </span>
                </div>

                {/* Audio Controls */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Listen & Practice</h3>
                  
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                      onClick={handlePlayPronunciation}
                      disabled={isPlaying}
                      className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      {isPlaying ? 'Playing...' : 'Hear Pronunciation'}
                    </button>

                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
                      >
                        <Mic className="w-6 h-6" />
                        Record Your Voice
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 px-8 py-4 bg-red-600 animate-pulse text-white rounded-xl font-semibold"
                      >
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        Recording... Click to Stop
                      </button>
                    )}
                  </div>

                  {/* Reference Waveform */}
                  {referenceWaveform.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Native Speaker Waveform</h4>
                      <div className="h-24 bg-white/5 rounded-lg p-4 flex items-end justify-around gap-1">
                        {referenceWaveform.map((value, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all duration-200"
                            style={{
                              height: `${(value / Math.max(...referenceWaveform)) * 100}%`,
                              width: '2%',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Waveform */}
                  {(isRecording || waveformData.length > 0) && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Your Recording</h4>
                      <div className="h-24 bg-white/5 rounded-lg p-4 flex items-end justify-around gap-1">
                        {waveformData.map((value, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-t from-purple-500 to-pink-400 rounded-t transition-all duration-100"
                            style={{
                              height: `${(value / Math.max(...waveformData, 1)) * 100}%`,
                              width: '2%',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {audioBlob && (
                    <button
                      onClick={playRecording}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20"
                    >
                      <Play className="w-5 h-5" />
                      Play Your Recording
                    </button>
                  )}
                </div>

                {/* Score Display */}
                {score !== null && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-4">Pronunciation Score</h3>
                    
                    <div className="text-center mb-6">
                      <div className={`text-7xl font-bold mb-2 ${getScoreColor(score)}`}>
                        {score}%
                      </div>
                      <p className="text-gray-300">
                        {score >= 90 ? 'Excellent! 🎉' : score >= 70 ? 'Good job! Keep practicing 👍' : 'Keep trying! 💪'}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Accuracy</p>
                        <p className="text-white text-2xl font-bold">{score - 5}%</p>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Fluency</p>
                        <p className="text-white text-2xl font-bold">{score + 2}%</p>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Clarity</p>
                        <p className="text-white text-2xl font-bold">{score - 3}%</p>
                      </div>
                    </div>

                    {score >= 80 && (
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                        <p className="text-green-400 font-semibold">
                          Great pronunciation! You've mastered this word.
                        </p>
                      </div>
                    )}

                    {score < 80 && (
                      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                        <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Tips to Improve:
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-1 ml-7">
                          <li>• Listen to the native pronunciation again</li>
                          <li>• Focus on the phonetic sounds: {selectedWord.phonetic}</li>
                          <li>• Record yourself multiple times</li>
                          <li>• Practice slowly, then gradually increase speed</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
                <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Select a Word to Practice</h3>
                <p className="text-gray-400">
                  Choose a word from the list to start practicing your pronunciation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PronunciationLab;