#!/usr/bin/env node
// Part of a release (AGENTS.md, "Guidance collects under [Unreleased]"): rewrites rule-changes.json for the version
// package.json names. Every rule in rules.json carries `changed`, the edition in which its level, scope or statement
// last changed, and this file is where that is kept: per rule, the edition and a hash of the three as of the last
// release (src/lib/rules.mjs, ruleHash). A rule whose hash still matches keeps its edition; any other is new or
// changed in this batch and gets this release's version; an ID the pages no longer have joins `retired`.
//
//   node scripts/rule-changes.mjs            after setting the release's version; reads no network and no history
//   node scripts/rule-changes.mjs --check    writes nothing: lists the rules a release would mark, exit 0
//
// Between releases nothing edits the file: a rule changed since reads "next" in next/ because its hash no longer
// matches. scripts/check-edition.mjs fails a release whose file is not what this script writes, and any other change
// that touches it.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { CHANGES, changesText, freshChanges, readChanges, readRules } from "../src/lib/rules.mjs";

process.chdir(fileURLToPath(new URL("..", import.meta.url))); // not .pathname, which keeps a space as %20
const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const was = readChanges();
const rules = readRules().pages.flatMap((p) => p.rules);
const now = freshChanges(was, rules, version);
const marked = rules.filter((r) => was?.rules?.[r.id]?.hash !== now.rules[r.id].hash).map((r) => `${r.id}${was?.rules?.[r.id] ? "" : " (new)"}`);
const gone = now.retired.filter((id) => !(was?.retired ?? []).includes(id));
const said = `${marked.length} rules new or changed since ${was?.edition ?? "the start"}${marked.length ? `: ${marked.join(", ")}` : ""}; ${gone.length} retired${gone.length ? `: ${gone.join(", ")}` : ""}`;
if (process.argv.includes("--check")) {
  console.log(`${CHANGES} records ${was?.edition ?? "nothing"}; ${said}`);
} else if (was && was.edition === version && changesText(now) !== changesText({ ...was, rules: was.rules ?? {}, retired: was.retired ?? [] })) {
  // The file already names this version and the pages have moved on: package.json was not raised, so running now
  // would date this batch's changes with the edition already released.
  console.error(`${CHANGES} is already ${version}'s, and the rules have changed since (${said}). Raise package.json's version first: this script is run for a release.`);
  process.exit(1);
} else {
  writeFileSync(CHANGES, changesText(now));
  console.log(`${CHANGES}: ${rules.length} rules recorded for ${version}; ${said}`);
}
