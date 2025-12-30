import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  lang?: string;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string, options?: UseSpeechSynthesisOptions) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  speaking: boolean;
  paused: boolean;
  supported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice | null) => void;
}

export const useSpeechSynthesis = (
  options: UseSpeechSynthesisOptions = {}
): UseSpeechSynthesisReturn => {
  const {
    rate = 0.9,
    pitch = 1.0,
    volume = 1.0,
    voice: defaultVoice = null,
    lang = 'en-US',
    onEnd,
    onError,
    onStart,
    onPause,
    onResume,
  } = options;

  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(defaultVoice);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<typeof window.speechSynthesis | null>(null);

  // Check if speech synthesis is supported
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load voices
  useEffect(() => {
    if (!supported) return;

    const synth = window.speechSynthesis;
    synthRef.current = synth;

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);

      // Auto-select a preferred natural-sounding voice if none is selected
      if (!selectedVoice && availableVoices.length > 0) {
        // Prefer Google voices (usually more natural) or high-quality voices
        const preferredVoice = availableVoices.find(
          (v) =>
            v.lang.includes('en') &&
            (v.name.includes('Google') ||
              v.name.includes('Zira') ||
              v.name.includes('David') ||
              v.name.toLowerCase().includes('natural'))
        ) || availableVoices.find((v) => v.lang.includes('en')) || availableVoices[0];

        setSelectedVoice(preferredVoice);
      }
    };

    // Chrome loads voices asynchronously
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synth.onvoiceschanged) {
        synth.onvoiceschanged = null;
      }
    };
  }, [supported, selectedVoice]);

  const speak = useCallback(
    (text: string, customOptions?: UseSpeechSynthesisOptions) => {
      if (!supported || !text) {
        console.warn('Speech synthesis not supported or no text provided');
        return;
      }

      const synth = synthRef.current;
      if (!synth) {
        console.warn('Speech synthesis not available');
        return;
      }

      // Only cancel if we're not already speaking the same text
      // This prevents interrupting speech that's already playing
      if (synth.speaking || synth.pending) {
        // Check if we're already speaking - if so, don't interrupt
        if (utteranceRef.current && utteranceRef.current.text === text) {
          console.log('Already speaking this text, skipping duplicate call');
          return;
        }
        console.log('Canceling previous speech before starting new one');
        synth.cancel();
        // Wait a moment for cancellation, then continue
        setTimeout(() => {
          // Continue with speech after cancellation
        }, 100);
      }

      // Wait a bit to ensure voices are loaded (especially for Chrome)
      const speakWithVoice = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Apply options (custom options override defaults)
        utterance.rate = customOptions?.rate ?? rate;
        utterance.pitch = customOptions?.pitch ?? pitch;
        utterance.volume = Math.max(0.1, Math.min(1.0, customOptions?.volume ?? volume)); // Ensure volume is between 0.1 and 1.0
        utterance.lang = customOptions?.lang ?? lang;
        
        console.log('Utterance configured:', {
          volume: utterance.volume,
          rate: utterance.rate,
          pitch: utterance.pitch,
          lang: utterance.lang
        });

        // Set voice - prioritize Google UK English Male, then use selected voice
        const availableVoices = synth.getVoices();
        if (availableVoices.length > 0) {
          // First, try to find Google UK English Male (preferred for all sessions)
          const googleUKMale = availableVoices.find(v => 
            v.name.includes('Google') && 
            v.name.includes('UK') && 
            v.name.includes('English') && 
            v.name.includes('Male')
          );
          
          if (googleUKMale) {
            utterance.voice = googleUKMale;
          } else {
            // Fallback to custom voice or selected voice
            const voiceToUse = customOptions?.voice ?? selectedVoice;
            if (voiceToUse) {
              // Verify voice is still available
              const foundVoice = availableVoices.find(v => v.name === voiceToUse.name && v.lang === voiceToUse.lang);
              if (foundVoice) {
                utterance.voice = foundVoice;
              } else {
                // Fallback to any English voice
                const englishVoice = availableVoices.find(v => v.lang.includes('en')) || availableVoices[0];
                if (englishVoice) utterance.voice = englishVoice;
              }
            } else {
              // No voice selected, try to find a good default
              const englishVoice = availableVoices.find(v => v.lang.includes('en')) || availableVoices[0];
              if (englishVoice) utterance.voice = englishVoice;
            }
          }
        }

        // Event handlers
        utterance.onstart = () => {
          console.log('Speech started successfully!');
          setSpeaking(true);
          setPaused(false);
          customOptions?.onStart?.() || onStart?.();
        };

        utterance.onend = () => {
          setSpeaking(false);
          setPaused(false);
          utteranceRef.current = null;
          customOptions?.onEnd?.() || onEnd?.();
        };

        utterance.onerror = (error) => {
          // Filter out 'interrupted' errors - these are expected when canceling speech
          if (error.error === 'interrupted') {
            // This is normal when speech is cancelled, don't treat as error
            setSpeaking(false);
            setPaused(false);
            utteranceRef.current = null;
            return;
          }
          
          // Only log and handle real errors
          console.error('Speech synthesis error:', error);
          setSpeaking(false);
          setPaused(false);
          utteranceRef.current = null;
          customOptions?.onError?.(error) || onError?.(error);
        };

        utterance.onpause = () => {
          setPaused(true);
          customOptions?.onPause?.() || onPause?.();
        };

        utterance.onresume = () => {
          setPaused(false);
          customOptions?.onResume?.() || onResume?.();
        };

        try {
          console.log('Calling synth.speak with:', {
            text: text.substring(0, 50) + '...',
            voice: utterance.voice?.name || 'default',
            rate: utterance.rate,
            pitch: utterance.pitch,
            volume: utterance.volume,
            synthState: { speaking: synth.speaking, pending: synth.pending }
          });
          
          // Ensure we're not already speaking
          if (synth.speaking) {
            console.warn('Already speaking, canceling previous speech first');
            synth.cancel();
            // Wait a moment for cancellation
            setTimeout(() => {
              synth.speak(utterance);
              console.log('synth.speak called after cancellation');
            }, 50);
          } else {
            synth.speak(utterance);
            console.log('synth.speak called successfully');
          }
        } catch (error) {
          console.error('Error calling synth.speak:', error);
          customOptions?.onError?.(error as SpeechSynthesisErrorEvent) || onError?.(error as SpeechSynthesisErrorEvent);
        }
      };

      // If voices aren't loaded yet, wait a bit
      const availableVoices = synth.getVoices();
      console.log('Available voices:', availableVoices.length);
      
      if (availableVoices.length === 0) {
        // Wait for voices to load
        let attempts = 0;
        const maxAttempts = 20; // 2 seconds max
        const checkVoices = setInterval(() => {
          attempts++;
          const voices = synth.getVoices();
          console.log(`Checking voices (attempt ${attempts}):`, voices.length);
          if (voices.length > 0) {
            clearInterval(checkVoices);
            console.log('Voices loaded, speaking now');
            speakWithVoice();
          } else if (attempts >= maxAttempts) {
            clearInterval(checkVoices);
            console.warn('Voices not loaded after timeout, trying anyway');
            speakWithVoice(); // Try anyway
          }
        }, 100);
      } else {
        console.log('Voices already available, speaking now');
        speakWithVoice();
      }
    },
    [supported, rate, pitch, volume, lang, selectedVoice, onEnd, onError, onStart, onPause, onResume]
  );

  const cancel = useCallback(() => {
    if (!supported) return;
    const synth = synthRef.current;
    if (synth) {
      synth.cancel();
      setSpeaking(false);
      setPaused(false);
      utteranceRef.current = null;
    }
  }, [supported]);

  const pause = useCallback(() => {
    if (!supported) return;
    const synth = synthRef.current;
    if (synth && synth.speaking && !synth.paused) {
      synth.pause();
      setPaused(true);
    }
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    const synth = synthRef.current;
    if (synth && synth.paused) {
      synth.resume();
      setPaused(false);
    }
  }, [supported]);

  return {
    speak,
    cancel,
    pause,
    resume,
    speaking,
    paused,
    supported,
    voices,
    selectedVoice,
    setVoice: setSelectedVoice,
  };
};

