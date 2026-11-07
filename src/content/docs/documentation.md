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

- **DOCS-01 · MUST.** Every app has user documentation: a *Getting started* page (install, first launch, the first
  thing to do), one page per feature area, the keyboard reference, the Settings, and an FAQ. It is written for the
  person using the app, in their words, with screenshots from the real window. The README's 200 lines are not it.
  - *Check (code):* the website repository's `src/content/docs/` has a getting-started page, a keymaps page, a
    settings or configuration page, an FAQ and a page per feature area.
  - *Reference:* editora-website `src/content/docs/` (43 pages in nine categories, from *Getting started* to
    *Help*); torrenta-website (19), termina-website (16), mirada-website (11).
- **DOCS-02 · MUST.** The user docs live on the app's website, under `/docs/`, in the app's `<app>-website`
  repository, beside the feature pages, the screenshots, the news posts and the blog. Each docs page is a Markdown
  file whose frontmatter gives its `category` and `order`; the sidebar, the sitemap and the RSS feed follow. The
  app's repository never carries a second copy.
  - *Check (code):* every file in the website's `src/content/docs/` has `category` and `order` in its frontmatter;
    the app's `docs/` holds no user guide.
  - *Reference:* editora-website `README.md` (*Content*); Editora's `AGENTS.md`: "User-facing feature
    documentation goes to the separate website repository".
