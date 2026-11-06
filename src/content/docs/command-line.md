---
title: "Command line and launch"
description: "The flags every app accepts and the single-instance hand-off."
---

Every app accepts at least:

| Flag | Meaning |
|---|---|
| `--help`, `--version` | Printed before the GUI starts; plain English, not translated. |
| `--config-dir <dir>`, `--dev` | Use another config folder (`~/.<app>-dev` for `--dev`). |
| `--new-instance` | Start a second process instead of handing off to the running one. |
| `--no-session` | Do not restore the last session. |
| `--report` | Write a redacted problem report and open the GitHub issue. |
| `[files…]` | Open these items. |

- **Single instance per config folder.** A second launch hands its arguments to the running app over a
  local endpoint and exits (`ipc/SingleInstance`). On macOS, `openFiles` Apple Events reach the running
  app (`MacOpenFiles`). An advisory lock tells two processes on one folder about each other
  (`config/InstanceLock`).
- The headless-AWT guard is the first statement of `main`.
- A `.app` launched from Finder inherits a stripped `PATH`: resolve external tools through the login shell's
  `PATH`.
