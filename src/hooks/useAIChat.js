// src/hooks/useAIChat.js
import { useState } from 'react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

const useAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userMessage, questionContext = null) => {
    const userMsg = { role: 'user', content: userMessage, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      if (!GROQ_API_KEY) {
        throw new Error('Groq API key not configured');
      }

      // Create prompt
      let prompt = userMessage;
      if (questionContext) {
        prompt = `The user answered this interview question: "${questionContext}"

Their answer: "${userMessage}"

Provide brief feedback (2-3 sentences):
1. What they did well
2. One specific improvement tip

Keep it encouraging but honest.`;
      }

      const response = await fetch(GROQ_CHAT_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are an experienced interview coach providing constructive feedback. Be encouraging but honest. Focus on: content quality, communication clarity, areas for improvement, and strengths.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Groq API error:', response.status, errorText);
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      const aiMsg = { 
        role: 'assistant', 
        content: aiResponse, 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, aiMsg]);

      return aiResponse;

    } catch (error) {
      console.error('AI chat error:', error);
      
      // Fallback response if API fails
      const fallbackMsg = { 
        role: 'assistant', 
        content: "Good answer! You're making progress. Keep practicing to refine your responses.", 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, fallbackMsg]);

      return fallbackMsg.content;

    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return { 
    messages, 
    sendMessage, 
    isLoading,
    clearMessages
  };
};

export { useAIChat };
export default useAIChat;