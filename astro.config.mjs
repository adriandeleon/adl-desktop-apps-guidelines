// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { readFileSync } from "node:fs";
import rehypeStatus from "./src/lib/rehype-status.mjs";

const pages = JSON.parse(readFileSync(new URL("./pages.json", import.meta.url), "utf8"));

// Where the site is served: package.json's guidelines.url is the one place it is written. A project page on
// github.io has a path (root "/adl-desktop-apps-guidelines/"); a custom domain has none (root "/"). Moving the
// site means changing that URL and adding public/CNAME, nothing else.
// Under the root every edition has its own folder. scripts/build-site.mjs builds this checkout twice, with PAUTA_PATH
// "latest" and the version, and lays the earlier editions beside them; without PAUTA_PATH (astro dev, a plain astro
// build) the pages sit at the root and count as "latest".
const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const url = new URL(pkg.guidelines.url);
const root = url.pathname.replace(/\/?$/, "/");
const edition = (process.env.PAUTA_PATH ?? "").replace(/^\/|\/$/g, "");
const base = `${root}${edition}`.replace(/\/$/, "") || "/";
const at = (path) => `${base === "/" ? "" : base}/${path}`;
const absolute = (path) => `${url.origin}${at(path)}`;

export default defineConfig({
  site: url.origin,
  base,
  outDir: edition ? `./dist/${edition}` : "./dist",
  markdown: { rehypePlugins: [[rehypeStatus, { iconBase: at("icons/") }]] },
  integrations: [
    starlight({
      title: "Pauta",
      logo: { src: "./src/assets/pauta-icon.svg", alt: "" },
      description:
        "Pauta, the adl desktop apps guidelines: UI, UX and platform rules for a family of JavaFX desktop apps, with Editora as the reference implementation.",
      favicon: "/favicon.svg",
      head: [
        { tag: "script", attrs: { src: at("lightbox.js"), defer: true } },
        { tag: "script", attrs: { src: at("mock-fit.js"), defer: true } },
        { tag: "script", attrs: { src: at("checklist.js"), defer: true } },
        // Tells a page which edition it belongs to; reads /versions.json so an old page knows the newest one.
        {
          tag: "script",
          attrs: { src: at("versions.js"), defer: true, "data-root": root, "data-version": pkg.version, "data-edition": edition || "latest" },
        },
        // Search engines index /latest/ only; a numbered folder is the same pages at a permanent address.
        ...(/^\d/.test(edition) ? [{ tag: "meta", attrs: { name: "robots", content: "noindex" } }] : []),
        { tag: "meta", attrs: { property: "og:image", content: absolute("og.png") } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1280" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "640" } },
        { tag: "meta", attrs: { property: "og:image:alt", content: "Pauta, the adl desktop apps guidelines, with the six apps' icons" } },
        { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
        { tag: "meta", attrs: { name: "twitter:image", content: absolute("og.png") } },
        { tag: "link", attrs: { rel: "apple-touch-icon", href: at("pauta-128.png") } },
      ],
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/adriandeleon/adl-desktop-apps-guidelines" },
      ],
      editLink: { baseUrl: "https://github.com/adriandeleon/adl-desktop-apps-guidelines/edit/master/" },
      lastUpdated: true,
      components: {
        Footer: "./src/components/Footer.astro",
        Hero: "./src/components/Hero.astro",
        SiteTitle: "./src/components/SiteTitle.astro",
        MobileMenuFooter: "./src/components/MobileMenuFooter.astro",
      },
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
        { label: "Changelog", link: "/changelog/" },
      ],
    }),
  ],
});
