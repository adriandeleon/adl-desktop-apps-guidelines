---
title: "Performance"
description: "Keep the JavaFX application thread free, coalesce work, bound memory, and measure: the rules that keep every app responsive."
---

A desktop app is judged by how it feels under the hand: a key that lags or a window that hangs while it reads a
file is a defect, not a slow feature. These rules come from Editora's
[`docs/performance.md`](https://github.com/adriandeleon/Editora/blob/master/docs/performance.md), the contract
every change on a hot path there must honor.

## The UI thread

| Rule | Level | Editora reference |
|---|---|---|
| **Never block the JavaFX application thread.** No file or network I/O, no process start or wait, no parsing, searching, hashing or JSON of any size on it. No `Thread.sleep`, `Future.get()`, `join()` or `Process.waitFor()` there. | MUST | `docs/performance.md` §1 |
| **Touch the scene graph only on the FX thread.** Background work hands its result back with `Platform.runLater`; nothing else creates, changes or reads live nodes. | MUST | every service |
| **Drop stale results.** A background result is applied under a generation guard, so an answer to an old request never overwrites a newer one. | MUST | `GitService`, `SearchService`, `LatestOnly` |
| **Name your threads and make them daemons**, so a thread dump says what is running and a stray worker never keeps the app alive after its last window closes. | SHOULD | `daemon("my-feature")` |
| **Leave the common ForkJoinPool alone for blocking work.** It has one worker fewer than the machine has cores; a few blocked waits (`CompletableFuture.supplyAsync` of a `waitFor`) starve every other user of it. A `Process` subclass overrides `onExit()`. | MUST | `ExitWatch`, `docs/gotchas.md` |

The canonical shape, used by every Editora service:

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

For one-off blocking calls (reading a file, stat-ing a path, starting a process), a virtual thread
(`Thread.ofVirtual().start(…)`) is enough; the result still comes back through `Platform.runLater`.

## Hot paths

Each app names its hot paths: what runs on every keystroke, scroll pulse or progress tick. In Editora they are
typing, scrolling, highlighting, the overlays and the gutter. In Torrenta they are the transfer table's refresh,
in Termina the terminal grid, in Mirada stepping between images.

| Rule | Level | Editora reference |
|---|---|---|
| **Debounce and coalesce.** At most one redraw per pulse, with a `pending` flag; text-driven work waits for typing to pause. Streams (process output, logs, progress) are delivered in batches, at least 16 ms apart, never one `runLater` per line. | MUST | `FxThrottle`, `OutputPump`, `ConsoleAppender` |
| **Work only on what is visible, and only on what changed.** No O(document) or O(list) work per keystroke, scroll or tick; re-process the edited range or the visible rows. Use virtualized controls (`ListView`, `TableView`, a fixed cell size) for anything that can grow. | MUST | `HighlightPass`, `MinimapRows` |
| **Allocate little on a hot path.** Reuse buffers and arrays; cache data a repaint only reads. | SHOULD | minimap stripes |
| **Keep CSS cheap.** No `applyCss()` on a large subtree, stable style classes, and spans of the same style merged before they are applied. | SHOULD | `SpanMerger`, `docs/gotchas.md` |

## Memory and size

| Rule | Level | Editora reference |
|---|---|---|
| **Bound everything that grows**: logs, histories, consoles, caches, undo. Keep the newest, keep a note of what was cut. | MUST | `MessageLog` (200), `DebugLog`, `OutputCap` |
| **Guard large inputs.** Decide by size and shape before loading: turn off expensive features past a threshold, open read-only or capped past another, refuse what will not fit the free heap. | MUST | 5 MB / 50 MB guards, `LoadHeapGuard` |
| **Release what a closed window held**: listeners, timers, executors, file watchers, native resources. A test opens and closes windows and checks nothing is left. | MUST | `FxWindowFixture.dispose`, `ClosedLspManagers` |

## Start-up

| Rule | Level | Editora reference |
|---|---|---|
| **The first frame first.** Build only what the first window shows; tool windows, panels and pages build on first open. | MUST | lazy `ToolWindow` suppliers, `LazyToolWindowsFxTest` |
| **Defer what nobody waits for**: the update check, extra fonts, indexes and caches start after the first frame has painted. | MUST | `UpdateCheckScheduler`, `Fonts.loadRemainingAfterNextPaint` |
| **Read config off the FX thread**, before the toolkit needs it. | SHOULD | the `config-prefetch` thread |
| **Ship precompiled stylesheets (`.bss`) and an AOT cache** trained on a real session. | SHOULD | `css2bss`, `aot_build.java`; Termina's and Mirada's `aot-train.sh` |

## Measure, don't guess

- **Every change on a hot path says what it costs** in its pull request: added FX-thread work, allocation per
  keystroke or scroll, extra layout passes, memory. "Negligible" is an answer; no answer is not.
- **Measure start-up** with a script that takes the median of several cold launches
  (`scripts/measure-startup.sh` in Editora and Mirada) and phase marks in the app (`perf/Startup`).
- **Sample the FX thread** when something stalls (`EDITORA_PERF_SAMPLE=1`), and keep a headless test for each
  hot path that once regressed.
- A suspected regression gets a number before and after, from temporary `System.nanoTime` instrumentation if
  nothing better exists.
