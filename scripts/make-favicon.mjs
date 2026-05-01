/**
 * Generates a favicon by cropping the head region from a sprite image.
 *
 * Usage:
 *   node scripts/make-favicon.mjs <source-image.png>
 *
 * Output:
 *   public/favicon.png   (256x256, transparent bg)
 */
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const source = process.argv[2];

if (!source) {
	console.error('usage: node scripts/make-favicon.mjs <source-image.png>');
	process.exit(1);
}

const outputPath = path.join(root, 'public', 'favicon.png');

const img = sharp(source);
const meta = await img.metadata();
if (!meta.width || !meta.height) {
	throw new Error('could not read image metadata');
}

const trimmed = await sharp(source).trim().toBuffer({ resolveWithObject: true });
const tWidth = trimmed.info.width;
const tHeight = trimmed.info.height;

const headHeight = Math.round(tHeight * 0.36);
const side = Math.min(tWidth, headHeight);
const left = Math.max(0, Math.round((tWidth - side) / 2));

await sharp(trimmed.data)
	.extract({ left, top: 0, width: side, height: side })
	.resize(256, 256, {
		kernel: sharp.kernel.nearest,
		fit: 'contain',
		background: { r: 0, g: 0, b: 0, alpha: 0 },
	})
	.png({ compressionLevel: 9 })
	.toFile(outputPath);

console.log('wrote', outputPath);
