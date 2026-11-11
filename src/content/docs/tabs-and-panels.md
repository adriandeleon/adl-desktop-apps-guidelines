---
title: "Tabs and tool panels"
description: "The tab strip and its states, reorder and reopen, and the tool panels that dock around the editor."
---

A window shows its documents in a **tab strip** and its tools in **panels** docked beside or under them. Both are
driven by commands, both remember their state, and both draw their chrome as one band with the toolbar, not as boxes
inside boxes. Reference: Editora's [`ui/TabHeaders.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TabHeaders.java) (the tab header), [`ui/ClosedTabs.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ClosedTabs.java), [`ui/Switcher.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Switcher.java),
[`ui/ToolWindowManager.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindowManager.java), [`ui/ToolWindowPanel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindowPanel.java) and the `.tab-pane`, `.tool-stripe` and `.tool-window`
rules in [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css).

<div class="mock-stage">
<div class="m-tp-window" role="img" aria-label="Mockup of a tab strip with pinned, active, unsaved, read-only and dragged tabs over a tool panel beside the editor">
<div class="m-tp-tabs">
<span class="m-tp-tab pinned"><svg class="pinicon" viewBox="0 0 24 24"><path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></svg><span class="ic"></span>pom.xml<span class="pin out" style="left:-8px;top:-10px">3</span></span>
<span class="m-tp-tab on"><span class="ic on"></span>Main.java<span class="x">×</span><span class="pin out" style="right:-8px;top:-10px">1</span></span>
<span class="m-tp-tab dirty"><span class="ic"></span>• notes.md<span class="pin out" style="right:-8px;top:-10px">2</span></span>
<span class="m-tp-tab readonly"><span class="ic"></span>LICENSE<span class="pin out" style="right:-8px;top:-10px">4</span></span>
<span class="m-tp-tab dragging"><span class="ic"></span>Util.java</span>
<span class="m-tp-tab dropbefore"><span class="ic"></span>README.md<span class="pin out" style="right:-8px;top:-10px">5</span></span>
</div>
<div class="m-tp-body">
<div class="m-tp-stripe"><span class="sb open"><svg viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg></span><span class="sb"><svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg></span><span class="sb"><svg viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg></span><span class="pin out" style="left:-12px;bottom:-4px">6</span></div>
<div class="m-tp-panel">
<div class="hdr"><svg viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg><span class="title">Project</span><span class="m-grow"></span><span class="btn">▭</span><span class="btn">⤢</span><span class="btn">×</span><span class="pin out" style="right:-10px;top:-10px">7</span></div>
<div class="body"><div class="row">▾ <b>editora</b></div><div class="row l1">▾ src</div><div class="row l2 sel">Main.java</div><div class="row l2">Util.java</div><div class="row l1">▸ docs</div><div class="row l1">pom.xml</div><div class="row l1">README.md</div></div>
</div>
<div class="m-tp-divider"><span class="pin out" style="left:-6px;top:118px">8</span></div>
<div class="m-tp-editor"><div class="ln">1</div><div class="code"><span class="kw">package</span> com.editora;</div><div class="ln">2</div><div class="code"></div><div class="ln">3</div><div class="code"><span class="kw">public final class</span> Main {</div><div class="ln">4</div><div class="code">    <span class="kw">static void</span> main() {</div><div class="ln">5</div><div class="code">        IO.println(<span class="str">"ready"</span>);</div><div class="ln">6</div><div class="code">    }</div><div class="ln">7</div><div class="code">}</div></div>
</div>
<div class="m-tp-bottom"><span class="bb open"><span class="dot"></span>Terminal</span><span class="bb"><span class="dot"></span>Problems</span><span class="bb"><span class="dot"></span>Run</span><span class="bb"><span class="dot"></span>Git</span><span class="pin out" style="right:-10px;top:3px">9</span></div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Active tab.</strong> Its fill is the editor's own surface (<code>-editor-surface</code>) with a border on three sides and none at the bottom, so the tab opens into the editor instead of sitting on it. Title bold in <code>-color-fg-default</code>; the file-type glyph tints accent.</span></li>
<li><span class="pin">2</span><span><strong>Unsaved tab.</strong> A <code>•</code> before the name, amber (<code>-state-amber</code>, "not durable yet") and italic. Amber outranks the Git-status color: "you have not saved this" matters more than "this differs from HEAD".</span></li>
<li><span class="pin">3</span><span><strong>Pinned tab.</strong> A pin glyph and a bold title, kept at the front of the strip in pin order. Every bulk close (Others, All, Unmodified, Left, Right) skips it.</span></li>
<li><span class="pin">4</span><span><strong>Read-only tab.</strong> Muted and italic, echoing the status bar's Read-Only segment.</span></li>
<li><span class="pin">5</span><span><strong>Drag to reorder.</strong> The header is the drag handle and a snapshot of the whole tab follows the pointer; the dragged tab dims to 40 % and a 2 px accent line marks the edge it would land on (left half of a tab: before it; right half: after).</span></li>
<li><span class="pin">6</span><span><strong>Tool stripe.</strong> A 30 px rail of icon buttons, one per tool window, 8 px apart, on the subtle ground with no drawn edge. The open window's button is tinted; the one holding keyboard focus is tinted stronger. The first icon lines up with the editor's first line of text, not with the tab strip.</span></li>
<li><span class="pin">7</span><span><strong>Panel header.</strong> The window's glyph and title (14 px bold, muted) with float, maximize and close; the same size and glyph as its stripe button, so the two name the same thing. On the subtle ground, with no rule under it; when the panel holds focus the band tints accent-subtle and the title turns accent.</span></li>
<li><span class="pin">8</span><span><strong>The divider is the edge.</strong> The panel draws no frame: the SplitPane divider between it and the editor is the real, grabbable edge, and a hairline beside it would only double it. Its position is remembered.</span></li>
<li><span class="pin">9</span><span><strong>Bottom stripe.</strong> Its buttons carry a 14 px label beside the glyph, side by side; the open one is accent and bold.</span></li>
</ol>

