/**
 * Removes baked-in checkerboard / flat BG by flood-filling from image edges
 * through non-blocking pixels (dark outline pixels block, like sprite edges).
 */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const inputPath = path.join(root, 'public', 'avatar.png');
const outputPath = inputPath;

function lum(r, g, b) {
	return 0.299 * r + 0.587 * g + 0.114 * b;
}

function sat(r, g, b) {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	return max === 0 ? 0 : (max - min) / max;
}

/** True = flood cannot pass through (sprite outline / dark ink). */
function isBlocking(r, g, b, a) {
	if (a < 8) return false;
	if (r + g + b < 70) return true;
	if (Math.max(r, g, b) < 55 && r + g + b < 120) return true;
	return false;
}

/** Border pixels that look like “outside” (checker / paper / empty). */
function isOuterSeed(r, g, b, a) {
	if (a < 12) return true;
	const l = lum(r, g, b);
	const s = sat(r, g, b);
	if (l > 245 && s < 0.08) return true;
	if (l > 175 && s < 0.12) return true;
	if (l > 155 && s < 0.06) return true;
	return false;
}

async function main() {
	const buf = await readFile(inputPath);
	const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	const w = info.width;
	const h = info.height;
	const src = new Uint8ClampedArray(data);
	const out = new Uint8ClampedArray(src);
	const visited = new Uint8Array(w * h);

	const q = [];
	const push = (x, y) => {
		const i = y * w + x;
		if (visited[i]) return;
		visited[i] = 1;
		q.push([x, y]);
	};

	for (let x = 0; x < w; x++) {
		for (const y of [0, h - 1]) {
			const i = (y * w + x) * 4;
			const [r, g, b, a] = [src[i], src[i + 1], src[i + 2], src[i + 3]];
			if (!isOuterSeed(r, g, b, a)) continue;
			if (isBlocking(r, g, b, a)) continue;
			push(x, y);
		}
	}
	for (let y = 0; y < h; y++) {
		for (const x of [0, w - 1]) {
			const i = (y * w + x) * 4;
			const [r, g, b, a] = [src[i], src[i + 1], src[i + 2], src[i + 3]];
			if (!isOuterSeed(r, g, b, a)) continue;
			if (isBlocking(r, g, b, a)) continue;
			push(x, y);
		}
	}

	let qi = 0;
	while (qi < q.length) {
		const [x, y] = q[qi++];
		const dirs = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
		];
		for (const [dx, dy] of dirs) {
			const nx = x + dx;
			const ny = y + dy;
			if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
			const ni = ny * w + nx;
			if (visited[ni]) continue;
			const i = ni * 4;
			const r = src[i];
			const g = src[i + 1];
			const b = src[i + 2];
			const a = src[i + 3];
			if (isBlocking(r, g, b, a)) continue;
			push(nx, ny);
		}
	}

	for (let i = 0; i < visited.length; i++) {
		if (!visited[i]) continue;
		const p = i * 4;
		out[p + 3] = 0;
	}

	const trimmed = await sharp(Buffer.from(out.buffer), {
		raw: { width: w, height: h, channels: 4 },
	})
		.png({ compressionLevel: 9 })
		.trim()
		.toBuffer();

	await sharp(trimmed).toFile(outputPath);
	console.log('Wrote', outputPath);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
