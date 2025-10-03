import fs from 'fs';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const updateInterview = () => {
  log('\n🚀 Updating AIInterviewChat component...', 'cyan');

  const updatedComponent = `import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Volume2, MicOff } from 'lucide-react';
import MessageBubble from './MessageBubble';
import Button from '../shared/Button';
import useAIChat from '../../hooks/useAIChat';
import useAdvancedVoiceRecognition from '../../hooks/useAdvancedVoiceRecognition';

const AIInterviewChat = ({ questions }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { messages, sendMessage, startInterview, isLoading } = useAIChat(questions);
  const { 
    isListening, 
    fullTranscript, 
    startListening, 
    stopListening, 
    resetTranscript,
    isSupported 
  } = useAdvancedVoiceRecognition();

  // Update input from voice
  useEffect(() => {
    if (isListening && fullTranscript) {
      setInputMessage(fullTranscript);
    }
  }, [fullTranscript, isListening]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speak AI responses in voice mode
  useEffect(() => {
    if (voiceMode && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !isLoading) {
        speakMessage(lastMessage.content);
      }
    }
  }, [messages, voiceMode, isLoading]);

  const speakMessage = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleStartVoice = () => {
    resetTranscript();
    setInputMessage('');
    startListening();
  };

  const handleStopVoice = () => {
    stopListening();
  };

  const handleSend = async () => {
    if (inputMessage.trim() && !isLoading) {
      await sendMessage(inputMessage);
      setInputMessage('');
      resetTranscript();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // BEFORE INTERVIEW STARTS
  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">AI Interview Simulator</h2>
        <p className="text-slate-400 mb-8">Practice with voice or text - Get real AI feedback</p>
        
        {!isSupported && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 max-w-md mx-auto">
            <p className="text-yellow-400 text-sm">
              Voice recognition not supported. Use Chrome or Edge for best experience.
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-4 mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={voiceMode}
              onChange={(e) => setVoiceMode(e.target.checked)}
              className="w-4 h-4 accent-purple-500"
              disabled={!isSupported}
            />
            <span className="text-slate-300">Enable Voice Mode</span>
          </label>
        </div>

        <Button onClick={startInterview}>Start Interview</Button>
        
        {voiceMode && (
          <p className="text-xs text-slate-500 mt-4">
            Voice mode: Questions will be read aloud and you can speak your answers
          </p>
        )}
      </div>
    );
  }

  // DURING INTERVIEW
  return (
    <div className="space-y-4">
      {/* Voice Mode Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium">Voice Mode</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={voiceMode}
            onChange={(e) => setVoiceMode(e.target.checked)}
            className="sr-only peer"
            disabled={!isSupported}
          />
          <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
        </label>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col h-[500px] bg-slate-900/50 rounded-2xl border border-slate-800">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 px-4 py-3 bg-slate-800 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-slate-400">AI is thinking...</span>
              </div>
            </div>
          )}

          {/* Speaking Indicator */}
          {isSpeaking && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 rounded-lg">
                <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-sm text-blue-400">Speaking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex space-x-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening... Keep speaking!" : voiceMode ? "Type or click mic to speak..." : "Type your answer..."}
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 text-sm resize-none"
              disabled={isLoading}
              rows={3}
            />
            
            {voiceMode && (
              <button
                onClick={isListening ? handleStopVoice : handleStartVoice}
                disabled={isLoading}
                className={'px-6 py-3 rounded-lg transition-all disabled:opacity-50 font-medium ' + (isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-purple-500 hover:bg-purple-600')}
                title={isListening ? 'Stop recording' : 'Start recording'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
            
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {isListening && (
            <div className="mt-2 text-center space-y-1">
              <p className="text-sm text-purple-400 animate-pulse">
                Recording... Speak freely! Pauses are OK.
              </p>
              <p className="text-xs text-slate-500">
                Click the red button when finished speaking
              </p>
            </div>
          )}

          {inputMessage && !isListening && (
            <div className="mt-2">
              <p className="text-xs text-slate-500">
                {inputMessage.split(' ').filter(w => w).length} words • {inputMessage.length} characters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInterviewChat;`;

  fs.writeFileSync('src/components/interview/AIInterviewChat.jsx', updatedComponent);
  log('✓ Updated: src/components/interview/AIInterviewChat.jsx', 'blue');
  
  log('\n✅ AIInterviewChat updated successfully!', 'green');
  log('\nKey improvements:', 'cyan');
  log('  - Uses new useAdvancedVoiceRecognition hook', 'blue');
  log('  - Changed input to textarea for multi-line support', 'blue');
  log('  - Shows word/character count', 'blue');
  log('  - Better feedback during recording', 'blue');
  log('  - Handles pauses naturally (no more stopping!)', 'blue');
  
  log('\n🎯 This fixes your voice recognition issues!', 'green');
};

updateInterview();