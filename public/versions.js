// Every edition's pages carry this script with data-root (the site root), data-version (the edition the page belongs
// to) and data-edition (the folder it is served from: "latest", the version, or "next"). It reads /versions.json,
// which scripts/build-site.mjs writes on every deploy, so a page published long ago still knows the newest edition: it
// adds the editions the page's switcher predates (and next/ while a batch waits for its release, which
// scripts/build-next.mjs adds as `next`), and on an earlier edition shows a notice with the way to the same page in the
// latest one. A page of next/ carries its notice in its own HTML (src/components/Banner.astro), since it is not an
// edition whatever is published later; there this script only points the notice's link at the same page in latest/.
// Without the file (astro dev) it does nothing.
(() => {
  const me = document.currentScript;
  if (!me) return;
  const root = me.dataset.root || "/";
  const version = me.dataset.version;
  const edition = me.dataset.edition || "latest";
  const folder = `${root}${edition}/`;
  const base = location.pathname.startsWith(folder) ? folder : root; // astro dev serves at the root
  const rest = location.pathname.slice(base.length);

  const refreshSwitcher = (data) => {
    for (const select of document.querySelectorAll("pauta-edition-select select")) {
      const chosen = select.value;
      // The page's own edition keeps its `selected` attribute, which the switcher reads to put it back.
      const own = select.querySelector("option[selected]")?.value ?? chosen;
      const latest = select.querySelector('option[value="latest"]');
      if (latest) latest.textContent = `latest (${data.latest})`;
      for (const option of [...select.options]) if (option.value !== "latest") option.remove();
      if (data.next) {
        const option = document.createElement("option");
        option.value = "next";
        option.textContent = "next";
        option.defaultSelected = own === "next";
        select.append(option);
      }
      for (const v of data.versions) {
        const option = document.createElement("option");
        option.value = v.version;
        option.textContent = v.version;
        option.defaultSelected = v.version === own;
        select.append(option);
      }
      select.value = chosen;
    }
  };

  const notice = async (data) => {
    const home = `${root}latest/`;
    let href = home;
    try {
      const r = await fetch(home + rest, { method: "HEAD" });
      if (r.ok) href = home + rest;
    } catch {}
    const said = href === home ? "the latest edition" : "this page in the latest edition";
    // next/: the notice the page was built with, when it has one.
    const built = edition === "next" && document.querySelector(".edition-notice");
    if (built) {
      const link = built.querySelector("a");
      if (link) Object.assign(link, { href, textContent: said });
      return;
    }
    const style = document.createElement("style");
    style.textContent = `
      .edition-notice { margin: 1rem var(--sl-content-pad-x, 1rem) 0; padding: 0.6rem 1rem; border-radius: 8px;
        background: var(--sl-color-accent-low, #133a36); color: var(--sl-color-white, #fff);
        font-size: var(--sl-text-sm, 0.875rem); line-height: 1.5; text-wrap: balance; }
      .edition-notice strong { font-variant-numeric: tabular-nums; }
      .edition-notice a { color: inherit; font-weight: 600; }
      @media print { .edition-notice { display: none; } }`;
    document.head.append(style);
    const a = document.createElement("a");
    a.href = href;
    a.textContent = said;
    const box = document.createElement("div");
    box.className = "edition-notice";
    box.setAttribute("role", "status");
    const latest = Object.assign(document.createElement("strong"), { textContent: data.latest });
    if (edition === "next") {
      box.append(
        "You are reading Pauta Next: changes waiting for the edition after ", latest, ". They are not an edition " +
          "yet and may change before one is released. Never cite a rule from these pages or audit an app against " +
          "them: apps are built and audited to a numbered edition. See ", a, ".",
      );
    } else {
      box.append(`You are reading Pauta ${version}, an earlier edition. The latest is `, latest, ": ", a, ".");
    }
    (document.querySelector("main") || document.body).prepend(box);
  };

  fetch(`${root}versions.json`, { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!data || !Array.isArray(data.versions)) return;
      refreshSwitcher(data);
      if (edition === "next" || (edition !== "latest" && version && data.latest !== version)) notice(data);
    })
    .catch(() => {});
})();
