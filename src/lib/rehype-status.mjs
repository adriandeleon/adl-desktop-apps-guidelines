// Turns the guide's plain-text table conventions into styled markup:
//   ● / ◐ / — at the start of a cell  → a status dot (the rest of the cell stays as its note)
//   MUST / SHOULD / MAY at the start of a cell → a level pill
// and marks a table whose header names all six apps as a feature matrix.
const STATUS = [
  ["●", "s-yes", "Yes"],
  ["◐", "s-part", "Partly"],
  ["—", "s-no", "No"],
];
const LEVELS = ["MUST", "SHOULD", "MAY"];

const text = (node) =>
  node.type === "text" ? node.value : (node.children ?? []).map(text).join("");

function visit(node, fn) {
  fn(node);
  for (const child of node.children ?? []) visit(child, fn);
}

function addClass(node, cls) {
  const props = (node.properties ??= {});
  const list = Array.isArray(props.className) ? props.className : props.className ? [props.className] : [];
  props.className = [...list, cls];
}

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

export default function rehypeStatus() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "element") return;
      if (node.tagName === "p") {
        const kids = (node.children ?? []).filter((c) => !(c.type === "text" && !c.value.trim()));
        if (kids.length && kids.every((c) => c.type === "element" && c.tagName === "img")) {
          const figs = kids.map(figure);
          if (figs.length === 1) Object.assign(node, figs[0]);
          else Object.assign(node, { tagName: "div", properties: { className: ["shot-row", `n${figs.length}`] }, children: figs });
        }
        return;
      }
      if (node.tagName === "table") {
        const header = [];
        visit(node, (n) => n.type === "element" && n.tagName === "th" && header.push(text(n).trim()));
        if (header.includes("Torrenta") && header.includes("nux")) addClass(node, "matrix");
        return;
      }
      if (node.tagName !== "td") return;
      const first = node.children?.[0];
      if (!first || first.type !== "text") return;
      const value = first.value.trimStart();
      for (const [glyph, cls, label] of STATUS) {
        if (value.startsWith(glyph)) {
          const note = value.slice(glyph.length).trim();
          node.children.splice(0, 1, {
            type: "element",
            tagName: "span",
            properties: { className: ["s", cls], title: label, ariaLabel: note ? `${label}: ${note}` : label },
            children: note ? [{ type: "text", value: note }] : [],
          });
          return;
        }
      }
      for (const level of LEVELS) {
        if (value === level || value.startsWith(level + " ")) {
          node.children.splice(0, 1,
            { type: "element", tagName: "span", properties: { className: ["lvl", `lvl-${level.toLowerCase()}`] }, children: [{ type: "text", value: level }] },
            ...(value.length > level.length ? [{ type: "text", value: value.slice(level.length) }] : []),
          );
          return;
        }
      }
    });
  };
}
