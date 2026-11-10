# Pauta (adl desktop apps guidelines): agent guide

**Pauta** is the name; its mark and social card live in `branding/` (see `branding/README.md`). A documentation site (Astro Starlight) holding the UI/UX/platform guidelines for adl's JavaFX desktop apps.
Editora (`../Editora`) is the reference implementation.

## Commands

- `npm run dev` — local site at http://localhost:4321/ (one edition, at the root)
- `npm run print` — builds `public/downloads/` (PDF + single Markdown); needs pandoc, python3 and Chrome
- `npm run build` — the whole site into `dist/`: this edition at `latest/` and `<version>/`, every earlier edition
  from the `versions` branch, `next/` (see **Pauta Next**), the root redirects (see **Editions on the site**)
- `npm run preview` — serves `dist/` as deployed, at http://localhost:4321/
- `npm run check` — fails on a malformed rule, a retired ID in use, a page missing from `pages.json`, a relative
  link that leads to no page, section, rule or screenshot, or a checklist line whose level isn't its rules'
  (`scripts/check-rules.mjs`); `npm run build` runs it first
- `node scripts/check-edition.mjs` — fails when this branch's changelog or edition clashes with `origin/master` or a
  tag (see **Several sessions at once**)

## Rules

- Pages are Markdown in `src/content/docs/`. Adding, removing or reordering a page means editing `pages.json`
  too: it drives both the sidebar and the PDF. The one page outside it is `changelog.mdx`, rendered from
  `CHANGELOG.md` by `src/components/Changelog.astro` (as is *What's new* on the overview); its sidebar entry is in
  `astro.config.mjs` and the PDF has no changelog.
- A rule states a level (MUST / SHOULD / MAY) and names the Editora class or file it comes from. Verify claims
  against the apps' code on their default branch, not from memory; when Editora and the guide disagree, the code
  wins and the guide is fixed in the same change. A MUST that one kind of app can't sensibly meet (a terminal, whose
  keys belong to the shell) says so in its own text, with what that app does instead (KBD-09); only a SHOULD can be
  a deviation, so an app must never be left with a `pending` it can't close.
