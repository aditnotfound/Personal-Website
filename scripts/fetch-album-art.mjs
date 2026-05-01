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
	{ title: 'Driving', artist: 'DWLLRS', slug: 'driving-dwllrs' },
	{ title: 'Creep', artist: 'Radiohead', slug: 'creep-radiohead' },
	{ title: 'Back to Friends', artist: 'sombr', slug: 'back-to-friends-sombr' },
	{ title: 'Apocalypse', artist: 'Cigarettes After Sex', slug: 'apocalypse-cigarettes-after-sex' },
	{ title: 'Off My Mind', artist: 'Joe P', slug: 'off-my-mind-joe-p' },
	{ title: 'Now I Know You', artist: 'Bennett Coast', slug: 'now-i-know-you-bennett-coast' },
	{
		title: 'Cigarette Daydreams',
		artist: 'Cage the Elephant',
		slug: 'cigarette-daydreams-cage-the-elephant',
	},
	{ title: 'Superman', artist: 'Mishaal Tamer', slug: 'superman-mishaal-tamer' },
	{
		title: 'Brown Eyes and Backwoods',
		artist: 'Tom the Mail Man',
		slug: 'brown-eyes-and-backwoods-tom-the-mail-man',
	},
	{ title: 'Tattoos', artist: 'Artemas', slug: 'tattoos-artemas' },
	{ title: 'Love Again', artist: 'The Kid LAROI', slug: 'love-again-the-kid-laroi' },
	{ title: 'Feeling Whitney', artist: 'Post Malone', slug: 'feeling-whitney-post-malone' },
	{ title: 'twenty seven', artist: 'Ethan Marc', slug: 'twenty-seven-ethan-marc' },
	{ title: 'The Color Violet', artist: 'Tory Lanez', slug: 'the-color-violet-tory-lanez' },
	{
		title: 'Travelling Alone',
		artist: 'Tom the Mail Man',
		slug: 'travelling-alone-tom-the-mail-man',
	},
];

await mkdir(outDir, { recursive: true });

for (const t of tracks) {
	const term = encodeURIComponent(`${t.title} ${t.artist}`);
	const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=5`;
	let hit;
	try {
		const res = await fetch(url);
		const data = await res.json();
		hit = data.results?.find((r) =>
			r.artistName?.toLowerCase().includes(t.artist.toLowerCase().split(' ')[0])
		) ?? data.results?.[0];
	} catch (e) {
		console.warn(`! search failed for ${t.title} - ${t.artist}:`, e.message);
		continue;
	}
	if (!hit) {
		console.warn(`! no hit for ${t.title} - ${t.artist}`);
		continue;
	}
	const big = hit.artworkUrl100.replace(/100x100bb/, '600x600bb');
	try {
		const imgRes = await fetch(big);
		const buf = Buffer.from(await imgRes.arrayBuffer());
		await writeFile(path.join(outDir, `${t.slug}.jpg`), buf);
		console.log(`ok   ${t.slug}  <- ${hit.trackName} / ${hit.artistName}`);
	} catch (e) {
		console.warn(`! download failed for ${t.slug}:`, e.message);
	}
}
