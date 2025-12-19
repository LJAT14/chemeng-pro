// src/services/bookChatbot.js
import OpenAI from 'openai';
import { supabase } from '../lib/supabaseClient';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
});

export class BookChatbot {
  constructor(bookId, userId) {
    this.bookId = bookId;
    this.userId = userId;
  }

  async chat(message) {
    try {
      // 1. Generate embedding for user question
      const questionEmbedding = await this.generateEmbedding(message);
      
      // 2. Find relevant chunks using vector similarity
      const relevantChunks = await this.findRelevantChunks(questionEmbedding);
      
      // 3. Get conversation history
      const history = await this.getHistory();
      
      // 4. Generate response using RAG
      const response = await this.generateResponse(message, relevantChunks, history);
      
      // 5. Save to history
      await this.saveToHistory(message, response, relevantChunks);
      
      return {
        message: response,
        sources: relevantChunks.map(c => ({
          chapter: c.chapter_title,
          page: c.page_start
        }))
      };
    } catch (error) {
      console.error('Chatbot error:', error);
      throw error;
    }
  }

  async generateEmbedding(text) {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });
    return response.data[0].embedding;
  }

  async findRelevantChunks(embedding) {
    // Use pgvector for similarity search
    const { data, error } = await supabase.rpc('match_book_chunks', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: 3,
      p_book_id: this.bookId
    });
    
    if (error) throw error;
    return data;
  }

  async getHistory(limit = 10) {
    const { data, error } = await supabase
      .from('book_chat_history')
      .select('*')
      .eq('book_id', this.bookId)
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data.reverse(); // Oldest first
  }

  async generateResponse(question, chunks, history) {
    const context = chunks.map(c => 
      `Chapter: ${c.chapter_title}\n${c.content}`
    ).join('\n\n---\n\n');
    
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant that answers questions about a book.
        Use ONLY the provided context to answer. If the answer isn't in the context,
        say "I don't find that information in this book."
        
        Context from the book:
        ${context}`
      },
      ...history.map(h => ({
        role: h.role,
        content: h.message
      })),
      {
        role: 'user',
        content: question
      }
    ];
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });
    
    return response.choices[0].message.content;
  }

  async saveToHistory(userMessage, assistantMessage, chunks) {
    await supabase.from('book_chat_history').insert([
      {
        user_id: this.userId,
        book_id: this.bookId,
        message: userMessage,
        role: 'user',
        context_used: null
      },
      {
        user_id: this.userId,
        book_id: this.bookId,
        message: assistantMessage,
        role: 'assistant',
        context_used: chunks.map(c => ({
          chapter: c.chapter_number,
          title: c.chapter_title
        }))
      }
    ]);
  }
}