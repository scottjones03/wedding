import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// Sanity CMS is disabled for this site (Scott & Georgina's Wedding).
// Keeping 'not-configured' as a placeholder means isSanityConfigured (see
// useSanityData.js) evaluates to false, so no network calls are made and the
// app runs entirely on the local hardcoded fallback content — no CMS account
// required, and the build works fully offline.
// NOTE: Sanity's client validates projectId against /^[a-z0-9-]+$/, so the
// placeholder must only use lowercase letters, digits, and dashes.
export const sanityClient = createClient({
    projectId: 'not-configured',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2024-03-01',
});

const builder = createImageUrlBuilder(sanityClient);

// Funkcja pomocnicza do generowania adresów URL obrazków z Sanity
export const urlFor = (source) => builder.image(source);

// Funkcja pomocnicza do zamiany domeny Sanity na proxy w Cloudflare
export const getProxyUrl = (imageBuilder) => {
    if (!imageBuilder) return null;
    const url = imageBuilder.url();
    if (url && typeof window !== 'undefined') {
        return url.replace('https://cdn.sanity.io', '/sanity-cdn');
    }
    return url;
};
