import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { getInitialRoomFromUrl } from '../hooks/useDocumentMeta';

const SceneContext = createContext(null);

export const useScene = () => {
    const context = useContext(SceneContext);
    if (!context) {
        throw new Error('useScene must be used within a SceneProvider');
    }
    return context;
};

export const SceneProvider = ({ children }) => {
    // Deep linking: check if URL points to a specific room on first load
    const initialRoom = useRef(getInitialRoomFromUrl());
    const deeplinkHandled = useRef(false);

    const [currentRoom, setCurrentRoom] = useState(null); // null = corridor, 'about', 'portfolio', etc.
    const [hasEntered, setHasEntered] = useState(false);  // Has user clicked entrance doors?
    const [exitRequested, setExitRequested] = useState(false); // Signal to request exit from room
    const [overlayContent, setOverlayContent] = useState(null); // Content for overlay (Studio monitor etc)

    // Teleportation states
    const [teleportTarget, setTeleportTarget] = useState(null); // Room ID to teleport to
    const [isTeleporting, setIsTeleporting] = useState(false);  // Currently in teleport transition
    const [teleportPhase, setTeleportPhase] = useState(null);   // 'closing' | 'teleporting' | 'opening' | null
    const [pendingDoorClick, setPendingDoorClick] = useState(null); // Label of door to click after teleport
    const [isFastTeleport, setIsFastTeleport] = useState(false); // Fast teleport in progress (skip animations)

    // Guest list name-gate - must type a name on the guest list before the entrance door will open
    const [guestVerified, setGuestVerified] = useState(() => {
        try {
            return localStorage.getItem('portfolio_guest_verified') === 'true';
        } catch {
            return false;
        }
    });
    const [showGuestGate, setShowGuestGate] = useState(false);

    // Proposal video lightbox - opened by clicking the couple's portrait
    const [videoLightboxOpen, setVideoLightboxOpen] = useState(false);

    // Inspecting state removed to avoid global re-renders

    const enterRoom = useCallback((roomId) => {
        setCurrentRoom(roomId);
        setExitRequested(false); // Clear any pending exit request
        setOverlayContent(null); // Clear overlay on room change

        // Teleportation cleanup - if we just teleported in
        // Note: isFastTeleport is cleared by signalRoomReady, not here
        // Don't clear teleportPhase if it's 'opening' - let the paper animation complete
        setIsTeleporting(false);
        setPendingDoorClick(null);
        // teleportPhase is cleared by finishPaperOpen after animation
    }, []);

    const exitRoom = useCallback(() => {
        setCurrentRoom(null);
        setExitRequested(false);
        setOverlayContent(null);
    }, []);

    // Request exit - this signals to DoorSection to trigger exit animation
    const requestExit = useCallback(() => {
        setExitRequested(true);
        setOverlayContent(null);
    }, []);

    // Clear exit request - called by DoorSection after handling
    const clearExitRequest = useCallback(() => {
        setExitRequested(false);
    }, []);

    const markEntered = useCallback(() => {
        setHasEntered(true);
    }, []);

    // Open the guest name-gate modal (called by the entrance door when clicked unverified)
    const requestGuestVerification = useCallback(() => {
        setShowGuestGate(true);
    }, []);

    // Called by the gate once a typed name matches the guest list
    const verifyGuest = useCallback((name) => {
        setGuestVerified(true);
        try {
            localStorage.setItem('portfolio_guest_verified', 'true');
            localStorage.setItem('portfolio_guest_name', name);
        } catch {
            // localStorage unavailable (private browsing etc.) - just keep it in memory for this session
        }
        setShowGuestGate(false);
    }, []);

    // Called when the guest dismisses the gate without entering a valid name
    const closeGuestGate = useCallback(() => {
        setShowGuestGate(false);
    }, []);

    // Proposal video lightbox controls
    const openVideoLightbox = useCallback(() => {
        setVideoLightboxOpen(true);
    }, []);

    const closeVideoLightbox = useCallback(() => {
        setVideoLightboxOpen(false);
    }, []);

    const openOverlay = useCallback((content) => {
        setOverlayContent(content);
    }, []);

    const closeOverlay = useCallback(() => {
        setOverlayContent(null);
    }, []);

    // Teleportation functions

    // Initiate teleport - called when user clicks room on map
    const teleportTo = useCallback((roomId) => {
        if (isTeleporting || roomId === currentRoom) return; // Prevent double teleport or same room

        setTeleportTarget(roomId);
        setIsTeleporting(true);
        setIsFastTeleport(true); // Enable fast teleport mode
        setTeleportPhase('closing'); // Paper starts closing
        setOverlayContent(null);
    }, [isTeleporting, currentRoom]);

    // Called when paper close animation completes - actually move camera
    const startTeleportTransition = useCallback(() => {
        setTeleportPhase('teleporting');
        // Camera will be moved here by listening components
    }, []);

    // Called when teleport is ready (room loaded) - start paper open animation
    // During fast teleport, this is called AFTER camera is inside room
    const openTeleportTransition = useCallback(() => {
        setTeleportPhase('opening');
    }, []);

    // Called when paper open animation completes - cleanup
    const completeTeleport = useCallback(() => {
        // During FAST teleport: paper stays closed, trigger door click immediately
        // The paper will open when signalRoomReady() is called by DoorSection
        setPendingDoorClick(teleportTarget);

        // Don't clear isTeleporting yet! Wait for enterRoom() logic to finish
        // We only clear target here (phase cleared later)
        setTeleportTarget(null);
        // Note: teleportPhase stays at 'teleporting' during fast teleport so paper remains closed
    }, [teleportTarget]);

    // Called by DoorSection when camera has finished entering the room during fast teleport
    // This opens the paper and completes the teleport sequence
    const signalRoomReady = useCallback(() => {
        if (isFastTeleport) {
            // Now open the paper
            setTeleportPhase('opening');
            setIsFastTeleport(false);
        }
    }, [isFastTeleport]);

    // Called by PaperTransition when paper open animation finishes
    // This just clears the phase - teleport logic is already done
    const finishPaperOpen = useCallback(() => {
        setTeleportPhase(null);
    }, []);

    // REMOVED clearPendingDoorClick - it's now handled in enterRoom

    // Cancel teleport (in case of error)
    const cancelTeleport = useCallback(() => {
        setTeleportTarget(null);
        setIsTeleporting(false);
        setTeleportPhase(null);
        setPendingDoorClick(null);
        setIsFastTeleport(false);
    }, []);

    const value = useMemo(() => ({
        currentRoom,
        hasEntered,
        exitRequested,
        overlayContent, // Exposed
        enterRoom,
        exitRoom,
        requestExit,
        clearExitRequest,
        markEntered,
        openOverlay,    // Exposed
        closeOverlay,   // Exposed
        isInRoom: currentRoom !== null,
        // Guest name-gate
        guestVerified,
        showGuestGate,
        requestGuestVerification,
        verifyGuest,
        closeGuestGate,
        // Proposal video lightbox
        videoLightboxOpen,
        openVideoLightbox,
        closeVideoLightbox,
        // Deep linking
        initialRoom: initialRoom.current,
        deeplinkHandled,
        // Teleportation
        teleportTarget,
        isTeleporting,
        teleportPhase,
        pendingDoorClick,
        isFastTeleport,
        teleportTo,
        startTeleportTransition,
        openTeleportTransition,
        completeTeleport,
        signalRoomReady,
        finishPaperOpen,
        cancelTeleport,
    }), [
        currentRoom,
        hasEntered,
        exitRequested,
        overlayContent,
        enterRoom,
        exitRoom,
        requestExit,
        clearExitRequest,
        markEntered,
        openOverlay,
        closeOverlay,
        // Guest name-gate dependencies
        guestVerified,
        showGuestGate,
        requestGuestVerification,
        verifyGuest,
        closeGuestGate,
        // Video lightbox dependencies
        videoLightboxOpen,
        openVideoLightbox,
        closeVideoLightbox,
        // Teleportation dependencies
        teleportTarget,
        isTeleporting,
        teleportPhase,
        pendingDoorClick,
        isFastTeleport,
        teleportTo,
        startTeleportTransition,
        openTeleportTransition,
        completeTeleport,
        signalRoomReady,
        finishPaperOpen,
        cancelTeleport
    ]);

    return (
        <SceneContext.Provider value={value}>
            {children}
        </SceneContext.Provider>
    );
};

export default SceneContext;
