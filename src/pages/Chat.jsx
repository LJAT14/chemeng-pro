import { useState, useRef, useEffect } from 'react';
import { Send, Loader, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Chat() {
  const { user, isGuest } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: isGuest 
        ? 'Hello! I\'m your AI English tutor. I can help you with grammar, vocabulary, pronunciation, and practice conversations. What would you like to learn today? 😊\n\n*Note: As a guest, your conversations won\'t be saved. Create an account to save your learning history!*'
        : 'Hello! I\'m your AI English tutor. I can help you with grammar, vocabulary, pronunciation, and practice conversations. What would you like to learn today? 😊'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Use Claude API via Anthropic endpoint
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a friendly and patient English tutor for Portuguese speakers. Help with grammar, vocabulary, pronunciation, and conversation practice. Keep responses concise and encouraging. Use simple language and provide examples. Always be supportive and motivating.',
          messages: [
            ...messages.filter(m => m.role !== 'system').map(m => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content
            })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiResponse = data.content[0].text;

      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      
    } catch (error) {
      console.error('Chat error:', error);
      showToast('Failed to get AI response. Please try again.', 'error');
      
      // Add error message
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try asking your question again! 😊' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PageWrapper
      title="🤖 AI English Tutor"
      subtitle={isGuest ? "Practice English with AI - Guest Mode" : "Your personal AI English teacher"}
    >
      {/* Guest Notice */}
      {isGuest && (
        <div className="mb-6 bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-200 text-sm">
            💡 <strong>Guest Mode:</strong> Your conversations won't be saved. Create a free account to save your learning history!
          </p>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden flex flex-col h-[calc(100vh-300px)] min-h-[500px]">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-purple-600' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}>
                {message.role === 'user' ? (
                  <UserIcon className="w-6 h-6 text-white" />
                ) : (
                  <Bot className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex-1 max-w-[80%] ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}>
                <div className={`inline-block p-4 rounded-xl ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-slate-200'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-slate-300">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-4 bg-white/5">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about English..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows="2"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-slate-400 text-xs mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setInput("Can you help me practice job interview questions?")}
          className="p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-left transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-white">Interview Practice</span>
          </div>
          <p className="text-slate-400 text-sm">Practice common job interview questions</p>
        </button>

        <button
          onClick={() => setInput("I need help with English grammar. Can you explain present perfect tense?")}
          className="p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-left transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">Grammar Help</span>
          </div>
          <p className="text-slate-400 text-sm">Learn grammar rules and usage</p>
        </button>

        <button
          onClick={() => setInput("Can we have a casual conversation in English?")}
          className="p-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-left transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-white">Conversation</span>
          </div>
          <p className="text-slate-400 text-sm">Practice speaking naturally</p>
        </button>
      </div>
    </PageWrapper>
  );
}