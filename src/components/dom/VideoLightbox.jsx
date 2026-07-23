import { useEffect, useRef } from 'react';
import { useScene } from '../../context/SceneContext';
import '../../styles/VideoLightbox.scss';

const PROPOSAL_VIDEO_URL = '/engagement/proposal.mp4';

/**
 * VideoLightbox - fullscreen DOM overlay that plays the proposal video.
 * Opened by clicking the couple's portrait (entrance window + corridor portrait).
 */
const VideoLightbox = () => {
    const { videoLightboxOpen, closeVideoLightbox } = useScene();
    const videoRef = useRef();

    // Pause + rewind whenever the lightbox closes, so it starts fresh next time
    useEffect(() => {
        if (!videoLightboxOpen && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
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
                />
            </div>
        </div>
    );
};

export default VideoLightbox;
