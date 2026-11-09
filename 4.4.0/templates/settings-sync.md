# Settings Sync

> The family's Sync settings page: keep user data the same on every computer through a Git repository the user owns.

Pauta 4.4.0 (2026-11-08). The page with its screenshots and mockups: https://pauta-project.dev/4.4.0/templates/settings-sync/.
Every rule of the edition: https://pauta-project.dev/4.4.0/llms-full.txt.

Keeps the user's data (snippets, templates, shortcuts, profiles, saved views) the same on every computer. No server
and no account of ours: the store is a private Git repository the user owns.

**Applies to:** an app with user data worth carrying between computers ([SYNC-01](https://pauta-project.dev/4.4.0/templates/settings-sync/#sync-01)).

## Rules

- **SYNC-01 · SHOULD.** An app with user data worth carrying between computers offers Settings Sync, on a page of its
  own in the Settings window that the Settings search finds by "sync".
  - *Check (by hand):* open Settings, search "sync", and land on the Sync page.
  - *Reference:* Editora [`ui/SettingsSync.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSync.java) (the service) and [`ui/SettingsSyncPage.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSyncPage.java), built by
    [`SettingsWindow`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java) (`Category.SYNC`).
- **SYNC-02 · SHOULD.** The store is a Git repository the user owns, reached through their own Git credentials (a
  credential helper or an SSH key), with no server or account of ours. Refusing a URL with a password or token in it
  is [SET-15](https://pauta-project.dev/4.4.0/settings/#set-15).
  - *Check (code):* the sync package runs `git` against the user's URL, with no server or account of the app's own.
  - *Reference:* Editora [`sync/`](https://github.com/adriandeleon/Editora/tree/master/src/main/java/com/editora/sync) package ([`SyncEngine`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncEngine.java), [`SyncMerge`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncMerge.java), [`SyncAccount`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncAccount.java)), [`SyncEngine.hasCredentials`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncEngine.java);
    Termina carries the same package, Torrenta its own [`sync/`](https://github.com/adriandeleon/torrenta/tree/master/src/main/java/com/torrenta/sync) with [`SyncEngine`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/sync/SyncEngine.java) and [`SyncAccount`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/sync/SyncAccount.java); the Spec table
    below.

## Anatomy

*Mockup of the Sync page in the Settings window. Drawn on the page; the numbers below mark its parts.*

1. **Its own page** in the Settings sidebar, under System, found by the Settings search ("sync", "git", "github").
2. **Repository URL.** SSH or HTTPS. A URL with a password or token in it is refused, with the reason and the fix (a credential helper such as `gh auth setup-git`, or an SSH URL).
3. **Branch, Connect, Create on GitHub….** Connect clones or adopts the repository. Create on GitHub makes a private repository through the `gh` CLI and fills the URL in.
4. **Status pill** plus Sync Now and Open Sync Folder (see the states below).
5. **What to sync:** one switch per kind of data, each with a description when its scope is not obvious.
6. **What is not synced**, said plainly: machine-local preferences, the keymap in use, anything with paths.
7. **Automatic sync** with its interval in minutes (default 15, at least 1). Automatic runs never prompt.
8. **Privacy and conflicts**, in one note: use a private repository; on a same-entry conflict the computer you sync from wins, and the other version stays in the history.

## Status pill states

*Never connectedNot connected ConnectedConnected · synced just now RunningConnected · syncing… Network troubleNot connected · retrying Needs the userSync failing*

Green, amber and red are the Settings status-pill colors. Amber means "will recover by itself" (offline, the
remote unreachable); red means "the user must act" (Git missing, the repository written by a newer version, a sync
that would remove most of a kind of data and waits for confirmation). The pill's accessible text is
"Sync status: …".

## Spec

| Property | Value | Reference |
|---|---|---|
| Store | A Git repository the user owns, cloned into `<config>/sync/`; one folder per kind of data | `SyncEngine`, `SyncTarget` |
| Sign-in | The user's own Git credentials (credential helper or SSH key); the GitHub account that can read the repository is pinned per clone | `SyncAccount` |
| Automatic runs | After startup, 30 s after a local change, and every *n* minutes (default 15) | `SettingsSync.DIRTY_DELAY_SECONDS`, `syncIntervalMinutes` |
| Conflicts | Per entry; this computer wins; the other version stays in history | `SyncMerge` |
| Safety | Files a sync replaces are copied to the sync folder first; a sync that would remove most of a kind of data stops and asks | `SyncReport` |
| One runner | Sync runs in the first instance only; a second instance says so | `status.sync.secondaryInstance` |
| Failures | To the status bar and the [Message Log](https://pauta-project.dev/4.4.0/templates/message-log/), said once per failure, not once per interval | `SettingsSync` |
| Palette | Settings Sync: Set Up…, Sync Now, and Toggle Sync Automatically | `sync.setup`, `sync.now`, `sync.toggleAuto` |

## Copy

| Key | English |
|---|---|
| `settings.sync.subtitle` | Keep your snippets, abbreviations, templates and personal dictionary the same on every computer, through a Git repository you own. |
| `settings.sync.connect` / `settings.sync.createGithub` | Connect / Create on GitHub… |
| `settings.sync.now` / `settings.sync.openFolder` | Sync Now / Open Sync Folder |
| `settings.sync.pill.*` | Connected · Not connected · Sync failing · syncing… · retrying · synced {0} min ago |
| `status.sync.notSetUp` | Settings sync is not connected. Set it up in Settings ▸ Sync. |

## In the apps

*Screenshot: Editora.*
*Screenshot: Torrenta.*
*Screenshot: Termina.*
