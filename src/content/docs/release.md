---
title: "Packaging, signing and release"
description: "jpackage, JReleaser, the five-target matrix, macOS/Linux/Windows signing and CI."
---

## Targets

Each target builds on its own GitHub-hosted runner. jpackage and JavaFX natives are host-specific, so there
is no cross-building.

| Target | Runner | Downloads |
|---|---|---|
| Linux x64 | `ubuntu-latest` | `.deb`, `.rpm`, `.AppImage`, `.tar.gz`, fat jar |
| Linux arm64 | `ubuntu-24.04-arm` | `.tar.gz` (and `.deb` where the app's tooling allows), fat jar |
| macOS arm64 | `macos-15` | `.dmg` |
| macOS x64 | `macos-15-intel` | `.dmg` (the last Intel image, good to about Aug 2027) |
| Windows x64 | `windows-latest` | `.msi`, fat jar |
| Windows arm64 | — | **Not possible yet**: OpenJFX publishes no `win-aarch64` natives (JDK-8314064). ARM users run the x64 MSI under emulation. |

- Downloads are named `<App>-<version>-<target>.<ext>`.
- jpackage builds the installers through the Maven `dist` profile. **JReleaser** (`jreleaser.yml`) only
  creates the GitHub release: it attaches the files, `checksums_sha256.txt` and the changelog section.
- The maven version is the single source of truth: `-SNAPSHOT` on `master`, a tag `vX.Y.Z` releases, a
  post-release job bumps to the next snapshot.
- GitHub releases are immutable, so a **release-asset check** fails the run before publishing when an
  expected file is missing.
- **Linux desktop integration**: a `.desktop` file whose `StartupWMClass` is the JavaFX app class, plus
  AppStream metainfo `io.github.adriandeleon.<App>`.
- **AOT cache** (JDK 25 Leyden): a training run during packaging cuts start-up time; Linux legs run it under
  `xvfb`.

## Install methods

| Channel | Platform | What the user runs | How it is published | Level |
|---|---|---|---|---|
| GitHub release | All | Download the `.dmg`, `.msi`, `.deb`, `.rpm`, `.AppImage` or `.tar.gz` | JReleaser attaches every file, with checksums | MUST |
| Homebrew cask | macOS (Apple Silicon) | `brew install --cask adriandeleon/tap/<app>` | JReleaser's `brew` packager writes the cask to [`adriandeleon/homebrew-tap`](https://github.com/adriandeleon/homebrew-tap) | SHOULD |
| winget | Windows x64 | `winget install AdrianDeLeon.<App>` | JReleaser's `winget` packager opens a pull request on [`microsoft/winget-pkgs`](https://github.com/microsoft/winget-pkgs) from the `adriandeleon` fork | SHOULD |

- **One tap for the family.** The official homebrew-cask repository has notability rules a new project does not
  meet, so the casks live in a personal tap. A cask takes exactly one artifact: it serves Apple Silicon, and
  Intel Macs use the `macos-x64` DMG.
- **winget is reviewed by Microsoft.** The first submission for a new publisher is checked by a person, not
  merged automatically. The package identifier is `AdrianDeLeon.<App>`, the moniker the app's lower-case name.
- **Both need a `PACKAGES_TOKEN` secret**, a classic personal access token with `repo` scope: the workflow's own
  token cannot write to the tap or open a pull request on the fork. Without it JReleaser skips both packagers and
  the GitHub release still publishes.
- `jreleaser package --basedir .` writes the cask and the winget manifests locally, to check them without
  releasing.
- **Status on 2026-11-06:** the tap exists and holds no casks yet. Torrenta and Termina have both packagers
  configured, waiting for the token. Mirada's first winget submission
  ([microsoft/winget-pkgs#471599](https://github.com/microsoft/winget-pkgs/pull/471599)) is open.

## Signing

| Platform | How | Status in the family |
|---|---|---|
| macOS `.dmg` | Developer ID Application certificate (team 8JKSF797L8), hardened runtime with per-app entitlements, `notarytool` submission, stapled ticket, `spctl` check, then a smoke launch of the notarized app. Secrets per repo: `MACOS_CERT_P12`, `MACOS_CERT_PASSWORD`, `APPLE_API_KEY_P8`, `APPLE_API_KEY_ID`, `APPLE_API_ISSUER`. A tag without the secrets fails. | **Done** in all six |
| Linux `.deb` `.rpm` `.AppImage` `.tar.gz` | One shared OpenPGP release key ("Adrian De Leon (release signing)"). A separate `sign-linux` job: `rpmsign` for `.rpm`, a debsigs origin signature for `.deb`, and an armoured `.asc` beside every file. Public key committed as `packaging/linux/signing-key.asc` and attached to each release. Secrets `LINUX_GPG_KEY`, `LINUX_GPG_PASSPHRASE`. Shared scripts `sign-linux-packages.sh` and `check-linux-signatures.sh`. | Editora, Torrenta, Termina, Modula; Mirada partly; nux not yet |
| Windows `.msi` | Authenticode. **Open decision**: SignPath Foundation (free for OSS), Certum Open Source cert, or Azure Trusted Signing. Until then MSIs are unsigned and SmartScreen warns. | **Not done** in any app |
| All | GitHub **build provenance attestations** (`actions/attest-build-provenance`) for every download; `gh attestation verify` checks them. | Editora, Termina |

- Signing steps skip cleanly when the secrets are absent, so a fork or a dry run still builds.
- The certificate renews before 2027-11-30; the Apple membership before 2027-10-31.

## CI/CD (GitHub Actions)

| Workflow | When | What | Level |
|---|---|---|---|
| `ci.yml` | Every push to `master` and every pull request | **Format** (`spotless:check`) and **Build & Test** (`./mvnw verify`, coverage gate included) on JDK 25. Both are required status checks for `master`. | MUST |
| `full-tests.yml` | Daily (cron), on a pull request labelled `full-ci`, and before every release | The full suite on Linux, macOS and Windows; flaky tests listed in the job summary. | SHOULD |
| `release.yml` | A `v*` tag that matches the pom version; `workflow_dispatch` as a dry run | The five-target matrix, signing jobs, attestations, the release-asset check, JReleaser, then the bump to the next snapshot. A dry run builds and signs and publishes nothing. | MUST |

Every workflow:

- Pins each third-party action to a commit SHA, with its version in a comment
  (`actions/setup-java@b843ebf… # v6.1.0`). Dependabot updates `github-actions` and `maven` weekly.
- Starts from `permissions: contents: read`; only a job that publishes asks for write access, in its own block.
- Sets up Temurin JDK 25 with `actions/setup-java` and `cache: maven`.
- Puts `timeout-minutes` on every job, and uses `concurrency` to cancel a superseded pull-request run, never a run
  on `master`.
- Uploads the surefire reports when tests fail and the JaCoCo report always; writes the coverage totals to the
  job summary.
- Skips signing cleanly when the secrets are absent (forks, dry runs); a tag without them fails.
- Launches the packaged app once on each OS before a release (a smoke test).
