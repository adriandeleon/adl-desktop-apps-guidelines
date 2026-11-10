---
title: "Settings"
description: "The Settings window with search, live apply, versioned config and Git/GitHub sync."
---

## The Settings window

- **SET-01 · MUST.** The Settings window opens from a palette command, bound to `Ctrl+,` (`Cmd+,` on macOS) in the
  CUA keymap.
  - *Check (code):* a registered command opens Settings, and `cua.json` and `cua.mac.json` bind it.
  - *Reference:* Editora `view.settings`, bound in [`keymaps/cua.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/cua.json) and [`cua.mac.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/cua.mac.json) (and in the VS Code and
    Sublime keymaps; IntelliJ's uses `C-M-s`).
- **SET-02 · MUST.** The window has a sidebar of pages with icons on the left, the page on the right, and a search
  field on top.
  - *Check (by hand):* open Settings; the search field sits above the sidebar and the page.
  - *Reference:* Editora [`ui/SettingsWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java), [`ui/SettingsSidebarNav.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSidebarNav.java), [`ui/SettingsIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsIcons.java).
- **SET-03 · MUST.** Search finds a row by its title, description, visible text, its card or section heading, its
  page name and English keywords. Title hits rank above description hits; whole words above word starts. The page
  with the best match opens, and every non-matching row, heading and card is hidden.
  - *Check (test):* a unit test ranks a title hit above a keyword hit and a whole word above part of one.
  - *Reference:* Editora [`ui/SettingsSearch.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSearch.java), [`SettingsSearchTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/SettingsSearchTest.java).
- **SET-04 · MUST.** Settings apply live, with no Save button. Text fields commit on Enter or focus loss; invalid
  values are marked and never committed. A setting that cannot apply until a restart says so on its own row.
  - *Check (code):* no Save or Apply button in the window; text fields commit through `commitOnEnterOrBlur`; and
    every setting the app reads only at startup (the language, the window's style) names the restart in its own
    row's text.
  - *Reference:* Editora [`SettingsWindow.commitOnEnterOrBlur`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java); [`SettingsSyncPage`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSyncPage.java)'s branch field marks an invalid
    branch. Rows that wait for a restart say so: Editora's interface language ("Applies after restarting Editora.",
    `settings.uiLanguage.note`), and Torrenta's tray icon, which on Windows and macOS "applies after restarting
    Torrenta" (`settings.general.trayIcon.desc`, in [`ui/SettingsWindow.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/SettingsWindow.java)).
- **SET-05 · SHOULD.** A change made in one window reaches every other open window.
  - *Check (test):* an FX test changes a setting in one window and finds it applied in the other.
  - *Reference:* Editora: every window holds the same [`config/SharedConfig.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/SharedConfig.java), which announces each change
    (`onSettingsChanged`); [`CrossWindowSettingsFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/CrossWindowSettingsFxTest.java).

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
  - *Reference:* Editora's `view.toggle…` and picker commands ([`ui/WindowCommandRegistrar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WindowCommandRegistrar.java)). Editora does not
    have one for every setting yet: `terminalNotifications`, for one, is only a Settings row.

## Config folder and schema

- **SET-07 · MUST.** Config lives in `~/.<app>`, unless `<APP>_CONFIG_DIR` or a command-line flag
  ([CLI-02](../command-line/#cli-02)) names another folder.
  - *Check (code):* one resolver picks the folder, in the order `--config-dir`, the environment variable, the
    default, and the default is `<user.home>/.<app>` on Windows, macOS and Linux alike: the resolver doesn't branch
    on the OS, or a test resolves the default as each OS and finds the same folder.
  - *Reference:* Editora [`App`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java) and [`ConfigManager.configDirFor`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigManager.java), [`ConfigDirTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigDirTest.java). Mirada's resolver
    ([`settings/Settings.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/settings/Settings.java), `defaultFile` and `folder`) has the order but a default that depends on the OS:
    `~/Library/Application Support/Mirada` on macOS, `%APPDATA%\Mirada` on Windows, `~/.mirada` elsewhere.
- **SET-08 · SHOULD.** Preferences live in one file and session state (where the window was, what was open) in
  another, and every other store has a file of its own. Editora's are `settings.json` and `workspace-state.json`.
  - *Check (code):* preferences and session state are separate files: the file that holds what the user chose in
    Settings holds no window geometry and no list of open items.
  - *Reference:* Editora [`config/ConfigManager.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigManager.java) (`SETTINGS_FILE_NAME`, `WORKSPACE_FILE_NAME`), [`config/WorkspaceState.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/WorkspaceState.java);
    Termina [`config/Settings.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/config/Settings.java), which writes the same two names and sorts each key into one of them (`isStateKey`).
    Torrenta and Mirada keep the window's bounds in their preferences file (`ui.window.bounds` and `window.bounds`
    in `settings.properties`), and the app template keeps them in `settings.json`
    ([`config/Settings.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/Settings.java), `window`).
