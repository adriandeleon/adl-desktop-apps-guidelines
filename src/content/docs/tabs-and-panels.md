---
title: "Tabs and tool panels"
description: "The tab strip and its states, reorder and reopen, and the tool panels that dock around the editor."
---

A window shows its documents in a **tab strip** and its tools in **panels** docked beside or under them. Both are
driven by commands, both remember their state, and both draw their chrome as one band with the toolbar, not as boxes
inside boxes. Reference: Editora's `ui/TabHeaders.java` (the tab header), `ui/ClosedTabs.java`, `ui/Switcher.java`,
`ui/ToolWindowManager.java`, `ui/ToolWindowPanel.java` and the `.tab-pane`, `.tool-stripe` and `.tool-window`
rules in `app.css`.

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

## Tabs

- **MUST.** Every tab operation is a command, so it has a chord, a palette entry and a menu row: close, close others,
  close all, close unmodified, close to the left and right, pin, reopen closed, next and previous. The tab's
  [right-click menu](../menus/) lists them (`TabContextMenu`).
- **MUST. The header is the title.** The Tab's own text stays empty; a graphic header carries the file-type glyph,
  the markers and the title in a `.tab-title` label, which is what makes it a drag handle and lets each state set
  its own color (`TabHeaders`). The tooltip is the full path.
- **MUST. Bulk close skips pinned tabs.** `closeOtherTabs`, `closeAllTabs`, `closeUnmodifiedTabs` and
  `eligibleToLeft` / `eligibleToRight` all filter on the pinned set; a pinned tab cannot be closed by accident. Pinning
  moves the tab to the end of the pinned group, unpinning to just after it (`togglePin`, `moveToPinBoundary`).
- **MUST. Reopen Closed Tab.** `ClosedTabs` keeps the files whose tabs this window closed, newest first, bounded to
  twenty, a file listed once; reopening restores the caret. Termina brings back the *tab* (its shells, their
  directories, the pane arrangement, the names the user gave them, its place in the strip) and not the scrollback,
  because the process is gone and pretending otherwise would be worse than saying so. `C-S-t` in the CUA keymap;
  Termina `Ctrl+Shift+Z`, `Cmd+Z` on macOS.
- **Drag to reorder** with the feedback above (`TabHeaders.enableTabDrag`; Termina `installTabDrag` and the pure
  `TabReorder.insertIndex`). In Termina a double-click on a tab renames it, and a pane dragged onto a tab joins it
  (the whole header outlined, `tab-drop-into`).
- **Git status on the tab** in the Project tree's colors: modified accent, added green, untracked olive, renamed
  violet, deleted muted, conflict red (`TabGitStatus`). A read-only tab still shows it; an unsaved one shows amber.
- **Switcher.** `C-x C-b` (Emacs) opens an IntelliJ-style list of the open files in tab order: `C-n` / `C-p` or the
  arrows move, Enter or releasing Ctrl activates, `C-g` or Esc cancels, `C-d` or Backspace closes the highlighted
  file. Its width is fixed to the longest path on each open so it never resizes while you move (`Switcher`).
- **The window title** names the file, the project and the app, with a `•` prefix for an unsaved file.
- **Tabs in the title bar** (SHOULD) through JavaFX 27's `HeaderBar`; see [Window shell](../window-shell/). The tab
  bar can be hidden by a command (`view.toggleTabBar`, `.tab-pane.no-tab-header`).

![Termina window with tabs in the title bar and a tab context menu](../../assets/shots/termina-tabs.png "Termina's tabs in the title bar, with a tab's right-click menu.")

## Tool panels

- **MUST. A command toggles each panel** (`tool.<id>`: `M-1` … `M-0` in the Emacs keymap for ten of them),
  and the stripe button is the same command with a glyph. The panel's content is built on first use.
- **MUST. State is restored.** Which windows are open, on which side, in what order, hidden or shown, floating, and
  every divider position go to `workspace-state.json` and come back on the next launch (`ToolWindowManager`).
- **Three sides, two windows each.** Left, right and bottom stripes (`ToolWindow.Side`); a side holds at most two
  windows stacked (Project over Structure, two consoles along the bottom), because "past that a side stops being a
  dock and becomes a list of slivers" (`MAX_PER_SIDE`).
- **Re-dock by dragging the stripe button** to another stripe, with the same dim-and-accent-line feedback as a tab;
  an empty stripe appears as a dashed accent drop zone for the duration of the drag (`ToolWindowDock`).
- **Float, maximize, resize and close from the keyboard**: `view.maximizeToolWindow` (`C-x f`),
  `view.closeFocusedToolWindow` (`C-x 0`), the resize commands (`C-x S-.`, `C-x S-,`, `C-x S-6`). At most one
  window is maximized at a time.
- **Focus comes back.** Closing the panel that holds keyboard focus returns it to where it was in the editor
  (`focusEditor`, a weak reference to the last editor focus owner).
- **Hidden is not unavailable.** The user's show/hide choice for a stripe button is kept apart from a context-driven
  hide (the Commit window outside a Git repository), so the second never clobbers the first (`ToolWindowVisibility`).
- **A bottom window that is unusable at the default height asks for more on its first open**
  (`setFirstOpenShare`); the user's own size wins afterwards. A stripe button badges a spinner while its window has
  something under way (`busy`).
- **Panels follow the active document where they should**: the Git UI follows the active tab's repository
  (`GitPathScope`), the status bar's environment segment the active `.http` file, Local History the file whose tab
  menu opened it.

The other apps dock their panels the same way without a stripe. Torrenta's filter **sidebar** sits down the left or
the right of the list or nowhere, kept as two settings keys so hiding it keeps its side (`SidebarPlace`); its inner
edge drags to resize within readable bounds and a double-click resets it (`SidebarWidth`); the **detail pane** docks
under the list in two columns or beside it in one, from the View menu (`DetailPane`). Mirada's info panel opens on
the right and its thumbnail strip along the bottom or down the left side, each closed until its command asks for it
(`ThumbnailStrip.place`). Termina splits a tab into **panes** instead: a pane is picked up with a drag while
`Ctrl+Alt+Shift` (`Cmd+Option+Shift` on macOS) is held, since every smaller chord is spoken for (`PaneDrag`), and a
maximized pane wears a "Pane 2 of 3" badge so the others are known to still be there.

![Editora editing a Java file with the project tree and status bar](../../assets/shots/editora-hero.png "Editora: the Project tool window docked left of the editor, its stripe on the window's edge.")
![Mirada with its file name and folder in a HeaderBar title bar, an info panel and a thumbnail strip](../../assets/shots/mirada-main.png "Mirada: the info panel on the right and the thumbnail strip along the bottom, both commands.")
![Torrenta's transfer list with a details pane and speed graph](../../assets/shots/torrenta-main.png "Torrenta: the filter sidebar beside the list and the detail pane under it.")

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
