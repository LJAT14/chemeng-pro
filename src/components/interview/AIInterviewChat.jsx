import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Volume2, StopCircle, TrendingUp } from 'lucide-react';
import { transcribeAudio } from '../../services/groqWhisperService';
import { useAIChat } from '../../hooks/useAIChat';
import { speakText } from '../../services/elevenLabsTTS';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

const AIInterviewChat = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interviewAnswers, setInterviewAnswers] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const durationIntervalRef = useRef(null);

  const { messages, sendMessage, isLoading } = useAIChat();

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize session when component mounts
  useEffect(() => {
    const initSession = async () => {
      if (isSupabaseConfigured()) {
        // Create new interview session
        const { data, error } = await supabase
          .from('interview_sessions')
          .insert([
            {
              started_at: new Date().toISOString(),
              total_questions: questions.length,
              status: 'in_progress'
            }
          ])
          .select()
          .single();

        if (!error && data) {
          setSessionId(data.id);
        }
      }
    };

    initSession();
  }, []);

  // Speak question aloud
  const speakQuestion = async (text) => {
    setIsSpeaking(true);
    try {
      await speakText(text);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
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

      let mimeType = 'audio/webm;codecs=opus';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const actualDuration = recordingStartTimeRef.current 
          ? Math.floor((Date.now() - recordingStartTimeRef.current) / 1000)
          : 0;

        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }

        if (audioChunksRef.current.length === 0) {
          alert('No audio recorded. Please try again.');
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        if (actualDuration < 2) {
          alert('Recording too short. Please record for at least 2 seconds.');
          setTranscript('');
          return;
        }

        if (audioBlob.size < 2000) {
          alert('No speech detected. Please speak louder.');
          setTranscript('');
          return;
        }

        try {
          const transcribedText = await transcribeAudio(audioBlob);
          setTranscript(transcribedText);
        } catch (error) {
          console.error('Transcription error:', error);
          alert(`Transcription failed: ${error.message}`);
          setTranscript('');
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      
      recordingStartTimeRef.current = Date.now();
      setRecordingDuration(0);
      
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
        setRecordingDuration(elapsed);
      }, 100);

      setIsRecording(true);

    } catch (error) {
      console.error('Microphone error:', error);
      alert('Could not access microphone. Please grant permission.');
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

  // Save answer to database
  const saveAnswerToDatabase = async (questionText, answerText, aiFeedback) => {
    if (!isSupabaseConfigured() || !sessionId) return;

    try {
      await supabase.from('interview_answers').insert([
        {
          session_id: sessionId,
          question_number: currentQuestionIndex + 1,
          question_text: questionText,
          user_answer: answerText,
          ai_feedback: aiFeedback,
          answer_length: answerText.length,
          word_count: answerText.split(' ').length,
          answered_at: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Failed to save answer:', error);
    }
  };

  // Complete interview session
  const completeSession = async () => {
    if (!isSupabaseConfigured() || !sessionId) return;

    try {
      await supabase
        .from('interview_sessions')
        .update({
          completed_at: new Date().toISOString(),
          status: 'completed',
          questions_answered: interviewAnswers.length
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  };

  const handleSendAnswer = async () => {
    if (!transcript.trim()) {
      alert('Please record your answer first.');
      return;
    }

    const questionText = currentQuestion.question.en;
    const aiResponse = await sendMessage(`Question: ${questionText}\n\nMy Answer: ${transcript}`);
    
    // Save to database
    await saveAnswerToDatabase(questionText, transcript, aiResponse);

    // Save to local state for display
    setInterviewAnswers(prev => [...prev, {
      question: questionText,
      answer: transcript,
      feedback: aiResponse
    }]);

    // Speak feedback
    if (aiResponse) {
      try {
        await speakText(aiResponse);
      } catch (error) {
        console.error('Failed to speak feedback:', error);
      }
    }
    
    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript('');
    } else {
      await completeSession();
      alert('Interview complete! Check your performance dashboard.');
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!currentQuestion) {
    return (
      <div className="text-white text-center p-8">
        <h2 className="text-2xl font-bold mb-4">No questions available</h2>
        <p>Please select an interview scenario to begin.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-purple-300 text-sm">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">
            Question {currentQuestionIndex + 1}
          </h3>
          <button
            onClick={() => speakQuestion(currentQuestion.question.en)}
            disabled={isSpeaking}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg flex items-center gap-2 text-sm transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            {isSpeaking ? 'Speaking...' : 'Listen'}
          </button>
        </div>
        <p className="text-white text-xl leading-relaxed">
          {currentQuestion.question.en}
        </p>
      </div>

      {/* Recording Controls */}
      <div className="mb-6">
        <div className="flex gap-3 mb-4">
          <button
            onClick={toggleRecording}
            disabled={isLoading}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-3 ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white disabled:bg-gray-600 disabled:cursor-not-allowed`}
          >
            {isRecording ? (
              <>
                <StopCircle className="w-6 h-6" />
                <span>Stop Recording ({recordingDuration}s)</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" />
                <span>Start Recording</span>
              </>
            )}
          </button>

          {transcript && !isRecording && (
            <button
              onClick={handleSendAnswer}
              disabled={isLoading}
              className="px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg flex items-center gap-2 font-semibold transition-colors"
            >
              <Send className="w-5 h-5" />
              Send Answer
            </button>
          )}
        </div>

        {isRecording && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-200 font-semibold">
                Recording... {recordingDuration} seconds
              </span>
            </div>
            <p className="text-red-200/70 text-sm mt-2">
              Speak clearly. Click "Stop Recording" when done.
            </p>
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <h4 className="text-blue-200 font-semibold mb-2">Your Answer:</h4>
          <p className="text-white leading-relaxed">{transcript}</p>
          <p className="text-blue-200/60 text-sm mt-2">
            {transcript.split(' ').length} words, {transcript.length} characters
          </p>
        </div>
      )}

      {/* AI Feedback */}
      {messages.length > 0 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
          <h4 className="text-green-200 font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            AI Feedback:
          </h4>
          <div className="text-white leading-relaxed">
            {messages[messages.length - 1].content}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-300 mt-2">AI is analyzing your answer...</p>
        </div>
      )}

      {/* Session Info */}
      {isSupabaseConfigured() && sessionId && (
        <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
          <p className="text-gray-400 text-xs">
            Session ID: {sessionId} • Answers saved: {interviewAnswers.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIInterviewChat;