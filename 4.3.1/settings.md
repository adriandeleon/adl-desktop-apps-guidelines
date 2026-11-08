# Settings

> The Settings window with search, live apply, versioned config and Git/GitHub sync.

Pauta 4.3.1 (2026-11-08). The page with its screenshots and mockups: https://pauta-project.dev/4.3.1/settings/.
Every rule of the edition: https://pauta-project.dev/4.3.1/llms-full.txt.

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
  values are marked and never committed.
  - *Check (code):* no Save or Apply button in the window; text fields commit through `commitOnEnterOrBlur`.
  - *Reference:* Editora [`SettingsWindow.commitOnEnterOrBlur`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java); [`SettingsSyncPage`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSyncPage.java)'s branch field marks an invalid
    branch.
- **SET-05 · SHOULD.** A change made in one window reaches every other open window.
  - *Check (test):* an FX test changes a setting in one window and finds it applied in the other.
  - *Reference:* Editora: every window holds the same [`config/SharedConfig.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/SharedConfig.java), which announces each change
    (`onSettingsChanged`); [`CrossWindowSettingsFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/CrossWindowSettingsFxTest.java).

*Screenshot: Typing sync in Settings: pages without a match gray out and the best page opens.*

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
  ([CLI-02](https://pauta-project.dev/4.3.1/command-line/#cli-02)) names another folder.
  - *Check (code):* one resolver picks the folder, in the order `--config-dir`, the environment variable, the
    default.
  - *Reference:* Editora [`App`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java) and [`ConfigManager.configDirFor`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigManager.java), [`ConfigDirTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigDirTest.java).
- **SET-08 · SHOULD.** `settings.json` holds preferences, `workspace-state.json` session state, and other stores
  their own JSON files.
  - *Check (code):* the config folder's file names are constants in the config package.
  - *Reference:* Editora [`config/ConfigManager.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigManager.java), [`config/WorkspaceState.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/WorkspaceState.java).
- **SET-09 · MUST.** Every versioned file has a `SCHEMA_VERSION` and a `v → v+1` migration step. A purely additive
  field uses an identity step.
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
    [`config/Settings.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/config/Settings.java), [`SettingsTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/config/SettingsTest.java) (`aMalformedEscapeNoLongerStopsTheAppStarting`). Torrenta, Modula, Mirada
    and nux keep no backup, and in Torrenta and nux a malformed escape stops the app from starting.
- **SET-12 · MUST.** Export configuration writes a timestamped `.zip` of the config folder; Import restores from
  one.
  - *Check (test):* tests over the zip's name and contents, and an import that replaces only the ticked parts.
  - *Reference:* Editora [`config/ConfigExporter.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigExporter.java), [`config/ConfigImport.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigImport.java), [`ConfigExporterTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigExporterTest.java),
    [`ConfigImportTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigImportTest.java).

## Secrets stay out of files

- **SET-13 · MUST.** No secret goes in a config file. API keys and tokens go to the operating system's keychain:
  macOS Keychain, Windows Credential Manager, the Secret Service on Linux. Calls may block on a prompt, so they run
  off the FX thread.
  - *Check (code):* no key or token field in the settings model; reads and writes go through the secret store.
  - *Reference:* Editora [`secrets/SecretStore.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/secrets/SecretStore.java), [`config/ApiKeyVault.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ApiKeyVault.java). Editora doesn't yet: [`Settings`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/Settings.java)
    keeps the AI keys as a fallback for when no keychain answers, and saving a key from Settings writes the keychain
    on the FX thread. Torrenta keeps its proxy password, Torznab key and remote-profile passwords in plain text.
- **SET-14 · MUST.** A credential the app can ask for again lives in memory for the session only and is never
  written. Work that needs it waits until the user has signed in this session; do not "fix" that by storing the
  password.
  - *Check (code):* the credential is a field of a runtime object, absent from every config class.
  - *Reference:* nux's UPS login ([`app/CommandRunner.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/app/CommandRunner.java)).
- **SET-15 · MUST.** A secret in the wrong place is refused. A repository URL with a password or token in it is
  refused, with the fix ([Settings Sync](https://pauta-project.dev/4.3.1/templates/settings-sync/)); a problem report redacts tokens, credentials,
  e-mail addresses, user names and home paths before anyone sees it ([Diagnostics](https://pauta-project.dev/4.3.1/diagnostics/)).
  - *Check (by hand):* paste `https://user:token@host/repo.git` as the sync repository.
  - *Reference:* Editora [`ui/SettingsSyncPage.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSyncPage.java) (`settings.sync.repo.credentials`), [`sync/SyncEngine.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncEngine.java)
    (`hasCredentials`, checked again at sync time), [`report/Redactor.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/report/Redactor.java).
- **SET-16 · MUST.** An option that weakens security has no UI: it exists only as a key in the config file, so
  nobody turns it on by clicking.
  - *Check (code):* no Settings row or command writes such a key.
  - *Reference:* nux's trust-all TLS (`tlsTrustAll` in [`config/Config.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/config/Config.java)). Editora doesn't yet: *Require
    registry signature* for plugins is a Settings checkbox and the `plugins.toggleRequireSignature` command.

## Settings Sync (Git / GitHub)

An app with user data worth carrying between computers offers sync, on its own Settings page
([SYNC-01](https://pauta-project.dev/4.3.1/templates/settings-sync/#sync-01)), into a Git repository the user owns
([SYNC-02](https://pauta-project.dev/4.3.1/templates/settings-sync/#sync-02)). The rules below are how it behaves.

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

*Screenshot: Editora's Sync page: repository, branch, Create on GitHub… and what to sync.*
*Screenshot: Torrenta's Sync page.*
*Screenshot: Termina's Sync page.*
