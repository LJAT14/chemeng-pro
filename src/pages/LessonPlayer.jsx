 import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, CheckCircle, BookOpen, Award } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useToast } from '../components/Toast';

// This will be replaced with actual lesson data
const getLessonData = (id) => {
  return {
    id,
    title: 'Introducing Yourself',
    level: 'A1',
    audioUrl: '/lessons/sample.mp3', // You'll upload these
    transcript: `Hello, my name is Maria. I'm from Brazil and I live in São Paulo. 
I'm 25 years old and I work as a teacher. I teach English at a language school.
In my free time, I like to read books and watch movies. I also enjoy spending time with my family and friends.
Nice to meet you!`,
    vocabulary: [
      { word: 'introduce', definition: 'to tell someone your name', example: 'Let me introduce myself.' },
      { word: 'live', definition: 'to have your home in a place', example: 'I live in São Paulo.' },
      { word: 'work', definition: 'to have a job', example: 'I work as a teacher.' },
      { word: 'free time', definition: 'time when you are not working', example: 'I read in my free time.' },
    ],
    questions: [
      {
        question: 'Where is Maria from?',
        options: ['Argentina', 'Brazil', 'Mexico', 'Spain'],
        correct: 1
      },
      {
        question: 'What does Maria do?',
        options: ['Student', 'Teacher', 'Doctor', 'Engineer'],
        correct: 1
      },
      {
        question: 'What does Maria like to do in her free time?',
        options: ['Play sports', 'Cook', 'Read books', 'Dance'],
        correct: 2
      },
    ]
  };
};

const LessonPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const audioRef = useRef(null);
  
  const [lesson] = useState(getLessonData(id));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const changeSpeed = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleAnswer = (questionIdx, answerIdx) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIdx] = answerIdx;
    setUserAnswers(newAnswers);
  };

  const submitAnswers = () => {
    setShowResults(true);
    const correct = lesson.questions.filter((q, idx) => userAnswers[idx] === q.correct).length;
    toast.success(`You got ${correct} out of ${lesson.questions.length} correct!`);
  };

  const calculateScore = () => {
    return lesson.questions.filter((q, idx) => userAnswers[idx] === q.correct).length;
  };

  return (
    <PageWrapper title={lesson.title} subtitle={`Level: ${lesson.level}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Audio Player */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-white font-semibold text-lg mb-4">Listen to the Audio</h3>
          
          <audio
            ref={audioRef}
            src={lesson.audioUrl}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => skip(-5)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <SkipBack className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={togglePlay}
              className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full transition-all"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={() => skip(5)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <SkipForward className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm mr-2">Speed:</span>
            {[0.75, 1, 1.25, 1.5].map(rate => (
              <button
                key={rate}
                onClick={() => changeSpeed(rate)}
                className={`px-3 py-1 rounded transition-all text-sm ${
                  playbackRate === rate
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="text-center text-gray-400 text-sm">
            {Math.floor(currentTime)}s / {Math.floor(duration)}s
          </div>
        </div>

        {/* Transcript */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold text-lg">Transcript</h3>
          </div>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">{lesson.transcript}</p>
        </div>

        {/* Vocabulary */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-white font-semibold text-lg mb-4">Key Vocabulary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.vocabulary.map((item, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-4">
                <h4 className="text-purple-400 font-semibold mb-1">{item.word}</h4>
                <p className="text-gray-400 text-sm mb-2">{item.definition}</p>
                <p className="text-gray-500 text-xs italic">"{item.example}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-white font-semibold text-lg mb-4">Comprehension Questions</h3>
          
          {!showResults ? (
            <div className="space-y-6">
              {lesson.questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-white/5 rounded-lg p-4">
                  <p className="text-white font-medium mb-3">{qIdx + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswer(qIdx, oIdx)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          userAnswers[qIdx] === oIdx
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}. {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={submitAnswers}
                disabled={userAnswers.length !== lesson.questions.length}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all"
              >
                Submit Answers
              </button>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <p className="text-3xl font-bold text-white">
                  {calculateScore()} / {lesson.questions.length}
                </p>
              </div>

              <div className="space-y-4">
                {lesson.questions.map((q, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-4">
                    <p className="text-white mb-2">{idx + 1}. {q.question}</p>
                    <div className="flex items-center gap-2">
                      {userAnswers[idx] === q.correct ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className={userAnswers[idx] === q.correct ? 'text-green-400' : 'text-red-400'}>
                        Your answer: {q.options[userAnswers[idx]]}
                      </span>
                    </div>
                    {userAnswers[idx] !== q.correct && (
                      <p className="text-green-400 text-sm mt-1">
                        Correct: {q.options[q.correct]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/library')}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all"
              >
                Back to Library
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default LessonPlayer;