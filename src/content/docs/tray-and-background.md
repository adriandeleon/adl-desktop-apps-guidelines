---
title: "Tray and background"
description: "An app that keeps working behind a tray icon: the icon and its menu, close to tray, start at login, desktop notifications."
---

An app whose work goes on without its window (Torrenta's transfers, Modula's radio, nux's monitoring) lives behind a
tray icon. Reference: Torrenta's [`tray/`](https://github.com/adriandeleon/torrenta/tree/master/src/main/java/com/torrenta/tray) package ([`Trays`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/tray/Trays.java), [`TorrentaTray`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/tray/TorrentaTray.java), [`SniTray`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/tray/SniTray.java), [`AwtTray`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/tray/AwtTray.java), [`TrayIconRenderer`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/tray/TrayIconRenderer.java),
[`SniMenuModel`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/tray/SniMenuModel.java)), [`os/Autostart`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/os/Autostart.java) with [`os/AutostartSpec`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/os/AutostartSpec.java), and [`automation/Notifiers`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/automation/Notifiers.java). Modula's and nux's [`tray/`](https://github.com/adriandeleon/nux/tree/master/src/main/java/com/nux/tray) packages
are the same code with their own menus; nux's [`TrayController`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/app/TrayController.java) holds the close policy.

**Applies to:** an app whose work goes on without its window, as Torrenta's, Modula's and nux's does. For the others
(Editora, Termina, Mirada) a tray is MAY, none has one, and no rule on this page applies.

## The icon and its menu

<div class="mock-stage">
<div class="m-tr-stage" role="img" aria-label="Mockup of a tray icon in a desktop panel with its menu open">
<div class="m-tr-panel"><span class="m-icon"></span><span class="m-icon"></span><span class="m-tr-glyph"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.2"/><path d="M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 19a10 10 0 0 1 0-14M19 5a10 10 0 0 1 0 14"/></svg><span class="pin out" style="left:-2px;top:-24px">1</span></span><span class="m-tr-clock">12:48</span></div>
<div class="m-card m-menu m-tr-menu">
<div class="mi off"><span class="t">Listening · 101.5 MHz</span><span class="pin out" style="right:-26px">2</span></div>
<div class="sep"></div>
<div class="mi"><span class="t">Stop</span><span class="pin out" style="right:-26px">3</span></div>
<div class="mi"><span class="t">Record</span></div>
<div class="mi"><span class="t">Show Modula</span><span class="pin out" style="right:-26px">4</span></div>
<div class="sep"></div>
<div class="mi"><span class="t">Quit</span><span class="pin out" style="right:-26px">5</span></div>
</div>
</div>
</div>

<ol class="anatomy">
<li><span class="pin">1</span><span><strong>The icon</strong> is the app's own mark, recolored by state, not a badge. Torrenta's arrow is teal while something downloads, muted when nothing does, red on an error; Modula's broadcast glyph amber while listening, ink when stopped, coral on a fault. The exception is an app whose state is a number: nux draws a rounded whole number (charge, load or minutes left) colored by severity, gray when disconnected, never a decimal like "101.5", which is unreadable at 22 px.</span></li>
<li><span class="pin">2</span><span><strong>Status line</strong>, disabled, first. It is also the tooltip, because GNOME's AppIndicator extension renders a StatusNotifierItem's menu but not its tooltip, so the menu is the one place the live figures are sure to appear.</span></li>
<li><span class="pin">3</span><span><strong>The main actions</strong> the window would offer, so the common jobs need no window: Listen becomes Stop, Record is grayed (not hidden) until the receiver runs; Torrenta's menu has none; nux offers Connect, Switch UPS and the instant commands, which still go through the app's confirmation.</span></li>
<li><span class="pin">4</span><span><strong>Show <em>App</em></strong> brings the window back, as a left click on the icon does.</span></li>
<li><span class="pin">5</span><span><strong>Quit</strong>, after a separator. The only way to end the program apart from File → Quit and the system's Quit.</span></li>
</ol>

Tray menus are text only: AWT's `PopupMenu` and dbusmenu show no item icons, so the [menu rules](../menus/) about
icons and chords do not apply here. The order does.

- **TRAY-01 · MUST.** The tray comes from the shared `tray/` package: a StatusNotifierItem on Linux, AWT's
  `SystemTray` on Windows and macOS, created off the FX thread after the first frame.
  - *Why:* D-Bus and AWT can block, and neither is worth a stalled first frame.
  - *Check (code):* `Trays.create` picks `SniTray` on Linux and `AwtTray` elsewhere, and the window calls it from a
    background thread.
  - *Reference:* Torrenta [`tray/Trays.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/tray/Trays.java), [`MainWindow.installTray`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java); the Spec table below.

### Spec

| Property | Value | Reference |
|---|---|---|
| Linux backend | A StatusNotifierItem on the session bus, found through `org.kde.StatusNotifierWatcher`: KDE natively, GNOME with the AppIndicator extension, X11 and Wayland alike. No AWT fallback: the XEmbed tray GNOME dropped in 3.26 and Wayland never had | `SniTray`, `StatusNotifierWatcher`, `Trays.create` |
| Windows and macOS | AWT `SystemTray`, every mutation on the EDT, a multi-resolution image so a HiDPI tray picks a crisp variant | `AwtTray` |
| Created | Off the FX thread, after the first frame (D-Bus and AWT can block); the outcome is a tray or the one-line reason there is none | `Trays.Attempt`, `MainWindow.installTray` |
| Icon | Pure Java2D from the branding SVG's geometry, at each size the backend asks for, so the panel entry and the dock entry are one mark | `TrayIconRenderer`, `TrayDisplay` |
| Attention | A state that needs a person sets the SNI status `NeedsAttention`; otherwise `Active` | `SniTray.update` |
| Left click | Shows the window: SNI `Activate` and `SecondaryActivate`, a single primary click on the AWT icon | `SniTray.Item`, `AwtTray` |
| Right click | The menu; the host pulls it from the item's `Menu` property | `SniMenu`, `SniMenuModel` |
| Updates | Only when the value-equal snapshot changed: a repaint crosses a process boundary on Linux. Torrenta polls once a second, Modula nine times | `TrayDisplay`, `MainWindow.pushTray` |
| Package | Free of JavaFX: it takes callbacks, and the window marshals them onto the FX thread | `TorrentaTray` |

## Behavior

- **TRAY-02 · MUST.** The app is fully usable without a tray. No icon is a normal outcome (stock GNOME has no
  StatusNotifier host), not an error, and the reason is said where the person will look.
  - *Why:* the bug they actually hit is silence: the box says close to tray, and closing quits.
  - *Check (code):* when the tray attempt returns no tray, the status bar says why and that closing quits.
  - *Reference:* Torrenta [`MainWindow.installTray`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java) ("No tray icon (…); closing the window quits Torrenta",
    `status.noTray`); Modula's status says closing the window will quit it ([`RadioPane.reportNoTray`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/RadioPane.java)).
- **TRAY-03 · MUST.** Closing the window hides it only while an icon is actually up and the setting says so, both
  read at close time; otherwise a close quits. `Platform.setImplicitExit(false)` is set only once a tray exists,
  and turning the tray off brings a hidden window back.
  - *Why:* the checkbox can change while the window is open, and hiding a window that leaves no icon behind is how
    a program becomes unreachable.
  - *Check (code):* the close handler tests that a tray exists and reads the live setting; `setImplicitExit(false)`
    sits after the tray is created.
  - *Reference:* Torrenta [`MainWindow.setOnCloseRequest`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java), Modula's `installCloseBehaviour`, nux's
    [`TrayController.closeHidesWindow`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/app/TrayController.java) and `updateImplicitExit`.
- **TRAY-04 · MUST.** Quit is explicit and one path: the tray's Quit, File → Quit and the system's Quit all run the
  same method, which closes open dialogs first and saves the window geometry.
  - *Why:* quitting from inside a nested event loop aborted the JVM.
  - *Check (code):* every quit entry point calls the one quit method.
  - *Reference:* Torrenta [`MainWindow.quit`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java).
- **TRAY-05 · SHOULD.** `--minimized` comes up behind the icon. The window is never shown until the tray attempt
  has answered; if no icon comes, the window is shown after all. With the tray setting off, Torrenta starts
  minimized instead and nux ignores the flag.
  - *Why:* a start at login can then never leave a program with no way back.
  - *Check (code):* a `--minimized` start shows the window when the tray attempt returns none.
  - *Reference:* Torrenta [`MainWindow.show`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java), nux's [`App`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/App.java).
- **TRAY-06 · SHOULD.** Start at login writes the OS's own entry, and nothing else: an XDG autostart entry in
  `~/.config/autostart` (quoted `Exec`, `StartupWMClass` matching the installed launcher,
  `X-KDE-autostart-after=panel` so a tray host is up first), a LaunchAgent in `~/Library/LaunchAgents`, the
  `HKCU\…\Run` value on Windows (read together with `StartupApproved`, where Task Manager keeps the person's
  "off"). The entry is the one truth: turned off in GNOME Tweaks, KDE's Autostart page or Task Manager, the box
  shows unticked. The one setting beside it is *start behind the tray icon*, written into the entry as
  `--minimized`.
  - *Check (test):* a pure test of the exact bytes of each platform's entry.
  - *Reference:* Torrenta [`os/Autostart.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/os/Autostart.java), [`os/AutostartSpec.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/os/AutostartSpec.java), [`AutostartSpecTest`](https://github.com/adriandeleon/torrenta/blob/master/src/test/java/com/torrenta/os/AutostartSpecTest.java); nux's design.
- **TRAY-07 · SHOULD.** Only the app writes the login entry, and only from an installed package: the installers
  never do it, and a run from source says it has nothing to start.
  - *Why:* an installer runs for every account.
  - *Check (code):* the entry's target comes from `jpackage.app-path`, and is absent when it is unset.
  - *Reference:* Torrenta [`os/Autostart.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/os/Autostart.java).
- **TRAY-08 · SHOULD.** Every start-at-login call runs off the FX thread.
  - *Why:* it may block on the file system or `reg.exe`.
  - *Check (code):* every `Autostart` read and write starts on a worker thread.
  - *Reference:* Torrenta [`SettingsWindow`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/SettingsWindow.java) (`autostart-read`, `autostart-write`) and [`MainWindow`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java)
    (`autostart-refresh`); nux's [`App`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/App.java) (`nux-autostart`).
- **TRAY-09 · MUST.** Desktop notifications go through one `Notifier`: `notify-send` on Linux (nux and Termina fall
  back to `gdbus` against the freedesktop service), `osascript` with `display notification` on macOS, a PowerShell
  toast on Windows. Each is a short program run with the title and message as arguments, never as part of a script,
  off the FX thread and bounded to a few seconds; a failure is logged and never breaks the app.
  - *Why:* text from a torrent name or a remote shell then cannot run anything.
  - *Check (test):* a test holds that each platform's command line passes the text as arguments and that a missing
    program is a problem, not an exception.
  - *Reference:* Torrenta [`automation/Notifiers.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/automation/Notifiers.java), [`ProcessNotifier`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/automation/ProcessNotifier.java), [`NotifierTest`](https://github.com/adriandeleon/torrenta/blob/master/src/test/java/com/torrenta/automation/NotifierTest.java) (it ships [`toast.ps1`](https://github.com/adriandeleon/torrenta/blob/master/src/main/resources/com/torrenta/automation/toast.ps1));
    nux's [`service/Notifier`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/service/Notifier.java) raises it through the tray icon, which it keeps as the last resort on every platform;
    Termina's [`DesktopNotifier`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/DesktopNotifier.java).
- **TRAY-10 · MUST.** Notifications are for what happened while the window was away, with one switch per event and
  few on by default.
  - *Check (code):* each notified event has its own setting, and most default to off.
  - *Reference:* Torrenta notifies on added, finished, seeding done, error and updated, with only *finished* on at
    first, and a Test button in Settings shows one now ([`automation/AutomationSettings.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/automation/AutomationSettings.java)); nux notifies on
    power events with a rule per UPS; Termina and Editora relay a program's own OSC 9 and OSC 777 notifications.
