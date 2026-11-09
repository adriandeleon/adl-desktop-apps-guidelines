---
title: "Accessibility"
description: "What a screen reader, a keyboard-only user and a user who turns motion off need from every app, and where each is a rule."
---

An app that needs a mouse, good color vision or steady eyes shuts people out. Much of what keeps the apps usable
without them is already a rule on the page it belongs to; this page lists those and adds what a screen reader and the
OS's accessibility settings need.

## Where JavaFX stands

JavaFX hands its controls to the screen reader on Windows (UI Automation, which Narrator reads) and on macOS
(VoiceOver). On Linux it has no bridge to the desktop's accessibility bus, so Orca reads nothing. That is JavaFX's
limit, not the app's, and the one accessibility difference between OSes ([Same on every OS](../same-on-every-os/)).

The standard controls (`Button`, `Label`, `TextField`, `CheckBox`, `ListView`, `TreeView`) announce their name, role
and state on their own. What the app builds itself does not: a row drawn from an icon and two labels, a status-bar
segment that acts as a button, a map painted on a `Canvas`. The rules below are about those.

The menus have no mnemonics (`_File`): `Alt` and `Option` chords belong to the keymaps (`M-x` in Emacs). The keyboard
reaches every menu command through the Command Palette, which lists them all ([KBD-05](../keyboard/#kbd-05)).

## Covered on other pages

- **Keyboard.** Every control is reachable with Tab and works with Space or Enter
  ([KBD-15](../keyboard/#kbd-15)); toolbar buttons stay out of the Tab order because their commands are reached
  another way ([TBAR-02](../toolbars-and-tooltips/#tbar-02)). Closing an overlay or a panel gives focus back where it
  was ([PAL-07](../templates/command-palette/#pal-07), [QOPEN-07](../templates/quick-open/#qopen-07),
  [MENU-08](../menus/#menu-08), [TABS-19](../tabs-and-panels/#tabs-19)).
- **Focus ring.** One ring, drawn on every control ([KBD-16](../keyboard/#kbd-16)), at 3:1 or better on every
  surface ([ICON-12](../icons-and-color/#icon-12)).
- **Names.** Every icon-only button gets its name from one helper ([TBAR-01](../toolbars-and-tooltips/#tbar-01)); an
  on/off row is a switch with the `TOGGLE_BUTTON` role ([KBD-18](../keyboard/#kbd-18)).
- **Contrast.** Readable text at 4.5:1 ([ICON-09](../icons-and-color/#icon-09),
  [ICON-10](../icons-and-color/#icon-10), [ICON-11](../icons-and-color/#icon-11)), held by a test
  ([ICON-14](../icons-and-color/#icon-14)).
- **Size and theme.** UI and content zoom from the keyboard ([WIN-09](../window-shell/#win-09)); the light or dark
  theme can follow the system ([ICON-16](../icons-and-color/#icon-16)).

## Rules

- **ACC-01 · MUST.** Every control a person can reach with Tab or the mouse has an accessible name: its own text, a
  `Label` whose `labelFor` is the control, or `setAccessibleText`. A row drawn from a graphic (a `CustomMenuItem`, a
  list cell that lays out its own nodes) carries its text too.
  - *Why:* a screen reader announces an unnamed control as "button", or says nothing.
  - *Check (test):* an FX test opens each window and dialog and fails on a focus-traversable node that has no text,
    no accessible text and no label pointing at it.
  - *Reference:* Editora names its controls area by area
    ([`NamedControlsFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/NamedControlsFxTest.java)), and
    [`ui/MainMenuBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainMenuBar.java) sets each `CustomMenuItem`'s text beside the row it draws. No app has
    the test that sweeps every window yet.
- **ACC-02 · SHOULD.** A control the app builds from panes or draws itself says what it is: `setAccessibleRole` with
  the role it acts as (`BUTTON`, `TOGGLE_BUTTON`, `LIST_VIEW`, `TREE_ITEM`), its state answered from
  `queryAccessibleAttribute` (selected, expanded, checked), and `notifyAccessibleAttributeChanged` when the state
  changes.
  - *Why:* without a role, a screen reader can't tell a status-bar segment that opens a picker from a label.
  - *Check (code):* every `Pane`, `Region`, `Label` or `Canvas` that handles a click or a key sets an accessible
    role.
  - *Reference:* Editora's status-bar segments ([`ui/StatusBar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/StatusBar.java), `BUTTON` with accessible help) and
    [`ui/SettingSwitch.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingSwitch.java) (`TOGGLE_BUTTON`).
- **ACC-03 · SHOULD.** An app that paints content on a `Canvas` (a map, a strip of images, a terminal grid) gives it
  to the screen reader: an accessible text that sums it up and, where a person moves through items in it, one
  accessible node for each item on screen.
  - *Check (test):* a test reads the canvas's accessible text, or the roles and names of the nodes it exposes.
  - *Reference:* Editora [`ui/MapAccessibleRows.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MapAccessibleRows.java) (the Project Map's rows on screen, as `TREE_ITEM`
    nodes under a `TREE_VIEW`).
- **ACC-04 · SHOULD.** Motion follows the OS: while `Platform.getPreferences().isReducedMotion()` is true, an
  animation jumps to its end, and a change to the setting applies at once.
  - *Why:* sliding and fading can make a person dizzy or sick, and they turned motion off in the OS for that reason.
  - *Check (code):* every `Transition` or `Timeline` that moves or fades part of the UI starts through one helper that
    reads `reducedMotionProperty()`.
  - *Reference:* no app yet. Mirada fades its on-screen controls in and out
    ([`ui/OnScreenControls.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/OnScreenControls.java), a `FadeTransition`) and reads no motion setting; the other apps don't
    animate their UI.
- **ACC-05 · SHOULD.** Color is never the only signal: a state shown in color (an error, a changed line, a status)
  also shows a word, a glyph or a shape.
  - *Why:* about one man in twelve can't tell red from green.
  - *Check (by hand):* look at a grayscale screenshot of each window and find every state still told apart.
  - *Reference:* Editora's echo area colors an error and also says what failed
    ([WIN-01](../window-shell/#win-01)).
- **ACC-06 · SHOULD.** A command moves focus to the next region of the window (the content, each open panel), and
  another to the previous one, and every keymap binds both.
  - *Why:* Tab walks through every control inside a region; with several panels open, a keyboard user needs a way to
    jump between them.
  - *Check (code):* the two commands are registered and bound in each bundled keymap.
  - *Reference:* Editora's `window.other` ("Cycle focus between the editor and tool windows"), bound only in the
    Emacs keymap (`C-x o`). `F6`, the Windows convention, is taken in Editora's other keymaps.
- **ACC-07 · SHOULD.** Before a release, the smoke test on Windows and macOS ([REL-29](../release/#rel-29)) includes a
  pass with the screen reader: with Narrator and with VoiceOver, open the Command Palette, run a command, and move
  through Settings, hearing each control's name and role.
  - *Check (by hand):* the release checklist has the step, and someone did it for this release.
  - *Reference:* no app yet.
