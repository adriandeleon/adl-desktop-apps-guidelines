---
title: "Pauta window"
description: "The window that shows which edition of Pauta the app implements, how fully it conforms, and every exception it records, opened from About, the Help menu and the Command Palette."
---

About says which edition of Pauta the app is built to and how fully it conforms; the Pauta window shows the evidence. It
lists every exception the app records in its `pauta.json` (see [Conformance](../../conformance/)): the rules that do
not apply, the ones it does differently on purpose, and the ones still pending. It is built like the
[About window](../about/): one modal panel, read-only, with a copyable summary. No released app has one yet; the [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s
`ui/PautaWindow.java` is the one to copy.

## Rules

- **PWIN-01 · MUST.** Every app has a Pauta window, opened by the `help.pauta` command: from the Command Palette
  like every command, and from a *Pauta Conformance* row in the Help menu where the app has a Help menu (the Help
  menu of a menu bar, or a Help submenu of the app's main menu). The row's place in that menu is
  [DOCS-07](../../documentation/#docs-07), and About's *Pauta conformance* link, which runs the same command, is
  [ABOUT-09](../about/#about-09).
  - *Check (code):* a command with the id `help.pauta` is registered and opens the Pauta window, and where the app
    has a Help menu, a row inside that menu runs the command (the app template's Help menu is a list of command
    ids that holds `help.pauta`). A row beside a Help submenu is not in it.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/Commands.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Commands.java) (`help.pauta`, which runs `openPauta`) and [`ui/AppMenus.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/AppMenus.java) (`help.pauta` in
    `menu.help`, just above `help.about`). No released app has a Pauta window yet.
- **PWIN-02 · MUST.** The Pauta window shows the edition, the conformance with one sentence that says what it
  means, a count of exceptions by kind, and every exception: the rule's ID, its level (MUST or SHOULD), the kind,
  the reason, and for a deviation or a pending exception its link.
  - *Check (by hand):* open the Pauta window and compare it with the app's `pauta.json`, entry by entry.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/PautaWindow.java).
- **PWIN-03 · MUST.** The Pauta window reads the exceptions from `pauta.json` and the edition from the build, as
  About does ([ABOUT-08](../about/#about-08); `AppInfo` in the template), and takes the conformance from the same
  helper as About ([PAUTA-02](../../conformance/#pauta-02)). No edition, conformance or exception is written in
  the window's own code.
  - *Check (code):* the Pauta window loads the exceptions through the one loader of `pauta.json`, reads the edition
    where About reads it, and calls the conformance helper; its code holds no rule ID, edition number or conformance
    name of its own.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/PautaWindow.java) (`PautaConformance.of`).
- **PWIN-04 · MUST.** Every link in the Pauta window opens a fixed address, never one under `latest/`: the
  edition's link opens the edition's own address, the one [ABOUT-06](../about/#about-06) gives About's link, and
  each rule ID opens the rule's address in that edition (the entry's `url` in `pauta.json`). The edition's link, in
  the Pauta window and in About, runs the `help.pautaRules` command, so the palette reaches it too.
  - *Why:* an app built to an edition answers to that edition's rules; `latest/` moves on.
  - *Check (code):* `help.pautaRules` is registered and opens the edition's address, built from `pauta.version`;
    the edition's link in the Pauta window and the one in About both run that command; and each rule ID in the
    Pauta window opens its entry's `url`.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/Commands.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Commands.java) (`help.pautaRules`, which opens `AppInfo.pautaUrl()`), run by the edition's link in [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/PautaWindow.java) and
    [`ui/AboutDialog.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/AboutDialog.java); `PautaWindow` opens each rule ID at its entry's `url`.
- **PWIN-05 · SHOULD.** The Pauta window lists pending exceptions first, then deviations, then app-only (in a
  template), then not-applicable; within a kind, MUSTs before SHOULDs, then by ID.
  - *Why:* what the app still owes is what a reader came to find.
  - *Check (code):* the list the Pauta window draws is sorted by kind in that order, then MUSTs before SHOULDs,
    then by rule ID (the app template's `PautaConformance.sorted`). A test that asserts it is the surest evidence.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformance.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/PautaConformance.java) (`sorted`), tested by [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/PautaConformanceTest.java).
    Its `Kind` has three kinds, pending, deviation and not-applicable: it sorts those and cannot read `app-only` yet.
- **PWIN-06 · SHOULD.** The Pauta window's *Copy as text* button copies the edition, the conformance and the list
  as Markdown, one line per exception, and leaves the window open; its label becomes "Copied".
  - *Check (code):* the button's handler copies the edition, the conformance and one line per exception as Markdown
    and sets the button's label to the copied text (the template's `pauta.copied`); the button sits in the content,
    not the button bar, like About's *Copy details*, so pressing it can't close the window.
  - *Reference:* the app template's [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/PautaWindow.java) (`pauta.copy`, `pauta.copied`), built
    like Editora's About *Copy details*.
- **PWIN-07 · SHOULD.** A *Conformance in the docs* link runs the `help.pautaDocs` command, which opens the app's
  docs page ([PAUTA-13](../../conformance/#pauta-13)) for this version, `/docs/v-<version>/pauta/`, where the site
  serves versioned docs ([DOCS-03](../../documentation/#docs-03)), and `/docs/pauta/` until it does. The README's
  badge links the unversioned page, which always shows the latest release.
  - *Check (code):* `help.pautaDocs` is registered and builds the URL from the app's docs base, like Help →
    Documentation.
  - *Reference:* the app template's [`AppInfo.pautaDocsUrl()`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/AppInfo.java), registered as
    `help.pautaDocs` in [`ui/Commands.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Commands.java).
- **PWIN-08 · SHOULD.** With no exceptions, the Pauta window says so in one line where the list would be, naming
  the app and the edition (for an app called Mirada, "No exceptions: Mirada meets every MUST and SHOULD of Pauta
  x.y.z."), and its copy button still works.
  - *Check (by hand):* with an empty `exceptions` array in `pauta.json`, open the Pauta window.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/PautaWindow.java) (`pauta.none`).

## Anatomy

<div class="mock-stage">
<div class="m-card m-dialog m-pw" role="img" aria-label="Mockup of the Pauta window">
<div class="titlebar">Pauta Conformance</div>
<div class="m-about-head"><img src="../../pauta-128.png" alt="" /><div><div class="m-row"><span class="m-about-name">Pauta x.y.z</span><span class="pin">1</span></div><div class="m-row"><span class="m-pill amber">Partial</span><span class="pin">2</span></div><div class="m-about-tagline">Mirada does not meet every MUST yet: 2 are pending.</div></div></div>
<div class="m-row m-muted"><span>3 pending · 1 deviation · 1 not applicable</span><span class="pin">3</span></div>
<div class="m-pw-list">
<div class="m-pw-group">Pending<span class="pin out">4</span></div>
<div class="m-pw-item"><span class="m-link m-pw-id">DOCS-06</span><span class="m-pw-level">MUST</span><span class="m-grow">Help has no Documentation item yet. <span class="m-link">#41</span></span><span class="pin">5</span></div>
<div class="m-pw-item"><span class="m-link m-pw-id">MENU-16</span><span class="m-pw-level">MUST</span><span class="m-grow">Some menus draw in a smaller font than the rest. <span class="m-link">#44</span></span></div>
<div class="m-pw-item"><span class="m-link m-pw-id">SYNC-01</span><span class="m-pw-level">SHOULD</span><span class="m-grow">Settings can't be synced between computers yet. <span class="m-link">#38</span></span></div>
<div class="m-pw-group">Deviation</div>
<div class="m-pw-item"><span class="m-link m-pw-id">KBD-12</span><span class="m-pw-level">SHOULD</span><span class="m-grow">Mirada has no keymap editor: you change a key in keymap.json, which Settings opens for you. <span class="m-link">Decision 0004</span></span><span class="pin">6</span></div>
<div class="m-pw-group">Not applicable</div>
<div class="m-pw-item"><span class="m-link m-pw-id">DIAG-07</span><span class="m-pw-level">SHOULD</span><span class="m-grow">Mirada depends on no outside tool, so a Doctor page has nothing to check.</span></div>
</div>
<div style="display:flex;flex-direction:column;gap:2px"><span class="m-row"><span class="m-link">Pauta x.y.z rules</span><span class="pin">7</span></span><span class="m-link">Conformance in the docs</span></div>
<div class="m-footer-row"><span class="m-row"><span class="m-btn">Copy as text</span><span class="pin">8</span></span><span class="m-row"><span class="pin">9</span><span class="m-btn primary">Close</span></span></div>
</div>
</div>

The entries above show the layout with Mirada's name; they are not Mirada's record.

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Edition.</strong> The Pauta mark at 72 px beside "Pauta" and the edition, in About's name style.</span></li>
<li><span class="pin">2</span><span><strong>Conformance.</strong> A pill: Complete green, Core accent, Partial amber. Below it, one sentence in the tagline style that says what it means for this app.</span></li>
<li><span class="pin">3</span><span><strong>Counts.</strong> How many exceptions of each kind, muted. A kind with none is left out.</span></li>
<li><span class="pin">4</span><span><strong>Group header.</strong> One per kind present, in this order: Pending, Deviation, For each app made from it (the app-only entries of a template), Not applicable. The list scrolls past about ten rows; the rest of the window stays put.</span></li>
<li><span class="pin">5</span><span><strong>Exception row.</strong> The rule's ID in monospace, linked to the rule in this edition; its level, MUST or SHOULD, muted; the reason; for a pending exception, the issue number as a link.</span></li>
<li><span class="pin">6</span><span><strong>Decision link.</strong> A deviation links its decision record by number.</span></li>
<li><span class="pin">7</span><span><strong>Links.</strong> The edition's rules at its own address, and the app's conformance page in its docs.</span></li>
<li><span class="pin">8</span><span><strong>Copy as text</strong> copies the summary as Markdown and stays open; its label becomes "Copied".</span></li>
<li><span class="pin">9</span><span><strong>Close</strong>, the one button and the default: Enter and Esc both close.</span></li>
</ol>

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | A modal dialog owned by the window, styled through `Dialogs.styled` like About | `AboutDialog.show` |
| Width | 560 px; the list scrolls at about ten rows | `.pauta-list` |
| Head | The Pauta mark PNG at 72 px; "Pauta" and the edition 26 px bold | `.about-name` |
| Conformance pill | Complete `-state-green` on `-state-green-bg`, Core `-state-accent` on `-state-accent-bg`, Partial `-state-amber` on `-state-amber-bg` | `.pauta-conformance` |
| Rule ID | JetBrains Mono 12 px, accent, a link | `.pauta-rule` |
| Source | `pauta.json` in the app's resources and `pauta.version` through `AppInfo` | [Conformance](../../conformance/#the-file) |
| Conformance | The conformance helper, never stored | [PAUTA-02](../../conformance/#pauta-02) |

## Copy

| Key | English |
|---|---|
| `command.help.pauta` | Pauta Conformance |
| `command.help.pauta.desc` | Show which edition of Pauta this app implements, how fully it conforms, and the rules it does not meet. |
| `command.help.pautaRules` / `.desc` | Pauta Rules / Open the rules of the Pauta edition this app implements. |
| `command.help.pautaDocs` / `.desc` | Pauta Conformance in the Docs / Open the user guide's page on this app's Pauta conformance and exceptions. |
| `dialog.pauta.title` | Pauta Conformance |
| `pauta.edition` | Pauta {0} |
| `pauta.conformance.complete` / `.core` / `.partial` | Complete / Core / Partial |
| `pauta.conformance.complete.desc` | {0} meets every MUST and SHOULD of this edition. |
| `pauta.conformance.core.desc` | {0} meets every MUST of this edition; {1,choice,1#1 SHOULD is\|1<{1} SHOULDs are} pending. |
| `pauta.conformance.partial.desc` | {0} does not meet every MUST yet: {1,choice,1#1 is\|1<{1} are} pending. |
| `pauta.kind.pending` / `.deviation` / `.appOnly` / `.notApplicable` | Pending / Deviation / For each app made from it / Not applicable |
| `pauta.count.pending` | {0} pending |
| `pauta.count.deviation` | {0,choice,1#1 deviation\|1<{0} deviations} |
| `pauta.count.appOnly` | {0} for each app |
| `pauta.count.notApplicable` | {0} not applicable |
| `pauta.decision` / `pauta.link` | Decision {0} / Details |
| `pauta.rules` / `pauta.docs` | Pauta {0} rules / Conformance in the docs |
| `pauta.none` | No exceptions: {0} meets every MUST and SHOULD of Pauta {1}. |
| `pauta.copy` / `pauta.copied` | Copy as text / Copied |

The reasons themselves come from `pauta.json`, in English ([PAUTA-08](../../conformance/#pauta-08)); the window's
own words are in the catalogs like every other string. Counts use `MessageFormat`'s `choice` so English reads "1
SHOULD is pending", not "1 SHOULDs are". A command description takes no arguments, so it says "this app". The app template's catalog has every key
but the app-only pair, which came with 4.2.0, after the edition the template is built to.