## Window title

- **TABS-10 · SHOULD.** The window title names the file, the project and the app, with a `●` prefix for an unsaved
  file. An app with no files or projects names what the window shows in their place (a terminal, the working
  folder or the title its program set), or the app alone where there is nothing to name.
  - *Check (code):* the code that sets the stage title adds all three and the marker; in an app with no files or
    projects, what stands in for them, or the app's name alone.
  - *Reference:* Editora [`MainController.updateWindowTitle`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java). Termina's title follows the selected tab
    ([`TerminalTitle.window`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalTitle.java): the name the user gave the tab, the title the shell set or the working folder's path, and the
    app's name when it knows none). The app template, Modula and nux show the app's name.

## Tabs

**Applies to:** an app whose main window holds documents or sessions in tabs the user opens and closes, as
Editora's files and Termina's terminals are. The pages of a Settings window (nux's `TabPane`), the fixed sections
of a detail pane (Torrenta's) and a strip that switches the window between views (Torrenta's Transfers, Search and
RSS) are not such tabs: the user neither opens nor closes them. The Tabs rules cover every tab of the main window's
strip, whatever it shows (Editora's image, hex and PDF viewer tabs as much as its editor tabs), not tabs inside a
tool window (those of Editora's Terminal and Build Output panels).

- **TABS-01 · MUST.** Every tab operation is a command, so it can be bound to a chord, is in the palette and has a
  menu row: close, close others, close all, close unmodified, close to the left and right, pin, reopen closed, next
  and previous. The tab's [right-click menu](../menus/) lists the ones that act on a tab. A terminal app's tabs
  are never saved or unsaved, so a terminal app has no close unmodified, and closing its window closes all its
  tabs, so it needs no close all; the other operations are its commands too.
  - *Check (code):* the registry holds a command for each operation, each has a row in the menu bar or in the
    tab's right-click menu, and that menu (Editora's `TabContextMenu`), on every tab of the strip, lists the ones
    that act on a tab; in a terminal app, each operation but close unmodified and close all.
  - *Reference:* Editora [`ui/WindowCommandRegistrar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WindowCommandRegistrar.java) (`buffer.close`, `buffer.closeOthers`, `buffer.closeAll`,
    `buffer.closeUnmodified`, `buffer.closeLeft`, `buffer.closeRight`, `buffer.togglePin`, `buffer.reopenClosed`,
    `buffer.next`), [`ui/TabContextMenu.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TabContextMenu.java). Editora has no previous-tab command yet, and
    its image, hex and PDF viewer tabs have no right-click menu: `openImageTab`, `openHexTab` and `openPdfTab` in
    [`ui/FileWorkflowCoordinator.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FileWorkflowCoordinator.java) install none, and `installTabMenu` in [`ui/MainController.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java) is called for
    an editor's tab alone. Termina
    [`ui/TerminalWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java) (`closeTab`, `closeOtherTabs`, `closeTabsToTheLeft`, `closeTabsToTheRight`, `pinTab`,
    `reopenClosedTab`, `nextTab` and `previousTab` in `menuCommands`; the tab's menu in `buildTabMenu`). Its File
    menu closes the tab, the others, the ones to either side, or the window, which is its close all
    ([`ui/MenuBarModel.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/MenuBarModel.java)).
- **TABS-02 · MUST.** The header is the title: the Tab's own text stays empty, and a graphic header carries the
  file-type glyph, the markers and the title in a label of its own (Editora's style class for it is `tab-title`). The
  tooltip is the full path, in which `~` may stand for the home folder. A terminal app's tab shows no file: its header
  has no file-type glyph, its title names the tab (the user's own name for it, the title the shell set, the running
  program or the working folder), and its tooltip is the working folder's full path.
  - *Why:* the graphic is what makes the header a drag handle and lets each state set its own color.
  - *Check (code):* every tab that shows a file, an editor's or a viewer's, gets `setText("")` and a graphic that
    holds the file-type glyph and the title in a label of its own (Editora's `.tab-title`); its tooltip is the
    file's path. In a terminal app: every tab's own text is empty, its graphic holds the title label and no
    file-type glyph, and the tooltip is the working folder of the tab's active pane. A path that writes the home
    folder as `~` is a full path.
  - *Reference:* Editora [`ui/TabHeaders.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TabHeaders.java), for its editor tabs (`bufferHeader`, `tooltip`). Its image, hex and PDF
    viewer tabs don't yet: `contentHeader`, which builds their header, sets no tooltip. Termina [`TerminalWindow.addTab`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java) (a `tab-title` label as the tab's
    graphic, and `installDirectoryTooltip`) over [`ui/TerminalTitle.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalTitle.java) (`tab`, and `tooltip`, which writes the
    home folder as `~`).
- **TABS-03 · MUST.** A tab's header, the one graphic header of [TABS-02](#tabs-02), carries the tab's states: a `• `
  prefix in amber italic for unsaved, a pin and bold for pinned, muted italic for read-only. A terminal app's tab is
  never unsaved or read-only, and its header says in their place what the tab is doing: the title is the running
  program's name while one runs, unless the user or the shell named the tab, and a mark beside the title says what
  happened while the tab was not selected (a notification, a bell, or output after a quiet spell), cleared when the
  tab is selected. A pinned terminal tab is drawn as any other pinned tab, with a pin and a bold title.
  - *Check (code):* the code that builds a tab's header marks it unsaved, pinned or read-only (Editora's style
    classes `dirty`, `pinned` and `read-only` on `.tab-header`) and adds the `• ` prefix and the pin, and the
    stylesheet gives each mark the look the rule names. In a terminal app: the stylesheet styles the pinned title,
    the code that names the tab puts the running program before the folder, and the header shows the mark and
    clears it when the tab is selected.
  - *Reference:* Editora [`ui/TabHeaders.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TabHeaders.java), [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css); the Unsaved, Pinned and Read-only rows of the
    [Spec](#spec) table. Termina [`ui/TerminalTitle.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalTitle.java) (`tab`), [`ui/TabMarks.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TabMarks.java) and `TabMarkState` in
    [`ui/TerminalWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java) (a dot after the title, in the terminal palette's magenta, yellow or cyan, and a pin), and
    `.tab-title.pinned` in its [`app.css`](https://github.com/adriandeleon/Termina/blob/master/src/main/resources/com/termina/styles/app.css).
- **TABS-04 · MUST.** Bulk close skips pinned tabs: close others, close all, close unmodified and close to the left
  or right never close a pinned tab. A terminal app has three of them ([TABS-01](#tabs-01)), and each skips its
  pinned tabs too.
  - *Check (code):* every bulk close the app has (close others, close all, close unmodified, close to the left and
    to the right) builds the list of tabs it will close without the pinned ones: it tests each tab for pinned
    before taking it (Editora's `closeOtherTabs`, `closeAllTabs`, `closeUnmodifiedTabs`, `eligibleToLeft` and
    `eligibleToRight`). A test that asserts it is the surest evidence.
  - *Reference:* Editora [`ui/MainController.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java). Termina [`ui/TabRanges.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TabRanges.java) (`closing`, which leaves
    out every pinned position and which each bulk close of [`ui/TerminalWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java) goes through) and
    [`TabRangesTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/ui/TabRangesTest.java).
- **TABS-05 · MUST.** Pinning moves the tab to the end of the pinned group, unpinning to just after it.
  - *Check (code):* the code that pins or unpins a tab then moves it to the boundary between the pinned tabs and
    the rest, the index equal to the number of other pinned tabs in its strip: the last place of the pinned group
    for a tab just pinned, the first place after the group for one just unpinned (Editora's `togglePin`, which
    calls `moveToPinBoundary`).
  - *Reference:* Editora [`ui/MainController.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java) (`togglePin`), [`ui/EditorArea.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/EditorArea.java) (`moveToPinBoundary`).
    Termina [`ui/TerminalWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java) (`togglePin`, which counts the other pinned tabs and moves the tab to
    that index).
- **TABS-06 · MUST.** Reopen Closed Tab brings back the files whose tabs this window closed, newest first, bounded
  to twenty, a file listed once, with the caret where it was. In a terminal app the *tab* comes back (its shells,
  their directories, the pane arrangement, the names the user gave them, its place in the strip) and not the
  scrollback.
  - *Why:* the process is gone, and pretending otherwise would be worse than saying so.
  - *Check (code):* each window keeps a list of the tabs it closed, newest first and no longer than twenty; the
    command takes the newest entry and opens it. In an app whose tabs hold files, an entry is the file, whether an
    editor's tab or a viewer's showed it, with the caret where the tab has one; closing a file again replaces its
    earlier entry, and reopening puts the caret back. In a terminal app, an entry holds the tab's panes with each
    one's shell and directory, their arrangement, the names the user gave them and the tab's place in the strip, and
    no scrollback. A test over the list is the surest evidence.
  - *Reference:* Editora [`ui/ClosedTabs.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ClosedTabs.java), [`ClosedTabsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ClosedTabsTest.java); `C-S-t` in the CUA keymap. Editora
    doesn't yet for its image, hex and PDF viewer tabs: `rememberClosed` in [`ui/MainController.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java) records
    the file of an editor's tab alone, so a closed viewer tab does not come back. Termina
    [`ui/ClosedTabs.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/ClosedTabs.java) and [`ClosedTabsTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/ui/ClosedTabsTest.java), on `Ctrl+Shift+Z` (`Cmd+Z` on macOS).
- **TABS-07 · SHOULD.** Tabs reorder by dragging, with this feedback: the dragged header dimmed and an
  accent line on the edge where it will land.
  - *Check (by hand):* drag a tab along the strip and watch the landing edge.
  - *Reference:* Editora [`TabHeaders.enableTabDrag`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TabHeaders.java); Termina `installTabDrag` and the pure [`TabReorder.insertIndex`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TabReorder.java).
    In Termina a double-click on a tab renames it, and a pane dragged onto a tab joins it (the whole header
    outlined, `tab-drop-into`).
- **TABS-08 · SHOULD.** In an app whose tabs hold files, a tab shows its file's Git status in the Project tree's
  colors: modified accent, added green, untracked olive, renamed violet, deleted muted, conflict red. A read-only
  tab still shows it; an unsaved one shows amber. The tab's tooltip names the file's Git status too, so color is
  not the status's only sign ([ACC-05](../accessibility/#acc-05)). A terminal app's tabs hold no files, so the
  rule passes it by.
  - *Check (code):* the code that styles a tab gives it, for its file's Git status, the style class the Project
    tree gives that file's row, read-only or not, and the stylesheet lets the unsaved tab's amber win over it; and
    the code that sets the tab's tooltip adds the status in words (modified, added, untracked and the rest) when
    the file has one. A test that finds the tree's class on a changed file's tab, and the status in its tooltip,
    is the surest evidence.
  - *Reference:* for the colors, Editora [`ui/TabGitStatus.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TabGitStatus.java), [`TabGitStatusTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/TabGitStatusTest.java). For the tooltip, no app
    yet: Editora's tab tooltip is the file's full path (`tooltip` in [`ui/TabHeaders.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TabHeaders.java)), so the tint is
    the tab's only sign of the status. Its Project tree adds a letter to the color; its tabs add no word, glyph
    or shape.
- **TABS-09 · SHOULD.** An app whose tabs hold files has a switcher that lists the open files in tab order. A
  command opens it; the arrows or the active keymap's line chords move, Enter or releasing Ctrl (the Control key,
  on macOS too) activates, Esc or the keymap's cancel chord cancels, and Backspace, Delete or the keymap's
  delete-character chord closes the highlighted file. The switcher's width is fixed to the longest path on each
  open, so it never resizes while you move. A terminal app's tabs hold no files, so the rule passes it by.
  - *Check (by hand):* open it with several tabs; move with the arrows and with the active keymap's line chords,
    close a file from it, cancel it, and open it again to activate another file; the list keeps its width.
  - *Reference:* Editora [`ui/Switcher.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Switcher.java), which reads its keys through [`ui/PickerKeys.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/PickerKeys.java) and the keymap, and
    [`SwitcherFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/SwitcherFxTest.java). In Editora's Emacs keymap `C-x C-b` opens it (`switcher.show`), `C-n` and `C-p` move, `C-g`
    cancels and `C-d` closes the file ([`keymaps/emacs.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/emacs.json)); no other Editora keymap binds `switcher.show`.
- **TABS-12 · SHOULD.** A command hides the tab bar.
  - *Check (code):* a registered command hides the tab header, with any number of tabs open. One that hides it
    only while the window has a single tab does not meet the rule.
  - *Reference:* Editora `view.toggleTabBar`, `.tab-pane.no-tab-header` in [`app.css`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/styles/app.css). Termina doesn't yet: the
    nearest it has is a setting, with a palette command that toggles it, that hides the strip only while the window
    has one tab (`settings.hideTabBar` in [`ui/SettingCommands.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SettingCommands.java)).

Termina's `HeaderBar` holds the menu bar and the window title
([`ui/TerminalWindow.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/TerminalWindow.java), `buildHeaderBar`), and its tab strip is the row under it.

![Termina window with a menu bar, a tab strip under it and a tab context menu](../../assets/shots/termina-tabs.png "Termina's tab strip, the row under the menu bar, with a tab's right-click menu.")

## Tool panels

**Applies to:** an app with tool panels: a tool panel is a panel docked at an edge of the main window, beside or
under the content, that the user shows and hides as a whole, the content taking its room while it is hidden. A
sidebar, a detail pane, an info panel and a thumbnail strip are tool panels, on a stripe or not. A section that
folds in place and leaves its heading showing is content (nux's All variables table, a `TitledPane` under its
dashboard), and so are a terminal's split panes: neither is a tool panel. Nor is a bar of the window's chrome
that a command hides (a toolbar, a status bar, a tab strip).

- **TABS-13 · MUST.** Every tool panel has a command that shows and hides it, with the id `tool.<id>`, as
  Editora's `tool.project` is, and where the app has a stripe, the panel's stripe button runs that command. In the
  Emacs keymap, `M-1` through `M-9` and then `M-0` run those commands, one chord to a panel: an app with fewer than
  ten panels uses the first of the chords, and one with more chooses the ten panels that get them. An app with one
  key table and no Emacs keymap ([KBD-09](../keyboard/#kbd-09)) owes none of these chords.
  - *Check (code):* every tool panel has a registered command whose id is `tool.` and the panel's own id, which
    shows the panel when it is hidden and hides it when it shows; a stripe button, where the app has stripes, runs
    that command, and one that toggles the panel directly and skips what the command does first fails; and
    `emacs.json`, in an app that ships one, binds `M-1`, `M-2` and on through `M-0` to those commands, one for
    each panel up to ten.
  - *Reference:* Editora registers a `tool.<id>` command for each of its tool windows
    ([`ui/WindowCommandRegistrar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WindowCommandRegistrar.java)) and binds ten of them to `M-1` … `M-0` ([`keymaps/emacs.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/emacs.json)). It doesn't
    meet the stripe clause yet: [`ToolWindowManager.register`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindowManager.java) gives each stripe button the manager's own `toggle`,
    not the command, so the button skips what some commands do first (`tool.remote` refreshes its panel;
    `tool.project` and `tool.notes` test that the feature is on). Nor does every one of its commands hide a panel that
    shows: `tool.gitLog`, for one, only opens its panel (`openGitLog` in [`ui/GitWindowCoordinator.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/GitWindowCoordinator.java)), and so do
    the `tool.<id>` commands of its build tools (`registerCommands` in [`ui/BuildCoordinator.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/BuildCoordinator.java)). Torrenta and
    Mirada don't meet the rule yet. Torrenta has no `tool.<id>` command: its two panels' commands are `toggle-sidebar`
    and `toggle-detail` ([`ui/MainWindow.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java)), and it ships no keymap file, so it owes no chord. Mirada's two are
    `view.properties` and `view.thumbnails` ([`ui/Command.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Command.java)), and its [`keymaps/emacs.json`](https://github.com/adriandeleon/Mirada/blob/main/src/main/resources/com/mirada/keymaps/emacs.json) binds them to `i`
    and `t`, where the rule requires `M-1` and `M-2`.
- A panel's content is built on first use: [PERF-14](../performance/#perf-14).
- **TABS-15 · SHOULD.** Panel state is restored: which panels are open, where each sits and every divider position
  go to the session-state file ([SET-08](../settings/#set-08); Editora's is `workspace-state.json`) and come back
  on the next launch. In an app with [tool window stripes](#tool-window-stripes) that includes each window's side
  and order, the stripe buttons the user hid, and the windows that float.
  - *Check (code):* the session state holds each of those, and the code that builds the panels reads them back at
    startup.
  - *Reference:* Editora [`ui/ToolWindowManager.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindowManager.java), [`config/WorkspaceState.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/WorkspaceState.java).
- **TABS-19 · SHOULD.** Closing the panel that holds keyboard focus returns focus to where it was in the content
  (in Editora, the editor).
  - *Check (code):* the code that closes a panel keeps the content's last focus owner and refocuses it on close.
  - *Reference:* Editora [`ToolWindowManager.focusEditor`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindowManager.java), a weak reference to the last editor focus owner.

## Tool window stripes

**Applies to:** an app with tool window stripes.

A stripe is the rail of buttons along an edge of the window, one button per tool window, that Editora has (pins 6
and 9 of the mockup). Its tool windows are tool panels too, so the rules of [Tool panels](#tool-panels) cover
them; these cover what only a docking system has.

- **TABS-16 · SHOULD.** Tool windows dock on three sides, left, right and bottom, and a side holds at most two
  windows stacked (Project over Structure, two consoles along the bottom).
  - *Why:* past that a side stops being a dock and becomes a list of slivers.
  - *Check (code):* the sides are an enum of three and the per-side limit is two.
  - *Reference:* Editora [`ToolWindow.Side`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindow.java), [`ToolWindowManager.MAX_PER_SIDE`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindowManager.java).
- **TABS-17 · SHOULD.** A tool window re-docks by dragging its stripe button to another stripe, with the same
  dim-and-accent-line feedback as a tab; an empty stripe appears as a dashed accent drop zone for the duration of
  the drag.
  - *Check (by hand):* drag a stripe button to the opposite side.
  - *Reference:* Editora [`ui/ToolWindowDock.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindowDock.java), [`ToolWindowVisibilityTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ToolWindowVisibilityTest.java) (an empty stripe shows while
    dragging).
- **TABS-18 · SHOULD.** Tool windows float, maximize, resize and close from the keyboard, and at most one window is
  maximized at a time.
  - *Check (code):* floating, maximizing, resizing and closing a tool window are each a registered command, so the
    palette runs them without the mouse; and maximizing one first restores the one that was maximized.
  - *Reference:* Editora `view.floatToolWindow` (palette only), `view.maximizeToolWindow` (`C-x f`),
    `view.closeFocusedToolWindow` (`C-x 0`), the resize commands (`C-x S-.`, `C-x S-,`, `C-x S-6`);
    [`ui/ToolWindowManager.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindowManager.java) keeps one `maximized` panel and restores it before it maximizes another.
- **TABS-20 · SHOULD.** Hidden is not unavailable: the user's show/hide choice for a stripe button is kept apart
  from a context-driven hide (the Commit window outside a Git repository), so the second never clobbers the first.
  - *Check (code):* the stripe keeps two values for a tool window, the user's saved show/hide choice and whether
    the context offers the window now, shows the button only when both hold, and never writes the first when the
    second changes. A test that asserts it is the surest evidence.
  - *Reference:* Editora [`ui/ToolWindowVisibility.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindowVisibility.java), [`ToolWindowVisibilityTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ToolWindowVisibilityTest.java).
- **TABS-21 · SHOULD.** A tool window whose content needs more room than the default share of its side can ask for
  more on its first open (Editora's Debug window asks for 42 %); the user's own size wins afterwards.
  - *Check (code):* a tool window can ask for a larger share of the side on its first open (Editora's
    `setFirstOpenShare`), the docking code grants it only while the user has set no size for that window, and the
    other windows keep the side's size. A test that asserts it is the surest evidence.
  - *Reference:* Editora [`ToolWindow.setFirstOpenShare`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindow.java), [`ToolWindowFirstOpenShareTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ToolWindowFirstOpenShareTest.java).
- **TABS-22 · SHOULD.** A stripe button badges a spinner while its window has something under way.
  - *Check (code):* a tool window has a busy state, and its stripe button shows a spinner badge while the state
    holds and hides it when it ends. A test that asserts it is the surest evidence.
  - *Reference:* Editora [`ToolWindow.busy`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindow.java), [`ToolWindowManagerFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/ToolWindowManagerFxTest.java).
- **TABS-23 · SHOULD.** Tool windows follow the active document where they should: the Git UI follows the active
  tab's repository, the status bar's environment segment the active `.http` file, Local History the file whose tab
  menu opened it.
  - *Check (by hand):* switch between tabs from two repositories with the Git window open.
  - *Reference:* Editora [`ui/GitPathScope.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/GitPathScope.java).

## In the apps

The other apps have panels and no stripes, so only [Tool panels](#tool-panels) covers them. Torrenta's filter
**sidebar** sits down the left or the right of the list or nowhere, kept as two settings keys so hiding it keeps
its side (`SidebarPlace`); its inner edge drags to resize within readable bounds and a double-click resets it
(`SidebarWidth`); the **detail pane** docks under the list in two columns or beside it in one, from the View menu (`DetailPane`). Mirada's info panel opens on
the right and its thumbnail strip along the bottom or down the left side, each closed until its command asks for it
(`ThumbnailStrip.place`). Termina splits a tab into **panes** instead: a pane is picked up with a drag while
`Ctrl+Alt+Shift` (`Cmd+Option+Shift` on macOS) is held, since every smaller chord is spoken for (`PaneDrag`), and a
maximized pane wears a "Pane 2 of 3" badge so the others are known to still be there.

![Editora editing a Java file with the project tree and status bar](../../assets/shots/editora-hero.png "Editora: the Project tool window docked right of the editor, its stripe on the window's right edge, and the bottom stripe's labeled buttons under the editor.")
![Mirada with its file name and folder in a HeaderBar title bar, an info panel and a thumbnail strip](../../assets/shots/mirada-main.png "Mirada: the info panel on the right and the thumbnail strip along the bottom, both commands.")
![Torrenta's transfer list with a details pane and speed graph](../../assets/shots/torrenta-main.png "Torrenta: the filter sidebar left of the list and the detail pane beside the list, on its right.")

## Spec

| Property | Value | Reference |
|---|---|---|
| Tab strip | `-color-bg-subtle`, padding 3 10 0 10, tabs bottom-aligned so the active one touches the editor; no bottom rule | `.tab-pane > .tab-header-area` |
| Tab | Transparent, square corners, padding 2 11 3 11; hover `-color-bg-inset` | `.headers-region > .tab` |
| Active tab | Two background layers: `-color-border-default` outside, `-editor-surface` inset 1 1 0 1; title bold `-color-fg-default`; glyph `-color-accent-fg` | `.tab:selected` |
| Title | Inter 14 px, `-color-fg-muted`, in a graphic label; the full path as tooltip | `.tab .tab-title`, `TabHeaders.tooltip` |
| Unsaved | `• ` prefix, `-state-amber`, italic | `.tab-header.dirty .tab-title` |
| Pinned | `Icons.pin()` in the header, bold; first in the strip | `.tab-header.pinned`, `togglePin` |
| Read-only | `-color-fg-muted`, italic | `.tab-header.read-only` |
| Drag | Dragged header at 0.4 opacity; 2 px `-color-accent-emphasis` on the landing edge | `.tab-dragging`, `.tab-drop-before`, `.tab-drop-after` |
| Closed tabs | Twenty, newest first, one entry per file, with the caret | `ClosedTabs.DEFAULT_CAPACITY` |
| Switcher | 26 px rows, 12 visible, width fixed per open | `Switcher.CELL_HEIGHT`, `MAX_VISIBLE` |
| Tool stripe | 30 px wide, `-color-bg-subtle`, 8 px spacing, no edge; buttons min 24, padding 9 5, radius 6 | `.tool-stripe`, `.tool-stripe-button` |
| Stripe states | Open: `-color-accent-subtle` fill, accent glyph. Focused window: `-state-accent-hover` | `:open`, `:tw-active` |
| Bottom stripe | Label 14 px beside the glyph, padding 3 8; open = accent, bold | `.tool-stripe-horizontal .tool-stripe-button` |
| Panel | `-color-bg-subtle` ground, radius 0 0 8 8, no border | `.tool-window` |
| Panel header | Padding 6 6 6 12, radius 7 7 0 0, no rule under it; title 14 px bold muted with the window's glyph; active: `-color-accent-subtle` band, accent title | `.tool-window-header`, `.tool-window:active` |
| Panel content | `-color-bg-default`, padding 8; its tree or list draws no frame of its own | `.tool-window-content` |
| Per side | Two windows at most, stacked in an inner SplitPane | `MAX_PER_SIDE` |
| Persisted | Open state, sides, order, visibility, floating windows, divider positions | `WorkspaceState` in `workspace-state.json` |
