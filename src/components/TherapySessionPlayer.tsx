
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Music, VolumeX, Mic, MicOff } from 'lucide-react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { EducationalAnimation } from './EducationalAnimation';
import bgSound from '../assets/528hz-274962.mp3';

interface ResourceItem {
    id: string;
    title: string;
    content: string | null;
    duration: number | null;
    type: string;
}

interface TherapySessionPlayerProps {
    items: ResourceItem[];
    onComplete: () => void;
    onExit: () => void;
    categoryTitle?: string; // To detect if it's educational content
}

// Function to process text for speech - remove headings, add pauses, format properly
const processTextForSpeech = (text: string | null): string => {
    if (!text) return '';

    let processed = text;

    // Remove markdown headings (# ## ### etc.) - convert to regular text with period
    processed = processed.replace(/^#{1,6}\s+(.+)$/gm, '$1. ');

    // Remove HTML tags if any
    processed = processed.replace(/<[^>]*>/g, '');

    // Remove markdown bold/italic but keep the text
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '$1');
    processed = processed.replace(/\*([^*]+)\*/g, '$1');
    processed = processed.replace(/__([^_]+)__/g, '$1');
    processed = processed.replace(/_([^_]+)_/g, '$1');

    // Convert multiple line breaks to single periods for paragraph breaks (longer pauses)
    processed = processed.replace(/\n\s*\n+/g, '. ');

    // Add periods after single line breaks that don't have punctuation
    processed = processed.replace(/\n([^\n.!?:;,]+)\n/g, '\n$1. \n');

    // Add commas before common conjunctions for natural pauses
    processed = processed.replace(/\s+(and|or|but|so|yet|for|nor)\s+/gi, ', $1 ');

    // Ensure proper spacing after periods (longer pause)
    processed = processed.replace(/\.\s*/g, '. ');

    // Ensure proper spacing after exclamation and question marks
    processed = processed.replace(/[!?]\s*/g, '$& ');

    // Ensure proper spacing after commas (shorter pause)
    processed = processed.replace(/,\s*/g, ', ');

    // Add pause after colons and semicolons
    processed = processed.replace(/[:;]\s*/g, '$& ');

    // Add pause after numbered lists (1. 2. etc.)
    processed = processed.replace(/(\d+\.)\s+/g, '$1 ');

    // Convert remaining single line breaks to commas for shorter pauses
    processed = processed.replace(/\n/g, ', ');

    // Clean up multiple spaces
    processed = processed.replace(/\s+/g, ' ');

    // Clean up multiple commas or periods
    processed = processed.replace(/,\s*,/g, ',');
    processed = processed.replace(/\.\s*\./g, '.');

    // Ensure text starts with proper capitalization
    processed = processed.trim();
    if (processed.length > 0) {
        processed = processed.charAt(0).toUpperCase() + processed.slice(1);
    }

    // Ensure text ends with proper punctuation
    if (processed.length > 0 && !/[.!?]$/.test(processed)) {
        processed = processed + '.';
    }

    return processed;
};

