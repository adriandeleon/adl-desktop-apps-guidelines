"""Applies the guide's table conventions to pandoc's HTML for print: status dots, level pills, matrix tables."""
import re, sys
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
            return f'<td{attrs}><span class="s {cls}" title="{label}">{note}</span></td>'
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
ICONS = (Path(__file__).resolve().parent.parent / "public" / "icons").as_uri()
APPS = {"Editora": "editora", "Torrenta": "torrenta", "Termina": "termina", "Modula": "modula", "Mirada": "mirada", "nux": "nux"}
def icon(app):
    return f'<img class="app-icon" src="{ICONS}/{APPS[app]}.svg" alt="" />'
s = re.sub(r"<th([^>]*)>(" + "|".join(APPS) + r")</th>", lambda m: f"<th{m.group(1)}>{icon(m.group(2))}{m.group(2)}</th>", s)
s = re.sub(r"<td([^>]*)><strong>(" + "|".join(APPS) + r")</strong></td>", lambda m: f"<td{m.group(1)}><strong>{icon(m.group(2))}{m.group(2)}</strong></td>", s)
# Paths into public/ (site-absolute under the base, or relative such as ../../icons/) point at the files for the
# file:// print.
PUBLIC = (Path(__file__).resolve().parent.parent / "public").as_uri()
s = s.replace('src="/adl-desktop-apps-guidelines/', f'src="{PUBLIC}/')
s = re.sub(r'src="(?:\.\./)+icons/', f'src="{PUBLIC}/icons/', s)
# The template mockups' stylesheet.
s = s.replace("</style>", extra_css + "\n.mock-stage { break-inside: avoid; }\n</style>", 1)
open(dst, "w", encoding="utf-8").write(s)
