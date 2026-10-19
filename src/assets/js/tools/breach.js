import { assess, record } from "../lib/breach.js";
import { $, copy, download, escapeHtml, formData, todayIso } from "../lib/ui.js";

const form = $("#breach-form");
const out = $("#breach-output");
let lastRecord = "";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const a = formData(form);
  const result = assess(a);
  lastRecord = record(a, result, { prepared: todayIso() });

  const list = (items) => (items.length ? `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : "<p>None identified.</p>");

  if (!result.isBreach) {
    out.innerHTML = `<h2>${escapeHtml(result.headline)}</h2>${list(result.reasons)}${list(result.next)}`;
    out.hidden = false;
    return;
  }

  out.innerHTML = `
    <p><span class="verdict ${result.level}">${result.level === "high" ? "Likely notifiable" : result.level === "medium" ? "Borderline" : "Serious harm unlikely"}</span></p>
    <h2>${escapeHtml(result.headline)}</h2>
    <h3>Pointing towards serious harm</h3>
    ${list(result.reasons)}
    <h3>Pointing away from it</h3>
    ${list(result.mitigating)}
    <h3>What to do next</h3>
    ${list(result.next)}
    <h3>Your record</h3>
    <p class="small">Keep this in your breach register whatever you decide. If the Commissioner asks why you did or didn't notify, this is your answer.</p>
    <pre id="breach-record">${escapeHtml(lastRecord)}</pre>
    <button class="btn" type="button" id="copy-record">Copy record</button>
    <button class="btn secondary" type="button" id="download-record">Download record</button>`;
  out.hidden = false;
  $("#copy-record").addEventListener("click", (ev) => copy(lastRecord, ev.currentTarget));
  $("#download-record").addEventListener("click", () => download(`breach-assessment-${todayIso()}.txt`, lastRecord));
  out.scrollIntoView({ behavior: "smooth", block: "start" });
});
