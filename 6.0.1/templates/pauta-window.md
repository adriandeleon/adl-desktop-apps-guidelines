# Pauta window

> The window that shows which edition of Pauta the app implements, how fully it conforms, and every exception it records, opened from About, the Help menu and the Command Palette.

Pauta 6.0.1 (2026-11-11). The page with its screenshots and mockups: https://pauta-project.dev/6.0.1/templates/pauta-window/.
Every rule of the edition: https://pauta-project.dev/6.0.1/llms-full.txt.

About says which edition of Pauta the app is built to and how fully it conforms; the Pauta window shows the evidence. It
lists every exception the app records in its `pauta.json` (see [Conformance](https://pauta-project.dev/6.0.1/conformance/)): the rules that do
not apply, the ones it does differently on purpose, and the ones still pending. It is built like the
[About window](https://pauta-project.dev/6.0.1/templates/about/): one modal panel, read-only, with a copyable summary. No released app has one yet; the [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s
`ui/PautaWindow.java` is the one to copy.

## Rules

- **PWIN-01 · MUST.** Every app has a Pauta window, opened by the `help.pauta` command: from the Command Palette like
  every command, and from a *Pauta Conformance* row in the Help menu where the app has a Help menu (the Help menu of a
  menu bar, or a Help submenu of the app's main menu, which [WIN-14](https://pauta-project.dev/6.0.1/window-shell/#win-14) defines). The row's
  place in that menu is [DOCS-07](https://pauta-project.dev/6.0.1/documentation/#docs-07), and About's *Pauta conformance* link, which runs the
  same command, is [ABOUT-09](https://pauta-project.dev/6.0.1/templates/about/#about-09).
  - *Check (code):* a command with the id `help.pauta` is registered and opens the Pauta window, and where the app
    has a Help menu, a row inside that menu runs the command (the app template's Help menu is a list of command
    ids that holds `help.pauta`). A row beside a Help submenu is not in it.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/Commands.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/Commands.java) (`help.pauta`, which runs `openPauta`) and [`ui/AppMenus.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/AppMenus.java) (`help.pauta` in
    `menu.help`, just above `help.about`). No released app has a Pauta window yet.
- **PWIN-02 · MUST.** The Pauta window shows the edition, the conformance with one sentence that says what it
  means, a count of exceptions by kind, and every exception: the rule's ID, its level (MUST or SHOULD), the kind,
  the reason, and for a deviation or a pending exception its link.
  - *Check (by hand):* open the Pauta window and compare it with the app's `pauta.json`, entry by entry.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/PautaWindow.java).
- **PWIN-03 · MUST.** The Pauta window reads the exceptions from `pauta.json` and the edition from the build, as
  About does ([ABOUT-08](https://pauta-project.dev/6.0.1/templates/about/#about-08); `AppInfo` in the template), and takes the conformance from the same
  helper as About ([PAUTA-02](https://pauta-project.dev/6.0.1/conformance/#pauta-02)). No edition, conformance or exception is written in
  the window's own code.
  - *Check (code):* the Pauta window loads the exceptions through the one loader of `pauta.json`, reads the edition
    where About reads it, and calls the conformance helper; its code holds no rule ID, edition number or conformance
    name of its own.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/PautaWindow.java) (`PautaConformance.of`).
- **PWIN-04 · MUST.** Every link in the Pauta window opens a fixed address, never one under `latest/`: the
  edition's link opens the edition's own address, the one [ABOUT-06](https://pauta-project.dev/6.0.1/templates/about/#about-06) gives About's link, and
  each rule ID opens the rule's address in that edition (the entry's `url` in `pauta.json`). The edition's link, in
  the Pauta window and in About, runs the `help.pautaRules` command, so the palette reaches it too.
  - *Why:* an app built to an edition answers to that edition's rules; `latest/` moves on.
  - *Check (code):* `help.pautaRules` is registered and opens the edition's address, built from `pauta.version`;
    the edition's link in the Pauta window and the one in About both run that command; and each rule ID in the
    Pauta window opens its entry's `url`.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/Commands.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/Commands.java) (`help.pautaRules`, which opens `AppInfo.pautaUrl()`), run by the edition's link in [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/PautaWindow.java) and
    [`ui/AboutDialog.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/AboutDialog.java); `PautaWindow` opens each rule ID at its entry's `url`.
- **PWIN-05 · SHOULD.** The Pauta window lists pending exceptions first, then deviations, then app-only (in a
  template), then not-applicable; within a kind, MUSTs before SHOULDs, then by ID.
  - *Why:* what the app still owes is what a reader came to find.
  - *Check (code):* the list the Pauta window draws is sorted by kind in that order, then MUSTs before SHOULDs,
    then by rule ID (the app template's `PautaConformance.sorted`). A test that asserts it is the surest evidence.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformance.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/PautaConformance.java) (`sorted`, by the order of its `Kind`), tested by [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/PautaConformanceTest.java)
    (`pendingFirstThenDeviationsThenAppOnlyThenNotApplicableMustsBeforeShouldsThenById`).
- **PWIN-06 · SHOULD.** The Pauta window's *Copy as text* button copies the edition, the conformance and the list
  as Markdown, one line per exception, and leaves the window open; its label becomes "Copied".
  - *Check (code):* the button's handler copies the edition, the conformance and one line per exception as Markdown
    and sets the button's label to the copied text (the template's `pauta.copied`); the button sits in the content,
    not the button bar, like About's *Copy details*, so pressing it can't close the window.
  - *Reference:* the app template's [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/PautaWindow.java) (`pauta.copy`, `pauta.copied`), built
    like Editora's About *Copy details*.
- **PWIN-07 · SHOULD.** A *Conformance in the docs* link runs the `help.pautaDocs` command, which opens the app's
  docs page ([PAUTA-13](https://pauta-project.dev/6.0.1/conformance/#pauta-13)) for this version, `/docs/v-<version>/pauta/`, where the site
  serves versioned docs ([DOCS-03](https://pauta-project.dev/6.0.1/documentation/#docs-03)), and `/docs/pauta/` until it does. The README's
  badge links the unversioned page, which always shows the latest release.
  - *Check (code):* `help.pautaDocs` is registered and builds the URL from the app's docs base, like Help →
    Documentation.
  - *Reference:* the app template's [`AppInfo.pautaDocsUrl()`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/AppInfo.java), registered as
    `help.pautaDocs` in [`ui/Commands.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/Commands.java).
- **PWIN-08 · SHOULD.** With no exceptions, the Pauta window says so in one line where the list would be, naming
  the app and the edition (for an app called Mirada, "No exceptions: Mirada meets every MUST and SHOULD of Pauta
  x.y.z."), and its copy button still works.
  - *Check (by hand):* with an empty `exceptions` array in `pauta.json`, open the Pauta window.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/ui/PautaWindow.java) (`pauta.none`).

## Anatomy

*Mockup of the Pauta window. Drawn on the page; the numbers below mark its parts.*

The entries above show the layout with Mirada's name; they are not Mirada's record.

1. **Edition.** The Pauta mark at 72 px beside "Pauta" and the edition, in About's name style.
2. **Conformance.** A pill: Complete green, Core accent, Partial amber. Below it, one sentence in the tagline style that says what it means for this app.
3. **Counts.** How many exceptions of each kind, muted. A kind with none is left out.
4. **Group header.** One per kind present, in this order: Pending, Deviation, For each app made from it (the app-only entries of a template), Not applicable. The list scrolls past about ten rows; the rest of the window stays put.
5. **Exception row.** The rule's ID in monospace, linked to the rule in this edition; its level, MUST or SHOULD, muted; the reason; for a pending exception, the issue number as a link.
6. **Decision link.** A deviation links its decision record by number.
7. **Links.** The edition's rules at its own address, and the app's conformance page in its docs.
8. **Copy as text** copies the summary as Markdown and stays open; its label becomes "Copied".
9. **Close**, the one button and the default: Enter and Esc both close.

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | A modal dialog owned by the window, styled through `Dialogs.styled` like About | `AboutDialog.show` |
| Width | 560 px; the list scrolls at about ten rows | `.pauta-list` |
| Head | The Pauta mark PNG at 72 px; "Pauta" and the edition 26 px bold | `.about-name` |
| Conformance pill | Complete `-state-green` on `-state-green-bg`, Core `-state-accent` on `-state-accent-bg`, Partial `-state-amber` on `-state-amber-bg` | `.pauta-conformance` |
| Rule ID | JetBrains Mono 12 px, accent, a link | `.pauta-rule` |
| Source | `pauta.json` in the app's resources and `pauta.version` through `AppInfo` | [Conformance](https://pauta-project.dev/6.0.1/conformance/#the-file) |
| Conformance | The conformance helper, never stored | [PAUTA-02](https://pauta-project.dev/6.0.1/conformance/#pauta-02) |

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

The reasons themselves come from `pauta.json`, in English ([PAUTA-08](https://pauta-project.dev/6.0.1/conformance/#pauta-08)); the window's
own words are in the catalogs like every other string. Counts use `MessageFormat`'s `choice` so English reads "1
SHOULD is pending", not "1 SHOULDs are". A command description takes no arguments, so it says "this app". The app template's catalog has every key,
in each of its six languages.
