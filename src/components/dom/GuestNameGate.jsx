import { useState, useEffect, useRef } from 'react';
import { useScene } from '../../context/SceneContext';
import { isGuestOnList } from '../../config/guestList';
import '../../styles/GuestNameGate.scss';

/**
 * GuestNameGate - DOM overlay modal shown when a guest tries to open the
 * entrance door. They must type a name that matches the guest list before
 * the door will actually open.
 */
const GuestNameGate = () => {
    const { showGuestGate, verifyGuest, closeGuestGate } = useScene();
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (showGuestGate) {
            setError('');
            setName('');
            // Focus after mount so the on-screen keyboard opens on mobile too
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [showGuestGate]);

    if (!showGuestGate) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setError('Please type your name to continue.');
            return;
        }
        if (isGuestOnList(trimmed)) {
            verifyGuest(trimmed);
        } else {
            setError("We couldn't find that name on the guest list. Please check the spelling and try again.");
        }
    };

    return (
        <div className="guest-name-gate" role="dialog" aria-modal="true" aria-labelledby="guest-name-gate-title">
            <div className="guest-name-gate__panel">
                <h2 id="guest-name-gate-title">Welcome!</h2>
                <p>Please type your name exactly as it appears on your invite to open the door.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="Your name"
                        autoComplete="name"
                    />
                    {error && <p className="guest-name-gate__error">{error}</p>}
                    <div className="guest-name-gate__actions">
                        <button type="submit">Enter</button>
                        <button type="button" className="guest-name-gate__cancel" onClick={closeGuestGate}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GuestNameGate;
