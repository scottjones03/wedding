/**
 * Studio Content Data
 * 
 * This file contains all content items for ENGAGEMENT STUDIO monitor tower.
 * Each item will be displayed on a monitor in the tower.
 * 
 * Platforms: 'youtube', 'blog', 'tiktok'
 */

export const PLATFORM_CONFIG = {
    youtube: {
        color: '#FF0000',
        accentColor: '#cc0000',
        icon: '▶',
        label: 'YouTube',
        shape: 'tv', // Wide CRT style
    },
    blog: {
        color: '#4A90D9',
        accentColor: '#2d6cb5',
        icon: '📝',
        label: 'Blog',
        shape: 'monitor', // Thin desktop monitor
    },
    tiktok: {
        color: '#00F2EA',
        accentColor: '#FF0050',
        icon: '🎵',
        label: 'TikTok',
        shape: 'phone', // Vertical phone
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
    // ============ YouTube Videos ============
    {
        id: 'yt-001',
        platform: 'youtube',
        title: 'Save the Date! 💍',
        description: 'We\'re getting married! Watch our save-the-date video and get ready to celebrate with us.',
        frontTexture: '/engagement/IMG_8927.webp',
        paintedFrontTexture: '/engagement/IMG_8927.webp',
        thumbnail: null,
        url: '',
        date: '2026-01-10',
        views: '',
        duration: '',
    },
    {
        id: 'yt-002',
        platform: 'youtube',
        title: 'How We Got Engaged 💕',
        description: 'The story behind the proposal — watch how it all happened.',
        frontTexture: '/engagement/IMG_8879.webp',
        paintedFrontTexture: '/engagement/IMG_8879.webp',
        thumbnail: null,
        url: '',
        date: '2025-10-11',
        views: '',
        duration: '',
    },
    {
        id: 'yt-003',
        platform: 'youtube',
        title: 'Our Engagement Video',
        description: 'A short film about our journey together.',
        thumbnail: null,
        url: '',
        date: '2025-12-28',
        views: '',
        duration: '',
    },

    // ============ Blog Posts ============
    {
        id: 'blog-001',
        platform: 'blog',
        title: 'Save the Date Announcement',
        description: 'We\'re so excited to share the news — mark your calendars!',
        frontTexture: '/engagement/IMG_8885.webp',
        paintedFrontTexture: '/engagement/IMG_8885.webp',
        thumbnail: null,
        url: '',
        date: '2026-01-08',
        readTime: '2 min',
    },
    {
        id: 'blog-002',
        platform: 'blog',
        title: 'Our Story',
        description: 'How we met and fell in love.',
        thumbnail: null,
        url: '',
        date: '2025-12-20',
        readTime: '5 min',
    },
    {
        id: 'blog-003',
        platform: 'blog',
        title: 'Wedding Details',
        description: 'Everything you need to know about the big day.',
        thumbnail: null,
        url: '',
        date: '2025-12-10',
        readTime: '3 min',
    },

    // ============ TikToks ============
    {
        id: 'tt-001',
        platform: 'tiktok',
        title: 'Follow our wedding journey! ✨',
        description: 'Follow along as we plan our big day.',
        frontTexture: '/engagement/IMG_8878.webp',
        paintedFrontTexture: '/engagement/IMG_8878.webp',
        thumbnail: null,
        url: '',
        date: '2026-01-09',
        views: '',
        likes: '',
    },
    {
        id: 'tt-002',
        platform: 'tiktok',
        title: 'Getting ready for the big day 💍',
        description: 'Behind the scenes of wedding prep.',
        thumbnail: null,
        url: '',
        date: '2026-01-03',
        views: '',
        likes: '',
    },
    {
        id: 'tt-003',
        platform: 'tiktok',
        title: 'Save the date countdown ⏳',
        description: 'Counting down the days!',
        thumbnail: null,
        url: '',
        date: '2025-12-25',
        views: '',
        likes: '',
    },
];

const ytTextures = ['/engagement/IMG_8927.webp', '/engagement/IMG_8879.webp'];
const ytPaintedTextures = ['/engagement/IMG_8927.webp', '/engagement/IMG_8879.webp'];
const blogTextures = ['/engagement/IMG_8885.webp'];
const blogPaintedTextures = ['/engagement/IMG_8885.webp'];
const ttTextures = ['/engagement/IMG_8878.webp'];
const ttPaintedTextures = ['/engagement/IMG_8878.webp'];

let ytIdx = 0, blogIdx = 0, ttIdx = 0;
let ytPIdx = 0, blogPIdx = 0, ttPIdx = 0;

export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    return {
        ...item,
        frontTexture: item.frontTexture || (
            item.platform === 'youtube' ? ytTextures[ytIdx++ % ytTextures.length] :
                item.platform === 'blog' ? blogTextures[blogIdx++ % blogTextures.length] :
                    ttTextures[ttIdx++ % ttTextures.length]
        ),
        paintedFrontTexture: item.paintedFrontTexture || (
            item.platform === 'youtube' ? ytPaintedTextures[ytPIdx++ % ytPaintedTextures.length] :
                item.platform === 'blog' ? blogPaintedTextures[blogPIdx++ % blogPaintedTextures.length] :
                    ttPaintedTextures[ttPIdx++ % ttPaintedTextures.length]
        )
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
