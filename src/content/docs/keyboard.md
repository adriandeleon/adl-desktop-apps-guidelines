---
title: "Keyboard first"
description: "Commands, the Command Palette, keymaps, focus and accessibility."
---

## Commands

- **KBD-01 · MUST.** Every user-facing action is a command (an id, a title and a runnable) registered in one
  command registry (Editora's `Command` and `CommandRegistry`).
  - *Check (code):* what a menu item, a toolbar button, a palette row or a key binding does is a registered command:
    the control runs the command's id through the registry, or calls what the command's runnable calls. No button,
    menu row or key handler does work no command can reach.
  - *Reference:* Editora [`command/Command.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/command/Command.java), [`command/CommandRegistry.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/command/CommandRegistry.java). Editora doesn't hold the rule
    everywhere yet: the Clear button of its Message Log ([`ui/MessageLogPopup.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLogPopup.java)) empties the log in its own
    handler, and the Previous Run and Save Output buttons of its build console ([`ui/BuildToolPanel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/BuildToolPanel.java)) work the
    same way, with no command behind any of the three. Termina doesn't either. These buttons, among others, do their
    work in handlers of their own with no command behind them: Clear in its Message Log
    ([`ui/MessageLogWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/MessageLogWindow.java)), Refresh, Copy, Export and Clear in its Debug Log ([`ui/DebugLogWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/DebugLogWindow.java)), and
    Import theme in Settings ([`ui/SettingsWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SettingsWindow.java)).
- **KBD-02 · SHOULD.** Command ids are dotted and grouped by area, as in `file.open`, `view.toggleStatusBar`
  and `help.reportProblem`. A rule that names a command's id requires that id; these three are examples.
  - *Check (code):* every registered id is two or more names joined by dots, and the first is the area the command
    belongs to: `file.open`, and with a sub-area `git.log.checkout`.
  - *Reference:* Editora [`ui/MenuBarModel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarModel.java).
- **KBD-03 · MUST.** A command's title comes from `command.<id>` and its one-line palette description from
  `command.<id>.desc` in the message catalogs.
  - *Why:* a registered command is then localized and discoverable without extra work.
  - *Check (code):* every registered command has a `command.<id>` and a `command.<id>.desc` key in the message
    catalogs, and the registry reads its title and description from them. A catalog parity test that walks the
    registered commands and fails on a missing key is the surest evidence.
  - *Reference:* the app template's [`CommandSweepFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/ui/CommandSweepFxTest.java) (`everyCommandIsLocalizedAndRuns`) and Mirada's
    [`CommandCatalogTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/ui/CommandCatalogTest.java) (`everyCommandHasItsTitleAndDescriptionInTheCatalog`) walk the registered commands.
    Editora [`i18n/messages.properties`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/i18n/messages.properties); its [`MessagesTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/i18n/MessagesTest.java) (`everyCommandTitleHasAMatchingDescription`)
    walks the catalog instead, so it finds a title with no description but not a registered command with neither.
- **KBD-04 · SHOULD.** A command that cannot run in the current context is shown grayed, with a tooltip that says
  why, not hidden.
  - *Check (code):* the palette and menus list a disabled command with a reason, rather than filtering it out.
  - *Reference:* Editora [`ui/Chrome.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Chrome.java) (`paletteEnabled`, `disabledReason`).

## Command Palette

- **KBD-05 · MUST.** The Command Palette opens with `M-x` in the Emacs keymap and `Ctrl+Shift+P` (`Cmd+Shift+P` on
  macOS) in the others; the IntelliJ keymap may use IntelliJ's own Find Action chord, `Ctrl+Shift+A` (`Cmd+Shift+A`),
  instead. An app with one key table and no Emacs keymap, which is a terminal app's own keymap ([KBD-09](#kbd-09)) or
  the built-in table of an app that ships no keymap files, counts as one of the others: it binds `Ctrl+Shift+P`
  (`Cmd+Shift+P` on macOS). An app that ships no keymap files owes this chord and fails KBD-09 all the same: KBD-09
  requires the files of every app.
  - *Check (code):* each bundled keymap binds that chord to the palette command, and so does the one key table of an
    app that has no keymap files. An app whose chord opens the palette from a handler, with no palette command
    registered, passes this rule and fails [PAL-01](../templates/command-palette/#pal-01) for the missing command.
  - *Reference:* Editora [`keymaps/emacs.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/emacs.json) (`M-x`), [`cua.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/cua.json) and [`vscode.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/vscode.json) (`C-S-p`), [`cua.mac.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/cua.mac.json)
    (`Cmd-S-p`), all to `palette.show`; [`intellij.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/intellij.json) binds `C-S-a`. Termina's one keymap binds
    `Shortcut+Shift+P`, which is `Ctrl+Shift+P` in [`keymap.json`](https://github.com/adriandeleon/Termina/blob/master/src/main/resources/com/termina/keymaps/keymap.json) and `Cmd+Shift+P` in [`keymap.mac.json`](https://github.com/adriandeleon/Termina/blob/master/src/main/resources/com/termina/keymaps/keymap.mac.json), and nux,
    which ships no keymap file, binds the same chord in [`App`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/App.java). Torrenta and Modula don't yet: Torrenta's one key
    table opens the palette with `Alt+X` alone ([`ui/Chords.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/Chords.java)), and Modula's key filter tests for `Ctrl` on
    every OS, so its chord is `Ctrl+Shift+P` on macOS too ([`ui/RadioPane.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/RadioPane.java)).
- **KBD-06 · SHOULD.** The palette matches fuzzily over the command's title and over the words of its id or its
  keywords; the description is shown, not matched. A query that names a command's title outranks a fuzzy hit. Each
  row shows the command's binding in the active keymap. See the
  [Command Palette template](../templates/command-palette/).
  - *Check (code):* the palette's matcher matches the query fuzzily against each command's title and finds a command
    by a word of its id or a keyword that its title doesn't carry; a query that spells a command's title ranks that
    command above the fuzzy hits; the description is drawn and never matched, and each row draws the binding the
    active keymap gives the command. A ranking test that asserts the order is the surest evidence.
  - *Reference:* Editora [`ui/CommandPalette.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java) (`orderedMatches`), [`search/FuzzyMatch.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/search/FuzzyMatch.java). It scores the
    title first; when the title doesn't match, the id's namespace word as a keyword ([`Command.keywords`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/command/Command.java)); then the
    names IntelliJ and VS Code give the command ([`command/OtherIdeNames.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/command/OtherIdeNames.java)). It doesn't match the rest of the id
    or the description, which is shown under the list. [`CommandPaletteRankTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/CommandPaletteRankTest.java) holds the order
    (`aCommandIsFoundByItsNamespaceWhenItsTitleDoesNotCarryIt`, `aKeywordMatchRanksBelowEveryTitleMatch`, and for a
    typed title `anExactTitleLeadsAnotherCommandsAlias` and `aWholeOneWordTitleLeads`).
- **KBD-07 · MUST.** The palette and every picker (a card that lists choices to filter and pick one from:
  [QOPEN-01](../templates/quick-open/#qopen-01)) are in-scene overlays in the window's root `StackPane`, never a
  `javafx.stage.Popup`.
  - *Why:* on Windows a Popup does not reliably take OS keyboard focus, and the whole app can stop receiving
    keystrokes.
  - *Check (code):* the palette and every picker add their node to the root `StackPane`; none creates a `Popup`.
  - *Reference:* Editora [`ui/OverlayHost.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/OverlayHost.java), the one host installed in the scene's root `StackPane`, which shows the
    palette ([`ui/CommandPalette.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java)), the picker ([`ui/QuickOpen.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/QuickOpen.java)) and the picker's relatives
    ([QOPEN-12](../templates/quick-open/#qopen-12)).

Every other list choice (recent files, themes, keymaps, a setting's values) uses the same picker:
[QOPEN-01](../templates/quick-open/#qopen-01).

![Editora's command palette filtered to Git commands](../../assets/shots/editora-palette.png "Editora: M-x over the editor; typing git lists every Git command.")
![Torrenta's command palette listing Rename, Remove and Force Resume with shortcuts](../../assets/shots/torrenta-palette.png "Torrenta: the same palette, filtered to torrent actions with their shortcuts.")
![Termina's command palette over a terminal listing tab commands](../../assets/shots/termina-palette.png "Termina: the palette over a shell session, filtered to tab commands.")

## Keymaps

- **KBD-09 · MUST.** Except in a terminal app, Emacs and CUA keymaps ship as JSON resources, `emacs.json` and
  `cua.json`, CUA with a `cua.mac.json` variant where Cmd replaces Ctrl. A terminal's keys belong to the program it
  runs (`C-a`, `M-x` reach the shell), so a terminal app ships one keymap of its own instead, `keymap.json` and
  `keymap.mac.json`, binding its commands to chords programs don't use. Neither file binds a plain `Ctrl` or `Alt`
  (`Option` on macOS) with a letter: off macOS that leaves `Ctrl+Shift+T`, not `Ctrl+T`, and on macOS `Cmd+T`,
  since no program in the terminal receives `Cmd`.
  - *Why:* an Emacs keymap in a terminal would take the shell's own keys away from it: `Ctrl+W` deletes a word,
    `Ctrl+C` interrupts, `Alt+F` and `Alt+B` move by word. The shell reads the same keys on macOS, where `Option`
    with a letter also types a character.
  - *Check (code):* `emacs.json`, `cua.json` and `cua.mac.json` are in the app's resources. In a terminal app,
    `keymap.json` and `keymap.mac.json` are there instead, and no default binding in either file is `Ctrl` alone or
    `Alt` alone with a letter. Read each chord as the OS reads it: a modifier that stands for the OS's own shortcut
    key (JavaFX's `Shortcut`, as Termina writes it) is `Ctrl` in `keymap.json` and `Cmd` in `keymap.mac.json`.
  - *Reference:* Editora [`src/main/resources/com/editora/keymaps/`](https://github.com/adriandeleon/Editora/tree/master/src/main/resources/com/editora/keymaps);
    Termina's [`keymaps/`](https://github.com/adriandeleon/Termina/tree/master/src/main/resources/com/termina/keymaps), whose [`KeymapTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/ui/KeymapTest.java)
    (`offMacOsAnApplicationChordNeverTakesPlainCtrlAndALetter`) holds the `Ctrl` half off macOS; no test holds the
    `Alt` half or reads `keymap.mac.json`, where every chord carries `Cmd` today.
- **KBD-10 · SHOULD.** Except in a terminal app ([KBD-09](#kbd-09)), an app also ships IntelliJ, VS Code and Sublime
  keymaps as JSON resources beside its Emacs and CUA keymaps: `intellij.json`, `vscode.json` and `sublime.json`,
  each with its `.mac.json` variant.
  - *Check (code):* `intellij`, `vscode` and `sublime` `.json` and `.mac.json` files are in the resources. An app
    that ships a terminal's keymap, `keymap.json` and `keymap.mac.json` with no `emacs.json` and no `cua.json`
    ([KBD-09](#kbd-09)), needs none of them.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; has() { find src/main/resources -name "$1" | grep -q .; }; if has keymap.json && has keymap.mac.json && ! has emacs.json && ! has cua.json; then exit 0; fi; ! for k in intellij vscode sublime; do for f in "$k.json" "$k.mac.json"; do has "$f" || echo "missing $f"; done; done | grep .`
  - *Reference:* Editora [`src/main/resources/com/editora/keymaps/`](https://github.com/adriandeleon/Editora/tree/master/src/main/resources/com/editora/keymaps). Termina ships the terminal's two files only
    ([`keymaps/`](https://github.com/adriandeleon/Termina/tree/master/src/main/resources/com/termina/keymaps)). The app template and Mirada ship Emacs and CUA and none of these three yet; Torrenta, Modula
    and nux ship no keymap file.
- **KBD-21 · MUST.** A keymap's `.mac.json` variant binds the same commands as the keymap it varies. A chord may
  differ, to put `Cmd` where the other has `Ctrl`, to follow the macOS keymap of the editor it copies, or where
  macOS keeps the chord for itself (`Cmd+Space`, `Cmd+Tab`). See [Same on every OS](../same-on-every-os/).
  - *Why:* a command with no chord on one OS is a command that user never finds from the keyboard.
  - *Check (code):* each keymap file and its `.mac.json` variant bind the same set of command ids: no command is bound
    in one and missing from the other. An app that ships no keymap files has no pair to compare and fails with
    [KBD-09](#kbd-09). A test that loads both and compares the commands they bind is the surest evidence.
  - *Reference:* Editora [`KeymapsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/command/KeymapsTest.java) (`guiKeymapsBindSameCommandSetOnBothPlatforms`), Termina's [`KeymapTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/ui/KeymapTest.java)
    (`bothPlatformsBindTheSameCommands`) and the app template's [`KeybindingsTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/command/KeybindingsTest.java)
    (`cuaHasAMacVariantWhereCmdReplacesCtrl`). Mirada's [`cua.json`](https://github.com/adriandeleon/Mirada/blob/main/src/main/resources/com/mirada/keymaps/cua.json) and [`cua.mac.json`](https://github.com/adriandeleon/Mirada/blob/main/src/main/resources/com/mirada/keymaps/cua.mac.json) bind the same commands, with no
    test that compares the two.
- **KBD-11 · MUST.** Keymaps are applied in layers: base keymap → user overrides → plugin keymaps → the user's own
  bindings again. An app without plugins has the first two.
  - *Why:* the user always has the last word, and a plugin can still use a chord the user freed.
  - *Check (code):* one place applies the layers in that order.
  - *Reference:* Editora [`ui/KeymapLayers.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/KeymapLayers.java).
- **KBD-12 · SHOULD.** A keymap editor in Settings lists every command with its chord, is searchable, and warns of
  conflicts.
  - *Check (by hand):* open Settings → Keymap, search, and bind a chord that is taken.
  - *Reference:* Editora [`ui/SettingsKeymapsPage.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsKeymapsPage.java); conflicts from [`KeybindingEdits.conflicts`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/command/KeybindingEdits.java), and the
    defaults a chord would take from [`EditorSettingsCoordinator.takenDefaults`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/EditorSettingsCoordinator.java).
- **KBD-13 · SHOULD.** No command's chord is written into translated text. Every other label that shows a chord (a
  hint, the palette, the status bar) shows the binding from the active keymap; tooltips are
  [TBAR-03](../toolbars-and-tooltips/#tbar-03) and menu rows [MENU-15](../menus/#menu-15). Fixed keys of a control
  (Enter, Tab, Esc, arrows) and keys meant for another program may be written.
  - *Check (code):* no message catalog value names a command's chord (`Ctrl+`, `Cmd+`, `C-x`, `M-x`); chords are
    rendered by one formatter.
  - *Reference:* Editora [`command/ChordFormat.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/command/ChordFormat.java), the one place a binding is rendered. Editora's
    `command.edit.universalArgument` title still carries `C-u`.
- **KBD-14 · SHOULD.** A multi-key prefix (`C-x …`) shows a which-key style hint listing the possible next keys.
  - *Check (by hand):* press `C-x` in the Emacs keymap and wait.
  - *Reference:* no app lists the next keys yet. Editora echoes only the pending prefix (`C-x -`) in the status bar
    ([`command/KeyDispatcher.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/command/KeyDispatcher.java)).

![Editora's keymap picker](../../assets/shots/editora-keymaps.png "Keymap: Select… offers Emacs, CUA, Sublime Text, Visual Studio Code and IntelliJ IDEA.")
![Editora's palette filtered to kill commands with Emacs chords](../../assets/shots/editora-emacs.png "M-x kill: each command shows its chord from the active keymap.")
![Termina's keyboard shortcuts window](../../assets/shots/termina-shortcuts.png "Termina's shortcuts reference: every key, grouped by menu.")

## Focus and accessibility

- **KBD-15 · MUST.** Every interactive control is reachable with Tab and operable with Space or Enter. A control is
  the exception when the keyboard does what it does another way: the buttons of a toolbar stay out of the Tab order
  ([TBAR-02](../toolbars-and-tooltips/#tbar-02), which says what a toolbar is: a bar of labeled buttons is not one,
  and its buttons are held to this rule), and the find-bar and filter controls that
  [FIND-16](../templates/find-bar/#find-16) names may leave it. See [Accessibility](../accessibility/).
  - *Why:* a control that Tab can't reach is one a keyboard-only or screen-reader user can't use at all.
  - *Check (by hand):* first in the source, find every control the keyboard cannot focus: one the app takes out of the
    Tab order (`setFocusTraversable(false)` in the code, `-fx-focus-traversable: false` in a stylesheet), and a label
    or a pane that acts on a click. The keyboard does all that each one does another way: it is a button of a toolbar
    as [The toolbar](../toolbars-and-tooltips/#the-toolbar) defines one ([TBAR-02](../toolbars-and-tooltips/#tbar-02);
    a bar of labeled buttons, such as nux's, is not one), a find-bar or filter control that
    [FIND-16](../templates/find-bar/#find-16) lets leave the Tab order (one that fails FIND-16, such as an option's
    toggle that no command toggles, fails here too), a list whose text field moves its selection with the arrow keys,
    or a control whose every action, the rows of its right-click menu included, a registered command also runs. A
    control only the mouse can work fails the rule, and the source alone shows it. Then in the running app, Tab
    reaches every other control of each window and dialog, and Space or Enter works it.
  - *Reference:* the app template, where each control the keyboard cannot focus has its other way: the status bar's
    echo area, error count and update notice run commands (`view.messageLog`, `help.openNewRelease`:
    [`ui/StatusBar.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/StatusBar.java)), the Debug Log find bar's buttons are [FIND-16](../templates/find-bar/#find-16)'s
    ([`ui/DebugLogFindBar.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/DebugLogFindBar.java)), and the picker's list is moved from its field ([`ui/Picker.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Picker.java)). Editora doesn't
    hold the rule everywhere yet: the Clear button of its Message Log ([`ui/MessageLogPopup.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLogPopup.java)) and the Previous
    Run and Save Output buttons of its build console ([`ui/BuildToolPanel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/BuildToolPanel.java)) are out of the Tab order with no
    command and no key behind them. Modula doesn't either: it takes every control of its window out of the Tab order
    ([`RadioPane.keepOutOfFocus`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/RadioPane.java)) and gives most of what they do a key or a palette row, but a preset's Rename and
    Remove are rows of its chip's right-click menu alone ([`ui/PresetBar.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/PresetBar.java)). Termina doesn't either: the
    regular-expression toggle of its find bar is out of the Tab order, and no command and no key toggles it
    ([`ui/SearchBar.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SearchBar.java); [FIND-16](../templates/find-bar/#find-16) fails for it too).
- **KBD-16 · MUST.** Every button, toggle, menu button, link, combo box, check box, radio button and text field shows
  the focus ring when the keyboard focuses it. The ring is one layer of `:focus-visible` rules in the app stylesheet,
  after every rule that sets a border or background on the same controls, since rules of equal specificity are decided
  by order. Its color and contrast are [ICON-12](../icons-and-color/#icon-12).
  - *Why:* a keyboard user who can't see where focus is can't use the window; the ring's color is a MUST, and so is
    drawing it.
  - *Check (code):* the app stylesheet holds the ring as one block of `:focus-visible` rules that covers each of these
    kinds of control the app uses (buttons, toggles, menu buttons, links, combo boxes, check boxes, radio buttons,
    text fields), and no rule after the block, of the same or higher specificity, sets again what the block sets on
    those controls (the border; on a text field, the background insets). A test that tabs to each control family and
    asserts the ring is the surest evidence.
  - *Reference:* Editora [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) (*Keyboard focus*, one layer for every control), held by
    [`FocusRingFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FocusRingFxTest.java), which tabs to each control family. Termina's [`app.css`](https://github.com/adriandeleon/Termina/blob/master/src/main/resources/com/termina/styles/app.css) and Mirada's
    [`mirada.css`](https://github.com/adriandeleon/Mirada/blob/main/src/main/resources/com/mirada/styles/mirada.css) end with a layer of the same kind; neither app has a test that tabs to a control.
- **KBD-22 · SHOULD.** The focus ring is 2 px wide at the default zoom and sits just outside the control with a
  1 px gap: a border with negative insets, which adds nothing to the control's own, so focusing a control never moves
  the layout. Two kinds of control draw it inside instead, at the same 2 px and still without moving anything: a
  text field, whose own focus border is widened, and a control flush with the window's edge, where a ring outside
  would be cut off.
  - *Why:* a ring drawn on the control's own border is lost on a flat or filled button, and one that takes room
    makes the row jump as Tab moves along it. A text field already draws an accent border on focus, so a second
    ring around it would be one too many.
  - *Check (code):* in the `:focus-visible` rules of [KBD-16](#kbd-16), the one for the controls that take the
    outside ring (buttons, toggles, menu buttons, links, combo boxes, the boxes of check boxes and radio buttons, as
    many of them as the app has) sets `-fx-border-width: 2` and `-fx-border-insets: -3`; the one for text fields
    widens the field's focus border to 2 px instead
    (`-fx-background-insets: 0, 2px`); and a rule that draws the ring inside a control at the window's edge keeps the
    2 px width and takes the room back out of the control's padding.
  - *Reference:* Editora [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css) (*Keyboard focus*), Termina's [`app.css`](https://github.com/adriandeleon/Termina/blob/master/src/main/resources/com/termina/styles/app.css) and Mirada's [`mirada.css`](https://github.com/adriandeleon/Mirada/blob/main/src/main/resources/com/mirada/styles/mirada.css): the
    same outside ring, and the same text-field rule (Mirada's covers text areas too). Editora alone has the second
    exception: `.tool-stripe-button:focus-visible` draws the ring at `-fx-border-insets: 1` and gives 3 px of
    padding back, since the stripes sit against the window's edge. The app template's
    [`app.css`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/resources/com/example/app/styles/app.css) sets the ring's color only, so the ring is the theme's own 1 px border.
- **KBD-18 · SHOULD.** A row that turns a setting on or off (in Settings, a panel or a dialog) uses a switch the
  keyboard operates: it takes focus, Space toggles it, and its accessible role is `TOGGLE_BUTTON`.
  - *Why:* a bare AtlantaFX `ToggleSwitch` is mouse-only.
  - *Check (code):* every row that turns a setting on or off uses a switch that takes focus, toggles on Space and sets
    `AccessibleRole.TOGGLE_BUTTON` (Editora has one class for it, `SettingSwitch`); a row that uses AtlantaFX's
    `ToggleSwitch` as it comes fails.
  - *Reference:* Editora [`ui/SettingSwitch.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingSwitch.java).

Related rules on other pages: every icon-only button gets its name from one helper,
[TBAR-01](../toolbars-and-tooltips/#tbar-01); rows wrap instead of being cut short in every language,
[INTL-04](../i18n/#intl-04); readable text and its contrast are one rule, [ICON-09](../icons-and-color/#icon-09).
