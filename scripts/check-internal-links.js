#!/usr/bin/env node
// Checks that every internal link and in-page anchor in the built site resolves.
// Run after `npm run build`.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = "_site";
const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".html")) pages.push(p);
  }
})(ROOT);

const idsCache = new Map();
function idsOf(file) {
  if (!idsCache.has(file)) {
    const html = readFileSync(file, "utf8");
    idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
}

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = [join(ROOT, clean), join(ROOT, clean, "index.html")];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) || null;
}

let broken = 0;
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    const [path, hash] = href.split("#");
    let target = page;
    if (path) {
      if (!path.startsWith("/")) continue; // relative links are not used on this site
      target = resolve(path);
      if (!target) { console.log(`${page}: broken link ${href}`); broken++; continue; }
    }
    if (hash && target.endsWith(".html") && !idsOf(target).has(hash)) {
      console.log(`${page}: missing anchor ${href}`);
      broken++;
    }
  }
}
if (broken) { console.log(`\n${broken} broken internal link(s).`); process.exit(1); }
console.log(`Internal links OK across ${pages.length} pages.`);
