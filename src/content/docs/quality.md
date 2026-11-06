---
title: "Code quality gates"
description: "NullAway, coverage floors and the guard tests that pay for themselves across the family."
---

- **NullAway is an error, not a warning.** Put `@Nullable` on what may be null and fix the report; do not
  suppress it. A new package starts with its own `package-info.java` carrying `@NullMarked`.
- **Coverage floors are a regression net, not a target.** The build-wide floor is 0.90 lines and methods.
  Each package of 300+ lines gets its own floor about three points below its measured level; when a
  package's coverage rises, ratchet its floor up. A test (`BuildHygieneTest`) fails when the documented
  floor table and the pom disagree.
- **Extract the decision, then test it** ([principle 12](../principles/#for-the-people-building-them)). **Prefer a pure decision helper plus unit tests.** Use the headless FX harness only when controller or
  toolkit behaviour is the point.
- **Tag FX tests `@Tag("fx")`**, so the pure suite runs alone with `-DexcludedGroups=fx`.
- **Guard tests that pay for themselves across the family:**
  - *Command sweep* runs every registered command in a real headless window (`CommandSweepFxTest`).
  - *Message parity*: every locale has every key; every `command.<id>` has a `.desc` (`MessagesTest`).
  - *Settings round trip*: every switch, number and choice survives a restart (`SettingsRoundTripFxTest`).
  - *Contrast*: text tokens keep their ratios in every theme (`StyleContrastTest`).
  - *Release supply chain*: signing and attestation steps stay where they are (`ReleaseSupplyChainTest`).
- **No sleeps in tests.** Own workers and FX callbacks with a scope (`AsyncTestScope`) and use latches.
- **A test window writes only inside its temp folders**, never in the real home directory.
- **Verify UI work in the running app** ([principle 13](../principles/#for-the-people-building-them)): a capture
  hook or headless screenshot of the real window, with real key and mouse events, before a UI change is called
  done.
- **A guard that cannot fail is decoration.** When you add a drift or parity test, break the thing it guards
  once and watch it fail. *(Modula's `DependenciesTest`.)*
