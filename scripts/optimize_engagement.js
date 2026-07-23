/**
 * Optimizes the real engagement photos in public/engagement/.
 *
 * Camera originals here are huge (8192x5464, 5-16MB each) which is way too
 * large to ship on the web. This resizes them down to a sane max dimension
 * and converts them to compressed .webp, backing up the untouched originals
 * to public/engagement/backups/ first.
 *
 * Usage: node scripts/optimize_engagement.js
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_DIR = path.resolve('public/engagement');
const BACKUP_DIR = path.join(TARGET_DIR, 'backups');
const MAX_DIMENSION = 2000; // Long edge, still sharp for the up-close "inspect" zoom
const QUALITY = 82;

async function run() {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });

    const files = fs.readdirSync(TARGET_DIR).filter(f => /\.(jpe?g|png)$/i.test(f));

    for (const file of files) {
        const srcPath = path.join(TARGET_DIR, file);
        const backupPath = path.join(BACKUP_DIR, file);
        const outName = file.replace(/\.(jpe?g|png)$/i, '.webp');
        const outPath = path.join(TARGET_DIR, outName);

        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(srcPath, backupPath);
        }

        const meta = await sharp(srcPath).metadata();
        console.log(`Optimizing ${file}: ${meta.width}x${meta.height} -> webp (max ${MAX_DIMENSION}px)`);

        await sharp(srcPath)
            .rotate() // Apply EXIF orientation before resizing
            .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: QUALITY })
            .toFile(outPath);

        fs.unlinkSync(srcPath);
    }

    console.log('Done.');
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
