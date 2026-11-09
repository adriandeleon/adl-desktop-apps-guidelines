# Conformance

> How an app says which edition of Pauta it implements and how fully it conforms, and how it records the rules it does not meet: not applicable, a deliberate deviation, or work still pending.

Pauta 4.4.0 (2026-11-08). The page with its screenshots and mockups: https://pauta-project.dev/4.4.0/conformance/.
Every rule of the edition: https://pauta-project.dev/4.4.0/llms-full.txt.

An app implements one edition of Pauta, says how fully it conforms (Complete, Core or Partial), and shows both in its
About window. The rules it does not meet are not hidden: each one is an **exception**, written down once in the app's `pauta.json`, shown in the app's
[Pauta window](https://pauta-project.dev/4.4.0/templates/pauta-window/) and listed in its user docs. Its conformance is worked out from that list,
never typed in by hand, so the claim and the evidence can't drift apart.

No app does this yet. The audit in [Coding agents and LLMs](https://pauta-project.dev/4.4.0/coding-agents/#audit-an-app) produces the first list:
each MUST and SHOULD it reports as `fail` becomes an exception, of the kind that fits. A `limited` result needs none.

## Complete, Core and Partial

| Conformance | The app meets… | About says |
|---|---|---|
| **Complete** | every MUST of its edition, met or not applicable, and every SHOULD, met, not applicable or a recorded deviation | Built to Pauta 4.2.0 · Pauta conformance: Complete |
| **Core** | every MUST in the same way; one or more SHOULDs are still pending | Built to Pauta 4.2.0 · Pauta conformance: Core |
| **Partial** | not every MUST: one or more MUSTs are still pending | Working toward Pauta 4.2.0 · Pauta conformance: Partial |

"Built to an edition" keeps its meaning: the app meets that edition's MUSTs. Core and Complete are the two ways to be
built to it; a Partial app is working toward it and says so. MAY rules never count. A deviation, which only a SHOULD can
have, leaves the conformance as it is but is always on show: About gives the number of exceptions, and the Pauta
window lists every one.

Partial is how an app that already ships says it is on its way: it took up an edition after its first release, or
moved to a newer one with new MUSTs. A new app is not released at Partial.

- **PAUTA-01 · MUST.** Every app implements Pauta: it names one edition (the `pauta.version` of
  [ABOUT-08](https://pauta-project.dev/4.4.0/templates/about/#about-08)) and states its conformance, Complete, Core or Partial, as defined above.
  - *Why:* an app that is in the family answers to these rules; saying which ones, and how far, is the first of them.
  - *Check (code):* `pom.xml` defines `pauta.version` and `src/main/resources/com/<app>/pauta.json` exists.
  - *Reference:* no app yet.
- **PAUTA-02 · MUST.** The conformance is computed, never stored: one pure helper reads the exceptions and returns Partial
  when any MUST is pending, Core when any SHOULD is pending, and Complete otherwise. About, the Pauta window and the
  docs page take it from there; the README, which can't call the helper, is held to it by a test (PAUTA-15).
  - *Why:* [*One source of truth for each fact*](https://pauta-project.dev/4.4.0/principles/#for-the-people-building-them). A conformance typed
    in by hand stays "Complete" after a pending exception is added.
  - *Check (test):* a unit test of the helper (`PautaConformance`, or the app's equivalent) covers all three and
    shows that deviation, not-applicable and app-only entries leave the result alone.
  - *Reference:* no app yet.
- **PAUTA-03 · MUST.** A new app's first release is at Core or Complete: the [New app checklist](https://pauta-project.dev/4.4.0/checklist/)'s
  MUSTs are release blockers, and recording one as pending does not lift that. A template repository is never
  released as an app, so this rule is for the app made from it and the template records no entry for it.
  - *Check (by hand):* the About window of the app's first release says Core or Complete.
  - *Reference:* no app yet.

## Exceptions

An exception is one MUST or SHOULD the app does not meet as written; MAYs never need one. There are three kinds for
an app, and a fourth for a template repository; each one asks for something different.

| Kind | Means | Needs |
|---|---|---|
| `not-applicable` | The rule applies to every app, but its subject does not exist in this one: no tabs to reopen, no setting to sync | A reason |
| `deviation` | A SHOULD only: the app does it differently on purpose, and would make the same choice again | A reason and a decision record |
| `pending` | The app does not do it yet | A reason and an issue |
| `app-only` | A template only: the rule needs what each app made from it has of its own, such as its website, its screenshots or its repository settings | A reason |

- **PAUTA-04 · MUST.** Every MUST and SHOULD of the edition that the app does not meet has an exception, and every
  exception names a rule the app does not meet. An unmet rule with no entry is a failed audit, not an exception; an
  entry for a rule the app now meets is removed in the same change that meets it. A rule checked by hand counts like
  any other: someone checks it in the running app before the conformance is claimed, and one that fails is pending.
  - *Why:* [*Never claim what is not true*](https://pauta-project.dev/4.4.0/principles/#for-the-people-using-the-apps). The list is the app's
    claim; it has to be whole and current.
  - *Check (by hand):* audit the app against its edition ([Coding agents and LLMs](https://pauta-project.dev/4.4.0/coding-agents/#audit-an-app)):
    no MUST or SHOULD is `fail`, every `manual` result has been checked by a person, and no result reports an entry
    for a rule that passes.
  - *Reference:* no app yet.
- **PAUTA-05 · MUST.** A rule limited to apps with a feature needs no entry in an app without that feature. A rule is
  limited when its own text says so ("An app with user data worth carrying between computers…"), when its page or
  section opens with an **Applies to** line (the [Tray and background](https://pauta-project.dev/4.4.0/tray-and-background/) page; `appliesTo` in
  `rules.json`), or when it details a rule that is limited (WELC-03 onward detail the Welcome page of [WELC-01](https://pauta-project.dev/4.4.0/templates/welcome/#welc-01)).
  `not-applicable` is for a rule that reads as applying to every app.
  - *Check (code):* no `not-applicable` entry names a rule whose text, page, section or parent rule already limits
    it.
  - *Reference:* no app yet.
- **PAUTA-06 · MUST.** A `deviation` is a choice, not a gap, and only a SHOULD can have one: a SHOULD is expected
  unless the app has a stated reason, and the deviation is that reason. It links a decision record in
  `docs/decisions/` ([DOCS-13](https://pauta-project.dev/4.4.0/documentation/#docs-13)) that gives the context, what the app does instead, and what
  it costs. A MUST the app does not meet is `pending`, as is any work it has not done yet.
  - *Why:* a deviation keeps the conformance; a deviation from a MUST, or missing work called a deviation, would let
    the app say it is built to an edition it does not meet.
  - *Check (code):* every `deviation` entry names a SHOULD, and its `link` opens a file under `docs/decisions/` that
    names the rule's ID.
  - *Reference:* no app yet.
- **PAUTA-07 · MUST.** A `pending` exception links an open issue in the app's own repository that names the rule's
  ID and edition, "MENU-14 (Pauta 4.2.0)". One issue may hold several rules, one per page for example, if it names
  each one that way. Closing the issue removes its entries.
  - *Check (code):* every `pending` entry's `link` is an issue URL in the app's repository whose text names that
    entry's rule ID and edition.
  - *Reference:* no app yet.
- **PAUTA-08 · MUST.** Each exception's `reason` is one plain sentence for the person using the app, in English like
  the changelog: what is different and, for a deviation, what they get instead. No rule text, no class names.
  - *Check (by hand):* read each reason in the Pauta window as a user would.
  - *Reference:* no app yet.
- **PAUTA-16 · MUST.** A template repository, one that new apps are made from, sets `"template": true` in its
  `pauta.json` and records as `app-only` the rules that only an app made from it can meet. `app-only` leaves the
  conformance as it is, like `not-applicable`, and nothing but a template may use it. Making an app from the
  template sets `template` to `false`. From then on the app's everyday build passes but lists what it inherited:
  each `app-only` entry and each `pending` link to another repository. Its release build fails until each one is
  met, or recorded as `pending` with an issue in the app's own repository.
  - *Why:* a template can't have the website or screenshots of an app that doesn't exist yet, and an app must not
    inherit its template's issues as its own. A build that failed the moment the app was made would fail its first
    step; the release is where it has to be settled ([PAUTA-03](https://pauta-project.dev/4.4.0/conformance/#pauta-03)).
  - *Check (code):* in a template, `pauta.json` has `"template": true` and the rename script sets it to `false`; in
    an app, the release build runs the test with inherited entries treated as failures, and the app's first
    release has no `app-only` entry.
  - *Reference:* the [app template](https://github.com/adriandeleon/adl-desktop-app-template) (in progress).

## The file

The exceptions live in one file, bundled with the app so the Pauta window can read it:
`src/main/resources/com/<app>/pauta.json`. The edition stays in `pom.xml` (ABOUT-08). Each entry copies the rule's
`level` and `url` from the edition's [`rules.json`](https://pauta-project.dev/4.4.0/coding-agents/) so the app needs nothing else at run time, and
a test keeps the copies honest.

```json
{
  "exceptions": [
    {
      "rule": "MENU-14",
      "level": "MUST",
      "url": "https://pauta-project.dev/4.2.0/menus/#menu-14",
      "kind": "pending",
      "reason": "Some menu rows have no icon yet.",
      "link": "https://github.com/adriandeleon/<App>/issues/212"
    },
    {
      "rule": "TABS-06",
      "level": "MUST",
      "url": "https://pauta-project.dev/4.2.0/tabs-and-panels/#tabs-06",
      "kind": "not-applicable",
      "reason": "<App> has no tabs: it shows one library in one window."
    },
    {
      "rule": "WELC-01",
      "level": "SHOULD",
      "url": "https://pauta-project.dev/4.2.0/templates/welcome/#welc-01",
      "kind": "deviation",
      "reason": "<App> opens straight to your library instead of a Welcome page; its empty state names the ways in.",
      "link": "https://github.com/adriandeleon/<App>/blob/master/docs/decisions/0007-no-welcome-page.md"
    }
  ]
}
```

- **PAUTA-09 · MUST.** The exceptions have one source, `pauta.json` as above: `rule`, `level`, `url`, `kind` and
  `reason` on every entry, `link` on every deviation and pending entry, one entry per rule, and `"template": true`
  beside `exceptions` only in a template repository (PAUTA-16).
  - *Check (code):* the file exists at that path, and each entry has the fields its kind needs.
  - *Reference:* no app yet.
- **PAUTA-10 · MUST.** A test reads `pauta.json` against a copy of the edition's `rules.json` in
  `src/test/resources/pauta-rules.json` and fails when the copy's `edition` is not `pauta.version`, when an entry
  names a rule the edition does not have, when its `level` or `url` differs from the edition's, when a rule appears
  twice, when a deviation names a MUST, or when a deviation or pending entry has no `link`. Outside a template, it
  reports each `app-only` entry and each `pending` link that is not an issue in the app's own repository (the one
  `AppInfo` names), and fails on them in the release build ([PAUTA-16](https://pauta-project.dev/4.4.0/conformance/#pauta-16)).
  - *Why:* moving to a newer edition changes levels and retires IDs; the test turns each stale entry into a failure.
  - *Check (test):* `PautaConformanceTest`, or the app's equivalent, runs in the build.
  - *Reference:* no app yet.
- **PAUTA-11 · SHOULD.** Moving to a newer edition is one change: replace `pauta-rules.json`, run the audit again,
  update `pauta.json`, then change `pauta.version`, the README and `AGENTS.md` together.
  - *Check (by hand):* the change that raises `pauta.version` also replaces `pauta-rules.json` and touches
    `pauta.json` where the audit found something new.
  - *Reference:* [Move an app to a newer edition](https://pauta-project.dev/4.4.0/coding-agents/#move-an-app-to-a-newer-edition).

## Where it shows

The same list reaches three readers: the person using the app, the person reading its docs, and whoever reviews
the repository.

- **PAUTA-12 · MUST.** In the app: About names the edition and the conformance ([ABOUT-09](https://pauta-project.dev/4.4.0/templates/about/#about-09)),
  and the Pauta window, opened from About, the Help menu and the Command Palette, lists every exception
  ([Pauta window](https://pauta-project.dev/4.4.0/templates/pauta-window/)).
  - *Check (code):* `help.pauta` is registered and About's *Pauta conformance* link runs it.
  - *Reference:* no app yet.
- **PAUTA-13 · MUST.** In the user docs: the app's website has a *Pauta conformance* page under `/docs/`
  ([DOCS-02](https://pauta-project.dev/4.4.0/documentation/#docs-02)) with the edition, the conformance and every exception, grouped by kind, each with
  its rule ID linked to the edition's rule, its reason and its link. The Pauta window links to it.
  - *Check (code):* the website's `src/content/docs/` has the page, and it lists the same rules as `pauta.json`.
  - *Reference:* no app yet.
- **PAUTA-14 · SHOULD.** The docs page is generated from `pauta.json`, like the Commands page
  ([DOCS-04](https://pauta-project.dev/4.4.0/documentation/#docs-04)), so it cannot list a different set from the app.
  - *Check (code):* the website's `scripts/` has a generator that reads the app's `pauta.json`, and its output is
    committed.
  - *Reference:* no app yet; editora-website's [`scripts/GenCommands.java`](https://github.com/adriandeleon/editora-website/blob/master/scripts/GenCommands.java) is the pattern.
- **PAUTA-15 · MUST.** In the repository: the README's Pauta badge ([README badges](https://pauta-project.dev/4.4.0/repository/#readme-badges-in-this-order))
  and its "Built to" line (at Partial, "Working toward") name the edition and the conformance, and both link to the
  docs page.
  - *Check (test):* `PautaConformanceTest` fails when the README's badge or line names another edition than
    `pauta.version` or another conformance than `PautaConformance` returns.
  - *Reference:* no app yet; the [app template](https://github.com/adriandeleon/adl-desktop-app-template)'s README names its edition.
