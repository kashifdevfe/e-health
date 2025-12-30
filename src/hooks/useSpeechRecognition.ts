import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: SpeechRecognitionErrorEvent) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

interface UseSpeechRecognitionReturn {
  start: () => void;
  stop: () => void;
  abort: () => void;
  listening: boolean;
  transcript: string;
  interimTranscript: string;
  finalTranscript: string;
  supported: boolean;
  error: string | null;
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const {
    continuous = true,
    interimResults = true,
    lang = 'en-US',
    onResult,
    onError,
    onStart,
    onEnd,
  } = options;

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');

  // Check if speech recognition is supported
  const supported =
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  // Initialize recognition
  useEffect(() => {
    if (!supported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onstart = () => {
      setListening(true);
      setError(null);
      onStart?.();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      finalTranscriptRef.current += final;
      const fullTranscript = finalTranscriptRef.current + interim;

      setFinalTranscript(finalTranscriptRef.current.trim());
      setInterimTranscript(interim);
      setTranscript(fullTranscript.trim());

      onResult?.(fullTranscript.trim(), final.length > 0);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
      setListening(false);
      onError?.(event);
    };

    recognition.onend = () => {
      setListening(false);
      onEnd?.();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [supported, continuous, interimResults, lang, onResult, onError, onStart, onEnd]);

  const start = useCallback(() => {
    if (!supported || !recognitionRef.current) return;
    try {
      finalTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');
      setFinalTranscript('');
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
    }
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported || !recognitionRef.current) return;
    recognitionRef.current.stop();
  }, [supported]);

  const abort = useCallback(() => {
    if (!supported || !recognitionRef.current) return;
    recognitionRef.current.abort();
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    setFinalTranscript('');
  }, [supported]);

  return {
    start,
    stop,
    abort,
    listening,
    transcript,
    interimTranscript,
    finalTranscript,
    supported,
    error,
  };
};

