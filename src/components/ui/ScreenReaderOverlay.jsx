import { useScene } from '../../context/SceneContext';
import { useGalleryProjects, useStudioContent } from '../../hooks/useSanityData';
import '../../styles/ScreenReaderOverlay.scss';

/**
 * ScreenReaderOverlay — A7 Accessibility
 * 
 * Invisible HTML layer providing screen reader access to 3D canvas content.
 * Contains buttons/links matching interactive 3D elements (doors, rooms).
 * Visually hidden via .sr-only but fully accessible to assistive tech.
 */
const ScreenReaderOverlay = () => {
    const { hasEntered, isInRoom, currentRoom, teleportTo, requestExit } = useScene();
    
    // Pobieranie danych do wygenerowania niewidocznego HTML-a dla SEO / robotów
    const projects = useGalleryProjects();
    const studio = useStudioContent();

    return (
        <div className="sr-overlay" role="complementary" aria-label="Accessible navigation for 3D portfolio">
            {/* Skip to content link */}
            <a href="#sr-main-nav" className="sr-only sr-focusable">
                Skip to accessible navigation
            </a>

            {/* Main accessible navigation */}
            <nav id="sr-main-nav" className="sr-only" aria-label="Portfolio rooms">
                <h1>Scott & Georgina's Wedding — 11th of May 2027</h1>
                <h2>Site Navigation</h2>

                {!hasEntered && (
                    <p>Welcome to Scott and Georgina's interactive 3D wedding site. We're getting married on the 11th of May 2027! Click or press Enter on the doors to enter.</p>
                )}

                {hasEntered && !isInRoom && (
                    <>
                        <p>You are in the corridor. Choose a room to explore:</p>
                        <ul>
                            <li>
                                <button onClick={() => teleportTo('about')} type="button">
                                    About — Our story
                                </button>
                            </li>
                            <li>
                                <button onClick={() => teleportTo('gallery')} type="button">
                                    Our Story — Engagement photos
                                </button>
                            </li>
                            <li>
                                <button onClick={() => teleportTo('contact')} type="button">
                                    Contact — RSVP to our wedding
                                </button>
                            </li>
                            <li>
                                <button onClick={() => teleportTo('studio')} type="button">
                                    The Engagement — Our wedding venue
                                </button>
                            </li>
                        </ul>
                    </>
                )}

                {hasEntered && isInRoom && (
                    <>
                        <p>
                            You are in the {currentRoom === 'about' ? 'About' :
                                currentRoom === 'gallery' ? 'Gallery' :
                                    currentRoom === 'contact' ? 'Contact' :
                                        currentRoom === 'studio' ? 'Studio' : currentRoom} room.
                        </p>
                        <button onClick={requestExit} type="button">
                            Go back to corridor
                        </button>

                        {/* Room-specific content descriptions */}
                        {currentRoom === 'about' && (
                            <div aria-label="About room content">
                                <h3>Our Story</h3>
                                <p>This room tells the story of how Scott and Georgina met and got engaged.</p>
                            </div>
                        )}
                        {currentRoom === 'gallery' && (
                            <div aria-label="Gallery room content">
                                <h3>Engagement Photos</h3>
                                <p>Browse our favorite engagement photos and moments together, displayed on paper cards. Swipe or scroll to move through the photo stream.</p>
                                
                                {projects && projects.length > 0 && (
                                    <ul>
                                        {projects.map((p, i) => (
                                            <li key={i}>
                                                <p>{p.title || `Photo ${i + 1}`}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                        {currentRoom === 'contact' && (
                            <div aria-label="Contact room content">
                                <h3>RSVP</h3>
                                <p>RSVP to our wedding on 11th of May 2027 using the message-in-a-bottle form, view our gift registry and shared photos, or find us on social media using the floating barrels.</p>
                            </div>
                        )}
                        {currentRoom === 'studio' && (
                            <div aria-label="Studio room content">
                                <h3>Our Wedding Venue</h3>
                                <p>Explore details about our wedding venue and updates on rotating monitors. Click a monitor to read more.</p>

                                {studio && studio.length > 0 && (
                                    <ul>
                                        {studio.map((s, i) => (
                                            <li key={i}>
                                                <h4>{s.title} ({s.platform})</h4>
                                                <p>{s.description}</p>
                                                {s.url && <a href={s.url}>View content</a>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* Quick navigation to other rooms */}
                        <h3>Quick Navigation</h3>
                        <ul>
                            {currentRoom !== 'about' && (
                                <li><button onClick={() => teleportTo('about')} type="button">Go to About</button></li>
                            )}
                            {currentRoom !== 'gallery' && (
                                <li><button onClick={() => teleportTo('gallery')} type="button">Go to Gallery</button></li>
                            )}
                            {currentRoom !== 'contact' && (
                                <li><button onClick={() => teleportTo('contact')} type="button">Go to Contact</button></li>
                            )}
                            {currentRoom !== 'studio' && (
                                <li><button onClick={() => teleportTo('studio')} type="button">Go to Studio</button></li>
                            )}
                        </ul>
                    </>
                )}
            </nav>

            {/* Live region for state changes */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {isInRoom && `Entered ${currentRoom} room`}
            </div>
        </div>
    );
};

export default ScreenReaderOverlay;
