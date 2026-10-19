// Eleventy configuration for faraday.co.nz
// Static output only. No client-side tracking, no third-party requests.

import markdownItAttrs from "markdown-it-attrs";
import { ogSlug, generateOgImages, generateLogo } from "./scripts/og-images.js";
import { summariseDeadline } from "./src/assets/js/lib/deadline-summary.js";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toDate(value) {
  if (value instanceof Date) return value;
  // Treat bare YYYY-MM-DD strings as calendar dates, not UTC instants.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return new Date(value);
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/downloads": "downloads" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  // "19 October 2026" — the NZ convention.
  eleventyConfig.addFilter("nzDate", (value) => {
    if (!value) return "";
    const d = toDate(value);
    return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  });

  eleventyConfig.addFilter("isoDate", (value) => {
    if (!value) return "";
    return toDate(value).toISOString().slice(0, 10);
  });

  // Look up entries in the source registry (src/_data/sources.json).
  eleventyConfig.addFilter("sourcesFor", (ids, registry) => {
    if (!Array.isArray(ids)) return [];
    return ids.map((id) => {
      const entry = registry.find((s) => s.id === id);
      if (!entry) throw new Error(`Unknown source id "${id}". Add it to src/_data/sources.json.`);
      return entry;
    });
  });

  eleventyConfig.addFilter("byOrder", (items) =>
    [...items].sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999)),
  );

  eleventyConfig.addFilter("limit", (items, n) => items.slice(0, n));

  // ---------- search and sharing ----------
  eleventyConfig.addFilter("ogSlug", ogSlug);
  // Safe JSON for <script type="application/ld+json">: escape "<" so content can't close the tag.
  eleventyConfig.addFilter("jsonLd", (obj) => JSON.stringify(obj).replace(/</g, "\\u003c"));
  // Plain Markdown for llms-full.txt: resolve the few template variables used in content,
  // drop heading-id attributes and HTML comments.
  eleventyConfig.addFilter("cleanMd", (raw, site) =>
    String(raw || "")
      .replace(/\{\{\s*site\.repo\s*\}\}/g, site.repo)
      .replace(/\{\{\s*site\.email\s*\}\}/g, site.email)
      .replace(/\{\{\s*site\.founder\s*\}\}/g, site.founder)
      .replace(/\s*\{:[#.][^}]+\}/g, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\]\(\//g, `](${site.url}/`)
      .trim(),
  );
  // Template pages show the template's own "# Title"; demote it so each page keeps one <h1>.
  eleventyConfig.addFilter("demoteH1", (html) => String(html).replace(/<h1(\s|>)/g, "<h2$1").replace(/<\/h1>/g, "</h2>"));
  eleventyConfig.addFilter("setAttr", (obj, key, value) => { obj[key] = value; return obj; });

  const CRUMB_NAMES = {
    "/guides/": null, // not a page in its own right
    "/guides/people/": "For people",
    "/guides/organisations/": "For organisations",
    "/answers/": "Answers",
    "/scams/": "Scams",
    "/glossary/": "Glossary",
    "/tools/": "Tools",
    "/templates/": "Templates",
    "/blog/": "Blog",
  };
  // Home > Section > Page, for the visible trail and BreadcrumbList schema.
  eleventyConfig.addFilter("breadcrumbs", (url, title) => {
    if (!url || url === "/") return [];
    const crumbs = [{ name: "Home", url: "/" }];
    const parts = url.split("/").filter(Boolean);
    let acc = "/";
    parts.forEach((part, i) => {
      acc += `${part}/`;
      const last = i === parts.length - 1;
      if (last) crumbs.push({ name: title, url });
      else if (CRUMB_NAMES[acc]) crumbs.push({ name: CRUMB_NAMES[acc], url: acc });
    });
    return crumbs;
  });

  eleventyConfig.addFilter("isoDateTime", (value) => (value ? toDate(value).toISOString() : ""));

  // Pages that share a cluster with this one, for "Related" links.
  eleventyConfig.addFilter("related", (all, current, cluster, n = 5) =>
    all.filter((p) => p.url !== current && p.data.cluster && p.data.cluster === cluster).slice(0, n),
  );

  eleventyConfig.on("eleventy.after", async ({ results, runMode }) => {
    if (process.env.SKIP_OG === "1") return;
    await generateLogo();
    const n = await generateOgImages(results);
    console.log(`[faraday] Social cards: ${n}`);
  });

  const md = (glob) => (api) => api.getFilteredByGlob(glob);

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/blog/*.md").sort((a, b) => b.date - a.date),
  );
  eleventyConfig.addCollection("people", md("src/guides/people/*.md"));
  eleventyConfig.addCollection("organisations", md("src/guides/organisations/*.md"));
  eleventyConfig.addCollection("templates", md("src/templates/*.md"));
  eleventyConfig.addCollection("tools", md("src/tools/*.njk"));
  eleventyConfig.addCollection("answers", (api) =>
    api.getFilteredByGlob("src/answers/*.md").sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999)),
  );
  eleventyConfig.addCollection("scams", md("src/scams/*.md"));
  // Every indexable HTML page, for the sitemap and llms.txt.
  eleventyConfig.addCollection("indexable", (api) =>
    api.getAll().filter((p) => p.url && p.url.endsWith("/") && !p.data.noindex && p.data.eleventyExcludeFromCollections !== true),
  );

  // "On this page": the h2 headings of a rendered page that carry an id.
  eleventyConfig.addFilter("toc", (html) => {
    const out = [];
    const re = /<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
    let m;
    while ((m = re.exec(String(html || "")))) {
      out.push({ id: m[1], text: m[2].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim() });
    }
    return out;
  });
  // The home page deadline panel, worked out at build time for readers without JavaScript.
  eleventyConfig.addFilter("deadlineSummary", (isoDate) => summariseDeadline(String(isoDate)));
  eleventyConfig.addFilter("count", (arr) => (Array.isArray(arr) ? arr.length : 0));
  eleventyConfig.addFilter("where", (arr, key, value) => (arr || []).filter((x) => x && x[key] === value));

  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.set({ html: true, typographer: true });
    // Allows {:#id} on headings (not {#id}, which Nunjucks reads as a comment) so pages can deep-link to sections.
    mdLib.use(markdownItAttrs, { leftDelimiter: "{:", rightDelimiter: "}", allowedAttributes: ["id", "class"] });
    // Give every h2 and h3 an id (unless one was set with {:#id}) so sections can be linked
    // and listed under "On this page".
    const slug = (t) => t.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .replace(/&[a-z]+;/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 64);
    mdLib.core.ruler.push("heading_ids", (state) => {
      const used = new Set();
      state.tokens.forEach((t) => { const id = t.type === "heading_open" && t.attrGet("id"); if (id) used.add(id); });
      state.tokens.forEach((t, i) => {
        if (t.type !== "heading_open" || !["h2", "h3"].includes(t.tag) || t.attrGet("id")) return;
        const inline = state.tokens[i + 1];
        let base = slug(inline && inline.content ? inline.content : "") || "section";
        let id = base, n = 2;
        while (used.has(id)) id = `${base}-${n++}`;
        used.add(id);
        t.attrSet("id", id);
      });
    });
    // Wide tables scroll inside their own box instead of pushing the page sideways.
    mdLib.renderer.rules.table_open = () => '<div class="table-scroll"><table>\n';
    mdLib.renderer.rules.table_close = () => "</table></div>\n";
    // Open external links normally; mark them so readers know they leave the site.
    const defaultRender =
      mdLib.renderer.rules.link_open ||
      ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
    mdLib.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const href = tokens[idx].attrGet("href") || "";
      if (/^https?:\/\//.test(href) && !/(^|\/\/|\.)(faraday\.co\.nz|faradayhq\.com)(\/|$)/.test(href)) {
        tokens[idx].attrSet("rel", "noopener noreferrer");
        tokens[idx].attrJoin("class", "ext");
      }
      return defaultRender(tokens, idx, options, env, self);
    };
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
