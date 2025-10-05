import React, { useState, useRef } from 'react';
import { Mic, Volume2, CheckCircle, XCircle, TrendingUp, Award } from 'lucide-react';
import Card from '../components/shared/Card';
import { transcribeAudio } from '../services/groqWhisperService';

const pronunciationWords = [
  { id: 1, word: 'Thermodynamics', phonetic: '/ˌθɜːrmoʊdaɪˈnæmɪks/', difficulty: 'beginner', category: 'Chemistry', tip: 'THER-mo-dy-NAM-ics. Stress on "nam".', acceptableVariations: ['thermodynamics'] },
  { id: 2, word: 'Catalyst', phonetic: '/ˈkætəlɪst/', difficulty: 'beginner', category: 'Chemistry', tip: 'CAT-a-list. Stress on first syllable.', acceptableVariations: ['catalyst'] },
  { id: 3, word: 'Molecule', phonetic: '/ˈmɒlɪkjuːl/', difficulty: 'beginner', category: 'Chemistry', tip: 'MOL-eh-kyool. Three syllables.', acceptableVariations: ['molecule'] },
  { id: 4, word: 'Algorithm', phonetic: '/ˈælɡərɪðəm/', difficulty: 'beginner', category: 'Technology', tip: 'AL-go-rith-um. Stress on first syllable.', acceptableVariations: ['algorithm'] },
  { id: 5, word: 'Efficiency', phonetic: '/ɪˈfɪʃənsi/', difficulty: 'beginner', category: 'Engineering', tip: 'ef-FISH-en-see. Stress on second syllable.', acceptableVariations: ['efficiency'] },
  { id: 6, word: 'Laboratory', phonetic: '/ˈlæbrətɔːri/', difficulty: 'beginner', category: 'Science', tip: 'LAB-ra-tor-ee. Four syllables.', acceptableVariations: ['laboratory'] },
  { id: 7, word: 'Temperature', phonetic: '/ˈtemprətʃər/', difficulty: 'beginner', category: 'Physics', tip: 'TEM-per-a-chur. Stress on first syllable.', acceptableVariations: ['temperature'] },
  { id: 8, word: 'Hydrogen', phonetic: '/ˈhaɪdrədʒən/', difficulty: 'beginner', category: 'Chemistry', tip: 'HY-dro-jen. Three syllables.', acceptableVariations: ['hydrogen'] },
  { id: 9, word: 'Analysis', phonetic: '/əˈnæləsɪs/', difficulty: 'beginner', category: 'Science', tip: 'a-NAL-i-sis. Stress on second syllable.', acceptableVariations: ['analysis'] },
  { id: 10, word: 'Equipment', phonetic: '/ɪˈkwɪpmənt/', difficulty: 'beginner', category: 'Engineering', tip: 'e-KWIP-ment. Three syllables.', acceptableVariations: ['equipment'] },
  { id: 11, word: 'Stoichiometry', phonetic: '/ˌstɔɪkiˈɒmətri/', difficulty: 'intermediate', category: 'Chemistry', tip: 'stoy-key-OM-eh-tree.', acceptableVariations: ['stoichiometry'] },
  { id: 12, word: 'Heterogeneous', phonetic: '/ˌhetərəˈdʒiːniəs/', difficulty: 'intermediate', category: 'Chemistry', tip: 'het-er-oh-JEE-nee-us.', acceptableVariations: ['heterogeneous'] },
  { id: 13, word: 'Precipitation', phonetic: '/prɪˌsɪpɪˈteɪʃən/', difficulty: 'intermediate', category: 'Chemistry', tip: 'pre-sip-ih-TAY-shun.', acceptableVariations: ['precipitation'] },
  { id: 14, word: 'Viscosity', phonetic: '/vɪsˈkɒsəti/', difficulty: 'intermediate', category: 'Engineering', tip: 'vis-KOS-ih-tee.', acceptableVariations: ['viscosity'] },
  { id: 15, word: 'Equilibrium', phonetic: '/ˌiːkwɪˈlɪbriəm/', difficulty: 'intermediate', category: 'Chemistry', tip: 'ee-kwi-LIB-ree-um.', acceptableVariations: ['equilibrium'] },
  { id: 16, word: 'Pharmaceutical', phonetic: '/ˌfɑːrməˈsuːtɪkəl/', difficulty: 'intermediate', category: 'Medicine', tip: 'far-ma-SOO-tih-kul.', acceptableVariations: ['pharmaceutical'] },
  { id: 17, word: 'Chromatography', phonetic: '/ˌkroʊməˈtɒɡrəfi/', difficulty: 'intermediate', category: 'Chemistry', tip: 'kro-ma-TOG-ra-fee.', acceptableVariations: ['chromatography'] },
  { id: 18, word: 'Polymerization', phonetic: '/pəˌlɪmərəˈzeɪʃən/', difficulty: 'intermediate', category: 'Chemistry', tip: 'puh-lim-er-ih-ZAY-shun.', acceptableVariations: ['polymerization'] },
  { id: 19, word: 'Sustainability', phonetic: '/səˌsteɪnəˈbɪləti/', difficulty: 'intermediate', category: 'Engineering', tip: 'sus-tay-na-BIL-ih-tee.', acceptableVariations: ['sustainability'] },
  { id: 20, word: 'Spectroscopy', phonetic: '/spekˈtrɒskəpi/', difficulty: 'intermediate', category: 'Chemistry', tip: 'spek-TROS-ko-pee.', acceptableVariations: ['spectroscopy'] },
  { id: 21, word: 'Conductivity', phonetic: '/ˌkɒndʌkˈtɪvəti/', difficulty: 'intermediate', category: 'Physics', tip: 'kon-duk-TIV-ih-tee.', acceptableVariations: ['conductivity'] },
  { id: 22, word: 'Fermentation', phonetic: '/ˌfɜːrmenˈteɪʃən/', difficulty: 'intermediate', category: 'Biology', tip: 'fer-men-TAY-shun.', acceptableVariations: ['fermentation'] },
  { id: 23, word: 'Synthesis', phonetic: '/ˈsɪnθəsɪs/', difficulty: 'intermediate', category: 'Chemistry', tip: 'SIN-thuh-sis.', acceptableVariations: ['synthesis'] },
  { id: 24, word: 'Coefficient', phonetic: '/ˌkoʊɪˈfɪʃənt/', difficulty: 'intermediate', category: 'Math', tip: 'ko-ih-FISH-ent.', acceptableVariations: ['coefficient'] },
  { id: 25, word: 'Thermometer', phonetic: '/θərˈmɒmɪtər/', difficulty: 'intermediate', category: 'Science', tip: 'thur-MOM-ih-ter.', acceptableVariations: ['thermometer'] },
  { id: 26, word: 'Reservoir', phonetic: '/ˈrezərvwɑːr/', difficulty: 'intermediate', category: 'Engineering', tip: 'REZ-er-vwar.', acceptableVariations: ['reservoir'] },
  { id: 27, word: 'Combustion', phonetic: '/kəmˈbʌstʃən/', difficulty: 'intermediate', category: 'Chemistry', tip: 'kum-BUS-chun.', acceptableVariations: ['combustion'] },
  { id: 28, word: 'Evaporation', phonetic: '/ɪˌvæpəˈreɪʃən/', difficulty: 'intermediate', category: 'Chemistry', tip: 'ee-vap-or-AY-shun.', acceptableVariations: ['evaporation'] },
  { id: 29, word: 'Contamination', phonetic: '/kənˌtæmɪˈneɪʃən/', difficulty: 'intermediate', category: 'Safety', tip: 'kon-tam-ih-NAY-shun.', acceptableVariations: ['contamination'] },
  { id: 30, word: 'Metallurgy', phonetic: '/ˈmetələrdʒi/', difficulty: 'intermediate', category: 'Engineering', tip: 'MET-al-ur-jee.', acceptableVariations: ['metallurgy'] },
  { id: 31, word: 'Endothermic', phonetic: '/ˌendoʊˈθɜːrmɪk/', difficulty: 'advanced', category: 'Chemistry', tip: 'en-doh-THER-mik.', acceptableVariations: ['endothermic'] },
  { id: 32, word: 'Exothermic', phonetic: '/ˌeksoʊˈθɜːrmɪk/', difficulty: 'advanced', category: 'Chemistry', tip: 'ek-soh-THER-mik.', acceptableVariations: ['exothermic'] },
  { id: 33, word: 'Electrochemistry', phonetic: '/ɪˌlektroʊˈkemɪstri/', difficulty: 'advanced', category: 'Chemistry', tip: 'ee-lek-troh-KEM-is-tree.', acceptableVariations: ['electrochemistry'] },
  { id: 34, word: 'Nanotechnology', phonetic: '/ˌnænoʊtekˈnɒlədʒi/', difficulty: 'advanced', category: 'Technology', tip: 'nan-oh-tek-NOL-oh-jee.', acceptableVariations: ['nanotechnology'] },
  { id: 35, word: 'Biodegradable', phonetic: '/ˌbaɪoʊdɪˈɡreɪdəbəl/', difficulty: 'advanced', category: 'Engineering', tip: 'by-oh-dih-GRAY-da-bul.', acceptableVariations: ['biodegradable'] },
  { id: 36, word: 'Crystallization', phonetic: '/ˌkrɪstəlaɪˈzeɪʃən/', difficulty: 'advanced', category: 'Chemistry', tip: 'kris-tal-ih-ZAY-shun.', acceptableVariations: ['crystallization'] },
  { id: 37, word: 'Turbulence', phonetic: '/ˈtɜːrbjələns/', difficulty: 'advanced', category: 'Engineering', tip: 'TUR-byoo-lence.', acceptableVariations: ['turbulence'] },
  { id: 38, word: 'Semiconductor', phonetic: '/ˌsemikənˈdʌktər/', difficulty: 'advanced', category: 'Technology', tip: 'sem-ee-kon-DUK-ter.', acceptableVariations: ['semiconductor'] },
  { id: 39, word: 'Photosynthesis', phonetic: '/ˌfoʊtoʊˈsɪnθəsɪs/', difficulty: 'advanced', category: 'Biology', tip: 'foh-toh-SIN-thuh-sis.', acceptableVariations: ['photosynthesis'] },
  { id: 40, word: 'Electromagnetic', phonetic: '/ɪˌlektroʊmæɡˈnetɪk/', difficulty: 'advanced', category: 'Physics', tip: 'ee-lek-troh-mag-NET-ik.', acceptableVariations: ['electromagnetic'] },
  { id: 41, word: 'Centrifugal', phonetic: '/senˈtrɪfjəɡəl/', difficulty: 'advanced', category: 'Physics', tip: 'sen-TRIF-you-gul.', acceptableVariations: ['centrifugal'] },
  { id: 42, word: 'Hydrolysis', phonetic: '/haɪˈdrɒləsɪs/', difficulty: 'advanced', category: 'Chemistry', tip: 'hy-DROL-ih-sis.', acceptableVariations: ['hydrolysis'] },
  { id: 43, word: 'Anisotropic', phonetic: '/ˌænaɪsəˈtrɒpɪk/', difficulty: 'advanced', category: 'Physics', tip: 'an-eye-so-TROP-ik.', acceptableVariations: ['anisotropic'] },
  { id: 44, word: 'Nomenclature', phonetic: '/ˈnoʊmənkleɪtʃər/', difficulty: 'advanced', category: 'Chemistry', tip: 'NO-men-klay-chur.', acceptableVariations: ['nomenclature'] },
  { id: 45, word: 'Stereoisomer', phonetic: '/ˌsterioʊˈaɪsəmər/', difficulty: 'advanced', category: 'Chemistry', tip: 'steer-ee-oh-EYE-so-mer.', acceptableVariations: ['stereoisomer'] },
  { id: 46, word: 'Rheology', phonetic: '/riˈɒlədʒi/', difficulty: 'advanced', category: 'Engineering', tip: 'ree-OL-oh-jee.', acceptableVariations: ['rheology'] },
  { id: 47, word: 'Titration', phonetic: '/taɪˈtreɪʃən/', difficulty: 'advanced', category: 'Chemistry', tip: 'ty-TRAY-shun.', acceptableVariations: ['titration'] },
  { id: 48, word: 'Supercritical', phonetic: '/ˌsuːpəˈkrɪtɪkəl/', difficulty: 'advanced', category: 'Chemistry', tip: 'soo-per-KRIT-ih-kul.', acceptableVariations: ['supercritical'] },
  { id: 49, word: 'Pyrolysis', phonetic: '/paɪˈrɒləsɪs/', difficulty: 'advanced', category: 'Chemistry', tip: 'py-ROL-ih-sis.', acceptableVariations: ['pyrolysis'] },
  { id: 50, word: 'Azeotrope', phonetic: '/əˈziːəˌtroʊp/', difficulty: 'advanced', category: 'Chemistry', tip: 'a-ZEE-oh-trope.', acceptableVariations: ['azeotrope'] }
];