- **TRAY-11 · SHOULD.** A notification is never the only place a state is said: the in-app status already shows it.
  - *Check (by hand):* trigger each notified event with notifications off; the window still shows it.
  - *Reference:* Torrenta's status bar and transfer list.
- **TRAY-12 · MAY.** A dock badge: Torrenta puts the download rate on the macOS dock icon through AWT's `Taskbar`
  and a count on a Linux launcher that honors Unity's `LauncherEntry` signal (KDE, Dash to Dock); nothing on
  Windows, whose taskbar badges only AWT's own windows. It is cleared when nothing downloads and has its own switch.
  - *Check (test):* a pure test of the badge state.
  - *Reference:* Torrenta [`os/Badges.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/os/Badges.java), [`BadgeState`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/os/BadgeState.java), [`BadgeStateTest`](https://github.com/adriandeleon/torrenta/blob/master/src/test/java/com/torrenta/os/BadgeStateTest.java).
- **TRAY-13 · SHOULD.** A second launch brings the hidden window forward: the
  [single-instance hand-off](../command-line/) shows a window hidden to the tray before it opens what it was given.
  - *Check (by hand):* close to the tray, then launch the app again with a file.
  - *Reference:* Torrenta [`MainWindow.showFromTray`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java).
- **TRAY-14 · SHOULD.** AWT stays headless unless the tray needs it. Linux never needs it; Windows and macOS lift the
  guard only when the tray setting is on, decided in `main`. A tray turned on later says "restart to show the tray
  icon" rather than "unsupported".
  - *Check (test):* a test holds that AWT is headful only where the tray is AWT's and wanted.
  - *Reference:* Torrenta [`Trays.usesAwt`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/tray/Trays.java), `os.AwtUse`, [`TraysTest`](https://github.com/adriandeleon/torrenta/blob/master/src/test/java/com/torrenta/tray/TraysTest.java).

## Settings copy

| Key | English |
|---|---|
| `ui.tray` | A tray (menu-bar) icon with the rates and a menu; on by default |
| `ui.closeToTray` | Closing the window keeps Torrenta in the tray. *The torrents go on; the tray icon's Show Torrenta brings the window back, its Quit ends the program, as does Quit in the File menu. Without a tray, closing quits.* On by default; nux grays it while the tray is off |
| (the OS entry) | Start Torrenta when you log in. *Adds Torrenta to your login items: an entry in ~/.config/autostart on Linux, a LaunchAgent on macOS, the Run key on Windows. Turned off in the system's own settings, it shows unticked here. Only for an installed Torrenta, not a run from source.* |
| `os.autostartInTray` | Start behind the tray icon. *At login Torrenta comes up behind its tray icon instead of as a window, and minimized where there is no tray. `torrenta --minimized` does the same by hand.* |
| `notify.<event>` | One switch per event; `notify.finished` on by default |
| `status.noTray` | No tray icon ({reason}); closing the window quits {app} |

## In the apps

![nux dashboard showing battery charge, load and runtime gauges for a UPS](../../assets/shots/nux-main.png "nux lives in the tray: its icon carries the charge number, and this dashboard is one left click away.")
