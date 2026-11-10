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

/** An edition's date written out, American style as the rest of the guide is: "2026-11-09" → "November 9, 2026".
 *  The one place the site spells a date; Starlight's own "Last updated" line uses the same order. */
export const longDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** The folder of the batch waiting under CHANGELOG.md's [Unreleased], built from master by scripts/build-next.mjs. It
 *  is not an edition: no number, no date, never archived, never cited; the site has it only while a batch waits. */
export const NEXT = "next";
