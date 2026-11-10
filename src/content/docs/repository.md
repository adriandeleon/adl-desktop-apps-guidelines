---
title: "Repository documents"
description: "README, CHANGELOG, LICENSE, NOTICE, AGENTS.md and the rest of the files every repository carries."
---

**Start from the template.** [adl-desktop-app-template](https://github.com/adriandeleon/adl-desktop-app-template) carries an example of every file on this page,
filled in for a placeholder app, `ExampleApp`. `scripts/rename.sh <AppName> <package>` renames it to yours.

- **REPO-01 · MUST.** `README.md` is a landing page of about 200 lines: logo, badges, a one-paragraph pitch, the
  hero screenshot, highlights, install, build, command line, config folder, license. Detail lives on the website.
  - *Check (code):* `README.md` is near 200 lines and has those parts, with links to the website for
    the rest.
  - *Reference:* Editora [`README.md`](https://github.com/adriandeleon/Editora/blob/master/README.md).
- **REPO-02 · MUST.** `CHANGELOG.md` follows [Keep a Changelog 1.1](https://keepachangelog.com/en/1.1.0/) and
  SemVer: an `## [Unreleased]` section with Added / Changed / Fixed / Removed, and each entry opens with a bold
  one-line summary written for users.
  - *Check (code):* the file names Keep a Changelog and Semantic Versioning, starts with `## [Unreleased]`, and every
    entry starts with `- **`.
  - *Reference:* Editora [`CHANGELOG.md`](https://github.com/adriandeleon/Editora/blob/master/CHANGELOG.md).
- **REPO-03 · MUST.** `LICENSE` is MIT, "Copyright (c) 2026 Adrián Arturo De León Saldivar", with the year the app
  started in: 2026 for the six apps, later for a newer one.
  - *Check (code):* `LICENSE` opens with `MIT License` and has that copyright line, with a year from 2026 on.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; tr -d '\r' < LICENSE | head -n 1 | grep -qx 'MIT License' && tr -d '\r' < LICENSE | grep -qxE 'Copyright \(c\) 20(2[6-9]|[3-9][0-9]) Adrián Arturo De León Saldivar' || { head -n 3 LICENSE; false; }`
  - *Reference:* Editora [`LICENSE`](https://github.com/adriandeleon/Editora/blob/master/LICENSE).
- **REPO-04 · MUST.** `NOTICE` gives the app name, the copyright, "licensed under the MIT License", then every
  bundled third-party component with its license (Inter is OFL, AtlantaFX is MIT, OpenJFX is GPLv2+CPE…). It
  ships inside the installers too.
  - *Check (test):* a test fails when a runtime dependency in `pom.xml` has no `NOTICE` entry, and another when
    `LICENSE` and `NOTICE` are not packaged.
  - *Reference:* Editora [`NOTICE`](https://github.com/adriandeleon/Editora/blob/master/NOTICE), [`NoticeCoverageTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/packaging/NoticeCoverageTest.java), [`BuildHygieneTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/packaging/BuildHygieneTest.java).
- **REPO-05 · MUST.** `AGENTS.md` holds the operational rules for coding agents: essential commands,
  worktree-per-task, the change checklist. It is not a changelog. A short `CLAUDE.md` points to it.
  - *Check (code):* `AGENTS.md` has sections for commands, worktrees and the change checklist; `CLAUDE.md` is a few
    lines that send the reader to `AGENTS.md`.
  - *Reference:* Editora [`AGENTS.md`](https://github.com/adriandeleon/Editora/blob/master/AGENTS.md), [`CLAUDE.md`](https://github.com/adriandeleon/Editora/blob/master/CLAUDE.md).
- **REPO-06 · MUST.** `CONTRIBUTING.md` says how to build, test, format, and open a PR.
  - *Check (code):* `CONTRIBUTING.md` names the build, test and format commands and the PR step.
  - *Reference:* Editora [`CONTRIBUTING.md`](https://github.com/adriandeleon/Editora/blob/master/CONTRIBUTING.md).
- **REPO-07 · MUST.** `docs/` holds `architecture.md`, `conventions.md`, `testing.md`, `gotchas.md`, `release.md`,
  `building-and-packaging.md` and `decisions/` (ADRs).
  - *Check (code):* each of those paths exists under `docs/`.
  - *Reference:* Editora [`docs/`](https://github.com/adriandeleon/Editora/tree/master/docs).
- **REPO-08 · MAY.** `TODO.md` holds the open list, kept in the same PR as the change.
  - *Check (code):* `TODO.md` exists at the root.
  - *Reference:* Editora [`TODO.md`](https://github.com/adriandeleon/Editora/blob/master/TODO.md).
- **REPO-09 · MUST.** `.github/ISSUE_TEMPLATE/bug_report.yml` is an issue form whose field ids (`environment`,
  `report`) the in-app Report a Problem fills.
  - *Check (code):* the form has fields with `id: environment` and `id: report`.
  - *Reference:* Editora [`.github/ISSUE_TEMPLATE/bug_report.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/ISSUE_TEMPLATE/bug_report.yml).
- **REPO-10 · MUST.** `branding/` holds the source SVG of the icon. The PNG, ICNS and ICO generated from it sit
  beside it or in `packaging/`.
  - *Check (code):* `branding/` has an `.svg`; the `jpackage` icon paths in `pom.xml` point at the generated files.
  - *Reference:* Editora [`branding/editora-icon.svg`](https://github.com/adriandeleon/Editora/blob/master/branding/editora-icon.svg), with [`editora.png`](https://github.com/adriandeleon/Editora/blob/master/branding/editora.png), `.icns` and `.ico` beside it; the
    template keeps them in [`packaging/icons/`](https://github.com/adriandeleon/adl-desktop-app-template/tree/master/packaging/icons).
- **REPO-11 · SHOULD.** Every script in `scripts/` is a Java source file the JDK runs as it is (`java
  scripts/Name.java`, a compact source file or an ordinary class) or an `sh` or bash script.
  - *Why:* every app already needs the JDK, and a Java script runs the same on Windows, macOS and Linux. A Python or
    Node script makes every contributor and CI runner install a second toolchain for one step. A script that runs on
    Windows is easier to keep in Java than in bash.
  - *Check (code):* no file under `scripts/` is Python, JavaScript, TypeScript, Ruby, Perl, Groovy, Lua, PHP,
    PowerShell or a batch file, and every shebang there names `sh`, `bash` or `java`. Data files beside the scripts
    (fixtures, lists, templates) are not scripts.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; [ -d scripts ] || exit 0; bad=$(find scripts -type f | while IFS= read -r f; do if printf '%s\n' "$f" | grep -qE '\.(py|js|mjs|cjs|ts|rb|pl|ps1|bat|cmd|groovy|kts|lua|php)$'; then echo "$f"; continue; fi; l=$(head -n 1 "$f" | tr -d '\r'); if printf '%s\n' "$l" | grep -q '^#!'; then printf '%s\n' "$l" | grep -qE '^#! *(/usr)?/bin/(env +(-S +)?)?((ba|da)?sh|java)( |$)' || echo "$f: $l"; fi; done); [ -z "$bad" ] || { printf '%s\n' "$bad"; false; }`
  - *Reference:* Editora [`scripts/`](https://github.com/adriandeleon/Editora/tree/master/scripts), whose Java
    scripts have their own tests, run by [`scripts/lib/RunTests.java`](https://github.com/adriandeleon/Editora/blob/master/scripts/lib/RunTests.java)
    ([`docs/testing.md`](https://github.com/adriandeleon/Editora/blob/master/docs/testing.md)).

![Editora's repository root on GitHub: branding, docs, AGENTS.md, CHANGELOG.md, CLAUDE.md, CONTRIBUTING.md, LICENSE, NOTICE, README.md and TODO.md, with the About sidebar](../../assets/shots/editora-github-root.png "Editora's repository root: every file on this page, with the homepage, Readme, MIT license and Contributing links GitHub derives from them.")

## README badges (in this order)

```markdown
[![CI](https://github.com/adriandeleon/<App>/actions/workflows/ci.yml/badge.svg)](…/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/adriandeleon/<App>)](…/releases/latest)
[![License: MIT](https://img.shields.io/github/license/adriandeleon/<App>)](LICENSE)
![Java](https://img.shields.io/badge/Java-25%2B-orange?logo=openjdk&logoColor=white)
![JavaFX](https://img.shields.io/badge/JavaFX-27%2B-1e90ff)
![Platforms](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)
[![Pauta](https://img.shields.io/badge/Pauta-<edition>%20%C2%B7%20<conformance>-<color>)](<homepage>/docs/pauta/)
[![Stars](https://img.shields.io/github/stars/adriandeleon/<App>?style=flat)](…/stargazers)
```

![The top of Editora's README on GitHub: logo, title, the badge row, the one-paragraph pitch, the website links and the hero screenshot](../../assets/shots/editora-github-readme.png "The top of Editora's README: logo, badges in this order, a two-sentence pitch, links to the website, then the hero screenshot.")

The Pauta badge names the edition and the conformance, in green `2ea043` for Complete, blue `5b8def` for Core and
amber `d29922` for Partial, and links to the app's *Pauta conformance* docs page; a test holds
it to `pauta.version` and the computed conformance ([Conformance](../conformance/#pauta-15)). The template's badge
reads `Pauta 4.1.0 · Partial`; "Working toward" is the wording of the README line beside it, which takes the place of
"Built to" at Partial.

The hero screenshot is a `<picture>` with a dark `srcset` under `prefers-color-scheme: dark`, so GitHub
shows the screenshot that matches the reader's theme. Screenshots are taken at 2× by a headless harness so
they can be retaken after any UI change. The README states that the app is built with the help of AI
coding tools.
