---
title: "Principles"
description: "The seven rules every other page follows from."
---

![Editora's keymap picker listing Emacs, CUA, Sublime Text, Visual Studio Code and IntelliJ IDEA over a Java file](../../assets/shots/editora-keymaps.png "Editora's keymap picker: five keymaps bind keys to the same commands.")

1. **Keyboard first.** Every action works without a mouse. The mouse is a shortcut to commands, not the
   other way round.
2. **Every feature is a command.** One registry of commands with ids. Menus, toolbar buttons, the command
   palette and key bindings all run commands by id. Nothing is wired straight to logic.
3. **Changes apply as they are made.** Settings have no Save button. A change reaches every open window.
4. **Nothing fails silently.** Every failure reaches the status bar, the Message Log or the Debug Log, and
   the user can turn any of it into a GitHub issue.
5. **Local first, nothing sent without asking.** No telemetry. The only automatic network call is a
   once-a-day release check the user can turn off. Problem reports are built locally and submitted by the
   user.
6. **Same app on every OS.** Windows, macOS and Linux get the same features and the same installer
   quality. Platform differences live behind one class, never scattered `if (isMac)` checks.
7. **Users' data outlives versions.** Config files carry a schema version and migrate forward. An older
   build never overwrites a newer config.
