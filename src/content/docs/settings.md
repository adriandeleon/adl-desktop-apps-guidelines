---
title: "Settings"
description: "The Settings window with search, live apply, versioned config and Git/GitHub sync."
---

## The Settings window

- **MUST.** Opened by `Ctrl/Cmd+,` and a palette command. A sidebar of pages with icons on the left, the
  page on the right, and a **search field on top**.
- **Search** finds a row by its title, description, visible text, its card or section heading, its page
  name and English keywords. Title hits rank above description hits; whole words above word starts. The
  page with the best match opens, and every non-matching row, heading and card is hidden
  (`SettingsSearch`).
- **Live apply.** No Save button. Text fields commit on Enter or focus loss; invalid numbers are marked and
  never committed.
- A change made in one window reaches every other open window.

![Editora's Settings window searching for sync, with the Sync page open](../../assets/shots/editora-settings-search.png "Typing sync in Settings: pages without a match grey out and the best page opens.")

## Before adding a setting

A setting is a question the user has to answer. When the question has one right answer, choose it, make it the
behaviour, and say why in the code and the docs; do not ship a knob for it. Modula's test: *would a car radio have
it?* A preset button, yes; a "decimation stages" spinner, no. So Modula has no gain, bandwidth or squelch control:
each has one right value for a listener, and the app supplies it. Add a setting when people really differ (a
keymap, a theme, a language), not when the developer could not decide.

## Adding a setting touches five places

1. **Model** field, default and accessors, with a schema bump and migration.
2. **Control**, built once, writing the field and applying it.
3. **Row** on its page with search keywords.
4. **Load** line that sets the control from the model, safe to run at any time.
5. **Palette command** that flips or prompts the same field, plus strings in every catalog.

## Config folder and schema

- Config lives in `~/.<app>` (`~/.<app>-dev` for `--dev`, any folder via `--config-dir` or
  `<APP>_CONFIG_DIR`).
- `settings.json` for preferences, `workspace-state.json` for session state, other stores in their own
  JSON files.
- Every versioned file has a `SCHEMA_VERSION` and a `v → v+1` migration step. A purely additive field uses
  an identity step.
- A file newer than the running build is backed up to `<name>.v<n>.bak` and defaults load: an older build
  never clobbers a newer config.
- **Never trust a config file.** Config is plain JSON (or properties) and people edit it by hand. Clamp every
  value to its valid range when it is **read**, not only when it is written: a hand-edited two-million-line
  scrollback must not exhaust memory at the next launch (Termina). An unknown value falls back to its default; a
  file that cannot be decoded is kept as `<name>.corrupt.bak` and defaults load. A bad file never stops the app
  from starting.
- **Export configuration** writes a timestamped `.zip` of the config folder (`ConfigExporter`). Import
  restores from one.

## Secrets stay out of files

- **No secret in a config file.** API keys and tokens go to the operating system's keychain: macOS Keychain,
  Windows Credential Manager, the Secret Service on Linux (Editora's `secrets/SecretStore`). Calls may block on a
  prompt, so they run off the FX thread.
- **Or keep it for the session only.** A credential the app can ask for again (nux's UPS login) lives in memory and
  is never written. Work that needs it waits until the user has signed in this session; do not "fix" that by
  storing the password.
- **Refuse a secret in the wrong place.** A repository URL with a password or token in it is refused, with the fix
  ([Settings Sync](../templates/settings-sync/)); a problem report redacts tokens, hosts and home paths before
  anyone sees it ([Diagnostics](../diagnostics/)).
- **No UI for a dangerous escape hatch.** An option that weakens security, such as nux's trust-all TLS
  (`tlsTrustAll`), exists only as a key in the config file, so nobody turns it on by clicking.

## Settings Sync (Git / GitHub)

- **SHOULD.** Optional sync of settings, keybindings and user data through a Git repository the user owns.
- Setup by pasting a repo URL, or **Create on GitHub** through the `gh` CLI. The account that can read the
  repo is pinned per clone, so machines with two GitHub accounts work.
- Automatic (on change and at start) and manual triggers. Machine-local keys (window size, paths) never
  sync.
- Conflict rule: on a same-entry conflict *this machine wins*. A backup is taken before any sync that
  replaces local files.
- Status shows as a pill in Settings and as echo messages; failures go to the Message Log.
- Reference: `sync/SyncEngine`, `sync/SyncMerge`, `sync/SyncAccount`, `ui/SettingsSync`,
  `docs/subsystems/settings-sync.md`.

![Editora's Sync settings page](../../assets/shots/editora-settings-sync.png "Editora's Sync page: repository, branch, Create on GitHub… and what to sync.")
![Torrenta's Sync settings page](../../assets/shots/torrenta-settings-sync.png "Torrenta's Sync page.")
![Termina's Sync settings page](../../assets/shots/termina-settings-sync.png "Termina's Sync page.")
