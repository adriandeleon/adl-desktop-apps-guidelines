# Pauta (adl desktop apps guidelines): agent guide

**Pauta** is the name; its mark and social card live in `branding/` (see `branding/README.md`). A documentation site (Astro Starlight) holding the UI/UX/platform guidelines for adl's JavaFX desktop apps.
Editora (`../Editora`) is the reference implementation.

## Commands

- `npm run dev` — local site at http://localhost:4321/ (one edition, at the root)
- `npm run print` — builds `public/downloads/` (PDF + single Markdown); needs pandoc, python3 and Chrome
- `npm run build` — the whole site into `dist/`: this edition at `latest/` and `<version>/`, every earlier edition
  from the `versions` branch, the root redirects (see **Editions on the site**)
- `npm run preview` — serves `dist/` as deployed, at http://localhost:4321/
- `npm run check` — fails on a malformed rule (`scripts/check-rules.mjs`); `npm run build` runs it first

## Rules

- Pages are Markdown in `src/content/docs/`. Adding, removing or reordering a page means editing `pages.json`
  too: it drives both the sidebar and the PDF. The one page outside it is `changelog.mdx`, rendered from
  `CHANGELOG.md` by `src/components/Changelog.astro` (as is *What's new* on the overview); its sidebar entry is in
  `astro.config.mjs` and the PDF has no changelog.
- A rule states a level (MUST / SHOULD / MAY) and names the Editora class or file it comes from. Verify claims
  against the apps' code on their default branch, not from memory; when Editora and the guide disagree, the code
  wins and the guide is fixed in the same change.
- **Rule IDs**: every rule is a list item, never a table row, that opens with `**KBD-07 · MUST.**`, one testable
  statement, then sub-items `*Why:*` (only when there is a reason worth stating), `*Check (code|test|by
  hand):*` (how an agent or a person verifies it in an app: what to grep or read, which test holds it, or what to do
  in the running app) and `*Reference:*` (the Editora file, or the app that does it, or "no app yet"). IDs are
  permanent: never renumber or reuse one; a removed rule's ID stays retired. `src/lib/rehype-status.mjs` makes the
  item its anchor (`#kbd-07`) and `scripts/print-markup.py` renders it for print; `src/lib/rules.mjs` reads the
  rules for `npm run check` and for what coding agents read, which every edition serves: `rules.json`, `llms.txt`
  (also at the site root) and `llms-full.txt` (`src/pages/*.js`, `src/lib/llms.mjs`). Change all of them if the
  syntax changes.
  A rule that the checklist lists is a MUST unless the checklist says SHOULD; a rule it doesn't list is a SHOULD.
  One prefix per page: PLAT platform, REPO repository, DOCS documentation, QUAL quality, PERF performance, KBD
  keyboard, WIN window-shell, ICON icons-and-color, TBAR toolbars-and-tooltips, TABS tabs-and-panels, MENU menus,
  TRAY tray-and-background, SET settings, DIAG diagnostics, CLI command-line, INTL i18n, REL release; templates PAL,
  QOPEN, WELC, ABOUT, CONF, FIND, MLOG, SYNC. A new rule takes the page's next free number, wherever it sits.
  Template pages keep their mockups and spec tables; their requirements are rules under `## Rules`.
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
- **Editions on the site.** Every page is served under its edition: `https://pauta-project.dev/1.4.0/principles/` is
  permanent, `https://pauta-project.dev/latest/principles/` is always the newest edition, and the unnumbered address
  redirects to `latest/`. `scripts/build-site.mjs` (`npm run build`) builds this checkout twice, with `PAUTA_PATH`
  `latest` and the version (`astro.config.mjs` puts it in `base` and `outDir`), lays the earlier editions beside them
  from the `versions` branch, copies `CNAME`, `404.html`, `versions.js` and `downloads/` to the root for GitHub Pages,
  and writes `versions.json`, the list every page reads (`public/versions.js`) to offer editions published after it
  and, on an earlier edition, to point at the latest. The header's switcher (`src/components/EditionSelect.astro`, in the
  phone menu through `MobileMenuFooter.astro`) and the footer link the same page in another edition; a numbered folder carries `noindex`, so search engines index `latest/`.
  The `versions` branch holds one folder per published edition and nothing else: CI runs `scripts/archive-edition.sh
  --push` after each push to `master`, so the edition just deployed joins it (a rebuild replaces the folder). Never
  edit that branch by hand; a lost or pre-1.4.0 edition is rebuilt from its tag with `scripts/archive-tag.sh vX.Y.Z`
  and archived with `scripts/archive-edition.sh build/editions/X.Y.Z`. Pages link with relative paths or
  `import.meta.env.BASE_URL`, which already includes the edition folder; `src/lib/site.mjs` gives the site root and
  the edition a page is served from.
- **Where the site lives.** `package.json`'s `guidelines.url` is the only place the site's address is written;
  `astro.config.mjs` derives `site` and `base` from it, and the PDF and Markdown downloads print it. Pages link
  with relative paths or `import.meta.env.BASE_URL`, never a hard-coded `/adl-desktop-apps-guidelines/`.
  To move to a custom domain: set the URL (for example `https://pauta-project.dev/`), add `public/CNAME` with the
  bare domain, set the domain in the repository's Pages settings, and update the links in `README.md`.
