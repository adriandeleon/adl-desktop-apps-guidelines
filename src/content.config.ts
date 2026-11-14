import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { APPENDIX } from "./lib/site.mjs";

// What a build holds (src/lib/site.mjs). An edition (PAUTA_PATH "latest", a version or "next") holds every page but the
// family appendix; the appendix's own build (PAUTA_PATH "family", scripts/build-appendix.mjs) holds only those, at
// <root>family/<page>/. `astro dev`, with no PAUTA_PATH, holds both, so the links between them work there too.
const folder = (process.env.PAUTA_PATH ?? "").replace(/^\/|\/$/g, "");
const PAGES = "**/[^_]*.{md,mdx}";
const loader =
  folder === APPENDIX
    ? glob({ base: `src/content/docs/${APPENDIX}`, pattern: PAGES })
    : folder
      ? glob({ base: "src/content/docs", pattern: [PAGES, `!${APPENDIX}/**`] })
      : docsLoader();

export const collections = {
  docs: defineCollection({ loader, schema: docsSchema() }),
};
