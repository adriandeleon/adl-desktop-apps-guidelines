---
title: "About window"
description: "The family's About panel: identity, update status, license, links and copyable environment details."
---

The About window answers "what exactly am I running?" in one place, and its details are what a bug report needs.
Torrenta ([`AboutDialog`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/AboutDialog.java)), Termina, Modula, Mirada and nux (`AboutWindow`) follow Editora's order.

## Rules

- **ABOUT-01 · MUST.** Every app has an About window, reached by the `help.about` command, by Help → About where
  the app has a Help menu, and on macOS by the About item of the application menu, the one macOS names after the app. The app adds that item itself:
  JavaFX builds the menu with Hide and Quit and no About.
  - *Why:* on macOS that menu is where every app keeps About, so it is one of the places
    [the OS's way wins](../../same-on-every-os/#where-the-oss-way-wins).
  - *Check (code):* `help.about` is registered and opens the About window, the Help menu lists it where the app has one, and on macOS the
    app inserts an About item into the application menu that opens the same window.
  - *Reference:* Editora [`ui/AboutDialog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/AboutDialog.java) and [`ui/MenuBarModel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarModel.java) (`help.about` ends the Help menu), and the
    app template's [`ui/Commands.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Commands.java) and [`ui/AppMenus.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/AppMenus.java), do the Help row and the command. Neither adds the macOS item
    yet, and nor do Torrenta, Modula and nux. Termina ([`ui/MacAppMenu.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/MacAppMenu.java)) and Mirada ([`os/MacAppMenu.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/os/MacAppMenu.java)) do: JavaFX has no
    public API for that menu, so both insert the item into the one Glass keeps (`MacApplication.getAppleMenu`).
    Neither is the whole rule: Termina's command is `about`, not `help.about`, and Mirada's About row is beside its
    Help menu, not in it.
- **ABOUT-02 · MUST.** About shows the version and build, the runtime, the license, links, and the result of the last
  update check. The Pauta edition is [ABOUT-05](#about-05).
  - *Check (code):* the window reads the version and build from `AppInfo`, the same text as `--version`, and shows
    the update checker's last answer.
  - *Reference:* Editora [`ui/AboutDialog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/AboutDialog.java), [`AppInfo`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/AppInfo.java); the page's [Spec](#spec).
- **ABOUT-03 · SHOULD.** *Copy details* copies the environment block and leaves the window open; its label becomes
  "Copied".
  - *Check (code):* the button's handler puts the environment block's text on the clipboard and sets the button's
    label to the copied text (`about.copied`); the button sits in the content, not the dialog's button bar, so
    pressing it can't close the window.
  - *Reference:* Editora [`AboutDialog`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/AboutDialog.java) (`about.copyDetails`, `about.copied`).
- **ABOUT-04 · SHOULD.** The update status claims nothing before a check has answered: with no answer, or with the
  check switched off, it says it has not checked, never "up to date".
  - *Check (code):* the status falls back to the not-checked text when the checker has no result.
  - *Reference:* Editora [`AboutDialog`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/AboutDialog.java) (`about.notChecked`); the [Update status states](#update-status-states).
- **ABOUT-10 · SHOULD.** An available update stands out: "Update available" is bold in `-state-amber`, a color no
  link or label in About uses, while the links stay `-state-accent`, "up to date" is `-state-green`, a failed check
  `-state-red` and the last-checked line muted.
  - *Why:* in the accent every link wears, the one line that asks for action reads as one more link.
  - *Check (code):* the update-available style (`.about-update`) uses `-state-amber`, and no other About style does.
  - *Reference:* the [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s `.about-update-available` in [`styles/app.css`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/resources/com/example/app/styles/app.css), set by [`ui/AboutDialog.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/AboutDialog.java).
    No released app does yet: Editora's `.about-update` in [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) is `-state-accent`, the links' color.

## Anatomy

<div class="mock-stage">
<div class="m-card m-dialog" role="img" aria-label="Mockup of the About window">
<div class="titlebar">About Editora</div>
<div class="m-about-head"><img src="../../icons/editora.svg" alt="" /><div><div class="m-row"><span class="m-about-name">Editora</span><span class="pin">1</span></div><div class="m-about-version">Version 0.27.0 <span class="pin">2</span></div><div class="m-about-tagline">A keyboard-driven, cross-platform programmer's text editor.</div></div></div>
<div><div class="m-row"><span class="m-link" style="font-weight:700;color:var(--m-amber)">Update available: 0.28.0</span><span class="pin">3</span></div><div class="m-subtle" style="font-size:12px">Last checked 5 minutes ago. <span class="m-link">Check now</span></div></div>
<div class="m-muted">© 2026 Adrián Arturo De León Saldivar <span class="pin">4</span></div>
<div style="display:flex;flex-direction:column;gap:2px"><span class="m-row"><span class="m-link">MIT License</span><span class="pin">5</span></span><span class="m-link">Homepage</span><span class="m-link">Source code and releases</span><span class="m-link">Built to Pauta x.y.z</span><span class="m-link">Pauta conformance: Core</span><span class="m-link">Settings: ~/.editora/settings.json</span></div>
<div class="m-row" style="align-items:flex-start"><div class="m-env">Editora 0.27.0 (Built 2026-11-05 17:02:11 UTC)
Commit 1dab6d8fd
Pauta: x.y.z
Pauta conformance: Core (2 exceptions)
Java: 25.0.4 (Eclipse Adoptium)
JavaFX: 27+30
OS: Linux 6.12.115+deb13.1-amd64 (amd64)
Config: ~/.editora</div><span class="pin">6</span></div>
<div class="m-footer-row"><span class="m-row"><span class="m-btn">Copy details</span><span class="pin">7</span></span><span class="m-row"><span class="pin">8</span><span class="m-btn primary">Close</span></span></div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Identity.</strong> The app icon at 72 px beside the name (26 px, bold). No alert header band, no info graphic: the panel reads as one block, like a native About panel.</span></li>
<li><span class="pin">2</span><span><strong>Version and tagline.</strong> Version 14 px muted; a snapshot build appends its Git branch, "0.28.0-SNAPSHOT (feat/map)". The tagline is the README's one-line pitch, 13 px muted.</span></li>
<li><span class="pin">3</span><span><strong>Update status.</strong> What the last update check found (see the states below), when it ran, and <em>Check now</em>. Nothing is claimed before a check has answered.</span></li>
<li><span class="pin">4</span><span><strong>Copyright</strong>, muted.</span></li>
<li><span class="pin">5</span><span><strong>Links.</strong> License, homepage, source code and releases, the Pauta edition the app is built to and its conformance, which opens the <a href="../pauta-window/">Pauta window</a> (see below), and the settings file, which opens in the app (or in the file manager for apps with no editor).</span></li>
<li><span class="pin">6</span><span><strong>Environment.</strong> Monospace 11.5 px, muted: version and build time, commit, Pauta edition and conformance, Java and JavaFX versions with vendor, OS with architecture, config folder. Home folders shown as <code>~</code>.</span></li>
<li><span class="pin">7</span><span><strong>Copy details</strong> copies the environment block and stays open; its label becomes "Copied". It sits in the content, not the button bar, so pressing it does not close the panel.</span></li>
<li><span class="pin">8</span><span><strong>Close</strong>, the one button, and the default: Enter and Esc both close.</span></li>
</ol>

## Pauta edition and conformance

About names the edition of these guidelines the app implements and how fully it conforms
([Conformance](../../conformance/)), so a user, a bug report and a reviewer all know which
rules the app answers to. The [app template](https://github.com/adriandeleon/adl-desktop-app-template) shows both; Termina's and Mirada's About name their
edition but not their conformance.

- **ABOUT-05 · MUST.** The edition appears in two places: a link, *Built to Pauta x.y.z*, among the others, and a
  line `Pauta: x.y.z` in the environment block, right after the commit, so *Copy details* carries it.
  - *Check (code):* the links use the `about.pauta` key, and the environment block writes a `Pauta:` line after the
    commit.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/AboutDialog.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/AboutDialog.java) and [`AppInfo.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/AppInfo.java); Termina's [`ui/AboutWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/AboutWindow.java) and [`AppInfo.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/AppInfo.java);
    Mirada's [`ui/AboutWindow.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/AboutWindow.java) (`about.pautaLink`) and [`AppInfo.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/AppInfo.java).
- **ABOUT-06 · MUST.** The link opens the edition's own address, `https://pauta-project.dev/<edition>/`, which never
  changes, not `latest/`, which moves on to newer editions.
  - *Check (code):* the URL is built from the edition number and never contains `latest`.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`AppInfo.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/AppInfo.java) (`pautaUrl`); Termina's [`AppInfo.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/AppInfo.java) (`pautaUrl`);
    Mirada's [`AppInfo.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/AppInfo.java) (`pautaUrl`).
- **ABOUT-07 · MUST.** The number is the edition the app meets, not the newest. Moving to a newer edition means
  reading its changelog for new or stronger MUSTs, meeting them, then changing the number. An app at Partial names
  the edition it is working toward instead, and says so (ABOUT-09).
  - *Check (by hand):* audit the app against the MUSTs of the edition it names.
  - *Reference:* no app yet. Termina's About says "Built to Pauta 2.0.2" ([`pom.xml`](https://github.com/adriandeleon/Termina/blob/master/pom.xml), `pauta.version`), an edition
    that already required a find bar in its Debug Log, the UI font on every scene and the command ids `help.about`
    and `palette.show`, none of which it has. Mirada's says 4.0.1, which already required its settings in
    `~/.mirada` on every OS.
- **ABOUT-08 · MUST.** The edition has one source: a `pauta.version` property in `pom.xml`, which the build filters
  into the app's resources and the app reads from there, like its own version (`build-info.properties` and `AppInfo`
  in the app template). The README's Pauta badge and its "Built to" line name the same edition and change with it.
  - *Check (code):* `pom.xml` defines `pauta.version`, `build-info.properties` carries it, `AppInfo` reads it, and
    the README names the same number.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`pom.xml`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/pom.xml), `build-info.properties` and [`AppInfo.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/AppInfo.java); Termina's the same, with [`AppInfo.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/AppInfo.java),
    and Mirada's, with its [`pom.xml`](https://github.com/adriandeleon/Mirada/blob/main/pom.xml) and [`AppInfo.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/AppInfo.java).
