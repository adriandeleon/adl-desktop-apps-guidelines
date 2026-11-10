---
title: "Platform baseline"
description: "JDK, JavaFX, AtlantaFX, NullAway, Maven Wrapper, tests and coverage: the stack every app shares."
---

- **PLAT-01 · MUST.** The app builds on **JDK 25 or newer**. `maven.compiler.release` 25 is the floor, not the
  ceiling: a newer JDK builds the app too, so no enforcer rule refuses one, in the main build or in any profile
  that turns itself on (an `<activation>` by JDK version, OS, property or file; a profile turned on only by name,
  with `-P`, is not counted). CI builds every app on JDK 25, the current LTS: every workflow step that sets up a
  JDK sets up release 25, and the runtime an installer carries ([PLAT-02](#plat-02)) is that JDK's. A leg that
  builds a native image carries no JDK: it sets up a GraalVM 25 release instead, 25.0 or any later 25.x. The
  family moves to the next LTS together, in an edition of Pauta.
  - *Check (code):* `pom.xml` sets `maven.compiler.release` to 25 or later. Every enforcer `requireJavaVersion`
    rule that counts has the open-ended range `[25,)`: it starts at 25 and has no upper bound. The rules that count
    are those of the main build and those inside a profile that turns itself on, one whose `<activation>` holds a
    `<jdk>`, an `<os>`, a `<property>` or a `<file>`: such a profile is on without being asked for, so its rule is
    the build's rule wherever it activates. A rule in a profile turned on only by name with `-P` is not counted,
    and an app with no rule that counts passes. In the workflows, every step that uses a `setup-java` or `setup-graalvm`
    action (`actions/setup-java`, `graalvm/setup-graalvm`) names 25 or a 25.x release in its `java-version`, or in
    the `version` a GraalVM step may give instead. The Command reads a workflow line by line, not as YAML: a step
    ends at the next line that opens a list item. A version it cannot read as a number (an expression such as
    `${{ matrix.java }}`, a `java-version-file`) it prints as not judged and does not fail: read the matrix or the
    file it names.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; r=$(sed -n 's:.*<maven.compiler.release>\([0-9]*\)<.*:\1:p' pom.xml | head -n 1); p=$(tr -d ' \t\r\n' < pom.xml | tr '<' '\n'); j=$({ printf '%s\n' "$p" | sed -n '/^profiles>/,/^\/profiles>/!p'; printf '%s\n' "$p" | sed -n '/^profile>/,/^\/profile>/{/^profile>/h;/^profile>/!H;/^\/profile>/{x;/\nactivation>.*\njdk>.*\n\/activation>/{p;d;};/\nactivation>.*\nos>.*\n\/activation>/{p;d;};/\nactivation>.*\nproperty>.*\n\/activation>/{p;d;};/\nactivation>.*\nfile>.*\n\/activation>/{p;d;};};}'; } | sed -n '/^requireJavaVersion>/,/^\/requireJavaVersion>/s/^version>//p'); w=$(for f in .github/workflows/*.yml .github/workflows/*.yaml; do [ -f "$f" ] || continue; for n in $(grep -nE '^[^#]*uses:[^#]*/setup-(java|graalvm)@' "$f" | cut -d: -f1); do v=$(tail -n +"$n" "$f" | sed -n '1d;/^ *- /q;p' | grep -E '^ *(java-)?version:' | head -n 1 | cut -d: -f2- | cut -d'#' -f1 | tr -d " '\"\r"); if printf '%s\n' "$v" | grep -qE '^25([.+-].*)?$'; then :; elif printf '%s\n' "$v" | grep -q '^[0-9]'; then echo "$f:$n sets up JDK $v"; else echo "not judged: $f:$n version ${v:-not given}" >&2; fi; done; done); [ "${r:-0}" -ge 25 ] && ! echo "$j" | grep -vxF '[25,)' | grep -q . && [ -z "$w" ] || { echo "maven.compiler.release ${r:-none}; requireJavaVersion in the main build and in profiles that turn themselves on:" ${j:-none}; [ -z "$w" ] || echo "$w"; false; }`
  - *Reference:* the app template's [`pom.xml`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/pom.xml) (one enforcer rule, `[25,)`) and [`.github/workflows/ci.yml`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/.github/workflows/ci.yml)
    (`java-version: '25'`); Termina's and Mirada's rules have the same range, and Modula and nux have no enforcer
    rule. Editora doesn't yet: beside the `[25,)` rule of its main build, its [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml) has a profile,
    `formatter-needs-jdk25`, that activates on JDK `[26,)` and holds an enforcer rule with the range `[25,26)`, so
    a plain build on JDK 26 or newer stops unless it is told to skip the format check. Torrenta doesn't either: the
    rule in its main build has the range `[25,26)`. Mirada's profile of the same name skips the format check on
    those JDKs, says so, and refuses nothing ([`pom.xml`](https://github.com/adriandeleon/Mirada/blob/main/pom.xml)). No app's profile that activates by OS, property or
    file holds an enforcer rule (Termina's `os-windows` and `git-commit` and Modula's `app-image` among them).
    Every app's workflows set up 25. Mirada's native legs
    set up Oracle GraalVM with `version: '25.4'`, a GraalVM 25 release
    ([`.github/workflows/release.yml`](https://github.com/adriandeleon/Mirada/blob/main/.github/workflows/release.yml)); its jlink leg sets up JDK 25.
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
- **PLAT-04 · MUST.** The app is one named JPMS module, whose `module-info.java` opens only what reflection, FXML
  and Jackson need.
  - *Check (code):* `src/main/java/module-info.java` declares one named module, not an `open module`, which opens
    every package; each `opens` line serves FXML, Jackson or another reflective reader.
  - *Reference:* Editora [`src/main/java/module-info.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/module-info.java) (its module is `com.editora`). The name is the
    app's to choose: the template's is `com.example.app`, and its [`scripts/rename.sh`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/scripts/rename.sh) gives the module the
    name of the app's Java package.
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
  change in a Format job of its own: a job that runs `spotless:check` and neither builds nor tests. When CI runs
  and which of its jobs the default branch requires are [REL-19](../release/#rel-19).
  - *Why:* a check bound to a build phase fails in the same job as the tests, so the failed job does not say which
    of the two is wrong.
  - *Check (code):* the spotless plugin configures `palantirJavaFormat`, and in a workflow that runs on pull
    requests a job runs `spotless:check` and neither builds nor tests: no Maven `compile`, `test-compile`, `test`,
    `package`, `verify`, `integration-test`, `install` or `deploy` in the same job. The plugin's `check` goal bound
    to a phase (`./mvnw verify`) does not meet it alone.
    The Command reads a workflow line by line, not as YAML: a job is what lies between two keys at the indentation
    of the first key under `jobs:`, and a Maven run counts when its goal is on the line that names `mvn` or `mvnw`
    (a `name:` line is not a run). A Format job in a workflow of its own that a pull-request workflow calls
    (`workflow_call`, `uses: ./.github/workflows/<file>`) meets the rule, and the Command follows that call. What
    it does not see, so read the workflow where one applies: a goal on a continuation line; a build started from a
    script; a job's `if:`.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; grep -q palantirJavaFormat pom.xml || { echo 'pom.xml configures no palantirJavaFormat'; exit 1; }; for f in .github/workflows/*.yml .github/workflows/*.yaml; do grep -qE '^( *-? *|on:.*[^A-Za-z0-9_-])pull_request(_target)?([^A-Za-z0-9_-]|$)' "$f" 2>/dev/null || { grep -qE '^( *-? *|on:.*[^A-Za-z0-9_-])workflow_call([^A-Za-z0-9_-]|$)' "$f" 2>/dev/null && grep -lE "^[^#]*uses:[^#]*\./$f" .github/workflows/* 2>/dev/null | xargs grep -lE '^( *-? *|on:.*[^A-Za-z0-9_-])pull_request(_target)?([^A-Za-z0-9_-]|$)' 2>/dev/null | grep -q .; } || continue; i=$(sed -n '/^jobs:/,$p' < "$f" | grep -E '^ +[A-Za-z0-9_-]+:' | head -n 1 | sed -n 's/^\( *\).*/\1/p'); for s in $(grep -nE '^[^#]*mvnw?(\.cmd)?[[:space:]]([^#]*[[:space:]])?spotless:check' "$f" | grep -vE '^[0-9]+: *-? *name:' | cut -d: -f1); do a=0; b=999999; for h in $(grep -nE "^$i[A-Za-z0-9_-]+:" "$f" | cut -d: -f1); do if [ "$h" -le "$s" ]; then a=$h; elif [ "$b" -eq 999999 ]; then b=$h; fi; done; m=; for t in $(grep -nE '^[^#]*mvnw?(\.cmd)?[[:space:]]([^#]*[[:space:]])?(compile|test-compile|test|package|verify|integration-test|install|deploy)([^A-Za-z0-9:_.=/-]|$)' "$f" | grep -vE '^[0-9]+: *-? *name:' | cut -d: -f1); do [ "$t" -ge "$a" ] && [ "$t" -lt "$b" ] && m="$m $f:$t"; done; [ -z "$m" ] && exit 0; echo "spotless:check at $f:$s shares its job with a build or test run:$m"; done; done; w=$(grep -lE '^[^#]*spotless:check' .github/workflows/* 2>/dev/null); echo "no job of its own runs spotless:check in a workflow that runs on pull requests (named in: ${w:-no workflow})"; exit 1`
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
  ≥ 0.90 methods**, and no profile that activates by OS or by JDK version lowers a floor or skips the check. The
  rule is about the pom's profiles, not about where CI runs the gate: a workflow that runs the tests on some of
  its runners with JaCoCo skipped is the workflow's choice and passes. The branch floor and each package's own
  floor are [QUAL-03](../quality/#qual-03).
  - *Check (code):* the `jacoco-check` execution is bound to `verify` with `BUNDLE` limits of 0.90 `LINE` and
    0.90 `METHOD`. Where a limit is a property (`${coverage.bundle.line}` in Termina), its value is 0.90 or more
    in the main `<properties>` and in every profile that sets it and activates by OS or by JDK version (an
    `<activation>` with an `<os>` or a `<jdk>`), and no such profile sets `jacoco.skip` or the check's `<skip>`.
    A `-Djacoco.skip` on a workflow's command line is not judged.
  - *Reference:* Editora [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml) `jacoco-check`, with no profile that touches it; the template's and Mirada's are the
    same. Editora's [`full-tests.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/full-tests.yml) runs its tests on the other OSes with `-Djacoco.skip=true`, which the rule
    leaves to the workflow. Termina doesn't yet: its `os-windows` profile lowers the two floors to 0.45 and 0.47 on Windows
    ([`pom.xml`](https://github.com/adriandeleon/Termina/blob/master/pom.xml)). Torrenta's check has a line floor and no method floor, and Modula and nux have no JaCoCo
    check.
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