- A file or class the guide names in an app, the template or editora-website links to it on GitHub, on the repo's
  default branch: ``[`ui/TabHeaders.java`](https://github.com/adriandeleon/Editora/blob/master/src/main/java/com/editora/ui/TabHeaders.java)``,
  `tree/` for a folder. Keep the name as written and link the class's file for `Class.member`. Leave a name unlinked
  when it doesn't name one file in one repo: a file every app has, a glob, a class several apps share, or something
  an app lacks (*Gaps per app*). Never link inside a code block.
- **Rule IDs**: every rule is a list item, never a table row, that opens with `**KBD-07 · MUST.**`, one testable
  statement, then sub-items `*Why:*` (only when there is a reason worth stating), `*Check (code|test|by
  hand):*` (how an agent or a person verifies it in an app: what to grep or read, which test holds it, or what to do
  in the running app; a name it gives is Editora's spelling, which an app's equivalent meets. In the statement, a
  name is required as spelled when a user, the docs or another tool finds the thing by it: a command id, a catalog
  key, a chord, a command-line flag, an environment variable, a property in `pom.xml` or `pauta.json`, a file the
  repository must carry; so name one there only when every app must spell it so. Any other name in a statement, a
  Java class, method or constant, a CSS file or style class, a branch or workflow file, a config file's name, is
  Editora's spelling too: write it so it cannot be read as the requirement, "(Editora's `AsyncTestScope`)"),
  `*Command:*` (only under a `Check (code)`, and only when a shell command settles the whole
  check: one code span holding a POSIX `sh -c` command, run from the app's repository root, that exits 0 when the
  check passes and prints what it found when it fails. It opens with the guard `src/lib/rules.mjs` names (`GUARD`), so
  it fails outside an app's root, and it only reads: `npm run check` reads it as the shell does and fails on any
  command that is not on `src/lib/command.mjs`'s list of readers (`grep`, `test`, `head`, `tr`, `wc`, `echo` and the
  like; `sed -n`, `sort`, `find` and `xargs` only in the forms that cannot write or run another program), on a command
  named through a variable, a quote or a path, and on a redirect other than `< file`, `>/dev/null`, `2>/dev/null`,
  `2>&1` and `>&2`. Test it under `dash` against Editora, the template and an empty folder before adding
  it) and `*Reference:*` (the Editora file, or the app that does it, or "no app yet"). IDs are
  permanent: never renumber or reuse one. A removed rule's ID stays retired: list it in `retired-rules.json` with the
  edition that removed it and the rule that holds its requirement now (`see`), link to that rule where the old one
  stood, and name the ID in the changelog. `npm run check` fails on a retired ID in use or named on a page, and
  `rules.json` publishes the list. `src/lib/rehype-status.mjs` makes the
  item its anchor (`#kbd-07`) and `scripts/print-markup.py` renders it for print; `src/lib/rules.mjs` reads the
  rules for `npm run check` and for what coding agents read, which every edition serves: `rules.json`, `llms.txt`
  and `llms-full.txt` (all three also at the site root), each page as Markdown at `<slug>.md` (`src/pages/*.js`,
  `src/lib/llms.mjs`), the audit report's statuses and JSON Schemas (`src/lib/audit.mjs`) and the audit skill
  (`skills/pauta-audit/SKILL.md`, served as it is), which the *Coding agents and LLMs* page (`coding-agents.md`)
  explains. Change all of them if the syntax or the report changes; the template repository's copy of the skill
  follows this one.
  **Applies to.** A rule covers every app unless its text names the apps it covers, or it sits under an
  `**Applies to:** an app with…` paragraph: at the top of a page, before its first heading and rule, for the whole
  page; right under a `## ` heading, for that section (PAUTA-05). `rules.mjs` carries it to each rule's `appliesTo`;
  `npm run check` fails on one anywhere else. Write it as a phrase that finishes "Applies to", never a rule of its
  own.
  On the site, a page with five or more rules opens with an index of them (ID, level, statement) that
  `rehype-status.mjs` builds from the rules themselves; never write one by hand. The PDF has none: its contents
  list does that job.
  **A rule's level is the one on its own page**, and nothing else sets it. The New app checklist sums the rules up:
  each line ends with links to the rules it covers (`[KBD-07](../keyboard/#kbd-07)`), every MUST is on a line, and a
  line marked `(SHOULD)` names only SHOULDs while any other line names only MUSTs. `npm run check` fails when a
  line and its rules disagree, when a MUST is on no line, or when a link to a rule points at a rule that doesn't
  exist or at the wrong page, or reads as another rule.
  **One requirement, one rule.** Before adding a rule, search the pages for the same requirement; when another page
  states it, link to that rule instead (an overview page points at the template that details it). Two IDs for one
  requirement make an app record two exceptions, and they drift apart in level.
  One prefix per page: OS same-on-every-os, PLAT platform, REPO repository, DOCS documentation, QUAL quality, PERF performance, KBD
  keyboard, ACC accessibility, WIN window-shell, ICON icons-and-color, TBAR toolbars-and-tooltips, TABS tabs-and-panels, MENU menus,
  TRAY tray-and-background, SET settings, DIAG diagnostics, CLI command-line, INTL i18n, REL release; templates PAL,
  QOPEN, WELC, ABOUT, PWIN (pauta-window), CONF, FIND, MLOG, SYNC; PAUTA for the conformance page. A new rule takes the page's next free number, wherever it sits.
  Template pages keep their mockups and spec tables. Their requirements are rules, under `## Rules` or in the
  section they concern (`## Behavior`, `## States`, `## Spec`), and a spec value the apps must share (a size, a
  count, a prompt) is a rule too: a spec table and a mockup describe, they don't require.
- Feature matrix cells start with `●`, `◐` or `—` (rendered as dots by `src/lib/rehype-status.mjs`; the print
  build does the same in `scripts/print-markup.py`). Change both if the convention changes.
- Plain, direct sentences written for the app developer. No marketing copy. American spelling throughout (color,
  behavior, gray, license, customize, canceled), in pages, the changelog, the README and comments alike.
