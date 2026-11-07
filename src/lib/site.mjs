// Where an edition's pages live. The site root comes from package.json's guidelines.url: "/" on the custom domain,
// "/adl-desktop-apps-guidelines/" on a project page. Under it every edition has a folder, /1.3.2/, and /latest/ is a
// copy of the newest one; scripts/build-site.mjs names the folder through PAUTA_PATH. `astro dev` and a plain
// `astro build` serve at the root, which the components treat as "latest".

/** The site root with a trailing slash. */
export const siteRoot = (pkg) => new URL(pkg.guidelines.url).pathname.replace(/\/?$/, "/");

/** The edition folder a page is served from ("latest" or a version), given Astro's base and the site root. */
export function editionOf(base, root) {
  const slot = base.replace(/\/?$/, "/").slice(root.length).replace(/\/$/, "");
  return slot || "latest";
}
