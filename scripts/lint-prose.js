#!/usr/bin/env node
// Prose linter for Faraday content.
//
// Fails the build on phrases that make writing sound machine-made or padded, on
// US spellings, and on spaced em dashes. Readers deserve plain New Zealand English.
// To allow a specific line (for example, quoting someone), end it with
// <!-- lint-ignore -->.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const RULES = [
  // Padding and machine-sounding phrases
  [/\bdelv(e|es|ing)\b/i, "Say 'look at' or 'cover'."],
  [/\b(digital|privacy|threat|regulatory|cyber(security)?) landscape\b/i, "Name the actual thing."],
  [/\bnavigat(e|ing) (the )?(complex|complexit|challeng|world|waters)/i, "Say what the reader has to do."],
  [/\bin today's (digital|fast|modern|connected)/i, "Cut it. Start with the point."],
  [/\bever[- ](evolving|changing)\b/i, "Say what changed and when."],
  [/\b(seamless(ly)?|game[- ]chang(er|ing)|cutting[- ]edge|best[- ]in[- ]class|world[- ]class)\b/i, "Marketing language. Be specific."],
  [/\b(leverag(e|es|ing)|synerg(y|ies)|utili[sz](e|es|ing))\b/i, "Say 'use'."],
  [/\b(empower(s|ing)?|unlock(s|ing)? the|harness(es|ing)? the power)\b/i, "Say what the reader can now do."],
  [/\b(tapestry|realm|embark(s|ing)?|testament to|plethora|myriad of)\b/i, "Plainer word, please."],
  [/\bit('s| is) (important|worth|crucial) (to note|noting|to remember)\b/i, "Just say the thing."],
  [/\b(robust|holistic|paramount|pivotal)\b/i, "Vague. Say what makes it good."],
  [/\b(furthermore|moreover)\b/i, "Usually cuttable."],
  [/\bin conclusion\b/i, "Cut it."],
  [/\blook no further\b/i, "Cut it."],
  [/\b(deep dive|dive (deep|into))\b/i, "Say 'look closely at'."],
  [/\bwhether you're an? .+ or an? /i, "Address one reader at a time."],
  [/\bstreamlin(e|ed|ing)\b/i, "Say what gets faster or simpler."],
  [/\belevat(e|es|ing) (your|the)\b/i, "Say what improves."],
  [/\bfoster(s|ing)? (a )?(culture|trust|environment)/i, "Say what people will do differently."],
  // Contrast and reveal framing ("it isn't X, it's Y", "not just X", "Here's how")
  [/\bHere's (how|what|why|the|exactly)\b/, "Cut 'Here's'. Say the thing directly."],
  [/\bnot (just|merely)\b/i, "Contrast framing. Say what it is, without the 'not just'."],
  [/\b(isn't|aren't)\b[^.;]{0,80}[.;] (It's|It is|They're|They are)\b/, "'It isn't X. It's Y' framing. State Y directly."],
  [/\b(a|the) (process|journey|mindset), not an? \w+\b/i, "Aphorism. Say what you actually do."],
  [/\b(don't|doesn't|isn't|aren't)\b[^.]{0,100}\. (You|It|They|We) (do|does)\b/, "'You don't X. You do Y' flip. Say it once, directly."],
  [/\bIn countries like\b/, "Contrast set-up. Start with the New Zealand point."],
  [/\b(Common examples|Examples|The fix is simple|The menus are \w+ similar|has particular risks|starts? the same way|the IPP 3 matters):/i, "Colon list. Use a sentence ('include', 'such as')."],
  // US spellings
  [/\borgani[z]ation/i, "NZ spelling: organisation."],
  [/\b(organiz|recogniz|minimiz|prioritiz|authoriz|categoriz|summariz|apologiz|realiz|emphasiz)(e|ed|es|ing)\b/i, "NZ spelling uses -ise."],
  [/\b(analyz|paralyz)(e|ed|es|ing)\b/i, "NZ spelling: analyse."],
  [/\b(behavior|color|favor|honor|labor|neighbor|humor)(s|ed|ing|al)?\b/i, "NZ spelling uses -our."],
  [/\b(defense|offense|licensing a)\b/i, "NZ spelling: defence, offence."],
  [/\b(center|centered)s?\b(?![-_])/i, "NZ spelling: centre."],
  [/\bprivacy program\b|\btraining program\b/i, "NZ spelling: programme (except computer programs)."],
  [/\bcatalog\b|\benroll(ment)?\b/i, "NZ spelling: catalogue, enrol, enrolment."],
  // Punctuation
  [/\s—\s/, "Spaced em dash. Use a full stop, comma or colon."],
];

const EXT = new Set([".md", ".njk"]);
const SKIP_DIRS = new Set(["node_modules", "_site", ".git", "assets"]);
// Files that contain code identifiers (Schema.org type names use US spelling).
const SKIP_FILES = new Set(["src/_includes/partials/jsonld.njk"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(p, out);
    } else if (EXT.has(extname(name))) out.push(p);
  }
  return out;
}

const roots = process.argv.slice(2);
if (!roots.length) roots.push("src");
let problems = 0;
for (const root of roots) {
  const files = statSync(root).isDirectory() ? walk(root) : [root];
  for (const file of files) {
    if (SKIP_FILES.has(file)) continue;
    const lines = readFileSync(file, "utf8").split("\n");
    let inFront = false;
    lines.forEach((line, i) => {
      if (i === 0 && line.trim() === "---") { inFront = true; }
      else if (inFront && line.trim() === "---") { inFront = false; }
      if (line.includes("lint-ignore")) return;
      // Skip URLs, so a link containing a US spelling doesn't trip the linter.
      const text = line.replace(/https?:\/\/\S+/g, "").replace(/\]\([^)]*\)/g, "]");
      for (const [re, advice] of RULES) {
        const m = re.exec(text);
        if (m) {
          problems += 1;
          console.log(`${file}:${i + 1}: "${m[0]}". ${advice}`);
        }
      }
    });
  }
}
if (problems) {
  console.log(`\n${problems} prose problem${problems === 1 ? "" : "s"} found.`);
  process.exit(1);
} else {
  console.log("Prose check passed.");
}
