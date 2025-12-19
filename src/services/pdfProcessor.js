// src/services/pdfProcessor.js
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '../lib/supabaseClient';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
});

export class PDFProcessor {
  constructor(file, userId) {
    this.file = file;
    this.userId = userId;
    this.bookId = null;
  }

  async process() {
    try {
      // 1. Upload PDF to Supabase Storage
      const fileUrl = await this.uploadFile();
      
      // 2. Create book record
      this.bookId = await this.createBookRecord(fileUrl);
      
      // 3. Extract text from PDF
      const textContent = await this.extractText();
      
      // 4. Split into chunks (chapters/sections)
      const chunks = await this.splitIntoChunks(textContent);
      
      // 5. Generate embeddings and save
      await this.saveChunks(chunks);
      
      // 6. Generate slides
      await this.generateSlides(chunks);
      
      // 7. Generate quizzes
      await this.generateQuizzes(chunks);
      
      // 8. Mark as completed
      await this.markCompleted();
      
      return this.bookId;
    } catch (error) {
      await this.markFailed(error.message);
      throw error;
    }
  }

  async uploadFile() {
    const fileName = `${this.userId}/${Date.now()}_${this.file.name}`;
    
    const { data, error } = await supabase.storage
      .from('books')
      .upload(fileName, this.file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('books')
      .getPublicUrl(fileName);
    
    return publicUrl;
  }

  async createBookRecord(fileUrl) {
    const { data, error } = await supabase
      .from('books')
      .insert({
        user_id: this.userId,
        title: this.file.name.replace('.pdf', ''),
        file_url: fileUrl,
        status: 'processing'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  }

  async extractText() {
    const arrayBuffer = await this.file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const totalPages = pdf.numPages;
    let fullText = '';
    
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += `\n\n--- Page ${i} ---\n\n${pageText}`;
    }
    
    // Update total pages
    await supabase
      .from('books')
      .update({ total_pages: totalPages })
      .eq('id', this.bookId);
    
    return fullText;
  }

  async splitIntoChunks(text) {
    // Use AI to intelligently split into chapters/sections
    const prompt = `Analyze this book text and split it into logical chapters or sections.
    For each section, provide: chapter number, title, and content.
    
    Return as JSON array:
    [
      {
        "chapter": 1,
        "title": "Chapter title",
        "content": "Chapter content...",
        "pageStart": 1,
        "pageEnd": 10
      }
    ]
    
    Text:
    ${text.substring(0, 50000)} // First part for structure analysis
    `;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3
    });
    
    const structure = JSON.parse(response.choices[0].message.content);
    
    // Split full text based on AI-identified structure
    // This is simplified - in production, use better splitting logic
    const chunks = structure.chapters || [];
    
    return chunks;
  }

  async saveChunks(chunks) {
    for (const chunk of chunks) {
      // Generate embedding for semantic search
      const embedding = await this.generateEmbedding(chunk.content);
      
      await supabase.from('book_chunks').insert({
        book_id: this.bookId,
        chapter_number: chunk.chapter,
        chapter_title: chunk.title,
        content: chunk.content,
        page_start: chunk.pageStart,
        page_end: chunk.pageEnd,
        embedding: embedding
      });
    }
  }

  async generateEmbedding(text) {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.substring(0, 8000) // Limit token count
    });
    
    return response.data[0].embedding;
  }

  async generateSlides(chunks) {
    for (const chunk of chunks) {
      const prompt = `Create presentation slides for this chapter.
      Generate 5-7 slides with:
      - Title
      - Bullet points (3-5 per slide)
      - Speaker notes
      
      Chapter: ${chunk.title}
      Content: ${chunk.content.substring(0, 3000)}
      
      Return as JSON:
      {
        "slides": [
          {
            "title": "Slide title",
            "content": "• Point 1\n• Point 2\n• Point 3",
            "notes": "Speaker notes..."
          }
        ]
      }`;
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7
      });
      
      const { slides } = JSON.parse(response.choices[0].message.content);
      
      for (let i = 0; i < slides.length; i++) {
        await supabase.from('book_slides').insert({
          book_id: this.bookId,
          chapter_number: chunk.chapter,
          slide_number: i + 1,
          title: slides[i].title,
          content: slides[i].content,
          notes: slides[i].notes
        });
      }
    }
  }

  async generateQuizzes(chunks) {
    for (const chunk of chunks) {
      const prompt = `Generate 5 quiz questions from this chapter.
      Mix of question types:
      - 3 multiple choice
      - 1 true/false
      - 1 short answer
      
      Chapter: ${chunk.title}
      Content: ${chunk.content.substring(0, 3000)}
      
      Return as JSON:
      {
        "questions": [
          {
            "question": "Question text?",
            "type": "multiple_choice",
            "options": ["A", "B", "C", "D"],
            "correct": "B",
            "explanation": "Because...",
            "difficulty": "medium"
          }
        ]
      }`;
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7
      });
      
      const { questions } = JSON.parse(response.choices[0].message.content);
      
      for (const q of questions) {
        await supabase.from('book_quizzes').insert({
          book_id: this.bookId,
          chapter_number: chunk.chapter,
          question: q.question,
          question_type: q.type,
          options: q.options,
          correct_answer: q.correct,
          explanation: q.explanation,
          difficulty: q.difficulty
        });
      }
    }
  }

  async markCompleted() {
    await supabase
      .from('books')
      .update({ 
        status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', this.bookId);
  }

  async markFailed(error) {
    if (this.bookId) {
      await supabase
        .from('books')
        .update({ status: 'failed' })
        .eq('id', this.bookId);
    }
  }
}