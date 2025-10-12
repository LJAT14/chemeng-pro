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

  const pronunciationWords = [
  // Easy (20 words)
  { id: 1, word: 'Hello', phonetic: '/həˈloʊ/', difficulty: 'easy', category: 'Greetings' },
  { id: 2, word: 'Thank you', phonetic: '/θæŋk juː/', difficulty: 'easy', category: 'Greetings' },
  { id: 3, word: 'Good morning', phonetic: '/ɡʊd ˈmɔrnɪŋ/', difficulty: 'easy', category: 'Greetings' },
  { id: 4, word: 'Goodbye', phonetic: '/ɡʊdˈbaɪ/', difficulty: 'easy', category: 'Greetings' },
  { id: 5, word: 'Please', phonetic: '/pliːz/', difficulty: 'easy', category: 'Greetings' },
  { id: 6, word: 'Sorry', phonetic: '/ˈsɒri/', difficulty: 'easy', category: 'Greetings' },
  { id: 7, word: 'Yes', phonetic: '/jes/', difficulty: 'easy', category: 'Common' },
  { id: 8, word: 'No', phonetic: '/noʊ/', difficulty: 'easy', category: 'Common' },
  { id: 9, word: 'Water', phonetic: '/ˈwɔtər/', difficulty: 'easy', category: 'Food' },
  { id: 10, word: 'Coffee', phonetic: '/ˈkɒfi/', difficulty: 'easy', category: 'Food' },
  { id: 11, word: 'House', phonetic: '/haʊs/', difficulty: 'easy', category: 'Places' },
  { id: 12, word: 'School', phonetic: '/skuːl/', difficulty: 'easy', category: 'Places' },
  { id: 13, word: 'Book', phonetic: '/bʊk/', difficulty: 'easy', category: 'Objects' },
  { id: 14, word: 'Phone', phonetic: '/foʊn/', difficulty: 'easy', category: 'Objects' },
  { id: 15, word: 'Computer', phonetic: '/kəmˈpjuːtər/', difficulty: 'easy', category: 'Objects' },
  { id: 16, word: 'Happy', phonetic: '/ˈhæpi/', difficulty: 'easy', category: 'Adjectives' },
  { id: 17, word: 'Good', phonetic: '/ɡʊd/', difficulty: 'easy', category: 'Adjectives' },
  { id: 18, word: 'Big', phonetic: '/bɪɡ/', difficulty: 'easy', category: 'Adjectives' },
  { id: 19, word: 'Small', phonetic: '/smɔːl/', difficulty: 'easy', category: 'Adjectives' },
  { id: 20, word: 'Today', phonetic: '/təˈdeɪ/', difficulty: 'easy', category: 'Time' },

  // Medium (30 words)
  { id: 21, word: 'Beautiful', phonetic: '/ˈbjuːtɪfəl/', difficulty: 'medium', category: 'Adjectives' },
  { id: 22, word: 'Restaurant', phonetic: '/ˈrestərɒnt/', difficulty: 'medium', category: 'Places' },
  { id: 23, word: 'Wednesday', phonetic: '/ˈwenzdeɪ/', difficulty: 'medium', category: 'Days' },
  { id: 24, word: 'Comfortable', phonetic: '/ˈkʌmftəbl/', difficulty: 'medium', category: 'Adjectives' },
  { id: 25, word: 'Important', phonetic: '/ɪmˈpɔrtənt/', difficulty: 'medium', category: 'Adjectives' },
  { id: 26, word: 'Interesting', phonetic: '/ˈɪntrəstɪŋ/', difficulty: 'medium', category: 'Adjectives' },
  { id: 27, word: 'Understand', phonetic: '/ˌʌndərˈstænd/', difficulty: 'medium', category: 'Verbs' },
  { id: 28, word: 'Remember', phonetic: '/rɪˈmembər/', difficulty: 'medium', category: 'Verbs' },
  { id: 29, word: 'Information', phonetic: '/ˌɪnfərˈmeɪʃən/', difficulty: 'medium', category: 'Nouns' },
  { id: 30, word: 'Education', phonetic: '/ˌedʒuˈkeɪʃən/', difficulty: 'medium', category: 'Nouns' },
  { id: 31, word: 'Business', phonetic: '/ˈbɪznəs/', difficulty: 'medium', category: 'Nouns' },
  { id: 32, word: 'Experience', phonetic: '/ɪkˈspɪriəns/', difficulty: 'medium', category: 'Nouns' },
  { id: 33, word: 'Technology', phonetic: '/tekˈnɒlədʒi/', difficulty: 'medium', category: 'Nouns' },
  { id: 34, word: 'Development', phonetic: '/dɪˈveləpmənt/', difficulty: 'medium', category: 'Nouns' },
  { id: 35, word: 'Organization', phonetic: '/ˌɔrɡənəˈzeɪʃən/', difficulty: 'medium', category: 'Nouns' },
  { id: 36, word: 'Environment', phonetic: '/ɪnˈvaɪrənmənt/', difficulty: 'medium', category: 'Nouns' },
  { id: 37, word: 'Communication', phonetic: '/kəˌmjuːnɪˈkeɪʃən/', difficulty: 'medium', category: 'Nouns' },
  { id: 38, word: 'Available', phonetic: '/əˈveɪləbl/', difficulty: 'medium', category: 'Adjectives' },
  { id: 39, word: 'Necessary', phonetic: '/ˈnesəseri/', difficulty: 'medium', category: 'Adjectives' },
  { id: 40, word: 'Different', phonetic: '/ˈdɪfərənt/', difficulty: 'medium', category: 'Adjectives' },
  { id: 41, word: 'Specific', phonetic: '/spəˈsɪfɪk/', difficulty: 'medium', category: 'Adjectives' },
  { id: 42, word: 'Tomorrow', phonetic: '/təˈmɒroʊ/', difficulty: 'medium', category: 'Time' },
  { id: 43, word: 'Yesterday', phonetic: '/ˈjestərdeɪ/', difficulty: 'medium', category: 'Time' },
  { id: 44, word: 'Schedule', phonetic: '/ˈskedʒuːl/', difficulty: 'medium', category: 'Time' },
  { id: 45, word: 'Language', phonetic: '/ˈlæŋɡwɪdʒ/', difficulty: 'medium', category: 'Language' },
  { id: 46, word: 'Vocabulary', phonetic: '/vəˈkæbjəleri/', difficulty: 'medium', category: 'Language' },
  { id: 47, word: 'Grammar', phonetic: '/ˈɡræmər/', difficulty: 'medium', category: 'Language' },
  { id: 48, word: 'Question', phonetic: '/ˈkwestʃən/', difficulty: 'medium', category: 'Language' },
  { id: 49, word: 'Answer', phonetic: '/ˈænsər/', difficulty: 'medium', category: 'Language' },
  { id: 50, word: 'Presentation', phonetic: '/ˌprezənˈteɪʃən/', difficulty: 'medium', category: 'Business' },

  // Hard (25 words)
  { id: 51, word: 'Pronunciation', phonetic: '/prəˌnʌnsiˈeɪʃən/', difficulty: 'hard', category: 'Language' },
  { id: 52, word: 'Throughout', phonetic: '/θruːˈaʊt/', difficulty: 'hard', category: 'Prepositions' },
  { id: 53, word: 'Entrepreneur', phonetic: '/ˌɒntrəprəˈnɜr/', difficulty: 'hard', category: 'Business' },
  { id: 54, word: 'Miscellaneous', phonetic: '/ˌmɪsəˈleɪniəs/', difficulty: 'hard', category: 'Adjectives' },
  { id: 55, word: 'Massachusetts', phonetic: '/ˌmæsəˈtʃuːsɪts/', difficulty: 'hard', category: 'Places' },
  { id: 56, word: 'Worcestershire', phonetic: '/ˈwʊstərʃər/', difficulty: 'hard', category: 'Places' },
  { id: 57, word: 'Phenomenon', phonetic: '/fəˈnɒmɪnən/', difficulty: 'hard', category: 'Nouns' },
  { id: 58, word: 'Anonymous', phonetic: '/əˈnɒnɪməs/', difficulty: 'hard', category: 'Adjectives' },
  { id: 59, word: 'Hierarchy', phonetic: '/ˈhaɪərɑrki/', difficulty: 'hard', category: 'Nouns' },
  { id: 60, word: 'Exacerbate', phonetic: '/ɪɡˈzæsərbeɪt/', difficulty: 'hard', category: 'Verbs' },
  { id: 61, word: 'Conscientious', phonetic: '/ˌkɒnʃiˈenʃəs/', difficulty: 'hard', category: 'Adjectives' },
  { id: 62, word: 'Simultaneous', phonetic: '/ˌsaɪməlˈteɪniəs/', difficulty: 'hard', category: 'Adjectives' },
  { id: 63, word: 'Sophisticated', phonetic: '/səˈfɪstɪkeɪtɪd/', difficulty: 'hard', category: 'Adjectives' },
  { id: 64, word: 'Circumstance', phonetic: '/ˈsɜrkəmstæns/', difficulty: 'hard', category: 'Nouns' },
  { id: 65, word: 'Architecture', phonetic: '/ˈɑrkɪtektʃər/', difficulty: 'hard', category: 'Nouns' },
  { id: 66, word: 'Achievement', phonetic: '/əˈtʃiːvmənt/', difficulty: 'hard', category: 'Nouns' },
  { id: 67, word: 'Particularly', phonetic: '/pərˈtɪkjələrli/', difficulty: 'hard', category: 'Adverbs' },
  { id: 68, word: 'Unfortunately', phonetic: '/ʌnˈfɔrtʃənətli/', difficulty: 'hard', category: 'Adverbs' },
  { id: 69, word: 'Extraordinarily', phonetic: '/ɪkˈstrɔrdəneri/', difficulty: 'hard', category: 'Adverbs' },
  { id: 70, word: 'Characteristic', phonetic: '/ˌkærəktəˈrɪstɪk/', difficulty: 'hard', category: 'Adjectives' },
  { id: 71, word: 'Infrastructure', phonetic: '/ˈɪnfrəstrʌktʃər/', difficulty: 'hard', category: 'Nouns' },
  { id: 72, word: 'Pharmaceutical', phonetic: '/ˌfɑrməˈsuːtɪkəl/', difficulty: 'hard', category: 'Adjectives' },
  { id: 73, word: 'Recommendation', phonetic: '/ˌrekəmenˈdeɪʃən/', difficulty: 'hard', category: 'Nouns' },
  { id: 74, word: 'Responsibilities', phonetic: '/rɪˌspɒnsəˈbɪlɪtiz/', difficulty: 'hard', category: 'Nouns' },
  { id: 75, word: 'Determination', phonetic: '/dɪˌtɜrmɪˈneɪʃən/', difficulty: 'hard', category: 'Nouns' },
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