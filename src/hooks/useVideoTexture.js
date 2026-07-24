import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * useVideoTexture
 *
 * Creates a muted, looping, autoplaying <video> element and wraps it in a
 * THREE.VideoTexture. Pass a falsy src to skip creating anything (safe to
 * call unconditionally from a shared component).
 */
export function useVideoTexture(src) {
    const [texture, setTexture] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if (!src) {
            setTexture(null);
            return undefined;
        }

        const video = document.createElement('video');
        video.src = src;
        video.loop = true;
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = 'auto';
        videoRef.current = video;

        const tex = new THREE.VideoTexture(video);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        setTexture(tex);

        const tryPlay = () => video.play().catch(() => {});
        video.addEventListener('canplay', tryPlay);
        tryPlay();

        return () => {
            video.removeEventListener('canplay', tryPlay);
            video.pause();
            video.removeAttribute('src');
            video.load();
            tex.dispose();
        };
    }, [src]);

    return texture;
}

export default useVideoTexture;
