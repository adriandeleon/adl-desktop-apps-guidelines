---
title: "Welcome page"
description: "The family's start page: Start actions with their chords, recent items a digit away, Customize and Help, shown when there is nothing to restore."
---

The page shown when there is no session to restore, and the answer to "what do I do now?". The text rules are in
Editora's [`ui/WelcomeText.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WelcomeText.java) and the strings under `welcome.*`.

## Rules

- **WELC-01 · SHOULD.** An app that opens files or projects in tabs shows a Welcome page when there is no session
  to restore.
  - *Check (code):* startup with nothing restored opens the Welcome page.
  - *Reference:* Editora [`ui/WelcomePane.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WelcomePane.java), [`MainController.addWelcomeTab`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java).
- **WELC-02 · SHOULD.** An app whose window *is* its content, and can start with nothing in it (a list with no
  items, a viewer with nothing open), shows its own empty state in place of a Welcome page ([WELC-01](#welc-01)),
  with the same ingredients: the ways in, each with its chord.
  - *Check (by hand):* start the app with nothing in it and read the empty state's keys. An app that always opens
    into content (a terminal with its shell, a radio, a monitor) has no empty state to judge.
  - *Reference:* Torrenta [`ui/Welcome.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/Welcome.java); Mirada [`ui/ViewerWindow.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/ViewerWindow.java) (`offerToOpen`,
    `viewer.emptyHint`); both are described under [In the apps](#in-the-apps).

## Anatomy

<div class="mock-stage">
<div class="m-wl-page" role="img" aria-label="Mockup of the Welcome page">
<div class="m-wl-head"><img src="../../icons/editora.svg" alt="" /><div><div class="m-wl-title">Editora <span class="pin">1</span></div><div class="m-wl-tagline">A keyboard-driven programmer's editor</div></div></div>
<div class="m-wl-section">Start</div>
<div class="m-wl-actions">
<div class="m-wl-action"><span class="ic"><svg viewBox="0 0 16 16"><path d="M4.5 2.5h4.6l2.9 2.9v8.1h-7.5zM9.1 2.5v2.9h2.9M8.25 8.2v3.2M6.65 9.8h3.2"/></svg></span><span class="lnk">New File</span><span class="pin">2</span></div>
<div class="m-wl-action hover"><span class="ic"><svg viewBox="0 0 16 16"><path d="M1.5 3.5h4.2l1.5 2h7.3v7H1.5z"/></svg></span><span class="lnk">Open File…</span><span class="key">C-x C-f</span><span class="pin">3</span></div>
<div class="m-wl-action"><span class="ic"><svg viewBox="0 0 16 16"><path d="M1.5 3.5h4.2l1.5 2h7.3v7H1.5zM8 7.7v3M6.5 9.2h3"/></svg></span><span class="lnk">Open Folder as a Project…</span><span class="key">C-x C-p</span></div>
<div class="m-wl-action"><span class="ic"><svg viewBox="0 0 16 16"><path d="M5.4 8a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0-5.2 0M8 1.5v4M8 10.5v4"/></svg></span><span class="lnk">Clone Git Repository…</span></div>
<div class="m-wl-action"><span class="ic"><svg viewBox="0 0 16 16"><path d="M1.5 4.5h13v7h-13zM4 7h1M7 7h1M10 7h1M5 9.5h6"/></svg></span><span class="lnk">Command Palette</span><span class="key">M-x</span></div>
</div>
<div class="m-wl-section">Recent Projects</div>
<div class="m-wl-recent">
<div class="m-wl-row"><span class="num">1</span><span class="lnk">Editora</span><span class="dir">~/workspace/Editora</span><span class="pin">4</span></div>
</div>
<div class="m-wl-section">Recent Files</div>
<div class="m-wl-recent">
<div class="m-wl-row"><span class="num">2</span><span class="lnk">hello.py</span><span class="m-wl-chip">Editora</span><span class="dir">samples/run</span><span class="pin">5</span></div>
<div class="m-wl-row"><span class="num">3</span><span class="lnk">MainController.java</span><span class="m-wl-chip">Editora</span><span class="dir">…/main/java/com/editora/ui</span></div>
<div class="m-wl-row"><span class="num">4</span><span class="lnk">notes.md</span><span class="dir">~/Documents</span></div>
<div class="m-wl-row"><span class="num">5</span><span class="lnk">pom.xml</span><span class="m-wl-chip">Editora</span><span class="dir"></span></div>
<div class="m-wl-row"><span class="num">6</span><span class="lnk">deploy.sh</span><span class="dir">/srv/tools</span></div>
<div class="m-wl-more">Show 3 more ⌄ <span class="pin">6</span></div>
</div>
<div class="m-wl-section">Customize</div>
<div class="m-wl-recent">
<div class="m-wl-row"><span class="lbl">Keymap</span><span class="lnk">Emacs</span><span class="pin">7</span></div>
<div class="m-wl-row"><span class="lbl">Theme</span><span class="lnk">Editora Light</span></div>
<div class="m-wl-caption">Chords use Emacs notation: C- is Ctrl, M- is Alt, S- is Shift. Pick another keymap above to see your platform's notation.</div>
</div>
<div class="m-wl-section">Help</div>
<div class="m-wl-help"><span class="lnk">Documentation</span><span class="lnk">What's New</span><span class="lnk">Doctor: Check External Tools</span><span class="pin">8</span></div>
<div class="m-wl-footer">Version 0.27.0 · <span class="lnk">editora-project.dev</span><br />MIT License</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Identity.</strong> The app icon at 64 px beside the name (2.4 em, bold) and the README's one-line tagline, muted. One centered column, at most 640 px wide and never narrower than 340; a longer window scrolls.</span></li>
<li><span class="pin">2</span><span><strong>Start actions</strong>, each an existing command: New File, Open File, Open Folder as a Project (only with Projects on), Clone Git Repository (only with Git on), and the Command Palette always last, the gateway to everything else. Accent links with no box; the icon sits in a 26 px column so every label starts at the same x, and the whole row answers a click.</span></li>
<li><span class="pin">3</span><span><strong>Chord</strong>, right-aligned past a 32 px gap, in the keyboard color, from the active keymap. Unbound: no chord. Open File shows find-file's chord in the Emacs keymap, where that is the key to learn. The hovered row tints and the chord becomes a chip.</span></li>
<li><span class="pin">4</span><span><strong>Entry number.</strong> The first nine recent entries, projects first, are numbered in the keyboard color; typing that digit opens the entry. Projects come in the order of their most recent file.</span></li>
<li><span class="pin">5</span><span><strong>Recent file row.</strong> The name keeps its width; a chip names the project (or the host of a remote file); the folder is muted, relative to the project root, with <code>~</code> for home, and elides from its start so the part that differs stays visible. The full path is the row's tooltip; right-click offers Copy Path and Remove from recent files.</span></li>
<li><span class="pin">6</span><span><strong>Disclosure.</strong> Five rows per list; the rest wait behind "Show N more", which becomes "Show fewer".</span></li>
<li><span class="pin">7</span><span><strong>Customize.</strong> The active keymap and app theme by name; each link runs the picker command. Under an Emacs-style keymap a caption explains the notation. On a first run, with nothing recent, this block moves up under Start.</span></li>
<li><span class="pin">8</span><span><strong>Help and footer.</strong> Documentation, What's New (the release notes) and the Doctor. Then the version, the home page and the license; a dev build adds its commit on its own line once the lookup, which runs <code>git</code> off the FX thread, has answered.</span></li>
</ol>

## Spec

| Property | Value | Reference |
|---|---|---|
| Kind | A real tab content in its own closeable "Welcome" tab, so the tab strip handles switching and closing; not an overlay | `WelcomePane implements TabContent`, `MainController.addWelcomeTab` |
| Column | 640 px max, 340 px min, 48 px margin, centered in a scroll pane; below the minimum the page scrolls sideways | `COLUMN_WIDTH`, `MIN_COLUMN_WIDTH`, `MARGIN` |
| Zoom | Every px size is multiplied by the text zoom and the fonts are `em`, so zoom scales the layout, not only the words | `setFontScale`, `.welcome-*` |
| Surface | `-color-bg-default`, the UI surface, not the editor's; its tab takes the same fill | `.welcome-pane`, `.ui-surface-tab` |
| Header | Icon 64 px; title 2.4 em bold; tagline `-color-fg-muted` | `.welcome-title`, `.welcome-caption` |
| Section heading | 1.15 em bold, padding 28 0 8 0 | `.welcome-section` |
| Links | `Hyperlink` in `-color-accent-fg`, no border, underlined only on hover or keyboard focus; visited stays the accent | `.welcome-action`, `.welcome-link` |
| Action row | Icon column 26 px, gap 12 to the label, at least 32 px to the chord; hover fills `-color-bg-subtle` with 6 px radius, insets 8 px past the row | `WelcomePane.action`, `.welcome-action-row` |
| Chord | `-state-key`, 0.9 em; on hover a `-state-key-bg` chip, radius 4 | `.welcome-key` |
| Recent row | Number `-state-key` 0.8 em; folder `-color-fg-muted` 0.9 em with a leading ellipsis; project chip muted on `-color-bg-subtle`, radius 3 | `.welcome-entry-number`, `.welcome-recent-dir`, `.recent-project-name` |
| Lists | 5 rows, then a flat disclosure button | `COLLAPSED_RECENT_LIMIT`, `addCollapsed` |
| Focus | The first recent entry, or New File when there is none, with no focus ring; Enter and Space open it | `requestFocus`, `focusPage` |

## Behavior

**Applies to:** an app with a Welcome page ([WELC-01](#welc-01)).

- **WELC-03 · SHOULD.** The Welcome page is shown at startup when there is no session to restore (so always with
  `--no-session`), by the `view.welcome` command (Help → Welcome Page where the app has a Help menu, in the place
  [DOCS-07](../../documentation/#docs-07) gives it), and when the tab strip is empty after a
  project swap. In an app that can start straight into one view, as Editora does for a standalone diff, that
  startup suppresses the page while its worker reads the files.
  - *Check (code):* those three paths open the one Welcome tab, and where the app has a Help menu, a row inside it
    runs `view.welcome`; a startup that goes straight to a view holds a flag that skips the page.
  - *Reference:* Editora [`MainController.addWelcomeTab`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java), `showWelcomeIfNoTabs`; [`WindowSessionCoordinator`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WindowSessionCoordinator.java)
    (`suppressWelcome`). Editora's menu row is in View, not in Help yet ([`MenuBarModel`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MenuBarModel.java)).
- **WELC-04 · SHOULD.** Closing the last tab does not bring the page back. The empty content area shows its own
  quiet hint instead: the app's ways in, each with its chord (in Editora: Open File, Open Folder, Command Palette
  and Welcome Page), and takes focus so chords still reach the window.
  - *Check (code):* closing the last tab shows the hint in the empty content area, not the Welcome page, and gives
    it the focus; opening a tab hides it. A test that asserts it is the surest evidence.
  - *Reference:* Editora [`ui/EditorEmptyState.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/EditorEmptyState.java), [`EditorEmptyStateFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/EditorEmptyStateFxTest.java).
- **WELC-05 · SHOULD.** The page is rebuilt on every show, so the recents, the Projects and Git toggles, the keymap and
  the theme are current. A refresh keeps the focus where it was.
  - *Check (code):* showing the page calls `refresh`, which re-requests focus when the page had it.
  - *Reference:* Editora [`WelcomePane.refresh`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WelcomePane.java).
- **WELC-06 · SHOULD.** The recent lists offer no file that no longer exists and no project whose root is gone. Remote
  files are kept unchecked.
  - *Check (code):* the recent files pass through the same filter as the toolbar's dropdown; projects are kept only
    when their root is a directory.
  - *Reference:* Editora [`RecentFiles.showable`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/RecentFiles.java), [`WelcomePane`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WelcomePane.java).
- **WELC-07 · SHOULD.** Remove from recent files asks first, through the caller, then refreshes the page.
  - *Check (code):* the remover the page is given shows a confirmation before it removes the entry.
  - *Reference:* Editora [`WelcomePane.setRecentRemover`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WelcomePane.java); [`MainController`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java) (`dialog.removeRecent.*`).
- **WELC-08 · SHOULD.** The digits 1 to 9 open the numbered entries: typed characters only, with no modifier, so chords
  and Enter are untouched.
  - *Check (code):* the digit handler is on `KEY_TYPED` and ignores Ctrl, Alt and Meta.
  - *Reference:* Editora [`WelcomePane.onKeyTyped`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WelcomePane.java).
- **WELC-09 · SHOULD.** In an app with saved remote sites, they appear as their own section; a click opens the
  connection form prefilled. The section is hidden when there are none.
  - *Check (code):* the page adds a Remote Sites section only when the saved-sites list is not empty.
  - *Reference:* Editora [`WelcomePane`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WelcomePane.java) (`remoteSites`, `welcome.remote`).
- **WELC-10 · SHOULD.** The Welcome page's Customize links run the commands that pick the keymap and the app
  theme (Editora's are `keymap.select` and `theme.setAppTheme`); a change made there re-renders the page, chords
  included.
  - *Check (code):* the two Customize links run the app's keymap and theme picker commands through the registry,
    and applying a keymap or a theme refreshes the Welcome page.
  - *Reference:* Editora [`WelcomePane`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WelcomePane.java) (`customizeRow`), refreshed by [`SettingsReapply`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsReapply.java).
- **WELC-11 · SHOULD.** The Welcome tab is not a document: its menu is Close only, with no Save, Rename or Pin, and the
  title bar shows the app or project name, not a file.
  - *Check (code):* the Welcome tab's context menu holds one Close item.
  - *Reference:* Editora [`MainController.addWelcomeTab`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java).

## Copy

| Key | English |
|---|---|
| `welcome.tab` | Welcome |
| `welcome.tagline` | A keyboard-driven programmer's editor |
| `welcome.start` | Start |
| `welcome.newFile` / `welcome.openFile` | New File / Open File… |
| `welcome.openFolder` / `welcome.clone` | Open Folder as a Project… / Clone Git Repository… |
| `welcome.recentProjects` / `welcome.recentFiles` / `welcome.remote` | Recent Projects / Recent Files / Remote Sites |
| `welcome.noRecent` | No recent files yet. Open a file or a folder to start, or run editora FILE in a terminal. |
| `welcome.recent.showMore` / `welcome.recent.showFewer` | Show {0} more / Show fewer |
| `welcome.entryNumber` | Press {0} to open *(accessible help)* |
| `welcome.customize` / `welcome.keymap` / `welcome.theme` | Customize / Keymap / Theme |
| `welcome.notation.emacs` | Chords use Emacs notation: C- is Ctrl, M- is Alt, S- is Shift. Pick another keymap above to see your platform's notation. |
| `welcome.help` / `welcome.documentation` / `welcome.whatsNew` / `welcome.doctor` | Help / Documentation / What's New / Doctor: Check External Tools |
| `welcome.version` | Version {0} |
| `welcome.page` | Welcome Page *(the row in the empty editor's hint, [WELC-04](#welc-04); the menu row takes the command's title, `command.view.welcome`)* |

## In the apps

![Editora's Welcome tab](../../../assets/shots/editora-welcome.png "Editora: Start actions with their chords, Recent Projects and Recent Files numbered 1 and 2, Customize below.")

Torrenta has no documents to come back to, so its welcome is an **empty state over the table** until the first
torrent (`ui/Welcome.java`, bound to the list being empty): a drop zone that says "Drop a .torrent, a magnet or a
link anywhere", the four keys that matter with their chords (open a .torrent file, add what is on the clipboard,
filter or run a command, Settings), the clipboard's magnet or link offered with an *Add it* button when there is
one, and where downloads go with a *change* link. Nothing on it takes focus: the keys are the way in. Mirada, with
no folder open, shows an empty state too (`offerToOpen` in [`ui/ViewerWindow.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/ViewerWindow.java)): a hint that names the Open
command's chord ("Open an image with {0}, or drop one here"), buttons for the Open Image… and Open Folder… commands
and a Documentation link. Termina, Modula and nux open straight into their content and have neither.
