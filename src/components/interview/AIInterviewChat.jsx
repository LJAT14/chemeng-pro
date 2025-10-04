import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Volume2, StopCircle } from 'lucide-react';
import { transcribeAudio } from '../../services/groqWhisperService';
import { useAIChat } from '../../hooks/useAIChat';

const AIInterviewChat = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  const durationIntervalRef = useRef(null);

  const { messages, sendMessage, isLoading } = useAIChat();

  const currentQuestion = questions[currentQuestionIndex];

  // Speak question aloud
  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start recording
  const startRecording = async () => {
    console.log('=== START RECORDING ===');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });

      console.log('✓ Microphone access granted');
      streamRef.current = stream;
      audioChunksRef.current = [];

      // Determine best audio format - prefer webm over mp4
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

      console.log('Using audio format:', mimeType);

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Audio chunk received:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onstop = async () => {
        const duration = recordingDuration;
        console.log(`Stopping recording after ${duration} seconds`);

        // Stop duration tracker
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }

        if (audioChunksRef.current.length === 0) {
          console.log('No audio chunks were collected!');
          setTranscript('');
          alert('No audio recorded. Please try again and speak clearly.');
          return;
        }

        console.log('MediaRecorder stopped');
        console.log('Total chunks collected:', audioChunksRef.current.length);

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log('Creating blob with type:', mimeType);
        console.log('Final audio blob:', audioBlob.size, 'bytes, type:', audioBlob.type);

        // Check minimum duration (2 seconds)
        if (duration < 2) {
          console.log('Recording too short:', duration, 'seconds');
          alert('Recording too short. Please hold the button and speak for at least 2 seconds.');
          setTranscript('');
          return;
        }

        // Check minimum file size
        if (audioBlob.size < 2000) {
          console.log('Audio blob too small:', audioBlob.size, 'bytes');
          alert('No speech detected. Please speak louder and try again.');
          setTranscript('');
          return;
        }

        // Transcribe
        try {
          console.log('=== PREPARING AUDIO FOR GROQ ===');
          const transcribedText = await transcribeAudio(audioBlob);
          console.log('=== TRANSCRIPTION RESULT ===');
          console.log('Text:', transcribedText);
          setTranscript(transcribedText);
        } catch (error) {
          console.error('Transcription error:', error);
          alert(`Transcription failed: ${error.message}`);
          setTranscript('');
        }

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      
      // Start recording time tracker
      recordingStartTimeRef.current = Date.now();
      setRecordingDuration(0);
      
      durationIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
        setRecordingDuration(elapsed);
      }, 100);

      setIsRecording(true);
      console.log('Recording started');

    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Could not access microphone. Please grant permission and try again.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Send answer to AI
  const handleSendAnswer = async () => {
    if (!transcript.trim()) {
      alert('Please record your answer first.');
      return;
    }

    const questionText = currentQuestion.question.en;
    await sendMessage(`Question: ${questionText}\n\nMy Answer: ${transcript}`);
    
    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript('');
    } else {
      alert('Interview complete! Great job!');
    }
  };

  // Cleanup on unmount
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
      {/* Question Card */}
      <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <button
            onClick={() => speakQuestion(currentQuestion.question.en)}
            disabled={isSpeaking}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg flex items-center gap-2 text-sm"
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
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={isLoading}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-3 ${
              isRecording
                ? 'bg-red-600 scale-95 shadow-lg shadow-red-500/50'
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white disabled:bg-gray-600 disabled:cursor-not-allowed`}
            style={{ touchAction: 'none' }}
          >
            {isRecording ? (
              <>
                <StopCircle className="w-6 h-6 animate-pulse" />
                <span>Release to Stop ({recordingDuration}s)</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" />
                <span>Hold to Record</span>
              </>
            )}
          </button>

          {transcript && !isRecording && (
            <button
              onClick={handleSendAnswer}
              disabled={isLoading}
              className="px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg flex items-center gap-2 font-semibold"
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
              Speak clearly. Release button when done.
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
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <h4 className="text-green-200 font-semibold mb-2">AI Feedback:</h4>
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
    </div>
  );
};

export default AIInterviewChat;