import { useState } from 'react';
import groqService from '../services/groqService';

const useAIChat = (interviewQuestions) => {
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message) => {
    const userMessage = { role: 'user', content: message, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const question = interviewQuestions[currentQuestion];
      const context = {
        type: 'interview',
        category: question.category || 'general',
        keywords: question.keywords || []
      };

      // Create prompt for Groq
      const prompt = `The user answered this ${question.category} interview question: "${question.question.en}"

Their answer: "${message}"

Provide brief feedback (2-3 sentences):
1. What they did well
2. One specific improvement tip

Keep it encouraging but honest.`;

      // Get AI feedback from Groq
      const aiResponse = await groqService.chat(prompt, context);
      
      const aiMessage = { role: 'assistant', content: aiResponse, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMessage]);

      // Move to next question after delay
      if (currentQuestion < interviewQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          const nextQuestion = interviewQuestions[currentQuestion + 1];
          const questionMessage = { 
            role: 'assistant', 
            content: `Next question: ${nextQuestion.question.en}`, 
            timestamp: Date.now() 
          };
          setMessages(prev => [...prev, questionMessage]);
        }, 1500);
      } else {
        // Interview complete
        setTimeout(() => {
          const completeMessage = { 
            role: 'assistant', 
            content: "Great job completing the interview! You demonstrated good communication skills throughout. Would you like to try another scenario?", 
            timestamp: Date.now() 
          };
          setMessages(prev => [...prev, completeMessage]);
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Fallback if Groq fails
      const question = interviewQuestions[currentQuestion];
      const keywords = question.keywords || [];
      const containsKeywords = keywords.some(keyword => 
        message.toLowerCase().includes(keyword.toLowerCase())
      );

      let fallbackResponse;
      if (containsKeywords) {
        fallbackResponse = "Good answer! You covered key points. " + 
               (currentQuestion < interviewQuestions.length - 1 
                 ? "Let's move to the next question." 
                 : "Interview complete!");
      } else {
        fallbackResponse = "Good start! Try to elaborate more. Consider mentioning: " + 
               keywords.slice(0, 2).join(', ');
      }

      const errorMessage = { 
        role: 'assistant', 
        content: fallbackResponse, 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, errorMessage]);

      // Still move to next question even on error
      if (currentQuestion < interviewQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          const nextQuestion = interviewQuestions[currentQuestion + 1];
          const questionMessage = { 
            role: 'assistant', 
            content: nextQuestion.question.en, 
            timestamp: Date.now() 
          };
          setMessages(prev => [...prev, questionMessage]);
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startInterview = () => {
    groqService.resetConversation();
    const firstQuestion = interviewQuestions[0];
    const introMessage = { 
      role: 'assistant', 
      content: `Welcome to your ${firstQuestion.category || 'interview'} practice session! I'll ask you questions and provide feedback using AI.

Question 1: ${firstQuestion.question.en}`, 
      timestamp: Date.now() 
    };
    setMessages([introMessage]);
    setCurrentQuestion(0);
  };

  return { 
    messages, 
    sendMessage, 
    startInterview, 
    currentQuestion,
    isLoading 
  };
};

export default useAIChat;