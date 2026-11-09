# Code quality gates

> NullAway, coverage floors and the guard tests that pay for themselves across the family.

Pauta 4.5.0 (2026-11-08). The page with its screenshots and mockups: https://pauta-project.dev/4.5.0/quality/.
Every rule of the edition: https://pauta-project.dev/4.5.0/llms-full.txt.

NullAway runs as an error on every package, each `@NullMarked` in its own `package-info.java`:
[PLAT-09](https://pauta-project.dev/4.5.0/platform/#plat-09). What follows is how to live with it.

- **QUAL-02 · SHOULD.** A NullAway report is fixed, not suppressed: put `@Nullable` on what may be null.
  - *Check (code):* `grep -rn '@SuppressWarnings("NullAway")' src/main` finds nothing.
  - *Reference:* Editora; one suppression is left, in [`recovery/RecoveryCodec.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/recovery/RecoveryCodec.java).
- **QUAL-03 · SHOULD.** Coverage floors are a regression net, not a target. Beyond the build-wide floor of 0.90
  lines and methods, each package of 300+ lines gets its own floor about three points below its measured level;
  when a package's coverage rises, its floor is ratcheted up.
  - *Check (code):* the `jacoco-check` rules in `pom.xml` carry a `PACKAGE` line floor for each large package.
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml) `jacoco-check`.
- **QUAL-04 · SHOULD.** When a guide quotes the coverage floors, a test fails when the quoted table and the pom
  disagree.
  - *Check (test):* a build test reads the `jacoco-check` rules from `pom.xml` and compares them with the guide's
    table.
  - *Reference:* Editora [`BuildHygieneTest.theCoverageFloorsQuotedInTheTestingGuideAreTheOnesTheBuildEnforces`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/packaging/BuildHygieneTest.java),
    [`docs/testing.md`](https://github.com/adriandeleon/Editora/blob/master/docs/testing.md).
- **QUAL-05 · MUST.** Extract the decision, then test it ([principle 12](https://pauta-project.dev/4.5.0/principles/#for-the-people-building-them)).
  Prefer a pure decision helper plus unit tests; use the headless FX harness only when controller or toolkit
  behavior is the point.
  - *Check (code):* enablement, visibility and navigation rules sit in classes that import no `javafx` type, each
    with a unit test not tagged `fx`.
  - *Reference:* Editora [`docs/testing.md`](https://github.com/adriandeleon/Editora/blob/master/docs/testing.md) (*Prefer pure logic*): [`ui/Chrome`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Chrome.java), [`editops/TextNav`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/editops/TextNav.java),
    [`config/PathKeys`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/PathKeys.java), each with a plain unit test.
- **QUAL-06 · MUST.** FX tests are tagged `@Tag("fx")`, so the pure suite runs alone with
  `-DexcludedGroups=fx`.
  - *Check (code):* every test class that boots the toolkit (`FxTestSupport`, `FxToolkit`) carries `@Tag("fx")`.
  - *Reference:* Editora [`docs/testing.md`](https://github.com/adriandeleon/Editora/blob/master/docs/testing.md). Editora does not hold it fully yet: about twenty `*FxTest` classes,
    most of them `ProjectMap*FxTest`, carry no tag.
- **QUAL-07 · SHOULD.** Tests do not sleep. Workers and FX callbacks are owned by a scope (`AsyncTestScope`), and
  tests wait on latches.
  - *Check (code):* `grep -rn 'Thread.sleep' src/test` finds nothing.
  - *Reference:* Editora [`AsyncTestScope`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/AsyncTestScope.java), [`docs/testing.md`](https://github.com/adriandeleon/Editora/blob/master/docs/testing.md). Many older Editora tests still poll with
    `Thread.sleep`.
- **QUAL-08 · SHOULD.** A test window writes only inside its temp folders, never in the real home directory.
  - *Check (test):* the command sweep checks the home directory after running every command.
  - *Reference:* Editora [`CommandSweepFxTest.leftInTheHomeDirectory`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/CommandSweepFxTest.java).
- **QUAL-09 · MUST.** UI work is verified in the running app
  ([principle 13](https://pauta-project.dev/4.5.0/principles/#for-the-people-building-them)): a capture hook or headless screenshot of the real
  window, with real key and mouse events, before a UI change is called done.
  - *Check (code):* the app has a capture hook (`DevCapture`) or a headless fixture that builds the real window.
  - *Reference:* Editora [`FxWindowFixture`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FxWindowFixture.java) (the real [`MainController`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/MainController.java) window, headless); Torrenta and Termina
    `DevCapture.java`.
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
  - *Reference:* Editora [`SettingsRoundTripFxTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/SettingsRoundTripFxTest.java).
- **QUAL-15 · SHOULD.** A release supply-chain test keeps the signing and attestation steps where they are.
  - *Check (test):* a test reads the workflows and fails when a signing, notarization or attestation step moves or
    goes.
  - *Reference:* Editora [`ReleaseSupplyChainTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/packaging/ReleaseSupplyChainTest.java).

Two more guard tests are rules on the pages they guard: the message parity test is
[INTL-08](https://pauta-project.dev/4.5.0/i18n/#intl-08) (every key in every catalog) and [DOCS-09](https://pauta-project.dev/4.5.0/documentation/#docs-09) (every command has a
description), and the contrast test is [ICON-14](https://pauta-project.dev/4.5.0/icons-and-color/#icon-14).
