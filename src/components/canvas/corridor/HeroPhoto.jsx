import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Real photo (edit public/og-image.webp to change it) shown in the sketch-style
// frame, in place of the old hero text + waving avatar.
const PHOTO_URL = '/og-image.webp';
const FRAME_URL = '/textures/corridor/ramkanazdjecieduza.webp';

// og-image.webp is 1195x896 (~4:3) — keep the plane at that aspect ratio.
const PHOTO_ASPECT = 1195 / 896;
const PHOTO_HEIGHT = 1.7;
const PHOTO_WIDTH = PHOTO_HEIGHT * PHOTO_ASPECT;
// Frame texture has its own built-in border, so it needs to be a bit bigger
// than the photo it surrounds.
const FRAME_WIDTH = PHOTO_WIDTH * 1.22;
const FRAME_HEIGHT = PHOTO_HEIGHT * 1.28;

/**
 * HeroPhoto Component
 *
 * Displays the site's main photo (public/og-image.webp) inside a hand-drawn
 * picture frame at the start of the corridor, with a gentle floating
 * animation to match the rest of the scene's hand-drawn feel.
 */
const HeroPhoto = ({ position = [0, 0.3, -0.4] }) => {
    const groupRef = useRef();
    const photoTexture = useTexture(PHOTO_URL);
    const frameTexture = useTexture(FRAME_URL);

    photoTexture.colorSpace = THREE.SRGBColorSpace;

    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.elapsedTime;
        groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.02;
        groupRef.current.rotation.z = Math.sin(time * 0.4) * 0.01;
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Hand-drawn frame (its interior is opaque, so it must sit behind the photo) */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
                <meshBasicMaterial
                    map={frameTexture}
                    transparent
                    alphaTest={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Photo, drawn in front of the frame so it fills the frame's opening */}
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[PHOTO_WIDTH, PHOTO_HEIGHT]} />
                <meshBasicMaterial map={photoTexture} toneMapped={false} />
            </mesh>
        </group>
    );
};

export default HeroPhoto;
