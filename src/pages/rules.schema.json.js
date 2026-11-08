// The JSON Schema of rules.json (src/lib/audit.mjs).
import { readFileSync } from "node:fs";
import { rulesSchema } from "../lib/audit.mjs";
import { editionUrl } from "../lib/rules.mjs";

export const GET = () =>
  new Response(JSON.stringify(rulesSchema(editionUrl(JSON.parse(readFileSync("package.json", "utf8")))), null, 2) + "\n", {
    headers: { "Content-Type": "application/schema+json; charset=utf-8" },
  });
