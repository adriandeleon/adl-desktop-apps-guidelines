---
title: "Performance"
description: "Keep the JavaFX application thread free, coalesce work, bound memory, and measure: the rules that keep every app responsive."
---

A desktop app is judged by how it feels under the hand: a key that lags or a window that hangs while it reads a
file is a defect, not a slow feature. These rules come from Editora's
[`docs/performance.md`](https://github.com/adriandeleon/Editora/blob/master/docs/performance.md), the contract
every change on a hot path there must honor.

## The UI thread

- **PERF-01 · MUST.** Never block the JavaFX application thread. No file or network I/O, no process start or wait,
  no parsing, searching, hashing or JSON of any size on it, and no `Thread.sleep`, `Future.get()`, `join()` or
  `Process.waitFor()` there. Two exceptions. At start-up, before the first window is shown, `start()` may wait once
  for the config read that [PERF-16](#perf-16) began before the toolkit, and may read the bundled resources that
  window is built from: its fonts, registered there or by a thread `start()` waits for once
  ([ICON-02](../icons-and-color/#icon-02) requires them before any CSS is applied), the message catalog, the
  keymap and its icons. Nothing else at start-up is excepted: a log file opened, a file or a store of the user's
  read (presets, profiles, schedules, themes the user added), a ledger read, a socket bound or a lock taken blocks
  the thread as it would anywhere, and so does a font registered on it after the first frame. And as the app quits,
  when no frame is left to block, the quit method ([WIN-13](../window-shell/#win-13)) or `Application.stop()` may
  make the last save on it: write the settings, the window state and the session, or wait for a write already
  under way. An app whose `start()` loads its settings itself, whether or not `main` read the file earlier, or
  waits for a read begun after the toolkit, has PERF-16's gap and none here.
  - *Check (code):* `grep -rnE 'Files\.[a-z]|File(Input|Output)Stream|File(Reader|Writer)|RandomAccessFile|getResourceAsStream|loadFont|HttpClient|openConnection|openStream|new Socket|SocketChannel\.open|ProcessBuilder|getRuntime\(\)\.exec|\.waitFor\(|Thread\.sleep|\.join\(\)|uture[A-Za-z]*\.get\(|\.get\([^)]*TimeUnit|invokeAndWait|\.await\(' src/main/java`
    lists the candidates: the lines that read or write a file or a bundled resource, open a connection, start or
    wait for a process, sleep, or wait for another thread. Each line is judged by reading what calls it. It is fine
    when only an executor's task or a thread's body reaches it; when `start()` reaches it before the first window
    is shown and it is one of the things the statement allows there, the one `join()` or `get()` on the config
    read begun before the toolkit, or the reading of a resource bundled with the app that the first window is
    built from: the registering of the fonts it draws with (Editora's `Fonts.loadForFirstPaint`) or the one wait
    for the thread that registers them, the message catalog (Editora's `Messages.init`), the keymap (Editora's
    `KeymapManager.loadNamed`) or the window's icons; or when it is the last save, made by the quit method or
    `Application.stop()`, which may do nothing else that blocks. It is a violation when an event handler, a
    listener, a `Platform.runLater` body, a timer's or an animation's callback, or `start()` reaches it on the FX
    thread, itself or through a method it calls: a handler that calls a settings store's `save()` writes the file
    on the FX thread. In `start()` everything else is a violation, before the first window is shown or after: a
    second wait for the config, a log file opened, a file or a store of the user's read (presets, profiles,
    schedules, a folder of themes the user added), a ledger read, a socket bound, a lock taken. Only the settings
    are left to [PERF-16](#perf-16): a load of them made in `start()` itself, whether or not `main` read the file
    earlier, and a wait for a read of them begun after the toolkit. A font registered on the FX thread after the
    first frame is a violation too. A grep finds only the spellings it is given: read the handlers and listeners
    too for parsing, searching, hashing or JSON done in place, and for a wait under another name.
  - *Reference:* Editora [`docs/performance.md`](https://github.com/adriandeleon/Editora/blob/master/docs/performance.md) §1; its one start-up wait is `takeBootstrap` in [`App.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java),
    which joins the `config-prefetch` read, and `Fonts.loadForFirstPaint`, called next, registers its first fonts
    ([`ui/Fonts.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Fonts.java)); the `config-prefetch` thread reads the catalog too, and `start()` reads it only when
    that thread picked another language (`Messages.init`). Mirada's `start()` makes the two waits the first
    exception allows: `settings()` joins the settings read, which also reads its catalog (in its jlink image that
    read begins after the toolkit, which is [PERF-16](#perf-16)'s gap and none here), and `Fonts.ready`, before the
    window is shown, joins the thread that registers its fonts
    ([`App.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/App.java), [`ui/Fonts.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/Fonts.java)). For the last save, the app template's [`MainWindow.quit`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/MainWindow.java) waits for the
    settings write on a background thread and exits from there, which needs no exception, and its
    `Application.stop()` then waits for the writer once more on the FX thread (`Running.close` in
    [`ui/Startup.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Startup.java)), which the second exception allows; Termina's
    [`WindowManager.closeAll`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/WindowManager.java), run from `Application.stop()`, flushes its settings on the FX thread, which the second
    exception allows. The app template does its start's file work off the FX thread: `prepare` in
    [`ui/Startup.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Startup.java), which refuses the FX thread and runs on a thread of its own while the toolkit starts, opens the
    Debug Log's session file, reads the settings, the catalog and `pauta.json` and binds the single-instance socket;
    `start()` then registers its first fonts, which the first exception allows (`Fonts.load`), and the remaining
    font is registered off the FX thread after the first frame (`Fonts.loadDeferred`). No app has been read through
    for the rule yet, and none holds it everywhere. Found so far:
    Editora's `start()`, in that `App.java`, does on the FX thread, before its first window is shown, what no
    exception covers: its calls to `DebugLog.attachFile` (the Debug Log's session file),
    `SharedConfig.claimInstance` (the lock on a file in the config folder), `ProcessRegistry.reapOrphans` (the
    ledger of the servers it started), `McpServer.reapStaleEndpoint` (a stale `mcp-endpoint.json`) and
    `Themes.loadUserThemes` (the user themes' folders). Some of its handlers still touch the disk too, for example
    `renameFileTo` (`Files.exists`, `Files.move`) and `openPersonalDictionary` (`Files.writeString`) in [`ui/MainController.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java)
    and the new-folder prompt in [`ui/ProjectPanel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ProjectPanel.java) (`Files.createDirectories`). Torrenta's `start()` reads its
    catalog, which the exception allows, and opens that file the same way (`DebugLog.attachFile` in its [`App.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/App.java));
    its main window's constructor, before the window is shown, reads six stores of the user's (the profiles, the
    labels, the watch folders, the search providers, their definitions and the RSS feeds, in [`ui/MainWindow.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java)),
    and `start()` reads `profiles.json` again once the window is shown (`Startup.profile`). Termina reads its
    settings, its first fonts, its catalog and its imported themes in `Application.init()`, off the FX thread
    (`prepare` in its [`App.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/App.java)); building its first window then reads the bundled keymap ([`ui/Keymap.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/Keymap.java), on
    the first `Keymap.defaultFor`) and decodes the window's icons ([`ui/Icons.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/Icons.java), `Icons.applyTo`) on the FX
    thread, which the exception allows, and once the window is shown `start()` deletes a stale socket file and
    binds the socket for later launches there, which it does not (`serve` in [`instance/SingleInstance.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/instance/SingleInstance.java)). It also registers
    its remaining font families on the FX thread after the first frame, which no exception covers ([`Fonts.loadRest`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/Fonts.java), called from that `App.java`).
    Mirada, on macOS, compares two paths on the FX thread when it was started with a file and the OS hands it its
    first one (`Files.isSameFile` in [`os/MacOpenFiles.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/os/MacOpenFiles.java)). nux waits up to two seconds for the tray icon's removal in the
    handler of Settings' Save ([`AwtTray.dispose`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/tray/AwtTray.java), reached from [`TrayController.settingsSaved`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/app/TrayController.java)) and writes its
    `--screenshot` file from an animation's callback ([`ui/Screenshot.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/Screenshot.java)).
    Torrenta writes its settings from the listeners
    of its Settings rows (`saveQuietly` in [`ui/SettingsWindow.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/SettingsWindow.java)) and asks the file store for the free space
    on each keystroke in a save-folder field (`updateFreeSpace` in [`ui/LocationDialog.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/LocationDialog.java)). Modula reads its
    presets and its schedules in its pane's constructor, before the window is shown (`config.loadPresets` and
    `config.loadSchedules` in [`ui/RadioPane.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/RadioPane.java)), writes its presets and settings from handlers
    (`config.savePresets` and `config.saveSettings` in that file) and, building its Settings window, starts
    `ffmpeg -version` and waits up to five seconds for it ([`Encoders.isAvailable`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/audio/Encoders.java)).
- **PERF-02 · MUST.** Touch the scene graph only on the FX thread. Background work hands its result back with
  `Platform.runLater`; nothing else creates, changes or reads live nodes.
  - *Check (code):* `grep -rnE 'new Thread\(|Thread\.(ofVirtual|ofPlatform|startVirtualThread)|\.(submit|execute|schedule|scheduleAtFixedRate|scheduleWithFixedDelay)\(|(supply|run)Async\(|\.(thenAccept|thenRun|thenApply|thenCompose|whenComplete|handle|exceptionally)(Async)?\(' src/main/java`
    lists the candidates: the lines that start a thread, hand a task to an executor, or add a step to a future that
    completes off the FX thread. Each line is judged by reading the task's body. It is fine when the body touches
    nothing a scene shows, or touches it only inside `Platform.runLater`. It is a violation when the body, or a
    method it calls, sets a control's value, changes an observable list a view shows, or reads a live node's state
    outside a `runLater`. A callback that a library runs on a thread of its own (a file watcher, a process's reader, a
    logging handler) is a task body too, and the grep does not list those: read the listeners the app gives its
    services as well.
  - *Reference:* Editora [`git/GitService.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/git/GitService.java): every task it gives its workers hands the result to its caller
    inside `Platform.runLater`. No app has been read through for the rule yet.
- **PERF-03 · MUST.** A background result is applied under a generation guard, so an answer to an old request never
  overwrites a newer one.
  - *Check (code):* `grep -rn 'runLater' src/main/java` lists the candidates: the lines where another thread hands
    something to the FX thread. Each line is judged by reading it. It needs the guard when what it applies answers a
    request that can be made again before the answer comes: a search, a load, a status or completion query that
    typing, a selection or a refresh starts. There each request takes a mark that the next request replaces (a
    counter, as Editora's `AtomicLong.incrementAndGet`, or a helper that keeps the latest request only, as Editora's
    `LatestOnly`), and the answer is applied only while its mark is still the newest, compared inside the
    `runLater`. It is a violation when such an answer is applied with no comparison, or with one made only before
    the `runLater`. A line needs no guard when nothing newer can replace what it hands over: an event, a batch of a
    stream, a result asked for once at start-up.
  - *Reference:* Editora [`git/GitService.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/git/GitService.java) (`refresh`, with its `refreshGen` counter), [`search/SearchService.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/search/SearchService.java) and
    [`ui/LatestOnly.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/LatestOnly.java) ([`LatestOnlyTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/LatestOnlyTest.java)); Termina ([`work/LatestOnly.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/work/LatestOnly.java)) and Mirada
    ([`ui/LatestOnly.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/LatestOnly.java)) carry the same helper. No app has been read through for the rule yet. Found so
    far: nux applies each Refresh of its Events window, and each load of the Energy and Outages tabs of its
    History window, with no mark ([`ui/EventsWindow.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/EventsWindow.java), `offFx` in [`ui/HistoryWindow.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/HistoryWindow.java)), beside a
    Charts tab that numbers its loads and applies only the newest.
- **PERF-04 · SHOULD.** Every thread is named and is a daemon.
  - *Why:* a thread dump then says what is running, and a stray worker never keeps the app alive after its last
    window closes.
  - *Check (code):* every `Executors.new…` and `new Thread` gets a name and `setDaemon(true)`, through a thread
    factory such as `daemon("my-feature")`; virtual threads are daemons already.
  - *Reference:* Editora [`terminal/TerminalExecutors.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/terminal/TerminalExecutors.java) (its `daemon(name)` thread factory); the canonical
    shape is in [The UI thread](#the-ui-thread).
- **PERF-05 · MUST.** Blocking work stays off the common `ForkJoinPool`: no `supplyAsync` or `runAsync` without an
  executor runs a blocking call, and a `Process` subclass overrides `onExit()`, whose inherited version is a
  `waitFor()` on that pool.
  - *Why:* the common pool has one worker fewer than the machine has cores, so a few blocked waits
    (`CompletableFuture.supplyAsync` of a `waitFor`) starve every other user of it.
  - *Check (code):* no `supplyAsync` or `runAsync` without an executor wraps a blocking call (a wait, a read or
    write of a file, a socket or a process), and every class that extends `Process` overrides `onExit()`. An app
    with no `Process` subclass has only the first half to show.
  - *Reference:* Editora [`process/ExitWatch.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/process/ExitWatch.java), [`docs/gotchas.md`](https://github.com/adriandeleon/Editora/blob/master/docs/gotchas.md). Editora's [`DapManager.reportJavaExit`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/dap/DapManager.java) still
    waits up to 3 s for an exit code in a `supplyAsync` on the common pool, and Termina's `handOff` in
    [`instance/SingleInstance.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/instance/SingleInstance.java) connects to a socket, writes and reads in one.

The canonical shape, where `daemon(name)` is a small factory that names the thread and marks it a daemon, as in
Editora's `TerminalExecutors`:

```java
private final ExecutorService exec = Executors.newSingleThreadExecutor(daemon("my-feature"));
private final AtomicLong gen = new AtomicLong();

void request(String input, Consumer<Result> onResult) {
    long mine = gen.incrementAndGet();
    exec.submit(() -> {
        Result r = computeOffThread(input);        // heavy work, off the FX thread
        if (mine == gen.get()) {                   // superseded? drop it
            Platform.runLater(() -> {
                if (mine == gen.get()) onResult.accept(r);
            });
        }
    });
}
```

For one-off blocking calls (reading a file, stat-ing a path, starting a process), a named virtual thread
(`Thread.ofVirtual().name("my-read").start(…)`, the name being [PERF-04](#perf-04)'s) is enough; the result still
comes back through `Platform.runLater`.

## Hot paths

A hot path is what runs on every keystroke, scroll pulse or progress tick. In Editora they are
typing, scrolling, highlighting, the overlays and the gutter. In Torrenta they are the transfer table's refresh,
in Termina the terminal grid, in Mirada stepping between images.

- **PERF-06 · MUST.** Redraws are coalesced to at most one per pulse, with a flag that one request is already
  queued. A redraw is the painting of what the app draws itself, a canvas, a chart or a grid of cells; in an app
  that paints nothing itself, it is the refresh of its list or view.
  - *Check (code):* a redraw request sets a flag (Editora's are named `…Pending`) and schedules one pass, and a
    request that finds the flag set schedules nothing. A handler that paints, or in an app that paints nothing
    refreshes its list or view, straight from its event has no such flag and fails: a chart drawn from its width
    listener and again from its height listener draws twice for one resize. Setting a control's own property in
    a handler (a label's text, a progress bar's value) is not a redraw: JavaFX draws the control once on the next
    pulse.
  - *Reference:* Editora [`docs/performance.md`](https://github.com/adriandeleon/Editora/blob/master/docs/performance.md) §2 (the `redrawPending` shape) and
    [`ui/WindowToolbar.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WindowToolbar.java) (`scheduleEditStateRefresh`, with its `editStateRefreshPending` flag). [`ui/FxThrottle.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FxThrottle.java)
    is another tool: a leading-edge throttle with a maximum wait and no such flag, which runs the first request
    of a burst at once and then at most one per interval.
- **PERF-23 · MUST.** Work driven by text the user types waits for typing to pause (a debounce) when it leaves the
  FX thread or cannot finish within a frame: a search of files, a request to a server, a re-highlight. Filtering a
  list already in memory, as a command palette does, is exempt and runs on every keystroke.
  - *Check (code):* a listener on a text input's text that starts background work, or work too long for one frame,
    restarts a timer (a `PauseTransition`'s `playFromStart`, or the app's debounce helper) and the work runs when the
    timer fires; a listener that only filters or ranks an in-memory list needs none.
  - *Reference:* Editora [`ui/SearchInFilesPopup.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SearchInFilesPopup.java) (150 ms before `runSearch`), [`ui/SearchEverywherePopup.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SearchEverywherePopup.java) (120 ms),
    [`ui/WorkspaceSymbolPopup.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WorkspaceSymbolPopup.java) (150 ms before the language server is asked) and, for the editor's text,
    [`editor/SettledEditDispatcher.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/SettledEditDispatcher.java), one timer that runs the re-highlight 150 ms after the last edit. Its
    [`ui/CommandPalette.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/CommandPalette.java) and [`ui/QuickOpen.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/QuickOpen.java) filter their in-memory lists on every keystroke: the exempt case.
    Editora doesn't hold the rule everywhere yet: the debugger's completion ([`ui/DebugCompletion.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/DebugCompletion.java)) asks the
    debug adapter again on every change of the field's text while its list is open, with no timer, and
    [`ui/FileFinder.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/FileFinder.java) starts reading a folder as soon as the typed path names another one.
- **PERF-07 · MUST.** An app that shows a stream as it arrives (the output of a process, log records, progress or
  readings from another thread) hands it to the FX thread in batches at least 16 ms apart, never one `runLater` per
  line or record.
  - *Check (code):* in an app that shows a stream, the thread that receives it appends to a buffer that the FX
    thread drains, with a minimum interval of 16 ms or more between drains, or once a pulse (pulses come a frame
    apart); no reader calls `Platform.runLater` once for each line or record. A stream is what arrives at its
    source's pace, however many items that is: a process's output, log records, the results of a scan handed
    over as each is found. A poll the app paces itself, one hand-over for each tick of a timer of 16 ms or more
    (a reading fetched every few seconds), already hands over that far apart and needs no buffer. An app whose
    FX thread is sent no stream, as one whose log window reads its store only when it opens or is refreshed, is
    not covered.
  - *Reference:* Editora [`process/OutputPump.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/process/OutputPump.java) (`MIN_DRAIN_INTERVAL_MILLIS`), [`ui/ConsoleAppender.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ConsoleAppender.java).
    Torrenta doesn't yet for its event log: the bridge in [`ui/EventLog.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/EventLog.java) (`logBridge`) hands each warning
    it catches to the FX thread in a `runLater` of its own. nux doesn't yet for its network scan: `scan` in
    [`service/DiscoveryService.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/service/DiscoveryService.java) hands each server it finds to the FX thread in a `runLater` of its own; its
    poll hands over one reading every five seconds ([`service/PollService.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/service/PollService.java)), which is paced already. Mirada's
    Debug Log window ([`ui/DebugLogWindow.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/DebugLogWindow.java)) reads the log when it opens and on Refresh, so no log stream
    reaches its FX thread.
- **PERF-08 · MUST.** Work only on what is visible and only on what changed: no O(document) or O(list) work per
  keystroke, scroll or tick, and a list the user or the data can grow without a limit the app sets is shown in a
  virtualized control (`ListView`, `TableView`, a fixed cell size), which builds nodes for the visible rows only.
  Filtering a list already in memory, as a command palette does, is exempt and runs on every keystroke.
  - *Check (code):* `grep -rnE 'textProperty\(\)|KEY_(TYPED|PRESSED)|setOnKey|setOnScroll|vvalueProperty|AnimationTimer|Timeline|PauseTransition|scheduleAtFixedRate' src/main/java`
    lists the first candidates: the listeners on text, keys and scrolling, and the timers. Each line is judged by
    reading what it runs on every keystroke, scroll or tick. It is fine when that handles the edited range or the
    visible rows, or filters or ranks a list already in memory. It is a violation when it reads, measures, styles
    or rebuilds the whole document or every item of a list. An editor's own stream of changes is a text listener
    too (Editora's `plainTextChanges`), which the grep does not list.
    `grep -rnE 'getChildren\(\)\.(add|addAll|setAll)\(' src/main/java` lists the second: the lines that put
    nodes into a pane. It is a violation where a loop makes one node for each item of a list the user or the data
    can grow without a limit the app sets (results, log records, files, transfers), which belongs in a `ListView`
    or `TableView`; it is fine where the pane holds a set of controls the code fixes, or a list the app caps at a
    number it names (a bar of at most five preset chips).
  - *Reference:* Editora [`editor/highlight/HighlightPass.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/highlight/HighlightPass.java), which restyles only as far as an edit reaches.
    No app has been read through for the rule yet. Found so far, each a loop that makes a node for every item of
    a list nothing caps: Modula's preset bar (a chip for each preset, `rebuild` in [`ui/PresetBar.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ui/PresetBar.java)); nux's
    dashboard (a card for each saved profile it watches and for each UPS, rebuilt as readings arrive, `setFleet` and
    `setOverview` in [`ui/Dashboard.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/ui/Dashboard.java)); Torrenta's rule and tags dialogs (a check box for each feed and each
    tag, [`ui/RuleDialog.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/RuleDialog.java), [`ui/TagsDialog.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/TagsDialog.java)); and Editora's crontab preview and pull-request checks card
    (a node for each job and each check run, [`editor/structured/CrontabPreview.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/structured/CrontabPreview.java), [`ui/ChecksListCard.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ChecksListCard.java)).
- **PERF-09 · SHOULD.** A hot path allocates little: it reuses buffers and arrays, and caches data a repaint only
  reads.
  - *Check (code):* the per-frame and per-keystroke code allocates no new arrays or images when the size has not
    changed.
  - *Reference:* Editora [`editor/minimap/Minimap.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/minimap/Minimap.java) (the snapshot image reused at the same size),
    [`MinimapRows.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/minimap/MinimapRows.java).
- **PERF-10 · SHOULD.** CSS stays cheap: no `applyCss()` on a large subtree, stable style classes, and spans of the
  same style merged before they are applied.
  - *Check (code):* `applyCss()` is called only on small nodes; style classes are not toggled per keystroke.
  - *Reference:* Editora `SpanMerger` in [`editor/highlight/TextMateHighlighter.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/highlight/TextMateHighlighter.java), [`docs/gotchas.md`](https://github.com/adriandeleon/Editora/blob/master/docs/gotchas.md).

## Memory and size

- **PERF-11 · MUST.** Everything that grows is bounded: logs, histories, consoles, caches, undo. The newest is kept.
  - *Check (code):* each store that grows while the app runs (a log, a history, a console's text, a cache, an undo
    stack) has a named cap, and the code that adds to it drops the oldest entry once the cap is passed. A test that
    fills a store past its cap and finds the oldest dropped is the surest evidence.
  - *Reference:* Editora [`ui/MessageLog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLog.java) (200 entries, the oldest dropped; [`MessageLogTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MessageLogTest.java)), [`ui/DebugLog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/DebugLog.java)
    (2,000 records, the oldest dropped; [`DebugLogTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/DebugLogTest.java)), and [`test/OutputCap.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/test/OutputCap.java), which keeps the head and the tail of one
    test's output (200,000 characters) with a note between them of how much was cut. The note is Editora's choice,
    not part of the rule.
- **PERF-12 · MUST.** In an app that opens files or data the user picks, a large input is guarded before it loads:
  its size is checked before its content is read, or the read is capped, and what will not fit is never read in.
  The app refuses it with a message or opens only the part that fits. Where an input can open with less, without
  features the app runs over its content, as a file in an editor can open without highlighting or a minimap, the
  app steps down as the input grows: those features turn off past one threshold, and past another it opens
  read-only or capped. An input the app can only read in or refuse (an imported theme, a `.torrent` file) has
  nothing to step down to.
  - *Check (code):* the code that loads a picked file or import compares its size against a named limit before
    reading the content, or reads through a cap, and refuses or cuts what passes the limit. Where the app runs
    features over an input's content that the input can open without (an editor's highlighting, its minimap), a
    lower named threshold turns them off and a higher one opens the input read-only or capped. Where it runs
    none, the size check or the cap is the whole of the rule.
  - *Reference:* Editora, whose tiers are the example: [`EditorBuffer.LARGE_FILE_BYTES`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/EditorBuffer.java) (5 MB: no highlighting, no minimap) and
    `HUGE_FILE_BYTES` (50 MB: read-only and cut to 50 MB), and [`ui/LoadHeapGuard.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/LoadHeapGuard.java), which caps a load at
    what the free heap affords ([`LoadHeapGuardTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/LoadHeapGuardTest.java)). Termina's theme import has nothing to step down to:
    `importFile` in [`ui/Themes.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/Themes.java) reads at most 8 MB and [`theme/ThemeImport.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/theme/ThemeImport.java) refuses a file over 4 MB.
    Torrenta doesn't yet for a `.torrent` file the user picks: `resolve` in [`session/Session.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/session/Session.java) reads it whole
    (`Files.readAllBytes`) without looking at its size.
- **PERF-13 · MUST.** A closed window releases what it held: listeners, timers, executors, file watchers, native
  resources.
  - *Check (code):* the code that runs when a window closes (its close or hide handler, or the dispose method that
    handler calls) stops every timer and animation the window started, shuts down every executor, thread and file
    watcher it owns, frees its native resources (a process, a socket, a file handle), and removes each listener it
    added to something that outlives it: the shared settings, a service, another window. A test that opens and
    closes windows and finds nothing left running is the surest evidence.
  - *Reference:* Editora's [`MainController.disposeWindow`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java), which shuts down each owner of a window's workers in
    turn, one failure never skipping the rest ([`ui/WindowDisposal.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/WindowDisposal.java)). Its tests:
    [`FxWindowFixtureLifecycleFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FxWindowFixtureLifecycleFxTest.java), which finds a disposed window's workers shut down, and
    [`ClosedLspManagers`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/lsp/ClosedLspManagers.java). The app template ([`WindowLifecycleFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/ui/WindowLifecycleFxTest.java)), Termina ([`WindowLifecycleTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/ui/WindowLifecycleTest.java)) and
    Mirada ([`ClosedWindowTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/ui/ClosedWindowTest.java)) have such a test too.

## Start-up

- **PERF-14 · MUST.** The first frame comes first: only what the first window shows is built before it. Everything
  else builds on first open: a closed panel's content, the Settings pages, the dialogs and the other windows.
  - *Check (code):* the code that builds the first window (`start()`, and the main window's constructor and what
    it calls) makes only what that window shows: no Settings window or page, no dialog, no other window and, in an
    app with tool panels, no closed panel's content. Each of those is made by the code that first opens it, through
    a supplier or a field filled on first use. A test that opens the first window and finds none of them built is
    the surest evidence.
  - *Reference:* Editora's lazy [`ToolWindow`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindow.java) suppliers, and its Settings pages, built on the first `show`
    ([`ui/SettingsWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java)). [`LazyToolWindowsFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/LazyToolWindowsFxTest.java) asserts the tool-panel part: no closed tool window
    has built its panel. Editora doesn't hold the rule in one place yet: it builds the shared Output console
    (`buildOutput`), an empty tab pane, with the window, because every build writes to it while it is closed, and
    the test leaves that panel out. The template's [`StartupDeferralFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/ui/StartupDeferralFxTest.java) and Mirada's [`StartupDeferralTest`](https://github.com/adriandeleon/Mirada/blob/main/src/test/java/com/mirada/ui/StartupDeferralTest.java)
    assert it for their first windows. Torrenta doesn't yet: the constructor of its main window makes the Log, the
    Statistics and the Settings windows (`new LogWindow`, `new StatisticsWindow`, `new SettingsWindow` in
    [`ui/MainWindow.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/ui/MainWindow.java)).
- **PERF-15 · MUST.** What nobody waits for starts after the first frame has painted: the update check, extra
  fonts, indexes and caches.
  - *Check (code):* the update check, the loading of fonts the first window does not draw with, and the building
    of indexes and caches start from a callback that runs once the first frame has painted (a pulse after the
    window is shown, as Editora's `loadRemainingAfterNextPaint` waits for), never from `main`, `init()` or the body
    of `start()`. A test that finds the deferred work not started before the first paint is the surest evidence.
  - *Reference:* Editora [`ui/UpdateCheckScheduler.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/UpdateCheckScheduler.java), [`Fonts.loadRemainingAfterNextPaint`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Fonts.java)
    ([`UpdateCheckSchedulerTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/UpdateCheckSchedulerTest.java), [`FontsDeferredLoadFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FontsDeferredLoadFxTest.java), [`StartupDeferralFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StartupDeferralFxTest.java)). The template
    (`FirstPaint.then` in [`ui/Startup.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Startup.java)), Termina (`FirstFrame.after` in its [`App.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/App.java)) and Mirada
    (`afterFirstPaint` in [`ui/ViewerWindow.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/ui/ViewerWindow.java)) defer theirs the same way. Modula
    and nux don't yet: each starts its update check in the body of `start()` (`checkForUpdates` in
    [`ModulaApp.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ModulaApp.java), `maybeCheckForUpdates` in nux's [`App.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/App.java)).
- **PERF-16 · SHOULD.** The config read starts on a thread of its own before the toolkit does, so the two overlap
  and the wait for it that [PERF-01](#perf-01) allows at start-up, `start()` taking the result, is short. An app
  whose `start()` loads its settings itself does not meet this, whether or not `main` read the file earlier.
  - *Check (code):* `main` starts the config read on its own thread before `launch`, from an entry point that is
    not the `Application` subclass (the launcher starts the toolkit for one before its `main` runs), and `start()`
    takes that read's result instead of reading the files itself. A load `start()` makes only when the earlier read
    failed is a fallback and passes.
  - *Reference:* Editora's `config-prefetch` thread in [`App.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java) (`prefetchConfig`, joined once by
    `takeBootstrap`), entered through [`Launcher.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/Launcher.java). Mirada's `settings-read` thread in its [`App.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/App.java)
    (`readSettings`, joined by `settings()`) does the same in the native image, which enters through `Launcher`; its
    jlink image's main class is `App` itself, so there the toolkit is up before the read starts. Termina reads its
    settings in `Application.init()` (`prepare` in its [`App.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/App.java)): off the FX thread, so `start()` waits for
    nothing, but after the toolkit has started. The app template meets it: its [`Main.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/Main.java), not the `Application`
    subclass, starts `Startup.readAhead` on a thread of its own before `launch`, and `App.init` takes the result
    (`takePrepared` in [`ui/Startup.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Startup.java)), so `start()` reads no settings file. Torrenta
    ([`App.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/App.java)), Modula ([`ModulaApp.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ModulaApp.java)) and nux ([`App.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/App.java), which also reads the file once in
    `main` for the language) load their settings inside `start()`. Torrenta's `main` reads the file once as well, on the main thread, for its
    tray and badge settings.
- **PERF-17 · SHOULD.** The app ships precompiled stylesheets (`.bss`). The AOT cache, the other half of a fast
  start, is [REL-10](../release/#rel-10).
  - *Check (code):* the build converts the app's `.css` files to `.bss`, and the packaged app carries them.
  - *Reference:* Editora [`scripts/css2bss.java`](https://github.com/adriandeleon/Editora/blob/master/scripts/css2bss.java), run by the `css-to-bss` execution in [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml). No other app
    converts its own stylesheets yet.

## Measure, don't guess

- **PERF-18 · SHOULD.** Every change on a hot path says what it costs in its pull request: added FX-thread work,
  allocation per keystroke or scroll, extra layout passes, memory. "Negligible" is an answer; no answer is not.
  - *Check (by hand):* read the app's recent pull requests that touch a hot path.
  - *Reference:* Editora [`docs/performance.md`](https://github.com/adriandeleon/Editora/blob/master/docs/performance.md) (its opening paragraph).
- **PERF-19 · SHOULD.** Start-up is measured by a script that takes the median of several cold launches, and by
  phase marks in the app.
  - *Check (code):* the repository has the script, and `main` and the first paint record phase marks.
  - *Reference:* `scripts/measure-startup.sh` in Editora, Termina and Mirada; Editora [`perf/Startup.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/perf/Startup.java).
- **PERF-20 · SHOULD.** The app can sample its FX thread when something stalls.
  - *Check (code):* an environment variable or property turns on a sampler of the FX thread's stack.
  - *Reference:* Editora [`perf/Startup.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/perf/Startup.java) (`EDITORA_PERF_SAMPLE=1`, with `EDITORA_PERF=1`); Mirada [`perf/FxSampler.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/perf/FxSampler.java)
    (`MIRADA_PERF_SAMPLE=1`).
- **PERF-21 · SHOULD.** Each hot path that once regressed keeps a headless test.
  - *Check (test):* the fix for a hot-path regression adds a headless test that fails on the old code.
  - *Reference:* Editora [`MinimapDeferredRenderFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MinimapDeferredRenderFxTest.java).
- **PERF-22 · SHOULD.** A suspected regression gets a number before and after, from temporary `System.nanoTime`
  instrumentation if nothing better exists.
  - *Check (by hand):* the pull request that fixes it states both numbers.
  - *Reference:* Editora [`docs/performance.md`](https://github.com/adriandeleon/Editora/blob/master/docs/performance.md).
