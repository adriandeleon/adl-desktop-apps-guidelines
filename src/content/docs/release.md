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

The fat jar is Editora's and the template's: only their release workflows build one (`-Pfatjar`), on the Linux and
Windows legs. Termina, Torrenta, Mirada, Modula and nux release none.

- **REL-01 · MUST.** jpackage builds the installers for five targets, Linux x64 and arm64, macOS arm64 and x64,
  and Windows x64, each on its own runner, through the Maven `dist` profile.
  - *Check (code):* the release workflow's build matrix lists `linux-x64`, `linux-arm64`, `macos-arm64`,
    `macos-x64` and `windows-x64` on those runners, and `pom.xml` has a `dist` profile.
  - *Reference:* Editora [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml) (the `build` job), [`pom.xml`](https://github.com/adriandeleon/Editora/blob/master/pom.xml) (`dist`).
- **REL-02 · SHOULD.** Downloads are named `<App>-<version>-<target>.<ext>`.
  - *Check (code):* the release-asset check builds the expected names this way.
  - *Reference:* Editora [`scripts/release/CheckRelease.java`](https://github.com/adriandeleon/Editora/blob/master/scripts/release/CheckRelease.java) (`expectedAssets`).
- **REL-03 · MUST.** **JReleaser** (`jreleaser.yml`) builds nothing: it creates the GitHub release, attaches every
  file and `checksums_sha256.txt`, and runs the packagers of [REL-12](#rel-12) and [REL-13](#rel-13).
  - *Check (code):* `jreleaser.yml` has no step that compiles or packages the app: it attaches the build matrix's
    files and the checksums file, and its `brew` and `winget` packagers, where the app has them, take those same
    files. The job that runs it needs the build jobs.
  - *Reference:* Editora [`jreleaser.yml`](https://github.com/adriandeleon/Editora/blob/master/jreleaser.yml), the `release` job in [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml).
- **REL-04 · SHOULD.** The release notes are the version's section of `CHANGELOG.md`.
  - *Check (code):* the release job hands JReleaser that section as the changelog.
  - *Reference:* Torrenta [`scripts/release/ReleaseNotes.java`](https://github.com/adriandeleon/torrenta/blob/master/scripts/release/ReleaseNotes.java). Editora's release notes are still its commit list.
- **REL-05 · MUST.** The Maven version is the single source of truth: a tag `vX.Y.Z` releases the version in
  `pom.xml`.
  - *Check (code):* the release workflow fails when the tag and the pom version differ.
  - *Reference:* Editora's "Check the tag against the pom version" step in [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml).
- **REL-06 · SHOULD.** The default branch carries a `-SNAPSHOT` version, and a post-release job opens the pull
  request that bumps it to the next snapshot.
  - *Check (code):* the pom's version on the default branch ends in `-SNAPSHOT`, and `release.yml` has the bump job.
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
  - *Reference:* Editora [`scripts/aot_build.java`](https://github.com/adriandeleon/Editora/blob/master/scripts/aot_build.java); Termina's and Mirada's [`scripts/aot-train.sh`](https://github.com/adriandeleon/Mirada/blob/main/scripts/aot-train.sh).

## Install methods

- **REL-11 · MUST.** The GitHub release offers every download of every target: the `.dmg`, `.msi`, `.deb`,
  `.rpm`, `.AppImage` and `.tar.gz`, with checksums. Which target gets which type is under [Targets](#targets).
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
  - *Check (code):* `release.yml`, or a script it runs, imports `MACOS_CERT_P12` and `MACOS_CERT_PASSWORD`,
    notarizes with `APPLE_API_KEY_P8`, `APPLE_API_KEY_ID` and `APPLE_API_ISSUER`, staples, runs `spctl` and
    launches the app.
  - *Reference:* Editora's "Import signing certificate (macOS)" and "Notarize DMG (macOS)" steps in
    [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml), [`packaging/macos/Editora.entitlements`](https://github.com/adriandeleon/Editora/blob/master/packaging/macos/Editora.entitlements). All six apps sign, notarize,
    staple and run `spctl`; Editora, Termina, Mirada, Modula and nux then launch the notarized app. Torrenta does not
    yet: its "Smoke-test the packaged app" step launches the signed app before it is notarized, and its "Notarize the
    dmg (macOS)" step in [`release.yml`](https://github.com/adriandeleon/torrenta/blob/master/.github/workflows/release.yml) ends at `spctl`. Mirada's steps are in [`scripts/sign-mac.sh`](https://github.com/adriandeleon/Mirada/blob/main/scripts/sign-mac.sh) and
    [`scripts/notarize-mac.sh`](https://github.com/adriandeleon/Mirada/blob/main/scripts/notarize-mac.sh).
- **REL-16 · MUST.** Linux downloads are signed with the one shared OpenPGP release key ("Adrian De Leon (release
  signing)") in a separate `sign-linux` job: `rpmsign` for the `.rpm`, a debsigs origin signature for the `.deb`,
  and an armored `.asc` beside every file. The public key is committed as `packaging/linux/signing-key.asc` and
  attached to each release.
  - *Check (code):* `release.yml` has a `sign-linux` job that reads `LINUX_GPG_KEY` and `LINUX_GPG_PASSPHRASE`
    and runs the shared scripts, and `packaging/linux/signing-key.asc` exists.
  - *Reference:* Editora [`scripts/release/sign-linux-packages.sh`](https://github.com/adriandeleon/Editora/blob/master/scripts/release/sign-linux-packages.sh), [`scripts/release/check-linux-signatures.sh`](https://github.com/adriandeleon/Editora/blob/master/scripts/release/check-linux-signatures.sh).
    Done in Editora, Torrenta, Termina, Mirada and Modula, all with the same key; nux has no `sign-linux` job and no
    committed key yet.
- **REL-17 · SHOULD.** The Windows `.msi` is signed with Authenticode, once the certificate is chosen.
  - *Check (code):* the Windows leg signs the `.msi` before it is uploaded.
  - *Reference:* no app yet. **Open decision**: SignPath Foundation (free for OSS), a Certum Open Source
    certificate, or Azure Trusted Signing. Until then MSIs are unsigned and SmartScreen warns.
- **REL-18 · MUST.** Every download has a GitHub **build provenance attestation**
  (`actions/attest-build-provenance`), which `gh attestation verify` checks.
  - *Check (code):* the release workflow has an `actions/attest-build-provenance` step whose subjects cover every
    file the release attaches. The test that keeps the two lists the same is [QUAL-15](../quality/#qual-15)'s.
  - *Reference:* Editora's "Attest build provenance" step in [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml), [`ReleaseSupplyChainTest`](https://github.com/adriandeleon/Editora/blob/master/src/test/java/com/editora/packaging/ReleaseSupplyChainTest.java). Done in
    Editora, the app template, Termina and Mirada.

The certificate renews before 2027-11-30; the Apple membership before 2027-10-31.

## CI/CD (GitHub Actions)

- **REL-19 · MUST.** The CI workflow (`ci.yml` in Editora) runs on every push to the default branch and every pull
  request: **Format** (`spotless:check`) and **Build & Test** (`./mvnw verify`, coverage gate included), on the JDK
  [PLAT-01](../platform/#plat-01) names. Both are required status checks for the default branch.
  - *Check (code):* the CI workflow triggers on `push` to the default branch and on `pull_request`, with the two
    jobs. That the default branch requires both is a repository setting, which no file shows: an audit of the
    files reports that half as not checked.
  - *Reference:* Editora [`ci.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/ci.yml), on `master`; Mirada's [`ci.yml`](https://github.com/adriandeleon/Mirada/blob/main/.github/workflows/ci.yml), on `main`.
- **REL-20 · MUST.** The tests run on all three OSes: the pure suite (no JavaFX toolkit) on Linux, macOS and
  Windows, and the FX suite on Linux and at least one more. They run there every day or on every pull request, and
  on the commit of every release before it is built ([REL-30](#rel-30)). How the runs are split is the app's own:
  one workflow that runs everything on every pull request meets this, and so does a quick workflow for pull
  requests with a fuller one on a schedule.
  - *Why:* path separators, line endings, case-insensitive file systems and process spawning fail on one OS only, and
    the pure suite is where they show; the FX suite catches layout and focus differences.
  - *Check (code):* taken together, the workflows' test jobs run the pure suite on `ubuntu-*`, `macos-*` and
    `windows-*` runners and the FX suite on `ubuntu-*` and one more, under a `schedule` or a `pull_request` trigger
    that needs no label; and the release workflow runs them on those runners or waits for that run on the tagged
    commit.
  - *Reference:* Editora splits them: [`ci.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/ci.yml) runs the whole suite on Linux on every pull request, and
    [`full-tests.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/full-tests.yml) the pure suite on Windows and macOS and the FX suite on macOS, in three shards, daily, on
    a pull request labeled `full-ci` and before every release: the "Check that the Full tests passed on this
    commit" step in [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml). It lists flaky tests in the job summary
    ([`scripts/ci/ReportFlakes.java`](https://github.com/adriandeleon/Editora/blob/master/scripts/ci/ReportFlakes.java)). The app template splits them the same way, and its release calls
    [`full-tests.yml`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/.github/workflows/full-tests.yml) itself. Termina ([`ci.yml`](https://github.com/adriandeleon/Termina/blob/master/.github/workflows/ci.yml)), Torrenta ([`ci.yml`](https://github.com/adriandeleon/torrenta/blob/master/.github/workflows/ci.yml)), Mirada
    ([`ci.yml`](https://github.com/adriandeleon/Mirada/blob/main/.github/workflows/ci.yml)), Modula ([`build.yml`](https://github.com/adriandeleon/Modula/blob/master/.github/workflows/build.yml)) and nux ([`ci.yml`](https://github.com/adriandeleon/nux/blob/master/.github/workflows/ci.yml)) run the
    whole suite on the three OSes on every pull request.
- **REL-21 · MUST.** The release workflow (`release.yml` in Editora) runs on a version tag (`v*`, or better the
  version-shaped
  `v[0-9]+.[0-9]+.[0-9]+*`, which a tag like `vendor-import` doesn't match), with `workflow_dispatch` as a dry run
  that builds and signs and publishes nothing. The tag matching the pom is [REL-05](#rel-05), the tests it waits for
  [REL-30](#rel-30), the release-asset check [REL-07](#rel-07), and the bump to the next snapshot
  [REL-06](#rel-06).
  - *Check (code):* `release.yml` triggers on the tag pattern and `workflow_dispatch`, and a dispatch runs
    JReleaser with `--dry-run`.
  - *Reference:* Editora [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml).
- **REL-30 · MUST.** A release is cut only from a commit whose tests passed: the release workflow runs the suite
  before it builds the installers, or a preflight job reads CI's result for the tagged commit and stops when it is
  not green.
  - *Why:* the build legs often skip the tests (`-DskipTests`), and a tag can be pushed on any commit, so without
    this a release can be cut from code whose checks failed or never ran.
  - *Check (code):* in the release workflow, every job that publishes needs, directly or through the jobs between, a
    job that settles the tests on the tagged commit: it runs them (`./mvnw verify` or `test` with no `-DskipTests`,
    or a call to the full-tests workflow), or it reads the conclusion of the CI run on `GITHUB_SHA` and fails on
    anything but success.
  - *Reference:* both ways are in use, and all seven release workflows meet it. A preflight that reads CI: Editora's
    "Check that CI passed on this commit" step in [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml) ([`scripts/release/CheckRelease.java`](https://github.com/adriandeleon/Editora/blob/master/scripts/release/CheckRelease.java) `ci`, which waits up to 30
    minutes for the required checks; its build legs run `-DskipTests`), and Torrenta's "Require CI on this commit"
    step in [`release.yml`](https://github.com/adriandeleon/torrenta/blob/master/.github/workflows/release.yml), which reads the newest `ci.yml` run on the commit and starts one when there is none. The
    suite in the release: the template's `full-tests` job in [`release.yml`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/.github/workflows/release.yml) calls `full-tests.yml` before `build`;
    the "Build, test and package" step of Termina's [`release.yml`](https://github.com/adriandeleon/Termina/blob/master/.github/workflows/release.yml) and Mirada's [`release.yml`](https://github.com/adriandeleon/Mirada/blob/main/.github/workflows/release.yml) runs `./mvnw … verify` on
    every build leg; Modula's "Build the installer" step in [`release.yml`](https://github.com/adriandeleon/Modula/blob/master/.github/workflows/release.yml) runs `package` with the tests; nux's build
    legs run a "Test" step (`./mvnw test`) before they package, in [`release.yml`](https://github.com/adriandeleon/nux/blob/master/.github/workflows/release.yml). In each of the five the job that
    publishes needs the build legs, directly or through the signing and asset-check jobs.
- **REL-22 · MUST.** Every workflow pins each third-party action to a commit SHA, with its version in a comment
  (`actions/setup-java@b843ebf… # v6.1.0`).
  - *Check (code):* every `uses:` in `.github/workflows/`, and in a composite action under `.github/actions/` where
    the repository has one, ends in a 40-character SHA and a comment naming its version (`# v6.1.0`, `# 2.5.0`, `# v2`), never a
    branch such as `# main`. The `v2` in Editora's and Torrenta's `jreleaser/release-action … # v2` names that
    action's `v2` line, whose head the SHA is; the template, Termina and Mirada pin its 2.5.0 release.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; [ -d .github/workflows ] || { echo 'no .github/workflows'; exit 1; }; ! grep -rhE '^[[:space:]]*-?[[:space:]]*uses:' .github/workflows .github/actions 2>/dev/null | grep -vE 'uses:[[:space:]]*\./' | grep -vE '@[0-9a-f]{40}[[:space:]]+#[[:space:]]*v?[0-9]'`
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
- **REL-25 · SHOULD.** Every `actions/setup-java` step caches Maven's repository (`cache: maven`). The JDK it sets
  up is [PLAT-01](../platform/#plat-01)'s.
  - *Check (code):* each `setup-java` step has `cache: maven`.
  - *Reference:* Mirada ([`ci.yml`](https://github.com/adriandeleon/Mirada/blob/main/.github/workflows/ci.yml)), Modula and nux, on every step. Editora ([`ci.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/ci.yml),
    [`release.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/release.yml)), the app template, Termina and Torrenta each have a `setup-java` step without it. Editora
    sets up Temurin for its tests and Liberica for the release build, for linux-aarch64 coverage.
- **REL-26 · MUST.** Every job that runs steps has `timeout-minutes`, and `concurrency` cancels a superseded
  pull-request run, never a run on the default branch. A job that calls a reusable workflow (`uses:` in place of
  `steps:`) takes no `timeout-minutes`: GitHub does not accept the key there, and the called workflow's own jobs
  carry theirs.
  - *Check (code):* every job with `steps:` sets `timeout-minutes`; `cancel-in-progress` is never true for a run that
    a push to the default branch starts: it is false, absent, or an expression that is false there. A workflow that
    no push to the default branch starts may set it to true.
  - *Reference:* Editora [`ci.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/ci.yml) (`cancel-in-progress: ${{ github.event_name == 'pull_request' }}`) and
    [`terminal-image.yml`](https://github.com/adriandeleon/Editora/blob/master/.github/workflows/terminal-image.yml) (true: it runs on pull requests, on pushes to `probe/**` and by hand); the template's `full-tests` job in
    [`release.yml`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/.github/workflows/release.yml), which calls `full-tests.yml` and carries no timeout.
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
  - *Check (code):* `release.yml` runs the packaged launcher on each OS (a Linux, a macOS and a Windows leg) before
    JReleaser.
  - *Reference:* Torrenta's "Smoke-test the packaged app" step runs the launcher in the image of each of its three
    targets, one per OS. Editora runs only the notarized macOS app (`--version`, `--check-terminal`).
