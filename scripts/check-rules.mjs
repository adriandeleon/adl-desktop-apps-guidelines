#!/usr/bin/env node
// Fails when a rule is malformed (AGENTS.md, "Rule IDs"): a head that doesn't match, an ID used twice, a prefix on
// two pages, a rule without its one Check and one Reference line, or a table with a Level column. `npm run check`;
// scripts/build-site.mjs runs it before building, so CI catches it.
import { readRules } from "../src/lib/rules.mjs";

process.chdir(new URL("..", import.meta.url).pathname);
const { pages, problems } = readRules();
const rules = pages.flatMap((p) => p.rules);
const count = (key) => rules.reduce((n, r) => ((n[key(r)] = (n[key(r)] ?? 0) + 1), n), {});
if (problems.length) {
  console.error(`${problems.length} problem(s) in the rules:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
const levels = count((r) => r.level);
const checks = count((r) => r.check.kind);
console.log(
  `${rules.length} rules on ${pages.filter((p) => p.rules.length).length} pages: ` +
    `${levels.MUST ?? 0} MUST, ${levels.SHOULD ?? 0} SHOULD, ${levels.MAY ?? 0} MAY; ` +
    `checked by code ${checks.code ?? 0}, test ${checks.test ?? 0}, hand ${checks["by hand"] ?? 0}`,
);