const PronunciationLab = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [userPronunciation, setUserPronunciation] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [scores, setScores] = useState({});
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.8); // Default slower speed

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const speakWord = (word, speed = playbackSpeed) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = speed;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to get a better voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) 
                          || voices.find(v => v.lang.startsWith('en'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        alert('Speech synthesis failed. Your browser may not support it.');
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech not supported in your browser. Try Chrome or Edge.');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        if (audioBlob.size < 2000) {
          setFeedback({ success: false, message: 'Recording too short. Speak clearly for at least 2 seconds.' });
          return;
        }

        try {
          const transcription = await transcribeAudio(audioBlob);
          setUserPronunciation(transcription);
          checkPronunciation(transcription);
        } catch (error) {
          setFeedback({ success: false, message: 'Could not transcribe. Please try again.' });
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setIsRecording(true);
      setFeedback(null);
    } catch (error) {
      setFeedback({ success: false, message: 'Could not access microphone.' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const checkPronunciation = (transcription) => {
    if (!selectedWord) return;

    const userText = transcription.toLowerCase().trim();
    const targetWord = selectedWord.word.toLowerCase();
    const variations = selectedWord.acceptableVariations || [targetWord];
    const isCorrect = variations.some(v => userText.includes(v.toLowerCase()));

    let accuracy = isCorrect ? 100 : Math.round(calculateSimilarity(userText, targetWord) * 100);

    setScores(prev => ({ ...prev, [selectedWord.id]: Math.max(prev[selectedWord.id] || 0, accuracy) }));

    setFeedback({
      success: accuracy >= 70,
      accuracy,
      message: accuracy >= 90 ? 'Perfect!' : accuracy >= 70 ? 'Good job!' : accuracy >= 50 ? 'Keep trying!' : 'Practice more.'
    });
  };

  const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    if (longer.length === 0) return 1.0;
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
    for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        matrix[i][j] = str2.charAt(i - 1) === str1.charAt(j - 1) 
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
    return matrix[str2.length][str1.length];
  };

  const filteredWords = filterDifficulty === 'all' ? pronunciationWords : pronunciationWords.filter(w => w.difficulty === filterDifficulty);
  const totalWords = pronunciationWords.length;
  const practisedWords = Object.keys(scores).length;
  const averageScore = Object.values(scores).length > 0 ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Pronunciation Lab</h1>
          <p className="text-xl text-gray-300">Practice 50 technical terms with AI voice recognition</p>
        </div>

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
                <p className="text-3xl font-bold text-white">{Object.values(scores).length > 0 ? Math.max(...Object.values(scores)) : 0}%</p>
              </div>
              <CheckCircle className="w-12 h-12 text-purple-300" />
            </div>
          </Card>
        </div>

        <div className="mb-8 flex justify-center gap-4">
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button key={level} onClick={() => setFilterDifficulty(level)} className={`px-6 py-2 rounded-lg font-semibold transition-all ${filterDifficulty === level ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {!selectedWord && (
          <div className="mb-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30 text-center">
            <p className="text-blue-200 text-lg font-semibold">
              👆 Click on any word card below to practice pronunciation
            </p>
            <p className="text-blue-300 text-sm mt-2">
              Select a word to listen and record your pronunciation
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWords.map((word) => {
            const score = scores[word.id];
            const isSelected = selectedWord?.id === word.id;

            return (
              <Card key={word.id} className={`p-6 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-purple-500 bg-purple-500/10' : 'hover:bg-white/5'} ${score >= 90 ? 'border-green-500/50' : ''}`} onClick={() => setSelectedWord(word)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{word.word}</h3>
                    <p className="text-sm text-gray-400">{word.phonetic}</p>
                  </div>
                  {score !== undefined && (
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${score >= 90 ? 'bg-green-500/20 text-green-300' : score >= 70 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                      {score}%
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${word.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' : word.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                    {word.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-300">{word.category}</span>
                </div>

                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-300 mb-4">{word.tip}</p>
                    
                    <div className="flex gap-2 mb-4">
                      <button onClick={(e) => { e.stopPropagation(); speakWord(word.word); }} disabled={isSpeaking} className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        {isSpeaking ? 'Playing...' : 'Listen'}
                      </button>

                      <button onClick={(e) => { e.stopPropagation(); isRecording ? stopRecording() : startRecording(); }} className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'} text-white`}>
                        <Mic className="w-4 h-4" />
                        {isRecording ? 'Stop' : 'Record'}
                      </button>
                    </div>

                    {userPronunciation && (
                      <div className="mb-3 p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">You said:</p>
                        <p className="text-sm text-white">{userPronunciation}</p>
                      </div>
                    )}

                    {feedback && (
                      <div className={`p-3 rounded-lg flex items-start gap-2 ${feedback.success ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                        {feedback.success ? <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
                        <div>
                          {feedback.accuracy !== undefined && (
                            <p className={`font-bold mb-1 ${feedback.success ? 'text-green-300' : 'text-red-300'}`}>Accuracy: {feedback.accuracy}%</p>
                          )}
                          <p className={`text-sm ${feedback.success ? 'text-green-200' : 'text-red-200'}`}>{feedback.message}</p>
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