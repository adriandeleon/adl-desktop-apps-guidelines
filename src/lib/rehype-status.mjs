// Turns the guide's plain-text conventions into styled markup:
//   ● / ◐ / — at the start of a feature-matrix cell → a status dot (the rest of the cell stays as its note)
//   MUST / SHOULD / MAY anywhere in prose or a table cell → a level pill ("**MUST.**" and "(SHOULD)" included)
//   "**KBD-07 · MUST.**" opening a list item → the rule's anchor and ID link, then its level pill
//   a page with five or more rules → an index of them before its first section (ruleIndex, site only)
// It also marks a table whose header names all six apps as a feature matrix (and wraps it so it scrolls on its
// own on a narrow screen), and a table with a "Level" column as a rule table whose cells carry their column
// name, so the table can stack into cards on a phone. The print build does the same in scripts/print-markup.py.
const STATUS = [
  ["●", "s-yes", "Yes"],
  ["◐", "s-part", "Partly"],
  ["—", "s-no", "No"],
];
const LEVEL = /\(?\b(MUST|SHOULD|MAY)\b\)?/g;
// A table cell that names one app (header or bold row label) gets that app's icon.
const APPS = { Editora: "editora", Torrenta: "torrenta", Termina: "termina", Modula: "modula", Mirada: "mirada", nux: "nux" };
// Where a level word is code, a heading, a link or a drawn mockup, it stays text.
const KEEP = new Set(["code", "pre", "kbd", "a", "h1", "h2", "h3", "h4", "h5", "h6", "th", "script", "style", "svg"]);

const text = (node) =>
  node.type === "text" ? node.value : (node.children ?? []).map(text).join("");

const classes = (node) => {
  const c = node.properties?.className;
  return Array.isArray(c) ? c : c ? String(c).split(/\s+/) : [];
};

function visit(node, fn) {
  fn(node);
  for (const child of node.children ?? []) visit(child, fn);
}

function addClass(node, cls) {
  (node.properties ??= {}).className = [...classes(node), cls];
}

const pill = (level) => ({
  type: "element", tagName: "span", properties: { className: ["lvl", `lvl-${level.toLowerCase()}`] },
  children: [{ type: "text", value: level }],
});

// A paragraph holding only images becomes figures: one image → <figure>, several → a gallery row. An image's
// Markdown title ("caption") becomes its <figcaption>.
function figure(img) {
  const caption = img.properties?.title;
  if (img.properties) delete img.properties.title;
  return {
    type: "element", tagName: "figure", properties: { className: ["shot"] },
    children: [img, ...(caption ? [{ type: "element", tagName: "figcaption", properties: {}, children: [{ type: "text", value: String(caption) }] }] : [])],
  };
}

function figures(node) {
  const kids = (node.children ?? []).filter((c) => !(c.type === "text" && !c.value.trim()));
  if (!kids.length || !kids.every((c) => c.type === "element" && c.tagName === "img")) return;
  const figs = kids.map(figure);
  if (figs.length === 1) Object.assign(node, figs[0]);
  else Object.assign(node, { tagName: "div", properties: { className: ["shot-row", `n${figs.length}`] }, children: figs });
}

function appIcon(node, iconBase) {
  const app = APPS[text(node).trim()];
  if (!app) return;
  const icon = { type: "element", tagName: "img", properties: { className: ["app-icon"], src: `${iconBase}${app}.svg`, alt: "", width: 24, height: 24 }, children: [] };
  const target = node.children?.[0]?.type === "element" && node.children[0].tagName === "strong" ? node.children[0] : node;
  target.children.unshift(icon);
}

