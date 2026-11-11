# About window

> The family's About panel: identity, update status, license, links and copyable environment details.

Pauta 6.0.0 (2026-11-10). The page with its screenshots and mockups: https://pauta-project.dev/6.0.0/templates/about/.
Every rule of the edition: https://pauta-project.dev/6.0.0/llms-full.txt.

The About window answers "what exactly am I running?" in one place, and its details are what a bug report needs.
Torrenta ([`AboutDialog`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/ui/AboutDialog.java)), Termina, Modula, Mirada and nux (`AboutWindow`) follow Editora's order.

## Rules

- **ABOUT-01 · MUST.** Every app has an About window, reached by the `help.about` command, by Help → About where the
  app has a Help menu (the Help menu of a menu bar, or a Help submenu of the app's main menu, which
  [WIN-14](https://pauta-project.dev/6.0.0/window-shell/#win-14) defines), and on macOS by the About item of the application menu, the one macOS
  names after the app. The app adds that item itself: JavaFX builds the menu with Hide and Quit and no About.
  - *Why:* on macOS that menu is where every app keeps About, so it is one of the places
    [the OS's way wins](https://pauta-project.dev/6.0.0/same-on-every-os/#where-the-oss-way-wins).
  - *Check (code):* `help.about` is registered and opens the About window; where the app has a Help menu, a row
    inside that menu runs the command (a row beside a Help submenu is not in it); and on macOS the app inserts an
    About item into the application menu that opens the same window.
  - *Reference:* Editora [`ui/AboutDialog.java`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/AboutDialog.java) and [`ui/MenuBarModel.java`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/MenuBarModel.java) (`help.about` ends the Help menu), and the
    app template's [`ui/Commands.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/ui/Commands.java) and [`ui/AppMenus.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/ui/AppMenus.java), do the Help row and the command. Neither adds the macOS item
    yet, and nor do Torrenta, Modula and nux. Termina ([`ui/MacAppMenu.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/MacAppMenu.java)) and Mirada ([`os/MacAppMenu.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/os/MacAppMenu.java)) do: JavaFX has no
    public API for that menu, so both insert the item into the one Glass keeps (`MacApplication.getAppleMenu`).
    Neither is the whole rule: Termina's command is `about`, not `help.about`, and Mirada's About row sits beside
    the Help submenu of its main menu, not in it ([`ui/TitleBar.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/TitleBar.java), `finish`).
- **ABOUT-02 · MUST.** About shows the version and build, the runtime, the license, links to the app's home page,
  its source code and its releases, and the result of the last update check. The Pauta edition is
  [ABOUT-05](https://pauta-project.dev/6.0.0/templates/about/#about-05).
  - *Check (code):* the About window shows the version and the build as the build recorded them (in Editora both
    come from `AppInfo`, which `--version` prints from too); the Java and JavaFX versions; the license; a link that
    opens the app's home page (its website, or its repository's page on the host where About links no website),
    one that opens its source code (the repository) and one that opens its releases (the repository's releases
    page or its latest release), each there whatever the update check answered; and the update checker's last
    answer whatever it was (an update, up to date, a failed check or not checked yet), not only an update that is
    available. One link meets two of the three when the page it opens is both: the repository's page is the home
    page and the source code where About links no website, and a releases page of the repository holds its source
    too (Editora's "Source code and releases"). A link to the running build's release notes, and a link shown only
    when an update is available, are not the link to the releases.
  - *Reference:* Editora [`ui/AboutDialog.java`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/AboutDialog.java), [`AppInfo`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/AppInfo.java) (`HOMEPAGE`, its website, and `RELEASES_PAGE`, the
    repository's latest release, behind "Source code and releases"); the page's [Spec](https://pauta-project.dev/6.0.0/templates/about/#spec). Four apps lack a
    link. Termina's About ([`ui/AboutWindow.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/AboutWindow.java)) links its website and not its source code, and its releases
    only when an update is available. Mirada's ([`ui/AboutWindow.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/AboutWindow.java)) links its repository and the running build's
    release notes, and its releases only when an update is available. Modula's About
    ([`ui/AboutWindow.java`](https://github.com/adriandeleon/Modula/blob/518300a4c2114909315fbd3a73acc999fb4c16b5/src/main/java/com/modula/ui/AboutWindow.java)) links its repository and never its releases; it also shows no Java version, and it
    shows the update check only when an update is available. nux's ([`ui/AboutWindow.java`](https://github.com/adriandeleon/nux/blob/d374ec4ee3f2eff0f7d378797884e6b81520ce20/src/main/java/com/nux/ui/AboutWindow.java)) has the runtime lines
    and links its repository; it shows the update check, and with it the link to its releases, only when there is
    a newer version.
- **ABOUT-03 · SHOULD.** About's *Copy details* button copies the environment block and leaves the window open; its
  label becomes "Copied".
  - *Check (code):* the button's handler puts the environment block's text on the clipboard and sets the button's
    label to the copied text (Editora's `about.copied`); the button sits in the content, not the dialog's button
    bar, so pressing it can't close the window.
  - *Reference:* Editora [`AboutDialog`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/AboutDialog.java) (`about.copyDetails`, `about.copied`).
- **ABOUT-04 · SHOULD.** About's update status claims nothing before a check has answered: with no answer, or with
  the check switched off, it says it has not checked, never "up to date".
  - *Check (code):* About's update status falls back to the not-checked text when the checker has no result.
  - *Reference:* Editora [`AboutDialog`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/java/com/editora/ui/AboutDialog.java) (`about.notChecked`); the [Update status states](https://pauta-project.dev/6.0.0/templates/about/#update-status-states).
- **ABOUT-10 · SHOULD.** In About, an available update stands out: "Update available" is bold in amber, a color no
  link or label in About uses, while the links stay in the accent, "up to date" is green, a failed check red and
  the last-checked line muted (Editora's tokens for the four are `-state-amber`, `-state-accent`, `-state-green`
  and `-state-red`).
  - *Why:* in the accent every link wears, the one line that asks for action reads as one more link.
  - *Check (code):* the style of About's update-available line (the app template's `.about-update-available`) is
    bold in the amber token, and no other About style uses that token; the up-to-date line is in the green token,
    a failed check in the red and the last-checked line in the muted color, and the links keep the accent.
  - *Reference:* the [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s `.about-update-available` in [`styles/app.css`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/resources/com/example/app/styles/app.css), set by [`ui/AboutDialog.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/ui/AboutDialog.java).
    No released app does yet: Editora's `.about-update` in [`app.css`](https://github.com/adriandeleon/Editora/blob/c9a28545f5be0b1411dc07ab7ca07bed010d13fd/src/main/resources/com/editora/styles/app.css) is `-state-accent`, the links' color.

## Anatomy

*Mockup of the About window. Drawn on the page; the numbers below mark its parts.*

1. **Identity.** The app icon at 72 px beside the name (26 px, bold). No alert header band, no info graphic: the panel reads as one block, like a native About panel.
2. **Version and tagline.** Version 14 px muted; a snapshot build appends its Git branch, "0.28.0-SNAPSHOT (feat/map)". The tagline is the README's one-line pitch, 13 px muted.
3. **Update status.** What the last update check found (see the states below), when it ran, and *Check now*. Nothing is claimed before a check has answered.
4. **Copyright**, muted.
5. **Links.** License, homepage, source code and releases, the Pauta edition the app is built to and its conformance, which opens the [Pauta window](https://pauta-project.dev/6.0.0/templates/pauta-window/) (see below), and the settings file, which opens in the app (or in the file manager for apps with no editor).
6. **Environment.** Monospace 11.5 px, muted: version and build time, commit, Pauta edition and conformance, Java and JavaFX versions with vendor, OS with architecture, config folder. Home folders shown as `~`.
7. **Copy details** copies the environment block and stays open; its label becomes "Copied". It sits in the content, not the button bar, so pressing it does not close the panel.
8. **Close**, the one button, and the default: Enter and Esc both close.

## Pauta edition and conformance

About names the edition of these guidelines the app implements and how fully it conforms
([Conformance](https://pauta-project.dev/6.0.0/conformance/)), so a user, a bug report and a reviewer all know which
rules the app answers to. The [app template](https://github.com/adriandeleon/adl-desktop-app-template) shows both; Termina's and Mirada's About name their
edition but not their conformance.

- **ABOUT-05 · MUST.** About names the Pauta edition in two places: a link, *Built to Pauta x.y.z*, among its other
  links (at Partial it reads *Working toward Pauta x.y.z*, [ABOUT-09](https://pauta-project.dev/6.0.0/templates/about/#about-09)), and a line `Pauta: x.y.z` in the
  environment block, right after the commit, so *Copy details* carries it.
  - *Check (code):* one of About's links reads *Built to Pauta* and the edition, or *Working toward Pauta* and the
    edition at Partial, in words from the catalog, and About's environment block writes a `Pauta:` line right after
    the commit line. The rule asks for the words, not for a catalog key: the app template's and Termina's key is
    `about.pauta`, Mirada's `about.pautaLink`.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/AboutDialog.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/ui/AboutDialog.java) and [`AppInfo.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/AppInfo.java); Termina's [`ui/AboutWindow.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/ui/AboutWindow.java) and [`AppInfo.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/AppInfo.java);
    Mirada's [`ui/AboutWindow.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/ui/AboutWindow.java) (`about.pautaLink`) and [`AppInfo.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/AppInfo.java).
- **ABOUT-06 · MUST.** About's edition link ([ABOUT-05](https://pauta-project.dev/6.0.0/templates/about/#about-05)) opens the edition's own address,
  `https://pauta-project.dev/<edition>/`, which never changes, not `latest/`, which moves on to newer editions.
  - *Check (code):* the URL About's edition link opens is built from the edition number (`pauta.version`) and never
    contains `latest`. An About with no edition link has nothing to open: the rule fails with
    [ABOUT-05](https://pauta-project.dev/6.0.0/templates/about/#about-05), which requires the link, and the evidence names that rule.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`AppInfo.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/AppInfo.java) (`pautaUrl`); Termina's [`AppInfo.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/AppInfo.java) (`pautaUrl`);
    Mirada's [`AppInfo.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/AppInfo.java) (`pautaUrl`).
- **ABOUT-07 · MUST.** The Pauta edition About names is the edition the app meets, not the newest. Moving to a
  newer edition means reading its changelog for new or stronger MUSTs, meeting them, then changing the number. An
  app at Partial names the edition it is working toward instead, and says so ([ABOUT-09](https://pauta-project.dev/6.0.0/templates/about/#about-09)).
  - *Check (code):* read which words About uses for the edition ([ABOUT-09](https://pauta-project.dev/6.0.0/templates/about/#about-09)). *Working toward* meets
    the rule. An About that names no edition claims none: this rule has nothing to judge and passes, and the
    missing edition is [ABOUT-05](https://pauta-project.dev/6.0.0/templates/about/#about-05)'s finding. *Built to* is judged last, from the audit's other results:
    audited against the edition the app names (`pauta.version`), with that edition's own rules
    (`https://pauta-project.dev/<edition>/rules.json`), not the newest edition's, the app has no MUST that is `fail` or `pending`. The evidence names the MUSTs that are. An
    audit of part of the edition judges the rule from the MUSTs in its scope and says so. Only the rules of the
    edition the app names settle a *Built to*: an audit run against another edition reports the rule as
    `not-checked` and names the edition whose rules would settle it.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template), which is at Partial: its About says *Working toward Pauta 4.1.0*
    ([`ui/AboutDialog.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/ui/AboutDialog.java), `editionKey`) and so does its README. Termina and Mirada don't meet it yet.
    Termina's About says "Built to Pauta 2.0.2" ([`pom.xml`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/pom.xml), `pauta.version`), an edition that already
    required a find bar in its Debug Log, the UI font on every scene and the command ids `help.about` and
    `palette.show`, none of which it has. Mirada's says "Built to Pauta 4.0.1", an edition that already required
    its settings in `~/.mirada` on every OS.
- **ABOUT-08 · MUST.** The Pauta edition an app names has one source: a `pauta.version` property in `pom.xml`,
  which the build filters into the app's resources and the app reads from there, like its own version
  (`build-info.properties` and `AppInfo` in the app template). The README's badge and "Built to" line, which name
  that edition too, are [PAUTA-15](https://pauta-project.dev/6.0.0/conformance/#pauta-15).
  - *Check (code):* `pom.xml` defines `pauta.version`; a resource the build filters carries it (the app template's
    `build-info.properties`); and the edition the app shows is read from that resource (the template's `AppInfo`),
    never from a literal in its code.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`pom.xml`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/pom.xml), `build-info.properties` and [`AppInfo.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/AppInfo.java); Termina's the same, with [`AppInfo.java`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/main/java/com/termina/AppInfo.java),
    and Mirada's, with its [`pom.xml`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/pom.xml) and [`AppInfo.java`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/main/java/com/mirada/AppInfo.java).
- **ABOUT-09 · MUST.** About shows the app's conformance, Complete, Core or Partial, as the conformance helper
  computes it from `pauta.json` ([PAUTA-02](https://pauta-project.dev/6.0.0/conformance/#pauta-02)) and never higher: a link, *Pauta
  conformance: Core*, right after the edition's link, that runs the `help.pauta` command and so opens the Pauta
  window ([PWIN-01](https://pauta-project.dev/6.0.0/templates/pauta-window/#pwin-01)), and a line `Pauta conformance: Core (2 exceptions)` in the
  environment block, right after the `Pauta:` line; with one it says `(1 exception)`, with none `(no exceptions)`.
  At Partial the edition's link reads *Working toward Pauta x.y.z*: the app does not meet that edition yet, so it
  does not say it is built to it.
  - *Why:* [*Never claim what is not true*](https://pauta-project.dev/6.0.0/principles/#for-the-people-using-the-apps).
  - *Check (code):* About calls the conformance helper and holds no conformance name of its own; its conformance
    link runs `help.pauta`; the environment block has the conformance line after the `Pauta:` line; and at Partial
    the edition's link reads *Working toward Pauta* and the edition (the app template's key for it is
    `about.pautaWorkingToward`).
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/AboutDialog.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/ui/AboutDialog.java) and [`PautaConformance.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b1ba438e61bce02fcbc389f1775f34a7def1ee31/src/main/java/com/example/app/PautaConformance.java) (`environmentLine`). Termina's and Mirada's About show the edition but not the
    conformance.

## Update status states

- *Newer release / Update available: 0.28.0 / Last checked 5 minutes ago. / Check now*
- *Current / You are up to date. / Last checked 2 hours ago. / Check now*
- *Never checked / Not checked for updates yet. / Check now*
- *Checking / Last checked 2 hours ago. / Checking…*
- *Failed / Update check failed: connection timed out / Check now*

"Update available" links to that release's page. An update check that is switched off must never read as "up to
date": with no answer, the panel says it has not checked.

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | A modal dialog owned by the window, styled through `Dialogs.styled` so it gets `app.css` and the UI font | `AboutDialog.show` |
| Layout | One column, 14 px between blocks; content padding 6 8 2 8 | `.about-content` |
| Icon | The app icon PNG at 72 px | `icon-128.png` |
| Name / version / tagline | 26 px bold / 14 px muted / 13 px muted | `.about-name`, `.about-version`, `.about-tagline` |
| Update colors | Available: amber, bold ([ABOUT-10](https://pauta-project.dev/6.0.0/templates/about/#about-10)). Up to date: green. Failed: red. Last checked: muted | `.about-update*` |
| Environment | JetBrains Mono 11.5 px, muted | `.about-env` |
| Source of the version | Maven-filtered `build-info.properties`, read by `AppInfo`: the same text as `--version` and a problem report | `AppInfo` |
| Pauta edition | `pauta.version` in `pom.xml`, filtered into `build-info.properties`; the link opens `https://pauta-project.dev/<edition>/` | the app template's, Termina's and Mirada's `AppInfo.pautaUrl` |
| Pauta conformance | Computed from `pauta.json` by the conformance helper; the link opens the Pauta window | [Conformance](https://pauta-project.dev/6.0.0/conformance/) |

## Copy

| Key | English |
|---|---|
| `dialog.about.title` | About {0} |
| `about.version` | Version {0} |
| `about.updateAvailable` | Update available: |
| `about.upToDate` | You are up to date. |
| `about.lastChecked` | Last checked {0}. |
| `about.notChecked` | Not checked for updates yet. |
| `about.checkNow` / `about.checking` | Check now / Checking… |
| `about.homepage` / `about.releases` | Homepage / Source code and releases |
| `about.pauta` / `about.pautaWorkingToward` | Built to Pauta {0} / Working toward Pauta {0} |
| `about.pautaConformance` | Pauta conformance: {0} |
| `about.copyDetails` / `about.copied` | Copy details / Copied |

## In the apps

*Screenshot: Editora's About before its first update check: identity, links and the environment block, with no Pauta link or Pauta line yet, which ABOUT-05 asks for.*
