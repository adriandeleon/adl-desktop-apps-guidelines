---
title: "Settings Sync"
description: "The family's Sync settings page: keep user data the same on every computer through a Git repository the user owns."
---

Keeps the user's data (snippets, templates, shortcuts, profiles, saved views) the same on every computer. No server
and no account of ours: the store is a private Git repository the user owns.

[SYNC-01](#sync-01) says which apps offer it: those with user data worth carrying between computers. Every other
rule about sync, [SYNC-02](#sync-02) here and [SET-18](../../settings/#set-18) to [SET-21](../../settings/#set-21)
on the Settings page, applies to an app with Settings Sync.

## Rules

- **SYNC-01 · SHOULD.** An app with user data worth carrying between computers offers Settings Sync, on a page of its
  own in the Settings window that the Settings search finds by "sync". Such data is what a person builds up in the
  app by hand and would set up again on another computer: snippets, templates, shortcuts, profiles, presets,
  bookmarks, saved views.
  - *Check (by hand):* open Settings, search "sync", and land on the Sync page. An app that keeps none of the data
    the statement lists is outside the rule.
  - *Reference:* Editora [`ui/SettingsSync.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSync.java) (the service) and [`ui/SettingsSyncPage.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSyncPage.java), built by
    [`SettingsWindow`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java) (`Category.SYNC`). Termina, Torrenta and the app template have Settings Sync
    too. Modula, Mirada and nux keep such data (presets, bookmarks, profiles) and have no Settings Sync yet.
- **SYNC-02 · SHOULD.** In an app with Settings Sync ([SYNC-01](#sync-01)), the store is a Git repository the user
  owns, reached through their own Git credentials (a credential helper or an SSH key), with no server or account of
  ours. Refusing a URL with a password or token in it is [SET-15](../../settings/#set-15).
  - *Check (code):* the app's sync code runs `git` against the URL the user gave, with their own Git credentials,
    and talks to no server or account of the app's own.
  - *Reference:* Editora [`sync/`](https://github.com/adriandeleon/Editora/tree/master/src/main/java/com/editora/sync) package ([`SyncEngine`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncEngine.java), [`SyncMerge`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncMerge.java), [`SyncAccount`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncAccount.java)), [`SyncEngine.hasCredentials`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncEngine.java);
    Termina carries the same package, Torrenta its own [`sync/`](https://github.com/adriandeleon/torrenta/tree/master/src/main/java/com/torrenta/sync) with [`SyncEngine`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/sync/SyncEngine.java) and [`SyncAccount`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/sync/SyncAccount.java); the page's
    [Spec](#spec).

How sync behaves is on the Settings page: setup and the pinned account ([SET-18](../../settings/#set-18)), when it
runs and what never travels ([SET-19](../../settings/#set-19)), who wins a conflict and the backup
([SET-20](../../settings/#set-20)), and where its status shows ([SET-21](../../settings/#set-21)). This page shows
them and does not state them again as rules.

## Anatomy

<div class="mock-stage">
<div class="m-card m-settings" role="img" aria-label="Mockup of the Sync page in the Settings window">
<div class="side">
<div class="m-field" style="margin-bottom:6px"><span class="ph">Search settings…</span></div>
<div class="group">Version control</div>
<div class="nav"><span class="m-icon"></span>Git</div>
<div class="nav"><span class="m-icon"></span>GitHub</div>
<div class="group">System</div>
<div class="nav"><span class="m-icon"></span>Keymaps</div>
<div class="nav"><span class="m-icon"></span>Macros</div>
<div class="nav"><span class="m-icon"></span>Plugins</div>
<div class="nav on"><span class="m-icon"></span>Sync <span class="pin" style="margin-left:auto">1</span></div>
<div class="nav"><span class="m-icon"></span>Advanced</div>
</div>
<div class="page">
<div><h4>Sync</h4><div class="m-muted" style="margin-top:3px">Keep your snippets, abbreviations, templates, personal dictionary and shortcuts the same on every computer, through a Git repository you own.</div></div>
<div class="m-card2">
<div class="m-setrow"><div class="m-grow"><div class="label">Repository <span class="pin">2</span></div><div class="note">The URL of a private Git repository, empty or already used by another of your computers.</div><div class="m-field" style="margin-top:6px"><span class="ph">git@github.com:you/editora-sync.git</span></div></div></div>
<div class="m-setrow"><div class="m-grow"><div class="label">Branch</div><div class="note">The branch your synced files are kept on; main unless the repository also holds something else.</div></div><div class="m-field" style="width:90px">main</div><span class="m-btn primary">Connect</span><span class="m-btn">Create on GitHub…</span><span class="pin">3</span></div>
<div class="m-setrow"><div class="m-grow"><div class="label">Status</div></div><span class="pin">4</span><span class="m-pill amber">Not connected</span><span class="m-btn" aria-disabled="true">Sync Now</span><span class="m-btn">Open Sync Folder</span></div>
</div>
<div class="m-card2">
<div class="m-setrow" style="padding-bottom:4px"><span class="m-subtle" style="font-size:11px;font-weight:600">What to sync</span><span class="pin">5</span></div>
<div class="m-setrow"><span class="m-grow label">Snippets</span><span class="m-switch"></span></div>
<div class="m-setrow"><span class="m-grow label">Abbreviations</span><span class="m-switch"></span></div>
<div class="m-setrow"><span class="m-grow label">Templates</span><span class="m-switch"></span></div>
<div class="m-setrow"><span class="m-grow label">Personal dictionary</span><span class="m-switch off"></span></div>
<div class="m-setrow"><div class="m-grow"><div class="label">Shortcuts</div><div class="note">The shortcuts you change, in every keymap. Which keymap you use stays on each computer.</div></div><span class="m-switch"></span></div>
<div class="m-setrow"><span class="note m-grow">Not synced: your other preferences (settings.json), the keymap in use and macros stay on each computer. <span class="pin">6</span></span></div>
</div>
<div class="m-card2">
<div class="m-setrow"><div class="m-grow"><div class="label">Sync automatically <span class="pin">7</span></div><div class="note">Syncs after startup, shortly after you change something, and at this interval. It never asks for a password; a failure shows in the status bar.</div></div><div class="m-field" style="width:58px">15</div><span class="m-muted">minutes</span><span class="m-switch"></span></div>
<div class="m-setrow"><span class="note m-grow">Use a private repository: snippets and templates can contain private text. When the same entry was changed on two computers, the one you sync from keeps its version and the other version stays in the repository history. Files a sync replaces are copied to the sync folder first. <span class="pin">8</span></span></div>
</div>
</div>
<div class="bottom"><span class="m-btn">Reset to Defaults</span><span>Changes apply as you make them. Every setting is also a palette command.</span><span class="m-btn primary">Close</span></div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>Its own page</strong> in the Settings sidebar, under System, found by the Settings search ("sync", "git", "github").</span></li>
<li><span class="pin">2</span><span><strong>Repository URL.</strong> SSH or HTTPS. A URL with a password or token in it is refused, with the reason and the fix (a credential helper such as <code>gh auth setup-git</code>, or an SSH URL).</span></li>
<li><span class="pin">3</span><span><strong>Branch, Connect, Create on GitHub….</strong> Connect clones or adopts the repository. Create on GitHub makes a private repository through the <code>gh</code> CLI and fills the URL in.</span></li>
<li><span class="pin">4</span><span><strong>Status pill</strong> plus Sync Now and Open Sync Folder (see the states below).</span></li>
<li><span class="pin">5</span><span><strong>What to sync:</strong> one switch per kind of data, each with a description when its scope is not obvious.</span></li>
<li><span class="pin">6</span><span><strong>What is not synced</strong>, said plainly: machine-local preferences, the keymap in use, anything with paths.</span></li>
<li><span class="pin">7</span><span><strong>Automatic sync</strong> with its interval in minutes (default 15, at least 1). Automatic runs never prompt.</span></li>
<li><span class="pin">8</span><span><strong>Privacy and conflicts</strong>, in one note: use a private repository; on a same-entry conflict the computer you sync from wins, and the other version stays in the history; files a sync replaces are copied to the sync folder first.</span></li>
</ol>

## Status pill states

<div class="mock-stage">
<div class="m-states">
<div class="m-state"><div class="cap">Never connected</div><span class="m-pill amber">Not connected</span></div>
<div class="m-state"><div class="cap">Connected</div><span class="m-pill green">Connected · synced just now</span></div>
<div class="m-state"><div class="cap">Running</div><span class="m-pill green">Connected · syncing…</span></div>
<div class="m-state"><div class="cap">Network trouble</div><span class="m-pill amber">Not connected · retrying</span></div>
<div class="m-state"><div class="cap">Needs the user</div><span class="m-pill red">Sync failing</span></div>
</div>
</div>

Green, amber and red are the Settings status-pill colors. Amber means "will recover by itself" (offline, the
remote unreachable); red means "the user must act" (Git missing, the repository written by a newer version, a sync
that would remove most of a kind of data and waits for confirmation). The pill's accessible text is
"Sync status: …".

## Spec

| Property | Value | Reference |
|---|---|---|
| Store | A Git repository the user owns, cloned into `<config>/sync/`; one folder per kind of data | `SyncEngine`, `SyncTarget` |
| Sign-in | The user's own Git credentials (credential helper or SSH key); the GitHub account that can read the repository is pinned per clone ([SET-18](../../settings/#set-18)) | `SyncAccount` |
| Automatic runs | After startup, 30 s after a local change, and every *n* minutes (default 15) ([SET-19](../../settings/#set-19)) | `SettingsSync.DIRTY_DELAY_SECONDS`, `syncIntervalMinutes` |
| Conflicts | Per entry; this computer wins; the other version stays in history ([SET-20](../../settings/#set-20)) | `SyncMerge` |
| Safety | Files a sync replaces are copied to the sync folder first ([SET-20](../../settings/#set-20)); a sync that would remove most of a kind of data stops and asks | `SyncReport` |
| One runner | Sync runs in the first instance only; a second instance says so | `status.sync.secondaryInstance` |
| Failures | To the status bar and the [Message Log](../message-log/), said once per failure, not once per interval ([SET-21](../../settings/#set-21)) | `SettingsSync` |
| Palette | Settings Sync: Set Up…, Sync Now, and Toggle Sync Automatically | `sync.setup`, `sync.now`, `sync.toggleAuto` |

## Copy

| Key | English |
|---|---|
| `settings.sync.subtitle` | Keep your snippets, abbreviations, templates, personal dictionary and shortcuts the same on every computer, through a Git repository you own. |
| `settings.sync.connect` / `settings.sync.createGithub` | Connect / Create on GitHub… |
| `settings.sync.now` / `settings.sync.openFolder` | Sync Now / Open Sync Folder |
| `settings.sync.pill.*` | Connected · Not connected · Sync failing · syncing… · retrying · synced {0} min ago |
| `status.sync.notSetUp` | Settings sync is not connected. Set it up in Settings ▸ Sync. |

## In the apps

![Editora's Sync settings page](../../../assets/shots/editora-settings-sync.png "Editora.")
![Torrenta's Sync settings page](../../../assets/shots/torrenta-settings-sync.png "Torrenta.")
![Termina's Sync settings page](../../../assets/shots/termina-settings-sync.png "Termina.")
