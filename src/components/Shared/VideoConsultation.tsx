import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, MonitorOff } from 'lucide-react';

interface VideoConsultationProps {
    roomId: string;
    userName: string;
    userRole: 'doctor' | 'patient';
    onEnd: () => void;
}

export function VideoConsultation({ roomId, userName, userRole, onEnd }: VideoConsultationProps) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        initializeMedia();
        return () => {
            cleanup();
        };
    }, []);

    const initializeMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            setConnectionStatus('connected');
        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('Unable to access camera/microphone. Please check permissions.');
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    };

    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    };

    const toggleScreenShare = async () => {
        try {
            if (!isScreenSharing) {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                });

                // Replace video track with screen share
                const screenTrack = screenStream.getVideoTracks()[0];
                if (localStream) {
                    const videoTrack = localStream.getVideoTracks()[0];
                    localStream.removeTrack(videoTrack);
                    localStream.addTrack(screenTrack);

                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = localStream;
                    }
                }

                screenTrack.onended = () => {
                    setIsScreenSharing(false);
                    initializeMedia(); // Restore camera
                };

                setIsScreenSharing(true);
            } else {
                // Stop screen sharing and restore camera
                initializeMedia();
                setIsScreenSharing(false);
            }
        } catch (error) {
            console.error('Error sharing screen:', error);
        }
    };

    const endCall = () => {
        cleanup();
        onEnd();
    };

    const cleanup = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
        if (remoteStream) {
            remoteStream.getTracks().forEach((track) => track.stop());
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                <div>
                    <h2 className="text-white text-lg font-semibold">Video Consultation</h2>
                    <p className="text-gray-400 text-sm">Room: {roomId}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' :
                            connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                    <span className="text-gray-400 text-sm capitalize">{connectionStatus}</span>
                </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative bg-black">
                {/* Remote Video (Main) */}
                <div className="w-full h-full flex items-center justify-center">
                    {remoteStream ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Video className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-400">Waiting for other participant...</p>
                        </div>
                    )}
                </div>

                {/* Local Video (Picture-in-Picture) */}
                <div className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
                    {isVideoEnabled ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover mirror"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700">
                            <VideoOff className="w-12 h-12 text-gray-400" />
                        </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
                        You ({userRole})
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 px-6 py-4">
                <div className="flex items-center justify-center space-x-4">
                    {/* Toggle Video */}
                    <button
                        onClick={toggleVideo}
                        className={`p-4 rounded-full transition ${isVideoEnabled
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                    >
                        {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                    </button>

                    {/* Toggle Audio */}
                    <button
                        onClick={toggleAudio}
                        className={`p-4 rounded-full transition ${isAudioEnabled
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
                    >
                        {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                    </button>

                    {/* Screen Share (Doctor only) */}
                    {userRole === 'doctor' && (
                        <button
                            onClick={toggleScreenShare}
                            className={`p-4 rounded-full transition ${isScreenSharing
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                                }`}
                            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                        >
                            {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                        </button>
                    )}

                    {/* End Call */}
                    <button
                        onClick={endCall}
                        className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
                        title="End call"
                    >
                        <PhoneOff className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
        </div>
    );
}
