#!/usr/bin/env bash
# Builds the single-file editions served under /downloads/: the whole guide as one Markdown file and as an A4 PDF.
# Needs pandoc, python3 and Google Chrome (or Chromium); CI installs pandoc, the runner image has the others.
set -euo pipefail
cd "$(dirname "$0")/.."
out=public/downloads
work=build/print
mkdir -p "$out" "$work"
today=$(date -u +%Y-%m-%d)

# 1. One Markdown file, pages in pages.json order: each page's title becomes an H2, its headings move down a level.
python3 -I scripts/combine.py pages.json src/content/docs "$today" > "$out/adl-desktop-apps-guidelines.md"

# 2. HTML for print (the masthead carries the title and intro, so the combined file's preamble is dropped).
sed -n '/^## /,$p' "$out/adl-desktop-apps-guidelines.md" \
  | pandoc -f gfm -t html5 --toc --toc-depth=2 --template=scripts/print-template.html \
      --metadata date="$today" --metadata title="adl Desktop Apps Guidelines" --no-highlight -o "$work/raw.html"
python3 -I scripts/print-markup.py "$work/raw.html" "$work/guide.html"

# 3. PDF.
chrome=$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser)
"$chrome" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --virtual-time-budget=10000 \
  --print-to-pdf="$out/adl-desktop-apps-guidelines.pdf" "file://$PWD/$work/guide.html" 2>/dev/null
ls -l "$out"
