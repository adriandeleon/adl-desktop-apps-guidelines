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
  `Process.waitFor()` there. One exception: at start-up, before the first window is built, `start()` may wait once
  for the config read that [PERF-16](#perf-16) began before the toolkit. An app that loads its settings inside
  `start()` instead, with no earlier read, has PERF-16's gap and none here.
  - *Check (code):* event handlers, listeners and `Platform.runLater` bodies call no `Files.*`, `HttpClient.send`,
    `ProcessBuilder.start`, `waitFor`, `Future.get`, `join` or `Thread.sleep`; that work runs on an executor or a
    virtual thread. `start()` holds at most one wait, the `join()` or `get()` on the config read begun before the
    toolkit; a settings load made in `start()` itself is judged under [PERF-16](#perf-16).
  - *Reference:* Editora [`docs/performance.md`](https://github.com/adriandeleon/Editora/blob/master/docs/performance.md) §1; its one start-up wait is `takeBootstrap` in [`App.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java),
    which joins the `config-prefetch` read. Editora does not hold the rule everywhere yet: some of its handlers
    still touch the disk on the FX thread, for example `renameFileTo` (`Files.exists`, `Files.move`) and
    `openPersonalDictionary` (`Files.writeString`) in [`ui/MainController.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java) and the new-folder prompt in
    [`ui/ProjectPanel.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ProjectPanel.java) (`Files.createDirectories`).
- **PERF-02 · MUST.** Touch the scene graph only on the FX thread. Background work hands its result back with
  `Platform.runLater`; nothing else creates, changes or reads live nodes.
  - *Check (code):* every executor task or thread body that ends in UI work wraps that work in
    `Platform.runLater`.
  - *Reference:* every Editora service, for example [`git/GitService.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/git/GitService.java).
- **PERF-03 · MUST.** A background result is applied under a generation guard, so an answer to an old request never
  overwrites a newer one.
  - *Check (code):* each request takes a generation (`AtomicLong.incrementAndGet`) or goes through `LatestOnly`,
    and its result is applied only while that generation is still current, checked again inside the `runLater`.
  - *Reference:* Editora [`git/GitService.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/git/GitService.java), [`search/SearchService.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/search/SearchService.java), [`ui/LatestOnly.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/LatestOnly.java)
    ([`LatestOnlyTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/LatestOnlyTest.java)).
- **PERF-04 · SHOULD.** Every thread is named and is a daemon.
  - *Why:* a thread dump then says what is running, and a stray worker never keeps the app alive after its last
    window closes.
  - *Check (code):* every `Executors.new…` and `new Thread` gets a name and `setDaemon(true)`, through a thread
    factory such as `daemon("my-feature")`; virtual threads are daemons already.
  - *Reference:* Editora [`terminal/TerminalExecutors.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/terminal/TerminalExecutors.java) (its `daemon(name)` thread factory); the canonical
    shape is in [The UI thread](#the-ui-thread).
- **PERF-05 · MUST.** Blocking work stays off the common `ForkJoinPool`, and a `Process` subclass overrides
  `onExit()`.
  - *Why:* the common pool has one worker fewer than the machine has cores, so a few blocked waits
    (`CompletableFuture.supplyAsync` of a `waitFor`) starve every other user of it.
  - *Check (code):* no `supplyAsync` or `runAsync` without an executor wraps a blocking call, and every class that
    extends `Process` overrides `onExit()`.
  - *Reference:* Editora [`process/ExitWatch.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/process/ExitWatch.java), [`docs/gotchas.md`](https://github.com/adriandeleon/Editora/blob/master/docs/gotchas.md). Editora's [`DapManager.reportJavaExit`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/dap/DapManager.java) still
    waits up to 3 s for an exit code in a `supplyAsync` on the common pool.

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
  queued.
  - *Check (code):* a redraw request sets a flag (Editora's are named `…Pending`) and schedules one pass, and a
    request that finds the flag set schedules nothing.
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
- **PERF-07 · MUST.** Streams (process output, logs, progress) reach the FX thread in batches at least 16 ms
  apart, never one `runLater` per line.
  - *Check (code):* a reader thread appends to a buffer that the FX thread drains, with a minimum interval
    between drains.
  - *Reference:* Editora [`process/OutputPump.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/process/OutputPump.java) (`MIN_DRAIN_INTERVAL_MILLIS`), [`ui/ConsoleAppender.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ConsoleAppender.java).
- **PERF-08 · MUST.** Work only on what is visible and only on what changed: no O(document) or O(list) work per
  keystroke, scroll or tick. Anything that can grow is shown in a virtualized control (`ListView`, `TableView`, a
  fixed cell size).
  - *Check (code):* a listener on text, scroll or a timer re-processes the edited range or the visible rows, never
    the whole document or list; growing lists are `ListView` or `TableView`, not a `VBox` of nodes.
  - *Reference:* Editora [`editor/highlight/HighlightPass.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/highlight/HighlightPass.java), [`editor/minimap/MinimapRows.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/minimap/MinimapRows.java).
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
  - *Check (test):* each such store has a test that fills it past its cap and finds the oldest dropped.
  - *Reference:* Editora [`ui/MessageLog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MessageLog.java) (200 entries, the oldest dropped; [`MessageLogTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MessageLogTest.java)), [`ui/DebugLog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/DebugLog.java)
    (2,000 records, the oldest dropped; [`DebugLogTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/DebugLogTest.java)), and [`test/OutputCap.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/test/OutputCap.java), which keeps the head and the tail of one
    test's output (200,000 characters) with a note between them of how much was cut. The note is Editora's choice,
    not part of the rule.
- **PERF-12 · MUST.** In an app that opens files or data the user picks, a large input is guarded before it loads:
  its size is checked before its content is read, or the read is capped, and what will not fit is never read in.
  The app refuses it with a message or opens only the part that fits. Where an input can open with less, as a file
  in an editor can, the app steps down as the input grows: expensive features turn off past one threshold, and past
  another it opens read-only or capped.
  - *Check (code):* the code that loads a picked file or import compares its size against a named limit before
    reading the content, or reads through a cap, and refuses or cuts what passes the limit. Where the app can open an
    input with less, a lower named threshold turns the expensive features off and a higher one opens it read-only or
    capped.
  - *Reference:* Editora, whose tiers are the example: [`EditorBuffer.LARGE_FILE_BYTES`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editor/EditorBuffer.java) (5 MB: no highlighting, no minimap) and
    `HUGE_FILE_BYTES` (50 MB: read-only and cut to 50 MB), and [`ui/LoadHeapGuard.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/LoadHeapGuard.java), which caps a load at
    what the free heap affords ([`LoadHeapGuardTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/LoadHeapGuardTest.java)). Termina's theme import has nothing to step down to:
    `importFile` in [`ui/Themes.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/ui/Themes.java) reads at most 8 MB and [`theme/ThemeImport.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/theme/ThemeImport.java) refuses a file over 4 MB.
- **PERF-13 · MUST.** A closed window releases what it held: listeners, timers, executors, file watchers, native
  resources.
  - *Check (test):* a test opens and closes windows and checks nothing is left running.
  - *Reference:* Editora [`FxWindowFixture.dispose`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FxWindowFixture.java) ([`FxWindowFixtureLifecycleFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FxWindowFixtureLifecycleFxTest.java)), [`ClosedLspManagers`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/lsp/ClosedLspManagers.java).

## Start-up

- **PERF-14 · MUST.** The first frame comes first: only what the first window shows is built before it. Everything
  else builds on first open: a closed panel's content, the Settings pages, the dialogs and the other windows.
  - *Check (test):* a test opens the first window and finds nothing built that it does not show: no Settings page,
    no dialog, no other window and, in an app with tool panels, no closed panel's content.
  - *Reference:* Editora's lazy [`ToolWindow`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/ToolWindow.java) suppliers. [`LazyToolWindowsFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/LazyToolWindowsFxTest.java) holds the tool-panel
    part alone: no closed tool window has built its panel, with one exemption, the shared Output console
    (`buildOutput`), which Editora builds with the window because every build writes to it while it is closed.
    Editora's Settings pages are built on the first `show` ([`ui/SettingsWindow.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/SettingsWindow.java)), but no test of its first
    window looks for them, for a dialog or for another window.
- **PERF-15 · MUST.** What nobody waits for starts after the first frame has painted: the update check, extra
  fonts, indexes and caches.
  - *Check (test):* a test finds the deferred work not started before the first paint.
  - *Reference:* Editora [`ui/UpdateCheckScheduler.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/UpdateCheckScheduler.java), [`Fonts.loadRemainingAfterNextPaint`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Fonts.java)
    ([`UpdateCheckSchedulerTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/UpdateCheckSchedulerTest.java), [`FontsDeferredLoadFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FontsDeferredLoadFxTest.java), [`StartupDeferralFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/StartupDeferralFxTest.java)).
- **PERF-16 · SHOULD.** The config read starts on a thread of its own before the toolkit does, so the two overlap
  and the one wait [PERF-01](#perf-01) allows, `start()` taking the result, is short. An app that loads its settings
  inside `start()`, with no earlier read, does not meet this.
  - *Check (code):* `main` starts the config read on its own thread before `launch`, from an entry point that is
    not the `Application` subclass (the launcher starts the toolkit for one before its `main` runs), and `start()`
    takes that read's result instead of reading the files itself. A load `start()` makes only when the earlier read
    failed is a fallback and passes.
  - *Reference:* Editora's `config-prefetch` thread in [`App.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/App.java) (`prefetchConfig`, joined once by
    `takeBootstrap`), entered through [`Launcher.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/Launcher.java). Mirada's `settings-read` thread in its [`App.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/App.java)
    (`readSettings`, joined by `settings()`) does the same in the native image, which enters through `Launcher`; its
    jlink image's main class is `App` itself, so there the toolkit is up before the read starts. Termina reads its
    settings in `Application.init()` (`prepare` in its [`App.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/App.java)): off the FX thread, so `start()` waits for
    nothing, but after the toolkit has started. The template (`ConfigStore.open` in [`ui/Startup.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/ui/Startup.java)), Torrenta
    ([`App.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/App.java)), Modula ([`ModulaApp.java`](https://github.com/adriandeleon/Modula/blob/master/src/main/java/com/modula/ModulaApp.java)) and nux ([`App.java`](https://github.com/adriandeleon/nux/blob/master/src/main/java/com/nux/App.java), which also reads the file once in
    `main` for the language) load their settings inside `start()`.
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
  - *Reference:* Editora [`perf/Startup.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/perf/Startup.java) (`EDITORA_PERF_SAMPLE=1`); Mirada [`perf/FxSampler.java`](https://github.com/adriandeleon/Mirada/blob/main/src/main/java/com/mirada/perf/FxSampler.java)
    (`MIRADA_PERF_SAMPLE=1`).
- **PERF-21 · SHOULD.** Each hot path that once regressed keeps a headless test.
  - *Check (test):* the fix for a hot-path regression adds a headless test that fails on the old code.
  - *Reference:* Editora [`MinimapDeferredRenderFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/MinimapDeferredRenderFxTest.java).
- **PERF-22 · SHOULD.** A suspected regression gets a number before and after, from temporary `System.nanoTime`
  instrumentation if nothing better exists.
  - *Check (by hand):* the pull request that fixes it states both numbers.
  - *Reference:* Editora [`docs/performance.md`](https://github.com/adriandeleon/Editora/blob/master/docs/performance.md).
