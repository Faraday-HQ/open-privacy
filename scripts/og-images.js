// Builds a 1200x630 social card for every HTML page, after Eleventy has written them.
// Cards are rendered at build time with Satori (layout to SVG) and resvg (SVG to PNG),
// so no external image service ever sees the page. Output: _site/og/<slug>.png
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const SITE_HOST = JSON.parse(readFileSync("src/_data/site.json", "utf8")).url.replace(/^https?:\/\//, "");
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const font = (pkg, file) => readFileSync(join("node_modules", pkg, "files", file));
const FONTS = [
  { name: "Geist Mono", data: font("@fontsource/geist-mono", "geist-mono-latin-400-normal.woff"), weight: 400, style: "normal" },
  { name: "Geist Mono", data: font("@fontsource/geist-mono", "geist-mono-latin-600-normal.woff"), weight: 600, style: "normal" },
  { name: "Geist", data: font("@fontsource/geist", "geist-latin-500-normal.woff"), weight: 500, style: "normal" },
  { name: "Syne", data: font("@fontsource/syne", "syne-latin-800-normal.woff"), weight: 800, style: "normal" },
];

export function ogSlug(url) {
  const s = String(url || "/").replace(/^\/|\/$/g, "").replace(/\//g, "-");
  return s || "home";
}

const SECTIONS = [
  ["/help/", "Get help now"],
  ["/guides/people/", "For people"],
  ["/guides/organisations/", "For organisations"],
  ["/answers/", "Answers"],
  ["/scams/", "Scams"],
  ["/glossary/", "Glossary"],
  ["/tools/", "Tools"],
  ["/templates/", "Templates"],
  ["/blog/", "Blog"],
];

function sectionFor(url) {
  const hit = SECTIONS.find(([prefix]) => url.startsWith(prefix));
  return hit ? hit[1] : "Privacy help for Aotearoa";
}

const h = (type, style, children) => ({ type, props: { style, children } });

const C = { bg: "#0c1214", panel: "#10181b", line: "#1f2c31", line2: "#2f3f45", ink: "#e9eeec", muted: "#84928f", accent: "#7fd0b0", urgent: "#ff8b7b" };
const MESH = "repeating-linear-gradient(45deg, rgba(233,238,236,0.14) 0px, rgba(233,238,236,0.14) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, rgba(233,238,236,0.14) 0px, rgba(233,238,236,0.14) 1px, transparent 1px, transparent 12px)";

// The site's frame: hairline edges, a section rule, and the cage figure in the corner.
function card(title, section, urgent) {
  const size = title.length > 90 ? 50 : title.length > 60 ? 58 : 66;
  return h("div", {
    width: 1200, height: 630, display: "flex", backgroundColor: C.bg, padding: "0 40px",
  }, [
    h("div", {
      // Satori sizes boxes as content-box, so subtract the padding from the frame size.
      width: 1120 - 128, height: 630 - 112, display: "flex", flexDirection: "column", justifyContent: "space-between",
      borderLeft: `1px solid ${C.line}`, borderRight: `1px solid ${C.line}`, padding: "56px 64px",
      color: C.ink, fontFamily: "Geist",
    }, [
      h("div", { display: "flex", alignItems: "center", justifyContent: "space-between" }, [
        h("div", { fontFamily: "Syne", fontWeight: 800, fontSize: 38, letterSpacing: 2.5 }, "FARADAY"),
        h("div", { display: "flex", alignItems: "center", flexShrink: 0, whiteSpace: "nowrap", fontFamily: "Geist Mono", fontSize: 22, color: urgent ? C.urgent : C.muted }, section),
      ]),
      h("div", { display: "flex", fontSize: size, fontWeight: 500, lineHeight: 1.06, letterSpacing: -2.4, maxWidth: 900 }, title),
      h("div", { display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: `1px solid ${C.line}`, paddingTop: 28 }, [
        h("div", { display: "flex", flexDirection: "column", fontFamily: "Geist Mono", fontSize: 22, color: C.muted }, [
          h("div", {}, SITE_HOST),
          h("div", { marginTop: 6 }, "Free privacy help for Aotearoa"),
        ]),
        h("div", { display: "flex", alignItems: "center", justifyContent: "center", width: 88, height: 88, border: `1.5px solid ${C.ink}`, backgroundImage: MESH }, [
          h("div", { width: 16, height: 16, backgroundColor: C.accent }, ""),
        ]),
      ]),
    ]),
  ]);
}

function decode(s) {
  return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

export async function generateOgImages(results, outDir = "_site") {
  mkdirSync(join(outDir, "og"), { recursive: true });
  let count = 0;
  for (const r of results) {
    if (!r.outputPath || !r.outputPath.endsWith(".html") || !r.url || r.url.endsWith(".html")) continue;
    const m = /<meta property="og:title" content="([^"]*)"/.exec(r.content || "");
    if (!m) continue;
    const title = decode(m[1]);
    const svg = await satori(card(title, sectionFor(r.url), r.url.startsWith("/help/")), { width: 1200, height: 630, fonts: FONTS });
    const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
    writeFileSync(join(outDir, "og", `${ogSlug(r.url)}.png`), png);
    count += 1;
  }
  return count;
}

// Square logo for Organization schema, Apple touch icon and social profiles.
export async function generateLogo(outDir = "_site") {
  const tree = h("div", {
    width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    backgroundColor: C.bg, color: C.ink,
  }, [
    h("div", { display: "flex", alignItems: "center", justifyContent: "center", width: 132, height: 132, border: `2px solid ${C.ink}`, backgroundImage: MESH, marginBottom: 56 }, [
      h("div", { width: 24, height: 24, backgroundColor: C.accent }, ""),
    ]),
    h("div", { fontFamily: "Syne", fontWeight: 800, fontSize: 50, letterSpacing: 2 }, "FARADAY"),
  ]);
  const svg = await satori(tree, { width: 512, height: 512, fonts: FONTS });
  mkdirSync(join(outDir, "assets"), { recursive: true });
  writeFileSync(join(outDir, "assets", "logo.png"), new Resvg(svg).render().asPng());
}
