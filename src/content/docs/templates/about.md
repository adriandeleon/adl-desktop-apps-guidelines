---
title: "About window"
description: "The family's About panel: identity, update status, licence, links and copyable environment details."
---

<span class="lvl lvl-must">MUST</span> in every app. Help → About, the `help.about` command, and on macOS the
application menu's About item. It answers "what exactly am I running?" in one place, and its details are what a bug
report needs. Reference: Editora's `ui/AboutDialog.java`; Torrenta (`AboutDialog`), Termina, Modula, Mirada and nux
(`AboutWindow`) follow the same order.

## Anatomy

<div class="mock-stage">
<div class="m-card m-dialog" role="img" aria-label="Mockup of the About window">
<div class="titlebar">About Editora</div>
<div class="m-about-head"><img src="/adl-desktop-apps-guidelines/icons/editora.svg" alt="" /><div><div class="m-row"><span class="m-about-name">Editora</span><span class="pin">1</span></div><div class="m-about-version">Version 0.27.0 <span class="pin">2</span></div><div class="m-about-tagline">A keyboard-driven, cross-platform programmer's text editor.</div></div></div>
<div><div class="m-row"><span class="m-link" style="font-weight:700">Update available: 0.28.0</span><span class="pin">3</span></div><div class="m-subtle" style="font-size:12px">Last checked 5 minutes ago. <span class="m-link">Check now</span></div></div>
<div class="m-muted">© 2026 Adrián Arturo De León Saldivar <span class="pin">4</span></div>
<div style="display:flex;flex-direction:column;gap:2px"><span class="m-row"><span class="m-link">MIT License</span><span class="pin">5</span></span><span class="m-link">Homepage</span><span class="m-link">Source code and releases</span><span class="m-link">Settings: ~/.editora/settings.json</span></div>
<div class="m-row" style="align-items:flex-start"><div class="m-env">Editora 0.27.0 (Built 2026-11-05 17:02:11 UTC)
Commit 1dab6d8fd
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
<li><span class="pin">5</span><span><strong>Links.</strong> Licence, homepage, source code and releases, and the settings file, which opens in the app (or in the file manager for apps with no editor).</span></li>
<li><span class="pin">6</span><span><strong>Environment.</strong> Monospace 11.5 px, muted: version and build time, commit, Java and JavaFX versions with vendor, OS with architecture, config folder. Home folders shown as <code>~</code>.</span></li>
<li><span class="pin">7</span><span><strong>Copy details</strong> copies the environment block and stays open; its label becomes "Copied". It sits in the content, not the button bar, so pressing it does not close the panel.</span></li>
<li><span class="pin">8</span><span><strong>Close</strong>, the one button, and the default: Enter and Esc both close.</span></li>
</ol>

## Update status states

<div class="mock-stage">
<div class="m-states">
<div class="m-state"><div class="cap">Newer release</div><span class="m-link" style="font-weight:700">Update available: 0.28.0</span><div class="m-subtle">Last checked 5 minutes ago. <span class="m-link">Check now</span></div></div>
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
| Update colours | Available: accent, bold. Up to date: green. Failed: red. Last checked: muted | `.about-update*` |
| Environment | JetBrains Mono 11.5 px, muted | `.about-env` |
| Source of the version | Maven-filtered `build-info.properties`, read by `AppInfo`: the same text as `--version` and a problem report | `AppInfo` |

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
| `about.copyDetails` / `about.copied` | Copy details / Copied |

## In the apps

![Editora's About window](../../../assets/shots/editora-about.png "Editora.")
