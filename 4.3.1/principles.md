# Principles

> The thirteen rules every other page follows from: ten for the people using the apps, three for the people building them.

Pauta 4.3.1 (2026-11-08). The page with its screenshots and mockups: https://pauta-project.dev/4.3.1/principles/.
Every rule of the edition: https://pauta-project.dev/4.3.1/llms-full.txt.

*Screenshot: Editora's keymap picker: five keymaps bind keys to the same commands.*

These come from what the six apps already do. The first is the reason the family and this guide exist: one
app that is the same on Windows, macOS and Linux. The other twelve are how the apps get there and stay there.
Editora is the reference; each principle names where else it is written down.

## For the people using the apps

1. **Same app on every OS.** A user who moves between Windows, macOS and Linux finds the same features, the
   same commands and keymaps, the same look and the same installer quality, and never relearns the app. Platform
   differences live behind one class, never scattered `if (isMac)` checks. Every other principle serves this one.
2. **Keyboard first.** Every action works without a mouse. The mouse is a shortcut to commands, not the
   other way round.
3. **Every feature is a command.** One registry of commands with ids. Menus, toolbar buttons, the command
   palette and key bindings all run commands by id. Nothing is wired straight to logic.
4. **Speed comes first.** Start-up and the app's core action (typing in Editora, stepping to the next image in
   Mirada, a keystroke reaching the shell in Termina) are the product. When a feature pulls against them, the
   feature loses or waits until it can be made cheap. *(Mirada's "Priorities"; "fast first" in Termina and
   Mirada.)*
5. **The UI never waits.** The JavaFX application thread only touches the scene graph. Disk, network,
   processes, parsing and searching run on other threads and hand their result back; a keystroke, a scroll or a
   window opening never waits for them. See [Performance](https://pauta-project.dev/4.3.1/performance/).
6. **Changes apply as they are made.** Settings have no Save button. A change reaches every open window.
7. **Nothing fails silently.** Every failure reaches the status bar, the Message Log or the Debug Log, and
   the user can turn any of it into a GitHub issue.
8. **Never claim what is not true.** No link that looks like a link and does nothing, no "up to date" before
   an update check has answered, no setting that seems to apply when it cannot: a setting that waits for a
   restart says so on its own row. *(Modula's About, Editora's update status, Termina's settings rows.)*
9. **Local first, nothing sent without asking.** No telemetry. The only automatic network call is a
   once-a-day release check the user can turn off. Problem reports are built locally and submitted by the
   user.
10. **Users' data outlives versions.** Config files carry a schema version and migrate forward. An older
    build never overwrites a newer config.

## For the people building them

11. **One source of truth for each fact.** The version lives in `pom.xml` and reaches About, `--version`, the
    update check and problem reports through a filtered `build-info.properties`. A key binding is declared once,
    so the menu and the accelerator cannot disagree. A list that repeats a fact (About's dependencies, the
    coverage table in the docs) has a test that fails when the two drift, in both directions.
    *(Modula's [`DependenciesTest`](https://github.com/adriandeleon/Modula/blob/master/src/test/java/com/modula/DependenciesTest.java), nux and Torrenta's `AppInfo`, Editora's [`BuildHygieneTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/packaging/BuildHygieneTest.java).)*
12. **Separate the decision from the UI, then test it.** Anything with a rule in it (which key does what, sort
    order, when a bar shows, whether a color is legible) is a small pure method or class with its own unit
    tests. UI classes stay thin and only wire decisions to controls. *(Termina, Torrenta, Mirada and nux
    "Conventions"; Editora's pure decision helpers.)* See [Code quality gates](https://pauta-project.dev/4.3.1/quality/).
13. **Verify by driving the real app.** UI bugs are visual and none of them throw. Before calling a UI change
    done, run the real window, press the real keys and look at the result, through a capture hook or a
    headless screenshot; reasoning about event order is not evidence. *(Termina and Torrenta's `DevCapture`,
    nux's `--screenshot`, the headless harness behind Editora's website screenshots.)*
