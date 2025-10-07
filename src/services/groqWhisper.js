// src/services/groqWhisper.js

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

/**
 * Transcribe audio using Groq Whisper API
 * Falls back to browser SpeechRecognition if Groq key not available
 */
export const transcribeAudio = async (audioBlob) => {
  // If Groq API key is available, use it
  if (GROQ_API_KEY) {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-large-v3');

      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Groq API request failed');
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Groq transcription failed, falling back to browser:', error);
      return fallbackTranscription(audioBlob);
    }
  } else {
    // Fallback to browser SpeechRecognition
    return fallbackTranscription(audioBlob);
  }
};

/**
 * Fallback transcription using browser's SpeechRecognition API
 */
const fallbackTranscription = async (audioBlob) => {
  return new Promise((resolve, reject) => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      // If no speech recognition available, return a mock result
      console.warn('Speech recognition not available');
      resolve('unable to transcribe');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      // Convert blob to audio URL and play it for recognition
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        resolve('unable to transcribe');
      };

      // Start recognition when audio plays
      audio.onplay = () => {
        recognition.start();
      };

      audio.play();

      // Cleanup after 10 seconds
      setTimeout(() => {
        recognition.stop();
        URL.revokeObjectURL(audioUrl);
        resolve('timeout');
      }, 10000);

    } catch (error) {
      console.error('Fallback transcription error:', error);
      resolve('error');
    }
  });
};