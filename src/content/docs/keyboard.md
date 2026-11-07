---
title: "Keyboard first"
description: "Commands, the Command Palette, keymaps, focus and accessibility."
---

## Commands

- Every user-facing action is a `Command` (id, title, runnable) registered in one `CommandRegistry`.
- Command ids are dotted and grouped by area: `file.open`, `view.toggleStatusBar`, `help.reportProblem`.
- Titles come from `command.<id>` and palette descriptions from `command.<id>.desc` in the message
  catalogs, so a registered command is localized and discoverable without extra work.
- A command that cannot run in the current context is shown grayed with a tooltip that says why, not
  hidden.

## Command Palette

- **MUST.** Opened by `M-x` in Emacs keymaps and `Ctrl/Cmd+Shift+P` in the others.
- Fuzzy matching over title, id and description; a query that names a command's title outranks a fuzzy
  hit. Each row shows the active key binding. See the [Command Palette template](../templates/command-palette/).
- It is an **in-scene overlay** in the window's root `StackPane`, not a `javafx.stage.Popup`. On Windows a
  Popup does not reliably take OS keyboard focus and the whole app can stop receiving keystrokes.
- The same picker (`QuickOpen`) serves every other list choice: recent files, themes, keymaps, settings
  values.

![Editora's command palette filtered to Git commands](../../assets/shots/editora-palette.png "Editora: M-x over the editor; typing git lists every Git command.")
![Torrenta's command palette listing Rename, Remove and Force Resume with shortcuts](../../assets/shots/torrenta-palette.png "Torrenta: the same palette, filtered to torrent actions with their shortcuts.")
![Termina's command palette over a terminal listing tab commands](../../assets/shots/termina-palette.png "Termina: the palette over a shell session, filtered to tab commands.")

## Keymaps

- Ship presets as JSON resources: Emacs, CUA, IntelliJ, VS Code and Sublime, with `.mac.json` variants
  where Cmd replaces Ctrl.
- Layer order: base keymap → user overrides → plugin keymaps → the user's own bindings again, so the user
  always has the last word (`KeymapLayers`).
- A keymap editor in Settings lists every command with its chord, searchable, with conflict warnings.
- Never bake a chord into translated text. Derive the label from the active keymap.
- Multi-key prefixes (`C-x …`) show a which-key style hint listing the possible next keys.

![Editora's keymap picker](../../assets/shots/editora-keymaps.png "Keymap: Select… offers Emacs, CUA, Sublime Text, Visual Studio Code and IntelliJ IDEA.")
![Editora's palette filtered to kill commands with Emacs chords](../../assets/shots/editora-emacs.png "M-x kill: each command shows its chord from the active keymap.")
![Termina's keyboard shortcuts window](../../assets/shots/termina-shortcuts.png "Termina's shortcuts reference: every key, grouped by menu.")

## Focus and accessibility

- Every interactive control is reachable with Tab and operable with Space/Enter.
- Keyboard focus is drawn by one `:focus-visible` block at the end of `app.css`.
- Icon-only buttons are built by a helper (`Icons.button`) that sets both the tooltip and the accessible
  text.
- On/off rows use a keyboard-operable switch (`SettingSwitch`, `TOGGLE_BUTTON` role). A bare AtlantaFX
  `ToggleSwitch` is mouse-only.
- Readable text uses `-color-fg-muted` or stronger; `-color-fg-subtle` (about 3:1) is for disabled or
  decorative text only.
- Rows wrap instead of truncating to "…". Check German at 1024 px wide.
