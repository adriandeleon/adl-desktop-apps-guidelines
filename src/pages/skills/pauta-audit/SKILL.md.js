// The pauta-audit skill, served with the edition it came with: skills/pauta-audit/SKILL.md as it is, and in next/
// with the notice that it is not an edition's (src/lib/llms.mjs).
import { skillMarkdown } from "../../../lib/llms.mjs";

export const GET = () => new Response(skillMarkdown(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
