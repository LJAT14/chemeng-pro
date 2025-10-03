// src/services/elevenLabsTTS.js
// Text-to-speech using ElevenLabs API (free tier: 10k chars/month)

class ElevenLabsTTS {
  constructor() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    this.voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Sarah - natural female voice
    this.currentAudio = null;
  }

  async speak(text) {
    // Stop any currently playing audio
    this.stop();

    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found, using browser TTS');
      return this.fallbackSpeak(text);
    }

    try {
      console.log('🔊 Speaking with ElevenLabs:', text.substring(0, 50) + '...');

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
              stability: 0.6,
              similarity_boost: 0.8,
              style: 0.5,
              use_speaker_boost: true
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', response.status, errorText);
        
        if (response.status === 401) {
          console.error('❌ Invalid ElevenLabs API key');
        }
        
        throw new Error(`API Error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          console.log('✓ ElevenLabs playback complete');
          resolve();
        };
        audio.onerror = (error) => {
          console.error('Audio playback error:', error);
          this.currentAudio = null;
          reject(error);
        };
        audio.play().catch(error => {
          console.error('Play failed:', error);
          reject(error);
        });
      });

    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      // Fallback to browser TTS
      return this.fallbackSpeak(text);
    }
  }

  fallbackSpeak(text) {
    console.log('🔊 Using browser TTS');
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Samantha'))
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
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    window.speechSynthesis.cancel();
  }
}

export default new ElevenLabsTTS();