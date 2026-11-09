// The Changelog page as Markdown, at changelog.md beside changelog/ (src/lib/llms.mjs). It is not in pages.json's
// rule pages, so [...slug].md.js doesn't serve it.
import { changelogMarkdown } from "../lib/llms.mjs";

export const GET = () =>
  new Response(changelogMarkdown(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
