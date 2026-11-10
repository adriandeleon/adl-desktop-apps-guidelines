---
title: "Conformance"
description: "How an app says which edition of Pauta it implements and how fully it conforms, and how it records the rules it does not meet: not applicable, a deliberate deviation, or work still pending."
---

An app implements one edition of Pauta, says how fully it conforms (Complete, Core or Partial), and shows both in its
About window. The rules it does not meet are not hidden: each one is an **exception**, written down once in the app's `pauta.json`, shown in the app's
[Pauta window](../templates/pauta-window/) and listed in its user docs. Its conformance is worked out from that list,
never typed in by hand, so the claim and the evidence can't drift apart.

No released app does this yet; the [app template](https://github.com/adriandeleon/adl-desktop-app-template) does: `pauta.json` holds its exceptions, `PautaConformance`
computes its conformance and `PautaConformanceTest` checks both. The audit in [Coding agents and LLMs](../coding-agents/#audit-an-app) produces the first list:
each MUST and SHOULD it reports as `fail` becomes an exception, of the kind that fits. A `limited` result needs none, and neither does a `manual` one ([PAUTA-18](#pauta-18)).

## Complete, Core and Partial

| Conformance | The app meets… | About says |
|---|---|---|
| **Complete** | every MUST of its edition, met or not applicable, and every SHOULD, met, not applicable or a recorded deviation | Built to Pauta x.y.z · Pauta conformance: Complete |
| **Core** | every MUST in the same way; one or more SHOULDs are still pending | Built to Pauta x.y.z · Pauta conformance: Core |
| **Partial** | not every MUST: one or more MUSTs are still pending | Working toward Pauta x.y.z · Pauta conformance: Partial |

"Built to an edition" keeps its meaning: the app meets that edition's MUSTs. Core and Complete are the two ways to be
built to it; a Partial app is working toward it and says so. MAY rules never count. A deviation, which only a SHOULD can
have, leaves the conformance as it is but is always on show: About gives the number of exceptions, and the Pauta
window lists every one. A rule checked by hand counts once someone has found it unmet and recorded the exception;
until a person has checked it, it leaves the conformance as it is ([PAUTA-18](#pauta-18)).

Partial is how an app that already ships says it is on its way: it took up an edition after its first release, or
moved to a newer one with new MUSTs. A new app is not released at Partial.

- **PAUTA-01 · MUST.** Every app implements Pauta: it names one edition (the `pauta.version` of
  [ABOUT-08](../templates/about/#about-08)) and states its conformance as [Complete, Core or Partial](#complete-core-and-partial): Complete meets every MUST and
  every SHOULD (met, not applicable or a recorded deviation), Core every MUST with SHOULDs still pending, Partial not
  yet every MUST.
  - *Why:* an app that is in the family answers to these rules; saying which ones, and how far, is the first of them.
  - *Check (code):* `pom.xml` defines `pauta.version` and `src/main/resources/com/<app>/pauta.json` exists.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; { grep -q '<pauta.version>' pom.xml || { echo 'no pauta.version in pom.xml'; false; }; } && { find src/main/resources -path '*/com/*' -name pauta.json | grep . || { echo 'no pauta.json'; false; }; }`
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`pom.xml`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/pom.xml) (`pauta.version`) and [`pauta.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/resources/com/example/app/pauta.json).
- **PAUTA-02 · MUST.** The conformance is computed, never stored: one pure helper reads the exceptions and returns Partial
  when any MUST is pending, Core when any SHOULD is pending, and Complete otherwise. Nothing else enters it: the
  `checked` list ([PAUTA-18](#pauta-18)) is a record, and a by-hand rule with no entry there leaves the result as
  it is. About, the Pauta window and the docs page take it from there; the README, which can't call the helper, is
  held to it by a test (PAUTA-15).
  - *Why:* [*One source of truth for each fact*](../principles/#for-the-people-building-them). A conformance typed
    in by hand stays "Complete" after a pending exception is added.
  - *Check (test):* a unit test of the helper (`PautaConformance`, or the app's equivalent) covers all three and
    shows that deviation, not-applicable and app-only entries leave the result alone; the helper is handed the
    exceptions and nothing of the `checked` list.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformance.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/java/com/example/app/PautaConformance.java) (`of`, which takes the exceptions alone, and `conformance`), tested by [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/PautaConformanceTest.java).
    Its `Kind` has no `app-only` yet, so the test covers deviation and not-applicable entries and MAYs.
- **PAUTA-03 · MUST.** A new app's first release is at Core or Complete: the [New app checklist](../checklist/)'s
  MUSTs are release blockers, and recording one as pending does not lift that. A template repository is never
  released as an app, so this rule is for the app made from it and the template records no entry for it.
  - *Check (by hand):* the About window of the app's first release says Core or Complete.
  - *Reference:* no app yet.

## Exceptions

An exception is one MUST or SHOULD the app does not meet as written; MAYs never need one. There are three kinds for
an app, and a fourth for a template repository; each one asks for something different.

| Kind | Means | Needs |
|---|---|---|
| `not-applicable` | The rule applies to every app, but its subject does not exist in this one: no password or token it ever asks for, no files to give icons to | A reason |
| `deviation` | A SHOULD only: the app does it differently on purpose, and would make the same choice again | A reason and a decision record |
| `pending` | The app does not do it yet | A reason and an issue |
| `app-only` | A template only: the rule needs what each app made from it has of its own, such as its website, its screenshots or its repository settings | A reason |

- **PAUTA-04 · MUST.** Every MUST and SHOULD of the edition that the app does not meet has an exception, and every
  exception names a rule the app does not meet. An unmet rule with no entry is a failed audit, not an exception; an
  entry for a rule the app now meets is removed in the same change that meets it. A rule checked by hand counts like
  any other once a person has checked it in the running app: found unmet, it gets an exception; found met, a
  `checked` entry ([PAUTA-18](#pauta-18)). Until then it has neither, and that is not a failed audit: the audit
  reports it as `manual`, not recorded.
  - *Why:* [*Never claim what is not true*](../principles/#for-the-people-using-the-apps). The list is the app's
    claim; it has to be whole and current.
  - *Check (by hand):* audit the app against its edition ([Coding agents and LLMs](../coding-agents/#audit-an-app)):
    no MUST or SHOULD is `fail`, and no result reports an entry for a rule that passes. A `manual` result with no
    `checked` entry is reported as not recorded (PAUTA-18): that is not a failure of the app, and it does not fail
    this check.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`pauta.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/resources/com/example/app/pauta.json).
- **PAUTA-05 · MUST.** A rule limited to apps with a feature needs no entry in an app without that feature. A rule is
  limited when its own text says so ("An app with user data worth carrying between computers…"), when its page or
  section opens with an **Applies to** line (the [Tray and background](../tray-and-background/) page; `appliesTo` in
  `rules.json`), or when it details a rule that is limited (WELC-03 onward detail the Welcome page of [WELC-01](../templates/welcome/#welc-01)).
  `not-applicable` is for a rule that reads as applying to every app.
  - *Check (code):* no `not-applicable` entry names a rule whose text, page, section or parent rule already limits
    it.
  - *Reference:* no app yet.
- **PAUTA-06 · MUST.** A `deviation` is a choice, not a gap, and only a SHOULD can have one: a SHOULD is expected
  unless the app has a stated reason, and the deviation is that reason. It links a decision record in
  `docs/decisions/` ([DOCS-13](../documentation/#docs-13)) that gives the context, what the app does instead, and what
  it costs. A MUST the app does not meet is `pending`, as is any work it has not done yet.
  - *Why:* a deviation keeps the conformance; a deviation from a MUST, or missing work called a deviation, would let
    the app say it is built to an edition it does not meet.
  - *Check (code):* every `deviation` entry names a SHOULD, and its `link` opens a file under `docs/decisions/` that
    names the rule's ID.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/PautaConformanceTest.java) (`eachKindHasWhatItNeeds`).
- **PAUTA-07 · MUST.** A `pending` exception links an open issue in the app's own repository that names the rule's
  ID and edition, "MENU-14 (Pauta x.y.z)". One issue may hold several rules, one per page for example, if it names
  each one that way. Closing the issue removes its entries.
  - *Check (code):* every `pending` entry's `link` is an issue URL in the app's own repository; the source settles
    that much. That the issue is open and names the entry's rule ID and edition is read from the issue itself
    (`gh issue view <number>`), which needs the network: without it, say in the evidence that the issue was not
    read.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/PautaConformanceTest.java) (`eachKindHasWhatItNeeds`), whose pending entries link issues in the template's own repository.
- **PAUTA-08 · MUST.** Each exception's `reason` is one plain sentence for the person using the app, in English like
  the changelog: what is different and, for a deviation, what they get instead. No rule text, no class names.
  - *Check (by hand):* read each reason in the Pauta window as a user would.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/PautaConformanceTest.java) (`eachKindHasWhatItNeeds`: a reason ends with a period and names no rule ID).
- **PAUTA-16 · MUST.** A template repository, one that new apps are made from, sets `"template": true` in its
  `pauta.json` and records as `app-only` the rules that only an app made from it can meet. `app-only` leaves the
  conformance as it is, like `not-applicable`, and nothing but a template may use it. Making an app from the
  template sets `template` to `false`. From then on the app's everyday build passes but lists what it inherited:
  each `app-only` entry and each `pending` link to another repository. Its release build fails until each one is
  met, or recorded as `pending` with an issue in the app's own repository.
  - *Why:* a template can't have the website or screenshots of an app that doesn't exist yet, and an app must not
    inherit its template's issues as its own. A build that failed the moment the app was made would fail its first
    step; the release is where it has to be settled ([PAUTA-03](#pauta-03)).
  - *Check (code):* in a template, `pauta.json` has `"template": true` and the rename script sets it to `false`; in
    an app, the release build runs the test with inherited entries treated as failures, and the app's first
    release has no `app-only` entry.
  - *Reference:* the [app template](https://github.com/adriandeleon/adl-desktop-app-template) (in progress).
- **PAUTA-18 · MUST.** `pauta.json`'s `checked` list is the record of the rules checked by hand. An entry is there
  only because a person checked the rule in the running app and found it met, and it holds the `rule`, the `edition`
  it was checked against and the `date`. It says the rule was met when it was checked, not that the app still meets
  it. A rule found unmet gets an exception instead ([PAUTA-04](#pauta-04)), never both. A by-hand rule with no entry
  has not been recorded as checked: it needs no exception and no issue, it does not change the computed conformance
  ([PAUTA-02](#pauta-02)), and the audit reports it as not recorded. An entry is stale when its `edition` is older
  than the rule's `changed` in the edition's `rules.json`, the edition in which the rule's level, scope or statement
  last changed, and only then: the app's test fails it ([PAUTA-10](#pauta-10)) until it is removed and the rule
  checked again.
  - *Why:* an audit can only answer `manual` for these rules, and its report is written again each time. Without a
    record, a rule someone checked last week and a rule nobody ever looked at read the same. The record stays out
    of the conformance because nothing in the code tells an unchecked rule from a met one: counting it would make
    an app record as pending what it may well meet.
  - *Check (code):* every `checked` entry has a `rule`, an `edition` and a `date`; the rule is one of the edition's
    whose check is by hand (`check.kind` in `rules.json`); the edition is no newer than `pauta.version` and no
    older than the rule's `changed`; no rule is listed twice, and none has an exception as well. That a person
    looked is the entry's own claim, which the code can't show.
  - *Reference:* no app yet: the [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`pauta.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/resources/com/example/app/pauta.json) has no `checked` list, and its [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/PautaConformanceTest.java) reads none.

## The file

The exceptions live in one file, bundled with the app so the Pauta window can read it:
`src/main/resources/com/<app>/pauta.json`. The by-hand checks someone has done are recorded beside them (PAUTA-18). The edition stays in `pom.xml` (ABOUT-08). Each exception copies the rule's
`level` and `url` from the edition's [`rules.json`](../coding-agents/) so the app needs nothing else at run time, and
a test keeps the copies honest.

```json
{
  "exceptions": [
    {
      "rule": "MENU-14",
      "level": "MUST",
      "url": "https://pauta-project.dev/<edition>/menus/#menu-14",
      "kind": "pending",
      "reason": "Some menu rows have no icon yet.",
      "link": "https://github.com/adriandeleon/<App>/issues/212"
    },
    {
      "rule": "SET-14",
      "level": "MUST",
      "url": "https://pauta-project.dev/<edition>/settings/#set-14",
      "kind": "not-applicable",
      "reason": "<App> never asks for a password or token."
    },
    {
      "rule": "KBD-12",
      "level": "SHOULD",
      "url": "https://pauta-project.dev/<edition>/keyboard/#kbd-12",
      "kind": "deviation",
      "reason": "<App> has no keymap editor: you change a key in keymap.json, which Settings opens for you.",
      "link": "https://github.com/adriandeleon/<App>/blob/master/docs/decisions/0007-no-keymap-editor.md"
    }
  ],
  "checked": [
    { "rule": "KBD-15", "edition": "<edition>", "date": "2026-11-02" }
  ]
}
```

- **PAUTA-09 · MUST.** The exceptions and the record of by-hand checks have one source, `pauta.json` laid out as
  [The file](#the-file) shows. Its `exceptions` list has `rule`, `level`, `url`, `kind` and `reason` on every entry,
  `link` on every deviation and pending entry, and one entry per rule. Its `checked` list
  ([PAUTA-18](#pauta-18)), left out or empty while nothing is recorded, has `rule`, `edition` and `date` on every
  entry and one entry per rule. `"template": true` stands beside them only in a template repository (PAUTA-16).
  - *Check (code):* the file exists at that path, each exception has the fields its kind needs, and each `checked`
    entry has its three.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`pauta.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/main/resources/com/example/app/pauta.json), read by [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/PautaConformanceTest.java) (`parsesEveryField`, `everyEntryNamesARuleOfTheEditionWithItsLevelAndAddress`).
    The file has no `checked` list yet.
- **PAUTA-10 · MUST.** A test reads `pauta.json` against a copy of the edition's `rules.json` in
  `src/test/resources/pauta-rules.json` and fails when the copy's `edition` is not `pauta.version`, when an entry
  names a rule the edition does not have, when its `level` or `url` differs from the edition's, when a rule appears
  twice, when a deviation names a MUST, when a deviation or pending entry has no `link`, or when a `checked` entry
  ([PAUTA-18](#pauta-18)) names a rule that is not checked by hand, a rule listed twice, a rule with an exception,
  an edition newer than `pauta.version`, or an edition older than the rule's `changed`, which makes the entry
  stale. Outside a template, it reports each `app-only` entry and each `pending` link that is not
  an issue in the app's own repository (the one the app's own code names; `AppInfo.GITHUB_REPO` in the template),
  and fails on them in the release build ([PAUTA-16](#pauta-16)).
  - *Why:* moving to a newer edition changes levels, retires IDs and changes rules a person checked by hand; the
    test turns each stale entry into a failure.
  - *Check (test):* `PautaConformanceTest`, or the app's equivalent, runs in the build and has a case for each
    failure the rule lists.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/PautaConformanceTest.java) and its copy of the edition's rules, [`pauta-rules.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/resources/pauta-rules.json). Two parts aren't built yet: the template's (`app-only`, inherited links) and everything about `checked`. The
    test reads the `exceptions` list only.
- **PAUTA-11 · SHOULD.** Moving to a newer edition is one change: replace `pauta-rules.json` with the new edition's,
  and the app's copy of the audit skill where it keeps one (the app template's is
  `.claude/skills/pauta-audit/SKILL.md`); remove the `checked` entries the new `rules.json` makes stale
  ([PAUTA-18](#pauta-18)) and check those rules again; run the audit again and update `pauta.json`; then change
  `pauta.version`, the README and `AGENTS.md` together.
  - *Why:* each of these names or follows the edition. The test fails a `pauta-rules.json` or a `checked` entry left
    behind (PAUTA-10); nothing fails a skill copy left behind, which then audits the new rules by the old procedure.
  - *Check (by hand):* the change that raises `pauta.version` also replaces `pauta-rules.json` and the skill copy,
    where the app keeps one, leaves no `checked` entry older than its rule's `changed`, and touches `pauta.json`
    where the audit found something new.
  - *Reference:* [Move an app to a newer edition](../coding-agents/#move-an-app-to-a-newer-edition).

## Where it shows

The same list reaches three readers: the person using the app, the person reading its docs, and whoever reviews
the repository.

In the app, the edition and the conformance are in About ([ABOUT-05](../templates/about/#about-05),
[ABOUT-09](../templates/about/#about-09)) and the exceptions in the Pauta window, which opens from About, the Help
menu and the Command Palette ([PWIN-01](../templates/pauta-window/#pwin-01)) and lists every one
([PWIN-02](../templates/pauta-window/#pwin-02)).

- **PAUTA-13 · MUST.** In the user docs: the app's website has a *Pauta conformance* page under `/docs/`
  ([DOCS-02](../documentation/#docs-02)) with the edition, the conformance and every exception, grouped by kind, each with
  its rule ID linked to the edition's rule, its reason and its link. The Pauta window's link to it is
  [PWIN-07](../templates/pauta-window/#pwin-07).
  - *Check (code):* the website's `src/content/docs/` has the page, and it lists the same rules as `pauta.json`.
  - *Reference:* no app yet.
- **PAUTA-14 · SHOULD.** The docs page is generated from `pauta.json`, like the Commands page
  ([DOCS-04](../documentation/#docs-04)), so it cannot list a different set from the app.
  - *Check (code):* the website's `scripts/` has a generator that reads the app's `pauta.json`, and its output is
    committed.
  - *Reference:* no app yet; editora-website's [`scripts/GenCommands.java`](https://github.com/adriandeleon/editora-website/blob/master/scripts/GenCommands.java) is the pattern.
- **PAUTA-15 · MUST.** In the repository: the README's Pauta badge ([README badges](../repository/#readme-badges-in-this-order))
  and its "Built to" line (at Partial, "Working toward") name the edition and the conformance, and both link to the
  docs page.
  - *Check (test):* `PautaConformanceTest` fails when the README's badge or line names another edition than
    `pauta.version` or another conformance than `PautaConformance` returns.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s README (the badge and the *Working toward* line), checked by [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/PautaConformanceTest.java) (`theReadmeNamesTheEditionAndTheConformanceAndLinksTheDocsPage`).
- **PAUTA-17 · MUST.** For the app's coding agent: `AGENTS.md` has a `## Pauta` section that names the edition
  `pauta.version` names and links that edition's `llms.txt` and `llms-full.txt` at its numbered address, never
  `latest/` ([Coding agents and LLMs](../coding-agents/#point-the-apps-agent-at-its-edition)).
  - *Why:* an agent that reads no rules builds without them, and one that reads `latest/` "fixes" MUSTs of a newer
    edition the app hasn't moved to.
  - *Check (test):* a test fails when `AGENTS.md`'s Pauta section names another edition than `pauta.version`, or
    doesn't link `https://pauta-project.dev/<edition>/llms.txt`.
  - *Reference:* the app template's [`AGENTS.md`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/AGENTS.md), Termina's [`AGENTS.md`](https://github.com/adriandeleon/Termina/blob/master/AGENTS.md) and Mirada's [`AGENTS.md`](https://github.com/adriandeleon/Mirada/blob/main/AGENTS.md) have the
    section.
    The template's [`EditionTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/master/src/test/java/com/example/app/EditionTest.java) (`theReadmeAndAgentsNameTheSameEdition`) checks the edition the file names, but
    not the section's `llms.txt` link yet.
