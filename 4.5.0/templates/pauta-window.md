# Pauta window

> The window that shows which edition of Pauta the app implements, how fully it conforms, and every exception it records, opened from About, the Help menu and the Command Palette.

Pauta 4.5.0 (2026-11-08). The page with its screenshots and mockups: https://pauta-project.dev/4.5.0/templates/pauta-window/.
Every rule of the edition: https://pauta-project.dev/4.5.0/llms-full.txt.

About says which edition of Pauta the app is built to and how fully it conforms; the Pauta window shows the evidence. It
lists every exception the app records in its `pauta.json` (see [Conformance](https://pauta-project.dev/4.5.0/conformance/)): the rules that do
not apply, the ones it does differently on purpose, and the ones still pending. It is built like the
[About window](https://pauta-project.dev/4.5.0/templates/about/): one modal panel, read-only, with a copyable summary. No released app has one yet; the [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s
`ui/PautaWindow.java` is the one to copy.

## Rules

- **PWIN-01 · MUST.** Every app has a Pauta window, opened by the `help.pauta` command: from the Command Palette like
  every command, from the Help menu's *Pauta Conformance* row just above About, and from About's *Pauta conformance* link.
  - *Check (code):* `help.pauta` is registered, the Help `MenuSpec` lists it before `help.about`, and About's *Pauta
    conformance* link runs it through the registry.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/Commands.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Commands.java) (`help.pauta`), [`ui/AppMenus.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/AppMenus.java) (before `help.about` in Help) and [`ui/AboutDialog.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/AboutDialog.java).
- **PWIN-02 · MUST.** The window shows the edition, the conformance with one sentence that says what it means, a count of
  exceptions by kind, and every exception: the rule's ID, its level (MUST or SHOULD), the kind, the reason, and for a deviation or a
  pending exception its link.
  - *Check (by hand):* open the window and compare it with `pauta.json`, entry by entry.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/PautaWindow.java).
- **PWIN-03 · MUST.** It reads from `pauta.json` and `AppInfo` alone, and takes the conformance from the same helper
  as About ([PAUTA-02](https://pauta-project.dev/4.5.0/conformance/#pauta-02)). Nothing in it is written in the window's code.
  - *Check (code):* the window loads the exceptions through one loader and calls the conformance helper; it holds no
    rule IDs or conformance names of its own.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/PautaWindow.java) (`PautaConformance.of`).
- **PWIN-04 · MUST.** Every link opens a fixed address: the edition at `https://pauta-project.dev/<edition>/`, each
  rule ID at its address in that edition (the entry's `url`), never `latest/`. The edition's link, here and in
  About, runs the `help.pautaRules` command, so the palette reaches it too.
  - *Why:* an app built to 4.2.0 answers to 4.2.0's rules; `latest/` moves on.
  - *Check (code):* `help.pautaRules` is registered and builds the edition URL from `pauta.version`; rule links use
    each entry's `url`.
  - *Reference:* [ABOUT-06](https://pauta-project.dev/4.5.0/templates/about/#about-06).
- **PWIN-05 · SHOULD.** Pending exceptions come first, then deviations, then app-only (in a template), then
  not-applicable; within a kind, MUSTs before SHOULDs, then by ID.
  - *Why:* what the app still owes is what a reader came to find.
  - *Check (test):* a unit test of the sort.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformance.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/PautaConformance.java) (`sorted`), tested by [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/PautaConformanceTest.java).
- **PWIN-06 · SHOULD.** *Copy as text* copies the edition, the conformance and the list as Markdown, one line per exception,
  and leaves the window open; its label becomes "Copied".
  - *Check (code):* the button sits in the content, not the button bar, like About's *Copy details*.
  - *Reference:* Editora [`AboutDialog`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/AboutDialog.java) (`about.copyDetails`, `about.copied`).
- **PWIN-07 · SHOULD.** A *Conformance in the docs* link runs the `help.pautaDocs` command, which opens the app's
  docs page ([PAUTA-13](https://pauta-project.dev/4.5.0/conformance/#pauta-13)) for this version, `/docs/v-<version>/pauta/`, where the site
  serves versioned docs ([DOCS-03](https://pauta-project.dev/4.5.0/documentation/#docs-03)), and `/docs/pauta/` until it does. The README's
  badge links the unversioned page, which always shows the latest release.
  - *Check (code):* `help.pautaDocs` is registered and builds the URL from the app's docs base, like Help →
    Documentation.
  - *Reference:* Editora [`AppInfo.docsUrl()`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/AppInfo.java).
- **PWIN-08 · SHOULD.** With no exceptions, the list's place says so in one line, "No exceptions: Mirada meets every
  MUST and SHOULD of Pauta 4.2.0.", and the copy button still works.
  - *Check (by hand):* with an empty `exceptions` array, open the window.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`ui/PautaWindow.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/PautaWindow.java) (`pauta.none`).

## Anatomy

*Mockup of the Pauta window. Drawn on the page; the numbers below mark its parts.*

The entries above show the layout with Mirada's name; they are not Mirada's record.

1. **Edition.** The Pauta mark at 72 px beside "Pauta" and the edition, in About's name style.
2. **Conformance.** A pill: Complete green, Core accent, Partial amber. Below it, one sentence in the tagline style that says what it means for this app.
3. **Counts.** How many exceptions of each kind, muted. A kind with none is left out.
4. **Group header.** One per kind present: Pending, Deviation, Not applicable, in that order. The list scrolls past about ten rows; the rest of the window stays put.
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
| Conformance pill | Complete `-color-success-*`, Core `-color-accent-*`, Partial `-color-warning-*` | `.pauta-conformance` |
| Rule ID | JetBrains Mono 12 px, accent, a link | `.pauta-rule` |
| Source | `pauta.json` in the app's resources and `pauta.version` through `AppInfo` | [Conformance](https://pauta-project.dev/4.5.0/conformance/#the-file) |
| Conformance | The conformance helper, never stored | [PAUTA-02](https://pauta-project.dev/4.5.0/conformance/#pauta-02) |

## Copy

| Key | English |
|---|---|
| `command.help.pauta` | Pauta Conformance |
| `command.help.pauta.desc` | Show which edition of Pauta this app implements, how fully it conforms, and the rules it does not meet. |
| `command.help.pautaRules` / `.desc` | Pauta Rules / Open the rules of the Pauta edition this app is built to, in your browser. |
| `command.help.pautaDocs` / `.desc` | Pauta Conformance in the Docs / Open the page of this app's documentation that lists its Pauta exceptions. |
| `dialog.pauta.title` | Pauta Conformance |
| `pauta.edition` | Pauta {0} |
| `pauta.conformance.complete` / `.core` / `.partial` | Complete / Core / Partial |
| `pauta.conformance.complete.desc` | {0} meets every MUST and SHOULD of this edition. |
| `pauta.conformance.core.desc` | {0} meets every MUST of this edition; {1,choice,1#1 SHOULD is\|1<{1} SHOULDs are} pending. |
| `pauta.conformance.partial.desc` | {0} does not meet every MUST yet: {1,choice,1#1 is\|1<{1} are} pending. |
| `pauta.kind.pending` / `.deviation` / `.appOnly` / `.notApplicable` | Pending / Deviation / For each app made from it / Not applicable |
| `pauta.count.pending` | {0,choice,1#1 pending\|1<{0} pending} |
| `pauta.count.deviation` | {0,choice,1#1 deviation\|1<{0} deviations} |
| `pauta.count.appOnly` | {0,choice,1#1 for each app\|1<{0} for each app} |
| `pauta.count.notApplicable` | {0,choice,1#1 not applicable\|1<{0} not applicable} |
| `pauta.decision` | Decision {0} |
| `pauta.rules` / `pauta.docs` | Pauta {0} rules / Conformance in the docs |
| `pauta.none` | No exceptions: {0} meets every MUST and SHOULD of Pauta {1}. |
| `pauta.copy` / `pauta.copied` | Copy as text / Copied |

The reasons themselves come from `pauta.json`, in English ([PAUTA-08](https://pauta-project.dev/4.5.0/conformance/#pauta-08)); the window's
own words are in the catalogs like every other string. Counts use `MessageFormat`'s `choice` so English reads "1
SHOULD is pending", not "1 SHOULDs are". A command description takes no arguments, so it says "this app".
