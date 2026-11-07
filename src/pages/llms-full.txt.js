// Every rule of this edition as Markdown, in one file (src/lib/llms.mjs).
import { llmsFullTxt } from "../lib/llms.mjs";

export const GET = () => new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