- **ABOUT-09 · MUST.** About shows the app's conformance, Complete, Core or Partial, as the helper computes it from
  `pauta.json` ([PAUTA-02](../../conformance/#pauta-02)) and never higher: a link, *Pauta conformance: Core*, right
  after the edition's, that opens the [Pauta window](../pauta-window/), and a line `Pauta conformance: Core (2
  exceptions)` right after the `Pauta:` line; with one it says `(1 exception)`, with none `(no exceptions)`. At
  Partial the edition's link reads *Working toward Pauta x.y.z*: the app does not meet that edition yet, so it does
  not say it is built to it.
  - *Why:* [*Never claim what is not true*](../../principles/#for-the-people-using-the-apps).
  - *Check (code):* About calls the conformance helper and holds no conformance name of its own; the link runs
    `help.pauta`; at Partial the edition's link uses `about.pautaWorkingToward`.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/AboutDialog.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/AboutDialog.java) and [`PautaConformance.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/PautaConformance.java) (`environmentLine`). Termina's and Mirada's About show the edition but not the
    conformance.

## Update status states

<div class="mock-stage">
<div class="m-states">
<div class="m-state"><div class="cap">Newer release</div><span class="m-link" style="font-weight:700;color:var(--m-amber)">Update available: 0.28.0</span><div class="m-subtle">Last checked 5 minutes ago. <span class="m-link">Check now</span></div></div>
<div class="m-state"><div class="cap">Current</div><span style="color:var(--m-green)">You are up to date.</span><div class="m-subtle">Last checked 2 hours ago. <span class="m-link">Check now</span></div></div>
<div class="m-state"><div class="cap">Never checked</div><span class="m-subtle">Not checked for updates yet.</span> <span class="m-link">Check now</span></div>
<div class="m-state"><div class="cap">Checking</div><span class="m-subtle">Last checked 2 hours ago.</span> <span class="m-subtle">Checking…</span></div>
<div class="m-state"><div class="cap">Failed</div><span style="color:var(--m-red)">Update check failed: connection timed out</span><div class="m-subtle"><span class="m-link">Check now</span></div></div>
</div>
</div>

