// Turns the guide's plain-text conventions into styled markup:
//   ● / ◐ / — at the start of a feature-matrix cell → a status dot (the rest of the cell stays as its note)
//   MUST / SHOULD / MAY anywhere in prose or a table cell → a level pill ("**MUST.**" and "(SHOULD)" included)
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
    td.children.splice(0, 1, {
      type: "element",
      tagName: "span",
      properties: { className: ["s", cls], title: label, ariaLabel: note ? `${label}: ${note}` : label },
      children: note ? [{ type: "text", value: note }] : [],
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
    // Starlight scrolls a table by making it a block; a matrix stays a real table inside its own scroller.
    const wrapper = { type: "element", tagName: "div", properties: { className: ["matrix-scroll"] }, children: [node] };
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
    levels(tree);
  };
}
