import { useState, useEffect, useRef } from 'react';

const useAdvancedVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const restartTimeoutRef = useRef(null);
  const isManualStopRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          final += transcriptPiece + ' ';
        } else {
          interim += transcriptPiece;
        }
      }

      if (final) {
        finalTranscriptRef.current += final;
        setTranscript(finalTranscriptRef.current.trim());
      }

      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        if (isListening && !isManualStopRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error('Restart failed:', e);
            }
          }, 200);
        }
      } else if (event.error === 'aborted') {
        if (isListening && !isManualStopRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error('Restart after abort failed:', e);
            }
          }, 200);
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListening && !isManualStopRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error('Auto-restart failed:', e);
            setIsListening(false);
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Cleanup stop failed:', e);
        }
      }
      clearTimeout(restartTimeoutRef.current);
    };
  }, [isListening]);

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;

    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    isManualStopRef.current = false;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start recognition:', error);
      if (error.message?.includes('already started')) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current.start();
            setIsListening(true);
          }, 100);
        } catch (e) {
          console.error('Restart failed:', e);
        }
      }
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current || !isListening) return;

    isManualStopRef.current = true;
    setIsListening(false);
    clearTimeout(restartTimeoutRef.current);
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Failed to stop recognition:', error);
    }
  };

  const resetTranscript = () => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
  };

  return {
    isListening,
    transcript,
    interimTranscript,
    fullTranscript: transcript + ' ' + interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  };
};

export default useAdvancedVoiceRecognition;