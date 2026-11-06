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
open(dst, "w", encoding="utf-8").write(s)
