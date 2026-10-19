// Netlify build plugin: after a successful production deploy, tell IndexNow
// (used by Bing, Yandex, Seznam, Naver and others) which URLs exist, so new and
// changed pages are crawled quickly. Bing's index also feeds several AI assistants.
// It submits only URLs whose <lastmod> is within the last 14 days, to stay polite.
import { readFileSync } from "node:fs";

export const onSuccess = async ({ constants, utils }) => {
  if (process.env.CONTEXT !== "production") {
    console.log("[indexnow] Not a production deploy; skipping.");
    return;
  }
  try {
    const site = JSON.parse(readFileSync("src/_data/site.json", "utf8"));
    const xml = readFileSync(`${constants.PUBLISH_DIR}/sitemap.xml`, "utf8");
    const cutoff = Date.now() - 14 * 86400000;
    const urls = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)]
      .filter(([, , lastmod]) => new Date(lastmod).getTime() >= cutoff)
      .map(([, loc]) => loc);
    if (!urls.length) {
      console.log("[indexnow] No recently changed URLs.");
      return;
    }
    const host = new URL(site.url).host;
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: site.indexNowKey, keyLocation: `${site.url}/${site.indexNowKey}.txt`, urlList: urls.slice(0, 10000) }),
    });
    console.log(`[indexnow] Submitted ${urls.length} URL(s): HTTP ${res.status}`);
  } catch (err) {
    // Never fail a deploy because of a ping.
    utils.status.show({ title: "IndexNow ping failed", summary: String(err) });
  }
};
