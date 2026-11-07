// The index a coding agent reads first, https://llmstxt.org (src/lib/llms.mjs).
import { llmsTxt } from "../lib/llms.mjs";

export const GET = () => new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
