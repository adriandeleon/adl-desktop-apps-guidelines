// Makes the New app checklist usable: the boxes can be ticked, the ticks are kept in this browser, and a line above
// the first group counts them with a button to clear them. An item is remembered by its group and its text, so
// rewording an item un-ticks only that item. Without storage the boxes still tick; they just are not kept.
//
// Ticks belong to an edition: latest/ and the numbered folder of the same edition share them (they are the same
// pages), every other edition has its own, and next/ has its own, shared with no edition. The script tag carries
// data-version and data-edition (astro.config.mjs). When latest/ moves to a new edition its list opens with the ticks
// latest/ held before, copied once, so a reader working down the list keeps their place and the earlier edition keeps
// its own record.
(() => {
  const me = document.currentScript;
  const folder = me?.dataset.edition || "latest"; // "latest", a version, or "next"
  const scope = folder === "next" ? "next" : me?.dataset.version || folder;
  const key = (name) => `pauta.checklist.v2:${name}`;
  const KEY = key(scope);
  const LATEST = "pauta.checklist.latest"; // the edition latest/ last kept ticks for
  const LEGACY = "pauta.checklist.v1"; // the one list every edition shared; pages published before this still use it

  // Every read and write is guarded: a private window or blocked storage throws on access.
  const read = (name) => {
    try { return localStorage.getItem(name); } catch { return null; }
  };
  const parse = (text) => {
    try {
      const state = JSON.parse(text || "{}");
      return state && typeof state === "object" ? state : {};
    } catch { return {}; }
  };
  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      if (folder === "latest") localStorage.setItem(LATEST, scope);
    } catch { /* private window or blocked storage */ }
  }
  function load() {
    const own = read(KEY);
    if (own !== null || folder !== "latest") return parse(own);
    // latest/ on an edition with no ticks yet: start from the ones latest/ held before, and keep the copy.
    const before = read(LATEST);
    const state = parse(before && before !== scope ? read(key(before)) : read(LEGACY));
    if (Object.keys(state).length) save(state);
    return state;
  }

  function setup() {
    const content = document.querySelector(".sl-markdown-content");
    const boxes = [...(content?.querySelectorAll("li.task-list-item > input[type=checkbox]") ?? [])];
    if (!boxes.length) return;

    const state = load();
    const items = boxes.map((box) => {
      const li = box.parentElement;
      let group = li.closest("ul")?.previousElementSibling;
      while (group && !/^H[2-4]$/.test(group.tagName) && !group.querySelector?.("h2, h3")) group = group.previousElementSibling;
      const heading = group?.matches?.("h2, h3, h4") ? group : group?.querySelector?.("h2, h3");
      const text = li.textContent.replace(/\s+/g, " ").trim();
      const id = `${heading?.id ?? ""}::${text}`;
      box.disabled = false;
      box.setAttribute("aria-label", text);
      box.checked = Boolean(state[id]);
      li.classList.toggle("done", box.checked);
      return { box, li, id };
    });

    const bar = document.createElement("div");
    bar.className = "checklist-progress not-content";
    bar.innerHTML = `
      <span class="count" aria-live="polite"></span>
      <span class="track" aria-hidden="true"><span class="fill"></span></span>
      <button type="button" class="reset">Clear ticks</button>
      <span class="note">Ticks are kept in this browser only, for ${folder === "next" ? "Pauta Next" : "this edition"}.</span>`;
    const firstHeading = content.querySelector("h2, .sl-heading-wrapper");
    firstHeading?.parentElement === content ? content.insertBefore(bar, firstHeading) : content.prepend(bar);
    const count = bar.querySelector(".count");
    const fill = bar.querySelector(".fill");
    const reset = bar.querySelector(".reset");

    function render() {
      const done = items.filter((i) => i.box.checked).length;
      count.textContent = `${done} of ${items.length} done`;
      fill.style.width = `${(done / items.length) * 100}%`;
      reset.disabled = done === 0;
    }

    function store() {
      const next = {};
      items.forEach((i) => { if (i.box.checked) next[i.id] = true; });
      save(next);
    }

    items.forEach(({ box, li }) => {
      box.addEventListener("change", () => { li.classList.toggle("done", box.checked); store(); render(); });
      // The item's text toggles it too, except where the text is a link.
      li.addEventListener("click", (e) => {
        if (e.target === box || e.target.closest("a")) return;
        box.click();
      });
    });
    reset.addEventListener("click", () => {
      items.forEach(({ box, li }) => { box.checked = false; li.classList.remove("done"); });
      store();
      render();
    });
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
  else setup();
})();
