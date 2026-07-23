/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture, Html, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { useScene } from '../../../../context/SceneContext';

const PAPER_WIDTH = 1.51; // Legacy ratio 1197/1340
const PAPER_HEIGHT = 1.7;
const FONT_PATH = '/fonts/CabinSketch-Regular.ttf';

// Helper: Interactive Text Field with Smooth Animation and Invisible Hitbox
const InteractiveTextField = ({
    isActive,
    value,
    placeholder,
    cursor,

    // Layout props
    position,
    baseRotation,
    hitboxPosition,
    hitboxSize,

    // Style props
    fontSize,
    maxWidth,
    anchorX = 'left',
    anchorY = 'middle',
    fontPath,
    textAlign,
    lineHeight,

    // Interaction
    onClick
}) => {
    const textRef = useRef();
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    // Animation targets
    // Smooth lift (Y) and wobble (Z rotation) on hover
    const targetY = hovered ? position[1] + 0.007 : position[1];
    const targetRotZ = hovered ? baseRotation[2] + 0.015 : baseRotation[2];

    useFrame((state, delta) => {
        // Smooth interpolation for "buttery" feel
        const t = delta * 12; // Speed factor
        if (textRef.current) {
            textRef.current.position.y = THREE.MathUtils.lerp(textRef.current.position.y, targetY, t);
            textRef.current.rotation.z = THREE.MathUtils.lerp(textRef.current.rotation.z, targetRotZ, t);
        }
    });

    return (
        <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => {
                e.stopPropagation();
                onClick && onClick();
            }}
        >
            {/* Invisible Hitbox - colorWrite=false prevents grey artifacts while keeping raycast */}
            <mesh position={hitboxPosition} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={hitboxSize} />
                <meshBasicMaterial color="#e0e0e0" colorWrite={false} depthWrite={false} />
            </mesh>

            <Text
                renderOrder={1} // Ensure text renders on top of paper
                ref={textRef}
                position={position}
                rotation={baseRotation}
                fontSize={fontSize}
                color={hovered ? '#111111' : '#333333'} // Snap color, smooth motion
                font={fontPath}
                anchorX={anchorX}
                anchorY={anchorY}
                maxWidth={maxWidth}
                textAlign={textAlign}
                lineHeight={lineHeight}
            >
                {isActive ? (value + cursor) : (value || placeholder)}
            </Text>
        </group>
    );
};

