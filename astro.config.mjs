// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { readFileSync } from "node:fs";
import rehypeStatus from "./src/lib/rehype-status.mjs";

// Served by GitHub Pages at https://adriandeleon.github.io/adl-desktop-apps-guidelines/.
const pages = JSON.parse(readFileSync(new URL("./pages.json", import.meta.url), "utf8"));

export default defineConfig({
  site: "https://adriandeleon.github.io",
  base: "/adl-desktop-apps-guidelines",
  markdown: { rehypePlugins: [[rehypeStatus, { iconBase: "/adl-desktop-apps-guidelines/icons/" }]] },
  integrations: [
    starlight({
      title: "adl Desktop Apps Guidelines",
      description:
        "UI, UX and platform rules for adl's JavaFX desktop apps, with Editora as the reference implementation.",
      favicon: "/favicon.svg",
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/adriandeleon/adl-desktop-apps-guidelines" },
      ],
      editLink: { baseUrl: "https://github.com/adriandeleon/adl-desktop-apps-guidelines/edit/master/" },
      lastUpdated: true,
      customCss: [
        "@fontsource-variable/inter",
        "@fontsource/jetbrains-mono/400.css",
        "@fontsource/jetbrains-mono/600.css",
        "./src/styles/caret-and-ink.css",
      ],
      sidebar: [
        { label: "Overview", link: "/" },
        ...pages.groups.map((g) => ({ label: g.label, items: g.items.map((slug) => ({ slug })) })),
      ],
    }),
  ],
});
