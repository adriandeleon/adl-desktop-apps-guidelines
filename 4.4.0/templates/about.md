# About window

> The family's About panel: identity, update status, license, links and copyable environment details.

Pauta 4.4.0 (2026-11-08). The page with its screenshots and mockups: https://pauta-project.dev/4.4.0/templates/about/.
Every rule of the edition: https://pauta-project.dev/4.4.0/llms-full.txt.

The About window answers "what exactly am I running?" in one place, and its details are what a bug report needs.
Torrenta ([`AboutDialog`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/AboutDialog.java)), Termina, Modula, Mirada and nux (`AboutWindow`) follow Editora's order.

## Rules

- **ABOUT-01 · MUST.** Every app has an About window, reached by Help → About, the `help.about` command, and on
  macOS the application menu's About item.
  - *Check (code):* `help.about` is registered and listed in the Help menu, and the macOS application menu's About
    item runs it.
  - *Reference:* Editora [`ui/AboutDialog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/AboutDialog.java), [`ui/MenuBarModel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarModel.java) (`help.about` in the Help menu).
- **ABOUT-02 · MUST.** About shows the version and build, the Pauta edition (see below), the runtime, the license,
  links, and the result of the last update check.
  - *Check (code):* the window reads the version, build and edition from `AppInfo`, the same text as `--version`,
    and shows the update checker's last answer.
  - *Reference:* Editora [`ui/AboutDialog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/AboutDialog.java), [`AppInfo`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/AppInfo.java); the Spec table below.
- **ABOUT-03 · SHOULD.** *Copy details* copies the environment block and leaves the window open; its label becomes
  "Copied".
  - *Check (code):* the button sits in the content, not the dialog's button bar, so pressing it can't close the
    window.
  - *Reference:* Editora [`AboutDialog`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/AboutDialog.java) (`about.copyDetails`, `about.copied`).
- **ABOUT-04 · SHOULD.** The update status claims nothing before a check has answered: with no answer, or with the
  check switched off, it says it has not checked, never "up to date".
  - *Check (code):* the status falls back to the not-checked text when the checker has no result.
  - *Reference:* Editora [`AboutDialog`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/AboutDialog.java) (`about.notChecked`); the states below.

## Anatomy

*Mockup of the About window. Drawn on the page; the numbers below mark its parts.*

1. **Identity.** The app icon at 72 px beside the name (26 px, bold). No alert header band, no info graphic: the panel reads as one block, like a native About panel.
2. **Version and tagline.** Version 14 px muted; a snapshot build appends its Git branch, "0.28.0-SNAPSHOT (feat/map)". The tagline is the README's one-line pitch, 13 px muted.
3. **Update status.** What the last update check found (see the states below), when it ran, and *Check now*. Nothing is claimed before a check has answered.
4. **Copyright**, muted.
5. **Links.** License, homepage, source code and releases, the Pauta edition the app is built to and its conformance, which opens the [Pauta window](https://pauta-project.dev/4.4.0/templates/pauta-window/) (see below), and the settings file, which opens in the app (or in the file manager for apps with no editor).
6. **Environment.** Monospace 11.5 px, muted: version and build time, commit, Pauta edition and conformance, Java and JavaFX versions with vendor, OS with architecture, config folder. Home folders shown as `~`.
7. **Copy details** copies the environment block and stays open; its label becomes "Copied". It sits in the content, not the button bar, so pressing it does not close the panel.
8. **Close**, the one button, and the default: Enter and Esc both close.

## Pauta edition and conformance

About names the edition of these guidelines the app implements and how fully it conforms
([Conformance](https://pauta-project.dev/4.4.0/conformance/)), so a user, a bug report and a reviewer all know which
rules the app answers to. No app does it yet; the app template names its edition in its README and [`AGENTS.md`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/AGENTS.md) only.

- **ABOUT-05 · MUST.** The edition appears in two places: a link, *Built to Pauta 2.0.0*, among the others, and a
  line `Pauta: 2.0.0` in the environment block, right after the commit, so *Copy details* carries it.
  - *Check (code):* the links use the `about.pauta` key, and the environment block writes a `Pauta:` line after the
    commit.
  - *Reference:* no app yet.
- **ABOUT-06 · MUST.** The link opens the edition's own address, `https://pauta-project.dev/<edition>/` (for example
  `https://pauta-project.dev/2.0.0/`), which never changes, not `latest/`, which moves on to newer editions.
  - *Check (code):* the URL is built from the edition number and never contains `latest`.
  - *Reference:* no app yet.
