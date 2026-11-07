---
title: "Settings"
description: "The Settings window with search, live apply, versioned config and Git/GitHub sync."
---

## The Settings window

- **SET-01 · MUST.** The Settings window opens from a palette command, bound to `Ctrl+,` (`Cmd+,` on macOS) in the
  CUA keymap.
  - *Check (code):* a registered command opens Settings, and `cua.json` and `cua.mac.json` bind it.
  - *Reference:* Editora `view.settings`, bound in `keymaps/cua.json` and `cua.mac.json` (and in the VS Code and
    Sublime keymaps; IntelliJ's uses `C-M-s`).
- **SET-02 · MUST.** The window has a sidebar of pages with icons on the left, the page on the right, and a search
  field on top.
  - *Check (by hand):* open Settings; the search field sits above the sidebar and the page.
  - *Reference:* Editora `ui/SettingsWindow.java`, `ui/SettingsSidebarNav.java`, `ui/SettingsIcons.java`.
- **SET-03 · MUST.** Search finds a row by its title, description, visible text, its card or section heading, its
  page name and English keywords. Title hits rank above description hits; whole words above word starts. The page
  with the best match opens, and every non-matching row, heading and card is hidden.
  - *Check (test):* a unit test ranks a title hit above a keyword hit and a whole word above part of one.
  - *Reference:* Editora `ui/SettingsSearch.java`, `SettingsSearchTest`.
- **SET-04 · MUST.** Settings apply live, with no Save button. Text fields commit on Enter or focus loss; invalid
  values are marked and never committed.
  - *Check (code):* no Save or Apply button in the window; text fields commit through `commitOnEnterOrBlur`.
  - *Reference:* Editora `SettingsWindow.commitOnEnterOrBlur`; `SettingsSyncPage`'s branch field marks an invalid
    branch.
- **SET-05 · SHOULD.** A change made in one window reaches every other open window.
  - *Check (test):* an FX test changes a setting in one window and finds it applied in the other.
  - *Reference:* Editora: every window holds the same `config/SharedConfig.java`, which announces each change
    (`onSettingsChanged`); `CrossWindowSettingsFxTest`.

![Editora's Settings window searching for sync, with the Sync page open](../../assets/shots/editora-settings-search.png "Typing sync in Settings: pages without a match gray out and the best page opens.")

## Before adding a setting

A setting is a question the user has to answer. When the question has one right answer, choose it, make it the
behavior, and say why in the code and the docs; do not ship a knob for it. Modula's test: *would a car radio have
it?* A preset button, yes; a "decimation stages" spinner, no. So Modula has no gain, bandwidth or squelch control:
each has one right value for a listener, and the app supplies it. Add a setting when people really differ (a
keymap, a theme, a language), not when the developer could not decide.

## Adding a setting touches five places

1. **Model** field, default and accessors, with a schema bump and migration.
2. **Control**, built once, writing the field and applying it.
3. **Row** on its page with search keywords.
4. **Load** line that sets the control from the model, safe to run at any time.
5. **Palette command** that flips or prompts the same field, plus strings in every catalog.

- **SET-06 · MUST.** Every setting has a palette command that flips the field or prompts for its value.
  - *Check (by hand):* for each row in Settings, find a palette command that changes it.
  - *Reference:* Editora's `view.toggle…` and picker commands (`ui/WindowCommandRegistrar.java`). Editora does not
    have one for every setting yet: `terminalNotifications`, for one, is only a Settings row.

## Config folder and schema

- **SET-07 · MUST.** Config lives in `~/.<app>`: `~/.<app>-dev` for `--dev`, any folder via `--config-dir` or
  `<APP>_CONFIG_DIR`.
  - *Check (code):* one resolver picks the folder, in the order `--config-dir`, the environment variable, the
    default.
  - *Reference:* Editora `App` and `ConfigManager.configDirFor`, `ConfigDirTest`.
- **SET-08 · SHOULD.** `settings.json` holds preferences, `workspace-state.json` session state, and other stores
  their own JSON files.
  - *Check (code):* the config folder's file names are constants in the config package.
  - *Reference:* Editora `config/ConfigManager.java`, `config/WorkspaceState.java`.
- **SET-09 · MUST.** Every versioned file has a `SCHEMA_VERSION` and a `v → v+1` migration step. A purely additive
  field uses an identity step.
  - *Check (code):* each store declares `SCHEMA_VERSION`, and the migrations have one step per version.
  - *Reference:* Editora `config/migration/ConfigMigrations.java`, `ConfigSchema.java`, `ConfigMigrationsTest`.
- **SET-10 · MUST.** A file newer than the running build is backed up to `<name>.v<n>.bak` and defaults load.
  - *Why:* an older build never clobbers a newer config.
  - *Check (test):* a test loads a too-new `settings.json` and finds the backup and the defaults.
  - *Reference:* Editora `ConfigVersioningTest` (`tooNewSettingsAreBackedUpAndDefaultsLoaded`).
- **SET-11 · SHOULD.** Never trust a config file. Clamp every value to its valid range when it is **read**, not only
  when it is written; an unknown value falls back to its default; a file that cannot be decoded is kept as
  `<name>.corrupt.bak` and defaults load. A bad file never stops the app from starting.
  - *Why:* config is plain JSON (or properties) and people edit it by hand. A hand-edited two-million-line
    scrollback must not exhaust memory at the next launch (Termina).
  - *Check (test):* a test loads out-of-range numbers and an unparseable file.
  - *Reference:* Editora `ConfigLoadProblemsTest` (`outOfRangeNumbersAreClampedOnLoad`,
    `anUnparseableFileIsReportedWithItsBackup`).
- **SET-12 · MUST.** Export configuration writes a timestamped `.zip` of the config folder; Import restores from
  one.
  - *Check (test):* tests over the zip's name and contents, and an import that replaces only the ticked parts.
  - *Reference:* Editora `config/ConfigExporter.java`, `config/ConfigImport.java`, `ConfigExporterTest`,
    `ConfigImportTest`.

## Secrets stay out of files

- **SET-13 · SHOULD.** No secret goes in a config file. API keys and tokens go to the operating system's keychain:
  macOS Keychain, Windows Credential Manager, the Secret Service on Linux. Calls may block on a prompt, so they run
  off the FX thread.
  - *Check (code):* no key or token field in the settings model; reads and writes go through the secret store.
  - *Reference:* Editora `secrets/SecretStore.java`.
- **SET-14 · SHOULD.** A credential the app can ask for again lives in memory for the session only and is never
  written. Work that needs it waits until the user has signed in this session; do not "fix" that by storing the
  password.
  - *Check (code):* the credential is a field of a runtime object, absent from every config class.
  - *Reference:* nux's UPS login (`app/CommandRunner.java`).
- **SET-15 · SHOULD.** A secret in the wrong place is refused. A repository URL with a password or token in it is
  refused, with the fix ([Settings Sync](../templates/settings-sync/)); a problem report redacts tokens, hosts and
  home paths before anyone sees it ([Diagnostics](../diagnostics/)).
  - *Check (by hand):* paste `https://user:token@host/repo.git` as the sync repository.
  - *Reference:* Editora `ui/SettingsSyncPage.java` (`settings.sync.repo.credentials`).
- **SET-16 · SHOULD.** An option that weakens security has no UI: it exists only as a key in the config file, so
  nobody turns it on by clicking.
  - *Check (code):* no Settings row or command writes such a key.
  - *Reference:* nux's trust-all TLS (`tlsTrustAll` in `config/Config.java`).

## Settings Sync (Git / GitHub)

- **SET-17 · SHOULD.** Settings, keybindings and user data can sync, optionally, through a Git repository the user
  owns.
  - *Check (by hand):* set up Sync on two machines and change a setting on one.
  - *Reference:* Editora `sync/SyncEngine.java`, `docs/subsystems/settings-sync.md`. Editora syncs key bindings
    and user data (snippets, abbreviations, templates, the dictionary), not the rest of `settings.json`; Torrenta
    syncs its settings file (`sync/SyncEngine.java`).
- **SET-18 · SHOULD.** Setup is by pasting a repo URL, or **Create on GitHub** through the `gh` CLI. The account
  that can read the repo is pinned per clone, so machines with two GitHub accounts work.
  - *Check (test):* a test remembers the first account that can read the repository and uses it without asking
    again.
  - *Reference:* Editora `sync/SyncAccount.java`, `SyncAccountTest`, `ui/SettingsSyncPage.java`.
- **SET-19 · SHOULD.** Sync runs automatically (on change and at start) and on demand. Machine-local keys (window
  size, paths) never sync.
  - *Check (code):* one pure class decides which keys or files travel, and machine-local ones are not among them.
  - *Reference:* Editora `ui/SettingsSync.java` (after startup, after a local change, on an interval, and
    `sync.now`), `sync/SyncCategory.java`; Torrenta `sync/SyncKeys.java`.
- **SET-20 · SHOULD.** On a same-entry conflict *this machine wins*, and a backup is taken before any sync that
  replaces local files.
  - *Check (test):* a merge test where both sides changed one entry keeps this machine's.
  - *Reference:* Editora `sync/SyncMerge.java`, `SyncMergeTest`.
- **SET-21 · SHOULD.** Sync status shows as a pill in Settings and as echo messages; failures go to the Message Log.
  - *Check (by hand):* point Sync at a repository that does not exist and read the pill and the log.
  - *Reference:* Editora `ui/SettingsSyncPage.java`, `SyncStatus`.

![Editora's Sync settings page](../../assets/shots/editora-settings-sync.png "Editora's Sync page: repository, branch, Create on GitHub… and what to sync.")
![Torrenta's Sync settings page](../../assets/shots/torrenta-settings-sync.png "Torrenta's Sync page.")
![Termina's Sync settings page](../../assets/shots/termina-settings-sync.png "Termina's Sync page.")
