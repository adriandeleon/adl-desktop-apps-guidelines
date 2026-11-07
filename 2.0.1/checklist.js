// Makes the New app checklist usable: the boxes can be ticked, the ticks are kept in this browser, and a line above
// the first group counts them with a button to clear them. An item is remembered by its group and its text, so
// rewording an item un-ticks only that item. Without storage the boxes still tick; they just are not kept.
(() => {
  const KEY = "pauta.checklist.v1";

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private window or blocked storage */ }
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
      <span class="note">Ticks are kept in this browser only.</span>`;
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
