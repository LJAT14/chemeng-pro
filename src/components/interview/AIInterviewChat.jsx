import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import Button from '../shared/Button';
import useAIChat from '../../hooks/useAIChat';
import groqWhisperService from '../../services/groqWhisperService';
import elevenLabsTTS from '../../services/elevenLabsTTS';

const AIInterviewChat = ({ questions }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // NEW: AI speaking state
  const [autoSpeak, setAutoSpeak] = useState(true); // NEW: auto-speak questions
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);
  const { messages, sendMessage, startInterview, isLoading } = useAIChat(questions);

  // Auto-speak new AI messages
  useEffect(() => {
    if (!autoSpeak || messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    
    // Only speak AI messages, not user messages
    if (lastMessage.role === 'assistant' && !isSpeaking) {
      speakText(lastMessage.content);
    }
  }, [messages, autoSpeak]);

  const speakText = (text) => {
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to use a good English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft'))
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Check if browser supports audio recording
  const isAudioSupported = typeof navigator !== 'undefined' && 
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  const handleRecordButtonPress = async () => {
    if (isCooldown) {
      console.log('Still in cooldown period, ignoring press');
      return;
    }
    setButtonPressed(true);
    await startRecording();
  };

  const handleRecordButtonRelease = () => {
    setButtonPressed(false);
    stopRecording();
  };

  const startRecording = async () => {
    if (isRecording) return; // Already recording
    
    try {
      console.log('=== START RECORDING ===');
      
      // Request high-quality audio
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      console.log('✓ Microphone access granted');
      
      // Use WAV format with PCM - most universally supported
      // But first try MP4 as it's what Groq prefers
      let mimeType;
      const supportedTypes = [
        'audio/mp4',
        'audio/mpeg',
        'audio/webm',
        'audio/ogg',
        ''  // Default - let browser decide
      ];
      
      for (const type of supportedTypes) {
        if (type === '' || MediaRecorder.isTypeSupported(type)) {
          mimeType = type || undefined;
          break;
        }
      }
      
      console.log('Using audio format:', mimeType || 'browser default');
      
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { 
        mimeType,
        audioBitsPerSecond: 128000
      } : {
        audioBitsPerSecond: 128000
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Audio chunk received:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('MediaRecorder stopped');
        console.log('Total chunks collected:', audioChunksRef.current.length);
        
        if (audioChunksRef.current.length === 0) {
          console.error('No audio chunks were collected!');
          stream.getTracks().forEach(track => track.stop());
          alert('Recording failed - no audio data collected. Your browser may not support audio recording. Try using Chrome or Edge.');
          return;
        }
        
        // Get the actual mime type used
        const actualMimeType = mimeType || mediaRecorder.mimeType;
        console.log('Creating blob with type:', actualMimeType);
        
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMimeType });
        console.log('Final audio blob:', audioBlob.size, 'bytes, type:', audioBlob.type);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Check duration - if too short, likely just noise/silence
        if (recordingTime < 1) {
          console.warn('Recording too short:', recordingTime, 'seconds');
          alert('Recording too short. Please hold the button and speak for at least 2 seconds.');
          setIsCooldown(false); // Release cooldown immediately
          return;
        }
        
        // Only transcribe if we have actual audio data
        if (audioBlob.size < 2000) { // Increased minimum size
          console.error('Audio blob too small:', audioBlob.size, 'bytes');
          alert('No speech detected. Please speak clearly into your microphone.');
          setIsCooldown(false); // Release cooldown immediately
          return;
        }
        
        // Transcribe using Groq Whisper
        await transcribeAudio(audioBlob);
      };

      // Record in chunks for better reliability
      mediaRecorder.start(1000); // Capture data every 1 second
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Could not access microphone. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording after', recordingTime, 'seconds');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setIsTranscribing(true);
    setIsCooldown(true); // Start cooldown
    
    try {
      console.log('=== TRANSCRIPTION START ===');
      console.log('Audio size:', audioBlob.size, 'bytes');
      console.log('Audio type:', audioBlob.type);
      console.log('Recording duration was:', recordingTime, 'seconds');
      
      const transcription = await groqWhisperService.transcribeAudio(audioBlob);
      
      console.log('=== TRANSCRIPTION RESULT ===');
      console.log('Text:', transcription);
      console.log('Length:', transcription.length, 'characters');
      
      if (transcription && transcription.trim().length > 0) {
        setInputMessage(transcription);
      } else {
        console.error('Empty transcription received');
        alert('No speech detected. Please speak clearly and try again.');
      }
    } catch (error) {
      console.error('=== TRANSCRIPTION ERROR ===');
      console.error(error);
      alert(`Transcription failed: ${error.message}. Please try again.`);
    } finally {
      setIsTranscribing(false);
      
      // Release cooldown after 3 seconds
      setTimeout(() => {
        setIsCooldown(false);
        console.log('Cooldown released - ready to record again');
      }, 3000);
    }
  };

  const handleSend = async () => {
    const textToSend = inputMessage.trim();
    
    if (!textToSend || isLoading || isTranscribing) {
      return;
    }

    await sendMessage(textToSend);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">AI Interview Simulator</h2>
        <p className="text-slate-400 mb-8">Practice with voice or text - Get real AI feedback from Groq</p>
        
        {isAudioSupported && (
          <div className="flex flex-col items-center space-y-4 mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceMode}
                onChange={(e) => setVoiceMode(e.target.checked)}
                className="w-4 h-4 accent-purple-500"
              />
              <span className="text-slate-300">Enable Voice Mode</span>
            </label>
            
            {voiceMode && (
              <div className="text-xs text-slate-500 space-y-1 text-center">
                <p>✓ Voice recording ready (works on mobile!)</p>
                <p>Hold mic button to record, release to transcribe</p>
              </div>
            )}
          </div>
        )}
        
        {!isAudioSupported && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg max-w-md mx-auto">
            <p className="text-yellow-400 text-sm font-semibold mb-2">Voice Not Available</p>
            <p className="text-slate-300 text-sm">
              Your browser doesn't support audio recording. You can still type your answers!
            </p>
          </div>
        )}
        
        <Button onClick={startInterview}>Start Interview</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {voiceMode && (
        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-3">
            <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-green-400 animate-pulse' : 'text-purple-400'}`} />
            <div>
              <span className="text-sm font-medium block">Voice Mode Active</span>
              {isSpeaking && <span className="text-xs text-green-400">🔊 AI Speaking...</span>}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-xs font-medium transition-colors"
              >
                Stop Speaking
              </button>
            )}
            <label className="text-xs text-slate-400 flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="w-3 h-3 accent-purple-500"
              />
              <span>Auto-speak</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={voiceMode}
                onChange={(e) => setVoiceMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
        </div>
      )}

      <div className="flex flex-col h-[600px] bg-slate-900/50 rounded-2xl border border-slate-800">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 px-4 py-3 bg-slate-800 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-slate-400">AI analyzing...</span>
              </div>
            </div>
          )}
          
          {isTranscribing && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-2xl">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-sm text-blue-400">Transcribing your speech...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex space-x-3 items-end">
            <textarea
              id="interview-answer"
              name="answer"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isRecording ? "🎤 Recording your voice..." : isTranscribing ? "⏳ Transcribing..." : "Type your answer or hold mic button to speak..."}
              className={`flex-1 px-4 py-3 bg-slate-800 border rounded-lg focus:outline-none focus:border-purple-500 resize-none transition-all ${
                isRecording ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-slate-700'
              }`}
              rows={3}
              disabled={isLoading || isTranscribing || isRecording}
              autoComplete="off"
            />
            
            {voiceMode && isAudioSupported && (
              <button
                onMouseDown={handleRecordButtonPress}
                onMouseUp={handleRecordButtonRelease}
                onMouseLeave={handleRecordButtonRelease}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleRecordButtonPress();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleRecordButtonRelease();
                }}
                onTouchCancel={handleRecordButtonRelease}
                disabled={isLoading || isTranscribing || isCooldown}
                className={`px-6 py-6 rounded-xl transition-all flex flex-col items-center justify-center min-w-[80px] ${
                  isCooldown
                    ? 'bg-slate-700 cursor-wait'
                    : buttonPressed || isRecording
                    ? 'bg-red-600 shadow-2xl shadow-red-500/50 scale-95' 
                    : 'bg-gradient-to-br from-purple-500 to-purple-700 hover:shadow-xl hover:scale-105'
                } disabled:opacity-50`}
                style={{ touchAction: 'none' }}
              >
                {isCooldown ? (
                  <>
                    <Loader2 className="w-7 h-7 mb-1 animate-spin" />
                    <span className="text-xs font-bold">WAIT</span>
                  </>
                ) : isRecording ? (
                  <>
                    <MicOff className="w-7 h-7 mb-1" />
                    <span className="text-xs font-bold">RELEASE</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-7 h-7 mb-1" />
                    <span className="text-xs font-bold">HOLD</span>
                  </>
                )}
              </button>
            )}
            
            <button 
              onClick={handleSend}
              disabled={!inputMessage.trim() || isLoading || isTranscribing || isRecording}
              className="px-6 py-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-105 transition-all"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          
          {isRecording && (
            <div className="mt-3 text-center space-y-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-1 h-8 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-12 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-10 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-14 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-1 h-16 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <div className="w-1 h-12 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-1 h-10 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                </div>
              </div>
              <div>
                <p className="text-3xl text-red-400 font-bold tabular-nums">
                  {formatTime(recordingTime)}
                </p>
                <p className="text-sm text-red-300 font-medium mt-1">
                  🎤 RECORDING
                </p>
              </div>
              <p className="text-xs text-slate-300">
                Keep speaking clearly... Release button when finished
              </p>
            </div>
          )}
          
          {isTranscribing && (
            <div className="mt-3 text-center p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                <p className="text-blue-400 font-semibold">Processing Your Speech...</p>
              </div>
              <p className="text-xs text-slate-400">
                Groq Whisper AI is transcribing your audio
              </p>
            </div>
          )}
          
          {isCooldown && !isTranscribing && (
            <div className="mt-3 text-center p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
              <p className="text-sm text-slate-400">
                ⏳ Preparing microphone... Ready in 3 seconds
              </p>
            </div>
          )}
          
          {inputMessage && !isRecording && !isTranscribing && !isCooldown && (
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                {inputMessage.split(' ').filter(w => w).length} words • {inputMessage.length} characters
              </p>
              <p className="text-xs text-green-400 font-medium">
                ✓ Ready to send
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInterviewChat;