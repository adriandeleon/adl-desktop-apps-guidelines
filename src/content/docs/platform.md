---
title: "Platform baseline"
description: "JDK, JavaFX, AtlantaFX, NullAway, Maven Wrapper, tests and coverage: the stack every app shares."
---

- **PLAT-01 · MUST.** The app builds on **JDK 25 or newer**. `maven.compiler.release` 25 is the floor, not the
  ceiling: build and bundle a current JDK.
  - *Check (code):* `pom.xml` sets `maven.compiler.release` to 25 and the enforcer's `requireJavaVersion` to the
    open-ended range `[25,)`.
  - *Reference:* Editora `pom.xml`.
- **PLAT-02 · MUST.** The installers carry a jlinked runtime; users never install Java.
  - *Check (code):* the `dist` profile's jpackage step builds a jlinked app image (`jLinkOptions`) and wraps the
    installer around it.
  - *Reference:* Editora `pom.xml` (`dist` profile).
- **PLAT-03 · MUST.** The app builds on **JavaFX 27 or newer**.
  - *Check (code):* `pom.xml` sets `javafx.version` to 27 or later.
  - *Reference:* Editora `pom.xml`.
- **PLAT-04 · MUST.** The app is one named JPMS module, `com.<app>`, whose `module-info.java` opens only what
  reflection, FXML and Jackson need.
  - *Check (code):* `src/main/java/module-info.java` declares `module com.<app>`; each `opens` line serves FXML,
    Jackson or another reflective reader.
  - *Reference:* Editora `src/main/java/module-info.java`.
- **PLAT-05 · MUST.** Controls use **AtlantaFX 3.x** (`atlantafx-base`), with light and dark themes.
  - *Check (code):* `pom.xml` depends on `atlantafx-base` 3.x; the theme list offers at least one light and one
    dark theme.
  - *Reference:* Editora `pom.xml`, `ui/Themes.java`.
- **PLAT-06 · MUST.** App stylesheets take their colors from AtlantaFX `-color-*` tokens, or from state tokens
  built on them; no component rule carries a fixed hex. See [Icons and color](../icons-and-color/).
  - *Check (code):* `grep -nE '#[0-9a-fA-F]{3,8}\b' app.css` finds hexes only where a token is defined (a
    `ladder()` of the ground, a scoped `-color-*` block), not in a component's `-fx-*-color` or `-fx-fill`.
  - *Reference:* Editora `app.css`; `StyleContrastTest.severityAndDebugColoursComeFromTheStateTokens` holds the
    severity and debug colors. Editora's `app.css` still has fixed hexes in a few component rules (the breakpoint
    markers, the execution arrow, the editor area's defaults).
- **PLAT-07 · SHOULD.** The app bundles **Inter** (Regular, Bold, Italic, BoldItalic and `OFL.txt`), registers it
  with `Font.loadFont` before any stylesheet, and attaches `ui-font.css` to every scene and dialog pane.
  - *Why:* the family has one look on every OS.
  - *Check (code):* the four Inter `.ttf` files and `OFL.txt` are in the resources; one place loads them before
    the first stylesheet, and one listener adds `ui-font.css` to every window's scene.
  - *Reference:* Editora `ui/Fonts.java`; `App.installUiFont`.
- **PLAT-08 · MUST.** The build is **Maven** with the **Maven Wrapper** committed (`mvnw`, `mvnw.cmd`,
  `.mvn/wrapper/`), so `./mvnw` works on a clean machine.
  - *Check (code):* `mvnw`, `mvnw.cmd` and `.mvn/wrapper/maven-wrapper.properties` are in the repository.
  - *Reference:* Editora `mvnw`, `.mvn/wrapper/`.
- **PLAT-09 · MUST.** Nullness is declared with **JSpecify** and checked by **NullAway** on **Error Prone** at
  compile time. Every package is `@NullMarked` in its own `package-info.java`.
  - *Check (code):* the compiler arguments include `-Xep:NullAway:ERROR`; every source package has a
    `package-info.java` with `@NullMarked`.
  - *Reference:* Editora `pom.xml`, `docs/conventions.md#null-annotations-jspecify-checked-by-nullaway`.
- **PLAT-10 · MUST.** Code is formatted by **Spotless** with Palantir Java Format, and CI fails an unformatted
  change.
  - *Check (code):* the spotless plugin configures `palantirJavaFormat`, and a CI job runs `spotless:check`.
  - *Reference:* Editora `pom.xml` (spotless plugin), `.github/workflows/ci.yml` (*Format*).
- **PLAT-11 · MUST.** Tests run on **JUnit** (Jupiter, 5 or newer) and **TestFX** over JavaFX's built-in
  **Headless** glass platform (`-Dglass.platform=Headless`), so FX tests need no display, no xvfb and no Monocle.
  - *Check (code):* surefire's `systemPropertyVariables` set `glass.platform` to `Headless`; no Monocle dependency
    and no xvfb step in CI.
  - *Reference:* Editora `pom.xml` (surefire), `docs/testing.md`, `FxTestSupport`.
- **PLAT-12 · MUST.** A **JaCoCo** `check` runs at `mvn verify`: **≥ 0.90 lines, ≥ 0.90 methods**, ≥ 0.79
  branches, plus per-package floors.
  - *Check (code):* the `jacoco-check` execution is bound to `verify` with `BUNDLE` limits of 0.90 `LINE` and
    0.90 `METHOD`.
  - *Reference:* Editora `pom.xml` `jacoco-check`.
- **PLAT-13 · SHOULD.** The app logs through `java.util.logging`, captured in-app by the Debug Log.
  - *Check (code):* the Debug Log adds a handler to the root `java.util.logging` logger; the app's own code
    imports no other logging API.
  - *Reference:* Editora `ui/DebugLog.java`.
- **PLAT-14 · SHOULD.** JSON config files are Jackson POJOs, each with a `SCHEMA_VERSION`.
  - *Check (code):* every class written to the config folder declares `SCHEMA_VERSION` and a `schemaVersion`
    field.
  - *Reference:* Editora `config/Settings`, `config/migration/ConfigSchema.java`.

![Editora's Appearance settings page with font, theme and editor theme choices and a code preview](../../assets/shots/editora-themes-fonts.png "Settings → Appearance in Editora: language, fonts, app theme and editor theme, with a live preview.")

## Everyday commands (identical in every repo)

```bash
./mvnw javafx:run                 # run the app
./mvnw test                       # unit + headless FX tests, writes the JaCoCo report
./mvnw spotless:apply             # format
./mvnw verify                     # full gate: tests, coverage check, NullAway
./mvnw -Pfatjar package           # runnable fat jar for this OS
./mvnw clean -Pdist package       # native installer for this OS (clean is mandatory)
```

The `clean` in every `-Pdist` build is mandatory: incremental compilation can leave synthetic enum-switch
classes out of `target/classes`, and jlink then ships an app whose keyboard fails on the first keypress.
