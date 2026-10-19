import { EXPOSURE_GROUPS } from "../lib/exposure-data.js";
import { $, $$, download, store, todayIso, SITE_HOST } from "../lib/ui.js";

const KEY = "faraday.exposure-audit.v1";
const form = $("#audit-form");
const items = EXPOSURE_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title })));
let state = store.get(KEY, {});

function restore() {
  for (const [id, value] of Object.entries(state)) {
    const input = form.querySelector(`input[name="${CSS.escape(id)}"][value="${CSS.escape(value)}"]`);
    if (input) input.checked = true;
  }
}

function update() {
  const answered = items.filter((i) => state[i.id]).length;
  $("#audit-count").textContent = `${answered} of ${items.length} checked`;
  $("#audit-bar").style.width = `${Math.round((answered / items.length) * 100)}%`;
}

form.addEventListener("change", (e) => {
  if (e.target.type !== "radio") return;
  state[e.target.name] = e.target.value;
  store.set(KEY, state);
  update();
});

$("#audit-reset").addEventListener("click", () => {
  state = {};
  store.remove(KEY);
  $$('input[type="radio"]', form).forEach((r) => (r.checked = false));
  update();
});

$("#audit-export").addEventListener("click", () => {
  const todo = items.filter((i) => state[i.id] === "todo").sort((a, b) => b.weight - a.weight);
  const unchecked = items.filter((i) => !state[i.id]);
  const done = items.filter((i) => state[i.id] === "done");
  const lines = [`# My exposure action list (${todayIso()})`, "", `Made with Faraday's personal exposure audit, ${SITE_HOST}/tools/exposure-audit/`, ""];
  lines.push("## To do, highest impact first", "");
  if (!todo.length) lines.push("Nothing marked as needing action.", "");
  for (const i of todo) lines.push(`### ${i.title}`, "", `- What to do: ${i.reduce}`, "");
  lines.push("## Not checked yet", "");
  if (!unchecked.length) lines.push("You've checked everything.", "");
  for (const i of unchecked) lines.push(`- ${i.title} (${i.group})`);
  lines.push("", "## Dealt with", "");
  for (const i of done) lines.push(`- ${i.title}`);
  lines.push("", "Repeat this audit every six months, and after moving house, changing jobs or leaving a relationship.");
  download(`exposure-action-list-${todayIso()}.md`, lines.join("\n"), "text/markdown");
});

restore();
update();
