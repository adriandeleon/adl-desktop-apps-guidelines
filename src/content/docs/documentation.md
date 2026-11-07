---
title: "Documentation"
description: "User docs on the app's website, developer docs in docs/, and the Help menu that opens them. Every app documents itself, and the docs change in the same PR as the code."
---

An app ships with its documentation. There are three readers and three places: the person using the app reads the
**website's docs**; the person changing the app reads **`docs/`**; a coding agent reads **`AGENTS.md`**. The README is
the landing page that points to each. None of it is optional, and none of it is written after the fact: a change
that affects what a reader would learn updates the documentation in the same pull request.

Reference: Editora's `AppInfo.docsUrl()`, `WindowCommandRegistrar` (`help.documentation`), `MenuBarModel` (the Help
menu), `WelcomePane` (the Help row), `CommandPalette.docsUrl` and `SettingsFrameBits.helpUrl` (deep links); the
repository's `docs/README.md`, `docs/conventions.md#docs-in-the-same-pr` and `CONTRIBUTING.md`; and the
[editora-website](https://github.com/adriandeleon/editora-website) repository's `src/content/docs/` and `scripts/`.

## User documentation

| Rule | Level | Reference |
|---|---|---|
| **Every app has user documentation.** A *Getting started* page (install, first launch, the first thing to do), one page per feature area, the keyboard reference, the Settings, and an FAQ. Written for the person using the app, in their words, with screenshots from the real window. The README's 200 lines are not it. | MUST | editora-website `src/content/docs/` (43 pages in nine categories, from *Getting started* to *Help*); torrenta-website (19), termina-website (16), mirada-website (11) |
| **It lives on the app's website**, under `/docs/`, in the app's `<app>-website` repository, beside the feature pages, the screenshots, the news posts and the blog. Each docs page is a Markdown file whose frontmatter gives its `category` and `order`; the sidebar, the sitemap and the RSS feed follow. The app's repository never carries a second copy. | MUST | editora-website `README.md` (*Content*); Editora's `AGENTS.md`: "User-facing feature documentation goes to the separate website repository" |
| **Deep links from the app open the running version's docs.** Pages live under `/docs/v-<version>/…`; bare `/docs` and every unversioned slug redirect to the current version, so a link in a page never carries a version and a bump just regenerates `src/lib/version.ts`. The app builds the base from its own version with `-SNAPSHOT` dropped, so a development build points at the release it is working toward instead of a path that would always 404. A release that pointed at another release's docs would claim what is not true ([*Never claim what is not true*](../principles/#for-the-people-using-the-apps)), so this becomes a MUST the day the app links to a specific page. | SHOULD | `AppInfo.docsUrl()`, `releaseVersion()`; editora-website `astro.config.mjs`, `README.md` (*Versioned docs*). The other three sites carry a comment to port these routes when their app first deep-links |
| **Generated where the app is the source.** The Commands and Keybindings pages are generated from the app's `MainController`, `messages.properties` and keymaps; the Roadmap and What's new from `TODO.md` and `CHANGELOG.md`; the version from `pom.xml`. The output is committed, so the site builds without the app checked out. A check fails the site when a docs page quotes a command id that does not exist or a chord that is bound to a different command. One fact, one source ([*One source of truth for each fact*](../principles/#for-the-people-building-them)). | SHOULD | `scripts/GenCommands.java`, `GenRoadmap.java`, `GenFeatures.java`; `scripts/check-doc-commands.mjs` (`npm run check:docs`) |
| **Release notes a user can read.** Each `CHANGELOG.md` entry opens with a bold one-line summary written for users ([Repository documents](../repository/)); the GitHub release carries the section, the Welcome page's *What's New* opens this build's release, and the website's What's new is generated from the same file. | MUST | `AppInfo.releaseNotesUrl()`, `WelcomePane` (`welcome.whatsNew`); editora-website `GenRoadmap.java` |

## Reachable from the app

The documentation is one command away, so nobody has to know the website's address.

| Rule | Level | Reference |
|---|---|---|
| **Help → Documentation** opens the user docs in the browser. It is a command (`help.documentation`), so it is in the palette, bindable and in the menu through the registry like every other row; it is the first row of the Help menu after the Command Palette, and the Welcome page's Help row repeats it. | MUST | `WindowCommandRegistrar` (`help.documentation` → `MainController.openDocumentation()`), `MenuBarModel` (`menubar.help`), `WelcomePane` (`welcome.documentation`) |
| **The Help menu, in this order**: Command Palette · Documentation · Check for Updates · Message Log · Debug Log · Report a Problem · About. Simple mode keeps Command Palette, Documentation and About. An app without a feature drops its row; nothing moves. | SHOULD | `MenuBarModel`, both `MenuSpec("menubar.help", …)` |
| **A keyboard reference in Help**: a searchable window of every key, grouped as the menus are, or the keybinding editor. | SHOULD | Termina's and Mirada's `ShortcutsWindow`; Editora's keybinding editor ([Keyboard first](../keyboard/)) |
| **A one-line description for every command** (`command.<id>.desc`), shown under the title in the palette. It is the in-app documentation of the command and the parity test holds every command to it. | MUST | `messages.properties`, `MessagesTest` ([Code quality gates](../quality/)) |
| **Per-command help from the palette.** With a command highlighted, `C-h` opens its page, `/docs/v-<version>/commands/<id>`; Search Everywhere shares the URL builder so the two pickers can never disagree. | MAY | `CommandPalette.docsUrl`, `setDocsOpener` |
| **Help from a Settings page.** Each page of the Settings window has a *Help for &lt;page&gt;* link to its docs page, from one map of page to slug. | MAY | `SettingsWindow`, `SettingsFrameBits.helpUrl`, `settings.help` |

### Strings

| Key | English |
|---|---|
| `command.help.documentation` | Documentation |
| `command.help.documentation.desc` | Open the &lt;App&gt; documentation site for this version in your browser. |
| `welcome.documentation` / `welcome.whatsNew` | Documentation / What's New |
| `settings.help` | Help for {0} |

## Developer documentation

| Rule | Level | Reference |
|---|---|---|
| **`docs/` with an index.** `docs/README.md` says who the folder is for (contributors; user docs live on the website), states that the code wins when the two disagree, and lists every guide with one line. The set is the one [Repository documents](../repository/) names: `architecture.md`, `conventions.md`, `testing.md`, `gotchas.md`, `release.md`, `building-and-packaging.md` and `decisions/`. | MUST | Editora's `docs/README.md`; the template's `docs/` |
| **A decision record for every choice a newcomer would question**: a fork, a rejected dependency, a storage format, an escape hatch. One numbered Markdown file, `docs/decisions/NNNN-slug.md`, with the context, the decision and what it costs. | SHOULD | Editora's `docs/decisions/` (18 records, from `0001-richtextfx-fork.md`) |
| **Three files, three jobs.** `AGENTS.md` is the operational guide, kept short (commands, worktree-per-task, the change checklist). `CONTRIBUTING.md` is the short version for a person, pointing into `docs/`. `docs/` holds the durable explanations. Exhaustive history goes to `docs/reference/`, not into any of the three. | MUST | Editora's `AGENTS.md` (*Documentation map*), `CONTRIBUTING.md`, `docs/reference/README.md` |
| **Javadoc sits on its member.** A doc comment above another doc comment documents nothing; a test fails the build on one. Comments say why, not what. | SHOULD | `StackedJavadocTest` |

## Kept in step

| Rule | Level | Reference |
|---|---|---|
| **Docs in the same PR.** A change that affects behavior updates `CHANGELOG.md`, `TODO.md`, the contributor guides it touches and the website's user docs in the same change, never as a follow-up. A reviewer treats a feature PR with no docs change as incomplete. | MUST | `docs/conventions.md#docs-in-the-same-pr`, `CONTRIBUTING.md` (step 4), `AGENTS.md` |
| **When documentation and code disagree, the code wins**, and the documentation is fixed in the same change. The same rule this guide applies to itself. | MUST | Editora's `AGENTS.md`, `docs/README.md` |
| **Screenshots are retaken, not described.** The capture hook renders the real window at 2× after any UI change, for the README (its hero in light and dark), the website and bug reports; a stale screenshot claims what is not true. | SHOULD | `DevCapture` ([Shared features](../family/shared-features/)); Editora's headless harness |
| **The README defers.** About 200 lines: pitch, hero, highlights, install, build, command line, config folder, license, and links into the website's docs. It carries no feature catalog, so it changes only when those facts do. | MUST | [Repository documents](../repository/); `docs/conventions.md#docs-in-the-same-pr` |
