# Documentation

> User docs on the app's website, developer docs in docs/, and the Help menu that opens them. Every app documents itself, and the docs change in the same PR as the code.

Pauta 5.0.0 (2026-11-09). The page with its screenshots and mockups: https://pauta-project.dev/5.0.0/documentation/.
Every rule of the edition: https://pauta-project.dev/5.0.0/llms-full.txt.

An app ships with its documentation. There are three readers and three places: the person using the app reads the
**website's docs**; the person changing the app reads **`docs/`**; a coding agent reads **`AGENTS.md`**. The README is
the landing page that points to each. None of it is optional, and none of it is written after the fact: a change
that affects what a reader would learn updates the documentation in the same pull request.

Reference: Editora's [`AppInfo.docsUrl()`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/AppInfo.java), [`WindowCommandRegistrar`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/WindowCommandRegistrar.java) (`help.documentation`), [`MenuBarModel`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MenuBarModel.java) (the Help
menu), [`WelcomePane`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/WelcomePane.java) (the Help row), [`CommandPalette.docsUrl`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/CommandPalette.java) and [`SettingsFrameBits.helpUrl`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/SettingsFrameBits.java) (deep links); the
repository's [`docs/README.md`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/docs/README.md), [`docs/conventions.md#docs-in-the-same-pr`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/docs/conventions.md#docs-in-the-same-pr) and [`CONTRIBUTING.md`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/CONTRIBUTING.md); and the
[editora-website](https://github.com/adriandeleon/editora-website) repository's [`src/content/docs/`](https://github.com/adriandeleon/editora-website/tree/1b6390c20c7a8aa3fc6af394b68c11454478d69d/src/content/docs) and [`scripts/`](https://github.com/adriandeleon/editora-website/tree/1b6390c20c7a8aa3fc6af394b68c11454478d69d/scripts).

## User documentation

- **DOCS-01 · MUST.** Every app has user documentation: a *Getting started* page (install, first launch, the first
  thing to do), one page per feature area, the keyboard reference, the Settings, and an FAQ. It is written for the
  person using the app, in their words, with screenshots from the real window. The README's 200 lines are not it.
  - *Check (code):* the website repository's `src/content/docs/` has a getting-started page, a keymaps page, a
    settings or configuration page, an FAQ and a page per feature area.
  - *Reference:* editora-website [`src/content/docs/`](https://github.com/adriandeleon/editora-website/tree/1b6390c20c7a8aa3fc6af394b68c11454478d69d/src/content/docs) (43 pages in nine categories, from *Getting started* to
    *Help*); torrenta-website (19), termina-website (16), mirada-website (11).
- **DOCS-02 · MUST.** The user docs live on the app's website, under `/docs/`, in the app's `<app>-website`
  repository, beside the feature pages, the screenshots, the news posts and the blog. Each docs page is a Markdown
  file whose frontmatter gives its `category` and `order`; the sidebar, the sitemap and the RSS feed follow. The
  app's repository never carries a second copy.
  - *Check (code):* every file in the website's `src/content/docs/` has `category` and `order` in its frontmatter;
    the app's `docs/` holds no user guide.
  - *Reference:* editora-website [`README.md`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/README.md) (*Content*); Editora's [`AGENTS.md`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/AGENTS.md): "User-facing feature
    documentation goes to the separate website repository".
- **DOCS-03 · SHOULD.** Deep links from the app open the running version's docs. Pages live under
  `/docs/v-<version>/…`; bare `/docs` and every unversioned slug redirect to the current version, so a link in a
  page never carries a version and a bump just regenerates `src/lib/version.ts`. The app builds the base from its
  own version with `-SNAPSHOT` dropped, so a development build points at the release it is working toward instead
  of a path that would always 404.
  - *Why:* a release that pointed at another release's docs would claim what is not true
    ([*Never claim what is not true*](https://pauta-project.dev/5.0.0/principles/#for-the-people-using-the-apps)), so this becomes a must the day
    the app links to a specific page.
  - *Check (code):* the app's docs URL is `<homepage>/docs/v-` plus its version without `-SNAPSHOT`; the site's
    `astro.config.mjs` serves `/docs/v-<version>/` and redirects the unversioned paths.
  - *Reference:* Editora [`AppInfo.docsUrl()`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/AppInfo.java), `releaseVersion()`; editora-website [`astro.config.mjs`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/astro.config.mjs), [`README.md`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/README.md)
    (*Versioned docs*). The other three sites carry a comment to port these routes when their app first deep-links.
- **DOCS-04 · SHOULD.** Docs are generated where the app is the source. The Commands and Keybindings pages are
  generated from the app's command registrations, `messages.properties` and keymaps; the Roadmap and What's new
  from `TODO.md` and `CHANGELOG.md`; the version from `pom.xml`. The output is committed, so the site builds
  without the app checked out. A check fails the site when a docs page quotes a command id that does not exist or a
  chord that is bound to a different command.
  - *Why:* one fact, one source ([*One source of truth for each fact*](https://pauta-project.dev/5.0.0/principles/#for-the-people-building-them)).
  - *Check (code):* the website's `scripts/` holds the generators, their output under `src/lib/` is committed, and
    `npm run check:docs` runs the id and chord check.
  - *Reference:* editora-website [`scripts/GenCommands.java`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/scripts/GenCommands.java) (every `Command.of` in Editora's `com.editora.ui`,
    [`MainController`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MainController.java) holding most), [`GenRoadmap.java`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/scripts/GenRoadmap.java), [`GenFeatures.java`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/scripts/GenFeatures.java); [`scripts/check-doc-commands.mjs`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/scripts/check-doc-commands.mjs)
    (`npm run check:docs`).
- **DOCS-05 · MUST.** Release notes are written for users. Each `CHANGELOG.md` entry opens with a bold one-line
  summary ([Repository documents](https://pauta-project.dev/5.0.0/repository/)), and in an app with a Welcome page its *What's New* opens this
  build's release. The website's What's new is [DOCS-04](https://pauta-project.dev/5.0.0/documentation/#docs-04); the GitHub release carrying the section is
  [REL-04](https://pauta-project.dev/5.0.0/release/#rel-04).
  - *Check (code):* `CHANGELOG.md`'s entries open with a bold summary; a Welcome page's *What's New* opens
    `AppInfo.releaseNotesUrl()`.
  - *Reference:* Editora [`AppInfo.releaseNotesUrl()`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/AppInfo.java), [`WelcomePane`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/WelcomePane.java) (`welcome.whatsNew`); editora-website
    [`GenRoadmap.java`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/scripts/GenRoadmap.java).

## Reachable from the app

The documentation is one command away, so nobody has to know the website's address.

- **DOCS-06 · MUST.** **Help → Documentation** opens the user docs in the browser. It is a command
  (`help.documentation`), so it is in the palette, bindable and in the menu through the registry like every other
  row, and an app with a Welcome page repeats it in the Help row. Its place in the Help menu is
  [DOCS-07](https://pauta-project.dev/5.0.0/documentation/#docs-07).
  - *Check (code):* `help.documentation` is registered and in the Help `MenuSpec`, and a Welcome page's Help row
    runs it through the registry.
  - *Reference:* Editora [`WindowCommandRegistrar`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/WindowCommandRegistrar.java) (`help.documentation` → [`MainController.openDocumentation()`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MainController.java)),
    [`MenuBarModel`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MenuBarModel.java) (`menubar.help`), [`WelcomePane`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/WelcomePane.java) (`welcome.documentation`).
- **DOCS-07 · SHOULD.** The Help menu runs in this order: Command Palette · Documentation · Check for Updates ·
  Message Log · Debug Log · Report a Problem · Pauta Conformance · About. Simple mode keeps Command Palette, Documentation and About. An
  app without a feature drops its row; nothing moves.
  - *Check (code):* both `menubar.help` menu specs list those command ids in that order.
  - *Reference:* Editora [`MenuBarModel`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/MenuBarModel.java), both `MenuSpec("menubar.help", …)`.
- **DOCS-08 · SHOULD.** Help has a keyboard reference: a searchable window of every key, grouped as the menus are,
  or the keybinding editor.
  - *Check (by hand):* open it from Help, search for a command, and find its key.
  - *Reference:* Termina's and Mirada's [`ShortcutsWindow`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/ShortcutsWindow.java); Editora's keybinding editor
    ([Keyboard first](https://pauta-project.dev/5.0.0/keyboard/)).
- **DOCS-09 · MUST.** Every command has a one-line description (`command.<id>.desc`), shown under the title in the
  palette. It is the in-app documentation of the command.
  - *Check (test):* the parity test fails when a `command.<id>` title has no `.desc`.
  - *Reference:* Editora [`messages.properties`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/resources/com/editora/i18n/messages.properties), [`MessagesTest.everyCommandTitleHasAMatchingDescription`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/test/java/com/editora/i18n/MessagesTest.java)
    ([Code quality gates](https://pauta-project.dev/5.0.0/quality/)).
- **DOCS-10 · MAY.** The palette opens per-command help. With a command highlighted, `C-h` opens its page,
  `/docs/v-<version>/commands/<id>`; where the keymap binds `C-h`, the first free of `F1` and `Shift+F1` does.
  Search Everywhere shares the URL builder so the two pickers can never disagree.
  - *Check (code):* the palette and Search Everywhere both build the URL with `CommandPalette.docsUrl`.
  - *Reference:* Editora [`CommandPalette.docsUrl`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/CommandPalette.java), `setDocsOpener`; [`PickerKeys.freeChord`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/PickerKeys.java).
- **DOCS-11 · MAY.** Each page of the Settings window has a *Help for &lt;page&gt;* link to its docs page, from
  one map of page to slug.
  - *Check (code):* one map from Settings page to docs slug feeds every page's help link.
  - *Reference:* Editora [`SettingsWindow`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/SettingsWindow.java), [`SettingsFrameBits.helpUrl`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/main/java/com/editora/ui/SettingsFrameBits.java), `settings.help`.

### Strings

| Key | English |
|---|---|
| `command.help.documentation` | Documentation |
| `command.help.documentation.desc` | Open the &lt;App&gt; documentation site for this version in your browser. |
| `welcome.documentation` / `welcome.whatsNew` | Documentation / What's New |
| `settings.help` | Help for {0} |

## Developer documentation

- **DOCS-12 · MUST.** `docs/` has an index. `docs/README.md` says who the folder is for (contributors; user docs
  live on the website) and lists every guide with one line; that the code wins is [DOCS-17](https://pauta-project.dev/5.0.0/documentation/#docs-17). The
  set is the one [Repository documents](https://pauta-project.dev/5.0.0/repository/) names: `architecture.md`, `conventions.md`, `testing.md`,
  `gotchas.md`, `release.md`, `building-and-packaging.md` and `decisions/`.
  - *Check (code):* `docs/README.md` exists, says who it is for, and links each guide in `docs/`.
  - *Reference:* Editora's [`docs/README.md`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/docs/README.md); the template's [`docs/`](https://github.com/adriandeleon/adl-desktop-app-template/tree/f33ba42121fa293d144788f0244e32508c41a05e/docs).
- **DOCS-13 · SHOULD.** Every choice a newcomer would question has a decision record: a fork, a rejected
  dependency, a storage format, an escape hatch. It is one numbered Markdown file, `docs/decisions/NNNN-slug.md`,
  with the context, the decision and what it costs.
  - *Check (code):* `docs/decisions/` holds `NNNN-slug.md` files, each with context, decision and consequences.
  - *Reference:* Editora's [`docs/decisions/`](https://github.com/adriandeleon/Editora/tree/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/docs/decisions) (18 records, from [`0001-richtextfx-fork.md`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/docs/decisions/0001-richtextfx-fork.md)).
- **DOCS-14 · MUST.** Three files have three jobs. `AGENTS.md` is the operational guide, kept short (what it holds
  is [REPO-05](https://pauta-project.dev/5.0.0/repository/#repo-05)). `CONTRIBUTING.md` is the short version for a person, pointing into
  `docs/`. `docs/` holds the durable explanations. Exhaustive history goes to `docs/reference/`, not into any of
  the three.
  - *Check (code):* `AGENTS.md` and `CONTRIBUTING.md` link into `docs/`; long catalogs sit under
    `docs/reference/`.
  - *Reference:* Editora's [`AGENTS.md`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/AGENTS.md) (*Documentation map*), [`CONTRIBUTING.md`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/CONTRIBUTING.md), [`docs/reference/README.md`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/docs/reference/README.md).
- **DOCS-15 · SHOULD.** Javadoc sits on its member: a doc comment above another doc comment documents nothing.
  Comments say why, not what.
  - *Check (test):* a test fails the build on a Javadoc comment followed by another.
  - *Reference:* Editora [`StackedJavadocTest`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/src/test/java/com/editora/StackedJavadocTest.java).

## Kept in step

- **DOCS-16 · MUST.** Docs change in the same PR. A change that affects behavior updates `CHANGELOG.md`,
  `TODO.md`, the contributor guides it touches and the website's user docs in the same change, never as a
  follow-up. A reviewer treats a feature PR with no docs change as incomplete.
  - *Check (code):* `docs/conventions.md`, `CONTRIBUTING.md` and `AGENTS.md` state the rule; in review, a feature
    PR's diff touches `CHANGELOG.md`.
  - *Reference:* Editora [`docs/conventions.md#docs-in-the-same-pr`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/docs/conventions.md#docs-in-the-same-pr), [`CONTRIBUTING.md`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/CONTRIBUTING.md) (step 4), [`AGENTS.md`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/AGENTS.md).
- **DOCS-17 · MUST.** When documentation and code disagree, the code wins, and the documentation is fixed in the
  same change. The same rule this guide applies to itself.
  - *Check (code):* `AGENTS.md` and `docs/README.md` say so.
  - *Reference:* Editora's [`AGENTS.md`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/AGENTS.md), [`docs/README.md`](https://github.com/adriandeleon/Editora/blob/40442e3aafc6e3eb36f2d7a24d1afa050ff159d2/docs/README.md).
- **DOCS-18 · SHOULD.** Screenshots are retaken, not described. The capture hook renders the real window at 2×
  after any UI change, for the README (its hero in light and dark), the website and bug reports.
  - *Why:* a stale screenshot claims what is not true.
  - *Check (by hand):* the README's hero and the website's screenshots show the current UI; they are rendered with
    the capture hook [QUAL-09](https://pauta-project.dev/5.0.0/quality/#qual-09) asks for, not drawn or described.
  - *Reference:* `DevCapture` ([Shared features](https://pauta-project.dev/5.0.0/family/shared-features/)); Editora's headless harness.

The README's own shape, about 200 lines that leave the detail to the website's docs, is
[REPO-01](https://pauta-project.dev/5.0.0/repository/#repo-01).