- **Guidance collects under `## [Unreleased]`; editions are cut in batches.** A change to what a reader takes as
  guidance (a rule, a fact about an app, the checklist, the matrix, a screenshot, a page's prose) keeps the version in
  `package.json` and is described under `## [Unreleased]` in `CHANGELOG.md` (Keep a Changelog), in the section its
  edition will have (Added, Changed, Fixed). A rule it retires goes in `retired-rules.json` with the edition
  `"Unreleased"`. A change that only touches how the guide is shown (typos and spelling, links, Markdown and markup,
  styles, scripts, the build, branding, the PDF's layout) takes no changelog entry. When it touches a page,
  `pages.json` or a screenshot, say so with an `Edition: none` trailer on each commit that touches them (a trailer
  waives only its own commit's files, and never a rule added, retired or re-leveled; git must read it as a trailer, so
  it goes in the message's last paragraph, beside `Co-Authored-By`), or the edition check fails it.
  **A release** is its own pull request, made when the user asks for one: it sets the version and the date in
  `package.json`, renames `## [Unreleased]` to `## [x.y.z] - YYYY-MM-DD` above a new empty `## [Unreleased]`, adds
  the edition's one-paragraph summary under its heading, replaces `"Unreleased"` in `retired-rules.json` with the
  number, and runs `node scripts/pin-references.mjs`, which records in `pins.json` the commit at the head of every
  repository the pages link into. What the edition serves (pages, agent files, downloads) links those commits
  instead of `blob/master`, and this repository's own links its tag (`src/lib/pins.mjs`), so an edition's References
  keep showing the code as it was at the release; the script fails when a linked path
  isn't there. Pages keep writing `blob/master`. **Version numbers** below says which part to raise, for the whole batch.
  While `[Unreleased]` holds anything, the checkout is not the edition its number names: CI builds `latest/` and
  `<version>/` from the current edition's release commit (tagging and archiving it only if it isn't live yet) and
  `master` into `next/`. The editions and their agent files change only when one is released, and a site-only fix
  reaches them with the next release too (a patch can carry one when the batch allows it); `next/` shows it at once.
  **Pauta Next** is `next/`: the batch under `[Unreleased]`, built from `master` by `scripts/build-next.mjs` on every
  deploy while the batch waits, so it can be read before anyone decides to release it. It is not an edition: no
  number or date, links into the apps at their default branch (no pins), `noindex`, a notice on every page and in its
  agent files saying never to cite it or audit against it, never tagged or archived. `versions.json` names it as
  `next` while it exists; with nothing pending, `next/` holds a redirect to `latest/` for every page. Don't release
  to show a change: point at `next/` instead, and release when the batch is worth an app's move. A release changes only `package.json`,
  `CHANGELOG.md`, `retired-rules.json` and `pins.json`; the edition check fails it otherwise.
- **Version numbers** (the Changelog page, `src/content/docs/changelog.mdx`, says the same for readers). Judge by
  the rules alone: what moving an app to the new edition costs. The largest change sets the number.
  - **Patch**: an app does nothing. No rule's ID, level or requirement changes: wording, a fixed fact (matrix, gaps,
    a Reference), a Check fixed to test what its rule already asked, a screenshot, a page or section with no rule.
  - **Minor**: an app adds, and undoes nothing. A new rule at any level, including a MUST every app fails; a level
    raised or lowered; a rule that covers more cases; a rule retired with nothing in its place.
  - **Major**: an app undoes or redoes work that conformed. A rule reversed or replaced by one that asks for
    something else, a requirement changed so the old way fails (a file name, value, chord, color or layout), or a
    change to what the levels or "built to an edition" mean. Rare: when in doubt, it is a minor.
  The edition check judges a release against the edition before it (its tag), so the whole batch counts: it fails a
  patch whose rules gained, lost or re-leveled an ID. It cannot tell a minor from a major, so that call is yours. Say
  in the changelog entry why a major is one.
- Screenshots live in `src/assets/shots/<app>-<what>.png` (max 1600 px wide, palette PNG). In a page, put an
  image alone in a paragraph with a title (`![alt](../../assets/shots/x.png "Caption.")`); several images in one
  paragraph become a gallery row. Captions describe what the image shows, in one sentence.
- Never commit `dist/`, `build/` or `public/downloads/`.
- **Editions.** `package.json` holds the version and `guidelines.date` of the newest released edition; the footer,
  the hero, *What's new*, the Changelog page, the PDF and the Markdown download read them from there. To publish one,
  make a release (above).
- **Several sessions at once.** Other sessions may be working in this repository at the same time, so:
  - Work in your own worktree and branch, never in a checkout another session is using.
  - A guidance change adds its lines under `## [Unreleased]`. When you rebase on `origin/master` and another
    change has added lines there too, keep both.
  - A release chooses its version last, just before you push: `git fetch origin`, rebase on `origin/master`, and
    raise the part the batch calls for above the higher of `origin/master`'s version and the newest `v*` tag on
    origin (`git ls-remote --tags origin`). If someone else released meanwhile, renumber (and pin again). A release
    changes nothing but the version, the date, the changelog's headings and summary, `retired-rules.json` and
    `pins.json`.
  - Never create or push a tag. CI tags `v<version>` after a release merges, on the commit that released it, even
    when the run that tags it is on a later commit.
  - Run `node scripts/check-edition.mjs` before you push. CI runs it on every pull request and push to `master`; it
    fails on a content change that adds nothing under `[Unreleased]` and whose commits carry no `Edition: none` trailer,
    a rule added, retired or re-leveled with nothing new under `[Unreleased]` whatever the trailers say, a numbered
    section added without raising the version, a release that leaves anything under `[Unreleased]`, a release
    numbered at or below master's or a tag on origin, a patch release whose rules gained, lost or re-leveled an ID
    since the edition before it, a retired ID not listed with `"Unreleased"` (or, in a release, its number), or a
    changelog whose newest numbered section doesn't match `package.json`, a release whose `pins.json` pins another
    edition, a release that changes anything but its four files, or a release whose previous edition has neither a tag
    nor a release commit.
  - A merge right after a release can make GitHub cancel the release's run while it waits. The next run on `master`
    publishes that edition from its release commit anyway (`scripts/release-state.mjs`), so nothing needs re-running.
- **Editions on the site.** Every page is served under its edition: `https://pauta-project.dev/1.4.0/principles/` is
  permanent, `https://pauta-project.dev/latest/principles/` is always the newest edition, and the unnumbered address
  redirects to `latest/`. `scripts/build-site.mjs` (`npm run build`) builds this checkout twice, with `PAUTA_PATH`
  `latest` and the version (`astro.config.mjs` puts it in `base` and `outDir`), lays the earlier editions beside them
  from the `versions` branch (with its PDF only for the two newest editions: an older one's overview links its PDF
  on the `versions` branch on GitHub, since the PDFs were most of the site and Pages slowed past its deploy
  timeout), copies `CNAME`, `404.html`, `versions.js`, `downloads/`, `llms.txt`, `llms-full.txt`
  and `rules.json` to the root for GitHub Pages and coding agents, writes `robots.txt` there (everything allowed,
  `latest/`'s sitemap),
  and writes `versions.json`, the list every page reads (`public/versions.js`) to offer editions published after it
  and, on an earlier edition, to point at the latest. The header's switcher (`src/components/EditionSelect.astro`, in the
  phone menu through `MobileMenuFooter.astro`) and the footer link the same page in another edition; a numbered folder carries `noindex`, so search engines index `latest/`.
  `next/` sits beside them while a batch waits (**Pauta Next**, above), from `master` with master's
  `scripts/build-next.mjs`, which also adds it to `versions.json`.
  The `versions` branch holds one folder per published edition and nothing else: CI runs `scripts/archive-edition.sh
  --push` in every run that deploys, so the edition just deployed joins it (a rebuild replaces the folder, so the
  current edition takes site-only fixes until the next one is released). Never edit that branch by hand. Every run on `master`
  deploys, and `scripts/release-state.mjs` says what: HEAD when `[Unreleased]` is empty; while it isn't, the current
  edition built from its release commit (tagged and archived first if it isn't tagged and live yet, because its own
  run was canceled or failed) with `next/` from HEAD. GitHub cancels a run waiting in the deploy's concurrency group when a newer one queues, so an older edition
  can be skipped too; each deploying run finds those (`scripts/missing-editions.mjs`), rebuilds them from the commit
  that released them (`scripts/build-edition.sh`, pinned by `scripts/pin-dist.mjs`), deploys them and has the publish
  job tag and archive them. The deploy waits for the publish job to succeed, and the publish job reads the build's
  artifact from outside its checkout. A
  pre-1.4.0 edition is rebuilt from its tag with `scripts/archive-tag.sh vX.Y.Z` and archived with
  `scripts/archive-edition.sh build/editions/X.Y.Z`. In CI, `npm run build` fails rather than deploy a site that
  lacks a released edition or the downloads. The workflow's build job holds a read-only token; only the publish job,
  which installs nothing, can push, and only in a run on `master`: a pull request, or a manual run on another branch,
  checks and builds and publishes nothing. Pin every action to a commit SHA with its version in a comment. Pages link with relative paths or
  `import.meta.env.BASE_URL`, which already includes the edition folder; `src/lib/site.mjs` gives the site root and
  the edition a page is served from.
- **Where the site lives.** `package.json`'s `guidelines.url` is the only place the site's address is written;
  `astro.config.mjs` derives `site` and `base` from it, and the PDF and Markdown downloads print it. Pages link
  with relative paths or `import.meta.env.BASE_URL`, never a hard-coded `/adl-desktop-apps-guidelines/`.
  To move to a custom domain: set the URL (for example `https://pauta-project.dev/`), add `public/CNAME` with the
  bare domain, set the domain in the repository's Pages settings, and update the links in `README.md`.
