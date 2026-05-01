// @ts-check
import { defineConfig } from 'astro/config';

/**
 * GitHub Pages URLs:
 * - User/organization site: repo named `username.github.io` → served at site root (`base: '/'`).
 * - Project site: served at `https://OWNER.github.io/REPO/` → `base: '/REPO/'`.
 * In GitHub Actions, `GITHUB_REPOSITORY` is `owner/repo`.
 */
const [ghOwner, ghRepo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const ownerLc = ghOwner?.toLowerCase() ?? '';
const repoLc = ghRepo?.toLowerCase() ?? '';
const isUserPagesRepo = Boolean(ownerLc && repoLc && repoLc === `${ownerLc}.github.io`);
const site = ownerLc ? `https://${ownerLc}.github.io` : undefined;
const base = ownerLc && !isUserPagesRepo ? `/${ghRepo}/` : '/';

// https://docs.astro.build/en/guides/deploy/github/
export default defineConfig({
	site,
	base,
});
