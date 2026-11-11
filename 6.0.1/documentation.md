# Documentation

> User docs on the app's website, developer docs in docs/, and the Help menu that opens them. Every app documents itself, and the docs change with the code.

Pauta 6.0.1 (2026-11-11). The page with its screenshots and mockups: https://pauta-project.dev/6.0.1/documentation/.
Every rule of the edition: https://pauta-project.dev/6.0.1/llms-full.txt.

An app ships with its documentation. There are three readers and three places: the person using the app reads the
**website's docs**; the person changing the app reads **`docs/`**; a coding agent reads **`AGENTS.md`**. The README is
the landing page that points to each. None of it is optional, and none of it is written after the fact: a change
that affects what a reader would learn updates the documentation with it ([DOCS-16](https://pauta-project.dev/6.0.1/documentation/#docs-16)).

Reference: Editora's [`AppInfo.docsUrl()`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/AppInfo.java), [`WindowCommandRegistrar`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/WindowCommandRegistrar.java) (`help.documentation`), [`MenuBarModel`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MenuBarModel.java) (the Help
menu), [`WelcomePane`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/WelcomePane.java) (the Help row), [`CommandPalette.docsUrl`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/CommandPalette.java) and [`SettingsFrameBits.helpUrl`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/SettingsFrameBits.java) (deep links); the
repository's [`docs/README.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/docs/README.md), [`docs/conventions.md#docs-in-the-same-pr`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/docs/conventions.md#docs-in-the-same-pr) and [`CONTRIBUTING.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/CONTRIBUTING.md); and the
[editora-website](https://github.com/adriandeleon/editora-website) repository's [`src/content/docs/`](https://github.com/adriandeleon/editora-website/tree/1b6390c20c7a8aa3fc6af394b68c11454478d69d/src/content/docs) and [`scripts/`](https://github.com/adriandeleon/editora-website/tree/1b6390c20c7a8aa3fc6af394b68c11454478d69d/scripts).

## User documentation

- **DOCS-01 · MUST.** Every app has user documentation: a *Getting started* page (install, first launch, the first
  thing to do), one page per feature area, the keyboard reference, the Settings, and an FAQ. It is written for the
  person using the app, in their words, with screenshots from the real window. The README, a landing page of at
  most 250 lines ([REPO-01](https://pauta-project.dev/6.0.1/repository/#repo-01)), is not it.
  - *Check (code):* the app names a website for its user docs: its README or its About links one, or the address
    `help.documentation` opens ([DOCS-06](https://pauta-project.dev/6.0.1/documentation/#docs-06)) is on one. The repository's own address on GitHub is not
    one. An app whose repository and About name no website has no user documentation to point at, and fails the
    rule from the app's checkout. The rest is in the website's repository: its docs (the files of
    `src/content/docs/` in editora-website) have a getting-started page, a keyboard reference (a keymaps page
    there), a settings or configuration page, an FAQ and a page per feature area, and the pages carry screenshots
    of the app's real window. The website is a repository of its own ([DOCS-02](https://pauta-project.dev/6.0.1/documentation/#docs-02)), which the app's
    checkout does not hold. An audit run from the app's checkout alone reports the rule as `not-checked` and says
    what would settle it.
  - *Reference:* editora-website [`src/content/docs/`](https://github.com/adriandeleon/editora-website/tree/1b6390c20c7a8aa3fc6af394b68c11454478d69d/src/content/docs) (43 pages in nine categories, from *Getting started* to
    *Help*); torrenta-website (19), termina-website (16), mirada-website (11).
- **DOCS-02 · MUST.** The user docs live on the app's website, under `/docs/`, in the app's `<app>-website`
  repository, beside the feature pages, the screenshots, the news posts and the blog. Each docs page is a Markdown
  file whose frontmatter gives the page's category and its place in it (editora-website's keys are `category` and
  `order`); the sidebar, the sitemap and the RSS feed follow. The app's repository carries none of them: a page
  kept in the app's `docs/` fails the rule when any section of it tells the app's user how to install or use
  something, even if the rest of the page is for contributors, and whether or not the website has it too.
  - *Check (code):* no page in the app's `docs/` has a section that tells the person using the app how to install
    or use something: one found there fails the rule from the app's checkout, whoever the rest of the page is
    written for. So does an app whose repository and About name no website for its user docs
    ([DOCS-01](https://pauta-project.dev/6.0.1/documentation/#docs-01)): its user docs live on none. The rest is in the website's repository: every docs page
    there (the files of `src/content/docs/` in editora-website) gives its category and its order in its
    frontmatter. An audit run from the app's checkout alone reports the rule as `not-checked` and says what would
    settle it.
  - *Reference:* editora-website [`README.md`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/README.md) (*Content*). Editora doesn't yet, though its [`AGENTS.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/AGENTS.md) says "User-facing feature
    documentation goes to the separate website repository": [`docs/plugins.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/docs/plugins.md), a page for plugin authors, has a
    section that tells the user the three ways to install a plugin and one on troubleshooting plugins. Termina
    doesn't either: [`docs/reference/installing.md`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/docs/reference/installing.md) tells the person installing it which download to take, how to
    install each and how to check its signature, and its README sends the reader there. Nor does Torrenta:
    [`docs/headless.md`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/docs/headless.md), [`docs/webapi.md`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/docs/webapi.md) and [`docs/search-providers.md`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/docs/search-providers.md) are guides for the person using it.
- **DOCS-03 · SHOULD.** Every link from the app into its user docs opens the running version's docs, the address
  `help.documentation` opens ([DOCS-06](https://pauta-project.dev/6.0.1/documentation/#docs-06)) as much as a link to one page. Pages live under
  `/docs/v-<version>/…`; bare `/docs` and every unversioned slug redirect to the current version, so a link in a
  page never carries a version and a bump just regenerates one file (editora-website's `src/lib/version.ts`). The
  app builds the base from its own version with `-SNAPSHOT` dropped, so a development build points at the release
  it is working toward instead of a path that would always 404.
  - *Why:* a release that pointed at another release's docs would claim what is not true
    ([*Never claim what is not true*](https://pauta-project.dev/6.0.1/principles/#for-the-people-using-the-apps)).
  - *Check (code):* the address the app opens for its docs is its website's `/docs/v-` plus the app's version
    without `-SNAPSHOT`: another address, the unversioned `/docs/` among them, fails the rule from the app's
    checkout. An app that opens no docs address has no link to judge and nothing to fail here: the missing address
    is [DOCS-06](https://pauta-project.dev/6.0.1/documentation/#docs-06)'s. The rest is in the website's repository: it serves `/docs/v-<version>/` and redirects
    the unversioned paths (in its `astro.config.mjs`, in editora-website). An audit run from the app's checkout
    alone reports the rule as `not-checked` and says what would settle it.
  - *Reference:* Editora [`AppInfo.docsUrl()`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/AppInfo.java), `releaseVersion()`; editora-website [`astro.config.mjs`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/astro.config.mjs), [`README.md`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/README.md)
    (*Versioned docs*). The app template builds the same address (`docsUrl()` in its [`AppInfo.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/AppInfo.java)). Termina and
    Mirada don't yet: each opens its site's unversioned `/docs/` (`DOCUMENTATION` in Termina's [`AppInfo.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/AppInfo.java),
    `DOCS_URL` in Mirada's [`AppInfo.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/AppInfo.java)). Torrenta, Modula and nux open no docs address. The other three
    sites carry a comment to port these routes when their app first deep-links.
- **DOCS-04 · SHOULD.** The website's docs are generated where the app is the source. The Commands and Keybindings
  pages are generated from the app's command registrations, `messages.properties` and keymaps; What's new from
  `CHANGELOG.md`, and the Roadmap from `TODO.md` where the app keeps one ([REPO-08](https://pauta-project.dev/6.0.1/repository/#repo-08)); the
  version from `pom.xml`. The output is committed, so the site builds without the app checked out. A check fails
  the site when a docs page quotes a command id that does not exist or a chord that is bound to a different
  command.
  - *Why:* one fact, one source ([*One source of truth for each fact*](https://pauta-project.dev/6.0.1/principles/#for-the-people-building-them)).
  - *Check (code):* the website's repository holds the generators and their committed output (`scripts/` and
    `src/lib/` in editora-website) and a check of the ids and chords its docs quote (`npm run check:docs` there),
    and the site's build or its deploy workflow runs that check. An app that names no website has no docs to
    generate: the rule fails with [DOCS-01](https://pauta-project.dev/6.0.1/documentation/#docs-01). All the rest is in the website's repository. An audit run
    from the app's checkout alone reports the rule as `not-checked` and says what would settle it.
  - *Reference:* editora-website [`scripts/GenCommands.java`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/scripts/GenCommands.java) (every `Command.of` in Editora's `com.editora.ui`,
    [`WindowCommandRegistrar`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/WindowCommandRegistrar.java) holding most), [`GenRoadmap.java`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/scripts/GenRoadmap.java), [`GenFeatures.java`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/scripts/GenFeatures.java); [`scripts/check-doc-commands.mjs`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/scripts/check-doc-commands.mjs)
    (`npm run check:docs`), which exits non-zero on a missing id or a chord bound to another command. Nothing runs it
    yet: neither the `build` script in [`package.json`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/package.json) nor [`pages.yml`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/.github/workflows/pages.yml) calls it, so it fails the site only when
    someone runs it by hand.
- **DOCS-05 · MUST.** The notes of a GitHub release, the text under its title, are written for the person using the
  app: they say what changed for them, and are not a list of commits or pull requests. In an app with a Welcome
  page, the page's *What's New* link opens this build's release, so those notes are what it shows. The bold
  one-line summary that opens each `CHANGELOG.md` entry is [REPO-02](https://pauta-project.dev/6.0.1/repository/#repo-02); the website's What's
  new is [DOCS-04](https://pauta-project.dev/6.0.1/documentation/#docs-04); taking the notes from the version's `CHANGELOG.md` section is
  [REL-04](https://pauta-project.dev/6.0.1/release/#rel-04).
  - *Check (code):* the release's notes are not generated from the history: the JReleaser configuration's
    `changelog` is not a `format` of commit hashes and titles, and no release step sets `generate_release_notes`.
    They come from text someone wrote, the version's `CHANGELOG.md` section or a notes file. And in an app with a
    Welcome page, the page's *What's New* link opens the build's own release page (`AppInfo.releaseNotesUrl()` in
    Editora).
  - *Reference:* Termina's [`jreleaser.yml`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/jreleaser.yml) takes the notes from a file (`changelog.external`) that
    [`scripts/release-notes.sh`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/scripts/release-notes.sh) writes from the version's `CHANGELOG.md` section; the app template, Torrenta and Mirada
    do the same. Editora doesn't yet: its [`jreleaser.yml`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/jreleaser.yml) builds the notes from the commits
    (`format: '- {{commitShortHash}} {{commitTitle}}'`), and that list is what its *What's New* opens
    ([`AppInfo.releaseNotesUrl()`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/AppInfo.java), [`WelcomePane`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/WelcomePane.java), `welcome.whatsNew`). Modula's [`release.yml`](https://github.com/adriandeleon/Modula/blob/518300a4c2114909315fbd3a73acc999fb4c16b5/.github/workflows/release.yml) and nux's
    [`release.yml`](https://github.com/adriandeleon/nux/blob/d374ec4ee3f2eff0f7d378797884e6b81520ce20/.github/workflows/release.yml) have GitHub generate them (`generate_release_notes: true`).

## Reachable from the app

The documentation is one command away, so nobody has to know the website's address.

- **DOCS-06 · MUST.** The `help.documentation` command opens the user docs in the browser. It is a command like any
  other, so it is in the palette and bindable, and where the app has a Help menu (the Help menu of a menu bar, or a
  Help submenu of the app's main menu, which [WIN-14](https://pauta-project.dev/6.0.1/window-shell/#win-14) defines) a **Documentation** row of
  that menu runs it through the registry like every other row. An app with a Welcome page repeats the command in the
  page's Help row. The row's place in the Help menu is [DOCS-07](https://pauta-project.dev/6.0.1/documentation/#docs-07).
  - *Check (code):* the command `help.documentation` is registered and opens the user docs' address in the
    browser; where the app has a Help menu, a row of that menu runs the command (the Help `MenuSpec` of Editora's
    `MenuBarModel` lists it), and a row beside a Help submenu is not in it; and in an app with a Welcome page, the
    page's Help row runs the same command through the registry (`welcome.documentation` in Editora's
    `WelcomePane`).
  - *Reference:* Editora [`WindowCommandRegistrar`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/WindowCommandRegistrar.java) (`help.documentation` → [`MainController.openDocumentation()`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MainController.java)),
    [`MenuBarModel`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MenuBarModel.java) (`menubar.help`), [`WelcomePane`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/WelcomePane.java) (`welcome.documentation`). Mirada's macOS Help menu has
    the row ([`MacMenus`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/MacMenus.java)); its main menu doesn't yet: there the Documentation row sits beside the Help submenu,
    not in it ([`ui/TitleBar.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/TitleBar.java)).
- **DOCS-07 · SHOULD.** Where the app has a Help menu (the Help menu of a menu bar, or a Help submenu of the app's
  main menu, which [WIN-14](https://pauta-project.dev/6.0.1/window-shell/#win-14) defines), its rows run in this order: Command Palette ·
  Documentation · the keyboard reference ([DOCS-08](https://pauta-project.dev/6.0.1/documentation/#docs-08)) · Welcome Page · Check for Updates · Message Log ·
  Debug Log · Report a Problem · Pauta Conformance · About. In an app with a Simple mode, that mode's Help menu keeps
  Command Palette, Documentation, Welcome Page and About. An app without a feature drops its row; nothing moves.
  - *Check (code):* the rows of the Help menu the app has are in that order, in the full menu and in Simple mode's
    where the app has one (both `menubar.help` menu specs in Editora). An app with a Help menu in a menu bar on one
    OS and a Help submenu in its main menu is judged on both.
  - *Reference:* Editora [`MenuBarModel`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MenuBarModel.java), both `MenuSpec("menubar.help", …)`, for the rows its Help menu has. It has
    no Welcome Page row, since `view.welcome` is still in the View menu ([WELC-03](https://pauta-project.dev/6.0.1/templates/welcome/#welc-03)),
    and no keyboard-reference row. Termina's [`MenuBarModel`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/MenuBarModel.java) (`documentation`, `whatsNew`, `keyboardShortcuts`,
    then `checkForUpdates`) and Mirada's macOS menu bar, [`MacMenus`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/MacMenus.java) (`PALETTE`, `DOCUMENTATION`, `SHORTCUTS`, then
    `CHECK_FOR_UPDATES`) put the keyboard reference there; Termina's What's New row, between the two, is its own.
    The Help submenu of Mirada's main menu doesn't follow the order yet: it holds Message Log, Debug Log, Report a
    Problem, then Check for Updates, and Documentation, the keyboard reference and About are rows of the main menu
    beside it ([`ui/TitleBar.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/TitleBar.java)).
- **DOCS-08 · SHOULD.** Where the app has a Help menu (the Help menu of a menu bar, or a Help submenu of the app's
  main menu, which [WIN-14](https://pauta-project.dev/6.0.1/window-shell/#win-14) defines), a row of it opens a keyboard reference: a searchable
  window of every key, grouped as the menus are, or the keybinding editor.
  - *Check (by hand):* open it from Help, search for a command, and find its key.
  - *Reference:* Termina's [`ShortcutsWindow`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/ShortcutsWindow.java), a row of its Help menu, and Mirada's [`ShortcutsWindow`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/ShortcutsWindow.java), a row of its
    macOS Help menu; in Mirada's main menu the row sits beside the Help submenu. Editora doesn't yet: its
    keybinding editor is a page of Settings ([Keyboard first](https://pauta-project.dev/6.0.1/keyboard/)), and no row of its Help menu opens it
    ([`MenuBarModel`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/MenuBarModel.java)).

A command's one-line description, shown under its title in the palette, is its in-app documentation: every command's
title and description come from the message catalogs, and the parity test holds it
([KBD-03](https://pauta-project.dev/6.0.1/keyboard/#kbd-03)).

- **DOCS-10 · MAY.** An app with a Search Everywhere picker opens per-command help from it as the Command Palette
  does: with a command highlighted, the palette's help chord ([PAL-08](https://pauta-project.dev/6.0.1/templates/command-palette/#pal-08)) opens
  the command's page, `/docs/v-<version>/commands/<id>`. The two pickers share the chord and the URL builder, so
  they can never disagree.
  - *Check (code):* Search Everywhere takes its help chord the way the palette does and builds the page's address
    with the palette's own method (Editora's `CommandPalette.docsUrl`).
  - *Reference:* Editora [`SearchEverywhereHost`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/SearchEverywhereHost.java) (`CommandPalette.docsUrl`) and [`SearchEverywherePopup`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/SearchEverywherePopup.java) (`docsChord`, from
    [`PickerKeys.freeChord`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/PickerKeys.java) as the palette's); [`CommandPalette.docsUrl`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/CommandPalette.java).
- **DOCS-11 · MAY.** Each page of the Settings window has a link to its docs page, *Help for* and the page's name,
  from one map of page to slug.
  - *Check (code):* one map from Settings page to docs slug feeds every page's help link.
  - *Reference:* Editora [`SettingsWindow`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/SettingsWindow.java), [`SettingsFrameBits.helpUrl`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/SettingsFrameBits.java), `settings.help`.

### Strings

| Key | English |
|---|---|
| `command.help.documentation` | Documentation |
| `command.help.documentation.desc` | Open the &lt;App&gt; documentation site for this version in your browser. |
| `welcome.documentation` / `welcome.whatsNew` | Documentation / What's New |
| `settings.help` | Help for {0} |

## Developer documentation

- **DOCS-12 · MUST.** `docs/` has an index. `docs/README.md` says who the folder is for (contributors; user docs
  live on the website) and lists every guide with one line; that the code wins is [DOCS-17](https://pauta-project.dev/6.0.1/documentation/#docs-17). Which
  guides the folder holds is [REPO-07](https://pauta-project.dev/6.0.1/repository/#repo-07).
  - *Check (code):* `docs/README.md` exists, says who it is for, and links each guide in `docs/`.
  - *Reference:* Editora's [`docs/README.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/docs/README.md); the template's [`docs/`](https://github.com/adriandeleon/adl-desktop-app-template/tree/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/docs).
- **DOCS-13 · SHOULD.** Every choice a newcomer would question has a decision record: a fork, a rejected
  dependency, a storage format, an escape hatch. It is one numbered Markdown file, `docs/decisions/NNNN-slug.md`,
  with the context, the decision and what it costs.
  - *Check (code):* `docs/decisions/` holds `NNNN-slug.md` files, each with context, decision and consequences.
  - *Reference:* Editora's [`docs/decisions/`](https://github.com/adriandeleon/Editora/tree/f314ca3b117829d25dbaa63be6ba2353fd898fd8/docs/decisions) (18 records, from [`0001-richtextfx-fork.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/docs/decisions/0001-richtextfx-fork.md)).
- **DOCS-14 · MUST.** Three files have three jobs. `AGENTS.md` is the operational guide (what it holds is
  [REPO-05](https://pauta-project.dev/6.0.1/repository/#repo-05)). `CONTRIBUTING.md` is the short version for a person, pointing into
  `docs/`. `docs/` holds the durable explanations. Exhaustive history goes to `docs/reference/`, not into any of
  the three.
  - *Check (code):* `CONTRIBUTING.md` links into `docs/`. Neither `AGENTS.md`, `CONTRIBUTING.md` nor a guide in
    `docs/` ([REPO-07](https://pauta-project.dev/6.0.1/repository/#repo-07)) holds exhaustive history: a record of past work, or a catalog
    that sets out to list every part of a subsystem or every command (Editora's `architecture-catalog.md` and
    `commands.md` are two). Where the app keeps such material, it is in files under `docs/reference/`; an app
    that keeps none needs no `docs/reference/` and passes on the link. An audit report (`docs/pauta-audit.md`) is
    not such material.
  - *Reference:* Editora's [`AGENTS.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/AGENTS.md) (*Documentation map*), [`CONTRIBUTING.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/CONTRIBUTING.md), [`docs/reference/README.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/docs/reference/README.md).
- **DOCS-15 · SHOULD.** Javadoc sits on its member: a doc comment above another doc comment documents nothing.
  Comments say why, not what.
  - *Check (code):* no Javadoc comment in the main or the test sources is followed by another with only blank
    lines or `//` comments between them. A test that asserts it is the surest evidence.
  - *Reference:* Editora [`StackedJavadocTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/StackedJavadocTest.java), which fails the build on one.

## Kept in step

- **DOCS-16 · MUST.** The docs change with the code. A change that affects behavior updates `CHANGELOG.md` and the
  contributor guides it touches in the same pull request, the website's user docs in a pull request on the
  website's repository opened with it, and `TODO.md` where the app keeps one ([REPO-08](https://pauta-project.dev/6.0.1/repository/#repo-08));
  never as a follow-up. A reviewer treats a feature PR with no docs change as incomplete.
  - *Check (by hand):* read the app's most recently merged feature pull requests on GitHub, as many as it takes
    to see the habit: each one's diff touches `CHANGELOG.md`, the guides it concerns and, where the app keeps
    one, `TODO.md`, and one that changes what a user sees names the website's pull request. A recent one that
    changed behavior and touched none of them fails the rule. That `docs/conventions.md`, `CONTRIBUTING.md` and
    `AGENTS.md` state the rule shows it is asked, not that it is kept. The person reads GitHub, not the running
    app, and the rule is still checked by hand: an audit reports it as `manual`.
  - *Reference:* Editora [`docs/conventions.md#docs-in-the-same-pr`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/docs/conventions.md#docs-in-the-same-pr), [`CONTRIBUTING.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/CONTRIBUTING.md) (step 4, which names the
    website repository), [`AGENTS.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/AGENTS.md); the template's [`docs/conventions.md`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/docs/conventions.md). Editora, the template, Mirada and nux
    keep a `TODO.md`; Termina, Torrenta and Modula keep none.
- **DOCS-17 · MUST.** When documentation and code disagree, the code wins, and the documentation is fixed in the
  same change. `AGENTS.md` and `docs/README.md` say so, where a coding agent and a contributor start reading.
  Pauta applies the same rule to itself.
  - *Check (code):* `AGENTS.md` and `docs/README.md` say so.
  - *Reference:* Editora's [`AGENTS.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/AGENTS.md), [`docs/README.md`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/docs/README.md).
- **DOCS-18 · SHOULD.** An app's screenshots are retaken, not described: its capture hook or headless fixture
  ([QUAL-09](https://pauta-project.dev/6.0.1/quality/#qual-09)) renders the real window at 2× after any UI change, for the README (its hero in
  light and dark), the website and bug reports.
  - *Why:* a stale screenshot claims what is not true.
  - *Check (by hand):* the README's hero, in its light and its dark form, and the website's screenshots show the
    current UI at 2×; they are rendered from the real window by the capture hook or headless fixture
    [QUAL-09](https://pauta-project.dev/6.0.1/quality/#qual-09) asks for, not drawn or described.
  - *Reference:* Termina's [`DevCapture.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/DevCapture.java) and Torrenta's [`DevCapture.java`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/DevCapture.java), and nux's
    [`ui/Screenshot.java`](https://github.com/adriandeleon/nux/blob/d374ec4ee3f2eff0f7d378797884e6b81520ce20/src/main/java/com/nux/ui/Screenshot.java) ([Shared features](https://pauta-project.dev/6.0.1/family/shared-features/)). None of the three renders at 2× yet: each writes what
    `scene.snapshot(null)` returns, the scene at its own size. Editora doesn't yet: it has no capture hook, and its
    headless fixture writes a screenshot from three FX tests only, when `-Deditora.test.shots=<dir>` is set, and
    at the scene's own size too ([`SplitViewFxTest`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/test/java/com/editora/ui/SplitViewFxTest.java)).

The README's own shape, at most 250 lines that leave the detail to the website's docs, is
[REPO-01](https://pauta-project.dev/6.0.1/repository/#repo-01).
