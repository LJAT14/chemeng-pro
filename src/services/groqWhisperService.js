// src/services/groqWhisperService.js

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_WHISPER_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

/**
 * Transcribe audio using Groq's Whisper API
 * @param {Blob} audioBlob - The audio blob to transcribe
 * @returns {Promise<string>} - The transcribed text
 */
export async function transcribeAudio(audioBlob) {
  if (!GROQ_API_KEY) {
    console.error('❌ GROQ API key is missing');
    throw new Error('Groq API key not configured. Please add VITE_GROQ_API_KEY to your .env.local file.');
  }

  console.log('=== GROQ WHISPER TRANSCRIPTION ===');
  console.log('Audio blob size:', audioBlob.size, 'bytes');
  console.log('Audio blob type:', audioBlob.type);

  if (audioBlob.size < 1000) {
    throw new Error('Audio recording too short. Please speak for at least 2 seconds.');
  }

  try {
    // Create FormData for multipart upload
    const formData = new FormData();
    
    // Convert blob to file with appropriate extension
    const audioFile = new File([audioBlob], 'audio.webm', { 
      type: audioBlob.type || 'audio/webm'
    });
    
    formData.append('file', audioFile);
    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'en');
    formData.append('response_format', 'json');
    formData.append('temperature', '0.0');

    console.log('Sending to Groq Whisper API...');

    const response = await fetch(GROQ_WHISPER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: formData,
    });

    console.log('API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      if (response.status === 401) {
        throw new Error('Invalid Groq API key. Please check your VITE_GROQ_API_KEY.');
      } else if (response.status === 400) {
        throw new Error('Invalid audio format. Please try recording again.');
      } else {
        throw new Error(`Groq API error: ${response.status}. ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('=== TRANSCRIPTION RESULT ===');
    console.log('Text:', data.text);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No speech detected. Please speak clearly and try again.');
    }

    return data.text.trim();

  } catch (error) {
    console.error('Transcription error:', error);
    
    // Provide user-friendly error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error.message.includes('API key')) {
      throw new Error('API configuration error. Please contact support.');
    } else {
      throw error;
    }
  }
}

/**
 * Check if Groq Whisper service is configured
 * @returns {boolean}
 */
export function isGroqConfigured() {
  return !!GROQ_API_KEY;
}

export default {
  transcribeAudio,
  isGroqConfigured
};