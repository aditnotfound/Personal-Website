# Personal website

Minimal, typography-first personal site using [Astro](https://astro.build/) and Markdown, ready for [GitHub Pages](https://pages.github.com/).

## Develop locally

```sh
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:4321`). Edit Markdown in `src/pages/` and shared chrome in `src/layouts/BaseLayout.astro` and `src/styles/global.css`.

## Customize

- Replace **Your Name** and the `<title>` pattern in [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro).
- Update copy in [`src/pages/index.md`](src/pages/index.md), [`src/pages/about.md`](src/pages/about.md), and [`src/pages/writing.md`](src/pages/writing.md).
- Add pages by creating new `.md` files under `src/pages/` and linking them from the nav in `BaseLayout.astro`.

## Deploy to GitHub Pages

1. Create a repository on GitHub and push this project (`main` branch). If your default branch is not `main`, change the branch name in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) or rename the branch on GitHub.
2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**.
3. Push a commit to `main`. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it.

### URL and `base` path

[`astro.config.mjs`](astro.config.mjs) sets `site` and `base` from `GITHUB_REPOSITORY` during the Actions build:

- If the repository name is `yourusername.github.io`, the site is served at `https://yourusername.github.io/` with `base: '/'`.
- For any other repository `owner/repo`, the site is served at `https://owner.github.io/repo/` and `base` is set to `/repo/`.

For local builds, `site` is omitted unless you set `GITHUB_REPOSITORY` yourself (optional for testing).

### Verify the live site

After the first successful workflow run, open **Settings → Pages** to see the **Visit site** link, or go to `https://<owner>.github.io/` or `https://<owner>.github.io/<repo>/` as above.

## Commands

| Command           | Action                          |
| ----------------- | ------------------------------- |
| `npm install`     | Install dependencies            |
| `npm run dev`     | Local dev server                  |
| `npm run build`   | Production build to `./dist/`   |
| `npm run preview` | Preview the production build      |

See the [Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/) for more detail.
