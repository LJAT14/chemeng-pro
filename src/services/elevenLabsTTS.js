 
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah voice - professional, clear

/**
 * Speak text using ElevenLabs API with adjustable speed
 * @param {string} text - Text to speak
 * @param {number} speed - Speed multiplier (0.5 = slow, 1.0 = normal, 1.5 = fast)
 * @returns {Promise<void>}
 */
export async function speakText(text, speed = 1.0) {
  if (!ELEVENLABS_API_KEY) {
    console.warn('ElevenLabs API key not configured, falling back to browser TTS');
    return speakWithBrowserTTS(text, speed);
  }

  try {
    // Adjust stability based on speed for better quality
    const stability = speed < 0.8 ? 0.7 : 0.5;
    const similarity_boost = 0.75;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: stability,
            similarity_boost: similarity_boost,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // Adjust playback rate for speed control
    audio.playbackRate = speed;

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        reject(error);
      };
      audio.play().catch(reject);
    });
  } catch (error) {
    console.error('ElevenLabs TTS failed:', error);
    // Fallback to browser TTS
    return speakWithBrowserTTS(text, speed);
  }
}

/**
 * Fallback browser text-to-speech
 * @param {string} text - Text to speak
 * @param {number} speed - Speed multiplier
 * @returns {Promise<void>}
 */
function speakWithBrowserTTS(text, speed = 1.0) {
  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en-US')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = resolve;
      utterance.onerror = reject;

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Stop any currently playing speech
 */
export function stopSpeaking() {
  window.speechSynthesis.cancel();
}

/**
 * Check if ElevenLabs is configured
 * @returns {boolean}
 */
export function isElevenLabsConfigured() {
  return !!ELEVENLABS_API_KEY;
}

export default { speakText, stopSpeaking, isElevenLabsConfigured };