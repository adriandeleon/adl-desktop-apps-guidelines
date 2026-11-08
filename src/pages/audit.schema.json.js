// The JSON Schema of an audit report (src/lib/audit.mjs).
import { readFileSync } from "node:fs";
import { auditSchema } from "../lib/audit.mjs";
import { editionUrl } from "../lib/rules.mjs";

export const GET = () =>
  new Response(JSON.stringify(auditSchema(editionUrl(JSON.parse(readFileSync("package.json", "utf8")))), null, 2) + "\n", {
    headers: { "Content-Type": "application/schema+json; charset=utf-8" },
  });
