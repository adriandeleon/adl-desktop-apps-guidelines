"""Applies the guide's table conventions to pandoc's HTML for print: status dots, level pills, matrix tables."""
import json, os, re, sys
from pathlib import Path

src, dst = sys.argv[1], sys.argv[2]
extra_css = Path(sys.argv[3]).read_text(encoding="utf-8") if len(sys.argv) > 3 else ""
s = open(src, encoding="utf-8").read()
s = s.replace("<table>", '<div class="table-wrap"><table>').replace("</table>", "</table></div>")

def cell(m):
    attrs, body = m.group(1), m.group(2).strip()
    for glyph, cls, label in (("●", "s-yes", "Yes"), ("◐", "s-part", "Partly"), ("—", "s-no", "No")):
        if body.startswith(glyph):
            note = body[len(glyph):].strip()
            # The dot is drawn in CSS, so the state is also written as text the page does not show (.said in
            # scripts/print-template.html): the PDF then says "Yes", "Partly" or "No" to a search, a copy, a screen
            # reader and pdftotext, as the site's hidden text does (src/lib/rehype-status.mjs).
            said = f'<span class="said">{label}: </span>' if note else f'<span class="said">{label}</span>'
            # The note is one box beside the dot, so a note with code in it wraps as a sentence does.
            note = f'<span class="note">{note}</span>' if note else ""
            return f'<td{attrs}><span class="s {cls}" title="{label}">{said}{note}</span></td>'
    return m.group(0)

# Status dots only in a feature matrix (a table whose header names the apps); elsewhere "—" stays a dash.
def mark(m):
    t = m.group(0)
    if "Torrenta</th>" not in t or "nux</th>" not in t:
        return t
    return re.sub(r"<td([^>]*)>(.*?)</td>", cell, t.replace("<table>", '<table class="matrix">', 1), flags=re.S)
s = re.sub(r"<table>.*?</table>", mark, s, flags=re.S)

# Level words become pills, as on the site: "**MUST.**" alone, "(SHOULD)" without brackets, a bare MAY in prose.
# Code, headings, links and the drawn mockups keep the word as text.
def pill(level):
    return f'<span class="lvl lvl-{level.lower()}">{level}</span>'
s = re.sub(r"<strong>(MUST|SHOULD|MAY)\.?</strong>", lambda m: pill(m.group(1)), s)
# A rule, "**KBD-07 · MUST.**" opening a list item: its ID, then its level pill.
s = re.sub(r"<strong>([A-Z]{2,6}-\d{2,3}) · (MUST|SHOULD|MAY)\.</strong>",
           lambda m: f'<span class="rule-id" id="{m.group(1).lower()}">{m.group(1)}</span> {pill(m.group(2))}', s)

# Links into this edition (scripts/combine.py made every page's relative links absolute) lead to the PDF's own pages:
# the rule or section when it is on that page, else the page's heading. Each page is an <h2>, in pages.json order.
# The tree whose guide is printed: scripts/build-print.sh names it in PAUTA_ROOT, which is this script's own checkout
# unless CI runs master's copy on the checkout of a released edition. Its package.json, pages.json and public/ are
# read, never the ones beside this script.
ROOT = Path(os.environ.get("PAUTA_ROOT") or Path(__file__).resolve().parent.parent).resolve()
pkg = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
EDITION = pkg["guidelines"]["url"].rstrip("/") + "/" + (os.environ.get("PAUTA_PRINT_FOLDER") or pkg["version"]) + "/"
slugs = [slug for g in json.loads((ROOT / "pages.json").read_text(encoding="utf-8"))["groups"] for slug in g["items"]]
heads = list(re.finditer(r'<h2 id="([^"]+)"', s))
if len(heads) != len(slugs):
    sys.exit(f"print-markup: {len(heads)} page headings for {len(slugs)} pages in pages.json")
pages = {}
for i, (slug, h) in enumerate(zip(slugs, heads)):
    end = heads[i + 1].start() if i + 1 < len(heads) else len(s)
    pages[slug] = (h.group(1), re.findall(r'\sid="([^"]+)"', s[h.start():end]))

