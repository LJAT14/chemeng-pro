// src/services/groqWhisperService.js - Create this new file
// Speech-to-text using Groq Whisper API

class GroqWhisperService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY;
  }

  async transcribeAudio(audioBlob) {
    if (!this.apiKey) {
      throw new Error('Groq API key not found');
    }

    console.log('=== PREPARING AUDIO FOR GROQ ===');
    console.log('Blob size:', audioBlob.size, 'bytes');
    console.log('Blob type:', audioBlob.type);

    // Check if audio is too small
    if (audioBlob.size < 1000) {
      throw new Error('Audio recording too short or empty');
    }

    try {
      // Determine file extension from mime type
      let fileName = 'audio.webm'; // default
      const mimeType = audioBlob.type.toLowerCase();
      
      if (mimeType.includes('mp4') || mimeType.includes('mpeg')) {
        fileName = 'audio.mp4';
      } else if (mimeType.includes('webm')) {
        fileName = 'audio.webm';
      } else if (mimeType.includes('ogg')) {
        fileName = 'audio.ogg';
      } else if (mimeType.includes('wav')) {
        fileName = 'audio.wav';
      } else if (mimeType === '') {
        // No mime type - try mp4
        fileName = 'audio.mp4';
      }

      console.log('Sending as:', fileName);

      // Create FormData
      const formData = new FormData();
      formData.append('file', audioBlob, fileName);
      formData.append('model', 'whisper-large-v3');
      formData.append('language', 'en');
      formData.append('response_format', 'json');

      console.log('Calling Groq Whisper API...');

      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      const responseText = await response.text();
      console.log('=== GROQ API RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Response:', responseText);

      if (!response.ok) {
        throw new Error(`Groq API returned ${response.status}: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('✓ Transcription:', data.text);
      
      return data.text;
    } catch (error) {
      console.error('=== TRANSCRIPTION FAILED ===');
      console.error(error);
      throw error;
    }
  }
}

export default new GroqWhisperService();