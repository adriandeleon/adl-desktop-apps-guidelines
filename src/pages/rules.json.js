// Every rule of this edition as data (src/lib/llms.mjs), each with `changed`: the edition in which its level, scope
// or statement last changed, which src/lib/rules.mjs reads from rule-changes.json. src/lib/llms.mjs builds a rule's
// entry field by field; the field is put in here, after `level`, unless that file already carries it.
import { rulesJson } from "../lib/llms.mjs";
import { readRules } from "../lib/rules.mjs";

export const GET = () => {
  const data = rulesJson();
  const changed = new Map(readRules().pages.flatMap((p) => p.rules.map((r) => [r.id, r.changed])));
  data.rules = data.rules.map(({ id, level, ...rest }) => ({ id, level, changed: changed.get(id), ...rest }));
  return new Response(JSON.stringify(data, null, 2) + "\n", { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
