"""Applies the guide's table conventions to pandoc's HTML for print: status dots, level pills, matrix tables."""
import re, sys

src, dst = sys.argv[1], sys.argv[2]
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
open(dst, "w", encoding="utf-8").write(s)
