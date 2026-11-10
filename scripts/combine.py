"""Concatenates the guide's pages, in pages.json order, into one Markdown document on stdout."""
import json, re, sys
from urllib.parse import urljoin
from pathlib import Path

order_file, docs_dir, today, version, site = sys.argv[1], Path(sys.argv[2]), sys.argv[3], sys.argv[4], sys.argv[5]
# The folder the pages are served from and the version as printed: the version both times, or "next" and a label that
# says the batch is unreleased (scripts/build-print.sh with PAUTA_PATH=next).
folder = sys.argv[6] if len(sys.argv) > 6 else version
label = sys.argv[7] if len(sys.argv) > 7 else version
RAW = "https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/"
# The edition's pins (src/lib/pins.mjs says why): links into the apps' code at the commits recorded at its release,
# this repository's at its tag. None when pins.json is for another edition.
_pins_file = Path(order_file).parent / "pins.json"
PINS = json.loads(_pins_file.read_text(encoding="utf-8")) if _pins_file.exists() else None
if PINS and (PINS.get("edition") != version or folder != version):
    PINS = None


def pin(text):
    if not PINS:
        return text
    def ref(m):
        repo, kind = m.group(1), m.group(2)
        sha = "v" + PINS["edition"] if repo == "adl-desktop-apps-guidelines" else PINS["repos"].get(repo)
        return f"github.com/adriandeleon/{repo}/{kind}/{sha}/" if sha else m.group(0)
    text = re.sub(r"github\.com/adriandeleon/([A-Za-z0-9_.-]+)/(blob|tree)/(master|main)/", ref, text)
    return text.replace("raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/",
                        f"raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/v{PINS['edition']}/")
groups = json.loads(Path(order_file).read_text(encoding="utf-8"))["groups"]
EDITION = site.rstrip("/") + "/" + folder + "/"
CODE = re.compile(r"(^ *```.*?^ *```|`[^`\n]*`)", re.M | re.S)
LINK = re.compile(r"\]\((?!https?:|mailto:)([^)\s]+)\)")
# An SVG <use href="#i-close"/> names a symbol drawn in the same document, so it stays as written.
HREF = re.compile(r'(<use\b[^>]*?\s)?href="(?!https?:|mailto:)([^"]+)"')
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})")


def absolute(markdown, page):
    """A page's relative links ("../menus/", "#kbd-07") made absolute in its edition, as the site resolves them, so
    the single Markdown file's links work anywhere; the print build turns those into the PDF's own pages again
    (scripts/print-markup.py). Code keeps its examples as written."""
    fix = lambda s: HREF.sub(lambda m: m.group(0) if m.group(1) else f'href="{urljoin(page, m.group(2))}"',
                             LINK.sub(lambda m: "](" + urljoin(page, m.group(1)) + ")", s))
    return "".join(part if i % 2 else fix(part) for i, part in enumerate(CODE.split(markdown)))


def demote(markdown):
    """Every heading a level down, since each page's title becomes an H2. A fenced code block keeps its lines as
    written: the "## Pauta" block a reader copies into an app's AGENTS.md (PAUTA-17) is an example, not a heading."""
    out, fence = [], None  # fence: the run of backticks or tildes that opened the block we are in
    for line in markdown.split("\n"):
        m = FENCE.match(line)
        if fence is None:
            if m:
                fence = m.group(1)
            else:
                line = re.sub(r"^(#{2,5}) ", lambda h: "#" + h.group(1) + " ", line)
        elif m and m.group(1)[0] == fence[0] and len(m.group(1)) >= len(fence) and not line.strip().strip(fence[0]):
            fence = None
        out.append(line)
    return "\n".join(out)


print("# Pauta: the adl desktop apps guidelines\n")
print("UI, UX and platform rules for adl's JavaFX desktop apps: **Editora**, **Torrenta**, **Termina**, **Modula**,")
print("**Mirada** and **nux**. Editora is the reference implementation.\n")
print("**Starting a new app?** Use [adl-desktop-app-template](https://github.com/adriandeleon/adl-desktop-app-template), a GitHub")
print("template repository built to the edition its README names: click **Use this template**, run")
print("`scripts/rename.sh <AppName> <package>`, then add any rule from a later edition. An existing app works")
print("through the New app checklist.\n")
print("**MUST** is a release blocker for a new app. **SHOULD** is expected unless the app has a stated reason.")
print("**MAY** is a pattern worth copying when the app grows into it.\n")
print(f"**Version {label} · {today}** · Web version: <{site}>\n")
if folder == "next":
    # next/ is the batch waiting for its release, and every file of it says so (AGENTS.md, "Pauta Next").
    print(f"**Not an edition.** This is Pauta Next: the changes waiting for the edition after {version}, which may still")
    print(f"change before it is released. Never cite a rule from it or audit an app against it; use <{site.rstrip('/')}/latest/>.\n")

for group in groups:
    for slug in group["items"]:
        text = (docs_dir / f"{slug}.md").read_text(encoding="utf-8")
        front, body = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S).groups()
        title = json.loads(re.search(r"^title:\s*(.+)$", front, re.M).group(1))
        body = demote(body)
        # Screenshots point at the repository's raw files, so the single Markdown file works anywhere.
        body = re.sub(r"\]\((?:\.\./)+assets/shots/", "](" + RAW, body)
        body = absolute(body, EDITION + slug + "/")
        print(pin(f"## {title}\n\n{body.strip()}\n"))
