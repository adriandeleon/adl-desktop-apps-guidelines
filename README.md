<img src="branding/pauta-128.png" alt="" width="96" height="96">

# Pauta

**The adl desktop apps guidelines.** *Pauta* is Spanish for a guideline, and for the ruled lines on writing paper.

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

**Pauta 1.3.2 · 6 November 2026.** The version and date live in `package.json`; [CHANGELOG.md](CHANGELOG.md) says what each edition changed.

📖 **Read it at [pauta-project.dev](https://pauta-project.dev/)**
— or download the [PDF](https://pauta-project.dev/downloads/adl-desktop-apps-guidelines.pdf)
or the [single Markdown file](https://pauta-project.dev/downloads/adl-desktop-apps-guidelines.md).
Every edition stays online at its own address: [`/latest/`](https://pauta-project.dev/latest/) is always the newest,
`/2.0.0/`, `/1.3.2/` and so on are permanent, and the header of every page switches between them.

🧰 **Starting a new app?** Use [adl-desktop-app-template](https://github.com/adriandeleon/adl-desktop-app-template),
a GitHub template repository that meets every MUST: a runnable app with its tests, CI and release workflows, and an
example of every repository document. Click **Use this template**, then run `scripts/rename.sh <AppName> <package>`.

## What it covers

| Part | Pages |
|---|---|
| Start here | Principles · New app checklist |
| Foundations | Platform baseline (JDK 25, JavaFX 27, AtlantaFX, NullAway, Maven Wrapper) · Repository documents · Code quality gates (90% coverage) |
| Experience | Keyboard first & Command Palette · Window shell · Icons and color (Inter, the Caret & Ink palette, state colors, icon families) · Toolbars and tooltips · Tabs and tool panels · Menus (menu bar, right-click menus) · Tray and background (close to tray, start at login, notifications) · Settings (search, Git/GitHub sync) · Diagnostics (Message Log, Debug Log, updates, Report a Problem) · Command line · Internationalization |
| Templates | Command Palette · QuickOpen picker · Welcome page · About window · Confirm dialog · Find bar · Message Log · Settings Sync |
| Shipping | jpackage + JReleaser installers for macOS / Linux / Windows on arm64 and x64, signing, CI |
| The family | Feature matrix of the six apps · Shared features · Gaps per app |

## Working on it

The pages are Markdown in [`src/content/docs/`](src/content/docs/); their order (sidebar and PDF) is
[`pages.json`](pages.json). The site is [Astro Starlight](https://starlight.astro.build/).

```bash
npm ci
npm run dev        # http://localhost:4321/
npm run print      # PDF + single Markdown into public/downloads (needs pandoc and Chrome)
npm run build      # the whole site into dist/: this edition at latest/ and <version>/, earlier editions beside them
npm run preview    # serves dist/ as deployed
```

Conventions: in a feature matrix (a table whose header names the apps), a cell starting with `●`, `◐` or `—`
renders as a status dot, the rest of the cell being its note; elsewhere a `—` stays a dash. `MUST`, `SHOULD` and
`MAY` render as a level pill wherever they appear in prose, lists or tables, including `**MUST.**` and `(SHOULD)`.

Every push to `master` builds the downloads and the site and deploys them to GitHub Pages. The site carries every
edition: the one just built at `/latest/` and `/<version>/`, the earlier ones from the `versions` branch, where CI
archives each edition it deploys.

## License

MIT — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
