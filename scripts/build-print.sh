#!/usr/bin/env bash
# Builds the single-file editions served under /downloads/: the whole guide as one Markdown file and as an A4 PDF.
# Needs pandoc, python3 and Google Chrome (or Chromium); CI installs pandoc, the runner image has the others.
set -euo pipefail
cd "$(dirname "$0")/.."
out=public/downloads
work=build/print
mkdir -p "$out" "$work"
# The edition's version and date (package.json is the one source).
version=$(python3 -I -c 'import json;print(json.load(open("package.json"))["version"])')
today=$(python3 -I -c 'import json;print(json.load(open("package.json"))["guidelines"]["date"])')
site=$(python3 -I -c 'import json;print(json.load(open("package.json"))["guidelines"]["url"])')

# 1. One Markdown file, pages in pages.json order: each page's title becomes an H2, its headings move down a level.
python3 -I scripts/combine.py pages.json src/content/docs "$today" "$version" "$site" > "$out/adl-desktop-apps-guidelines.md"

# 2. HTML for print (the masthead carries the title and intro, so the combined file's preamble is dropped).
sed -n '/^## /,$p' "$out/adl-desktop-apps-guidelines.md" \
  | sed "s#https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/master/src/assets/shots/#file://$PWD/src/assets/shots/#g" \
  | pandoc -f gfm -t html5 --toc --toc-depth=2 --template=scripts/print-template.html \
      --metadata date="$today" --metadata version="$version" --metadata site="$site" --metadata title="Pauta" --no-highlight -o "$work/raw.html"
python3 -I scripts/print-markup.py "$work/raw.html" "$work/guide.html" src/styles/templates.css

# 3. PDF.
chrome=$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser)
pdf="$out/adl-desktop-apps-guidelines.pdf"
rm -f "$pdf"
"$chrome" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --virtual-time-budget=10000 \
  --print-to-pdf="$pdf" "file://$PWD/$work/guide.html" 2>"$work/chrome.log" || true
# Chrome logs noise and can exit 0 without a file, so the file decides.
[ -s "$pdf" ] || { echo "Chrome wrote no PDF:" >&2; cat "$work/chrome.log" >&2; exit 1; }
[ -s "$out/adl-desktop-apps-guidelines.md" ] || { echo "the Markdown download is empty" >&2; exit 1; }

# Chrome stamps the PDF with the time it printed it, the only bytes that differ between two builds of the same
# edition. The edition's date instead keeps the file identical, so re-archiving the edition on the versions branch
# (every push to master) adds no new 11 MB copy to its history. Same length, so the cross-reference offsets hold.
python3 -I - "$pdf" "$today" <<'PY'
import re, sys
path, date = sys.argv[1], sys.argv[2].replace("-", "")
data = open(path, "rb").read()
stamp = f"D:{date}000000+00'00'".encode()
fixed, n = re.subn(rb"D:\d{14}\+00'00'", lambda m: stamp if len(m.group(0)) == len(stamp) else m.group(0), data)
open(path, "wb").write(fixed)
print(f"PDF dates set to {sys.argv[2]} ({n} stamps)")
PY
ls -l "$out"
