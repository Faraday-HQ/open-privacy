#!/usr/bin/env node
// Search metadata checks on the built site. Run after `npm run build`.
//
// Fails on: missing <title>, meta description, canonical or <h1>; more than one <h1>;
// duplicate titles or descriptions; JSON-LD that doesn't parse or lacks @context;
// sitemap URLs that don't exist; a missing social card (unless SKIP_OG=1).
// Warns on: titles over 65 characters and descriptions outside 70 to 170 characters,
// which search engines tend to truncate or rewrite.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = "_site";
const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name === "index.html") pages.push(p);
  }
})(ROOT);

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
let errors = 0;
let warnings = 0;
const err = (f, m) => { errors++; console.log(`ERROR ${f}: ${m}`); };
const warn = (f, m) => { warnings++; console.log(`warn  ${f}: ${m}`); };
const titles = new Map();
const descs = new Map();

for (const file of pages) {
  const html = readFileSync(file, "utf8");
  if (/<meta name="robots" content="noindex/.test(html)) continue;
  const rel = file.replace(ROOT, "");
  const title = decode((/<title>([^<]*)<\/title>/.exec(html) || [])[1] || "");
  const desc = decode((/<meta name="description" content="([^"]*)"/.exec(html) || [])[1] || "");
  const h1s = (html.match(/<h1[\s>]/g) || []).length;

  if (!title) err(rel, "missing <title>");
  if (!desc) err(rel, "missing meta description");
  if (!/<link rel="canonical" href="https:\/\//.test(html)) err(rel, "missing absolute canonical");
  if (h1s !== 1) err(rel, `expected one <h1>, found ${h1s}`);
  if (title.length > 65) warn(rel, `title is ${title.length} characters: "${title}"`);
  if (desc && (desc.length < 70 || desc.length > 170)) warn(rel, `description is ${desc.length} characters`);

  if (titles.has(title)) err(rel, `duplicate title with ${titles.get(title)}`); else titles.set(title, rel);
  if (descs.has(desc)) err(rel, `duplicate description with ${descs.get(desc)}`); else descs.set(desc, rel);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      if (data["@context"] !== "https://schema.org") err(rel, "JSON-LD missing schema.org @context");
    } catch (e) {
      err(rel, `JSON-LD does not parse: ${e.message}`);
    }
  }

  if (process.env.SKIP_OG !== "1") {
    const og = (/<meta property="og:image" content="https:\/\/[^/]+(\/og\/[^"?]+)(?:\?[^"]*)?"/.exec(html) || [])[1];
    if (!og || !existsSync(join(ROOT, og))) err(rel, `missing social card ${og || ""}`);
  }
}

// Every sitemap URL must resolve to a built page.
const sitemap = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
for (const [, loc] of sitemap.matchAll(/<loc>https:\/\/[^/]+(\/[^<]*)<\/loc>/g)) {
  if (!existsSync(join(ROOT, loc, "index.html"))) err("sitemap.xml", `URL not built: ${loc}`);
}

console.log(`\nSEO check: ${pages.length} pages, ${errors} error(s), ${warnings} warning(s).`);
if (errors) process.exit(1);
