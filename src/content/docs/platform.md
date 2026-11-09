---
title: "Platform baseline"
description: "JDK, JavaFX, AtlantaFX, NullAway, Maven Wrapper, tests and coverage: the stack every app shares."
---

- **PLAT-01 · MUST.** The app builds on **JDK 25 or newer**. `maven.compiler.release` 25 is the floor, not the
  ceiling: a newer JDK builds the app too. CI builds and bundles JDK 25, the current LTS, in every app
  ([REL-25](../release/#rel-25)); the family moves to the next LTS together, in an edition of Pauta.
  - *Check (code):* `pom.xml` sets `maven.compiler.release` to 25 or later and the enforcer's `requireJavaVersion` to the
    open-ended range `[25,)`.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; r=$(sed -n 's:.*<maven.compiler.release>\([0-9]*\)<.*:\1:p' pom.xml | head -n 1); [ "${r:-0}" -ge 25 ] && grep -qE '<version>\[2[5-9],\)</version>' pom.xml || { echo "maven.compiler.release ${r:-none}"; grep -nE 'requireJavaVersion|<version>\[' pom.xml; false; }`
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml).
- **PLAT-02 · MUST.** The installers carry a jlinked runtime; users never install Java.
  - *Check (code):* the `dist` profile's jpackage step builds a jlinked app image (`jLinkOptions`) and wraps the
    installer around it.
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml) (`dist` profile).
- **PLAT-03 · MUST.** The app builds on **JavaFX 27 or newer**.
  - *Check (code):* `pom.xml` sets `javafx.version` to 27 or later.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; v=$(sed -n 's:.*<javafx.version>\([0-9]*\).*:\1:p' pom.xml | head -n 1); echo "javafx.version ${v:-none}"; [ "${v:-0}" -ge 27 ]`
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml).
- **PLAT-04 · MUST.** The app is one named JPMS module, `com.<app>`, whose `module-info.java` opens only what
  reflection, FXML and Jackson need.
  - *Check (code):* `src/main/java/module-info.java` declares `module com.<app>`; each `opens` line serves FXML,
    Jackson or another reflective reader.
  - *Reference:* Editora [`src/main/java/module-info.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/module-info.java).
- **PLAT-05 · MUST.** Controls use **AtlantaFX 3.x** (`atlantafx-base`). The light and dark themes it carries are
  [ICON-15](../icons-and-color/#icon-15).
  - *Check (code):* `pom.xml` depends on `atlantafx-base` 3.x.
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml), [`ui/Themes.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/Themes.java).
- Colors come from AtlantaFX's `-color-*` tokens and the state tokens built on them, never a fixed hex in a
  component rule: [ICON-08](../icons-and-color/#icon-08).
- **PLAT-08 · MUST.** The build is **Maven** with the **Maven Wrapper** committed (`mvnw`, `mvnw.cmd`,
  `.mvn/wrapper/`), so `./mvnw` works on a clean machine.
  - *Check (code):* `mvnw`, `mvnw.cmd` and `.mvn/wrapper/maven-wrapper.properties` are in the repository.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; ! for f in mvnw mvnw.cmd .mvn/wrapper/maven-wrapper.properties; do test -f "$f" || echo "missing $f"; done | grep .`
  - *Reference:* Editora [`mvnw`](https://github.com/adriandeleon/Editora/blob/master/mvnw), [`.mvn/wrapper/`](https://github.com/adriandeleon/Editora/tree/master/.mvn/wrapper).
- **PLAT-09 · MUST.** Nullness is declared with **JSpecify** and checked by **NullAway** on **Error Prone** at
  compile time. Every package is `@NullMarked` in its own `package-info.java`.
  - *Check (code):* the compiler arguments include `-Xep:NullAway:ERROR`; every source package has a
    `package-info.java` with `@NullMarked`.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; { grep -q 'NullAway:ERROR' pom.xml || { echo 'no -Xep:NullAway:ERROR in pom.xml'; false; }; } && ! find src/main/java -name '*.java' ! -name package-info.java ! -name module-info.java -exec dirname {} \; | sort -u | while read -r d; do grep -qs '@NullMarked' "$d/package-info.java" || echo "not @NullMarked: $d"; done | grep .`
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml), [`docs/conventions.md#null-annotations-jspecify-checked-by-nullaway`](https://github.com/adriandeleon/Editora/blob/master/docs/conventions.md#null-annotations-jspecify-checked-by-nullaway).
- **PLAT-10 · MUST.** Code is formatted by **Spotless** with Palantir Java Format, and CI fails an unformatted
  change.
  - *Check (code):* the spotless plugin configures `palantirJavaFormat`, and CI runs its check: a `spotless:check`
    step, or the plugin's `check` goal bound to a phase a workflow runs (`./mvnw verify`).
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; { grep -q palantirJavaFormat pom.xml || { echo 'pom.xml configures no palantirJavaFormat'; false; }; } && { grep -rq 'spotless:check' .github/workflows || { sed -n '/spotless-maven-plugin/,/<\/plugin>/p' pom.xml | grep -q '<goal>check</goal>' && grep -rqE 'mvnw.* (verify|install|deploy)' .github/workflows; } || { echo 'CI runs neither spotless:check nor a phase the check goal is bound to'; false; }; }`
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml) (spotless plugin), [`.github/workflows/ci.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/ci.yml) (*Format*).
- **PLAT-11 · MUST.** Tests run on **JUnit** (Jupiter, 5 or newer) over JavaFX's built-in **Headless** glass platform
  (`-Dglass.platform=Headless`), so FX tests need no display, no xvfb and no Monocle. **TestFX** MAY drive them; an
  app that doesn't use it starts the toolkit with `Platform.startup` and runs its steps on the FX thread.
  - *Check (code):* surefire's `systemPropertyVariables` set `glass.platform` to `Headless`; no Monocle dependency,
    and no xvfb in a step that runs tests (a release leg may use it to train the AOT cache, [REL-10](../release/#rel-10)).
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml) (surefire), [`docs/testing.md`](https://github.com/adriandeleon/Editora/blob/master/docs/testing.md), [`FxTestSupport`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/ui/FxTestSupport.java), with TestFX;
    Termina [`pom.xml`](https://github.com/adriandeleon/Termina/blob/master/pom.xml) (surefire) and [`DialogAnswers`](https://github.com/adriandeleon/Termina/blob/master/src/test/java/com/termina/ui/DialogAnswers.java), without it.
- **PLAT-12 · MUST.** A **JaCoCo** `check` runs at `mvn verify` with build-wide floors of **≥ 0.90 lines and
  ≥ 0.90 methods**. The branch floor and each package's own floor are [QUAL-03](../quality/#qual-03).
  - *Check (code):* the `jacoco-check` execution is bound to `verify` with `BUNDLE` limits of 0.90 `LINE` and
    0.90 `METHOD`.
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml) `jacoco-check`.
- **PLAT-13 · SHOULD.** The app logs through `java.util.logging` and no other logging API. The Debug Log captures
  it: [DIAG-02](../diagnostics/#diag-02).
  - *Check (code):* the app's own code imports no logging API other than `java.util.logging`.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; ! grep -rnE '^import (static )?(org\.slf4j|org\.apache\.logging|org\.apache\.commons\.logging|ch\.qos\.logback|org\.jboss\.logging|org\.tinylog)\.' src/main/java`
  - *Reference:* Editora [`ui/DebugLog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/DebugLog.java).
- **PLAT-14 · SHOULD.** Config files are JSON, read and written by Jackson as plain classes (POJOs). Their schema
  versions and migrations are [SET-09](../settings/#set-09).
  - *Check (code):* every class written to the config folder is read and written through Jackson's
    `ObjectMapper`; no store builds or parses its JSON by hand.
  - *Reference:* Editora [`config/Settings`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/Settings.java), [`config/migration/ConfigSchema.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/migration/ConfigSchema.java).

The app's typeface is Inter, bundled and registered before any CSS and attached to every scene:
[ICON-01](../icons-and-color/#icon-01) and [ICON-02](../icons-and-color/#icon-02).

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
