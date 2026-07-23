import { useMemo } from 'react';
import { useScene } from '../../context/SceneContext';
import { buildEventDetailsText, getInfoPageBySlug } from '../../content/weddingInfoPages';
import '../../styles/InfoPageOverlay.scss';

const wrapLinesForPdf = (lines, maxCharsPerLine = 92) => {
    const wrapped = [];

    lines.forEach((line) => {
        if (line.length <= maxCharsPerLine) {
            wrapped.push(line);
            return;
        }

        let remaining = line;
        while (remaining.length > maxCharsPerLine) {
            let splitAt = remaining.lastIndexOf(' ', maxCharsPerLine);
            if (splitAt <= 0) splitAt = maxCharsPerLine;
            wrapped.push(remaining.slice(0, splitAt));
            remaining = remaining.slice(splitAt).trimStart();
        }
        if (remaining) wrapped.push(remaining);
    });

    return wrapped;
};

const createSimplePdfBlob = (lines) => {
    const wrappedLines = wrapLinesForPdf(lines);
    const pageHeight = 792;
    const topMargin = 740;
    const lineHeight = 16;
    const leftMargin = 52;

    const escaped = wrappedLines.map((line) => line
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)'));

    let textCommands = `BT\n/F1 11 Tf\n${leftMargin} ${topMargin} Td\n`;
    escaped.forEach((line, index) => {
        if (index === 0) {
            textCommands += `(${line}) Tj\n`;
        } else {
            textCommands += `0 -${lineHeight} Td\n(${line}) Tj\n`;
        }
    });
    textCommands += 'ET\n';

    const objects = [];
    objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
    objects.push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 ${pageHeight}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
    objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');
    objects.push(`5 0 obj\n<< /Length ${textCommands.length} >>\nstream\n${textCommands}endstream\nendobj\n`);

    let pdf = '%PDF-1.4\n';
    const xref = [0];

    objects.forEach((obj) => {
        xref.push(pdf.length);
        pdf += obj;
    });

    const xrefStart = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i <= objects.length; i += 1) {
        pdf += `${String(xref[i]).padStart(10, '0')} 00000 n \n`;
    }

    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    return new Blob([pdf], { type: 'application/pdf' });
};

const downloadEventDetailsPdf = () => {
    const lines = buildEventDetailsText();
    const blob = createSimplePdfBlob(lines);
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'scott-and-georgina-wedding-details.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

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
