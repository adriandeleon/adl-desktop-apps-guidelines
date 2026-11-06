# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-11-06

### Added

- **Visual templates** for four shared surfaces: the Command Palette, the About window, the Message Log and the
  Settings Sync page. Each has an annotated mockup at the apps' real sizes (light and dark), its anatomy, a spec
  table tied to Editora's code, its behaviour, its exact strings, and the real screenshots from the apps.

### Fixed

- **The palette does not rank recently used commands first.** Keyboard first said it did; Editora ranks by match
  score, with a query that names a title first.

## [1.0.0] - 2026-11-06

### Changed

- **JDK 25 and JavaFX 27 are floors, not ceilings.** The platform baseline asks for JDK 25 or newer (an open enforcer
  range) and JavaFX 27 or newer; the badges read 25+ and 27+.
- **Inter is a SHOULD**, not a MUST.
- **Every repository document is a MUST except `TODO.md`**: `CONTRIBUTING.md`, `docs/` and `branding/` join the
  rest. The matrix gains a `CONTRIBUTING.md` row and the gaps table lists who lacks it; Torrenta and Modula are
  marked for committing only `CLAUDE.md`, with no `AGENTS.md`.
- **The checklist is grouped by area**, each group linking to its page, with a hanging indent for wrapped items.
- **The feature matrix fits on the page.** Its page is wider and notes under a dot wrap, so all six columns show
  without scrolling sideways.

### Added

- **First edition of the guidelines.** Principles, platform baseline, repository documents, quality gates,
  keyboard-first interaction, window shell, Settings, diagnostics, command line, internationalization,
  packaging and signing, and a new app checklist — extracted from Editora.
- **The family pages.** A feature matrix of Editora, Torrenta, Termina, Modula, Mirada and nux surveyed from
  each default branch on 2026-11-05, nineteen shared features worth standardizing, and the gaps per app.
- **Screenshots from the apps.** 21 captioned figures across Principles, Platform, Keyboard, Window shell, Settings,
  Diagnostics and Internationalization, and a gallery of the family on the overview. New Editora captures of the
  Settings search, Message Log, Report a Problem and About; the rest come from the apps' websites and READMEs.
  The PDF carries them too, and the single Markdown file links them from the repository.
- **The apps' own icons.** Each app's icon, copied from its `branding/` folder, heads its column in the feature
  matrix, labels its row in the gaps table, captions its screenshot on the overview, and appears in the PDF and
  the README.
- **A Mirada screenshot.** Mirada showing a folder of wallpapers with its info panel and thumbnail strip, on the
  overview and on Window shell beside Termina's title bar.
- **Click a screenshot to see it large.** Every screenshot on a page (and in the overview gallery) opens in a
  full-window viewer with its caption; ← and → step through the page's screenshots, Esc or a click outside closes
  it. Screenshots take keyboard focus and open with Enter or Space.
- **Install methods.** Packaging, signing and release covers Homebrew (a cask in `adriandeleon/homebrew-tap`) and
  winget (`AdrianDeLeon.<App>`) beside the GitHub release downloads, with what each needs and where each app
  stands.
- **CI/CD for GitHub Actions** as a table of the three workflows and the rules every workflow follows, and as its
  own group in the checklist.
- **The six languages, as a floor.** Internationalization lists them, says apps should add more, and what a new
  language takes (CJK font fallback, right-to-left orientation).
- **Homepage and GitHub links** for every app on the overview and the feature matrix.
- **Repository documents screenshots**: Editora's repository root and the top of its README on GitHub.
- **Web version on GitHub Pages** with search, light and dark themes, and PDF and single-Markdown downloads built
  in the same workflow.

[Unreleased]: https://github.com/adriandeleon/adl-desktop-apps-guidelines/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/adriandeleon/adl-desktop-apps-guidelines/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/adriandeleon/adl-desktop-apps-guidelines/releases/tag/v1.0.0
