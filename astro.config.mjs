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
      title: "Pauta",
      logo: { src: "./src/assets/pauta-icon.svg", alt: "" },
      description:
        "Pauta, the adl desktop apps guidelines: UI, UX and platform rules for a family of JavaFX desktop apps, with Editora as the reference implementation.",
      favicon: "/favicon.svg",
      head: [
        { tag: "script", attrs: { src: "/adl-desktop-apps-guidelines/lightbox.js", defer: true } },
        { tag: "script", attrs: { src: "/adl-desktop-apps-guidelines/mock-fit.js", defer: true } },
        { tag: "meta", attrs: { property: "og:image", content: "https://adriandeleon.github.io/adl-desktop-apps-guidelines/og.png" } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1280" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "640" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: "Pauta, the adl desktop apps guidelines, with the six apps' icons" } },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
        { tag: "meta", attrs: { name: "twitter:image", content: "https://adriandeleon.github.io/adl-desktop-apps-guidelines/og.png" } },
        { tag: "link", attrs: { rel: "apple-touch-icon", href: "/adl-desktop-apps-guidelines/pauta-128.png" } },
      ],
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/adriandeleon/adl-desktop-apps-guidelines" },
      ],
      editLink: { baseUrl: "https://github.com/adriandeleon/adl-desktop-apps-guidelines/edit/master/" },
      lastUpdated: true,
      components: { Footer: "./src/components/Footer.astro", Hero: "./src/components/Hero.astro" },
      customCss: [
        "@fontsource-variable/inter",
        "@fontsource/jetbrains-mono/400.css",
        "@fontsource/jetbrains-mono/600.css",
        "./src/styles/caret-and-ink.css",
        "./src/styles/templates.css",
      ],
      sidebar: [
        { label: "Overview", link: "/" },
        ...pages.groups.map((g) => ({ label: g.label, items: g.items.map((slug) => ({ slug })) })),
      ],
    }),
  ],
});
