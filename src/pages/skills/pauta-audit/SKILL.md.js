// The pauta-audit skill, served with the edition it came with (skills/pauta-audit/SKILL.md).
import { readFileSync } from "node:fs";

export const GET = () =>
  new Response(readFileSync("skills/pauta-audit/SKILL.md", "utf8"), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