- **DOCS-03 · SHOULD.** Deep links from the app open the running version's docs. Pages live under
  `/docs/v-<version>/…`; bare `/docs` and every unversioned slug redirect to the current version, so a link in a
  page never carries a version and a bump just regenerates `src/lib/version.ts`. The app builds the base from its
  own version with `-SNAPSHOT` dropped, so a development build points at the release it is working toward instead
  of a path that would always 404.
  - *Why:* a release that pointed at another release's docs would claim what is not true
    ([*Never claim what is not true*](../principles/#for-the-people-using-the-apps)), so this becomes a must the day
    the app links to a specific page.
  - *Check (code):* the app's docs URL is `<homepage>/docs/v-` plus its version without `-SNAPSHOT`; the site's
    `astro.config.mjs` serves `/docs/v-<version>/` and redirects the unversioned paths.
  - *Reference:* Editora `AppInfo.docsUrl()`, `releaseVersion()`; editora-website `astro.config.mjs`, `README.md`
    (*Versioned docs*). The other three sites carry a comment to port these routes when their app first deep-links.
- **DOCS-04 · SHOULD.** Docs are generated where the app is the source. The Commands and Keybindings pages are
  generated from the app's command registrations, `messages.properties` and keymaps; the Roadmap and What's new
  from `TODO.md` and `CHANGELOG.md`; the version from `pom.xml`. The output is committed, so the site builds
  without the app checked out. A check fails the site when a docs page quotes a command id that does not exist or a
  chord that is bound to a different command.
  - *Why:* one fact, one source ([*One source of truth for each fact*](../principles/#for-the-people-building-them)).
  - *Check (code):* the website's `scripts/` holds the generators, their output under `src/lib/` is committed, and
    `npm run check:docs` runs the id and chord check.
  - *Reference:* editora-website `scripts/GenCommands.java` (every `Command.of` in Editora's `com.editora.ui`,
    `MainController` holding most), `GenRoadmap.java`, `GenFeatures.java`; `scripts/check-doc-commands.mjs`
    (`npm run check:docs`).
- **DOCS-05 · MUST.** Release notes are written for users. Each `CHANGELOG.md` entry opens with a bold one-line
  summary ([Repository documents](../repository/)); the GitHub release carries the section, the Welcome page's
  *What's New* opens this build's release, and the website's What's new is generated from the same file.
  - *Check (code):* the Welcome page's *What's New* opens `AppInfo.releaseNotesUrl()`; the website's What's new
    is generated from `CHANGELOG.md`.
  - *Reference:* Editora `AppInfo.releaseNotesUrl()`, `WelcomePane` (`welcome.whatsNew`); editora-website
    `GenRoadmap.java`.

## Reachable from the app

The documentation is one command away, so nobody has to know the website's address.

- **DOCS-06 · MUST.** **Help → Documentation** opens the user docs in the browser. It is a command
  (`help.documentation`), so it is in the palette, bindable and in the menu through the registry like every other
  row; it is the first row of the Help menu after the Command Palette, and the Welcome page's Help row repeats it.
  - *Check (code):* `help.documentation` is registered, follows `palette.show` in the Help `MenuSpec`, and the
    Welcome page's Help row runs it through the registry.
  - *Reference:* Editora `WindowCommandRegistrar` (`help.documentation` → `MainController.openDocumentation()`),
    `MenuBarModel` (`menubar.help`), `WelcomePane` (`welcome.documentation`).
- **DOCS-07 · SHOULD.** The Help menu runs in this order: Command Palette · Documentation · Check for Updates ·
  Message Log · Debug Log · Report a Problem · About. Simple mode keeps Command Palette, Documentation and About. An
  app without a feature drops its row; nothing moves.
  - *Check (code):* both `menubar.help` menu specs list those command ids in that order.
  - *Reference:* Editora `MenuBarModel`, both `MenuSpec("menubar.help", …)`.
- **DOCS-08 · SHOULD.** Help has a keyboard reference: a searchable window of every key, grouped as the menus are,
  or the keybinding editor.
  - *Check (by hand):* open it from Help, search for a command, and find its key.
  - *Reference:* Termina's and Mirada's `ShortcutsWindow`; Editora's keybinding editor
    ([Keyboard first](../keyboard/)).
- **DOCS-09 · MUST.** Every command has a one-line description (`command.<id>.desc`), shown under the title in the
  palette. It is the in-app documentation of the command.
  - *Check (test):* the parity test fails when a `command.<id>` title has no `.desc`.
  - *Reference:* Editora `messages.properties`, `MessagesTest.everyCommandTitleHasAMatchingDescription`
    ([Code quality gates](../quality/)).
- **DOCS-10 · MAY.** The palette opens per-command help. With a command highlighted, `C-h` opens its page,
  `/docs/v-<version>/commands/<id>`; where the keymap binds `C-h`, the first free of `F1` and `Shift+F1` does.
  Search Everywhere shares the URL builder so the two pickers can never disagree.
  - *Check (code):* the palette and Search Everywhere both build the URL with `CommandPalette.docsUrl`.
  - *Reference:* Editora `CommandPalette.docsUrl`, `setDocsOpener`; `PickerKeys.freeChord`.
- **DOCS-11 · MAY.** Each page of the Settings window has a *Help for &lt;page&gt;* link to its docs page, from
  one map of page to slug.
  - *Check (code):* one map from Settings page to docs slug feeds every page's help link.
  - *Reference:* Editora `SettingsWindow`, `SettingsFrameBits.helpUrl`, `settings.help`.

### Strings

| Key | English |
|---|---|
| `command.help.documentation` | Documentation |
| `command.help.documentation.desc` | Open the &lt;App&gt; documentation site for this version in your browser. |
| `welcome.documentation` / `welcome.whatsNew` | Documentation / What's New |
| `settings.help` | Help for {0} |

## Developer documentation

- **DOCS-12 · MUST.** `docs/` has an index. `docs/README.md` says who the folder is for (contributors; user docs
  live on the website), states that the code wins when the two disagree, and lists every guide with one line. The
  set is the one [Repository documents](../repository/) names: `architecture.md`, `conventions.md`, `testing.md`,
  `gotchas.md`, `release.md`, `building-and-packaging.md` and `decisions/`.
  - *Check (code):* `docs/README.md` exists, says those two things, and links each guide in `docs/`.
  - *Reference:* Editora's `docs/README.md`; the template's `docs/`.
- **DOCS-13 · SHOULD.** Every choice a newcomer would question has a decision record: a fork, a rejected
  dependency, a storage format, an escape hatch. It is one numbered Markdown file, `docs/decisions/NNNN-slug.md`,
  with the context, the decision and what it costs.
  - *Check (code):* `docs/decisions/` holds `NNNN-slug.md` files, each with context, decision and consequences.
  - *Reference:* Editora's `docs/decisions/` (18 records, from `0001-richtextfx-fork.md`).
- **DOCS-14 · MUST.** Three files have three jobs. `AGENTS.md` is the operational guide, kept short (commands,
  worktree-per-task, the change checklist). `CONTRIBUTING.md` is the short version for a person, pointing into
  `docs/`. `docs/` holds the durable explanations. Exhaustive history goes to `docs/reference/`, not into any of
  the three.
  - *Check (code):* `AGENTS.md` and `CONTRIBUTING.md` link into `docs/`; long catalogs sit under
    `docs/reference/`.
  - *Reference:* Editora's `AGENTS.md` (*Documentation map*), `CONTRIBUTING.md`, `docs/reference/README.md`.
- **DOCS-15 · SHOULD.** Javadoc sits on its member: a doc comment above another doc comment documents nothing.
  Comments say why, not what.
  - *Check (test):* a test fails the build on a Javadoc comment followed by another.
  - *Reference:* Editora `StackedJavadocTest`.

## Kept in step

- **DOCS-16 · MUST.** Docs change in the same PR. A change that affects behavior updates `CHANGELOG.md`,
  `TODO.md`, the contributor guides it touches and the website's user docs in the same change, never as a
  follow-up. A reviewer treats a feature PR with no docs change as incomplete.
  - *Check (code):* `docs/conventions.md`, `CONTRIBUTING.md` and `AGENTS.md` state the rule; in review, a feature
    PR's diff touches `CHANGELOG.md`.
  - *Reference:* Editora `docs/conventions.md#docs-in-the-same-pr`, `CONTRIBUTING.md` (step 4), `AGENTS.md`.
- **DOCS-17 · MUST.** When documentation and code disagree, the code wins, and the documentation is fixed in the
  same change. The same rule this guide applies to itself.
  - *Check (code):* `AGENTS.md` and `docs/README.md` say so.
  - *Reference:* Editora's `AGENTS.md`, `docs/README.md`.
- **DOCS-18 · SHOULD.** Screenshots are retaken, not described. The capture hook renders the real window at 2×
  after any UI change, for the README (its hero in light and dark), the website and bug reports.
  - *Why:* a stale screenshot claims what is not true.
  - *Check (code):* the app has a capture hook or a headless harness that writes the real window to a PNG.
  - *Reference:* `DevCapture` ([Shared features](../family/shared-features/)); Editora's headless harness.
- **DOCS-19 · MUST.** The README defers. It is about 200 lines: pitch, hero, highlights, install, build, command
  line, config folder, license, and links into the website's docs. It carries no feature catalog, so it changes
  only when those facts do.
  - *Check (code):* `README.md` is near 200 lines and links to the website's docs instead of listing every
    feature.
  - *Reference:* [Repository documents](../repository/); Editora `docs/conventions.md#docs-in-the-same-pr`.
