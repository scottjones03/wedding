/**
 * Generates temporary placeholder images for public/engagement/.
 *
 * These stand in for the real engagement photos until they're added.
 * Run again any time to regenerate placeholders for missing files
 * (it will NOT overwrite a file that already exists, so real photos
 * you've already copied in are safe).
 *
 * Usage: node scripts/generate_engagement_placeholders.js
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('public/engagement');
fs.mkdirSync(OUT_DIR, { recursive: true });

const PASTELS = [
    '#f7d9d9', '#d9ecf7', '#e3f7d9', '#f7ecd9', '#ecd9f7', '#d9f7f0',
    '#f7d9ec', '#f0f7d9', '#d9e0f7', '#f7e0d9', '#dcf7d9', '#d9f7e6'
];

async function makePlaceholder(filename, width, height, label, color) {
    const destPath = path.join(OUT_DIR, filename);
    if (fs.existsSync(destPath)) {
        console.log(`Skipping ${filename} (already exists)`);
        return;
    }

    const fontSize = Math.round(width * 0.055);
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}" />
      <rect x="4%" y="4%" width="92%" height="92%" fill="none" stroke="#ffffffaa" stroke-width="6" />
      <text x="50%" y="46%" font-family="sans-serif" font-size="${fontSize}" fill="#5c4b45" text-anchor="middle">ENGAGEMENT PHOTO</text>
      <text x="50%" y="55%" font-family="sans-serif" font-size="${Math.round(fontSize * 0.6)}" fill="#5c4b45" text-anchor="middle">replace ${filename}</text>
    </svg>`;

    await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(destPath);
    console.log(`Created ${filename}`);
}

async function run() {
    // Corridor wall-frame photos (portrait, 4:5)
    for (let i = 1; i <= 12; i++) {
        await makePlaceholder(`engagement-${i}.jpg`, 900, 1125, `Photo ${i}`, PASTELS[(i - 1) % PASTELS.length]);
    }

    // Engagement Studio screens
    await makePlaceholder('studio-tv-1.jpg', 1280, 960, 'TV 1', '#e3f7d9');
    await makePlaceholder('studio-tv-2.jpg', 1280, 960, 'TV 2', '#d9ecf7');
    await makePlaceholder('studio-monitor-1.jpg', 1280, 800, 'Monitor', '#f7ecd9');
    await makePlaceholder('studio-phone-1.jpg', 720, 1280, 'Phone', '#ecd9f7');
}

run().then(() => console.log('Done.')).catch((err) => {
    console.error(err);
    process.exit(1);
});
