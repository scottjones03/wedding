import { useMemo } from 'react';
import { useScene } from '../../context/SceneContext';
import { getInfoPageBySlug } from '../../content/weddingInfoPages';
import { downloadEventDetailsPdf } from '../../utils/weddingInfoPdf';
import '../../styles/InfoPageOverlay.scss';

const InfoPageOverlay = () => {
    const { infoPageSlug, closeInfoPage, hasEntered } = useScene();
    const page = useMemo(() => getInfoPageBySlug(infoPageSlug), [infoPageSlug]);

    if (!page || !hasEntered) return null;

    return (
        <div className="info-page-overlay" role="dialog" aria-modal="true" onClick={closeInfoPage}>
            <div className="info-page-overlay__panel" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="info-page-overlay__close" onClick={closeInfoPage} aria-label="Close details">
                    Close
                </button>

                <h2>{page.title}</h2>
                <p className="info-page-overlay__description">{page.description}</p>

                {page.sections.map((section) => (
                    <section key={section.heading}>
                        <h3>{section.heading}</h3>
                        <ul>
                            {section.lines.map((line, index) => (
                                <li key={`${section.heading}-${index}`}>{line}</li>
                            ))}
                        </ul>
                    </section>
                ))}

                <div className="info-page-overlay__actions">
                    <button type="button" onClick={downloadEventDetailsPdf}>
                        Download Full Event PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoPageOverlay;
