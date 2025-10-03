import Groq from 'groq-sdk';

class GroqService {
  constructor() {
    this.groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });
    this.conversationHistory = [];
  }

  async chat(userMessage, context = {}) {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      
      this.conversationHistory.push({ role: 'user', content: userMessage });

      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory
      ];

      const completion = await this.groq.chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile',
        temperature: context.temperature || 0.7,
        max_tokens: 1000,
        top_p: 1,
      });

      const assistantMessage = completion.choices[0]?.message?.content || "I couldn't generate a response.";
      this.conversationHistory.push({ role: 'assistant', content: assistantMessage });

      return assistantMessage;
    } catch (error) {
      console.error('Groq API Error:', error);
      return "I'm having trouble connecting. Please check your API key.";
    }
  }

  buildSystemPrompt(context) {
    const { type = 'interview', category = 'general', keywords = [] } = context;

    if (type === 'interview') {
      return `You are an expert interview coach for ${category} questions. Provide feedback that highlights strengths, points out areas for improvement, and gives specific tips. Keep responses 2-4 sentences.`;
    }

    if (type === 'grammar') {
      return 'You are a writing expert. Analyze text for grammar, style, and clarity. Be specific and helpful.';
    }

    return 'You are a helpful AI assistant.';
  }

  resetConversation() {
    this.conversationHistory = [];
  }
}

export default new GroqService();