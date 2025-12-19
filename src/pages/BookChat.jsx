// src/pages/BookChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, Send, Book, ArrowLeft, 
  Loader, Volume2, Copy, RotateCcw 
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { BookChatbot } from '../services/bookChatbot';
import toast from 'react-hot-toast';

const BookChat = () => {
  const { bookId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatbotRef = useRef(null);

  useEffect(() => {
    loadBook();
    loadChatHistory();
    chatbotRef.current = new BookChatbot(bookId, user.id);
  }, [bookId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadBook = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();
      
      if (error) throw error;
      setBook(data);
    } catch (error) {
      console.error('Error loading book:', error);
      toast.error('Book not found');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('book_chat_history')
        .select('*')
        .eq('book_id', bookId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setMessages(data);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const userMessage = input;
    setInput('');
    
    // Add user message to UI immediately
    const tempUserMsg = {
      id: Date.now(),
      message: userMessage,
      role: 'user',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setSending(true);

    try {
      const response = await chatbotRef.current.chat(userMessage);
      
      // Add assistant response
      const assistantMsg = {
        id: Date.now() + 1,
        message: response.message,
        role: 'assistant',
        sources: response.sources,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMsg]);
      
      // Speak response (optional)
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(response.message);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        // window.speechSynthesis.speak(utterance); // Uncomment to auto-speak
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response');
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        message: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        created_at: new Date().toISOString()
      }]);
    } finally {
      setSending(false);
    }
  };

  const speakMessage = (text) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      toast.success('Speaking...');
    } else {
      toast.error('Text-to-speech not supported');
    }
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const clearHistory = async () => {
    if (!confirm('Clear all chat history with this book?')) return;

    try {
      await supabase
        .from('book_chat_history')
        .delete()
        .eq('book_id', bookId)
        .eq('user_id', user.id);
      
      setMessages([]);
      toast.success('History cleared');
    } catch (error) {
      console.error('Clear error:', error);
      toast.error('Failed to clear history');
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh' 
        }}>
          <Loader className="spinner" size={48} />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: 'calc(100vh - 80px)',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--space-lg)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-lg)',
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--space-lg)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
            <button
              onClick={() => navigate('/books')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-secondary)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowLeft size={20} />
            </button>

            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--primary-50)',
              color: 'var(--primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Book size={24} />
            </div>

            <div>
              <h1 style={{ 
                fontSize: 'var(--text-2xl)', 
                fontWeight: 'var(--font-bold)',
                marginBottom: 'var(--space-xs)'
              }}>
                {book?.title}
              </h1>
              <p style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--text-secondary)' 
              }}>
                Ask me anything about this book
              </p>
            </div>
          </div>

          <button
            onClick={clearHistory}
            style={{
              padding: 'var(--space-md) var(--space-lg)',
              background: 'white',
              color: 'var(--text-secondary)',
              border: '2px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)'
            }}
          >
            <RotateCcw size={16} />
            Clear Chat
          </button>
        </div>

        {/* Chat Container */}
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-lg)'
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-3xl)',
                color: 'var(--text-tertiary)'
              }}>
                <MessageSquare size={64} style={{ margin: '0 auto var(--space-lg)' }} />
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-sm)' }}>
                  Start a conversation
                </h3>
                <p style={{ fontSize: 'var(--text-sm)' }}>
                  Ask questions about the book's content, themes, or characters
                </p>
                
                {/* Suggested Questions */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-sm)',
                  marginTop: 'var(--space-2xl)',
                  maxWidth: '600px',
                  margin: 'var(--space-2xl) auto 0'
                }}>
                  {[
                    'What is the main theme of this book?',
                    'Summarize chapter 1',
                    'Who are the main characters?',
                    'What are the key takeaways?'
                  ].map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(question);
                        setTimeout(sendMessage, 100);
                      }}
                      style={{
                        padding: 'var(--space-md)',
                        background: 'var(--primary-50)',
                        border: '2px solid var(--primary-200)',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        color: 'var(--primary-700)',
                        fontSize: 'var(--text-sm)',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--primary-100)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--primary-50)';
                      }}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-sm)'
                    }}>
                      <div style={{
                        padding: 'var(--space-lg)',
                        borderRadius: 'var(--radius-xl)',
                        background: msg.role === 'user' 
                          ? 'var(--primary-500)' 
                          : 'var(--bg-secondary)',
                        color: msg.role === 'user' 
                          ? 'white' 
                          : 'var(--text-primary)',
                        fontSize: 'var(--text-base)',
                        lineHeight: 1.6
                      }}>
                        {msg.message}
                      </div>

                      {/* Sources */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-tertiary)',
                          padding: '0 var(--space-md)',
                          display: 'flex',
                          gap: 'var(--space-sm)',
                          flexWrap: 'wrap'
                        }}>
                          <span>📚 Sources:</span>
                          {msg.sources.map((source, idx) => (
                            <span key={idx} style={{
                              padding: '0.25rem 0.5rem',
                              background: 'var(--gray-100)',
                              borderRadius: 'var(--radius-sm)'
                            }}>
                              {source.chapter} (p.{source.page})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Message Actions */}
                      {msg.role === 'assistant' && (
                        <div style={{
                          display: 'flex',
                          gap: 'var(--space-sm)',
                          padding: '0 var(--space-md)'
                        }}>
                          <button
                            onClick={() => speakMessage(msg.message)}
                            style={{
                              padding: 'var(--space-xs) var(--space-sm)',
                              background: 'transparent',
                              border: '1px solid var(--border-medium)',
                              borderRadius: 'var(--radius-md)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-xs)',
                              fontSize: 'var(--text-xs)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            <Volume2 size={14} />
                            Speak
                          </button>
                          
                          <button
                            onClick={() => copyMessage(msg.message)}
                            style={{
                              padding: 'var(--space-xs) var(--space-sm)',
                              background: 'transparent',
                              border: '1px solid var(--border-medium)',
                              borderRadius: 'var(--radius-md)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-xs)',
                              fontSize: 'var(--text-xs)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            <Copy size={14} />
                            Copy
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {sending && (
                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--space-xs)', 
                    padding: 'var(--space-lg)' 
                  }}>
                    <div className="pulse" style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: 'var(--primary-500)' 
                    }} />
                    <div className="pulse" style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: 'var(--primary-500)',
                      animationDelay: '0.2s'
                    }} />
                    <div className="pulse" style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: 'var(--primary-500)',
                      animationDelay: '0.4s'
                    }} />
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div style={{
            padding: 'var(--space-lg)',
            borderTop: '1px solid var(--border-light)',
            background: 'var(--bg-secondary)'
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask a question about the book..."
                disabled={sending}
                style={{
                  flex: 1,
                  padding: 'var(--space-md) var(--space-lg)',
                  borderRadius: 'var(--radius-xl)',
                  border: '2px solid var(--border-light)',
                  fontSize: 'var(--text-base)',
                  outline: 'none',
                  transition: 'all var(--transition-fast)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-300)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                }}
              />
              
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                style={{
                  minWidth: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: input.trim() && !sending ? 'var(--primary-500)' : 'var(--gray-300)',
                  color: 'white',
                  cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--transition-base)',
                  boxShadow: input.trim() && !sending ? 'var(--shadow-md)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (input.trim() && !sending) {
                    e.currentTarget.style.background = 'var(--primary-600)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (input.trim() && !sending) {
                    e.currentTarget.style.background = 'var(--primary-500)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {sending ? (
                  <Loader className="spinner" size={24} />
                ) : (
                  <Send size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BookChat;