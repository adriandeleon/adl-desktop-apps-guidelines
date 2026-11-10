// The JSON Schema of rules.json (src/lib/audit.mjs); in next/ it says it is not an edition's (src/lib/llms.mjs).
import { readFileSync } from "node:fs";
import { rulesSchema } from "../lib/audit.mjs";
import { nextSchema } from "../lib/llms.mjs";
import { editionUrl } from "../lib/rules.mjs";

export const GET = () =>
  new Response(JSON.stringify(nextSchema(rulesSchema(editionUrl(JSON.parse(readFileSync("package.json", "utf8")))), "rules.schema.json"), null, 2) + "\n", {
    headers: { "Content-Type": "application/schema+json; charset=utf-8" },
  });
