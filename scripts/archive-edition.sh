#!/usr/bin/env bash
# Keeps a built edition on the `versions` branch, which holds one folder per published edition (1.3.2/, 1.3.1/, ...)
# and nothing else; scripts/build-site.mjs serves every folder on it beside the current edition. CI runs it after each
# push to master with --push; without the flag the branch is only updated locally.
#
#   scripts/archive-edition.sh [--push] [dir...]    each dir is named by its version; default dist/<package.json version>
#
# Rebuilding an edition replaces its folder, so a site-only change to the current edition reaches its archive too.
set -euo pipefail
cd "$(dirname "$0")/.."
push=no
dirs=()
for arg in "$@"; do
  case "$arg" in --push) push=yes ;; *) dirs+=("$arg") ;; esac
done
if [ ${#dirs[@]} -eq 0 ]; then dirs=("dist/$(node -p 'require("./package.json").version')"); fi
for dir in "${dirs[@]}"; do
  [ -f "$dir/index.html" ] || { echo "no edition at $dir (run npm run build first)" >&2; exit 1; }
  [[ "$(basename "$dir")" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "$dir is not named by a version" >&2; exit 1; }
done

wt=build/versions-branch
git worktree remove --force "${wt:?}" 2>/dev/null || true
git worktree prune
if git fetch --quiet origin versions 2>/dev/null; then
  git worktree add --quiet --detach "$wt" FETCH_HEAD
  git -C "$wt" switch --quiet -C versions FETCH_HEAD
elif git rev-parse --verify --quiet versions >/dev/null; then
  git worktree add --quiet "$wt" versions
else
  git worktree add --quiet --detach "$wt"
  git -C "$wt" switch --quiet --orphan versions
fi

cat > "$wt/README.md" <<'README'
# Pauta: published editions

One folder per edition of the guidelines, as built when it was published, served by GitHub Pages under its own
address (`https://pauta-project.dev/1.3.2/`). `scripts/build-site.mjs` on `master` lays them beside the current
edition on every deploy, and `scripts/archive-edition.sh` adds each new one here. Nothing on this branch is edited
by hand.
README
for dir in "${dirs[@]}"; do
  v=$(basename "$dir")
  git -C "$wt" rm -r --quiet --ignore-unmatch "${v:?}"
  cp -r "$dir" "${wt:?}/${v:?}"
  echo "archived $v"
done
git -C "$wt" add -A
if git -C "$wt" diff --cached --quiet; then
  echo "versions branch already holds these editions"
else
  git -C "$wt" commit --quiet -m "Pauta $(printf '%s, ' "${dirs[@]##*/}" | sed 's/, $//')"
  if [ "$push" = yes ]; then git -C "$wt" push --quiet origin versions; fi
fi
git worktree remove --force "$wt"
