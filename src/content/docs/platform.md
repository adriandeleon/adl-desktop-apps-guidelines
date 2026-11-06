---
title: "Platform baseline"
description: "JDK, JavaFX, AtlantaFX, NullAway, Maven Wrapper, tests and coverage: the stack every app shares."
---

| Area | Rule | Level | Editora reference |
|---|---|---|---|
| JDK | Build and bundle **JDK 25** (`maven.compiler.release` 25); the bundled runtime is jlinked, users never install Java | MUST | `pom.xml` |
| JavaFX | **JavaFX 27 or newer** (`javafx.version` 27) | MUST | `pom.xml` |
| Modules | One named JPMS module (`com.<app>`); `module-info.java` opens only what reflection, FXML and Jackson need | SHOULD | `src/main/java/module-info.java` |
| Theme toolkit | **AtlantaFX 3.x** (`atlantafx-base`) for controls; light and dark themes; app CSS uses AtlantaFX `-color-*` tokens, never hex literals | MUST | `ui/Themes.java`, `app.css` |
| UI font | Bundle **Inter** (Regular, Bold, Italic, BoldItalic + `OFL.txt`); register with `Font.loadFont` before any stylesheet; attach `ui-font.css` to every scene and dialog pane | MUST | `ui/Fonts.java` |
| Build | **Maven** with the **Maven Wrapper** (`mvnw`, `mvnw.cmd`) committed, so `./mvnw` works on a clean machine | MUST | `mvnw`, `.mvn/wrapper/` |
| Null safety | **JSpecify** annotations, checked by **NullAway** on **Error Prone** at compile time. Every package is `@NullMarked` in its own `package-info.java` | MUST | `docs/conventions.md#null-annotations-jspecify-checked-by-nullaway` |
| Formatting | **Spotless** with Palantir Java Format; CI fails an unformatted change | MUST | `pom.xml` (spotless plugin) |
| Tests | **JUnit 5** + **TestFX** over JavaFX's built-in **Headless** glass platform (`-Dglass.platform=Headless`), so FX tests need no display, no xvfb and no Monocle | MUST | `docs/testing.md`, `FxTestSupport` |
| Coverage | **JaCoCo** `check` at `mvn verify`: **≥ 0.90 lines, ≥ 0.90 methods**, ≥ 0.79 branches, plus per-package floors | MUST | `pom.xml` `jacoco-check` |
| Logging | `java.util.logging`, captured in-app by the Debug Log | SHOULD | `ui/DebugLog.java` |
| JSON config | Jackson POJOs with a `SCHEMA_VERSION` each | SHOULD | `config/Settings`, `config/migration/ConfigSchema.java` |

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
