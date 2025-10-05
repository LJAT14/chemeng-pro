// src/services/elevenLabsTTS.js

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah - natural female voice

/**
 * Convert text to speech using ElevenLabs API
 * @param {string} text - Text to speak
 * @param {number} speed - Playback speed (0.5 to 2.0)
 * @returns {Promise<void>}
 */
export async function speakText(text, speed = 1.0) {
  if (!ELEVENLABS_API_KEY) {
    console.warn('ElevenLabs API key not configured, using browser TTS instead');
    return speakWithBrowser(text, speed);
  }

  try {
    console.log('🔊 Speaking with ElevenLabs:', text.substring(0, 50) + '...');

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Set playback speed
    audio.playbackRate = speed;

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        console.log('✓ ElevenLabs playback complete');
        resolve();
      };
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        console.error('ElevenLabs audio playback error:', error);
        reject(error);
      };
      audio.play();
    });

  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    return speakWithBrowser(text, speed);
  }
}

/**
 * Fallback to browser's built-in speech synthesis
 * @param {string} text - Text to speak
 * @param {number} speed - Playback speed (0.5 to 2.0)
 * @returns {Promise<void>}
 */
function speakWithBrowser(text, speed = 1.0) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to get a better voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) 
                        || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stop any currently playing speech
 */
export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export default {
  speakText,
  stopSpeaking
};