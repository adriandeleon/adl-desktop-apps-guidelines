"""Applies the guide's table conventions to pandoc's HTML for print: status dots, level pills, matrix tables."""
import re, sys
from pathlib import Path

src, dst = sys.argv[1], sys.argv[2]
extra_css = Path(sys.argv[3]).read_text(encoding="utf-8") if len(sys.argv) > 3 else ""
s = open(src, encoding="utf-8").read()
s = s.replace("<table>", '<div class="table-wrap"><table>').replace("</table>", "</table></div>")

def mark(m):
    t = m.group(0)
    return t.replace("<table>", '<table class="matrix">', 1) if "Torrenta</th>" in t and "nux</th>" in t else t
s = re.sub(r"<table>.*?</table>", mark, s, flags=re.S)

def cell(m):
    attrs, body = m.group(1), m.group(2).strip()
    for glyph, cls, label in (("●", "s-yes", "Yes"), ("◐", "s-part", "Partly"), ("—", "s-no", "No")):
        if body.startswith(glyph):
            note = body[len(glyph):].strip()
            return f'<td{attrs}><span class="s {cls}" title="{label}">{note}</span></td>'
    return m.group(0)
s = re.sub(r"<td([^>]*)>(.*?)</td>", cell, s, flags=re.S)
s = re.sub(r"<td([^>]*)>(MUST|SHOULD|MAY)(\b[^<]*)</td>",
           lambda m: f'<td{m.group(1)}><span class="lvl lvl-{m.group(2).lower()}">{m.group(2)}</span>{m.group(3)}</td>', s)

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
ICONS = (Path(__file__).resolve().parent.parent / "public" / "icons").as_uri()
APPS = {"Editora": "editora", "Torrenta": "torrenta", "Termina": "termina", "Modula": "modula", "Mirada": "mirada", "nux": "nux"}
def icon(app):
    return f'<img class="app-icon" src="{ICONS}/{APPS[app]}.svg" alt="" />'
s = re.sub(r"<th([^>]*)>(" + "|".join(APPS) + r")</th>", lambda m: f"<th{m.group(1)}>{icon(m.group(2))}{m.group(2)}</th>", s)
s = re.sub(r"<td([^>]*)><strong>(" + "|".join(APPS) + r")</strong></td>", lambda m: f"<td{m.group(1)}><strong>{icon(m.group(2))}{m.group(2)}</strong></td>", s)
# Site-absolute paths (/adl-desktop-apps-guidelines/…) point into public/ for the file:// print.
PUBLIC = (Path(__file__).resolve().parent.parent / "public").as_uri()
s = s.replace('src="/adl-desktop-apps-guidelines/', f'src="{PUBLIC}/')
# The template mockups' stylesheet.
s = s.replace("</style>", extra_css + "\n.mock-stage { break-inside: avoid; }\n</style>", 1)
open(dst, "w", encoding="utf-8").write(s)
