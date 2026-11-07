// The editions in CHANGELOG.md (Keep a Changelog): one per "## [x.y.z] - YYYY-MM-DD" section, newest first, with its
// body. Shared by the Changelog component, the header's edition switcher and scripts/build-site.mjs.

/** @returns {{ version: string, date?: string, body: string }[]} */
export function parseEditions(text) {
  const editions = [];
  for (const chunk of text.split(/^## /m).slice(1)) {
    const nl = chunk.indexOf("\n");
    const head = chunk.slice(0, nl).trim();
    const body = chunk.slice(nl + 1).trim();
    const m = head.match(/^\[([^\]]+)\](?:\s*-\s*(\d{4}-\d{2}-\d{2}))?/);
    if (!m || !body) continue; // an empty Unreleased section says nothing
    editions.push({ version: m[1], date: m[2], body });
  }
  return editions;
}

export const isVersion = (s) => /^\d+\.\d+\.\d+$/.test(s);

/** Released editions only: headed by a version number and a date. */
export const released = (editions) => editions.filter((e) => isVersion(e.version) && e.date);

/** Newest first. */
export function compareVersions(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pb[i] - pa[i];
  return 0;
}