const TherapySessionPlayer: React.FC<TherapySessionPlayerProps> = ({ items, onComplete, onExit, categoryTitle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(true);
    const [isInteractive, setIsInteractive] = useState(false);
    const [userResponse, setUserResponse] = useState('');
    const [speechError, setSpeechError] = useState<string | null>(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [autoStartAttempted, setAutoStartAttempted] = useState(false);
    const [speechRate, setSpeechRate] = useState(0.75); // Slower for sleepy, therapeutic feel
    const [speechPitch, setSpeechPitch] = useState(0.75); // Lower pitch for elderly, powerful voice

    const bgAudioRef = useRef<HTMLAudioElement | null>(null);
    const autoStartRef = useRef(false); // Use ref to prevent multiple auto-starts

    const currentItem = items[currentIndex];

    // Check if this is educational content
    const isEducational = categoryTitle?.toLowerCase().includes('educational') ||
        categoryTitle?.toLowerCase().includes('education') ||
        currentItem?.title?.toLowerCase().includes('heart works') ||
        currentItem?.title?.toLowerCase().includes('understanding') ||
        currentItem?.title?.toLowerCase().includes('medication');

    const handleNext = () => {
        setHasUserInteracted(true);
        if (currentIndex < items.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    // Enhanced speech synthesis with realistic settings
    const {
        speak,
        cancel,
        pause,
        resume,
        speaking,
        paused,
        voices,
        selectedVoice,
        setVoice,
    } = useSpeechSynthesis({
        rate: 0.75, // Slower, sleepy therapeutic pace
        pitch: 0.75, // Lower pitch for elderly, powerful voice
        volume: 0.95, // Powerful but not overwhelming
        onEnd: () => {
            if (currentIndex < items.length - 1) {
                // If interactive mode, wait for user response
                if (isInteractive) {
                    setIsInteractive(true);
                } else {
                    setTimeout(() => handleNext(), 1500);
                }
            } else {
                onComplete();
            }
        },
        onStart: () => {
            console.log('Speech started!');
            setSpeechError(null); // Clear any previous errors
        },
        onError: (error) => {
            // Only show error for non-interrupted errors
            if (error.error !== 'interrupted') {
                console.error('Speech synthesis error:', error);
                setSpeechError(`Speech error: ${error.error}. Try clicking the play button.`);
            }
        },
    });

    // Speech recognition for interactive responses
    const {
        start: startListening,
        stop: stopListening,
        listening,
        transcript,
        finalTranscript,
        supported: recognitionSupported,
    } = useSpeechRecognition({
        continuous: true,
        interimResults: true,
        onResult: (transcript, isFinal) => {
            if (isFinal) {
                setUserResponse(transcript);
            }
        },
    });

    // Therapeutic background sound - 528Hz frequency (healing frequency)
    const BG_MUSIC_URL = bgSound;

    // Auto-select and lock Google UK English Male voice (elderly, powerful, therapeutic)
    useEffect(() => {
        if (voices.length > 0) {
            // Prioritize Google UK English Male voice - lock it in
            const googleUKMale = voices.find(v =>
                v.name.includes('Google') &&
                v.name.includes('UK') &&
                v.name.includes('English') &&
                v.name.includes('Male')
            );

            if (googleUKMale && selectedVoice?.name !== googleUKMale.name) {
                console.log('🎯 Locked to Google UK English Male (elderly/powerful):', googleUKMale.name);
                setVoice(googleUKMale);
            } else if (!selectedVoice) {
                // Fallback: look for any Google UK English voice
                const googleUK = voices.find(v =>
                    v.name.includes('Google') &&
                    v.name.includes('UK') &&
                    v.name.includes('English')
                );

                if (googleUK) {
                    console.log('Selected Google UK English:', googleUK.name);
                    setVoice(googleUK);
                } else {
                    // Last fallback: any Google English Male
                    const googleMale = voices.find(v =>
                        v.name.includes('Google') &&
                        v.name.includes('English') &&
                        v.name.includes('Male')
                    );

                    if (googleMale) {
                        console.log('Selected Google English Male:', googleMale.name);
                        setVoice(googleMale);
                    } else {
                        // Final fallback: any Google voice
                        const anyGoogle = voices.find(v => v.name.includes('Google'));
                        if (anyGoogle) {
                            console.log('Selected Google voice:', anyGoogle.name);
                            setVoice(anyGoogle);
                        }
                    }
                }
            }
        }
    }, [voices, selectedVoice, setVoice]);

    // Auto-start functionality with user interaction workaround
    useEffect(() => {
        // Reset auto-start ref when item changes
        if (autoStartRef.current) {
            autoStartRef.current = false;
        }
    }, [currentItem?.id]);

    useEffect(() => {
        // Only try once per item - use ref to prevent multiple calls
        if (autoStartRef.current || !currentItem?.content || voices.length === 0 || speaking) {
            return;
        }

        // Mark as attempted immediately to prevent re-runs
        autoStartRef.current = true;
        setAutoStartAttempted(true);

        // Faster start if user has already interacted, otherwise standard delay
        const delay = hasUserInteracted ? 500 : 1500;

        // Small delay to ensure everything is ready
        const timer = setTimeout(() => {
            if (currentItem?.content && !speaking && voices.length > 0) {
                console.log('Auto-starting speech (single attempt)...', {
                    voices: voices.length,
                    selectedVoice: selectedVoice?.name,
                    contentLength: currentItem.content.length,
                    hasInteracted: hasUserInteracted
                });
                const processedContent = processTextForSpeech(currentItem.content);
                speak(processedContent, {
                    rate: speechRate, // User-adjustable rate (default: sleepy/slow)
                    pitch: speechPitch, // Lower pitch for elderly, powerful voice
                    volume: 0.95, // Powerful but calming
                    voice: selectedVoice, // Always use Google UK English Male
                });
            }
        }, delay);

        // Ensure background music is playing and looping for all exercises
        if (isBgMusicPlaying && bgAudioRef.current) {
            // Ensure loop is enabled
            bgAudioRef.current.loop = true;
            bgAudioRef.current.volume = 0.15; // Lower volume for subtle background
            console.log('Attempting to play background music on mount...', BG_MUSIC_URL);
            bgAudioRef.current.play().catch(e => {
                // Only log if it's not a user interaction or source error
                if (e.name !== 'NotAllowedError' && e.name !== 'NotSupportedError') {
                    console.warn("Audio play failed:", e.name, e);
                } else {
                    console.log('Auto-play prevented (normal), will play on user interaction');
                }
            });
        }

        return () => {
            clearTimeout(timer);
        };
    }, [currentItem?.id, voices.length]); // Only depend on item ID and voices length

    useEffect(() => {
        // Handle play/pause toggle during session
        if (bgAudioRef.current) {
            if (isBgMusicPlaying) {
                // Ensure loop is enabled
                bgAudioRef.current.loop = true;
                bgAudioRef.current.volume = 0.15; // Lower volume for subtle background
                console.log('Playing background music (toggle)...', BG_MUSIC_URL);
                bgAudioRef.current.play().catch(e => {
                    // Only log if it's not a user interaction or source error
                    if (e.name !== 'NotAllowedError' && e.name !== 'NotSupportedError') {
                        console.warn("Audio play failed:", e.name, e);
                    }
                });
            } else {
                bgAudioRef.current.pause();
            }
        }
    }, [isBgMusicPlaying]);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            cancel();
            stopListening();
            if (bgAudioRef.current) {
                bgAudioRef.current.pause();
            }
        };
    }, [cancel, stopListening]);

    useEffect(() => {
        // Reset state when item changes
        cancel();
        stopListening();
        setUserResponse('');
        // Process text to remove headings and add pauses
        const processedText = processTextForSpeech(currentItem?.content || '');
        setCurrentText(processedText);
        setAutoStartAttempted(false);
        setSpeechError(null); // Clear any previous errors

        // Ensure background music continues playing and looping when moving to next exercise
        if (isBgMusicPlaying && bgAudioRef.current) {
            bgAudioRef.current.loop = true;
            // If paused, resume playing
            if (bgAudioRef.current.paused) {
                bgAudioRef.current.play().catch(() => { });
            }
        }

        // Don't auto-play here - let the auto-start effect handle it
        // This prevents double-calling
    }, [currentIndex, currentItem?.id, cancel, stopListening]);

    const handlePlayPause = () => {
        // Mark user interaction for future auto-starts
        setHasUserInteracted(true);

        // User interaction - this should enable speech synthesis in Chrome
        if (speaking) {
            if (paused) {
                resume();
                if (isBgMusicPlaying && bgAudioRef.current) {
                    bgAudioRef.current.play().catch(() => { });
                }
            } else {
                pause();
                if (bgAudioRef.current) bgAudioRef.current.pause();
            }
        } else {
            const textToSpeak = currentText || processTextForSpeech(currentItem?.content || '');
            if (textToSpeak) {
                console.log('User clicked play, speaking:', {
                    text: textToSpeak.substring(0, 50) + '...',
                    voices: voices.length,
                    selectedVoice: selectedVoice?.name
                });
                speak(textToSpeak, {
                    rate: speechRate, // User-adjustable rate
                    pitch: speechPitch, // Lower pitch for elderly voice
                    volume: 0.95, // Powerful but calming
                    voice: selectedVoice, // Always use Google UK English Male
                });
                if (isBgMusicPlaying && bgAudioRef.current) {
                    bgAudioRef.current.play().catch(() => { });
                }
            }
        }
    };

    const toggleListening = () => {
        if (listening) {
            stopListening();
        } else {
            setUserResponse('');
            startListening();
        }
    };

    const handlePrevious = () => {
        setHasUserInteracted(true);
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const toggleBgMusic = () => {
        setIsBgMusicPlaying(!isBgMusicPlaying);
    };

    return (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-between z-50 p-3 sm:p-4 md:p-6 overflow-y-auto">
            {/* Night Sky Background with Stars - Full Screen */}
            <div className="night-sky fixed inset-0 -z-10">
                {/* Stars */}
                {[...Array(150)].map((_, i) => (
                    <div
                        key={i}
                        className="star absolute rounded-full bg-white"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            opacity: Math.random() * 0.8 + 0.2,
                            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            <audio
                ref={bgAudioRef}
                src={BG_MUSIC_URL}
                loop={true}
                preload="auto"
                onCanPlay={(e) => {
                    // Ensure volume is set for therapeutic background sound (528Hz healing frequency)
                    e.currentTarget.volume = 0.15; // Lower volume for subtle background
                    console.log('Background audio can play, attempting to play...', BG_MUSIC_URL);
                    // Auto-play when ready if enabled
                    if (isBgMusicPlaying) {
                        e.currentTarget.play().catch((err) => {
                            console.log('Auto-play prevented (normal), will play on user interaction:', err.name);
                        });
                    }
                }}
                onError={(e) => {
                    // Handle audio source errors gracefully
                    console.error('Background audio failed to load:', e);
                    console.error('Audio source URL:', BG_MUSIC_URL);
                    console.error('Audio element:', bgAudioRef.current);
                    setIsBgMusicPlaying(false);
                }}
                onLoadedData={(e) => {
                    // Auto-play when loaded if enabled
                    console.log('Background audio loaded, attempting to play...');
                    if (isBgMusicPlaying) {
                        e.currentTarget.volume = 0.15; // Lower volume for subtle background
                        e.currentTarget.play().catch((err) => {
                            console.log('Auto-play prevented (normal), will play on user interaction:', err.name);
                        });
                    }
                }}
                onEnded={(e) => {
                    // Ensure it loops - restart if it somehow ends
                    console.log('Audio ended, restarting loop...');
                    if (isBgMusicPlaying) {
                        e.currentTarget.currentTime = 0;
                        e.currentTarget.play().catch(() => { });
                    }
                }}
            />

            {/* Header - Headspace Style */}
            <div className="w-full flex justify-end items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                <button
                    onClick={toggleBgMusic}
                    className={`p-3 rounded-full transition-all duration-300 flex-shrink-0 backdrop-blur-md ${isBgMusicPlaying ? 'bg-primary/30 text-primary border-2 border-primary/50' : 'bg-white/10 text-white/60 border-2 border-white/20'}`}
                    title={isBgMusicPlaying ? "Mute Background Sounds" : "Play Background Sounds"}
                    aria-label={isBgMusicPlaying ? "Mute Background Sounds" : "Play Background Sounds"}
                >
                    {isBgMusicPlaying ? <Music size={20} className="sm:w-6 sm:h-6" /> : <VolumeX size={20} className="sm:w-6 sm:h-6" />}
                </button>
                <button
                    onClick={() => {
                        // Stop all audio and speech when exiting
                        cancel();
                        stopListening();
                        if (bgAudioRef.current) {
                            bgAudioRef.current.pause();
                            bgAudioRef.current.currentTime = 0;
                        }
                        onExit();
                    }}
                    className="p-3 hover:bg-white/20 rounded-full transition-all duration-300 flex-shrink-0 backdrop-blur-md bg-white/10 border-2 border-white/20 hover:border-white/40"
                    aria-label="Exit session"
                >
                    <X size={20} className="sm:w-6 sm:h-6 text-white" />
                </button>
            </div>

            {/* Night Sky Background with Stars - Full Screen */}
            <div className="night-sky fixed inset-0 -z-10">
                {/* Stars */}
                {[...Array(150)].map((_, i) => (
                    <div
                        key={i}
                        className="star absolute rounded-full bg-white"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            opacity: Math.random() * 0.8 + 0.2,
                            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl text-center px-2 sm:px-4 relative z-10">

                {/* Show Educational Animation for educational content, otherwise show waveform */}
                {isEducational ? (
                    <div className="mb-6 sm:mb-8 md:mb-12 relative w-full max-w-2xl flex items-center justify-center">
                        <EducationalAnimation
                            title={currentItem?.title}
                            isPlaying={speaking && !paused}
                            className="w-full"
                        />
                    </div>
                ) : (
                    <div className="mb-6 sm:mb-8 md:mb-12 relative w-full max-w-2xl flex items-center justify-center">
                        <div className="w-full flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 relative">
                            {/* Glowing particles around waveform */}
                            {speaking && [...Array(30)].map((_, i) => (
                                <div
                                    key={`particle-${i}`}
                                    className="voice-particle absolute rounded-full"
                                    style={{
                                        left: `${50 + (Math.random() - 0.5) * 40}%`,
                                        top: `${50 + (Math.random() - 0.5) * 40}%`,
                                        width: `${Math.random() * 4 + 2}px`,
                                        height: `${Math.random() * 4 + 2}px`,
                                        background: `rgba(16, 185, 129, ${0.3 + Math.random() * 0.4})`,
                                        boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(16, 185, 129, 0.8)`,
                                        animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                                        animationDelay: `${Math.random() * 2}s`,
                                    }}
                                />
                            ))}

                            {/* Voice waveform bars with illusion effect */}
                            {[...Array(30)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`voice-bar rounded-full transition-all duration-150 ${speaking ? 'animate-voice-wave' : 'opacity-20'
                                        }`}
                                    style={{
                                        width: '3px',
                                        height: speaking ? `${15 + Math.random() * 70}px` : '15px',
                                        background: speaking
                                            ? `linear-gradient(to top, rgba(16, 185, 129, 0.9), rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.4))`
                                            : 'rgba(255, 255, 255, 0.2)',
                                        boxShadow: speaking
                                            ? `0 0 ${10 + Math.random() * 15}px rgba(16, 185, 129, 0.6), 0 0 ${5 + Math.random() * 10}px rgba(59, 130, 246, 0.4)`
                                            : 'none',
                                        animationDelay: `${i * 0.03}s`,
                                        animationDuration: `${0.4 + Math.random() * 0.4}s`,
                                        filter: speaking ? 'blur(0.5px)' : 'blur(1px)',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Controls - Minimal for Night Sky */}
            <div className="w-full max-w-2xl mt-4 sm:mt-6 md:mt-8 px-2 sm:px-0">
                {/* Progress Bar - Headspace Style */}
                <div className="w-full bg-white/20 backdrop-blur-md h-2 rounded-full mb-4 sm:mb-6 overflow-hidden border border-white/30">
                    <div
                        className="bg-gradient-to-r from-primary to-primary-light h-full transition-all duration-500 shadow-lg shadow-primary/50 rounded-full"
                        style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
                    />
                </div>

                <div className="flex items-center justify-center gap-5 sm:gap-6 md:gap-8">
                    <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="p-4 sm:p-5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex-shrink-0 border-2 border-white/30 hover:border-white/50 shadow-lg"
                        aria-label="Previous step"
                    >
                        <SkipBack size={22} className="sm:w-7 sm:h-7 text-white" />
                    </button>

                    <button
                        onClick={handlePlayPause}
                        className="p-5 sm:p-6 md:p-7 rounded-full bg-gradient-to-r from-primary to-primary-light backdrop-blur-md hover:from-primary-light hover:to-primary transform hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/30 flex-shrink-0 border-4 border-white/30"
                        aria-label={speaking && !paused ? "Pause" : "Play"}
                    >
                        {speaking && !paused ? (
                            <Pause size={28} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="white" />
                        ) : (
                            <Play size={28} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-white ml-1" fill="white" />
                        )}
                    </button>

                    <button
                        onClick={handleNext}
                        className="p-4 sm:p-5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 flex-shrink-0 border-2 border-white/30 hover:border-white/50 shadow-lg"
                        aria-label="Next step"
                    >
                        <SkipForward size={22} className="sm:w-7 sm:h-7 text-white" />
                    </button>
                </div>
            </div>

            {/* Night Sky and Illusion Voice Animation Styles */}
            <style>{`
                .night-sky {
                    background: radial-gradient(ellipse at bottom, #1a1a2e 0%, #000000 100%);
                    overflow: hidden;
                }

                @keyframes twinkle {
                    0%, 100% {
                        opacity: 0.2;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }

                @keyframes voiceWave {
                    0%, 100% {
                        height: 15px;
                        opacity: 0.3;
                        transform: scaleY(0.5);
                    }
                    50% {
                        height: 85px;
                        opacity: 1;
                        transform: scaleY(1);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.3;
                    }
                    25% {
                        transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.2);
                        opacity: 0.6;
                    }
                    50% {
                        transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(1.5);
                        opacity: 0.8;
                    }
                    75% {
                        transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.2);
                        opacity: 0.6;
                    }

                }

                .animate-voice-wave {
                    animation: voiceWave ease-in-out infinite;
                }

                .voice-bar {
                    min-height: 15px;
                    max-height: 85px;
                }

                .voice-particle {
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default TherapySessionPlayer;

