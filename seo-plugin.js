// Static site content for Scott & Georgina's Wedding — no external CMS.
// Edit these values directly to update the copy shown to search engines / AI crawlers.
// SITE_URL is read from the VITE_SITE_URL env var (set it in .env locally, or in
// your host's dashboard for production) and defaults to '' (relative URLs) when
// unset — relative works fine for browsing the site, but absolute URLs are
// required for og:image/og:url to reliably show link previews on social apps.
let SITE_URL = '';
function getPageUrl() {
    return SITE_URL || '/';
}

const GLOBAL_INFO = {
    siteTitle: "Scott & Georgina's Wedding",
    siteDescription: "Join Scott and Georgina as they celebrate their wedding day. Our story, photos, and everything you need to know.",
    aboutMe: "We can't wait to celebrate this special day with the people we love most. Here you'll find our story, photos, and all the details for the big day.",
    githubUrl: undefined,
    linkedinUrl: undefined,
    instagramUrl: undefined,
    xUrl: undefined,
    tiktokUrl: undefined,
    youtubeUrl: undefined,
};

// "Our Story" gallery moments — add your own milestones here (engagement, proposal, etc.)
const GALLERY_ITEMS = [];

// Wedding updates / blog posts — add your own here
const STUDIO_ITEMS = [];

// Not used for a wedding site, kept only so buildJsonLd() stays generic
const AWARD_ITEMS = [];

// FAQ shown to guests (and to AI search engines via schema.org FAQPage)
const FAQ_ITEMS = [
    { question: 'What should I wear?', answer: 'Smart casual / cocktail attire is perfect. Comfortable shoes are recommended for dancing!' },
    { question: 'Is there parking at the venue?', answer: 'Yes, free parking is available on site.' },
];

/**
 * Helper to ensure dates are in ISO-8601 format with timezone for SEO.
 */
function formatIsoDate(dateString) {
    if (!dateString) return undefined;
    if (dateString.includes('T')) return dateString; // Already has time/timezone
    return `${dateString}T12:00:00Z`; // Default to noon UTC
}

/**
 * Build dynamic JSON-LD structured data from the static wedding content above.
 * This generates schema.org entities that AI search engines (Google AI Overviews,
 * Perplexity, Gemini) use to understand and cite content in their answers.
 */
function buildJsonLd(globalInfo, projects, studio, awards, faqList) {
    const graph = [];

    // --- 1. Person: Central node of the Knowledge Graph ---
    const person = {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Scott & Georgina',
        alternateName: ['Scott and Georgina', "Scott and Georgina's Wedding"],
        url: getPageUrl(),
        description: globalInfo?.aboutMe || "Scott and Georgina are getting married.",
        sameAs: [
            globalInfo?.linkedinUrl,
            globalInfo?.githubUrl,
            globalInfo?.instagramUrl,
            globalInfo?.xUrl,
            globalInfo?.tiktokUrl,
            globalInfo?.youtubeUrl
        ].filter(Boolean)
    };
    graph.push(person);

    // --- 2. WebSite ---
    const website = {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: getPageUrl(),
        name: globalInfo?.siteTitle || "Scott & Georgina's Wedding",
        description: globalInfo?.siteDescription || 'Wedding website for Scott and Georgina.',
        publisher: { '@id': `${SITE_URL}/#person` }
    };
    graph.push(website);

    // --- 3. ProfilePage ---
    const profilePage = {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profilepage`,
        url: getPageUrl(),
        mainEntity: { '@id': `${SITE_URL}/#person` },
        about: { '@id': `${SITE_URL}/#person` }
    };
    graph.push(profilePage);

    // --- 4. FAQPage (GEO & AI search engine optimizer) ---
    if (faqList && faqList.length > 0) {
        const faqPage = {
            '@type': 'FAQPage',
            '@id': `${SITE_URL}/#faq`,
            mainEntity: faqList.map(item => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer
                }
            }))
        };
        graph.push(faqPage);
    }

    // --- 5. ItemList: "Our Story" gallery moments ---
    if (projects && projects.length > 0) {
        graph.push({
            '@type': 'ItemList',
            '@id': `${SITE_URL}/#gallery`,
            name: 'Our Story',
            description: 'Photos and moments from Scott and Georgina\'s journey together.',
            numberOfItems: projects.length,
            itemListElement: projects.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: p.seoTitle || p.title,
                    description: p.seoDescription || p.description || '',
                    url: p.url || undefined,
                    creator: { '@id': `${SITE_URL}/#person` },
                }
            }))
        });

        // Individual CreativeWork entries for each moment (richer detail)
        projects.forEach(p => {
            const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            graph.push({
                '@type': 'CreativeWork',
                '@id': `${SITE_URL}/#moment-${slug}`,
                name: p.seoTitle || p.title,
                description: p.seoDescription || p.description || '',
                url: p.url || undefined,
                creator: { '@id': `${SITE_URL}/#person` },
            });
        });
    }

    // --- 6. Wedding updates (blog/video posts) ---
    if (studio && studio.length > 0) {
        studio.forEach((s, idx) => {
            graph.push({
                '@type': 'Article',
                '@id': `${SITE_URL}/#update-${idx}`,
                headline: s.seoTitle || s.title,
                description: s.seoDescription || s.description || '',
                url: s.url || undefined,
                image: s.thumbnailUrl || `${SITE_URL}/og-image.webp`,
                ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                author: { '@id': `${SITE_URL}/#person` },
            });
        });
    }

    // --- 7. Milestones (kept for schema compatibility; empty by default) ---
    if (awards && awards.length > 0) {
        graph.push({
            '@type': 'ItemList',
            '@id': `${SITE_URL}/#milestones`,
            name: 'Our Milestones',
            numberOfItems: awards.length,
            itemListElement: awards.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: a.seoTitle || a.title,
                    ...(a.date ? { dateCreated: formatIsoDate(a.date) } : {}),
                    url: a.url || undefined,
                    description: a.seoDescription || undefined,
                    creator: { '@id': `${SITE_URL}/#person` },
                }
            }))
        });
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graph
    };
}

