"""Concatenates the guide's pages, in pages.json order, into one Markdown document on stdout."""
import json, re, sys
from pathlib import Path

order_file, docs_dir, today = sys.argv[1], Path(sys.argv[2]), sys.argv[3]
RAW = "https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/"
groups = json.loads(Path(order_file).read_text(encoding="utf-8"))["groups"]

print("# adl Desktop Apps Guidelines\n")
print("UI, UX and platform rules for adl's JavaFX desktop apps: **Editora**, **Torrenta**, **Termina**, **Modula**,")
print("**Mirada** and **nux**. Editora is the reference implementation.\n")
print("**MUST** is a release blocker for a new app. **SHOULD** is expected unless the app has a stated reason.")
print("**MAY** is a pattern worth copying when the app grows into it.\n")
print(f"Web version: <https://adriandeleon.github.io/adl-desktop-apps-guidelines/> · built {today}\n")

for group in groups:
    for slug in group["items"]:
        text = (docs_dir / f"{slug}.md").read_text(encoding="utf-8")
        front, body = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S).groups()
        title = json.loads(re.search(r"^title:\s*(.+)$", front, re.M).group(1))
        body = re.sub(r"^(#{2,5}) ", lambda m: "#" + m.group(1) + " ", body, flags=re.M)
        # Screenshots point at the repository's raw files, so the single Markdown file works anywhere.
        body = re.sub(r"\]\((?:\.\./)+assets/shots/", "](" + RAW, body)
        print(f"## {title}\n\n{body.strip()}\n")
