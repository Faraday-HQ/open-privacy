import { POU } from "../lib/maturity-data.js";
import { $, $$, download, escapeHtml, store, todayIso, SITE_URL, SITE_HOST } from "../lib/ui.js";

const KEY = "faraday.self-check.v1";
const form = $("#maturity-form");
const out = $("#maturity-output");
let answers = store.get(KEY, {});

for (const [name, value] of Object.entries(answers)) {
  const input = form.querySelector(`input[name="${CSS.escape(name)}"][value="${CSS.escape(String(value))}"]`);
  if (input) input.checked = true;
}

form.addEventListener("change", (e) => {
  if (e.target.type !== "radio") return;
  answers[e.target.name] = Number(e.target.value);
  store.set(KEY, answers);
});

$("#maturity-reset").addEventListener("click", () => {
  answers = {};
  store.remove(KEY);
  $$('input[type="radio"]', form).forEach((r) => (r.checked = false));
  out.hidden = true;
});

function score() {
  return POU.map((p) => {
    const vals = p.statements.map((_, i) => answers[`${p.id}-${i}`]);
    const answered = vals.filter((v) => Number.isFinite(v));
    const pct = answered.length ? Math.round((answered.reduce((a, b) => a + b, 0) / (answered.length * 3)) * 100) : null;
    const gaps = p.statements.filter((_, i) => !(answers[`${p.id}-${i}`] >= 2));
    return { ...p, pct, answered: answered.length, gaps };
  });
}

function markdown(results) {
  const lines = [`# Privacy self-check results (${todayIso()})`, "", `Organised by the Privacy Commissioner's Poupou Matatapu. Made with ${SITE_HOST}/tools/privacy-self-check/`, ""];
  lines.push("| Pou | Score |", "| --- | --- |");
  for (const r of results) lines.push(`| ${r.title} | ${r.pct === null ? "not answered" : `${r.pct}%`} |`);
  lines.push("", "## Priorities", "");
  for (const r of [...results].filter((r) => r.pct !== null).sort((a, b) => a.pct - b.pct).slice(0, 3)) {
    lines.push(`### ${r.title} (${r.pct}%)`, "");
    for (const g of r.gaps) lines.push(`- [ ] ${g}`);
    for (const [label, href] of r.actions) lines.push(`- Resource: ${label}, ${SITE_URL}${href}`);
    lines.push(`- Commissioner's guidance: ${r.opc}`, "");
  }
  return lines.join("\n");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const results = score();
  const answered = results.reduce((n, r) => n + r.answered, 0);
  if (!answered) {
    out.innerHTML = "<p>Answer at least one statement to see results.</p>";
    out.hidden = false;
    return;
  }
  const scored = results.filter((r) => r.pct !== null);
  const overall = Math.round(scored.reduce((a, r) => a + r.pct, 0) / scored.length);
  const priorities = [...scored].sort((a, b) => a.pct - b.pct).slice(0, 3);

  out.innerHTML = `
    <h2>Overall: ${overall}%</h2>
    <p class="small">A score is only useful for comparing yourself with yourself next year. The list of gaps is the useful part.</p>
    <ul class="pou-results" id="pou-results"></ul>
    <h3>Start here</h3>
    ${priorities.map((r) => `
      <h4>${escapeHtml(r.title)} (${r.pct}%)</h4>
      <ul>${r.gaps.map((g) => `<li>${escapeHtml(g)}</li>`).join("") || "<li>No gaps marked. Check the evidence behind your answers.</li>"}</ul>
      <p class="small">Resources:</p>
      <ul class="small">${r.actions.map(([label, href]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join("")}<li><a href="${r.opc}" class="ext" rel="noopener noreferrer">The Commissioner's guidance on this pou</a></li></ul>`).join("")}
    <button class="btn" type="button" id="maturity-download">Download results</button>`;

  const list = $("#pou-results");
  for (const r of results) {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = r.title;
    const bar = document.createElement("span");
    bar.className = "pou-bar";
    bar.setAttribute("aria-hidden", "true");
    const fill = document.createElement("span");
    fill.style.width = `${r.pct ?? 0}%`;
    bar.appendChild(fill);
    const pct = document.createElement("span");
    pct.textContent = r.pct === null ? "n/a" : `${r.pct}%`;
    li.append(name, bar, pct);
    list.appendChild(li);
  }
  out.hidden = false;
  $("#maturity-download").addEventListener("click", () => download(`privacy-self-check-${todayIso()}.md`, markdown(results), "text/markdown"));
  out.scrollIntoView({ behavior: "smooth", block: "start" });
});
