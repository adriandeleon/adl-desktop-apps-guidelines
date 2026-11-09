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

- **REL-01 · MUST.** jpackage builds the installers for the five targets in the table above, each on its own
  runner, through the Maven `dist` profile.
  - *Check (code):* the release workflow's build matrix lists `linux-x64`, `linux-arm64`, `macos-arm64`,
    `macos-x64` and `windows-x64` on those runners, and `pom.xml` has a `dist` profile.
  - *Reference:* Editora [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml) (the `build` job), [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml) (`dist`).
- **REL-02 · SHOULD.** Downloads are named `<App>-<version>-<target>.<ext>`.
  - *Check (code):* the release-asset check builds the expected names this way.
  - *Reference:* Editora [`scripts/release/CheckRelease.java`](https://github.com/adriandeleon/Editora/blob/master/scripts/release/CheckRelease.java) (`expectedAssets`).
- **REL-03 · MUST.** **JReleaser** (`jreleaser.yml`) only creates the GitHub release: it builds nothing, and
  attaches every file and `checksums_sha256.txt`.
  - *Check (code):* `jreleaser.yml` attaches the build matrix's files and runs after the build jobs.
  - *Reference:* Editora [`jreleaser.yml`](https://github.com/adriandeleon/Editora/blob/master/jreleaser.yml), the `release` job in [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml).
- **REL-04 · SHOULD.** The release notes are the version's section of `CHANGELOG.md`.
  - *Check (code):* the release job hands JReleaser that section as the changelog.
  - *Reference:* Torrenta [`scripts/release/ReleaseNotes.java`](https://github.com/adriandeleon/torrenta/blob/master/scripts/release/ReleaseNotes.java). Editora's release notes are still its commit list.
- **REL-05 · MUST.** The Maven version is the single source of truth: a tag `vX.Y.Z` releases the version in
  `pom.xml`.
  - *Check (code):* the release workflow fails when the tag and the pom version differ.
  - *Reference:* Editora's "Check the tag against the pom version" step in [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml).
- **REL-06 · SHOULD.** `master` carries a `-SNAPSHOT` version, and a post-release job opens the pull request that
  bumps it to the next snapshot.
  - *Check (code):* the pom's version on `master` ends in `-SNAPSHOT`, and `release.yml` has the bump job.
  - *Reference:* Editora's `bump` job in [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml).
- **REL-07 · SHOULD.** A **release-asset check** fails the run before publishing when an expected file is missing.
  - *Why:* GitHub releases are immutable.
  - *Check (code):* a step before JReleaser compares the gathered files with the expected list.
  - *Reference:* Editora's "Verify the expected release assets" step in [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml).
- **REL-08 · SHOULD.** On Linux, a `.desktop` file's `StartupWMClass` is the JavaFX app class.
  - *Why:* the running window then belongs to the menu entry and shows its icon.
  - *Check (code):* `packaging/linux/<App>.desktop` sets `StartupWMClass=com.<app>.App`.
  - *Reference:* Editora [`packaging/linux/Editora.desktop`](https://github.com/adriandeleon/Editora/blob/master/packaging/linux/Editora.desktop), Torrenta [`packaging/linux/Torrenta.desktop`](https://github.com/adriandeleon/torrenta/blob/master/packaging/linux/Torrenta.desktop).
- **REL-09 · SHOULD.** On Linux, AppStream metainfo has the id `io.github.adriandeleon.<App>`.
  - *Check (code):* `packaging/linux/io.github.adriandeleon.<App>.metainfo.xml` carries that `<id>`.
  - *Reference:* Torrenta [`packaging/linux/`](https://github.com/adriandeleon/torrenta/tree/master/packaging/linux). Editora's metainfo id (`com.editora.Editora`) predates the rule.
- **REL-10 · SHOULD.** Packaging trains an **AOT cache** (JDK 25 Leyden) to cut start-up time; Linux legs run the
  training under `xvfb`.
  - *Check (code):* the `dist` build runs a training launch with `-XX:AOTCacheOutput`, and the Linux release legs
    install `xvfb`.
  - *Reference:* Editora [`scripts/aot_build.java`](https://github.com/adriandeleon/Editora/blob/master/scripts/aot_build.java).

## Install methods

- **REL-11 · MUST.** The GitHub release offers every download on every platform: the `.dmg`, `.msi`, `.deb`,
  `.rpm`, `.AppImage` and `.tar.gz`, with checksums.
  - *Check (code):* `jreleaser.yml` attaches each of these types.
  - *Reference:* Editora [`jreleaser.yml`](https://github.com/adriandeleon/Editora/blob/master/jreleaser.yml).
- **REL-12 · SHOULD.** On macOS (Apple Silicon) the app installs with
  `brew install --cask adriandeleon/tap/<app>`: JReleaser's `brew` packager writes the cask to
  [`adriandeleon/homebrew-tap`](https://github.com/adriandeleon/homebrew-tap). A cask takes exactly one artifact,
  so it serves Apple Silicon, and Intel Macs use the `macos-x64` DMG.
  - *Why:* the official homebrew-cask repository has notability rules a new project does not meet, so the family
    shares one personal tap.
  - *Check (code):* `jreleaser.yml` has a `brew` packager for that tap; `jreleaser package --basedir .` writes the
    cask locally, to check it without releasing.
  - *Reference:* Torrenta and Termina `jreleaser.yml`; Editora has no packager yet.
- **REL-13 · SHOULD.** On Windows x64 the app installs with `winget install AdrianDeLeon.<App>`: JReleaser's
  `winget` packager opens a pull request on [`microsoft/winget-pkgs`](https://github.com/microsoft/winget-pkgs)
  from the `adriandeleon` fork. The package identifier is `AdrianDeLeon.<App>`, the moniker the app's lower-case
  name.
  - *Check (code):* `jreleaser.yml` has a `winget` packager with that identifier; `jreleaser package --basedir .`
    writes the manifests locally.
  - *Reference:* Torrenta and Termina `jreleaser.yml`; Editora has no packager yet.
- **REL-14 · SHOULD.** Both packagers read a `PACKAGES_TOKEN` secret, a classic personal access token with `repo`
  scope. Without it JReleaser skips both, and the GitHub release still publishes.
  - *Why:* the workflow's own token cannot write to the tap or open a pull request on the fork.
  - *Check (code):* `release.yml` passes `PACKAGES_TOKEN` to JReleaser and leaves the packagers out when it is
    empty.
  - *Reference:* Torrenta and Termina `release.yml`.

winget is reviewed by Microsoft: the first submission for a new publisher is checked by a person, not merged
automatically.

**Status on 2026-11-06:** the tap exists and holds no casks yet. Torrenta and Termina have both packagers
configured, waiting for the token. Mirada's first winget submission
([microsoft/winget-pkgs#471599](https://github.com/microsoft/winget-pkgs/pull/471599)) is open.

## Signing

- **REL-15 · MUST.** The macOS `.dmg` is signed with the Developer ID Application certificate (team 8JKSF797L8),
  with the hardened runtime and per-app entitlements, notarized with `notarytool`, stapled and checked with
  `spctl`; then the notarized app is launched once.
  - *Check (code):* `release.yml` imports `MACOS_CERT_P12` and `MACOS_CERT_PASSWORD`, notarizes with
    `APPLE_API_KEY_P8`, `APPLE_API_KEY_ID` and `APPLE_API_ISSUER`, staples, runs `spctl` and launches the app.
  - *Reference:* Editora's "Import signing certificate (macOS)" and "Notarize DMG (macOS)" steps in
    [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml), [`packaging/macos/Editora.entitlements`](https://github.com/adriandeleon/Editora/blob/master/packaging/macos/Editora.entitlements). Done in all six apps.
- **REL-16 · MUST.** Linux downloads are signed with the one shared OpenPGP release key ("Adrian De Leon (release
  signing)") in a separate `sign-linux` job: `rpmsign` for the `.rpm`, a debsigs origin signature for the `.deb`,
  and an armored `.asc` beside every file. The public key is committed as `packaging/linux/signing-key.asc` and
  attached to each release.
  - *Check (code):* `release.yml` has a `sign-linux` job that reads `LINUX_GPG_KEY` and `LINUX_GPG_PASSPHRASE`
    and runs the shared scripts, and `packaging/linux/signing-key.asc` exists.
  - *Reference:* Editora [`scripts/release/sign-linux-packages.sh`](https://github.com/adriandeleon/Editora/blob/master/scripts/release/sign-linux-packages.sh), [`scripts/release/check-linux-signatures.sh`](https://github.com/adriandeleon/Editora/blob/master/scripts/release/check-linux-signatures.sh).
    Done in Editora, Torrenta, Termina and Modula; Mirada partly; nux not yet.
- **REL-17 · SHOULD.** The Windows `.msi` is signed with Authenticode, once the certificate is chosen.
  - *Check (code):* the Windows leg signs the `.msi` before it is uploaded.
  - *Reference:* no app yet. **Open decision**: SignPath Foundation (free for OSS), a Certum Open Source
    certificate, or Azure Trusted Signing. Until then MSIs are unsigned and SmartScreen warns.
- **REL-18 · MUST.** Every download has a GitHub **build provenance attestation**
  (`actions/attest-build-provenance`), which `gh attestation verify` checks.
  - *Check (test):* a test keeps the attested files and the files JReleaser attaches the same list.
  - *Reference:* Editora's "Attest build provenance" step in [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml), [`ReleaseSupplyChainTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/packaging/ReleaseSupplyChainTest.java). Done in
    Editora, Termina and Mirada.

The certificate renews before 2027-11-30; the Apple membership before 2027-10-31.

## CI/CD (GitHub Actions)

- **REL-19 · MUST.** `ci.yml` runs on every push to `master` and every pull request: **Format**
  (`spotless:check`) and **Build & Test** (`./mvnw verify`, coverage gate included) on JDK 25. Both are required
  status checks for `master`.
  - *Check (code):* `ci.yml` triggers on `push` to `master` and on `pull_request`, with the two jobs; the
    repository's rules for `master` require both.
  - *Reference:* Editora [`ci.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/ci.yml).
- **REL-20 · SHOULD.** The tests run on all three OSes: the pure suite (no JavaFX toolkit) on Linux, macOS and
  Windows, and the FX suite on Linux and at least one more. `ci.yml` covers Linux on every pull request;
  `full-tests.yml` covers the rest daily, on a pull request labeled `full-ci`, and before every release, and lists
  flaky tests in the job summary.
  - *Why:* path separators, line endings, case-insensitive file systems and process spawning fail on one OS only, and
    the pure suite is where they show; the FX suite catches layout and focus differences.
  - *Check (code):* `full-tests.yml`'s jobs run the pure suite on `windows-*` and `macos-*` and the FX suite
    (`-Dgroups=fx`) on at least one of them; it has a `schedule` and a `pull_request` trigger gated on the label, and
    the release preflight waits for its run on the tagged commit.
  - *Reference:* Editora [`full-tests.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/full-tests.yml) (the pure suite on Windows and macOS, the FX suite on macOS in three
    shards), [`scripts/ci/ReportFlakes.java`](https://github.com/adriandeleon/Editora/blob/master/scripts/ci/ReportFlakes.java), and the "Check that the Full tests
    passed on this commit" step in [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml).
- **REL-21 · MUST.** `release.yml` runs on a version tag (`v*`, or better the version-shaped
  `v[0-9]+.[0-9]+.[0-9]+*`, which a tag like `vendor-import` doesn't match) that matches the pom version, with
  `workflow_dispatch` as a dry run. It runs the five-target matrix, the signing jobs, attestations, the release-asset check, JReleaser, then
  the bump to the next snapshot. A dry run builds and signs and publishes nothing.
  - *Check (code):* `release.yml` triggers on the tag pattern and `workflow_dispatch`, and a dispatch runs
    JReleaser with `--dry-run`.
  - *Reference:* Editora [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml).
- **REL-22 · MUST.** Every workflow pins each third-party action to a commit SHA, with its version in a comment
  (`actions/setup-java@b843ebf… # v6.1.0`).
  - *Check (code):* every `uses:` in `.github/workflows/` ends in a 40-character SHA and a comment naming its version
    (`# vX.Y.Z`), or its branch when the action publishes no tag (Editora's `jreleaser/release-action … # v2`).
  - *Reference:* Editora [`.github/workflows/`](https://github.com/adriandeleon/Editora/tree/master/.github/workflows).
- **REL-23 · MUST.** Dependabot updates `github-actions` and `maven` weekly.
  - *Check (code):* `.github/dependabot.yml` lists both ecosystems with `interval: weekly`.
  - *Reference:* Editora [`.github/dependabot.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/dependabot.yml).
- **REL-24 · MUST.** Every workflow starts from `permissions: contents: read`; only a job that needs write access
  asks for it, in its own block.
  - *Check (code):* each workflow's top-level `permissions` is `contents: read`, and every `write` sits in a job's
    own `permissions`.
  - *Reference:* Editora [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml): `release` (publish), `bump` (the pull request) and `preflight` (start a
    Full tests run).
- **REL-25 · SHOULD.** Every workflow sets up JDK 25 with `actions/setup-java` and `cache: maven`.
  - *Check (code):* each `setup-java` step has `java-version: '25'` and `cache: maven`.
  - *Reference:* Editora uses Temurin in [`ci.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/ci.yml) and [`full-tests.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/full-tests.yml), and Liberica for the release build, for
    linux-aarch64 coverage.
- **REL-26 · MUST.** Every job has `timeout-minutes`, and `concurrency` cancels a superseded pull-request run,
  never a run on `master`.
  - *Check (code):* every job sets `timeout-minutes`; `cancel-in-progress` is true only for `pull_request` events.
  - *Reference:* Editora [`ci.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/ci.yml) (`cancel-in-progress: ${{ github.event_name == 'pull_request' }}`).
- **REL-27 · MUST.** CI uploads the surefire reports even when tests fail, and the JaCoCo report; it writes the
  coverage totals to the job summary.
  - *Check (code):* the test reports upload under `if: always()`, and a step appends the totals to
    `$GITHUB_STEP_SUMMARY`.
  - *Reference:* Editora's "Upload test reports and coverage data" and "Summarise coverage" steps in [`ci.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/ci.yml).
- **REL-28 · MUST.** Signing skips cleanly when the secrets are absent (forks, dry runs), so they still build; a tag
  without them fails.
  - *Check (code):* each signing step checks its secrets first, skips without them, and fails on a tag push.
  - *Reference:* Editora's "Import signing certificate (macOS)" step checks `MACOS_CERT_P12` first.
- **REL-29 · MUST.** The packaged app is launched once on each OS before a release (a smoke test).
  - *Check (code):* `release.yml` runs the packaged launcher on every target before JReleaser.
  - *Reference:* Torrenta's "Smoke-test the packaged app" step runs the launcher in every target's image. Editora
    runs only the notarized macOS app (`--version`, `--check-terminal`).