"Update available" links to that release's page. An update check that is switched off must never read as "up to
date": with no answer, the panel says it has not checked.

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | A modal dialog owned by the window, styled through `Dialogs.styled` so it gets `app.css` and the UI font | `AboutDialog.show` |
| Layout | One column, 14 px between blocks; content padding 6 8 2 8 | `.about-content` |
| Icon | The app icon PNG at 72 px | `icon-128.png` |
| Name / version / tagline | 26 px bold / 14 px muted / 13 px muted | `.about-name`, `.about-version`, `.about-tagline` |
| Update colors | Available: amber, bold ([ABOUT-10](#about-10)). Up to date: green. Failed: red. Last checked: muted | `.about-update*` |
| Environment | JetBrains Mono 11.5 px, muted | `.about-env` |
| Source of the version | Maven-filtered `build-info.properties`, read by `AppInfo`: the same text as `--version` and a problem report | `AppInfo` |
| Pauta edition | `pauta.version` in `pom.xml`, filtered into `build-info.properties`; the link opens `https://pauta-project.dev/<edition>/` | the app template's, Termina's and Mirada's `AppInfo.pautaUrl` |
| Pauta conformance | Computed from `pauta.json` by the conformance helper; the link opens the Pauta window | [Conformance](../../conformance/) |

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

![Editora's About window](../../../assets/shots/editora-about.png "Editora.")
