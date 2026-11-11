# Conformance

> How an app says which edition of Pauta it implements and how fully it conforms, and how it records the rules it does not meet: not applicable, a deliberate deviation, or work still pending.

Pauta 6.0.1 (2026-11-11). The page with its screenshots and mockups: https://pauta-project.dev/6.0.1/conformance/.
Every rule of the edition: https://pauta-project.dev/6.0.1/llms-full.txt.

An app implements one edition of Pauta, says how fully it conforms (Complete, Core or Partial), and shows both in its
About window. The rules it does not meet are not hidden: each one is an **exception**, written down once in the app's `pauta.json`, shown in the app's
[Pauta window](https://pauta-project.dev/6.0.1/templates/pauta-window/) and listed in its user docs. Its conformance is worked out from that list,
never typed in by hand, so the claim and the evidence can't drift apart.

No released app does this yet; the [app template](https://github.com/adriandeleon/adl-desktop-app-template) does: `pauta.json` holds its exceptions, `PautaConformance`
computes its conformance and `PautaConformanceTest` checks both. The audit in [Coding agents and LLMs](https://pauta-project.dev/6.0.1/coding-agents/#audit-an-app) produces the first list:
each MUST and SHOULD it reports as `fail` becomes an exception, of the kind that fits. A `limited` result needs none, and neither does a `manual` one ([PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)) or a `not-checked` one, which the audit could not see from the app's checkout: both are reported, and neither blocks a release.

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
until a person has checked it, it leaves the conformance as it is ([PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)). So does a rule an audit
reports as `not-checked`, because its Check reads the website's repository or a repository setting.

Partial is how an app that already ships says it is on its way: it took up an edition after its first release, or
moved to a newer one with new MUSTs. A new app is not released at Partial.

- **PAUTA-01 · MUST.** Every app implements Pauta: it names one edition (the `pauta.version` of
  [ABOUT-08](https://pauta-project.dev/6.0.1/templates/about/#about-08)) and states its conformance as [Complete, Core or Partial](https://pauta-project.dev/6.0.1/conformance/#complete-core-and-partial): Complete meets every MUST and
  every SHOULD (met, not applicable or a recorded deviation), Core every MUST with SHOULDs still pending, Partial not
  yet every MUST.
  - *Why:* an app that is in the family answers to these rules; saying which ones, and how far, is the first of them.
  - *Check (code):* `pom.xml` defines `pauta.version` and `src/main/resources/com/<app>/pauta.json` exists.
  - *Command:* `[ -f pom.xml ] || { echo 'not an app root: no pom.xml here'; exit 1; }; { grep -q '<pauta.version>' pom.xml || { echo 'no pauta.version in pom.xml'; false; }; } && { find src/main/resources -path '*/com/*' -name pauta.json | grep . || { echo 'no pauta.json'; false; }; }`
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`pom.xml`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/pom.xml) (`pauta.version`) and [`pauta.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/resources/com/example/app/pauta.json).
- **PAUTA-02 · MUST.** An app's conformance is computed, never stored: one pure helper reads the exceptions and returns Partial
  when any MUST is pending, Core when any SHOULD is pending, and Complete otherwise. Nothing else enters it: the
  `checked` list ([PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)) is a record, and a by-hand rule with no entry there leaves the result as
  it is. About, the Pauta window and the docs page take it from there; the README's badge and line
  ([PAUTA-15](https://pauta-project.dev/6.0.1/conformance/#pauta-15)), which can't call the helper, are held to it by a test.
  - *Why:* [*One source of truth for each fact*](https://pauta-project.dev/6.0.1/principles/#for-the-people-building-them). A conformance typed
    in by hand stays "Complete" after a pending exception is added.
  - *Check (code):* one helper returns the conformance (the template's `PautaConformance.of`): it is handed the
    exceptions and nothing of the `checked` list, returns Partial for a pending MUST, Core for a pending SHOULD
    and Complete otherwise, and deviation, not-applicable and app-only entries leave its result alone. About and
    the Pauta window call it, and nothing in the app's code stores a conformance. A test fails when the README's badge
    or line names another conformance than the helper returns: the statement requires that one. A unit test of
    the helper that covers all three results is the surest evidence for the rest. That the docs page shows the
    same conformance is read with the page itself, in the website's repository ([PAUTA-13](https://pauta-project.dev/6.0.1/conformance/#pauta-13)).
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformance.java`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/java/com/example/app/PautaConformance.java) (`of`, which takes the exceptions alone, and `conformance`), tested by [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/PautaConformanceTest.java),
    whose `theReadmeNamesTheEditionAndTheConformanceAndLinksTheDocsPage` holds the README and whose
    `deviationsAppOnlyAndNotApplicableEntriesAndMaysLeaveTheConformanceAlone` covers the entries that leave it alone.
- **PAUTA-03 · MUST.** A new app, one that has made no release yet, makes its first release at Core or Complete:
  the [New app checklist](https://pauta-project.dev/6.0.1/checklist/)'s MUSTs are release blockers, and recording one as pending does not lift
  that. An app with a release behind it is not covered: it may be at Partial, and says so
  ([Complete, Core and Partial](https://pauta-project.dev/6.0.1/conformance/#complete-core-and-partial)). A template repository is never released as an app,
  so this rule is for the app made from it and the template records no entry for it.
  - *Check (by hand):* in an app with no release yet (no numbered section in its `CHANGELOG.md`, no version tag),
    the About window of the build to be released says Core or Complete. An app that has released, and a template,
    are outside the rule.
  - *Reference:* no app yet.

## Exceptions

An exception is one MUST or SHOULD the app does not meet as written; MAYs never need one. There are three kinds for
an app, and a fourth for a template repository; each one asks for something different.

| Kind | Means | Needs |
|---|---|---|
| `not-applicable` | The rule reads as applying to every app, and nothing limits it ([PAUTA-05](https://pauta-project.dev/6.0.1/conformance/#pauta-05)), but what it asks for has no use in this one: a Doctor page ([DIAG-07](https://pauta-project.dev/6.0.1/diagnostics/#diag-07)) in an app that depends on no outside tool or library | A reason |
| `deviation` | A SHOULD only: the app does it differently on purpose, and would make the same choice again | A reason and a decision record |
| `pending` | The app does not do it yet | A reason and an issue |
| `app-only` | A template only: the rule needs what each app made from it has of its own, such as its website, its screenshots or its repository settings | A reason |

- **PAUTA-04 · MUST.** Every MUST and SHOULD of the edition that the app does not meet has an exception, and every
  exception names a rule the app does not meet. An unmet rule with no entry is a failed audit, not an exception; an
  entry for a rule the app now meets is removed in the same change that meets it. A rule checked by hand counts like
  any other once a person has checked it in the running app: found unmet, it gets an exception; found met, a
  `checked` entry ([PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)). Until then it has neither, and that is not a failed audit: the audit
  reports it as `manual`, not recorded.
  - *Why:* [*Never claim what is not true*](https://pauta-project.dev/6.0.1/principles/#for-the-people-using-the-apps). The list is the app's
    claim; it has to be whole and current.
  - *Check (code):* the audit of the app against its edition ([Coding agents and LLMs](https://pauta-project.dev/6.0.1/coding-agents/#audit-an-app))
    is this check, so the audit judges this rule last, from its other results: no MUST or SHOULD is `fail`, and no
    result reports an entry for a rule that passes. The evidence names the rules that fail. A
    `manual` result with no `checked` entry is reported as not recorded (PAUTA-18), and a `not-checked` one as
    out of the audit's reach: neither is a failure of the app, and neither fails this check. An audit of part of
    the edition judges it from the rules in its scope and says so.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`pauta.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/resources/com/example/app/pauta.json), the only list of exceptions so far, beside the audit report that shows it whole:
    [`docs/pauta-audit.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/docs/pauta-audit.json) and [`docs/pauta-audit.md`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/docs/pauta-audit.md), where
    no MUST or SHOULD fails and its nine `app-only` entries are the only exceptions.
- **PAUTA-05 · MUST.** A rule limited to apps with a feature needs no entry in an app without that feature. A rule is
  limited when its own text says so ("An app that stores a secret…"), when its page or
  section opens with an **Applies to** line (the [Tray and background](https://pauta-project.dev/6.0.1/tray-and-background/) page; `appliesTo` in
  `rules.json`), or when it details a rule that is limited (WELC-03 onward detail the Welcome page of [WELC-01](https://pauta-project.dev/6.0.1/templates/welcome/#welc-01)).
  Nothing else limits a rule: a scope is read from one of the three, never inferred from what the app lacks.
  `not-applicable` is for a rule that reads as applying to every app.
  - *Check (code):* no `not-applicable` entry names a rule whose text, page, section or parent rule already limits
    it.
  - *Reference:* the [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`pauta.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/resources/com/example/app/pauta.json) has no `not-applicable` entry, so it meets the
    rule with nothing to hold; the six apps have no `pauta.json`.
- **PAUTA-06 · MUST.** A `deviation` is a choice, not a gap, and only a SHOULD can have one: a SHOULD is expected
  unless the app has a stated reason, and the deviation is that reason. It links a decision record in
  `docs/decisions/` ([DOCS-13](https://pauta-project.dev/6.0.1/documentation/#docs-13)) that gives the context, what the app does instead, and what
  it costs. A MUST the app does not meet is `pending`, as is any work it has not done yet.
  - *Why:* a deviation keeps the conformance; a deviation from a MUST, or missing work called a deviation, would let
    the app say it is built to an edition it does not meet.
  - *Check (code):* every `deviation` entry names a SHOULD, and its `link` opens a file under `docs/decisions/` that
    names the rule's ID.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/PautaConformanceTest.java) (`eachKindHasWhatItNeeds`).
- **PAUTA-07 · MUST.** A `pending` exception links an open issue in the app's own repository that names the rule's
  ID and edition, "MENU-14 (Pauta x.y.z)". One issue may hold several rules, one per page for example, if it names
  each one that way. Closing the issue removes its entries.
  - *Check (code):* every `pending` entry's `link` is an issue URL in the app's own repository; the source settles
    that much, and a link that is not one fails the rule. That the issue is open and names the entry's rule ID and
    edition is read from the issue itself (`gh issue view <number>`), which is on GitHub and not in the checkout.
    An audit that cannot read the issues reports the rule as `not-checked` and says what would settle it. With no
    `pending` entry there is nothing to read, and the rule is met.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/PautaConformanceTest.java) (`eachKindHasWhatItNeeds`), which fails a pending link that is not an issue in the app's repository or the template's.
    The template has no `pending` entry left, so it meets the rule with nothing to read.
- **PAUTA-08 · MUST.** Each exception's `reason` is one plain sentence for the person using the app, in English like
  the changelog: what is different and, for a deviation, what they get instead. No rule text, no class names.
  - *Check (by hand):* read each reason in the Pauta window as a user would. The source settles two cases: a
    reason that runs to more than one sentence, or carries rule text or a class name, fails the rule, and with no
    exception there is no reason to read and the rule is met.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/PautaConformanceTest.java) (`eachKindHasWhatItNeeds`: a reason ends with a period and names no rule ID).
- **PAUTA-16 · MUST.** A template repository, one that new apps are made from, sets `"template": true` in its
  `pauta.json` and records as `app-only` the rules that only an app made from it can meet. `app-only` leaves the
  conformance as it is, like `not-applicable`, and nothing but a template may use it. Making an app from the
  template sets `template` to `false`. From then on the app's everyday build passes but lists what it inherited:
  each `app-only` entry and each `pending` link to another repository. Its release build fails until each one is
  met, or recorded as `pending` with an issue in the app's own repository. An app that was not made from a
  template inherits nothing, and the rule asks nothing of it.
  - *Why:* a template can't have the website or screenshots of an app that doesn't exist yet, and an app must not
    inherit its template's issues as its own. A build that failed the moment the app was made would fail its first
    step; the release is where it has to be settled ([PAUTA-03](https://pauta-project.dev/6.0.1/conformance/#pauta-03)).
  - *Check (code):* in a template, `pauta.json` has `"template": true` and the script that makes an app from it
    sets it to `false`. Outside a template, an `app-only` entry or a `pending` link to another repository is what
    a template left behind: the test of [PAUTA-10](https://pauta-project.dev/6.0.1/conformance/#pauta-10) lists each one in the everyday build, and the
    release build runs it with them treated as failures, so no released app keeps an `app-only` entry. An app
    whose `pauta.json` has no `template` field, no `app-only` entry and no `pending` link to another repository,
    or that has no `pauta.json`, shows nothing inherited from a template: it is outside the rule, and an audit
    reports it as `limited`.
  - *Reference:* the [app template](https://github.com/adriandeleon/adl-desktop-app-template): its [`pauta.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/resources/com/example/app/pauta.json) has `"template": true` and nine `app-only`
    entries, its [`scripts/rename.sh`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/scripts/rename.sh) sets `"template": false`, and its
    [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/PautaConformanceTest.java) holds both (`onlyATemplateRecordsWhatOnlyAnAppCanMeet`) and, outside a template, lists the
    `app-only` entries and the `pending` links to another repository in every build and fails on them when the
    `dist` profile sets `pauta.release` (`theAppListsWhatItInherited`; [`pom.xml`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/pom.xml)). No app has been made
    from it yet.
- **PAUTA-18 · MUST.** `pauta.json`'s `checked` list is the record of the rules checked by hand, and this rule
  governs only the entries an app chooses to record: each one is well formed and not stale. An app that records
  none, with no `checked` list or an empty one, meets it. An entry is there
  only because a person checked the rule in the running app and found it met, and it holds the `rule`, the `edition`
  it was checked against and the `date`, and may hold the app's `version`, for a rule that is checked again with
  each release (the screen-reader pass of [ACC-07](https://pauta-project.dev/6.0.1/accessibility/#acc-07)): the audit reports it, and nothing
  expires by it. It says the rule was met when it was checked, not that the app still meets
  it. A rule found unmet gets an exception instead ([PAUTA-04](https://pauta-project.dev/6.0.1/conformance/#pauta-04)), never both. A by-hand rule with no entry
  has not been recorded as checked: it needs no exception and no issue, it does not change the computed conformance
  ([PAUTA-02](https://pauta-project.dev/6.0.1/conformance/#pauta-02)), and it does not fail this rule. The audit reports it as not recorded, so its report
  still says which by-hand rules nobody has recorded. An entry is stale when its `edition` is older
  than the rule's `changed` in the edition's `rules.json`, the edition in which the rule's level, scope or statement
  last changed, and only then: the app's test fails it ([PAUTA-10](https://pauta-project.dev/6.0.1/conformance/#pauta-10)) until it is removed and the rule
  checked again.
  - *Why:* an audit can only answer `manual` for these rules, and its report is written again each time. Without a
    record, a rule someone checked last week and a rule nobody ever looked at read the same. The record stays out
    of the conformance because nothing in the code tells an unchecked rule from a met one: counting it would make
    an app record as pending what it may well meet.
  - *Check (code):* every `checked` entry has a `rule`, an `edition` and a `date`; the rule is one of the edition's
    whose check is by hand (`check.kind` in `rules.json`); the edition is no older than the rule's `changed`
    (one newer than `pauta.version`, and a rule listed twice, are for the test of [PAUTA-10](https://pauta-project.dev/6.0.1/conformance/#pauta-10) to fail);
    and no rule has an exception as well. With no `checked` list, or an empty one, there is no entry to fail and the
    rule is met: the audit's `manual` results say which by-hand rules are not recorded, and that is no failure of
    this rule. That a person looked is the entry's own claim, which the code can't show.
  - *Reference:* no app records a by-hand check yet, so each meets the rule with nothing to hold: the
    [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`pauta.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/resources/com/example/app/pauta.json) has no `checked` list, though its [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/PautaConformanceTest.java) would hold one
    (`eachCheckedEntryIsWellFormedAndCurrent`), and the six apps have no `pauta.json`.

## The file

The exceptions live in one file, bundled with the app so the Pauta window can read it:
`src/main/resources/com/<app>/pauta.json`. The by-hand checks someone has done may be recorded beside them (PAUTA-18). The edition stays in `pom.xml` (ABOUT-08). Each exception copies the rule's
`level` and `url` from the edition's [`rules.json`](https://pauta-project.dev/6.0.1/coding-agents/) so the app needs nothing else at run time, and
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
      "rule": "DIAG-07",
      "level": "SHOULD",
      "url": "https://pauta-project.dev/<edition>/diagnostics/#diag-07",
      "kind": "not-applicable",
      "reason": "<App> depends on no outside tool or library, so it has nothing for a Doctor page to check."
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
    { "rule": "SET-02", "edition": "<edition>", "date": "2026-11-02" }
  ]
}
```

- **PAUTA-09 · MUST.** An app's exceptions and its record of by-hand checks have one source: `pauta.json`, bundled
  with the app's resources (`src/main/resources/com/<app>/pauta.json`) and laid out as [The file](https://pauta-project.dev/6.0.1/conformance/#the-file) shows.
  Its `exceptions` list has `rule`, `level`, `url`, `kind` and `reason` on every entry, `link` on every deviation and
  pending entry, and one entry per rule. Its `checked` list is the app's to keep or not: an app that records no
  by-hand check leaves it out or empty, and what an entry of it holds is [PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)'s. `"template": true`
  stands beside the two lists only in a template repository (PAUTA-16).
  - *Check (code):* `pauta.json` is among the app's bundled resources, under `src/main/resources/`; each exception has
    the fields its kind needs and no rule has two. The entries of the `checked` list are [PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)'s to
    judge, and a file with no `checked` list passes.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`pauta.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/main/resources/com/example/app/pauta.json), read by [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/PautaConformanceTest.java) (`parsesEveryField`, `everyEntryNamesARuleOfTheEditionWithItsLevelAndAddress`).
    The file has no `checked` list, which the rule allows.
- **PAUTA-10 · MUST.** A test reads `pauta.json` against a copy of the edition's `rules.json` in
  `src/test/resources/pauta-rules.json` and fails when the copy's `edition` is not `pauta.version`, when an entry
  names a rule the edition does not have, when its `level` or `url` differs from the edition's, when a rule appears
  twice, when a deviation names a MUST, when a deviation or pending entry has no `link`, or when a `checked` entry
  ([PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)) names a rule that is not checked by hand, a rule listed twice, a rule with an exception,
  an edition newer than `pauta.version`, or an edition older than the rule's `changed`, which makes the entry
  stale. Outside a template, it reports each `app-only` entry and each `pending` link that is not
  an issue in the app's own repository (the one the app's own code names; `AppInfo.GITHUB_REPO` in the template),
  and fails on them in the release build ([PAUTA-16](https://pauta-project.dev/6.0.1/conformance/#pauta-16)).
  - *Why:* moving to a newer edition changes levels, retires IDs and changes rules a person checked by hand; the
    test turns each stale entry into a failure.
  - *Check (test):* `PautaConformanceTest`, or the app's equivalent, runs in the build and has a case for each
    failure the rule lists.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/PautaConformanceTest.java) and its copy of the edition's rules, [`pauta-rules.json`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/resources/pauta-rules.json). It has a case
    for each failure: `theRulesCopyIsTheEditionThePomNames`, `everyEntryNamesARuleOfTheEditionWithItsLevelAndAddress`
    (an unknown rule, a level or `url` that differs, a rule twice), `eachKindHasWhatItNeeds` (a deviation on a MUST,
    a missing `link`), `eachCheckedEntryIsWellFormedAndCurrent` (the `checked` list) and `theAppListsWhatItInherited`
    (what a template left, failed when `pauta.release` is set).
- **PAUTA-11 · SHOULD.** Moving to a newer edition is one change: replace `pauta-rules.json` with the new edition's,
  and the app's copy of the audit skill where it keeps one (the app template's is
  `.claude/skills/pauta-audit/SKILL.md`); remove the `checked` entries the new `rules.json` makes stale
  ([PAUTA-18](https://pauta-project.dev/6.0.1/conformance/#pauta-18)) and check those rules again; run the audit again and update `pauta.json`; then change
  `pauta.version`, the README and `AGENTS.md` together.
  - *Why:* each of these names or follows the edition. The test fails a `pauta-rules.json` or a `checked` entry left
    behind (PAUTA-10); nothing fails a skill copy left behind, which then audits the new rules by the old procedure.
  - *Check (by hand):* the change that raises `pauta.version` also replaces `pauta-rules.json` and the skill copy,
    where the app keeps one, leaves no `checked` entry older than its rule's `changed`, and touches `pauta.json`
    where the audit found something new.
  - *Reference:* [Move an app to a newer edition](https://pauta-project.dev/6.0.1/coding-agents/#move-an-app-to-a-newer-edition).

## Where it shows

The same list reaches three readers: the person using the app, the person reading its docs, and whoever reviews
the repository.

In the app, the edition and the conformance are in About ([ABOUT-05](https://pauta-project.dev/6.0.1/templates/about/#about-05),
[ABOUT-09](https://pauta-project.dev/6.0.1/templates/about/#about-09)) and the exceptions in the Pauta window, which opens from About, the Help
menu and the Command Palette ([PWIN-01](https://pauta-project.dev/6.0.1/templates/pauta-window/#pwin-01)) and lists every one
([PWIN-02](https://pauta-project.dev/6.0.1/templates/pauta-window/#pwin-02)).

- **PAUTA-13 · MUST.** In the user docs: the app's website has a *Pauta conformance* page under `/docs/`
  ([DOCS-02](https://pauta-project.dev/6.0.1/documentation/#docs-02)) with the edition, the conformance and every exception, grouped by kind, each with
  its rule ID linked to the edition's rule, its reason and its link. The Pauta window's link to it is
  [PWIN-07](https://pauta-project.dev/6.0.1/templates/pauta-window/#pwin-07).
  - *Check (code):* the app names a website for its user docs ([DOCS-01](https://pauta-project.dev/6.0.1/documentation/#docs-01)): an app
    whose repository and About name none has nowhere to carry the page, and fails the rule from the app's
    checkout. The rest is in the website's repository (`<app>-website`, [DOCS-02](https://pauta-project.dev/6.0.1/documentation/#docs-02)):
    its docs (the files of `src/content/docs/` in editora-website) have the page, and the page gives the edition
    `pauta.version` names, the conformance the app's exceptions give, and every exception of the app's
    `pauta.json` under its kind, each with its rule ID linked to the edition's rule, its reason and its link. A
    page that lists other rules than the file fails. With no `pauta.json`, which is
    [PAUTA-01](https://pauta-project.dev/6.0.1/conformance/#pauta-01)'s and [PAUTA-09](https://pauta-project.dev/6.0.1/conformance/#pauta-09)'s failure, there is no list to compare, and the page is
    judged on being there with the edition. An audit run from the app's checkout alone reports the rule as
    `not-checked` and says what would settle it.
  - *Reference:* no app yet.
- **PAUTA-14 · SHOULD.** The website's *Pauta conformance* page ([PAUTA-13](https://pauta-project.dev/6.0.1/conformance/#pauta-13)) is generated from the
  app's `pauta.json`, like the Commands page ([DOCS-04](https://pauta-project.dev/6.0.1/documentation/#docs-04)), so it cannot list a different
  set from the app.
  - *Check (code):* the app's website repository has a generator that reads the app's `pauta.json` (beside the
    others in `scripts/`, in editora-website's layout), and its output is committed. An app that names no website
    has no page to generate: the rule fails with [PAUTA-13](https://pauta-project.dev/6.0.1/conformance/#pauta-13). An audit run from the app's checkout
    alone reports the rule as `not-checked` and says what would settle it.
  - *Reference:* no app yet; editora-website's [`scripts/GenCommands.java`](https://github.com/adriandeleon/editora-website/blob/1b6390c20c7a8aa3fc6af394b68c11454478d69d/scripts/GenCommands.java) is the pattern.
- **PAUTA-15 · MUST.** An app's README shows its conformance: the README's Pauta badge
  ([README badges](https://pauta-project.dev/6.0.1/repository/#readme-badges-in-this-order)) and its "Built to" line (at Partial, "Working
  toward") name the edition and the conformance, and both link to the website's *Pauta conformance* page
  ([PAUTA-13](https://pauta-project.dev/6.0.1/conformance/#pauta-13)). The edition is the one `pauta.version` names ([ABOUT-08](https://pauta-project.dev/6.0.1/templates/about/#about-08)),
  and the conformance the one the app computes ([PAUTA-02](https://pauta-project.dev/6.0.1/conformance/#pauta-02)).
  - *Check (code):* `README.md` has the badge and the line; each names the edition `pauta.version` names and the
    conformance the app's exceptions give (Partial with a pending MUST, Core with a pending SHOULD, else
    Complete), the line opens "Working toward" at Partial and "Built to" otherwise, and both link the app's
    conformance page under its website's `/docs/`. A test that asserts it (the template's
    `theReadmeNamesTheEditionAndTheConformanceAndLinksTheDocsPage`) is the surest evidence, and PAUTA-02 requires
    one for the conformance.
  - *Reference:* The [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s [`README.md`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/README.md) (the badge and the *Working toward* line), held by [`PautaConformanceTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/PautaConformanceTest.java) (`theReadmeNamesTheEditionAndTheConformanceAndLinksTheDocsPage`).
    Termina's and Mirada's READMEs have a badge that names the edition alone and links the edition; Mirada's has
    a "Built to" line, which names no conformance. The other four READMEs name no edition.
- **PAUTA-17 · MUST.** For the app's coding agent: `AGENTS.md` has a section on Pauta (the app template heads
  it "Pauta") that names the edition `pauta.version` names and links that edition's `llms.txt` and `llms-full.txt`
  at its numbered address, never `latest/`
  ([Coding agents and LLMs](https://pauta-project.dev/6.0.1/coding-agents/#point-the-apps-agent-at-its-edition)).
  - *Why:* an agent that reads no rules builds without them, and one that reads `latest/` "fixes" MUSTs of a newer
    edition the app hasn't moved to.
  - *Check (code):* `AGENTS.md` has a section on Pauta, under whatever heading, that names the edition
    `pauta.version` names and links `https://pauta-project.dev/<edition>/llms.txt` and
    `https://pauta-project.dev/<edition>/llms-full.txt` with that number; the file links neither at `latest/` nor at
    another edition. A test that asserts it is the surest evidence.
  - *Reference:* the app template's [`AGENTS.md`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/AGENTS.md), Termina's [`AGENTS.md`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/AGENTS.md) and Mirada's [`AGENTS.md`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/AGENTS.md) have the
    section, each under the heading "Pauta".
    Termina's [`AppInfoTest`](https://github.com/adriandeleon/Termina/blob/6de43a19b7185a25c01cdf506a6286719b1991ff/src/test/java/com/termina/AppInfoTest.java) (`agentsAndReadmeNameTheSameEdition`) asserts the edition and the `llms.txt` link; the
    template's [`EditionTest`](https://github.com/adriandeleon/adl-desktop-app-template/blob/b5cbc21ce60b1e7aee0b8af224b0fa6d8c49e73f/src/test/java/com/example/app/EditionTest.java) asserts the edition (`theReadmeAndAgentsNameTheSameEdition`) and both links at
    that edition's address, with no `latest/` and no other edition (`agentsLinksTheEditionsRulesForCodingAgents`).
    Mirada's [`EditionTest`](https://github.com/adriandeleon/Mirada/blob/a3a84ec5e8227b1886e3dd920ab2b030aa3a2ba1/src/test/java/com/mirada/EditionTest.java) (`theReadmeAndAgentsNameTheSameEdition`) asserts the edition the file names and not its
    links. Editora's and nux's `AGENTS.md` have no such section, and Torrenta
    and Modula have no `AGENTS.md`.