- **ABOUT-07 · MUST.** The number is the edition the app meets, not the newest. Moving to a newer edition means
  reading its changelog for new or stronger MUSTs, meeting them, then changing the number. An app at Partial names
  the edition it is working toward instead, and says so (ABOUT-09).
  - *Check (by hand):* audit the app against the MUSTs of the edition it names.
  - *Reference:* no app yet.
- **ABOUT-08 · MUST.** The edition has one source: a `pauta.version` property in `pom.xml`, filtered into
  `build-info.properties` and read by `AppInfo`, like the app's own version. The README's Pauta badge and its "Built
  to" line name the same edition and change with it.
  - *Check (code):* `pom.xml` defines `pauta.version`, `build-info.properties` carries it, `AppInfo` reads it, and
    the README names the same number.
  - *Reference:* no app yet.
- **ABOUT-09 · MUST.** About shows the app's conformance, Complete, Core or Partial, as the helper computes it from
  `pauta.json` ([PAUTA-02](https://pauta-project.dev/4.4.0/conformance/#pauta-02)) and never higher: a link, *Pauta conformance: Core*, right
  after the edition's, that opens the [Pauta window](https://pauta-project.dev/4.4.0/templates/pauta-window/), and a line `Pauta conformance: Core (2
  exceptions)` right after the `Pauta:` line; with one it says `(1 exception)`, with none `(no exceptions)`. At
  Partial the edition's link reads *Working toward Pauta 4.2.0*: the app does not meet that edition yet, so it does
  not say it is built to it.
  - *Why:* [*Never claim what is not true*](https://pauta-project.dev/4.4.0/principles/#for-the-people-using-the-apps).
  - *Check (code):* About calls the conformance helper and holds no conformance name of its own; the link runs
    `help.pauta`; at Partial the edition's link uses `about.pautaWorkingToward`.
  - *Reference:* no app yet.

## Update status states

*Newer releaseUpdate available: 0.28.0Last checked 5 minutes ago. Check now CurrentYou are up to date.Last checked 2 hours ago. Check now Never checkedNot checked for updates yet. Check now CheckingLast checked 2 hours ago. Checking… FailedUpdate check failed: connection timed outCheck now*

"Update available" links to that release's page. An update check that is switched off must never read as "up to
date": with no answer, the panel says it has not checked.

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | A modal dialog owned by the window, styled through `Dialogs.styled` so it gets `app.css` and the UI font | `AboutDialog.show` |
| Layout | One column, 14 px between blocks; content padding 6 8 2 8 | `.about-content` |
| Icon | The app icon PNG at 72 px | `icon-128.png` |
| Name / version / tagline | 26 px bold / 14 px muted / 13 px muted | `.about-name`, `.about-version`, `.about-tagline` |
| Update colors | Available: accent, bold. Up to date: green. Failed: red. Last checked: muted | `.about-update*` |
| Environment | JetBrains Mono 11.5 px, muted | `.about-env` |
| Source of the version | Maven-filtered `build-info.properties`, read by `AppInfo`: the same text as `--version` and a problem report | `AppInfo` |
| Pauta edition | `pauta.version` in `pom.xml`, filtered into `build-info.properties`; the link opens `https://pauta-project.dev/<edition>/` | no app yet |
| Pauta conformance | Computed from `pauta.json` by the conformance helper; the link opens the Pauta window | [Conformance](https://pauta-project.dev/4.4.0/conformance/) |

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

*Screenshot: Editora.*
