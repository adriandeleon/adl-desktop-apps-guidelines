# adl Desktop Apps Guidelines

<p>
  <img src="public/icons/editora.svg" alt="Editora" title="Editora" width="56" height="56">
  <img src="public/icons/torrenta.svg" alt="Torrenta" title="Torrenta" width="56" height="56">
  <img src="public/icons/termina.svg" alt="Termina" title="Termina" width="56" height="56">
  <img src="public/icons/modula.svg" alt="Modula" title="Modula" width="56" height="56">
  <img src="public/icons/mirada.svg" alt="Mirada" title="Mirada" width="56" height="56">
  <img src="public/icons/nux.svg" alt="nux" title="nux" width="56" height="56">
</p>

[![Deploy](https://github.com/adriandeleon/adl-desktop-apps-guidelines/actions/workflows/pages.yml/badge.svg)](https://github.com/adriandeleon/adl-desktop-apps-guidelines/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/github/license/adriandeleon/adl-desktop-apps-guidelines)](LICENSE)
![Version](https://img.shields.io/github/package-json/v/adriandeleon/adl-desktop-apps-guidelines?label=guidelines)
![Built with Starlight](https://img.shields.io/badge/built%20with-Starlight-0e8577)

UI, UX and platform rules for the family of JavaFX desktop apps — [Editora](https://github.com/adriandeleon/Editora),
[Torrenta](https://github.com/adriandeleon/torrenta), [Termina](https://github.com/adriandeleon/Termina),
[Modula](https://github.com/adriandeleon/Modula), [Mirada](https://github.com/adriandeleon/Mirada) and
[nux](https://github.com/adriandeleon/nux). Editora is the reference implementation: every rule names the class
or file to copy from.

**Version 1.0.0 · 6 November 2026.** The version and date live in `package.json`; [CHANGELOG.md](CHANGELOG.md) says what each edition changed.

📖 **Read it at [adriandeleon.github.io/adl-desktop-apps-guidelines](https://adriandeleon.github.io/adl-desktop-apps-guidelines/)**
— or download the [PDF](https://adriandeleon.github.io/adl-desktop-apps-guidelines/downloads/adl-desktop-apps-guidelines.pdf)
or the [single Markdown file](https://adriandeleon.github.io/adl-desktop-apps-guidelines/downloads/adl-desktop-apps-guidelines.md).

## What it covers

| Part | Pages |
|---|---|
| Start here | Principles · New app checklist |
| Foundations | Platform baseline (JDK 25, JavaFX 27, AtlantaFX, NullAway, Maven Wrapper) · Repository documents · Code quality gates (90% coverage) |
| Experience | Keyboard first & Command Palette · Window shell · Settings (search, Git/GitHub sync) · Diagnostics (Message Log, Debug Log, updates, Report a Problem) · Command line · Internationalization |
| Shipping | jpackage + JReleaser installers for macOS / Linux / Windows on arm64 and x64, signing, CI |
| The family | Feature matrix of the six apps · Shared features · Gaps per app |

## Working on it

The pages are Markdown in [`src/content/docs/`](src/content/docs/); their order (sidebar and PDF) is
[`pages.json`](pages.json). The site is [Astro Starlight](https://starlight.astro.build/).

```bash
npm ci
npm run dev        # http://localhost:4321/adl-desktop-apps-guidelines/
npm run print      # PDF + single Markdown into public/downloads (needs pandoc and Chrome)
npm run build      # static site into dist/
```

Table conventions: a cell starting with `●`, `◐` or `—` renders as a status dot (the rest of the cell is its note);
a cell starting with `MUST`, `SHOULD` or `MAY` renders as a level pill.

Every push to `master` builds the downloads and the site and deploys them to GitHub Pages.

## Licence

MIT — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
