import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';

interface EducationalAnimationProps {
    animationType?: 'heart-pump' | 'blood-flow' | 'heart-structure' | 'medication-effect' | 'heartbeat';
    title?: string;
    isPlaying: boolean;
    className?: string;
}

// Determine animation type from title/content
const getAnimationTypeFromTitle = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('heart works') || lowerTitle.includes('heart pump')) {
        return 'heart-pump';
    }
    if (lowerTitle.includes('blood flow') || lowerTitle.includes('blood')) {
        return 'blood-flow';
    }
    if (lowerTitle.includes('structure') || lowerTitle.includes('anatomy')) {
        return 'heart-structure';
    }
    if (lowerTitle.includes('medication') || lowerTitle.includes('medicine')) {
        return 'medication-effect';
    }
    if (lowerTitle.includes('heartbeat') || lowerTitle.includes('heart beat')) {
        return 'heartbeat';
    }
    return 'heart-pump'; // default
};

export const EducationalAnimation: React.FC<EducationalAnimationProps> = ({
    animationType,
    title,
    isPlaying,
    className = '',
}) => {
    const [animationData, setAnimationData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [useLottie, setUseLottie] = useState(true);

    const detectedType = animationType || (title ? getAnimationTypeFromTitle(title) : 'heart-pump');

    useEffect(() => {
        loadAnimation(detectedType);
    }, [detectedType]);

    const loadAnimation = async (type: string) => {
        setLoading(true);
        try {
            // Try to load from local assets first
            try {
                // Check if we have a real lottie file (not the placeholder)
                // For now, we prefer the realistic SVG fallback unless a real JSON is present
                // const animation = await import(`../assets/animations/${type}.json`);
                // setAnimationData(animation.default);
                // setUseLottie(true);
                // setLoading(false);
                // return;

                // Note: Uncomment above if you add a valid heart-pump.json to assets
                // Falling back to High-Quality Realistic SVG
            } catch (localError) {
                console.log(`Local animation not found for ${type}, using realistic SVG fallback`);
            }

            // Fallback to SVG animation
            setUseLottie(false);
            setAnimationData(null);
        } catch (error) {
            console.error('Error loading animation:', error);
            setUseLottie(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={`flex items-center justify-center ${className}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    // Use Lottie if available
    if (useLottie && animationData) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`flex items-center justify-center ${className}`}
            >
                <Lottie
                    animationData={animationData}
                    loop={isPlaying}
                    autoplay={isPlaying}
                    style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
                />
            </motion.div>
        );
    }

    // Fallback to SVG animation
    return <SVGHeartAnimation isPlaying={isPlaying} type={detectedType} className={className} />;
};

// SVG-based heart animation (fallback when Lottie files aren't available)
interface SVGHeartAnimationProps {
    isPlaying: boolean;
    type: string;
    className?: string;
}

export const SVGHeartAnimation: React.FC<SVGHeartAnimationProps> = ({ isPlaying, type, className = '' }) => {
    const getAnimationForType = () => {
        switch (type) {
            case 'heart-pump':
            case 'heartbeat':
            case 'heart-structure':
                return (
                    <motion.svg
                        width="400"
                        height="400"
                        viewBox="0 0 400 400"
                        className="max-w-full h-auto drop-shadow-xl"
                        initial={{ scale: 1 }}
                        animate={isPlaying ? {
                            scale: [1, 1.05, 1],
                            filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
                        } : {}}
                        transition={{
                            duration: 0.8,
                            repeat: isPlaying ? Infinity : 0,
                            ease: "easeInOut"
                        }}
                    >
                        <defs>
                            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ff6b6b" />
                                <stop offset="50%" stopColor="#e11d48" />
                                <stop offset="100%" stopColor="#9f1239" />
                            </linearGradient>
                            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#ff4444" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#ff4444" stopOpacity="0" />
                            </radialGradient>
                            <filter id="inset-shadow">
                                <feOffset dx="0" dy="0" />
                                <feGaussianBlur stdDeviation="5" result="offset-blur" />
                                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                                <feFlood floodColor="black" floodOpacity="0.5" result="color" />
                                <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                                <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                            </filter>
                        </defs>

                        {/* Glow effect when pumping */}
                        {isPlaying && (
                            <motion.circle
                                cx="200"
                                cy="200"
                                r="120"
                                fill="url(#glow)"
                                animate={{ opacity: [0.3, 0.8, 0.3], r: [120, 140, 120] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            />
                        )}

                        {/* Main Heart Body - Realistic Anatomical Shape */}
                        <path
                            d="M210,70 
                               C240,60 290,80 300,130 
                               C310,180 280,260 200,340 
                               C120,260 90,180 100,130 
                               C110,80 160,60 190,70 
                               Z"
                            fill="url(#heartGradient)"
                            stroke="#881337"
                            strokeWidth="2"
                            filter="url(#inset-shadow)"
                        />

                        {/* Aorta (Top Artery) */}
                        <path
                            d="M170,70 C160,30 200,10 230,10 C260,10 250,50 240,75"
                            fill="none"
                            stroke="#e11d48"
                            strokeWidth="25"
                            strokeLinecap="round"
                        />

                        {/* Superior Vena Cava (Right side inlet) */}
                        <path
                            d="M120,100 C110,60 110,40 110,20"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="20"
                            strokeLinecap="round"
                            opacity="0.8"
                        />

                        {/* Pulmonary Artery */}
                        <path
                            d="M200,90 C180,50 140,50 130,50"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="18"
                            strokeLinecap="round"
                            opacity="0.8"
                        />

                        {/* Right Atrium Detail */}
                        <path
                            d="M130,130 Q150,150 160,180"
                            fill="none"
                            stroke="rgba(0,0,0,0.1)"
                            strokeWidth="2"
                        />

                        {/* Ventricular Separation Hint */}
                        <path
                            d="M200,330 Q210,250 220,150"
                            fill="none"
                            stroke="rgba(0,0,0,0.1)"
                            strokeWidth="3"
                        />

                        {/* Shine Highlight */}
                        <ellipse cx="160" cy="130" rx="30" ry="15" fill="white" opacity="0.2" transform="rotate(-30 160 130)" />
                    </motion.svg>
                );

            case 'blood-flow':
                return (
                    <motion.svg
                        width="400"
                        height="400"
                        viewBox="0 0 400 400"
                        className="max-w-full h-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* Heart shape */}
                        <path
                            d="M200,300 C200,300 50,200 50,120 C50,70 90,50 120,50 C150,50 200,100 200,100 C200,100 250,50 280,50 C310,50 350,70 350,120 C350,200 200,300 200,300 Z"
                            fill="#dc2626"
                            opacity="0.9"
                        />
                        {/* Blood flow lines */}
                        {isPlaying && (
                            <>
                                <motion.line
                                    x1="200"
                                    y1="100"
                                    x2="200"
                                    y2="150"
                                    stroke="#ff4444"
                                    strokeWidth="4"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />
                                <motion.line
                                    x1="150"
                                    y1="150"
                                    x2="150"
                                    y2="200"
                                    stroke="#ff4444"
                                    strokeWidth="4"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: 0.2,
                                        ease: "linear"
                                    }}
                                />
                                <motion.line
                                    x1="250"
                                    y1="150"
                                    x2="250"
                                    y2="200"
                                    stroke="#ff4444"
                                    strokeWidth="4"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: 0.2,
                                        ease: "linear"
                                    }}
                                />
                            </>
                        )}
                    </motion.svg>
                );

            case 'medication-effect':
                return (
                    <motion.svg
                        width="400"
                        height="400"
                        viewBox="0 0 400 400"
                        className="max-w-full h-auto"
                    >
                        {/* Heart */}
                        <path
                            d="M200,300 C200,300 50,200 50,120 C50,70 90,50 120,50 C150,50 200,100 200,100 C200,100 250,50 280,50 C310,50 350,70 350,120 C350,200 200,300 200,300 Z"
                            fill="#dc2626"
                            opacity="0.7"
                        />
                        {/* Blood vessels expanding */}
                        {isPlaying && (
                            <>
                                <motion.circle
                                    cx="200"
                                    cy="150"
                                    r="20"
                                    fill="none"
                                    stroke="#4ade80"
                                    strokeWidth="2"
                                    initial={{ r: 20 }}
                                    animate={{ r: [20, 30, 20] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                <motion.circle
                                    cx="200"
                                    cy="150"
                                    r="20"
                                    fill="none"
                                    stroke="#4ade80"
                                    strokeWidth="2"
                                    initial={{ r: 20 }}
                                    animate={{ r: [20, 35, 20] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: 0.3,
                                        ease: "easeInOut"
                                    }}
                                />
                            </>
                        )}
                    </motion.svg>
                );

            default:
                return (
                    <motion.svg
                        width="400"
                        height="400"
                        viewBox="0 0 400 400"
                        className="max-w-full h-auto"
                        animate={isPlaying ? {
                            scale: [1, 1.05, 1],
                        } : {}}
                        transition={{
                            duration: 1,
                            repeat: isPlaying ? Infinity : 0,
                        }}
                    >
                        <path
                            d="M200,300 C200,300 50,200 50,120 C50,70 90,50 120,50 C150,50 200,100 200,100 C200,100 250,50 280,50 C310,50 350,70 350,120 C350,200 200,300 200,300 Z"
                            fill="#dc2626"
                            opacity="0.9"
                        />
                    </motion.svg>
                );
        }
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            {getAnimationForType()}
        </div>
    );
};