- **SET-09 · MUST.** Every versioned file has a schema version, and each version has a `v → v+1` migration
  step. A purely additive field uses an identity step.
  - *Check (code):* each store declares `SCHEMA_VERSION`, and the migrations have one step per version.
  - *Reference:* Editora [`config/migration/ConfigMigrations.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/migration/ConfigMigrations.java), [`ConfigSchema.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/migration/ConfigSchema.java), [`ConfigMigrationsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/migration/ConfigMigrationsTest.java).
- **SET-10 · MUST.** A file newer than the running build is backed up to `<name>.v<n>.bak` and defaults load.
  - *Why:* an older build never clobbers a newer config.
  - *Check (test):* a test loads a too-new `settings.json` and finds the backup and the defaults.
  - *Reference:* Editora [`ConfigVersioningTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigVersioningTest.java) (`tooNewSettingsAreBackedUpAndDefaultsLoaded`).
- **SET-11 · MUST.** Never trust a config file. Clamp every value to its valid range when it is **read**, not only
  when it is written; an unknown value falls back to its default; a file that cannot be decoded is kept as a backup
  (Editora names it `<name>.corrupt.bak`) and defaults load. A bad file never stops the app from starting.
  - *Why:* config is plain JSON (or properties) and people edit it by hand. A hand-edited two-million-line
    scrollback must not exhaust memory at the next launch (Termina).
  - *Check (test):* a test loads out-of-range numbers and an unparseable file, including one that makes the parser
    throw something other than an `IOException` (a malformed `\uXXXX` escape in a `.properties` file).
  - *Reference:* Editora [`config/migration/ConfigMigrations.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/migration/ConfigMigrations.java) (`keepCorrupt`), [`ConfigLoadProblemsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigLoadProblemsTest.java)
    (`outOfRangeNumbersAreClampedOnLoad`, `anUnparseableFileIsReportedWithItsBackup`); Termina
    [`config/Settings.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/config/Settings.java), [`SettingsTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/config/SettingsTest.java) (`aMalformedEscapeNoLongerStopsTheAppStarting`); Mirada
    [`settings/ConfigFile.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/settings/ConfigFile.java), which moves a file that will not decode to `<name>.corrupt.bak`
    ([`ConfigFileTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/settings/ConfigFileTest.java), `aFileThatWillNotDecodeIsKeptAsABackup`). Torrenta, Modula and nux keep no backup, and in
    Torrenta and nux a malformed escape stops the app from starting.
- **SET-22 · MUST.** A config file is written whole or not at all: the app writes a temporary file beside it and
  moves that into place, so a crash mid-write never leaves a half-written file.
  - *Why:* without it, a crash or a full disk in the middle of a save leaves a file that will not decode, and the
    corrupt-file path of [SET-11](#set-11), a backup and then defaults, is what the person gets for it.
  - *Check (code):* every write of a config file as a whole (a store's save, an import) goes to a temporary file in
    the same folder and ends in a move onto the target (`Files.move` with `ATOMIC_MOVE`, and a plain replace only
    where the file system has no atomic move). A log or a ledger the app appends to is not such a write.
  - *Reference:* Editora [`config/ConfigWriter.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigWriter.java) (`writeAtomicOrThrow`: a temporary file of its own beside the target,
    forced to disk, then moved; [`ConfigWriterTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigWriterTest.java), `atomicReplacementFailuresKeepThePreviousConfiguration`). Every other
    app's settings store does it too: Torrenta [`store/Settings.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/store/Settings.java) (`save`), Termina [`config/Settings.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/config/Settings.java) (`writeOne`,
    `moveIntoPlace`), Mirada [`settings/Settings.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/settings/Settings.java) (`write`), Modula [`config/ConfigStore.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/config/ConfigStore.java) (`writeAtomically`), nux
    [`config/ConfigStore.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/config/ConfigStore.java) (`save`) and the app template's [`config/ConfigStore.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/ConfigStore.java) (`writePending`). The template's
    [`config/ConfigImport.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/ConfigImport.java) (`apply`) doesn't yet: an import writes `settings.json` and the zip's other files in place.
- **SET-12 · MUST.** Export configuration writes a timestamped `.zip` of the config folder; Import restores from
  one.
  - *Check (test):* tests over the zip's name and contents, and an import that replaces only the ticked parts.
  - *Reference:* Editora [`config/ConfigExporter.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigExporter.java), [`config/ConfigImport.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigImport.java), [`ConfigExporterTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigExporterTest.java),
    [`ConfigImportTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigImportTest.java).

## Secrets stay out of files

- **SET-13 · MUST.** No secret goes in a config file. API keys and tokens go to the operating system's keychain:
  macOS Keychain, Windows Credential Manager, the Secret Service on Linux. Calls may block on a prompt, so they run
  off the FX thread. Where no keychain answers, as in a Linux session with no Secret Service, the secret is kept in
  memory for the session only and its row in Settings says so: it is never written to a file instead.
  - *Check (code):* no key or token field in the settings model; reads and writes go through the secret store, and
    the store's fallback, for when no keychain answers, holds the secret in memory and writes no file.
  - *Reference:* Editora [`secrets/SecretStore.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/secrets/SecretStore.java), [`config/ApiKeyVault.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ApiKeyVault.java). Editora doesn't yet: [`Settings`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/Settings.java)
    keeps the AI keys as a fallback for when no keychain answers, and saving a key from Settings writes the keychain
    on the FX thread. Its Settings row does say which of the two holds the key. Torrenta uses no keychain: its proxy password, Torznab
    key and remote-profile passwords are in plain text.
- **SET-14 · MUST.** A credential the app can ask for again lives in memory for the session only and is never
  written. Work that needs it waits until the user has signed in this session; do not "fix" that by storing the
  password.
  - *Check (code):* the credential is a field of a runtime object, absent from every config class.
  - *Reference:* nux's UPS login ([`app/CommandRunner.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/app/CommandRunner.java)).
