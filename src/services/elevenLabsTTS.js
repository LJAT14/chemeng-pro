// src/services/elevenLabsTTS.js
// Text-to-speech using ElevenLabs API (free tier: 10k chars/month)

class ElevenLabsTTS {
  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    this.voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Sarah - natural female voice
    // Alternative voices:
    // 'pNInz6obpgDQGcFmaJgB' - Adam - natural male
    // 'ThT5KcBeYPX3keUQqHPh' - Dorothy - pleasant female
  }

  async speak(text) {
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found, falling back to browser TTS');
      return this.fallbackSpeak(text);
    }

    try {
      console.log('Speaking with ElevenLabs:', text.substring(0, 50) + '...');

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey
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
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = reject;
        audio.play();
      });

    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      // Fallback to browser TTS
      return this.fallbackSpeak(text);
    }
  }

  fallbackSpeak(text) {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft'))
      ) || voices.find(v => v.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = resolve;
      utterance.onerror = resolve;
      
      window.speechSynthesis.speak(utterance);
    });
  }

  stop() {
    window.speechSynthesis.cancel();
  }
}

export default new ElevenLabsTTS();