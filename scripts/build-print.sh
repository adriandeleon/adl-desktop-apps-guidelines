#!/usr/bin/env bash
# Builds the single-file editions served under /downloads/: the whole guide as one Markdown file and as an A4 PDF.
# Needs pandoc, python3, Google Chrome (or Chromium) and the npm packages (npm ci): CI installs pandoc, the runner image
# has the others.
set -euo pipefail
cd "$(dirname "$0")/.."
out=public/downloads
work=build/print
mkdir -p "$out" "$work"
# The edition's version and date (package.json is the one source). With PAUTA_PATH=next (scripts/build-next.mjs) the
# downloads are next/'s: the batch waiting under [Unreleased], labeled as such, linking next/ and dated today.
version=$(python3 -I -c 'import json;print(json.load(open("package.json"))["version"])')
today=$(python3 -I -c 'import json;print(json.load(open("package.json"))["guidelines"]["date"])')
site=$(python3 -I -c 'import json;print(json.load(open("package.json"))["guidelines"]["url"])')
folder=$version
label=$version
if [ "${PAUTA_PATH:-}" = next ]; then
  folder=next
  label="Next (unreleased, after $version)"
  today=$(date -u +%F)
fi
export PAUTA_PRINT_FOLDER=$folder

# 1. One Markdown file, pages in pages.json order: each page's title becomes an H2, its headings move down a level.
python3 -I scripts/combine.py pages.json src/content/docs "$today" "$version" "$site" "$folder" "$label" > "$out/adl-desktop-apps-guidelines.md"

# 2. The screenshots as JPEG, for print only: Chrome embeds a PNG uncompressed and a JPEG as it is, so the PDF is a
#    fraction of the size (scripts/print-shots.mjs).
rm -rf "$work/shots"
node scripts/print-shots.mjs src/assets/shots "$work/shots"

# 3. HTML for print (the masthead carries the title and intro, so the combined file's preamble is dropped). Fonts come
#    from the site's own npm packages (node_modules), never the network.
sed -n '/^## /,$p' "$out/adl-desktop-apps-guidelines.md" \
  | sed -E "s#https://raw.githubusercontent.com/adriandeleon/adl-desktop-apps-guidelines/[^/]+/src/assets/shots/([^)\" ]+)\.png#file://$PWD/$work/shots/\1.jpg#g" \
  | pandoc -f gfm -t html5 --toc --toc-depth=2 --template=scripts/print-template.html \
      --variable fonts="file://$PWD/node_modules" \
      --metadata date="$today" --metadata version="$label" --metadata site="$site" --metadata title="Pauta" --no-highlight -o "$work/raw.html"
python3 -I scripts/print-markup.py "$work/raw.html" "$work/guide.html" src/styles/templates.css

# 4. PDF, with bookmarks from the headings.
chrome=$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser) || {
  echo "build-print: no Chrome on the PATH (google-chrome, google-chrome-stable, chromium or chromium-browser); the PDF is printed with it" >&2
  exit 1
}
pdf="$out/adl-desktop-apps-guidelines.pdf"
rm -f "$pdf"
"$chrome" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --generate-pdf-document-outline --virtual-time-budget=10000 \
  --print-to-pdf="$pdf" "file://$PWD/$work/guide.html" 2>"$work/chrome.log" || true
# Chrome logs noise and can exit 0 without a file, so the file decides.
[ -s "$pdf" ] || { echo "Chrome wrote no PDF:" >&2; cat "$work/chrome.log" >&2; exit 1; }
[ -s "$out/adl-desktop-apps-guidelines.md" ] || { echo "the Markdown download is empty" >&2; exit 1; }

# Chrome stamps the PDF with the time it printed it, the only bytes that differ between two builds of the same
# edition. The edition's date instead keeps the file identical, so re-archiving the edition on the versions branch
# adds no new copy to its history. Same length, so the cross-reference offsets hold.
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
