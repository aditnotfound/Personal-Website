/**
 * Fetches album art for each track from the iTunes Search API
 * and saves a 600x600 jpg into public/listening/.
 *
 * Run:  npm run fetch-art
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'listening');

const tracks = [
	{ title: 'rises the moon', artist: 'Liana Flores', slug: 'rises-the-moon-liana-flores' },
	{ title: 'Comfort Chain', artist: 'Instupendo', slug: 'comfort-chain-instupendo' },
	{ title: 'Van Gogh', artist: 'Virginio Aiello', slug: 'van-gogh-virginio-aiello' },
	{ title: 'Silver Linings', artist: 'Hendyamps Studios', slug: 'silver-linings-hendyamps-studios' },
	{
		title: 'La leçon particulière',
		artist: 'Francis Lai',
		slug: 'la-lecon-particuliere-francis-lai',
	},
	{
		title: 'A Flower Amidst Thorns',
		artist: 'Joshua Kyan Aalampour',
		slug: 'a-flower-amidst-thorns-joshua-kyan-aalampour',
	},
	{ title: 'Ethereal', artist: 'Txmy', slug: 'ethereal-txmy' },
	{ title: 'Solas', artist: 'Gibran Alcocer', slug: 'solas-gibran-alcocer' },
	{ title: 'the sailor song', artist: 'Gigi Perez', slug: 'the-sailor-song-gigi-perez' },
	{ title: 'As the World Caves In', artist: 'Matt Maltese', slug: 'as-the-world-caves-in-matt-maltese' },
	{ title: "I'm God", artist: 'Clams Casino', slug: 'im-god-clams-casino' },
	{ title: 'Golden Brown', artist: 'The Stranglers', slug: 'golden-brown-the-stranglers' },
	{ title: 'WILDFLOWER', artist: 'Billie Eilish', slug: 'wildflower-billie-eilish' },
	{ title: 'The Perfect Girl', artist: 'Mareux', slug: 'the-perfect-girl-mareux' },
	{ title: 'The Way You Kiss Me', artist: 'Artemas', slug: 'the-way-you-kiss-me-artemas' },
];

await mkdir(outDir, { recursive: true });

function norm(s) {
	return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function artistMatches(want, got) {
	const a = norm(want);
	const b = norm(got);
	if (!a || !b) return false;
	return a === b || b.includes(a) || a.includes(b);
}

async function itunesSearch(term, t) {
	const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=15&country=US`;
	const res = await fetch(url);
	const data = await res.json();
	const results = data.results || [];
	const matched = results.find((r) => artistMatches(t.artist, r.artistName));
	if (!matched) return null;
	return {
		title: matched.trackName,
		artist: matched.artistName,
		image: matched.artworkUrl100.replace(/100x100bb/, '600x600bb'),
	};
}

async function deezerSearch(t) {
	const q = encodeURIComponent(`track:"${t.title}" artist:"${t.artist}"`);
	const url = `https://api.deezer.com/search?q=${q}&limit=10`;
	const res = await fetch(url);
	const data = await res.json();
	const results = data.data || [];
	const matched =
		results.find((r) => artistMatches(t.artist, r.artist?.name)) ?? results[0];
	if (!matched) return null;
	const image =
		matched.album?.cover_xl ||
		matched.album?.cover_big ||
		matched.album?.cover_medium ||
		matched.album?.cover;
	if (!image) return null;
	return { title: matched.title, artist: matched.artist?.name, image };
}

for (const t of tracks) {
	let hit = null;
	try {
		hit =
			(await itunesSearch(`${t.title} ${t.artist}`, t)) ??
			(await itunesSearch(t.title, t)) ??
			(await deezerSearch(t));
	} catch (e) {
		console.warn(`! search failed for ${t.title} - ${t.artist}:`, e.message);
		continue;
	}
	if (!hit) {
		console.warn(`! no hit for ${t.title} - ${t.artist}`);
		continue;
	}
	try {
		const imgRes = await fetch(hit.image);
		const buf = Buffer.from(await imgRes.arrayBuffer());
		await writeFile(path.join(outDir, `${t.slug}.jpg`), buf);
		console.log(`ok   ${t.slug}  <- ${hit.title} / ${hit.artist}`);
	} catch (e) {
		console.warn(`! download failed for ${t.slug}:`, e.message);
	}
}
