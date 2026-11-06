# adl Desktop Apps Guidelines — agent guide

A documentation site (Astro Starlight) holding the UI/UX/platform guidelines for adl's JavaFX desktop apps.
Editora (`../Editora`) is the reference implementation.

## Commands

- `npm run dev` — local site at http://localhost:4321/adl-desktop-apps-guidelines/
- `npm run print` — builds `public/downloads/` (PDF + single Markdown); needs pandoc, python3 and Chrome
- `npm run build` — static site into `dist/`

## Rules

- Pages are Markdown in `src/content/docs/`. Adding, removing or reordering a page means editing `pages.json`
  too: it drives both the sidebar and the PDF.
- A rule states a level (MUST / SHOULD / MAY) and names the Editora class or file it comes from. Verify claims
  against the apps' code on their default branch, not from memory; when Editora and the guide disagree, the code
  wins and the guide is fixed in the same change.
- Feature matrix cells start with `●`, `◐` or `—` (rendered as dots by `src/lib/rehype-status.mjs`; the print
  build does the same in `scripts/print-markup.py`). Change both if the convention changes.
- Plain, direct sentences written for the app developer. No marketing copy.
- Update `CHANGELOG.md` (Keep a Changelog) in the same change.
- Never commit `dist/`, `build/` or `public/downloads/`.
