#!/usr/bin/env node
// Checks the source registry (src/_data/sourcesRegistry.json).
//
// Fails if any source hasn't been checked in STALE_DAYS, or if a page cites a
// source id that isn't registered. Lists sources still marked "to-verify", so
// a maintainer can open each link and confirm it before the next release.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const STALE_DAYS = 180;
const registry = JSON.parse(readFileSync("src/_data/sourcesRegistry.json", "utf8"));
const ids = new Set(registry.map((s) => s.id));
const today = new Date();
let failures = 0;

const dupes = registry.map((s) => s.id).filter((id, i, a) => a.indexOf(id) !== i);
for (const d of dupes) { console.log(`Duplicate source id: ${d}`); failures += 1; }

for (const s of registry) {
  const age = Math.floor((today - new Date(s.checked)) / 86400000);
  if (age > STALE_DAYS) {
    console.log(`STALE (${age} days): ${s.id} ${s.url}`);
    failures += 1;
  }
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (!["_site", "node_modules", "assets"].includes(name)) walk(p, out); }
    else if (/\.(md|njk)$/.test(name)) out.push(p);
  }
  return out;
}

const used = new Set();
for (const file of walk("src")) {
  const text = readFileSync(file, "utf8");
  const m = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!m) continue;
  const line = /^sources:\s*\[(.*)\]\s*$/m.exec(m[1]);
  if (!line) continue;
  for (const id of line[1].split(",").map((x) => x.trim()).filter(Boolean)) {
    used.add(id);
    if (!ids.has(id)) { console.log(`${file}: unknown source id "${id}"`); failures += 1; }
  }
}

const unverified = registry.filter((s) => s.status !== "verified");
if (unverified.length) {
  console.log(`\n${unverified.length} source(s) to verify by hand before the next release:`);
  for (const s of unverified) console.log(`  - ${s.id}: ${s.url}`);
}
const unused = registry.filter((s) => !used.has(s.id));
if (unused.length) console.log(`\nRegistered but not cited (fine, but tidy up if obsolete): ${unused.map((s) => s.id).join(", ")}`);

if (failures) { console.log(`\n${failures} source problem(s).`); process.exit(1); }
console.log(`\nSource registry OK: ${registry.length} sources, ${used.size} cited.`);
