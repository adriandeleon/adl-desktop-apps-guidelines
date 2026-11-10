#!/usr/bin/env node
// next/: the batch waiting under CHANGELOG.md's [Unreleased], built from this checkout so it can be read before it is
// released (AGENTS.md, "Editions on the site"). It is not an edition: no number and no date, links into the apps'
// code at their default branch (no pins), noindex, a notice on every page, never tagged and never on the `versions`
// branch. While nothing waits, next/ holds a redirect to latest/ for every page, so a link into it keeps working.
//
//   node scripts/build-next.mjs --build <dir>        builds next/ with its downloads into <dir>; builds nothing when
//                                                    [Unreleased] is empty. Keeps public/downloads/ as it found it.
//   node scripts/build-next.mjs --add <dir> <dist>   puts <dir> at <dist>/next/ and adds `next` to <dist>/versions.json,
//                                                    or, with no build in <dir>, fills <dist>/next/ with redirects
//
// scripts/build-site.mjs runs both. --add reads only node: and its arguments, so CI runs master's copy of it on a site
// built from an older release commit (.github/workflows/pages.yml).
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const NEXT = "next";
const [mode, ...args] = process.argv.slice(2);
const run = (cmd, argv, env = {}) => {
  const r = spawnSync(cmd, argv, { stdio: "inherit", env: { ...process.env, ...env } });
  if (r.status !== 0) {
    console.error(`${cmd} ${argv.join(" ")} failed`);
    process.exit(r.status ?? 1);
  }
};

async function build(out) {
  if (!out) throw new Error("--build <dir>");
  out = resolve(out);
  process.chdir(fileURLToPath(new URL("..", import.meta.url))); // not .pathname, which keeps a space as %20
  const { unreleased } = await import("../src/lib/editions.mjs");
  if (!unreleased(readFileSync("CHANGELOG.md", "utf8"))) {
    rmSync(out, { recursive: true, force: true });
    console.log("next/: [Unreleased] is empty, nothing to build");
    return;
  }
  // build-print.sh writes public/downloads/, which the edition's own build reads too: next/'s are put back after.
  const downloads = "public/downloads";
  const kept = "build/next-downloads";
  rmSync(kept, { recursive: true, force: true });
  if (existsSync(downloads)) {
    mkdirSync(dirname(kept), { recursive: true });
    renameSync(downloads, kept);
  }
  try {
    console.log("\n▶ next/: downloads");
    run("bash", ["scripts/build-print.sh"], { PAUTA_PATH: NEXT });
    console.log("\n▶ astro build → next/");
    run("npx", ["astro", "build"], { PAUTA_PATH: NEXT });
  } finally {
    rmSync(downloads, { recursive: true, force: true });
    if (existsSync(kept)) renameSync(kept, downloads);
  }
  const built = resolve("dist", NEXT);
  if (!existsSync(join(built, "index.html"))) {
    console.error("the build of next/ made no pages");
    process.exit(1);
  }
  if (built !== out) {
    rmSync(out, { recursive: true, force: true });
    mkdirSync(dirname(out), { recursive: true });
    cpSync(built, out, { recursive: true });
    rmSync(built, { recursive: true, force: true });
  }
  console.log(`next/ built into ${relative(process.cwd(), out) || "."}`);
}

function add(from, dist) {
  if (!from || !dist) throw new Error("--add <dir> <dist>");
  const target = join(dist, NEXT);
  const list = join(dist, "versions.json");
  const data = JSON.parse(readFileSync(list, "utf8"));
  const entry = data.versions.find((v) => v.version === data.latest);
  const root = entry.path.slice(0, -`${data.latest}/`.length); // "/" on the custom domain
  delete data.next;
  if (resolve(from) !== resolve(target)) rmSync(target, { recursive: true, force: true });

  if (existsSync(join(from, "index.html"))) {
    if (resolve(from) !== resolve(target)) cpSync(from, target, { recursive: true });
    data.next = { path: `${root}${NEXT}/`, after: data.latest };
    console.log(`next/: the batch after ${data.latest}`);
  } else {
    // Nothing waits: every page of latest/ gets a redirect at its next/ address.
    const latest = join(dist, "latest");
    let n = 0;
    const walk = (dir) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, e.name);
        if (e.isDirectory()) walk(path);
        else if (e.name === "index.html") {
          const rest = relative(latest, dir).replace(/\\/g, "/");
          const to = `${root}latest/${rest ? `${rest}/` : ""}`;
          const stub = join(target, rest, "index.html");
          mkdirSync(dirname(stub), { recursive: true });
          writeFileSync(
            stub,
            `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Pauta</title><meta name="robots" content="noindex">` +
              `<meta http-equiv="refresh" content="0; url=${to}"><script>location.replace(${JSON.stringify(to)} + location.hash)</script></head>` +
              `<body><p>Nothing waits for the next edition: <a href="${to}">${to}</a> is the latest.</p></body></html>\n`,
          );
          n++;
        }
      }
    };
    walk(latest);
    console.log(`next/: nothing waits for a release, ${n} redirects to latest/`);
  }
  writeFileSync(list, JSON.stringify(data, null, 2) + "\n");
}

if (mode === "--build") await build(args[0]);
else if (mode === "--add") add(args[0], args[1]);
else {
  console.error("usage: build-next.mjs --build <dir> | --add <dir> <dist>");
  process.exit(2);
}
