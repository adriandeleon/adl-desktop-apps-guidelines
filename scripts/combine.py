"""Concatenates the guide's pages, in pages.json order, into one Markdown document on stdout."""
import json, re, sys
from urllib.parse import urljoin
from pathlib import Path

order_file, docs_dir, today, version, site = sys.argv[1], Path(sys.argv[2]), sys.argv[3], sys.argv[4], sys.argv[5]
RAW = "https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/"
groups = json.loads(Path(order_file).read_text(encoding="utf-8"))["groups"]
EDITION = site.rstrip("/") + "/" + version + "/"
CODE = re.compile(r"(^ *```.*?^ *```|`[^`\n]*`)", re.M | re.S)
LINK = re.compile(r"\]\((?!https?:|mailto:)([^)\s]+)\)")
HREF = re.compile(r'href="(?!https?:|mailto:)([^"]+)"')


def absolute(markdown, page):
    """A page's relative links ("../menus/", "#kbd-07") made absolute in its edition, as the site resolves them, so
    the single Markdown file's links work anywhere; the print build turns those into the PDF's own pages again
    (scripts/print-markup.py). Code keeps its examples as written."""
    fix = lambda s: HREF.sub(lambda m: f'href="{urljoin(page, m.group(1))}"',
                             LINK.sub(lambda m: "](" + urljoin(page, m.group(1)) + ")", s))
    return "".join(part if i % 2 else fix(part) for i, part in enumerate(CODE.split(markdown)))


print("# Pauta: the adl desktop apps guidelines\n")
print("UI, UX and platform rules for adl's JavaFX desktop apps: **Editora**, **Torrenta**, **Termina**, **Modula**,")
print("**Mirada** and **nux**. Editora is the reference implementation.\n")
print("**Starting a new app?** Use [adl-desktop-app-template](https://github.com/adriandeleon/adl-desktop-app-template), a GitHub")
print("template repository built to the edition its README names: click **Use this template**, run")
print("`scripts/rename.sh <AppName> <package>`, then add any rule from a later edition. An existing app works")
print("through the New app checklist.\n")
print("**MUST** is a release blocker for a new app. **SHOULD** is expected unless the app has a stated reason.")
print("**MAY** is a pattern worth copying when the app grows into it.\n")
print(f"**Version {version} · {today}** · Web version: <{site}>\n")

for group in groups:
    for slug in group["items"]:
        text = (docs_dir / f"{slug}.md").read_text(encoding="utf-8")
        front, body = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S).groups()
        title = json.loads(re.search(r"^title:\s*(.+)$", front, re.M).group(1))
        body = re.sub(r"^(#{2,5}) ", lambda m: "#" + m.group(1) + " ", body, flags=re.M)
        # Screenshots point at the repository's raw files, so the single Markdown file works anywhere.
        body = re.sub(r"\]\((?:\.\./)+assets/shots/", "](" + RAW, body)
        body = absolute(body, EDITION + slug + "/")
        print(f"## {title}\n\n{body.strip()}\n")
