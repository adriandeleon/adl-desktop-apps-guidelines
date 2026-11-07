#!/usr/bin/env bash
# Builds a published edition from its git tag into build/editions/<version>/, at its own address under the site
# (https://pauta-project.dev/<version>/), ready for scripts/archive-edition.sh. CI archives each edition as it is
# deployed; this is for the editions published before the site had edition folders (1.0.0 to 1.3.2), or to rebuild one
# whose folder was lost. The tag's own sources and scripts build it; only its address is changed, and every page gets
# the versions.js script so it offers the newest edition. Needs the print toolchain (pandoc, python3, Chrome).
#
#   scripts/archive-tag.sh v1.3.1 [v1.3.0 ...]
set -euo pipefail
cd "$(dirname "$0")/.."
origin=$(node -p 'new URL(require("./package.json").guidelines.url).origin')
root=$(node -p 'new URL(require("./package.json").guidelines.url).pathname.replace(/\/?$/, "/")')
for tag in "$@"; do
  v=${tag#v}
  [[ "$v" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "$tag is not a version tag" >&2; exit 1; }
  wt=build/tags/$v
  out=build/editions/$v
  echo "▶ $tag → $out"
  git worktree remove --force "${wt:?}" 2>/dev/null || true
  git worktree prune
  git worktree add --quiet --detach "$wt" "$tag"
  ln -s "$PWD/node_modules" "$wt/node_modules"

  # The edition's address: editions up to 1.2.0 wrote the github.io project page into their sources; 1.3.0 on derive
  # everything from package.json's guidelines.url.
  if grep -q '"url"' "$wt/package.json"; then
    node -e '
      const fs = require("fs"); const p = process.argv[1]; const pkg = JSON.parse(fs.readFileSync(p, "utf8"));
      pkg.guidelines.url = process.argv[2]; fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + "\n");
    ' "$wt/package.json" "$origin$root$v/"
  else
    find "$wt/src" "$wt/scripts" "$wt/astro.config.mjs" -type f \( -name "*.mjs" -o -name "*.astro" -o -name "*.mdx" -o -name "*.md" -o -name "*.py" -o -name "*.sh" -o -name "*.css" -o -name "*.html" \) -print0 \
      | xargs -0 perl -pi -e "s#https://adriandeleon\.github\.io/adl-desktop-apps-guidelines#$origin$root$v#g; s#\"https://adriandeleon\.github\.io\"#\"$origin\"#g; s#(?<![\w/])/adl-desktop-apps-guidelines(?=[/\"'\`])#$root$v#g"
  fi

  (cd "$wt" && bash scripts/build-print.sh >/dev/null && npx astro build >/dev/null)

  # Every page learns which edition it is and reads /versions.json; search engines index /latest/ only.
  find "$wt/dist" -name "*.html" -print0 | xargs -0 perl -pi -e "s#</head>#<script src=\"${root}versions.js\" defer data-root=\"$root\" data-version=\"$v\" data-edition=\"$v\"></script><meta name=\"robots\" content=\"noindex\"></head>#"

  rm -rf "${out:?}"
  mkdir -p build/editions
  mv "$wt/dist" "$out"
  rm -f "$wt/node_modules"
  git worktree remove --force "$wt"
  echo "  $(find "$out" -name index.html | wc -l) pages, $(du -sh "$out" | cut -f1)"
done
