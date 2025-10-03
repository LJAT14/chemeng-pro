import React, { useState } from 'react';
import { Mic, Volume2, CheckCircle, XCircle } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Badge from '../shared/Badge';
import useVoiceRecognition from '../../hooks/useVoiceRecognition';
import { calculatePronunciationScore, provideFeedback } from '../../utils/pronunciationAnalysis';

const PronunciationQuiz = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceRecognition();

  const currentWord = words[currentIndex];

  const handleRecord = () => {
    isListening ? stopListening() : startListening();
  };

  const checkPronunciation = () => {
    const pronunciationScore = calculatePronunciationScore(transcript, currentWord.word);
    setScore(pronunciationScore);
    setFeedback(provideFeedback(pronunciationScore));
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % words.length);
    setScore(null);
    setFeedback(null);
  };

  if (!isSupported) {
    return <Card><p className="text-red-400">Speech recognition not supported. Use Chrome or Edge.</p></Card>;
  }

  return (
    <Card hover={false}>
      <div className="space-y-6">
        <div className="text-center">
          <Badge variant={currentWord.difficulty}>{currentWord.difficulty}</Badge>
          <h2 className="text-4xl font-bold mt-4 mb-2">{currentWord.word}</h2>
          <p className="text-slate-400 text-xl mb-4">{currentWord.ipa}</p>
          
          <button className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 rounded-lg">
            <Volume2 className="w-5 h-5" />
            <span>Listen</span>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleRecord}
            className={'w-32 h-32 rounded-full bg-gradient-to-br flex items-center justify-center mx-auto ' + (isListening ? 'from-red-500 to-pink-500 animate-pulse' : 'from-purple-500 to-blue-500')}
          >
            <Mic className="w-12 h-12" />
          </button>
          <p className="text-sm text-slate-400 mt-4">
            {isListening ? 'Listening...' : 'Click to record'}
          </p>
        </div>

        {transcript && (
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-sm text-slate-400 mb-1">You said:</p>
            <p className="text-xl font-semibold">{transcript}</p>
          </div>
        )}

        {score !== null && feedback && (
          <div className={'p-6 rounded-xl border-2 ' + (feedback.color === 'green' ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Score: {score}%</h3>
              {score >= 75 ? <CheckCircle className="w-8 h-8 text-green-400" /> : <XCircle className="w-8 h-8 text-red-400" />}
            </div>
            <p className="text-lg">{feedback.message}</p>
          </div>
        )}

        <div className="flex space-x-3">
          {transcript && !score && <Button onClick={checkPronunciation}>Check</Button>}
          {score !== null && <Button onClick={handleNext}>Next Word</Button>}
        </div>
      </div>
    </Card>
  );
};

export default PronunciationQuiz;