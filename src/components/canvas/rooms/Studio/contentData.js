/**
 * Studio Content Data
 * 
 * This file contains all content items for ENGAGEMENT STUDIO monitor tower.
 * Each item will be displayed on a monitor in the tower.
 * 
 * Platforms: 'video', 'blog'
 */

export const PLATFORM_CONFIG = {
    video: {
        color: '#FF0000',
        accentColor: '#cc0000',
        icon: '▶',
        label: 'Video',
        shape: 'tv', // Wide CRT style
    },
    blog: {
        color: '#4A90D9',
        accentColor: '#2d6cb5',
        icon: '📝',
        label: 'Blog',
        shape: 'monitor', // Thin desktop monitor
    },
    instagram: {
        color: '#E1306C',
        accentColor: '#C13584',
        icon: '📷',
        label: 'Instagram',
        shape: 'phone',
    },
    x: {
        color: '#000000',
        accentColor: '#14171A',
        icon: '𝕏',
        label: 'X (Twitter)',
        shape: 'monitor',
    },
    linkedin: {
        color: '#0077B5',
        accentColor: '#005E93',
        icon: 'in',
        label: 'LinkedIn',
        shape: 'monitor',
    },
    codrops: {
        color: '#0099FF',
        accentColor: '#0077CC',
        icon: '💧',
        label: 'Codrops',
        shape: 'monitor',
    },
};

// Placeholder wedding content — replace title/description/url with your own,
// and drop your own images at the same frontTexture/paintedFrontTexture paths in public/.
const RAW_CONTENT_DATA = [
    // ============ Proposal Video ============
    {
        id: 'yt-001',
        platform: 'video',
        title: 'Watch Our Proposal Film',
        description: 'Open our website video room to watch the full proposal film.',
        frontTexture: '/engagement/IMG_8927.webp',
        paintedFrontTexture: '/engagement/IMG_8927.webp',
        thumbnail: null,
        url: 'video:proposal',
        date: '2026-05-15',
        views: '',
        duration: '',
        actionLabel: 'Play Proposal Video',
    },

    // ============ Blog Posts ============
    {
        id: 'blog-001',
        platform: 'blog',
        title: 'Save the Date Announcement',
        description: 'We\'re so excited to share the news — mark your calendars!',
        frontTexture: '/engagement/IMG_8885.webp',
        paintedFrontTexture: '/engagement/IMG_8885.webp',
        thumbnail: '/engagement/IMG_8885.webp',
        url: 'page:basics',
        date: '2026-01-08',
        readTime: '2 min',
        actionLabel: 'Open Wedding Basics',
    },
    {
        id: 'blog-002',
        platform: 'blog',
        title: 'Our Story',
        description: 'How we met and fell in love.',
        frontTexture: '/engagement/IMG_8865.webp',
        paintedFrontTexture: '/engagement/IMG_8865.webp',
        thumbnail: '/engagement/IMG_8865.webp',
        url: 'room:gallery',
        date: '2025-12-20',
        readTime: '5 min',
        actionLabel: 'Open Photo Gallery',
    },
    {
        id: 'blog-003',
        platform: 'blog',
        title: 'Wedding FAQ',
        description: 'Dress code, children, plus-ones, parking, and photos.',
        frontTexture: '/engagement/IMG_8864.webp',
        paintedFrontTexture: '/engagement/IMG_8864.webp',
        thumbnail: '/engagement/IMG_8864.webp',
        url: 'page:faq',
        date: '2025-12-10',
        readTime: '3 min',
        actionLabel: 'Open FAQ Page',
    },
    {
        id: 'blog-004',
        platform: 'blog',
        title: 'Weekend Schedule',
        description: 'See the ceremony, reception, and weekend timeline.',
        frontTexture: '/engagement/IMG_8870.webp',
        paintedFrontTexture: '/engagement/IMG_8870.webp',
        thumbnail: '/engagement/IMG_8870.webp',
        url: 'page:schedule',
        date: '2025-12-05',
        readTime: '3 min',
        actionLabel: 'Open Schedule',
    },
    {
        id: 'blog-005',
        platform: 'blog',
        title: 'Travel and Accommodation',
        description: 'Find airport, train, taxi, and stay details.',
        frontTexture: '/engagement/IMG_8877.webp',
        paintedFrontTexture: '/engagement/IMG_8877.webp',
        thumbnail: '/engagement/IMG_8877.webp',
        url: 'page:travel',
        date: '2025-11-28',
        readTime: '3 min',
        actionLabel: 'Open Travel Details',
    },
    {
        id: 'blog-006',
        platform: 'blog',
        title: 'Venue Policies & Accessibility',
        description: 'Food, drink, payments, pets, and accessibility info.',
        frontTexture: '/engagement/IMG_8885.webp',
        paintedFrontTexture: '/engagement/IMG_8885.webp',
        thumbnail: '/engagement/IMG_8885.webp',
        url: 'page:venue-policies',
        date: '2025-11-25',
        readTime: '3 min',
        actionLabel: 'Open Venue Policies',
    },
];

const ytTextures = ['/engagement/IMG_8927.webp', '/engagement/IMG_8879.webp'];
const ytPaintedTextures = ['/engagement/IMG_8927.webp', '/engagement/IMG_8879.webp'];
const blogTextures = ['/engagement/IMG_8885.webp'];
const blogPaintedTextures = ['/engagement/IMG_8885.webp'];
let ytIdx = 0, blogIdx = 0;
let ytPIdx = 0, blogPIdx = 0;

export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    return {
        ...item,
        frontTexture: item.frontTexture || (
            item.platform === 'video' ? ytTextures[ytIdx++ % ytTextures.length] :
                blogTextures[blogIdx++ % blogTextures.length]
        ),
        paintedFrontTexture: item.paintedFrontTexture || (
            item.platform === 'video' ? ytPaintedTextures[ytPIdx++ % ytPaintedTextures.length] :
                blogPaintedTextures[blogPIdx++ % blogPaintedTextures.length]
        ),
        thumbnail: item.thumbnail || item.frontTexture || null,
    };
});

// Helper to get content by platform
export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

// Get latest content (for "On Air" indicator)
export const getLatestContent = () => {
    return [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
};
