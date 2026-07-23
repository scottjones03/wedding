import { useEffect, useRef, useState } from 'react';
import { useScene } from '../../context/SceneContext';
import { useAudio } from '../../context/AudioManager';
import { pauseBackgroundMusic, playBackgroundMusic } from '../../utils/audioManager';
import '../../styles/VideoLightbox.scss';

const PROPOSAL_VIDEO_URL = '/engagement/proposal_audio_boost.mp4?v=3';

/**
 * VideoLightbox - fullscreen DOM overlay that plays the proposal video.
 * Opened by clicking the couple's portrait (entrance window + corridor portrait).
 */
const VideoLightbox = () => {
    const { videoLightboxOpen, closeVideoLightbox } = useScene();
    const { suspendAmbientAudio, resumeAmbientAudio } = useAudio();
    const videoRef = useRef();
    // Default to TRUE the moment the lightbox opens: always show a manual "play with sound"
    // button rather than only revealing it as a fallback after a failed autoplay attempt.
    // A direct click on this button is a guaranteed, unambiguous user gesture, so sound will
    // always work regardless of each browser's autoplay-with-sound heuristics.
    const [needsSoundTap, setNeedsSoundTap] = useState(true);

    useEffect(() => {
        if (videoLightboxOpen) {
            suspendAmbientAudio();
            pauseBackgroundMusic();
            setNeedsSoundTap(true);

            // Best-effort: try to autoplay with sound right away. If the browser allows it,
            // onPlaying below will hide the manual button. If not, the button stays visible.
            if (videoRef.current) {
                videoRef.current.muted = false;
                videoRef.current.volume = 1;
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(() => {
                    setNeedsSoundTap(true);
                });
            }

            return () => {
                resumeAmbientAudio();
                playBackgroundMusic();
            };
        }
        return undefined;
    }, [videoLightboxOpen, suspendAmbientAudio, resumeAmbientAudio]);

    // Pause + rewind whenever the lightbox closes, so it starts fresh next time
    useEffect(() => {
        if (!videoLightboxOpen && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setNeedsSoundTap(true);
        }
    }, [videoLightboxOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!videoLightboxOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeVideoLightbox();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [videoLightboxOpen, closeVideoLightbox]);

    if (!videoLightboxOpen) return null;

    // Directly triggered by a real click - guaranteed to satisfy every browser's
    // user-gesture requirement for unmuted playback.
    const ensureAudiblePlayback = () => {
        if (!videoRef.current) return;
        videoRef.current.defaultMuted = false;
        videoRef.current.muted = false;
        videoRef.current.volume = 1;
        videoRef.current.play().catch(() => {
            setNeedsSoundTap(true);
        });
    };

    // Only hide the manual sound button once we can confirm the video is actually
    // playing AND unmuted - never hide it just because autoPlay/play() resolved.
    const handlePlaying = () => {
        if (videoRef.current && !videoRef.current.muted && !videoRef.current.paused) {
            setNeedsSoundTap(false);
        }
    };

    return (
        <div className="video-lightbox" role="dialog" aria-modal="true" onClick={closeVideoLightbox}>
            <div className="video-lightbox__panel" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className="video-lightbox__close"
                    onClick={closeVideoLightbox}
                    aria-label="Close video"
                >
                    ✕
                </button>
                <video
                    ref={videoRef}
                    src={PROPOSAL_VIDEO_URL}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    onLoadedData={ensureAudiblePlayback}
                    onPlaying={handlePlaying}
                    onPause={() => setNeedsSoundTap(true)}
                    onClick={ensureAudiblePlayback}
                />
                {needsSoundTap && (
                    <button
                        type="button"
                        className="video-lightbox__sound-unlock"
                        onClick={ensureAudiblePlayback}
                    >
                        🔊 Tap to Play with Sound
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoLightbox;
