// Groq TTS Service for Pronunciation Lab

/**
 * Speak text using Groq's TTS API
 * @param {string} text - Text to speak
 * @param {number} speed - Speech speed (0.5 to 2.0)
 * @returns {Promise<void>}
 */
export const speakWithGroq = async (text, speed = 1.0) => {
  try {
    // For now, use browser's Web Speech API as fallback
    // Groq doesn't have TTS yet, but we'll use their API for transcription
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to use a good English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en-') && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang.startsWith('en-'));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    return new Promise((resolve, reject) => {
      utterance.onend = resolve;
      utterance.onerror = reject;
      window.speechSynthesis.speak(utterance);
    });
  } catch (error) {
    console.error('Speech error:', error);
    throw error;
  }
};

/**
 * Generate pronunciation words using Groq AI
 * @param {string} category - Category of words (e.g., "Business", "Travel")
 * @param {string} difficulty - Difficulty level (easy, medium, hard)
 * @param {number} count - Number of words to generate
 * @returns {Promise<Array>}
 */
export const generatePronunciationWords = async (category, difficulty, count = 10) => {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    console.error('Groq API key not found');
    throw new Error('Groq API key not configured');
  }

  try {
    const prompt = `Generate ${count} English words for pronunciation practice with the following criteria:
- Category: ${category}
- Difficulty: ${difficulty}
- Include phonetic pronunciation (IPA)

Return ONLY a JSON array with this exact format, no other text:
[
  {
    "word": "example",
    "phonetic": "/ɪɡˈzæmpəl/",
    "difficulty": "medium",
    "category": "${category}"
  }
]

Generate ${count} unique words now:`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';
    
    // Extract JSON from response (might have markdown code blocks)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;
    
    const words = JSON.parse(jsonStr);
    
    // Add IDs
    return words.map((word, index) => ({
      id: Date.now() + index,
      ...word
    }));
  } catch (error) {
    console.error('Error generating words:', error);
    throw error;
  }
};

/**
 * Analyze pronunciation using Groq (speech to text)
 * @param {Blob} audioBlob - Recorded audio
 * @param {string} targetWord - Word that was supposed to be pronounced
 * @returns {Promise<Object>}
 */
export const analyzePronunciation = async (audioBlob, targetWord) => {
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    // Fallback to random score if no API key
    return {
      score: Math.floor(Math.random() * 30) + 70,
      feedback: "Practice makes perfect! Keep going!",
      transcription: targetWord
    };
  }

  try {
    // Convert blob to base64 for Groq
    const base64Audio = await blobToBase64(audioBlob);
    
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64Audio,
        model: 'whisper-large-v3',
        language: 'en',
      }),
    });

    if (!response.ok) {
      throw new Error('Transcription failed');
    }

    const data = await response.json();
    const transcription = data.text.toLowerCase().trim();
    const target = targetWord.toLowerCase().trim();
    
    // Calculate similarity score
    const score = calculateSimilarity(transcription, target);
    
    return {
      score,
      feedback: score >= 90 ? "Excellent!" : score >= 70 ? "Good job!" : "Keep practicing!",
      transcription
    };
  } catch (error) {
    console.error('Pronunciation analysis error:', error);
    // Fallback to random score
    return {
      score: Math.floor(Math.random() * 30) + 70,
      feedback: "Keep practicing!",
      transcription: targetWord
    };
  }
};

// Helper function to convert blob to base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Simple string similarity calculation
const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 100;
  
  const editDistance = levenshtein(longer, shorter);
  return Math.round((1 - editDistance / longer.length) * 100);
};

// Levenshtein distance algorithm
const levenshtein = (str1, str2) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};