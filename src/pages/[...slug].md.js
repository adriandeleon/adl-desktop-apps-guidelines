// Each page of this edition as Markdown, at <slug>.md beside <slug>/ (src/lib/llms.mjs).
import { pageMarkdown, pageSlugs } from "../lib/llms.mjs";

export const getStaticPaths = () => pageSlugs().map((slug) => ({ params: { slug } }));

export const GET = ({ params }) =>
  new Response(pageMarkdown(params.slug), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