function statusDot(td) {
  const first = td.children?.[0];
  if (!first || first.type !== "text") return;
  const value = first.value.trimStart();
  for (const [glyph, cls, label] of STATUS) {
    if (!value.startsWith(glyph)) continue;
    const note = value.slice(glyph.length).trim();
    // The dot is drawn in CSS, so its meaning is hidden text that a screen reader reads before the note. (An
    // aria-label on a plain span is ignored, and on one with text it would hide the note.)
    const said = { type: "element", tagName: "span", properties: { className: ["sr-only"] }, children: [{ type: "text", value: note ? `${label}: ` : label }] };
    td.children.splice(0, 1, {
      type: "element",
      tagName: "span",
      properties: { className: ["s", cls], title: label },
      children: note ? [said, { type: "text", value: note }] : [said],
    });
    return;
  }
}

function table(node, parent, iconBase) {
  const header = [];
  visit(node, (n) => n.type === "element" && n.tagName === "th" && header.push(text(n).trim()));
  const matrix = header.includes("Torrenta") && header.includes("nux");
  if (matrix) {
    addClass(node, "matrix");
    // Starlight scrolls a table by making it a block; a matrix stays a real table inside its own scroller, which the
    // keyboard can reach and scroll with the arrows (a named region, in the Tab order).
    const properties = { className: ["matrix-scroll"], role: "region", ariaLabel: "The apps compared, side by side", tabIndex: 0 };
    const wrapper = { type: "element", tagName: "div", properties, children: [node] };
    parent.children[parent.children.indexOf(node)] = wrapper;
  }
  const rules = header.includes("Level");
  if (rules) addClass(node, "rules");
  visit(node, (n) => {
    if (n.type !== "element") return;
    if (n.tagName === "th" || n.tagName === "td") appIcon(n, iconBase);
    if (n.tagName === "tr" && rules) {
      n.children.filter((c) => c.type === "element" && c.tagName === "td")
        .forEach((td, i) => header[i] && ((td.properties ??= {}).dataLabel = header[i]));
    }
    if (n.tagName === "td" && matrix) statusDot(n);
  });
}

// A list item that opens with "**KBD-07 · MUST.**" is a rule: the item takes the ID as its anchor (#kbd-07), the ID
// becomes a link to it and the level a pill.
const RULE = /^([A-Z]{2,6}-\d{2,3}) · (MUST|SHOULD|MAY)\.$/;
function ruleIds(tree) {
  const found = [];
  let section = "";
  visit(tree, (li) => {
    if (li.type === "element" && li.tagName === "h2") section = text(li).trim();
    if (li.type !== "element" || li.tagName !== "li") return;
    const host = li.children.find((c) => c.type === "element")?.tagName === "p" ? li.children.find((c) => c.type === "element") : li;
    const i = host.children.findIndex((c) => !(c.type === "text" && !c.value.trim()));
    const first = host.children[i];
    const m = first?.type === "element" && first.tagName === "strong" && text(first).trim().match(RULE);
    if (!m) return;
    const id = m[1].toLowerCase();
    // The statement: what follows the bold head, up to the sub-items (a tight list keeps them in the same host).
    const after = host.children.slice(i + 1);
    const stop = after.findIndex((c) => c.type === "element" && (c.tagName === "ul" || c.tagName === "ol"));
    const statement = structuredClone(stop < 0 ? after : after.slice(0, stop));
    if (statement[0]?.type === "text") statement[0] = { ...statement[0], value: statement[0].value.trimStart() };
    found.push({ id: m[1], level: m[2], section, statement });
    (li.properties ??= {}).id = id;
    addClass(li, "rule");
    host.children.splice(i, 1,
      { type: "element", tagName: "a", properties: { className: ["rule-id"], href: `#${id}` }, children: [{ type: "text", value: m[1] }] },
      { type: "text", value: " " },
      pill(m[2]));
  });
  return found;
}

