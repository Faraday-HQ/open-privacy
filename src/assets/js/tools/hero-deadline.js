// Home page: the 20-working-day deadline for a Privacy Act request, worked out as you type.
import { summariseDeadline } from "../lib/deadline-summary.js";
import { $, todayIso } from "../lib/ui.js";

const input = $("#hero-received");
const dateEl = $("#hero-deadline-date");
const noteEl = $("#hero-deadline-note");
const labelEl = $("#hero-deadline-label");

function update() {
  if (!input.value) {
    labelEl.textContent = "Pick the date they received it";
    dateEl.textContent = "";
    noteEl.textContent = "";
    return;
  }
  try {
    const r = summariseDeadline(input.value);
    labelEl.textContent = "They must reply by";
    dateEl.textContent = r.deadline;
    dateEl.setAttribute("datetime", r.deadlineIso);
    noteEl.textContent = r.note;
  } catch (err) {
    labelEl.textContent = "Can't work that one out here";
    dateEl.textContent = "";
    noteEl.textContent = "Public holiday dates for that year aren't loaded yet. Use the full calculator and check by hand.";
  }
}

input.value = todayIso();
input.addEventListener("input", update);
input.addEventListener("change", update);
$("#hero-deadline-form").addEventListener("submit", (e) => e.preventDefault());
update();
