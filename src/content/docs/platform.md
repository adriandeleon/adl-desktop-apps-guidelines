---
title: "Platform baseline"
description: "JDK, JavaFX, AtlantaFX, NullAway, Maven Wrapper, tests and coverage: the stack every app shares."
---

- **PLAT-01 · MUST.** The app builds on **JDK 25 or newer**. `maven.compiler.release` 25 is the floor, not the
  ceiling: a newer JDK builds the app too. CI builds and bundles JDK 25, the current LTS, in every app
  ([REL-25](../release/#rel-25)); the family moves to the next LTS together, in an edition of Pauta.
  - *Check (code):* `pom.xml` sets `maven.compiler.release` to 25 or later. Where the build has an enforcer
    `requireJavaVersion` rule, its range is the open-ended `[25,)`: it starts at 25 and has no upper bound. An app with
    no such rule passes, and a rule inside a profile is not counted.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; r=$(sed -n 's:.*<maven.compiler.release>\([0-9]*\)<.*:\1:p' pom.xml | head -n 1); j=$(sed -n '/<profiles>/,/<\/profiles>/!p' pom.xml | tr -d ' \t\r\n' | tr '<' '\n' | sed -n '/^requireJavaVersion>/,/^\/requireJavaVersion>/s/^version>//p'); [ "${r:-0}" -ge 25 ] && ! echo "$j" | grep -vxF '[25,)' | grep -q . || { echo "maven.compiler.release ${r:-none}; requireJavaVersion outside profiles:" ${j:-none}; false; }`
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml).
- **PLAT-02 · SHOULD.** The installers carry a jlinked runtime; users never install Java.
  - *Check (code):* the `dist` profile's jpackage step builds a jlinked app image (`jLinkOptions`) and wraps the
    installer around it, and that image is what the release ships.
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml) (`dist` profile). Mirada ships a GraalVM native image instead on every target
    GraalVM builds one for, all but Intel macOS, which gets the jlinked image: [`scripts/native-app-image.sh`](https://github.com/adriandeleon/Mirada/blob/main/scripts/native-app-image.sh) takes the
    Java runtime out of the app image, and users still install nothing.
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
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; [ -d src/main/java ] || { echo 'no src/main/java'; exit 1; }; { grep -q 'NullAway:ERROR' pom.xml || { echo 'no -Xep:NullAway:ERROR in pom.xml'; false; }; } && ! find src/main/java -name '*.java' ! -name package-info.java ! -name module-info.java -exec dirname {} \; | sort -u | while read -r d; do grep -qs '@NullMarked' "$d/package-info.java" || echo "not @NullMarked: $d"; done | grep .`
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml), [`docs/conventions.md#null-annotations-jspecify-checked-by-nullaway`](https://github.com/adriandeleon/Editora/blob/master/docs/conventions.md#null-annotations-jspecify-checked-by-nullaway).
- **PLAT-10 · MUST.** Code is formatted by **Spotless** with Palantir Java Format, and CI fails an unformatted
  change in a Format job of its own ([REL-19](../release/#rel-19)).
  - *Why:* a check bound to a build phase fails in the same job as the tests, so the failed job does not say which
    of the two is wrong.
  - *Check (code):* the spotless plugin configures `palantirJavaFormat`, and a job runs `spotless:check` in a
    workflow that runs on pull requests. The plugin's `check` goal bound to a phase (`./mvnw verify`) does not meet
    it alone.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; grep -q palantirJavaFormat pom.xml || { echo 'pom.xml configures no palantirJavaFormat'; exit 1; }; for f in .github/workflows/*.yml .github/workflows/*.yaml; do grep -qE '^[^#]*spotless:check' "$f" 2>/dev/null && grep -qE '^( *-? *|on:.*)pull_request' "$f" && exit 0; done; w=$(grep -lE '^[^#]*spotless:check' .github/workflows/* 2>/dev/null); echo "no workflow with a pull_request trigger runs spotless:check (named in: ${w:-no workflow})"; exit 1`
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml) (spotless plugin), [`.github/workflows/ci.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/ci.yml) (the `format` job, *Format*); the
    template, Termina and Mirada have the same job in their `ci.yml`. Torrenta and Modula do not yet: their `test`
    job runs `./mvnw verify`, the phase the check is bound to, and no job runs `spotless:check`. nux has no Spotless.
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
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; [ -d src/main/java ] || { echo 'no src/main/java'; exit 1; }; ! grep -rnE '^import (static )?(org\.slf4j|org\.apache\.logging|org\.apache\.commons\.logging|ch\.qos\.logback|org\.jboss\.logging|org\.tinylog)\.' src/main/java`
  - *Reference:* Editora [`ui/DebugLog.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/DebugLog.java).
- **PLAT-14 · SHOULD.** Config files are JSON, read and written by Jackson as plain classes (POJOs). Their schema
  versions and migrations are [SET-09](../settings/#set-09).
  - *Check (code):* every class written to the config folder is read and written through Jackson's
    `ObjectMapper`; no store builds or parses its JSON by hand.
  - *Reference:* Editora [`config/Settings`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/Settings.java), [`config/migration/ConfigSchema.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/config/migration/ConfigSchema.java).

The app's typeface is Inter, bundled and registered before any CSS and attached to every scene:
[ICON-01](../icons-and-color/#icon-01) and [ICON-02](../icons-and-color/#icon-02).

![Editora's Appearance settings page with font, theme and editor theme choices and a code preview](../../assets/shots/editora-themes-fonts.png "Settings → Appearance in Editora: language, fonts, app theme and editor theme, with a live preview.")

## Everyday commands

```bash
./mvnw javafx:run                 # run the app
./mvnw test                       # unit + headless FX tests, writes the JaCoCo report
./mvnw spotless:apply             # format
./mvnw verify                     # full gate: tests, coverage check, NullAway
./mvnw -Pfatjar package           # runnable fat jar for this OS (Editora and the template only)
./mvnw clean -Pdist package       # app image or native installer for this OS (clean is mandatory)
```

The first four are the same in every repo that has the plugin behind them: nux has no Spotless, JaCoCo or NullAway
yet, and Modula no JaCoCo. Only Editora and the template have a `fatjar` profile. `-Pdist package` builds the
installer in Editora and Modula. In the template, Termina, Torrenta and Mirada it builds the app image alone, and
`-Dskip.installers=false` adds the installers; in nux it builds the app image, and `-Djpackage.type=` names an
installer to build instead.

The `clean` in every `-Pdist` build is mandatory: incremental compilation can leave synthetic enum-switch
classes out of `target/classes`, and jlink then ships an app whose keyboard fails on the first keypress.