// Helper: Smooth Animated Button
// Helper: Smooth Animated Button
const SmoothButton = ({ texture, onClick, position, size, text, fontPath }) => {
    const groupRef = useRef();
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    // Animation targets - match InteractiveTextField style
    const targetY = hovered ? position[1] + 0.007 : position[1];
    const targetRotZ = hovered ? 0.015 : 0;

    useFrame((state, delta) => {
        const t = delta * 12;
        if (groupRef.current) {
            // Lerp Y Position
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, t);
            // Lerp Z Rotation (tilt)
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, t);
            // Reset scale in case it was modified previously
            groupRef.current.scale.set(1, 1, 1);
        }
    });

    return (
        <group
            ref={groupRef}
            position={position}
            onClick={(e) => {
                e.stopPropagation();
                onClick && onClick();
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={size} />
                <meshBasicMaterial color="#e0e0e0"
                    map={texture}
                    transparent
                    alphaTest={0.1}
                />
            </mesh>
            {text && (
                <Text
                    renderOrder={1}
                    position={[0, 0.005, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.06}
                    color="#333333"
                    font={fontPath}
                    anchorX="center"
                    anchorY="middle"
                >
                    {text}
                </Text>
            )}
        </group>
    );
};

// Web3Forms API Key — prefers the VITE_WEB3FORMS_KEY build-time env var (set it in
// .env locally, or in Cloudflare's Worker "Build variables and secrets" for production),
// but falls back to the real key baked in here so the form still works even if that
// build variable never gets configured. Web3Forms access keys are meant to be used
// directly in client-side requests (unlike a traditional API secret) — abuse is
// mitigated by the rate-limiting/spam checks below, not by hiding this value.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || 'd58e5c6c-cee9-406c-9522-41bf8c472e6c';

// Only these domains are allowed to submit the form.
// localhost/127.0.0.1 are always allowed so the form works in local dev.
const ALLOWED_ORIGINS = [
    'localhost',
    '127.0.0.1',
    'scott-and-georgina-wedding.uk',
];

// ═══════════════════════════════════════════════════════════════════════
// Anti-Spam System
// Multi-layer defense: rate limiting, timing traps, honeypot, origin lock
// ═══════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════
// IP-based Rate Limiter (localStorage)
// Limits submissions to 1 per RATE_LIMIT_MINUTES from same browser session.
// Not bulletproof (localStorage can be cleared), but stops 95% of casual spam.
// ═══════════════════════════════════════════════════════════════════════
const RATE_LIMIT_MINUTES = 30;
const RATE_LIMIT_KEY = 'portfolio_contact_rl';

const checkRateLimit = () => {
    try {
        const stored = localStorage.getItem(RATE_LIMIT_KEY);
        if (!stored) return { allowed: true };
        const lastSend = parseInt(stored, 10);
        const elapsed = Date.now() - lastSend;
        const remaining = (RATE_LIMIT_MINUTES * 60 * 1000) - elapsed;
        if (remaining > 0) {
            const mins = Math.ceil(remaining / 60000);
            return { allowed: false, minutesLeft: mins };
        }
        return { allowed: true };
    } catch {
        return { allowed: true }; // If localStorage fails, allow
    }
};

const recordSubmission = () => {
    try {
        localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
    } catch { /* silently fail */ }
};


const MessagePaper = ({ position = [0, 0.05, 2], onSend }) => {
    const groupRef = useRef();
    const paperRef = useRef();
    const backPaperRef = useRef(); // Back side of paper (white)
    const hiddenInputRef = useRef();
    const emailInputRef = useRef();
    const plusOnesInputRef = useRef();
    const plusOneNotesInputRef = useRef();
    const stayRequestInputRef = useRef();
    const dietaryInputRef = useRef();
    const { guestType } = useScene();

    // Form State
    const [dietaryNotes, setDietaryNotes] = useState('');
    const [email, setEmail] = useState('');
    const [plusOnes, setPlusOnes] = useState('');
    const [plusOneNotes, setPlusOneNotes] = useState('');
    const [stayRequest, setStayRequest] = useState('');
    const [attendanceType, setAttendanceType] = useState(guestType === 'day' ? 'day' : 'evening');
    const [wantsSharedTaxi, setWantsSharedTaxi] = useState(false);
    const [offeringTransport, setOfferingTransport] = useState(false);
    const [activeField, setActiveField] = useState(null);
        useEffect(() => {
            if (guestType === 'day') {
                setAttendanceType('day');
            }
        }, [guestType]);

    const [cursorVisible, setCursorVisible] = useState(true);
    const [botcheck, setBotcheck] = useState(''); // Honeypot state
    const formLoadedAt = useRef(Date.now()); // Timing trap: track when form mounted

    // Validation & Submit State
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

    // Email validation helper
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Form validation — dietary requirements (message) is optional, everything else is required
    const validateForm = () => {
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Email required';
        else if (!isValidEmail(email)) newErrors.email = 'Invalid email format';
        if (!plusOnes.trim()) newErrors.subject = 'Please enter number of plus-one requests (0 if none)';
        if (!attendanceType) newErrors.attendance = 'Please select full day or evening attendance';
        if (guestType === 'day' && attendanceType !== 'day') {
            newErrors.attendance = 'Day guests can only confirm full day attendance';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Load textures
    const paperTexture = useTexture('/textures/contact/paper_form.webp');
    const buttonTexture = useTexture('/textures/contact/send_button.webp');

    // Configure textures
    useEffect(() => {
        if (paperTexture) paperTexture.colorSpace = THREE.SRGBColorSpace;
        if (buttonTexture) buttonTexture.colorSpace = THREE.SRGBColorSpace;
    }, [paperTexture, buttonTexture]);

    // Cursor blink effect
    useEffect(() => {
        if (!activeField) {
            setCursorVisible(false);
            return;
        }
        const interval = setInterval(() => setCursorVisible(prev => !prev), 530);
        return () => clearInterval(interval);
    }, [activeField]);

    // General paper click handler (background click)
    const handlePaperClick = useCallback((e) => {
        e.stopPropagation();
        if (!e.uv) return;
        const uvY = e.uv.y;

        // Fallback selection logic based on UV if hitboxes are missed
        if (uvY > 0.82) {
            setActiveField('email');
            setTimeout(() => emailInputRef.current?.focus(), 10);
        } else if (uvY > 0.68) {
            setActiveField('subject');
            setTimeout(() => plusOnesInputRef.current?.focus(), 10);
        } else if (uvY > 0.58) {
            setActiveField('plusOneNotes');
            setTimeout(() => plusOneNotesInputRef.current?.focus(), 10);
        } else if (uvY > 0.48) {
            setActiveField('stayRequest');
            setTimeout(() => stayRequestInputRef.current?.focus(), 10);
        } else if (uvY > 0.18) {
            setActiveField('message');
            setTimeout(() => dietaryInputRef.current?.focus(), 10);
        }
    }, []);

    // Handle send button click - Submit to Web3Forms
    const handleButtonClick = useCallback(async () => {
        // Reset previous status
        setSubmitStatus(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            // --- 0. Rate Limiting (1 message per 30 min) ---
            const rateCheck = checkRateLimit();
            if (!rateCheck.allowed) {
                setErrors({ message: `Please wait ${rateCheck.minutesLeft} min before sending again.` });
                setIsSubmitting(false);
                return;
            }

            // --- 0b. Timing Trap (must spend >3s on form) ---
            const timeOnForm = Date.now() - formLoadedAt.current;
            if (timeOnForm < 3000) {
                // Bots submit instantly — silently fake success
                setSubmitStatus('success');
                setIsSubmitting(false);
                return;
            }

            // --- 0c. Origin / Domain Lock ---
            // Block submissions from cloned repos running on unauthorized domains
            const currentHost = window.location.hostname;
            const isAllowedOrigin = ALLOWED_ORIGINS.some(d => currentHost === d || currentHost.endsWith('.' + d));
            if (!isAllowedOrigin) {
                // Silently fake success so attacker thinks it worked
                setSubmitStatus('success');
                setIsSubmitting(false);
                return;
            }

            // --- 1. Honeypot check (Silent block) ---
            if (botcheck) {
                // If botcheck is filled out, act like it succeeded to fool the bot
                setSubmitStatus('success');
                setIsSubmitting(false);
                return;
            }

            // --- 2. Email Domain MX Record Validation (DoH) ---
            const domain = email.split('@')[1];
            if (domain) {
                try {
                    const dnsRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
                        headers: { 'Accept': 'application/dns-json' }
                    });
                    const dnsData = await dnsRes.json();
                    
                    // Status 0 is NOERROR. If no MX records (type 15), domain can't receive mail.
                    // Status 3 is NXDOMAIN (domain doesn't exist at all).
                    if (dnsData.Status === 3 || (dnsData.Status === 0 && (!dnsData.Answer || !dnsData.Answer.some(a => a.type === 15)))) {
                        setErrors({ email: 'Domain does not exist or cannot receive emails.' });
                        setIsSubmitting(false);
                        return;
                    }
                } catch (dnsErr) {
                    console.warn('DNS validation failed, bypassing...', dnsErr);
                }
            }

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    // A branded, consistent sender name (not a generic label) and a subject that's
                    // unique per submission (includes the guest's email) both help this land in the
                    // inbox instead of spam — mail providers flag identical, templated subject lines
                    // from the same sending domain as bulk/spam.
                    from_name: "Scott & Georgina's Wedding Website",
                    subject: `Wedding RSVP from ${email}`,
                    email: email,
                    guest_type: guestType || 'unknown',
                    attendance_type: attendanceType,
                    // Explicit Reply-To so replying goes straight to the guest
                    // (Web3Forms also does this automatically for a field named "email").
                    replyto: email,
                    plus_ones: plusOnes,
                    plus_one_request_details: plusOneNotes || 'None',
                    room_or_lodge_request: stayRequest || 'None',
                    shared_taxi_interest: wantsSharedTaxi ? 'Yes' : 'No',
                    offering_transport: offeringTransport ? 'Yes' : 'No',
                    dietary_requirements: dietaryNotes || 'None',
                    message: [
                        `Guest type: ${guestType || 'unknown'}`,
                        `Attendance: ${attendanceType}`,
                        `Plus ones requested: ${plusOnes}`,
                        `Plus-one details: ${plusOneNotes || 'None'}`,
                        `Room/lodge request: ${stayRequest || 'None'}`,
                        `Interested in shared taxi: ${wantsSharedTaxi ? 'Yes' : 'No'}`,
                        `Offering transport: ${offeringTransport ? 'Yes' : 'No'}`,
                        `Dietary requirements: ${dietaryNotes || 'None'}`,
                    ].join('\n')
                })
            });

            const result = await response.json();

            if (result.success) {
                setSubmitStatus('success');
                recordSubmission(); // Record for rate limiting
                onSend?.({
                    email,
                    guestType,
                    attendanceType,
                    plusOnes,
                    plusOneNotes,
                    stayRequest,
                    wantsSharedTaxi,
                    offeringTransport,
                    dietaryNotes,
                });

                // Clear form after success
                setDietaryNotes('');
                setEmail('');
                setPlusOnes('');
                setPlusOneNotes('');
                setStayRequest('');
                setWantsSharedTaxi(false);
                setOfferingTransport(false);
                setAttendanceType(guestType === 'day' ? 'day' : 'evening');
                formLoadedAt.current = Date.now(); // Reset timing trap
            } else {
                throw new Error(result.message || 'Failed to send');
            }
        } catch (error) {
            console.error('RSVP send failed:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    }, [
        dietaryNotes,
        email,
        plusOnes,
        plusOneNotes,
        stayRequest,
        wantsSharedTaxi,
        offeringTransport,
        attendanceType,
        guestType,
        onSend,
        validateForm,
    ]);

    // Input handlers
    const handleMessageInput = useCallback((e) => {
        if (e.target.value.length <= 300) setDietaryNotes(e.target.value);
    }, []);
    const handleEmailInput = useCallback((e) => {
        if (e.target.value.length <= 50) setEmail(e.target.value);
    }, []);
    const handlePlusOnesInput = useCallback((e) => {
        if (e.target.value.length <= 50) setPlusOnes(e.target.value);
    }, []);
    const handlePlusOneNotesInput = useCallback((e) => {
        if (e.target.value.length <= 120) setPlusOneNotes(e.target.value);
    }, []);
    const handleStayRequestInput = useCallback((e) => {
        if (e.target.value.length <= 120) setStayRequest(e.target.value);
    }, []);
    const handleBotcheckInput = useCallback((e) => {
        setBotcheck(e.target.checked);
    }, []);

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            const active = document.activeElement;
            if (active !== hiddenInputRef.current &&
                active !== emailInputRef.current &&
                active !== plusOnesInputRef.current &&
                active !== plusOneNotesInputRef.current &&
                active !== stayRequestInputRef.current &&
                active !== dietaryInputRef.current) {
                setActiveField(null);
            }
        }, 100);
    }, []);

    // Format message (word wrap)
    const formattedMessage = useMemo(() => {
        const maxCharsPerLine = 28;
        const maxLines = 10;
        const lines = [];
        const words = dietaryNotes.split(' ');
        let currentLine = '';

        const breakLongWord = (word) => {
            const chunks = [];
            while (word.length > maxCharsPerLine) {
                chunks.push(word.slice(0, maxCharsPerLine));
                word = word.slice(maxCharsPerLine);
            }
            if (word) chunks.push(word);
            return chunks;
        };

        words.forEach(word => {
            if (word.length > maxCharsPerLine) {
                if (currentLine) { lines.push(currentLine); currentLine = ''; }
                const brokenWord = breakLongWord(word);
                brokenWord.forEach((chunk, i) => {
                    if (i < brokenWord.length - 1) lines.push(chunk);
                    else currentLine = chunk;
                });
            } else if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
                currentLine = (currentLine + ' ' + word).trim();
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        });
        if (currentLine) lines.push(currentLine);
        return lines.slice(0, maxLines).join('\n');
    }, [dietaryNotes]);

    // Store original vertex positions for fold animation
    // Paper animation (flutter)
    useFrame((state, delta) => {
        if (!paperRef.current) return;

        const time = state.clock.getElapsedTime();

        // Flutter animation
        paperRef.current.rotation.z = Math.sin(time * 0.5) * 0.005;
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Hidden HTML inputs */}
            <Html position={[0, 0, 0]} style={{ position: 'fixed', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                <textarea ref={hiddenInputRef} value={dietaryNotes} onChange={handleMessageInput} onBlur={handleBlur} aria-label="Dietary requirements and notes" style={{ pointerEvents: 'auto' }} />
                <input ref={emailInputRef} type="email" value={email} onChange={handleEmailInput} onBlur={handleBlur} aria-label="Email" style={{ pointerEvents: 'auto' }} />
                <input ref={plusOnesInputRef} type="text" value={plusOnes} onChange={handlePlusOnesInput} onBlur={handleBlur} aria-label="Number of plus ones" style={{ pointerEvents: 'auto' }} />
                <input ref={plusOneNotesInputRef} type="text" value={plusOneNotes} onChange={handlePlusOneNotesInput} onBlur={handleBlur} aria-label="Plus one request details" style={{ pointerEvents: 'auto' }} />
                <input ref={stayRequestInputRef} type="text" value={stayRequest} onChange={handleStayRequestInput} onBlur={handleBlur} aria-label="Room or lodge request" style={{ pointerEvents: 'auto' }} />
                <textarea ref={dietaryInputRef} value={dietaryNotes} onChange={handleMessageInput} onBlur={handleBlur} aria-label="Dietary requirements" style={{ pointerEvents: 'auto' }} />
                <input type="checkbox" name="botcheck" checked={botcheck} onChange={handleBotcheckInput} style={{ pointerEvents: 'auto' }} />
            </Html>

            {/* Main Paper Mesh - FRONT (with texture) */}
            <mesh ref={paperRef} rotation={[-Math.PI / 2, 0, 0]} onClick={handlePaperClick}>
                <planeGeometry args={[PAPER_WIDTH, PAPER_HEIGHT, 20, 20]} />
                <meshBasicMaterial color="#e0e0e0"
                    map={paperTexture}
                    transparent
                    alphaTest={0.5}
                    side={THREE.FrontSide}
                    roughness={0.9}
                />
            </mesh>

            {/* Paper BACK (white) */}
            <mesh ref={backPaperRef} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[PAPER_WIDTH, PAPER_HEIGHT, 20, 20]} />
                <meshBasicMaterial
                    color="#f5f5f0"
                    side={THREE.BackSide}
                    roughness={0.9}
                />
            </mesh>

            {/* === INTERACTIVE FIELDS === */}
            <>
                <InteractiveTextField
                    isActive={activeField === 'email'}
                    value={email}
                    placeholder="your email..."
                    cursor={cursorVisible ? '|' : ' '}
                    onClick={() => { setActiveField('email'); setTimeout(() => emailInputRef.current?.focus(), 10); }}
                    // Layout
                    position={[-0.5, 0.008, -0.61]}
                    baseRotation={[-Math.PI / 2, 0, 0.02]}
                    hitboxPosition={[0, 0.005, -0.61]}
                    hitboxSize={[PAPER_WIDTH * 0.85, 0.08]}
                    // Style
                    fontSize={0.05}
                    maxWidth={PAPER_WIDTH * 0.8}
                    fontPath={FONT_PATH}
                />

                {/* Plus Ones Field */}
                <InteractiveTextField
                    isActive={activeField === 'subject'}
                    value={plusOnes}
                    placeholder="plus-ones requested (0 if none)..."
                    cursor={cursorVisible ? '|' : ' '}
                    onClick={() => { setActiveField('subject'); setTimeout(() => plusOnesInputRef.current?.focus(), 10); }}
                    // Layout
                    position={[-0.5, 0.008, -0.46]}
                    baseRotation={[-Math.PI / 2, 0, 0.02]}
                    hitboxPosition={[0, 0.005, -0.46]}
                    hitboxSize={[PAPER_WIDTH * 0.85, 0.08]}
                    // Style
                    fontSize={0.05}
                    maxWidth={PAPER_WIDTH * 0.8}
                    fontPath={FONT_PATH}
                />

                <InteractiveTextField
                    isActive={activeField === 'plusOneNotes'}
                    value={plusOneNotes}
                    placeholder="plus-one names or relationship (optional)..."
                    cursor={cursorVisible ? '|' : ' '}
                    onClick={() => { setActiveField('plusOneNotes'); setTimeout(() => plusOneNotesInputRef.current?.focus(), 10); }}
                    position={[-0.5, 0.008, -0.26]}
                    baseRotation={[-Math.PI / 2, 0, 0.02]}
                    hitboxPosition={[0, 0.005, -0.26]}
                    hitboxSize={[PAPER_WIDTH * 0.85, 0.08]}
                    fontSize={0.05}
                    maxWidth={PAPER_WIDTH * 0.8}
                    fontPath={FONT_PATH}
                />

                <InteractiveTextField
                    isActive={activeField === 'stayRequest'}
                    value={stayRequest}
                    placeholder="room / nearby lodge request (optional)..."
                    cursor={cursorVisible ? '|' : ' '}
                    onClick={() => { setActiveField('stayRequest'); setTimeout(() => stayRequestInputRef.current?.focus(), 10); }}
                    position={[-0.5, 0.008, -0.15]}
                    baseRotation={[-Math.PI / 2, 0, 0.02]}
                    hitboxPosition={[0, 0.005, -0.15]}
                    hitboxSize={[PAPER_WIDTH * 0.85, 0.08]}
                    fontSize={0.05}
                    maxWidth={PAPER_WIDTH * 0.8}
                    fontPath={FONT_PATH}
                />

                {/* Dietary Requirements Field */}
                <InteractiveTextField
                    isActive={activeField === 'message'}
                    value={formattedMessage}
                    placeholder="dietary requirements or extra notes (optional)..."
                    cursor={cursorVisible ? '|' : ' '}
                    onClick={() => { setActiveField('message'); setTimeout(() => dietaryInputRef.current?.focus(), 10); }}
                    // Layout
                    position={[-0.5, 0.008, -0.08]}
                    baseRotation={[-Math.PI / 2, 0, 0.02]}
                    hitboxPosition={[0, 0.005, 0.06]}
                    hitboxSize={[PAPER_WIDTH * 0.85, 0.26]}
                    // Style
                    fontSize={0.05}
                    maxWidth={PAPER_WIDTH * 0.75}
                    fontPath={FONT_PATH}
                    anchorY="top"
                    textAlign="left"
                    lineHeight={1.35}
                />

                <Text
                    position={[-0.5, 0.02, 0.14]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.05}
                    color="#333333"
                    font={FONT_PATH}
                    anchorX="left"
                    anchorY="middle"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (guestType !== 'day') setAttendanceType('evening');
                    }}
                >
                    {guestType === 'day' ? 'Attendance: Full day (day guest)' : `Attendance: ${attendanceType === 'day' ? 'Full day' : 'Evening only'}`}
                </Text>

                {guestType !== 'day' && (
                    <Text
                        position={[0.18, 0.02, 0.14]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        fontSize={0.05}
                        color="#333333"
                        font={FONT_PATH}
                        anchorX="left"
                        anchorY="middle"
                        onClick={(e) => {
                            e.stopPropagation();
                            setAttendanceType(attendanceType === 'day' ? 'evening' : 'day');
                        }}
                    >
                        (click to toggle)
                    </Text>
                )}

                <Text
                    position={[-0.5, 0.02, 0.27]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.05}
                    color="#333333"
                    font={FONT_PATH}
                    anchorX="left"
                    anchorY="middle"
                    onClick={(e) => {
                        e.stopPropagation();
                        setWantsSharedTaxi((prev) => !prev);
                    }}
                >
                    {`[${wantsSharedTaxi ? 'x' : ' '}] Shared taxi request`}
                </Text>

                <Text
                    position={[-0.5, 0.02, 0.34]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.05}
                    color="#333333"
                    font={FONT_PATH}
                    anchorX="left"
                    anchorY="middle"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOfferingTransport((prev) => !prev);
                    }}
                >
                    {`[${offeringTransport ? 'x' : ' '}] I can offer guest transport`}
                </Text>

                {/* === SEND BUTTON === */}
                <SmoothButton
                    texture={buttonTexture}
                    onClick={handleButtonClick}
                    position={[0, 0.005, 0.68]}
                    size={[0.5, 0.13]}
                    text={isSubmitting ? 'SENDING...' : 'SEND'}
                    fontPath={FONT_PATH}
                />

                {/* === VALIDATION ERRORS === */}
                {Object.keys(errors).length > 0 && (
                    <Text
                        position={[0, 0.01, 0.55]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        fontSize={0.035}
                        color="#cc3333"
                        font={FONT_PATH}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {errors.email || errors.subject || errors.attendance || errors.message || 'Please fill all fields'}
                    </Text>
                )}

                {/* === SUCCESS MESSAGE === */}
                {submitStatus === 'success' && (
                    <Text
                        position={[0, 0.02, 0.55]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        fontSize={0.045}
                        color="#22aa44"
                        font={FONT_PATH}
                        anchorX="center"
                        anchorY="middle"
                    >
                        RSVP sent! ✓
                    </Text>
                )}

                {/* === ERROR MESSAGE === */}
                {submitStatus === 'error' && (
                    <Text
                        position={[0, 0.02, 0.55]}
                        rotation={[-Math.PI / 2, 0, 0]}
                        fontSize={0.04}
                        color="#cc3333"
                        font={FONT_PATH}
                        anchorX="center"
                        anchorY="middle"
                    >
                        Failed to send. Try again.
                    </Text>
                )}
            </>
        </group>
    );
};

export default MessagePaper;