// Helper to generate the llms.txt content in clean Markdown
function buildLlmsTxt(globalInfo, projects, studio, awards, faqList) {
    const siteTitle = globalInfo?.siteTitle || "Scott & Georgina's Wedding";
    const siteDescription = globalInfo?.siteDescription || 'Wedding website for Scott and Georgina.';
    const aboutMe = globalInfo?.aboutMe || "We can't wait to celebrate this special day with the people we love most.";

    let content = `# ${siteTitle}\n`;
    content += `> ${siteDescription}\n\n`;

    content += `## Our Story\n`;
    content += `${aboutMe}\n\n`;

    if (projects && projects.length > 0) {
        content += `## Photos & Moments\n`;
        projects.forEach(p => {
            content += `- [${p.seoTitle || p.title}](${p.url || getPageUrl()}): ${p.seoDescription || p.description || ''}\n`;
        });
        content += `\n`;
    }

    if (studio && studio.length > 0) {
        content += `## Updates\n`;
        studio.forEach(s => {
            content += `- [${s.seoTitle || s.title}](${s.url || getPageUrl()}): ${s.seoDescription || s.description || ''}\n`;
        });
        content += `\n`;
    }

    if (faqList && faqList.length > 0) {
        content += `## Frequently Asked Questions (FAQ)\n`;
        faqList.forEach(item => {
            content += `- **${item.question}**\n`;
            content += `  ${item.answer.replace(/\n/g, '\n  ')}\n`;
        });
    }

    return content;
}

