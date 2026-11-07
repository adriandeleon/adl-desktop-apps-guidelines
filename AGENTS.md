# Pauta (adl desktop apps guidelines): agent guide

**Pauta** is the name; its mark and social card live in `branding/` (see `branding/README.md`). A documentation site (Astro Starlight) holding the UI/UX/platform guidelines for adl's JavaFX desktop apps.
Editora (`../Editora`) is the reference implementation.

## Commands

- `npm run dev` — local site at http://localhost:4321/
- `npm run print` — builds `public/downloads/` (PDF + single Markdown); needs pandoc, python3 and Chrome
- `npm run build` — static site into `dist/`

## Rules

- Pages are Markdown in `src/content/docs/`. Adding, removing or reordering a page means editing `pages.json`
  too: it drives both the sidebar and the PDF. The one page outside it is `changelog.mdx`, rendered from
  `CHANGELOG.md` by `src/components/Changelog.astro` (as is *What's new* on the overview); its sidebar entry is in
  `astro.config.mjs` and the PDF has no changelog.
- A rule states a level (MUST / SHOULD / MAY) and names the Editora class or file it comes from. Verify claims
  against the apps' code on their default branch, not from memory; when Editora and the guide disagree, the code
  wins and the guide is fixed in the same change.
- Feature matrix cells start with `●`, `◐` or `—` (rendered as dots by `src/lib/rehype-status.mjs`; the print
  build does the same in `scripts/print-markup.py`). Change both if the convention changes.
- Plain, direct sentences written for the app developer. No marketing copy. American spelling throughout (color,
  behavior, gray, license, customize, canceled), in pages, the changelog, the README and comments alike.
- **Every content change is an edition.** A change to what a reader takes as guidance (a page under
  `src/content/docs/`, `pages.json`, the checklist, the matrix, a screenshot) bumps the version in `package.json` in
  the same commit and is described under its `## [x.y.z] - YYYY-MM-DD` section in `CHANGELOG.md` (Keep a Changelog).
  `## [Unreleased]` holds nothing when a change lands on `master`. Site work alone (styles, scripts, the build,
  branding) rides along with the next edition and needs none of its own.
- Screenshots live in `src/assets/shots/<app>-<what>.png` (max 1600 px wide, palette PNG). In a page, put an
  image alone in a paragraph with a title (`![alt](../../assets/shots/x.png "Caption.")`); several images in one
  paragraph become a gallery row. Captions describe what the image shows, in one sentence.
- Never commit `dist/`, `build/` or `public/downloads/`.
- **Editions.** `package.json` holds the version and `guidelines.date`; the footer, the hero, *What's new*, the
  Changelog page, the PDF and the Markdown download read them from there. To publish one: set the version and the date
  in `package.json`, head its changelog section `## [x.y.z] - YYYY-MM-DD`, commit, tag `vx.y.z`. A new or stronger
  rule is a minor version, a new MUST that existing apps fail is a major one, wording and facts a patch.
- **Where the site lives.** `package.json`'s `guidelines.url` is the only place the site's address is written;
  `astro.config.mjs` derives `site` and `base` from it, and the PDF and Markdown downloads print it. Pages link
  with relative paths or `import.meta.env.BASE_URL`, never a hard-coded `/adl-desktop-apps-guidelines/`.
  To move to a custom domain: set the URL (for example `https://pauta-project.dev/`), add `public/CNAME` with the
  bare domain, set the domain in the repository's Pages settings, and update the links in `README.md`.
