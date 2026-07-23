import { useEffect, useRef, useState } from 'react';
import { useScene } from '../../context/SceneContext';
import { useAudio } from '../../context/AudioManager';
import { pauseBackgroundMusic, playBackgroundMusic } from '../../utils/audioManager';
import '../../styles/VideoLightbox.scss';

const PROPOSAL_VIDEO_URL = '/engagement/proposal_audio_boost.mp4';

/**
 * VideoLightbox - fullscreen DOM overlay that plays the proposal video.
 * Opened by clicking the couple's portrait (entrance window + corridor portrait).
 */
const VideoLightbox = () => {
    const { videoLightboxOpen, closeVideoLightbox } = useScene();
    const { suspendAmbientAudio, resumeAmbientAudio } = useAudio();
    const videoRef = useRef();
    const [needsSoundTap, setNeedsSoundTap] = useState(false);

    useEffect(() => {
        if (videoLightboxOpen) {
            suspendAmbientAudio();
            pauseBackgroundMusic();

            // Ensure the proposal video itself is audible on every open.
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
            setNeedsSoundTap(false);
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

    const ensureAudiblePlayback = () => {
        if (!videoRef.current) return;
        videoRef.current.defaultMuted = false;
        videoRef.current.muted = false;
        videoRef.current.volume = 1;
        videoRef.current.play().catch(() => {
            setNeedsSoundTap(true);
        });
        setNeedsSoundTap(false);
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
                    onPlay={ensureAudiblePlayback}
                    onClick={ensureAudiblePlayback}
                />
                {needsSoundTap && (
                    <button
                        type="button"
                        className="video-lightbox__sound-unlock"
                        onClick={ensureAudiblePlayback}
                    >
                        Tap To Enable Video Sound
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoLightbox;
