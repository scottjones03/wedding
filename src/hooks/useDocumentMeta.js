import { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneContext';
import { getInfoPageBySlug } from '../content/weddingInfoPages';

/**
 * useDocumentMeta — Dynamic Meta Tags & Virtual Routing (History API)
 * 
 * Updates the browser URL, page title, and meta description
 * whenever the user enters/exits a 3D room. Also handles the
 * browser back/forward buttons for seamless navigation.
 */

const ROOM_META = {
    null: {
        path: '/',
        title: "Scott & Georgina's Wedding",
        description: "Join Scott and Georgina as they celebrate their wedding day. Our story, photos, and everything you need to know.",
    },
    about: {
        path: '/about',
        title: "Our Story — Scott & Georgina's Wedding",
        description: 'How Scott and Georgina met, their journey together, and details about the wedding day.',
    },
    gallery: {
        path: '/gallery',
        title: "Photos — Scott & Georgina's Wedding",
        description: 'Browse photos and moments from Scott and Georgina\'s journey together, displayed in an interactive 3D gallery.',
    },
    studio: {
        path: '/studio',
        title: "Updates — Scott & Georgina's Wedding",
        description: 'Wedding updates and stories from Scott and Georgina, displayed on floating monitors in an immersive 3D space.',
    },
    contact: {
        path: '/contact',
        title: "RSVP & Contact — Scott & Georgina's Wedding",
        description: 'RSVP and get in touch with Scott and Georgina in this interactive 3D contact room.',
    },
};

// Map URL paths back to room IDs for deep linking
const PATH_TO_ROOM = {
    '/': null,
    '/about': 'about',
    '/gallery': 'gallery',
    '/studio': 'studio',
    '/contact': 'contact',
};

/**
 * Returns the room ID that the initial URL points to (for deep linking).
 * Call this once at app startup to determine if we need to auto-teleport.
 */
export function getInitialRoomFromUrl() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (path.startsWith('/gallery/')) return 'gallery';
    if (path.startsWith('/about/')) return 'about';
    return PATH_TO_ROOM[path] !== undefined ? PATH_TO_ROOM[path] : null;
}

export function getInitialInfoPageFromUrl() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const galleryMatch = path.match(/^\/gallery\/([^/]+)$/);
    if (galleryMatch) return galleryMatch[1];

    const aboutMatch = path.match(/^\/about\/([^/]+)$/);
    if (aboutMatch) return aboutMatch[1];

    return null;
}

export function useDocumentMeta() {
    const { currentRoom, infoPageSlug, teleportTo, hasEntered, openInfoPage, closeInfoPage } = useScene();
    const isHandlingPopState = useRef(false);
    const lastPushedRoom = useRef(undefined); // Track what we last pushed to avoid duplicates

    // Update document meta and URL when room changes
    useEffect(() => {
        const roomKey = currentRoom === null ? 'null' : currentRoom;
        const baseMeta = ROOM_META[roomKey] || ROOM_META['null'];
        const infoPage = infoPageSlug ? getInfoPageBySlug(infoPageSlug) : null;

        const meta = infoPage ? {
            ...baseMeta,
            path: `/${infoPage.room}/${infoPage.slug}`,
            title: `${infoPage.title} — Scott & Georgina's Wedding`,
            description: infoPage.description,
        } : baseMeta;

        // Update the page title
        document.title = meta.title;

        // Update meta description
        const descTag = document.querySelector('meta[name="description"]');
        if (descTag) {
            descTag.setAttribute('content', meta.description);
        }

        // Update OG meta tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', meta.title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', meta.description);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', meta.path);

        // Update canonical link to ensure virtual routes are correctly indexable as separate pages
        const canonicalTag = document.querySelector('link[rel="canonical"]');
        if (canonicalTag) {
            canonicalTag.setAttribute('href', meta.path);
        }

        // Push to browser history (only if not handling a popstate event and room actually changed)
        const historyKey = infoPage ? `${currentRoom}:${infoPage.slug}` : `${currentRoom}`;
        if (!isHandlingPopState.current && lastPushedRoom.current !== historyKey) {
            // Use replaceState for the very first load, pushState for subsequent navigations
            if (lastPushedRoom.current === undefined) {
                window.history.replaceState({ room: currentRoom, infoPage: infoPageSlug || null }, '', meta.path);
            } else {
                window.history.pushState({ room: currentRoom, infoPage: infoPageSlug || null }, '', meta.path);
            }
            lastPushedRoom.current = historyKey;
        }

        isHandlingPopState.current = false;
    }, [currentRoom, infoPageSlug]);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = (event) => {
            isHandlingPopState.current = true;
            const targetRoom = event.state?.room ?? null;
            const targetInfoPage = event.state?.infoPage ?? null;
            lastPushedRoom.current = targetInfoPage ? `${targetRoom}:${targetInfoPage}` : `${targetRoom}`;

            if (targetInfoPage) {
                openInfoPage(targetInfoPage);
            } else {
                closeInfoPage();
            }

            if (targetRoom === null) {
                // Going back to corridor — we don't teleport, just need to trigger exit
                // The SceneContext requestExit will handle the animation
                // For now, we update meta immediately
                const meta = ROOM_META['null'];
                document.title = meta.title;
            } else if (hasEntered) {
                // Teleport to the target room
                teleportTo(targetRoom);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [teleportTo, hasEntered, openInfoPage, closeInfoPage]);
}
