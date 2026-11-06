---
title: "Principles"
description: "The eight rules every other page follows from."
---

![Editora editing a Java file with the project tree, minimap and status bar](../../assets/shots/editora-hero.png "Editora, the reference implementation: one window where every action is a command, reachable from a keymap or the palette.")

1. **Keyboard first.** Every action works without a mouse. The mouse is a shortcut to commands, not the
   other way round.
2. **Every feature is a command.** One registry of commands with ids. Menus, toolbar buttons, the command
   palette and key bindings all run commands by id. Nothing is wired straight to logic.
3. **The UI never waits.** The JavaFX application thread only touches the scene graph. Disk, network,
   processes, parsing and searching run on other threads and hand their result back; a keystroke, a scroll or a
   window opening never waits for them. See [Performance](../performance/).
4. **Changes apply as they are made.** Settings have no Save button. A change reaches every open window.
5. **Nothing fails silently.** Every failure reaches the status bar, the Message Log or the Debug Log, and
   the user can turn any of it into a GitHub issue.
6. **Local first, nothing sent without asking.** No telemetry. The only automatic network call is a
   once-a-day release check the user can turn off. Problem reports are built locally and submitted by the
   user.
7. **Same app on every OS.** Windows, macOS and Linux get the same features and the same installer
   quality. Platform differences live behind one class, never scattered `if (isMac)` checks.
8. **Users' data outlives versions.** Config files carry a schema version and migrate forward. An older
   build never overwrites a newer config.
