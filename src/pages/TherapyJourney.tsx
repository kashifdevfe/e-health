
import React, { useState } from 'react';
import TherapySessionPlayer from '../components/TherapySessionPlayer';
import { Play, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { therapyResources, ResourceCategory } from '../data/therapyResources';

const TherapyJourney: React.FC = () => {
    const [categories] = useState<ResourceCategory[]>(therapyResources);
    const [activeSession, setActiveSession] = useState<ResourceCategory | null>(null);
    const loading = false; // No loading needed - data is static

    if (activeSession) {
        return (
            <TherapySessionPlayer
                items={activeSession.items}
                categoryTitle={activeSession.title}
                onComplete={() => {
                    setActiveSession(null);
                    alert('Session Complete! Great job.');
                }}
                onExit={() => setActiveSession(null)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-page via-primary-soft to-page">
            <div className="p-8 max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-3 tracking-tight">
                        Therapy & Education Journey
                    </h1>
                    <p className="text-lg text-secondary-light max-w-2xl mx-auto">
                        Guidance, exercises, and education for your heart health.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                        <p className="mt-4 text-secondary">Loading content...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-secondary mb-4">No therapy resources available</p>
                        <p className="text-secondary-light">Please check your connection or try refreshing the page.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category, index) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col transform hover:-translate-y-1"
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                                }}
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={category.thumbnailUrl || 'https://images.unsplash.com/photo-1544367563-12123d8966cd?q=80&w=2670&auto=format&fit=crop'}
                                        alt={category.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                                        <span className="text-white font-semibold flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                            <BookOpen size={16} />
                                            {category.items.length} {category.items.length === 1 ? 'Module' : 'Modules'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-7 flex-1 flex flex-col bg-white">
                                    <h3 className="text-2xl font-bold text-secondary mb-3 leading-tight">
                                        {category.title}
                                    </h3>
                                    <p className="text-secondary-light text-base mb-6 flex-1 leading-relaxed">
                                        {category.description}
                                    </p>

                                    <button
                                        onClick={() => setActiveSession(category)}
                                        className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 text-base"
                                    >
                                        <Play size={22} className="fill-white" />
                                        Start Session
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default TherapyJourney;
