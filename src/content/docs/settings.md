---
title: "Settings"
description: "The Settings window with search, live apply, versioned config and Git/GitHub sync."
---

## The Settings window

- **SET-01 · MUST.** The Settings window opens from a palette command, bound to `Ctrl+,` (`Cmd+,` on macOS) in the
  CUA keymap. An app with one key table and no CUA keymap, which is a terminal app's own keymap
  ([KBD-09](../keyboard/#kbd-09)) or the built-in table of an app that ships no keymap files, binds the chord in
  that table.
  - *Check (code):* a registered command opens Settings, and the CUA keymap binds it to `Ctrl+,` (`C-,` in
    Editora's `cua.json`) and, on macOS, to `Cmd+,` (`Cmd-,` in `cua.mac.json`). In an app with one key table (a
    terminal app's `keymap.json` and `keymap.mac.json`, or a table in code), that table binds the two.
  - *Reference:* Editora `view.settings`, bound in [`keymaps/cua.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/cua.json) and [`cua.mac.json`](https://github.com/adriandeleon/Editora/blob/master/src/main/resources/com/editora/keymaps/cua.mac.json) (and in the VS Code and
    Sublime keymaps; IntelliJ's uses `C-M-s`). Termina, a terminal app, binds `settings` to `Shortcut+Comma` in its one
    keymap ([`keymaps/keymap.json`](https://github.com/adriandeleon/Termina/blob/master/src/main/resources/com/termina/keymaps/keymap.json) and [`keymap.mac.json`](https://github.com/adriandeleon/Termina/blob/master/src/main/resources/com/termina/keymaps/keymap.mac.json)). Torrenta and nux, which ship no keymap files, bind the same
    chord in code ([`ui/Chords.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/Chords.java); nux's [`App.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/App.java), `Shortcut+Comma`). Modula doesn't yet: its Settings command has no chord
    ([`ui/RadioPane.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/RadioPane.java), `commands`).
- **SET-02 · MUST.** The Settings window has a sidebar of pages with icons on the left, the open page on the right,
  and a search field on top.
  - *Check (by hand):* open Settings: the pages are listed in a sidebar on the left, each with an icon, the open
    page fills the right, and the search field sits above both.
  - *Reference:* Editora [`ui/SettingsWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java), [`ui/SettingsSidebarNav.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSidebarNav.java), [`ui/SettingsIcons.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsIcons.java).
- **SET-03 · MUST.** The Settings window's search finds a row by its title, description, visible text, its card or
  section heading, its page name and English keywords. Title hits rank above description hits; whole words above
  word starts. The page with the best match opens, and every non-matching row, heading and card is hidden.
  - *Check (code):* the Settings search matches a query against each row's title, description, visible text, card
    or section heading, page name and keywords; its score puts a title hit above a description hit and a whole word
    above a word start; and it opens the page of the best match and hides every row, heading and card that does
    not match. A unit test that ranks a title hit above a keyword hit and a whole word above part of one is the
    surest evidence.
  - *Reference:* Editora [`ui/SettingsSearch.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSearch.java), [`SettingsSearchTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/SettingsSearchTest.java)
    (`aTitleHitOutranksAKeywordHitAndAWholeWordOutranksPartOfOne`). Torrenta's search doesn't rank a whole word
    above part of one yet: its score looks only at where the text was found, title, description or keywords
    ([`ui/SettingsWindow.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/SettingsWindow.java), `rank`).
- **SET-04 · MUST.** Settings apply live, with no Save button. Text fields commit on Enter or focus loss; invalid
  values are marked and never committed. A setting that cannot apply until a restart says so on its own row.
  - *Check (code):* the Settings window has no Save or Apply button, and each control writes its setting and
    applies it when it changes; a text field commits its value on Enter and when it loses focus (Editora's
    `commitOnEnterOrBlur`), and a value that fails validation is marked and not written; and every setting the app
    reads only at startup (the language, the window's style) names the restart in its own row's text.
  - *Reference:* Editora [`SettingsWindow.commitOnEnterOrBlur`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java); [`SettingsSyncPage`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSyncPage.java)'s branch field marks an invalid
    branch. Rows that wait for a restart say so: Editora's interface language ("Applies after restarting Editora.",
    `settings.uiLanguage.note`), and Torrenta's tray icon, which on Windows and macOS "applies after restarting
    Torrenta" (`settings.general.trayIcon.desc`, in [`ui/SettingsWindow.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/SettingsWindow.java)). nux doesn't yet: its Settings
    window writes nothing until its Save button is pressed, and has a Cancel beside it
    ([`ui/SettingsWindow.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/SettingsWindow.java)).
- **SET-05 · SHOULD.** A setting changed in one window reaches every other open window of the app.
  - *Check (code):* every window reads its settings from one model the windows share, and a change to that model
    is announced to each open window, which applies it. An FX test that changes a setting in one window and finds
    it applied in the other is the surest evidence.
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

- **SET-06 · MUST.** Every setting the Settings window shows has a palette command that flips the field or prompts
  for its value. A key that [SET-16](#set-16) keeps out of the UI has no row, and takes no command.
  - *Check (code):* list the settings the Settings window's rows change and the commands the palette lists; each
    setting has a command that flips it or prompts for its value. A row that only shows something, or runs an
    action, has no setting to give a command to. A test that fails on a row with no command is the surest evidence.
  - *Reference:* Termina [`ui/SettingCommands.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/SettingCommands.java), a command for each setting or the reason a row needs none
    ([`SettingCommandsTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/ui/SettingCommandsTest.java), `everySettingsRowHasACommandOrSaysWhyNot`), and Mirada [`ui/SettingsPages.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/SettingsPages.java), where
    every row names its command ([`SettingsPagesTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/ui/SettingsPagesTest.java), `everyPageHasRowsAndEveryRowAPaletteCommand`). Editora has its
    `view.toggle…` and picker commands ([`ui/WindowCommandRegistrar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WindowCommandRegistrar.java)) but not one for every setting yet:
    `terminalNotifications`, for one, is only a Settings row. Modula's palette changes one of its settings, the
    daylight theme ([`ui/RadioPane.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/RadioPane.java), `commands`), and nux's three: the tray metric, the notification rule and
    start at login ([`App.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/App.java), `registerCommands`).

## Config folder and schema

- **SET-07 · MUST.** Config lives in `~/.<app>`, a folder in the user's home on Windows, macOS and Linux alike,
  unless `<APP>_CONFIG_DIR` or a command-line flag ([CLI-02](../command-line/#cli-02)) names another folder. A flag
  wins over the variable, since what is typed on the command line is the more specific instruction: `--config-dir`
  first, then `--dev`, then the variable.
  - *Check (code):* one resolver picks the folder from `--config-dir`, `--dev`, the environment variable and the
    default, with `--config-dir` first, `--dev` next, the variable after it and the default last, whichever of the
    two flags is typed first; and the default is `<user.home>/.<app>` on Windows, macOS and Linux alike: the
    resolver doesn't branch on the OS, or a test resolves the default as each OS and finds the same folder.
  - *Reference:* the app template's [`config/ConfigDir.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/ConfigDir.java) (`resolve`: `--config-dir`, `--dev`, the variable, then
    `~/.exampleapp`, with no branch on the OS; [`ConfigDirTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/config/ConfigDirTest.java), `configDirThenDevThenEnvironmentThenPropertyThenTheDefault`). No app
    has all of it yet. Editora ([`App`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java) and [`ConfigManager.configDirFor`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigManager.java), [`ConfigDirTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigDirTest.java)),
    and Termina ([`config/Settings.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/config/Settings.java), `defaultFile`) put
    `--config-dir` first and have one default for every OS, but the variable wins over `--dev`, which only changes
    the default. In Mirada either flag wins over the variable, but the two flags set one value and the one typed
    last wins, so `--config-dir X --dev` gives `~/.mirada-dev` ([`Launch.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/Launch.java), `parse`); and its default depends on
    the OS ([`settings/Settings.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/settings/Settings.java), `defaultFile` and `folder`): `~/Library/Application Support/Mirada` on
    macOS, `%APPDATA%\Mirada` on Windows, `~/.mirada` elsewhere. Torrenta has `--config-dir`, the variable and the
    default in that order and no `--dev` ([`store/ConfigDir.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/store/ConfigDir.java)). Modula and nux read a fixed `~/.modula` and
    `~/.nux`, with no flag and no variable.
- **SET-08 · SHOULD.** Preferences live in one file and session state (where the window was, what was open) in
  another, and every other store has a file of its own. Editora's are `settings.json` and `workspace-state.json`.
  - *Check (code):* preferences and session state are separate files: the file that holds what the user chose in
    Settings holds no window geometry and no list of open items.
  - *Reference:* Editora [`config/ConfigManager.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigManager.java) (`SETTINGS_FILE_NAME`, `WORKSPACE_FILE_NAME`), [`config/WorkspaceState.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/WorkspaceState.java);
    Termina [`config/Settings.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/config/Settings.java), which writes the same two names and sorts each key into one of them (`isStateKey`).
    Torrenta and Mirada keep the window's bounds in their preferences file (`ui.window.bounds` and `window.bounds`
    in `settings.properties`). The app template meets it: the window and the open documents go to
    `session.json`, beside `settings.json` and never in it (`SESSION_FILE` in [`config/ConfigStore.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/ConfigStore.java); its
    [`config/Migrations.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/Migrations.java) moves them out of an older `settings.json`).
- **SET-09 · MUST.** Every config file the app writes and reads back carries a schema version, and each version has
  a `v → v+1` migration step. A purely additive field uses an identity step. Which files are config files is in
  [SET-22](#set-22); a plain list with one item to a line, such as a word list, has no shape to version and is
  exempt.
  - *Check (code):* the store of every config file ([SET-22](#set-22) says which files those are) declares a schema
    version (`SCHEMA_VERSION` in Editora), writes it into the file and reads it back, and the migrations hold one
    step for every version below the current one, an identity step where the version only added a field.
  - *Reference:* Editora [`config/migration/ConfigMigrations.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/migration/ConfigMigrations.java), [`ConfigSchema.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/migration/ConfigSchema.java) (one entry for each
    store), [`ConfigMigrationsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/migration/ConfigMigrationsTest.java); its `dictionary.txt`, one word to a line, is the
    kind of list the rule exempts. Termina ([`config/ConfigJson.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/config/ConfigJson.java), for `settings.json` and
    `workspace-state.json`) and Mirada ([`settings/Migrations.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/settings/Migrations.java), for `settings.properties` and
    `bookmarks.properties`) do it too, and so does the app template for `settings.json`
    ([`config/Migrations.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/Migrations.java)) and for `session.json` (`SESSION_SCHEMA` in
    [`config/ConfigStore.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/ConfigStore.java)), Settings Sync's `base.json` and `keybindings.json`
    ([`sync/SyncData.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/sync/SyncData.java), `SCHEMA_VERSION` and `migrate`) and the account it pins (`account.json`,
    [`sync/AccountPin.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/sync/AccountPin.java)). Nor does Termina for the color schemes it
    imports: each is a file Termina writes whole, in a format of its own, and reads back at start
    (`themes/<name>.properties`, [`theme/ThemeFile.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/theme/ThemeFile.java)), so a config file by [SET-22](#set-22), and it carries no
    version. Torrenta's files ([`store/Settings.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/store/Settings.java) and
    the other stores beside it) and Modula's ([`config/ConfigStore.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/config/ConfigStore.java): `settings.properties`, `presets.txt`,
    `schedules.txt`, each line a record with fields) carry no version, and nux writes `schema=1` into its file and never reads it
    ([`config/ConfigStore.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/config/ConfigStore.java), `format` and `parse`).
- **SET-10 · MUST.** A config file whose schema version ([SET-09](#set-09)) is higher than the running build's is
  kept as a backup beside it (Editora names it `<name>.v<n>.bak`) and defaults load.
  - *Why:* an older build never clobbers a newer config.
  - *Check (code):* the load of each config file compares the file's schema version with the build's, and for a
    higher one keeps the file as a backup beside it and loads the defaults. A test that loads such a file and finds
    the backup beside it and the defaults loaded is the surest evidence.
  - *Reference:* Editora [`ConfigVersioningTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigVersioningTest.java) (`tooNewSettingsAreBackedUpAndDefaultsLoaded`). Termina
    ([`config/Settings.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/config/Settings.java)), Mirada ([`settings/ConfigFile.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/settings/ConfigFile.java), `newerBackupOf`) and the app template
    ([`config/ConfigStore.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/ConfigStore.java)) do the same, under the same name. Torrenta, Modula and nux read no version
    ([SET-09](#set-09)), so they cannot tell a newer file, and nor can Termina for an imported color scheme, which
    carries none.
- **SET-11 · MUST.** Never trust a config file. Clamp every value to its valid range when it is **read**, not only
  when it is written; an unknown value falls back to its default; a file that cannot be decoded is kept as a backup
  (Editora names it `<name>.corrupt.bak`) and defaults load. A bad file never stops the app from starting.
  - *Why:* config is plain JSON (or properties) and people edit it by hand. A hand-edited two-million-line
    scrollback must not exhaust memory at the next launch (Termina).
  - *Check (code):* the load clamps each value to its range as it reads it and puts the default in place of an
    unknown one; a file the parser cannot decode is kept as a backup and the defaults load; and the load catches
    what the parser throws besides an `IOException` (a malformed `\uXXXX` escape in a `.properties` file throws an
    `IllegalArgumentException`), so no file stops the start. A test that loads out-of-range numbers and an
    unparseable file of that kind is the surest evidence.
  - *Reference:* Editora [`config/migration/ConfigMigrations.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/migration/ConfigMigrations.java) (`keepCorrupt`), [`ConfigLoadProblemsTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigLoadProblemsTest.java)
    (`outOfRangeNumbersAreClampedOnLoad`, `anUnparseableFileIsReportedWithItsBackup`); Termina
    [`config/Settings.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/config/Settings.java), [`SettingsTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/config/SettingsTest.java) (`aMalformedEscapeNoLongerStopsTheAppStarting`); Mirada
    [`settings/ConfigFile.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/settings/ConfigFile.java), which moves a file that will not decode to `<name>.corrupt.bak`
    ([`ConfigFileTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/settings/ConfigFileTest.java), `aFileThatWillNotDecodeIsKeptAsABackup`). Torrenta, Modula and nux keep no backup, and in
    Torrenta and nux a malformed escape stops the app from starting.
- **SET-22 · MUST.** A config file is written whole or not at all: the app writes a temporary file beside it and
  moves that into place, so a crash mid-write never leaves a half-written file. A config file is any file the app
  writes as a whole and reads back as its state: the settings, the session state, a store of bookmarks or presets,
  what a sync engine keeps beside its clone. A file the app only appends to (a log, a ledger, a word list) is not
  one, and neither is a file in the working tree of a sync repository's clone, which Git holds a committed copy of
  and the next sync writes again. Nor is a file the app writes for one run and deletes at exit, such as one that
  tells another process where this run listens.
  - *Why:* without it, a crash or a full disk in the middle of a save leaves a file that will not decode, and the
    corrupt-file path of [SET-11](#set-11), a backup and then defaults, is what the person gets for it.
  - *Check (code):* every write of a config file as a whole (a store's save, an import, a sync engine's own state
    outside its clone) goes to a temporary file in the same folder and ends in a move onto the target (`Files.move`).
    `ATOMIC_MOVE` is the surest form; a move that only replaces the target passes too, since the statement asks for
    the temporary file and the move. An append to a log, a ledger or a list is not such a write, and neither is a
    write into a sync clone's working tree, nor the write of a file the app deletes when it exits.
  - *Reference:* Editora [`config/ConfigWriter.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigWriter.java) (`writeAtomicOrThrow`: a temporary file of its own beside the target,
    forced to disk, then moved; [`ConfigWriterTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigWriterTest.java), `atomicReplacementFailuresKeepThePreviousConfiguration`), which
    its settings and stores go through. Editora's `mcp-endpoint.json` is not a config file: its MCP server writes it
    for the run when it starts and deletes it when it stops, as the last window closes
    ([`mcp/McpServer.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/mcp/McpServer.java), `writeEndpointFile` and `stop`), and one that a crash left behind is deleted at the next
    launch (`reapStaleEndpoint`). Every other
    app's settings store does it too: Torrenta [`store/Settings.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/store/Settings.java) (`save`), Termina [`config/Settings.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/config/Settings.java) (`writeOne`,
    `moveIntoPlace`), Mirada [`settings/Settings.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/settings/Settings.java) (`write`), Modula [`config/ConfigStore.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/config/ConfigStore.java) (`writeAtomically`), nux
    [`config/ConfigStore.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/config/ConfigStore.java) (`save`) and the app template's [`config/ConfigStore.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/ConfigStore.java) (`writePending`, for `settings.json` and
    `session.json`). The template's other whole-file writes go the same way, through [`config/ConfigFiles.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/ConfigFiles.java)
    (`write`): an import ([`config/ConfigImport.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/config/ConfigImport.java), `apply`), Settings Sync's `base.json`, the merge base it
    keeps beside the clone ([`sync/SyncData.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/sync/SyncData.java), `write`), and the account it pins there
    ([`sync/AccountPin.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/sync/AccountPin.java)). Termina's [`sync/SyncEngine.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/sync/SyncEngine.java) and Torrenta's [`sync/SyncEngine.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/sync/SyncEngine.java) write in place only inside
    the clone, and keep their merge base as a Git ref (`refs/termina/base`, `refs/torrenta/base`).
- **SET-12 · MUST.** Export configuration writes a timestamped `.zip` of the config folder; Import restores from
  one.
  - *Check (code):* the export command writes a `.zip` that carries the time of the export in its name and the
    config folder's files among its entries, and the import command reads such a zip and restores its files. A test
    of each is the surest evidence.
  - *Reference:* Editora [`config/ConfigExporter.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigExporter.java), [`config/ConfigImport.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConfigImport.java), [`ConfigExporterTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigExporterTest.java)
    (`zipNameDropsLeadingDotAndEmbedsVersionUserTime`, `exportZipsAllFilesWithRelativeEntries`),
    [`ConfigImportTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/config/ConfigImportTest.java) (`theTickedPartsReplaceTheirsHereAndNothingElseChanges`: Editora's import restores the parts the
    user ticks).

## Secrets stay out of files

- **SET-13 · MUST.** An app that stores a secret the user gave it (a password, a token, a key) puts none in a config
  file. Each goes to the operating system's keychain: macOS Keychain, Windows Credential Manager, the Secret Service
  on Linux. Calls may block on a prompt, so they run off the FX thread. Where no keychain answers, as in a Linux
  session with no Secret Service, the secret is kept in memory for the session only and its row in Settings says so:
  it is never written to a file instead. A run with no window says so on standard error. A key or token the app
  generates itself is not such a secret: it may live in a file only the owner can read, outside the settings files
  (Torrenta's `keys/<name>.key`). Whether a credential is kept from one session to the next is the app's to decide:
  one it keeps is this rule's, and one it only holds for the session, and asks for again in the next, is
  [SET-14](#set-14)'s.
  - *Check (code):* the rule covers an app that keeps a password, an API key or a token the user gave it from one
    session to the next; an app that keeps none is outside it. In an app it covers, no such secret is a field of
    the settings model or is written to any other file; reads and writes go through the secret store, and
    every caller reaches it from a background thread, never from a handler on the FX thread; the store's fallback,
    for when no keychain answers, holds the secret in memory and writes no file, and the secret's row in Settings
    says when it is kept for the session only, as a line on standard error does in a run with no window. A key or
    token the app generates is not judged as such a secret where it is in a file of its own, outside the settings
    files, that the app makes readable by its owner alone (owner-only permissions, where the file system has them).
  - *Reference:* Editora [`secrets/SecretStore.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/secrets/SecretStore.java), [`config/ApiKeyVault.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ApiKeyVault.java). Editora doesn't yet: [`Settings`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/Settings.java)
    keeps the AI keys as a fallback for when no keychain answers, and saving a key from Settings writes the keychain
    on the FX thread. Its Settings row does say which of the two holds the key. The bearer token Editora's MCP
    server generates is in a file of its own for the run, `mcp-endpoint.json`, made owner-only where the file system
    has POSIX permissions and deleted when the server stops ([`mcp/McpServer.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/mcp/McpServer.java), `writeEndpointFile`), which
    the rule allows. Torrenta uses no keychain: its proxy
    password and the password of its Remote access certificate file (`proxy.password` and `webapi.httpsPassword` in
    `settings.properties`, [`store/Settings.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/store/Settings.java)), its Torznab keys (`search-providers.json`) and its remote-profile
    passwords (`profiles.json`) are in plain text in its config folder; of its Remote access password it keeps only
    a hash. The keys Torrenta generates for the updatable torrents it publishes are where the rule allows: a file
    each, outside the settings files and owner-only where the file system has permissions (`keys/<name>.key`,
    [`store/KeyStore.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/store/KeyStore.java)). Termina, Mirada and Modula store no secret, so the rule does
    not cover them: Termina's sync signs in through the user's own Git and `gh`
    ([`sync/SyncAccount.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/sync/SyncAccount.java)), and the other two ask for none. nux's one credential is for the session only,
    and so are the SSH passwords and passphrases Editora asks for ([SET-14](#set-14)).
- **SET-14 · MUST.** An app that asks for a credential it does not keep from one session to the next holds it in
  memory for the session only and never writes it. Whether to keep a credential is the app's to decide: one it
  keeps is [SET-13](#set-13)'s, in the keychain and never in a config file, and this rule covers only one it does
  not keep. Work that needs such a credential waits until the user has signed in this session; do not "fix" that
  by writing the password to a file.
  - *Check (code):* for each credential the app asks the user for (a login, a password, a passphrase), find whether
    the app keeps it for the next session. One it keeps is [SET-13](#set-13)'s and is not judged here. One it does
    not keep is a field of a runtime object, absent from every config class, and no code writes it to a file. An
    app that asks for no credential, or keeps every one it asks for, is outside the rule.
  - *Reference:* nux's UPS login: the user name and password it asks for are two fields of a runtime object
    ([`app/CommandRunner.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/app/CommandRunner.java)), in no config class. Editora asks for an SSH password or a key's passphrase while a
    login runs ([`vfs/LoginPrompt.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/vfs/LoginPrompt.java)) and stores neither: a saved connection holds the host, the user and the key's
    path ([`config/ConnectionStore.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/ConnectionStore.java)). What an app keeps is [SET-13](#set-13)'s alone: Editora's AI keys, and
    Torrenta's proxy, Torznab and remote-profile secrets. Termina, Mirada and Modula ask for no credential.
- **SET-15 · MUST.** An app with Settings Sync refuses a repository URL with a password or token in it, and says
  what to use instead: a Git credential helper or an SSH URL ([Settings Sync](../templates/settings-sync/)). A
  problem report's redaction is [DIAG-11](../diagnostics/#diag-11).
  - *Check (by hand):* paste `https://user:token@host/repo.git` as the sync repository: the page refuses it, with
    a message that says what to use instead.
  - *Reference:* Editora [`ui/SettingsSyncPage.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSyncPage.java) (`settings.sync.repo.credentials`), which asks
    [`sync/SyncEngine.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncEngine.java) (`hasCredentials`) as the URL is typed, when the field commits and again at Connect.
- **SET-16 · MUST.** An option that weakens security has no UI: it exists only as a key in the config file, so
  nobody turns it on by clicking. An option weakens security when it switches off a check or a question the app
  otherwise makes to protect the user; a feature, such as remote access or a proxy, is not such an option.
  - *Check (code):* no Settings row or command writes the key of an option that switches off a check or a question the
    app otherwise makes to protect the user, whichever of its values is the weaker one: on for nux's `tlsTrustAll`,
    off for a check the app makes by default.
  - *Reference:* nux's trust-all TLS (`tlsTrustAll` in [`config/Config.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/config/Config.java)), and Termina's paste confirmation, which
    only its config file turns off ([`SecurityOptionsTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/config/SecurityOptionsTest.java), `noControlOrCommandWritesAWeakeningOption`). Editora doesn't yet: *Require
    registry signature* for plugins is a Settings checkbox and the `plugins.toggleRequireSignature` command.

## Settings Sync (Git / GitHub)

**Applies to:** an app with Settings Sync.

Which apps should offer Settings Sync is [SYNC-01](../templates/settings-sync/#sync-01): one with user data worth
carrying between computers. It syncs into a Git repository the user owns
([SYNC-02](../templates/settings-sync/#sync-02)). The rules of this section are how sync behaves in an app that has
it; an app without it owes them nothing.

- **SET-18 · SHOULD.** Settings Sync is set up by pasting a repository URL, or with **Create on GitHub** through the
  `gh` CLI. The account that can read the repository is pinned per clone, so machines with two GitHub accounts work.
  - *Check (code):* the Sync page takes a repository URL in a field and offers a Create on GitHub action that runs
    `gh`; and the sync code finds which of the signed-in GitHub accounts can read the repository, records it with
    the clone, and uses that account for the clone from then on. A test that remembers the first account that can
    read the repository and uses it without asking again is the surest evidence.
  - *Reference:* Editora [`sync/SyncAccount.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncAccount.java), [`SyncAccountTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/sync/SyncAccountTest.java), [`ui/SettingsSyncPage.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSyncPage.java). The app template's
    [`sync/AccountPin.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/sync/AccountPin.java) finds the first signed-in `gh` account whose token can read the repository, records it beside the
    clone and passes it to every fetch and push from then on ([`AccountPinTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/sync/AccountPinTest.java), `theFirstAccountThatCanReadIsPinnedAndKept`).
- **SET-19 · SHOULD.** Settings Sync runs automatically (on change and at start) and on demand. Machine-local keys
  (window size, paths) never sync.
  - *Check (code):* a sync starts by itself after startup and after a local change, and a command starts one on
    demand (`sync.now` in Editora); and no machine-local key or file (window size, a path) is among those the sync
    sends to the repository.
  - *Reference:* Editora [`ui/SettingsSync.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSync.java) (after startup, after a local change, on an interval, and
    `sync.now`), [`sync/SyncCategory.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncCategory.java); Torrenta [`sync/SyncKeys.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/sync/SyncKeys.java).
- **SET-20 · SHOULD.** When Settings Sync finds one entry changed on both sides, *this machine wins*, and a backup
  is taken before any sync that replaces local files.
  - *Check (code):* the merge keeps this machine's value for an entry both sides changed, and the sync copies the
    local files to a backup before it replaces them. A merge test where both sides changed one entry is the surest
    evidence.
  - *Reference:* Editora [`sync/SyncMerge.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/sync/SyncMerge.java), [`SyncMergeTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/sync/SyncMergeTest.java); the app template's [`sync/SyncMerge.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/sync/SyncMerge.java) and
    [`ui/SyncController.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/SyncController.java) (`backUp`, which copies `settings.json` to `backups/` before a merge replaces the local bindings;
    [`SyncControllerFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/ui/SyncControllerFxTest.java), `aSyncThatReplacesLocalSettingsBacksThemUpFirst`).
- **SET-21 · SHOULD.** Settings Sync shows its status as a pill in Settings and as echo messages; its failures go to
  the Message Log.
  - *Check (by hand):* point Sync at a repository that does not exist: the pill in Settings shows the failure, the
    echo area says it, and the Message Log keeps it.
  - *Reference:* Editora [`ui/SettingsSyncPage.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsSyncPage.java), [`SyncStatus`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SyncStatus.java).

![Editora's Sync settings page](../../assets/shots/editora-settings-sync.png "Editora's Sync page, not connected: the repository and branch fields, Connect, the status pill and what to sync.")
![Torrenta's Sync settings page](../../assets/shots/torrenta-settings-sync.png "Torrenta's Sync page.")
![Termina's Sync settings page](../../assets/shots/termina-settings-sync.png "Termina's Sync page.")