export function generateSeoHtml() {
    let cachedLlmsContent = '';

    async function getLlmsContent() {
        if (!cachedLlmsContent) {
            cachedLlmsContent = buildLlmsTxt(GLOBAL_INFO, GALLERY_ITEMS, STUDIO_ITEMS, AWARD_ITEMS, FAQ_ITEMS);
        }
        return cachedLlmsContent;
    }

    return {
        name: 'wedding-seo-plugin',

        // Read VITE_SITE_URL from the resolved Vite config/env so JSON-LD and
        // llms.txt use an absolute URL once it's set, matching index.html's
        // %VITE_SITE_URL% substitution.
        configResolved(resolvedConfig) {
            SITE_URL = (resolvedConfig.env && resolvedConfig.env.VITE_SITE_URL) || '';
        },

        // Serve llms.txt in local development mode
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url === '/llms.txt') {
                    const content = await getLlmsContent();
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                    res.end(content);
                } else {
                    next();
                }
            });
        },

        // This hook runs when Vite generates or serves index.html
        async transformIndexHtml(html) {
            try {
                const globalInfo = GLOBAL_INFO;
                const projects = GALLERY_ITEMS;
                const studio = STUDIO_ITEMS;
                const awards = AWARD_ITEMS;
                const faqList = FAQ_ITEMS;

                const siteTitle = globalInfo.siteTitle;
                const siteDescription = globalInfo.siteDescription;
                const aboutMe = globalInfo.aboutMe;

                // Cache llms.txt content for later bundle emission
                cachedLlmsContent = buildLlmsTxt(globalInfo, projects, studio, awards, faqList);

                // ====== PART 1: Build the semantic HTML string ======
                let seoHtml = `\n<div id="seo-content" class="sr-only-seo">\n`;
                
                seoHtml += `  <header>\n`;
                seoHtml += `    <h1>${siteTitle}</h1>\n`;
                seoHtml += `    <p>${siteDescription}</p>\n`;
                seoHtml += `  </header>\n`;

                seoHtml += `  <section id="about">\n`;
                seoHtml += `    <h2>Our Story</h2>\n`;
                seoHtml += `    <p>${aboutMe}</p>\n`;
                if (globalInfo.githubUrl) seoHtml += `    <a href="${globalInfo.githubUrl}">GitHub</a>\n`;
                if (globalInfo.instagramUrl) seoHtml += `    <a href="${globalInfo.instagramUrl}">Instagram</a>\n`;
                seoHtml += `  </section>\n`;

                if (projects && projects.length > 0) {
                    seoHtml += `  <section id="projects">\n    <h2>Photos & Moments</h2>\n    <ul>\n`;
                    projects.forEach(p => {
                        seoHtml += `      <li>\n        <h3>${p.seoTitle || p.title}</h3>\n        <p>${p.seoDescription || p.description || ''}</p>\n        ${p.url ? `<a href="${p.url}">View</a>\n` : ''}      </li>\n`;
                    });
                    seoHtml += `    </ul>\n  </section>\n`;
                }

                if (studio && studio.length > 0) {
                    seoHtml += `  <section id="studio">\n    <h2>Updates</h2>\n    <ul>\n`;
                    studio.forEach(s => {
                        seoHtml += `      <li>\n        <h3>${s.seoTitle || s.title}</h3>\n        <p>${s.seoDescription || s.description || ''}</p>\n        ${s.url ? `<a href="${s.url}">View</a>\n` : ''}      </li>\n`;
                    });
                    seoHtml += `    </ul>\n  </section>\n`;
                }

                // FAQ Section (GEO/AI search optimizer fallback)
                if (faqList && faqList.length > 0) {
                    seoHtml += `  <section id="faq">\n`;
                    seoHtml += `    <h2>Frequently Asked Questions (FAQ)</h2>\n`;
                    faqList.forEach(item => {
                        seoHtml += `    <article>\n`;
                        seoHtml += `      <h3>${item.question}</h3>\n`;
                        seoHtml += `      <p>${item.answer}</p>\n`;
                        seoHtml += `    </article>\n`;
                    });
                    seoHtml += `  </section>\n`;
                }

                seoHtml += `</div>\n`;

                // ====== PART 2: Build dynamic JSON-LD ======
                const jsonLdSchemas = buildJsonLd(globalInfo, projects, studio, awards, faqList);
                const jsonLdScript = `\n  <!-- Dynamic Structured Data (JSON-LD) — generated at build time -->\n  <script type="application/ld+json">\n${JSON.stringify(jsonLdSchemas, null, 2)}\n  </script>\n`;

                // ====== PART 3: Transform HTML ======
                // Update the <title> tag
                let transformedHtml = html.replace(
                    /<title>(.*?)<\/title>/,
                    `<title>${siteTitle}</title>`
                );
                
                // Add or replace meta description
                if (transformedHtml.includes('<meta name="description"')) {
                    transformedHtml = transformedHtml.replace(
                        /<meta name="description" content="(.*?)"\s*\/?>/,
                        `<meta name="description" content="${siteDescription}" />`
                    );
                } else {
                    transformedHtml = transformedHtml.replace(
                        '</head>',
                        `  <meta name="description" content="${siteDescription}" />\n</head>`
                    );
                }

                // Update Open Graph dynamic metadata
                transformedHtml = transformedHtml
                    .replace(
                        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
                        `<meta property="og:title" content="${siteTitle}" />`
                    )
                    .replace(
                        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
                        `<meta property="og:description" content="${siteDescription}" />`
                    );

                // Rewrite og:url / og:image / twitter:image to absolute URLs once
                // VITE_SITE_URL is set (social link-preview scrapers require an
                // absolute image URL — a relative path often fails silently).
                if (SITE_URL) {
                    transformedHtml = transformedHtml
                        .replace(
                            /<meta\s+property="og:url"\s+content="\/"\s*\/?>/i,
                            `<meta property="og:url" content="${SITE_URL}/" />`
                        )
                        .replace(
                            /<meta\s+property="og:image"\s+content="\/og-image\.webp"\s*\/?>/i,
                            `<meta property="og:image" content="${SITE_URL}/og-image.webp" />`
                        )
                        .replace(
                            /<meta\s+name="twitter:image"\s+content="\/og-image\.webp"\s*\/?>/i,
                            `<meta name="twitter:image" content="${SITE_URL}/og-image.webp" />`
                        );
                }

                // Update Twitter card dynamic metadata
                transformedHtml = transformedHtml
                    .replace(
                        /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
                        `<meta name="twitter:title" content="${siteTitle}" />`
                    )
                    .replace(
                        /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
                        `<meta name="twitter:description" content="${siteDescription}" />`
                    );

                // Inject dynamic JSON-LD right before </head> (next to the existing static one)
                transformedHtml = transformedHtml.replace('</head>', `${jsonLdScript}</head>`);

                // Replace the static placeholder with the dynamic one to prevent duplicate #seo-content and double h1s
                if (transformedHtml.includes('id="seo-content"')) {
                    transformedHtml = transformedHtml.replace(
                        /<div id="seo-content" class="sr-only-seo">[\s\S]*?<\/div>/,
                        seoHtml
                    );
                } else {
                    // Fallback injection if the template doesn't contain the static block
                    transformedHtml = transformedHtml.replace('</body>', `${seoHtml}</body>`);
                }

                return transformedHtml;
            } catch (error) {
                console.error('SEO Plugin Error: Failed to build HTML', error);
                // Return original HTML on failure so we don't break the build
                return html;
            }
        },

        // Emit llms.txt to the build output directory
        async generateBundle() {
            const content = await getLlmsContent();
            this.emitFile({
                type: 'asset',
                fileName: 'llms.txt',
                source: content
            });
        }
    };
}
