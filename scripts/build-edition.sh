#!/usr/bin/env bash
# Builds a published edition from the commit that released it into build/editions/<version>/, the same way
# scripts/build-site.mjs builds the current one (the downloads, then astro with PAUTA_PATH=<version>), so it can be
# served and archived on the `versions` branch. CI uses it for an edition a canceled run never archived
# (scripts/missing-editions.mjs prints the version and commit). Editions before 1.4.0 had no edition folders:
# scripts/archive-tag.sh rebuilds those from their tags.
#
#   scripts/build-edition.sh <version> <commit>
set -euo pipefail
cd "$(dirname "$0")/.."
v=${1:?version}
commit=${2:?commit}
[[ "$v" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "$v is not a version" >&2; exit 1; }
if [ "$(printf '%s\n' 1.4.0 "$v" | sort -V | head -1)" != 1.4.0 ]; then
  echo "$v predates edition folders; rebuild it with scripts/archive-tag.sh v$v" >&2
  exit 1
fi
[ -d node_modules ] || { echo "run npm ci first" >&2; exit 1; }

wt=build/commits/$v
out=build/editions/$v
echo "▶ $v from ${commit:0:7} → $out"
git worktree remove --force "${wt:?}" 2>/dev/null || true
git worktree prune
git worktree add --quiet --detach "$wt" "$commit"
trap 'rm -f "$wt/node_modules"; git worktree remove --force "$wt" 2>/dev/null || true' EXIT
ln -s "$PWD/node_modules" "$wt/node_modules"
[ "$(node -p "require('./$wt/package.json').version")" = "$v" ] || { echo "$commit does not carry version $v" >&2; exit 1; }

(cd "$wt" && bash scripts/build-print.sh >/dev/null && PAUTA_PATH="$v" npx astro build >/dev/null)
[ -f "$wt/dist/$v/index.html" ] || { echo "the build of $v made no pages" >&2; exit 1; }
[ -s "$wt/dist/$v/downloads/adl-desktop-apps-guidelines.pdf" ] || { echo "the build of $v made no PDF" >&2; exit 1; }

rm -rf "${out:?}"
mkdir -p build/editions
mv "$wt/dist/$v" "$out"
echo "  $(find "$out" -name index.html | wc -l) pages, $(du -sh "$out" | cut -f1)"