- **SET-15 · MUST.** An app with Settings Sync refuses a repository URL with a password or token in it, with the fix
  ([Settings Sync](../templates/settings-sync/)). A problem report's redaction is [DIAG-06](../diagnostics/#diag-06).
  - *Check (by hand):* paste `https://user:token@host/repo.git` as the sync repository.
  - *Reference:* Editora [`ui/SettingsSyncPage.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSyncPage.java) (`settings.sync.repo.credentials`), [`sync/SyncEngine.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncEngine.java)
    (`hasCredentials`, checked again at sync time).
- **SET-16 · MUST.** An option that weakens security has no UI: it exists only as a key in the config file, so
  nobody turns it on by clicking.
  - *Check (code):* no Settings row or command writes such a key.
  - *Reference:* nux's trust-all TLS (`tlsTrustAll` in [`config/Config.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/config/Config.java)). Editora doesn't yet: *Require
    registry signature* for plugins is a Settings checkbox and the `plugins.toggleRequireSignature` command.

## Settings Sync (Git / GitHub)

**Applies to:** an app with user data worth carrying between computers
([SYNC-01](../templates/settings-sync/#sync-01)).

Such an app offers sync, on its own Settings page, into a Git repository the user owns
([SYNC-02](../templates/settings-sync/#sync-02)). The rules of this section are how it behaves.

- **SET-18 · SHOULD.** Setup is by pasting a repo URL, or **Create on GitHub** through the `gh` CLI. The account
  that can read the repo is pinned per clone, so machines with two GitHub accounts work.
  - *Check (test):* a test remembers the first account that can read the repository and uses it without asking
    again.
  - *Reference:* Editora [`sync/SyncAccount.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncAccount.java), [`SyncAccountTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/sync/SyncAccountTest.java), [`ui/SettingsSyncPage.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSyncPage.java).
- **SET-19 · SHOULD.** Sync runs automatically (on change and at start) and on demand. Machine-local keys (window
  size, paths) never sync.
  - *Check (code):* one pure class decides which keys or files travel, and machine-local ones are not among them.
  - *Reference:* Editora [`ui/SettingsSync.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSync.java) (after startup, after a local change, on an interval, and
    `sync.now`), [`sync/SyncCategory.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncCategory.java); Torrenta [`sync/SyncKeys.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/sync/SyncKeys.java).
- **SET-20 · SHOULD.** On a same-entry conflict *this machine wins*, and a backup is taken before any sync that
  replaces local files.
  - *Check (test):* a merge test where both sides changed one entry keeps this machine's.
  - *Reference:* Editora [`sync/SyncMerge.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncMerge.java), [`SyncMergeTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/sync/SyncMergeTest.java).
- **SET-21 · SHOULD.** Sync status shows as a pill in Settings and as echo messages; failures go to the Message Log.
  - *Check (by hand):* point Sync at a repository that does not exist and read the pill and the log.
  - *Reference:* Editora [`ui/SettingsSyncPage.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSyncPage.java), [`SyncStatus`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SyncStatus.java).

![Editora's Sync settings page](../../assets/shots/editora-settings-sync.png "Editora's Sync page: repository, branch, Create on GitHub… and what to sync.")
![Torrenta's Sync settings page](../../assets/shots/torrenta-settings-sync.png "Torrenta's Sync page.")
![Termina's Sync settings page](../../assets/shots/termina-settings-sync.png "Termina's Sync page.")
