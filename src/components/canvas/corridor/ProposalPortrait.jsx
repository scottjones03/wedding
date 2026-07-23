import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import gsap from 'gsap';
import { useScene } from '../../../context/SceneContext';

const WINDOW_URL = '/textures/entrance/window_sketch.webp';
const AVATAR_URL = '/textures/entrance/avatar_window.webp';

/**
 * ProposalPortrait Component
 *
 * A small clickable "keepsake window" decoration placed in the corridor's
 * welcome area, mirroring the entrance window's peeking avatar. Clicking it
 * plays the couple's proposal video, so the portrait is reachable both on
 * the landing page (entrance) AND every time you pass through the corridor.
 */
const ProposalPortrait = ({ position = [-1.55, 0.55, 0.3] }) => {
    const windowTexture = useTexture(WINDOW_URL);
    const avatarTexture = useTexture(AVATAR_URL);
    const avatarRef = useRef();
    const groupRef = useRef();
    const { openVideoLightbox } = useScene();

    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.elapsedTime;
        groupRef.current.position.y = position[1] + Math.sin(time * 0.6 + 1) * 0.02;
    });

    const handleEnter = (e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        if (avatarRef.current) {
            gsap.to(avatarRef.current.scale, {
                x: 1.12,
                y: 1.12,
                duration: 0.35,
                ease: 'back.out(1.7)',
                overwrite: true
            });
        }
    };

    const handleLeave = (e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
        if (avatarRef.current) {
            gsap.to(avatarRef.current.scale, {
                x: 1,
                y: 1,
                duration: 0.3,
                ease: 'power2.in',
                overwrite: true
            });
        }
    };

    const handleClick = (e) => {
        e.stopPropagation();
        openVideoLightbox();
    };

    return (
        <group ref={groupRef} position={position} scale={0.55}>
            <mesh
                position={[0, 0, 0]}
                onClick={handleClick}
                onPointerEnter={handleEnter}
                onPointerLeave={handleLeave}
            >
                <planeGeometry args={[1.5, 1.5]} />
                <meshBasicMaterial color="#e0e0e0" map={windowTexture} transparent={true} />
            </mesh>
            <mesh
                ref={avatarRef}
                position={[0, 0, 0.02]}
                onClick={handleClick}
                onPointerEnter={handleEnter}
                onPointerLeave={handleLeave}
            >
                <planeGeometry args={[1.5, 1.5]} />
                <meshBasicMaterial color="#e0e0e0" map={avatarTexture} transparent={true} />
            </mesh>
        </group>
    );
};

export default ProposalPortrait;