// A page with several rules opens with their index: one row per rule (its ID linking to the rule, its level, its
// statement cut to two lines), grouped under the page's sections. It is built from the rules themselves, so it
// can't drift from them, and it sits before the first section, or the first rule if that comes earlier. A rule
// stays a list item in the Markdown (AGENTS.md, "Rule IDs"); this table only points at it.
const INDEX_MIN = 5;
const el = (tagName, properties, children) => ({ type: "element", tagName, properties, children });
function ruleIndex(tree, rules) {
  if (rules.length < INDEX_MIN) return;
  const grouped = new Set(rules.map((r) => r.section)).size > 1;
  const rows = [];
  let section = null;
  for (const r of rules) {
    if (grouped && r.section !== section && r.section) {
      rows.push(el("tr", { className: ["sec"] }, [el("th", { colSpan: 3, scope: "colgroup" }, [{ type: "text", value: r.section }])]));
    }
    section = r.section;
    const statement = { type: "root", children: r.statement };
    rows.push(el("tr", {}, [
      el("td", {}, [el("a", { className: ["rule-id"], href: `#${r.id.toLowerCase()}` }, [{ type: "text", value: r.id }])]),
      el("td", {}, [pill(r.level)]),
      el("td", {}, [el("div", { className: ["clamp"], title: text(statement).replace(/\s+/g, " ").trim() }, r.statement)]),
    ]));
  }
  const head = el("thead", {}, [el("tr", {}, ["ID", "Level", "Rule"].map((h) => el("th", { scope: "col" }, [{ type: "text", value: h }])))]);
  const index = el("details", { className: ["rule-index"], open: true }, [
    el("summary", {}, [{ type: "text", value: "Rules on this page " }, el("span", { className: ["count"] }, [{ type: "text", value: String(rules.length) }])]),
    el("table", {}, [head, el("tbody", {}, rows)]),
  ]);
  const holdsRule = (n) => {
    let hit = false;
    visit(n, (c) => { if (c.type === "element" && c.tagName === "li" && classes(c).includes("rule")) hit = true; });
    return hit;
  };
  const at = tree.children.findIndex((c) => c.type === "element" && (c.tagName === "h2" || holdsRule(c)));
  tree.children.splice(at < 0 ? tree.children.length : at, 0, index);
}

// Level words become pills: a bold "MUST." alone is replaced by the pill, a "(SHOULD)" loses its brackets.
function levels(node) {
  if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement" || node.type === "raw") return;
  if (node.type === "element") {
    if (KEEP.has(node.tagName)) return;
    const cls = classes(node);
    if (cls.includes("lvl") || cls.includes("mock-stage") || cls.includes("s")) return;
  }
  const kids = node.children;
  if (!kids) return;
  for (let i = 0; i < kids.length; i++) {
    const child = kids[i];
    if (child.type === "element" && child.tagName === "strong") {
      const m = text(child).trim().match(/^(MUST|SHOULD|MAY)\.?$/);
      if (m) { kids[i] = pill(m[1]); continue; }
    }
    if (child.type !== "text") { levels(child); continue; }
    const parts = [];
    let last = 0;
    for (const m of child.value.matchAll(LEVEL)) {
      // Only "(MAY)" or a bare MAY, never a stray bracket on one side.
      if (m[0].startsWith("(") !== m[0].endsWith(")")) {
        const bare = m[0].replace(/[()]/g, "");
        const at = m.index + m[0].indexOf(bare);
        parts.push({ type: "text", value: child.value.slice(last, at) }, pill(bare));
        last = at + bare.length;
        continue;
      }
      parts.push({ type: "text", value: child.value.slice(last, m.index) }, pill(m[1]));
      last = m.index + m[0].length;
    }
    if (!parts.length) continue;
    parts.push({ type: "text", value: child.value.slice(last) });
    const out = parts.filter((p) => p.type !== "text" || p.value);
    kids.splice(i, 1, ...out);
    i += out.length - 1;
  }
}

export default function rehypeStatus(options = {}) {
  const iconBase = options.iconBase ?? "/icons/";
  return (tree) => {
    const tables = [];
    visit(tree, (node) => {
      if (node.type === "element" && node.tagName === "p") figures(node);
      if (node.type !== "element" && node.type !== "root") return;
      for (const child of node.children ?? []) {
        if (child.type === "element" && child.tagName === "table") tables.push([child, node]);
      }
    });
    for (const [node, parent] of tables) table(node, parent, iconBase);
    ruleIndex(tree, ruleIds(tree));
    levels(tree);
  };
}
