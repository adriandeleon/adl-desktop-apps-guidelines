# Settings Sync

> The family's Sync settings page: keep user data the same on every computer through a Git repository the user owns.

Pauta 6.1.0 (2026-11-14). The page with its screenshots and mockups: https://pauta-project.dev/6.1.0/templates/settings-sync/.
Every rule of the edition: https://pauta-project.dev/6.1.0/llms-full.txt.

Keeps the user's data (snippets, templates, shortcuts, profiles, saved views) the same on every computer. No server
and no account of ours: the store is a private Git repository the user owns.

[SYNC-01](https://pauta-project.dev/6.1.0/templates/settings-sync/#sync-01) says which apps offer it: those with user data worth carrying between computers. Every other
rule about sync, [SYNC-02](https://pauta-project.dev/6.1.0/templates/settings-sync/#sync-02) here and [SET-18](https://pauta-project.dev/6.1.0/settings/#set-18) to [SET-21](https://pauta-project.dev/6.1.0/settings/#set-21)
on the Settings page, applies to an app with Settings Sync.

## Rules

- **SYNC-01 · SHOULD.** An app with user data worth carrying between computers offers Settings Sync, on a page of its
  own in the Settings window that the Settings search finds by "sync". Such data is what a person builds up in the
  app by hand and would set up again on another computer: snippets, templates, shortcuts, profiles, presets,
  bookmarks, saved views.
  - *Check (by hand):* open Settings, search "sync", and land on the Sync page. An app that keeps none of the data
    the statement lists is outside the rule.
  - *Reference:* Editora [`ui/SettingsSync.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/SettingsSync.java) (the service) and [`ui/SettingsSyncPage.java`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/SettingsSyncPage.java), built by
    [`SettingsWindow`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/ui/SettingsWindow.java) (`Category.SYNC`). Termina, Torrenta and the app template have Settings Sync
    too. Modula, Mirada and nux keep such data (presets, bookmarks, profiles) and have no Settings Sync yet.
- **SYNC-02 · SHOULD.** In an app with Settings Sync ([SYNC-01](https://pauta-project.dev/6.1.0/templates/settings-sync/#sync-01)), the store is a Git repository the user
  owns, reached through their own Git credentials (a credential helper or an SSH key), with no server or account of
  ours. Refusing a URL with a password or token in it is [SET-15](https://pauta-project.dev/6.1.0/settings/#set-15).
  - *Check (code):* the app's sync code runs `git` against the URL the user gave, with their own Git credentials,
    and talks to no server or account of the app's own.
  - *Reference:* Editora [`sync/`](https://github.com/adriandeleon/Editora/tree/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/sync) package ([`SyncEngine`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/sync/SyncEngine.java), [`SyncMerge`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/sync/SyncMerge.java), [`SyncAccount`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/sync/SyncAccount.java)), [`SyncEngine.hasCredentials`](https://github.com/adriandeleon/Editora/blob/f314ca3b117829d25dbaa63be6ba2353fd898fd8/src/main/java/com/editora/sync/SyncEngine.java);
    Termina carries the same package, Torrenta its own [`sync/`](https://github.com/adriandeleon/torrenta/tree/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/sync) with [`SyncEngine`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/sync/SyncEngine.java) and [`SyncAccount`](https://github.com/adriandeleon/torrenta/blob/52d47c02ac57d8671d1e58d268b96a5532dbb00a/src/main/java/com/torrenta/sync/SyncAccount.java); the page's
    [Spec](https://pauta-project.dev/6.1.0/templates/settings-sync/#spec).

How sync behaves is on the Settings page: setup and the pinned account ([SET-18](https://pauta-project.dev/6.1.0/settings/#set-18)), when it
runs and what never travels ([SET-19](https://pauta-project.dev/6.1.0/settings/#set-19)), who wins a conflict and the backup
([SET-20](https://pauta-project.dev/6.1.0/settings/#set-20)), and where its status shows ([SET-21](https://pauta-project.dev/6.1.0/settings/#set-21)). This page shows
them and does not state them again as rules.

## Anatomy

*Mockup of the Sync page in the Settings window. Drawn on the page; the numbers below mark its parts.*

1. **Its own page** in the Settings sidebar, under System, found by the Settings search ("sync", "git", "github").
2. **Repository URL.** SSH or HTTPS. A URL with a password or token in it is refused, with the reason and the fix (a credential helper such as `gh auth setup-git`, or an SSH URL).
3. **Branch, Connect, Create on GitHub….** Connect clones or adopts the repository. Create on GitHub makes a private repository through the `gh` CLI and fills the URL in.
4. **Status pill** plus Sync Now and Open Sync Folder (see the states below).
5. **What to sync:** one switch per kind of data, each with a description when its scope is not obvious.
6. **What is not synced**, said plainly: machine-local preferences, the keymap in use, anything with paths.
7. **Automatic sync** with its interval in minutes (default 15, at least 1). Automatic runs never prompt.
8. **Privacy and conflicts**, in one note: use a private repository; on a same-entry conflict the computer you sync from wins, and the other version stays in the history; files a sync replaces are copied to the sync folder first.

## Status pill states

- *Never connected / Not connected*
- *Connected / Connected · synced just now*
- *Running / Connected · syncing…*
- *Network trouble / Not connected · retrying*
- *Needs the user / Sync failing*

Green, amber and red are the Settings status-pill colors. Amber means "will recover by itself" (offline, the
remote unreachable); red means "the user must act" (Git missing, the repository written by a newer version, a sync
that would remove most of a kind of data and waits for confirmation). The pill's accessible text is
"Sync status: …".

## Spec

| Property | Value | Reference |
|---|---|---|
| Store | A Git repository the user owns, cloned into `<config>/sync/`; one folder per kind of data | `SyncEngine`, `SyncTarget` |
| Sign-in | The user's own Git credentials (credential helper or SSH key); the GitHub account that can read the repository is pinned per clone ([SET-18](https://pauta-project.dev/6.1.0/settings/#set-18)) | `SyncAccount` |
| Automatic runs | After startup, 30 s after a local change, and every *n* minutes (default 15) ([SET-19](https://pauta-project.dev/6.1.0/settings/#set-19)) | `SettingsSync.DIRTY_DELAY_SECONDS`, `syncIntervalMinutes` |
| Conflicts | Per entry; this computer wins; the other version stays in history ([SET-20](https://pauta-project.dev/6.1.0/settings/#set-20)) | `SyncMerge` |
| Safety | Files a sync replaces are copied to the sync folder first ([SET-20](https://pauta-project.dev/6.1.0/settings/#set-20)); a sync that would remove most of a kind of data stops and asks | `SyncReport` |
| One runner | Sync runs in the first instance only; a second instance says so | `status.sync.secondaryInstance` |
| Failures | To the status bar and the [Message Log](https://pauta-project.dev/6.1.0/templates/message-log/), said once per failure, not once per interval ([SET-21](https://pauta-project.dev/6.1.0/settings/#set-21)) | `SettingsSync` |
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

*Screenshot: Editora.*
*Screenshot: Torrenta.*
*Screenshot: Termina.*