def inside(m):
    path, _, frag = m.group(1)[len(EDITION):].partition("#")
    page = pages.get(path.strip("/"))
    if not page:
        return m.group(0)  # the overview or the changelog, which the PDF leaves out
    head, ids = page
    # pandoc numbers a repeated heading's id ("rules-3"), so a section is found by its name and an optional number.
    found = next((i for i in ids if frag and re.fullmatch(re.escape(frag) + r"(-\d+)?", i)), head)
    return f'href="#{found}"'
s = re.sub(r'href="(' + re.escape(EDITION) + r'[^"]*)"', inside, s)
KEEP = re.compile(r"<(code|pre|kbd|a|h[1-6]|th|style|script|svg)\b|<span class=\"lvl|<div class=\"mock-stage")
def levels(html):
    out, depth = [], []
    for tok in re.split(r"(<[^>]+>)", html):
        if tok.startswith("<"):
            name = re.match(r"</?([a-zA-Z0-9]+)", tok)
            name = name.group(1).lower() if name else ""
            if tok.startswith("</"):
                if depth and depth[-1][0] == name:
                    depth[-1][1] -= 1
                    if depth[-1][1] == 0:
                        depth.pop()
            elif depth and depth[-1][0] == name and not tok.endswith("/>"):
                depth[-1][1] += 1
            elif not depth and KEEP.match(tok) and not tok.endswith("/>"):
                depth.append([name, 1])
            out.append(tok)
        elif depth:
            out.append(tok)
        else:
            out.append(re.sub(r"\(?\b(MUST|SHOULD|MAY)\b\)?",
                              lambda m: pill(m.group(1)) if m.group(0).startswith("(") == m.group(0).endswith(")")
                              else m.group(0).replace(m.group(1), pill(m.group(1))), tok))
    return "".join(out)
head, sep, body = s.partition("<body")
s = head + sep + levels(body) if sep else levels(s)

def figure(img):
    cap = re.search(r'title="([^"]*)"', img)
    img = re.sub(r'\s*title="[^"]*"', "", img)
    return f'<figure class="shot">{img}' + (f"<figcaption>{cap.group(1)}</figcaption>" if cap else "") + "</figure>"
def para(m):
    imgs = re.findall(r"<img\s[^>]*>", m.group(1))
    if not imgs or re.sub(r"<img\s[^>]*>|\s", "", m.group(1)):
        return m.group(0)
    figs = "".join(figure(i) for i in imgs)
    return figs if len(imgs) == 1 else f'<div class="shot-row n{len(imgs)}">{figs}</div>'
s = re.sub(r"<p>(.*?)</p>", para, s, flags=re.S)

# Each app's icon beside its name in table headers and bold row labels.
ICONS = (ROOT / "public" / "icons").as_uri()
APPS = {"Editora": "editora", "Torrenta": "torrenta", "Termina": "termina", "Modula": "modula", "Mirada": "mirada", "nux": "nux"}
def icon(app):
    return f'<img class="app-icon" src="{ICONS}/{APPS[app]}.svg" alt="" />'
s = re.sub(r"<th([^>]*)>(" + "|".join(APPS) + r")</th>", lambda m: f"<th{m.group(1)}>{icon(m.group(2))}{m.group(2)}</th>", s)
s = re.sub(r"<td([^>]*)><strong>(" + "|".join(APPS) + r")</strong></td>", lambda m: f"<td{m.group(1)}><strong>{icon(m.group(2))}{m.group(2)}</strong></td>", s)
# Paths into public/ (site-absolute under the base, or relative such as ../../icons/) point at the files for the
# file:// print.
PUBLIC = (ROOT / "public").as_uri()
s = s.replace('src="/adl-desktop-apps-guidelines/', f'src="{PUBLIC}/')
s = re.sub(r'src="(?:\.\./)+icons/', f'src="{PUBLIC}/icons/', s)
# The template mockups' stylesheet.
s = s.replace("</style>", extra_css + "\n.mock-stage { break-inside: avoid; }\n</style>", 1)
open(dst, "w", encoding="utf-8").write(s)
