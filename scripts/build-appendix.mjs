#!/usr/bin/env node
// family/: the family appendix, the pages about the apps (pages.json's `appendix`: the feature matrix, the shared
// features, the gaps per app). It is in no edition (src/lib/site.mjs, APPENDIX): served once at <root>family/<page>/,
// built from master on every deploy, so a change to it is live at the next merge without a release, and it never
// asks for a changelog entry (scripts/check-edition.mjs). Its links lead to the rules in latest/.
//
//   node scripts/build-appendix.mjs --build <dir>        builds the appendix from this checkout into <dir>
//   node scripts/build-appendix.mjs --add <dir> <dist>   puts <dir> at <dist>/family/, and in latest/ and next/ turns
//                                                        any page of an older build's family/ into a redirect to it
//
// scripts/build-site.mjs runs both, with the build from its own checkout unless $PAUTA_APPENDIX names one already
// made. CI builds it from the commit it runs on before it moves to the release commit, as it does next/, and passes
// it so (.github/workflows/pages.yml). --build works on this script's own checkout, or on $PAUTA_ROOT.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const APPENDIX = "family"; // src/lib/site.mjs; not imported, so --add runs on any tree
const [mode, ...args] = process.argv.slice(2);

const redirect = (to, text) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Pauta</title><meta name="robots" content="noindex">` +
  `<link rel="canonical" href="${to}"><meta http-equiv="refresh" content="0; url=${to}">` +
  `<script>location.replace(${JSON.stringify(to)} + location.hash)</script></head>` +
  `<body><p>${text}: <a href="${to}">${to}</a>.</p></body></html>\n`;

function build(out) {
  if (!out) throw new Error("--build <dir>");
  out = resolve(out);
  process.chdir(process.env.PAUTA_ROOT || fileURLToPath(new URL("..", import.meta.url))); // not .pathname, which keeps a space as %20
  const pages = JSON.parse(readFileSync("pages.json", "utf8")).appendix?.items ?? [];
  if (!pages.length) {
    console.error("pages.json has no appendix: this tree predates the family appendix");
    process.exit(1);
  }
  console.log("\n▶ astro build → family/");
  const built = resolve("build", APPENDIX); // astro.config.mjs's outDir for the appendix
  rmSync(built, { recursive: true, force: true });
  const r = spawnSync("npx", ["astro", "build"], { stdio: "inherit", env: { ...process.env, PAUTA_PATH: APPENDIX } });
  if (r.status !== 0) process.exit(r.status ?? 1);

  // What src/pages/ and public/ add to every build belongs to the editions: the agent files, each edition page as
  // Markdown, the downloads, the scripts only an edition loads. The appendix keeps its pages, their assets and search.
  for (const name of ["rules.json", "rules.schema.json", "audit.schema.json", "llms.txt", "llms-full.txt", "changelog.md",
    "skills", "downloads", "CNAME", "versions.js", "checklist.js"]) {
    rmSync(join(built, name), { recursive: true, force: true });
  }
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, e.name);
      if (e.isDirectory()) {
        walk(path);
        if (!readdirSync(path).length) rmSync(path, { recursive: true }); // a folder that held only those
      } else if (e.name.endsWith(".md")) rmSync(path);
    }
  };
  walk(built);
  for (const slug of pages) {
    const page = join(built, slug.slice(APPENDIX.length + 1), "index.html");
    if (!existsSync(page)) {
      console.error(`the appendix's build has no ${slug}`);
      process.exit(1);
    }
  }
  // <root>family/ itself leads to the appendix's first page.
  writeFileSync(join(built, "index.html"), redirect(`./${pages[0].slice(APPENDIX.length + 1)}/`, "The family appendix starts here"));

  if (built !== out) {
    rmSync(out, { recursive: true, force: true });
    mkdirSync(dirname(out), { recursive: true });
    cpSync(built, out, { recursive: true });
  }
  console.log(`family/ built into ${relative(process.cwd(), out) || "."}: ${pages.join(", ")}`);
}

function add(from, dist) {
  if (!from || !dist) throw new Error("--add <dir> <dist>");
  if (!existsSync(join(from, "index.html"))) {
    console.error(`${from} holds no build of the family appendix`);
    process.exit(1);
  }
  const list = JSON.parse(readFileSync(join(dist, "versions.json"), "utf8"));
  const entry = list.versions.find((v) => v.version === list.latest);
  const root = entry.path.slice(0, -`${list.latest}/`.length); // "/" on the custom domain
  const target = join(dist, APPENDIX);
  if (resolve(from) !== resolve(target)) {
    rmSync(target, { recursive: true, force: true }); // the root redirects an older latest/ left here
    cpSync(from, target, { recursive: true });
  }
  // latest/ and next/ follow the appendix: a family/ page an older build left there (an edition released before the
  // appendix) becomes a redirect to it. A numbered edition keeps its own copy, as it was released.
  let n = 0;
  for (const folder of ["latest", "next"]) {
    const old = join(dist, folder, APPENDIX);
    if (!existsSync(old) || !statSync(old).isDirectory()) continue;
    const walk = (dir) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, e.name);
        if (e.isDirectory()) walk(path);
        else if (e.name === "index.html") {
          const rest = relative(old, dir).replace(/\\/g, "/");
          writeFileSync(path, redirect(`${root}${APPENDIX}/${rest ? `${rest}/` : ""}`, "The family appendix now lives outside the editions"));
          n++;
        }
      }
    };
    walk(old);
  }
  console.log(`family/: the appendix added${n ? `, and ${n} redirects to it from latest/ and next/` : ""}`);
}

if (mode === "--build") build(args[0]);
else if (mode === "--add") add(args[0], args[1]);
else {
  console.error("usage: build-appendix.mjs --build <dir> | --add <dir> <dist>");
  process.exit(2);
}
