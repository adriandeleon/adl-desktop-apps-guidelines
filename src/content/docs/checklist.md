---
title: "New app checklist"
description: "Everything a new app needs before its first release."
---

- [ ] JDK 25, JavaFX 27, one JPMS module, Maven Wrapper committed
- [ ] AtlantaFX light + dark, follow-system default; Inter bundled and attached to every scene
- [ ] Every package `@NullMarked`; NullAway + Error Prone failing the build; Spotless
- [ ] JUnit 5 + headless TestFX; JaCoCo check at 0.90 lines / 0.90 methods
- [ ] `CommandRegistry`; Command Palette as an in-scene overlay; Emacs + CUA keymaps at least
- [ ] Settings window with sidebar, search, live apply, and a palette command for every setting
- [ ] Versioned config in `~/.<app>` with migrations and downgrade backups; export/import zip
- [ ] Status bar echo + Message Log; Debug Log with session file; uncaught exception handler
- [ ] Update check (daily, off switch); About with versions and update status
- [ ] Report a Problem (redacted, prefilled GitHub issue) + `--report`; `bug_report.yml`
- [ ] `--help`, `--version`, `--config-dir`, `--dev`, single instance
- [ ] Six message catalogs with a parity test
- [ ] README with badges and light/dark hero screenshot; Keep-a-Changelog `CHANGELOG.md`; MIT `LICENSE`;
      `NOTICE` with third-party licences; `AGENTS.md`
- [ ] JReleaser + jpackage for Linux x64/arm64, macOS arm64/x64, Windows x64
- [ ] macOS signed and notarized; Linux `.asc` signatures; attestations; Windows signing when decided
- [ ] `ci.yml` (Build & Test, Format) required; `full-tests.yml`; `release.yml` with dry run
