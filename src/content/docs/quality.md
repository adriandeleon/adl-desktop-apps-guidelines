---
title: "Code quality gates"
description: "NullAway, coverage floors and the guard tests that pay for themselves across the family."
---

The [Platform baseline](../platform/) turns the checks on: NullAway as an error on every package, each
`@NullMarked` in its own `package-info.java` ([PLAT-09](../platform/#plat-09)), and JaCoCo's build-wide coverage
floors ([PLAT-12](../platform/#plat-12)). This page is how to live with them and what to test beyond them: fix a
nullness report instead of hiding it, keep each decision in a pure helper with unit tests
([principle 12](../principles/)), keep the FX tests tagged, free of sleeps and out of the real home folder, look at
the real window with nobody at the screen ([principle 13](../principles/)), and back the claims that matter (every
command runs, every setting survives a restart, the release still signs) with guard tests that have been seen to
fail. These are the gates that have paid for themselves across the family.

- **QUAL-02 · SHOULD.** A NullAway report is fixed, not suppressed: put `@Nullable` on what may be null.
  - *Check (code):* `grep -rn '@SuppressWarnings("NullAway")' src/main` finds nothing.
  - *Reference:* Editora; one suppression is left, in [`recovery/RecoveryCodec.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/recovery/RecoveryCodec.java).
- **QUAL-03 · SHOULD.** Coverage floors are a regression net, not a target. Beyond the build-wide floor of 0.90
  lines and methods ([PLAT-12](../platform/#plat-12)), the build holds a branch floor (Editora's is 0.79), and
  each package of 300+ lines gets its own floor about three points below its measured level; when a package's
  coverage rises, its floor is ratcheted up.
  - *Check (code):* the `jacoco-check` rules in `pom.xml` carry a `BUNDLE` `BRANCH` limit and a `PACKAGE` line floor
    for each large package.
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml) `jacoco-check`.
- **QUAL-04 · SHOULD.** When a guide quotes the coverage floors, a test fails when the quoted table and the pom
  disagree.
  - *Check (test):* a build test reads the `jacoco-check` rules from `pom.xml` and compares them with the guide's
    table.
  - *Reference:* Editora [`BuildHygieneTest.theCoverageFloorsQuotedInTheTestingGuideAreTheOnesTheBuildEnforces`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/packaging/BuildHygieneTest.java),
    [`docs/testing.md`](https://github.com/adriandeleon/Editora/blob/master/docs/testing.md).
- **QUAL-05 · SHOULD.** Extract the decision, then test it ([principle 12](../principles/#for-the-people-building-them)):
  what decides whether a control is enabled or shown, or where a key or a click leads, sits in a pure helper
  with unit tests. The headless FX harness is for a test whose point is controller or toolkit behavior.
  - *Check (code):* enablement, visibility and navigation rules sit in classes that import no `javafx` type, each
    with a unit test that does not carry the FX tests' tag ([QUAL-06](#qual-06)).
  - *Reference:* Editora [`docs/testing.md`](https://github.com/adriandeleon/Editora/blob/master/docs/testing.md) (*Prefer pure logic*): [`ui/Chrome`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Chrome.java), [`editops/TextNav`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editops/TextNav.java),
    [`config/PathKeys`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/PathKeys.java), each with a plain unit test.
- **QUAL-06 · MUST.** Every test class that boots the JavaFX toolkit carries one JUnit tag, the same for all of
  them (Editora's is `fx`), so the pure suite runs alone by excluding that tag (`-DexcludedGroups=fx` in Editora).
  - *Check (code):* every test class that boots the toolkit (`Platform.startup`, `FxToolkit`, or a helper that
    calls one, such as Editora's `FxTestSupport`) carries the app's FX tag in a JUnit `@Tag`, whatever the tag is
    called (`@Tag("fx")` in Editora).
  - *Reference:* Termina holds it by test: [`FxTestTagsTest`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/FxTestTagsTest.java) fails when a test source that names
    `Platform.startup(` or `FxToolkit.` has no `@Tag("fx")`. Editora states it in [`docs/testing.md`](https://github.com/adriandeleon/Editora/blob/master/docs/testing.md) and does not
    hold it fully yet: 33 of its `*FxTest` classes, 18 of them `ProjectMap*FxTest`, carry no tag. Torrenta doesn't
    yet: 26 of its test classes start the toolkit through its [`FxToolkit`](https://github.com/adriandeleon/torrenta/blob/master/src/test/java/com/torrenta/ui/FxToolkit.java) extension, and no test in the
    repository carries a tag.
- **QUAL-07 · SHOULD.** Tests do not sleep. A scope owns the workers and FX callbacks (Editora's
  `AsyncTestScope`), and tests wait on latches.
  - *Check (code):* `grep -rn 'Thread.sleep' src/test` finds nothing.
  - *Reference:* Editora [`AsyncTestScope`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/AsyncTestScope.java), [`docs/testing.md`](https://github.com/adriandeleon/Editora/blob/master/docs/testing.md). Many older Editora tests still poll with
    `Thread.sleep`.
- **QUAL-08 · SHOULD.** A test window writes only inside its temp folders, never in the real home directory.
  - *Check (code):* the fixture that builds a test window gives it a temp config folder, and points every other
    folder a command writes to (the one a configuration export lands in, say) at a temp folder too. A test that
    asserts it is the surest evidence.
  - *Reference:* Editora [`FxWindowFixture`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FxWindowFixture.java) (a temp config folder and a temp export folder for each window);
    [`CommandSweepFxTest.leftInTheHomeDirectory`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/CommandSweepFxTest.java) looks in the home directory after running every command.
- **QUAL-09 · MUST.** The app has a way to show its real window with nobody at the screen: a capture hook that
  saves a screenshot of it, or a headless fixture that builds it as the app does. That is what verifies UI work in
  the running app ([principle 13](../principles/#for-the-people-building-them)), with real key and mouse events,
  before a UI change is called done.
  - *Check (code):* the app has a capture hook (Termina's `DevCapture`) or a headless fixture (Editora's
    `FxWindowFixture`) that builds the real window through the code the app itself starts with.
  - *Reference:* Editora [`FxWindowFixture`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FxWindowFixture.java) (the real [`MainController`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java) window, headless); Torrenta's
    [`DevCapture.java`](https://github.com/adriandeleon/torrenta/blob/master/src/main/java/com/torrenta/DevCapture.java) and Termina's [`DevCapture.java`](https://github.com/adriandeleon/Termina/blob/master/src/main/java/com/termina/DevCapture.java).
- **QUAL-10 · SHOULD.** A guard that cannot fail is decoration. When you add a drift or parity test, break the
  thing it guards once and watch it fail.
  - *Check (by hand):* break what the new test guards, run it, and see it fail.
  - *Reference:* Modula's [`DependenciesTest`](https://github.com/adriandeleon/Modula/blob/master/src/test/java/com/modula/DependenciesTest.java).

Guard tests that pay for themselves across the family:

- **QUAL-11 · SHOULD.** A command sweep runs every registered command in a real headless window.
  - *Check (test):* one FX test iterates the registry and runs each command.
  - *Reference:* Editora [`CommandSweepFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/CommandSweepFxTest.java).
- **QUAL-13 · SHOULD.** A settings round trip shows that every switch, number and choice survives a restart.
  - *Check (test):* one FX test sets every control, reloads the settings and reads each back.
  - *Reference:* Editora [`SettingsRoundTripFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/SettingsRoundTripFxTest.java); the app template's [`SettingsRoundTripFxTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/ui/SettingsRoundTripFxTest.java)
    (`everyControlSurvivesARestart`), which changes every combo box, switch and field on every Settings page,
    restarts on the same folder and reads each one back.
- **QUAL-15 · SHOULD.** A release supply-chain test keeps the signing and attestation steps where they are.
  - *Check (test):* a test reads the workflows and fails when a signing, notarization or attestation step moves or
    goes.
  - *Reference:* Editora [`ReleaseSupplyChainTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/packaging/ReleaseSupplyChainTest.java).

Two more guard tests are rules on the pages they guard: the message parity test is
[INTL-08](../i18n/#intl-08) (every key in every catalog) and [KBD-03](../keyboard/#kbd-03) (every command has a
title and a description), and the contrast test is [ICON-14](../icons-and-color/#icon-14).
