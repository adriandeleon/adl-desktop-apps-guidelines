// The JSON Schema of an audit report (src/lib/audit.mjs); in next/ it says it is not an edition's (src/lib/llms.mjs).
import { readFileSync } from "node:fs";
import { auditSchema } from "../lib/audit.mjs";
import { nextSchema } from "../lib/llms.mjs";
import { editionUrl } from "../lib/rules.mjs";

export const GET = () =>
  new Response(JSON.stringify(nextSchema(auditSchema(editionUrl(JSON.parse(readFileSync("package.json", "utf8")))), "audit.schema.json"), null, 2) + "\n", {
    headers: { "Content-Type": "application/schema+json; charset=utf-8" },
  });
