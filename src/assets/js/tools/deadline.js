import { parseDate, addWorkingDays, workingDaysBetween, iso, UnsupportedYearError } from "../lib/nzdates.js";
import { $, escapeHtml, longDate, todayIso } from "../lib/ui.js";

const form = $("#deadline-form");
const out = $("#deadline-output");
const daysSel = $("#days");
const customWrap = $("#custom-wrap");

$("#received").value = todayIso();
daysSel.addEventListener("change", () => (customWrap.hidden = daysSel.value !== "custom"));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  out.hidden = false;
  try {
    const received = parseDate($("#received").value);
    const n = daysSel.value === "custom" ? parseInt($("#custom").value, 10) : parseInt(daysSel.value, 10);
    if (!Number.isInteger(n) || n < 1 || n > 200) throw new Error("Enter a number of working days between 1 and 200.");

    const { deadline, skipped } = addWorkingDays(received, n);
    const today = parseDate(todayIso());
    let status;
    if (today.getTime() > deadline.getTime()) {
      status = "The deadline has passed. If you have not had a response, you can treat the request as refused and complain to the Privacy Commissioner.";
    } else if (today.getTime() === deadline.getTime()) {
      status = "Today is the last day.";
    } else {
      const left = workingDaysBetween(today, deadline);
      status = `${left} working day${left === 1 ? "" : "s"} left after today.`;
    }

    const skippedHtml = skipped.length
      ? `<p>Days skipped besides weekends:</p><ul>${skipped.map((s) => `<li>${escapeHtml(longDate(parseDate(s.date)))}: ${escapeHtml(s.reason)}</li>`).join("")}</ul>`
      : "<p>No public holidays or summer-period days fell inside this window.</p>";

    out.innerHTML = `
      <h2>Response due by</h2>
      <p class="result-big">${escapeHtml(longDate(deadline))}</p>
      <p>${n} working days after ${escapeHtml(longDate(received))}. ${escapeHtml(status)}</p>
      ${skippedHtml}
      <p class="small">Machine-readable: received ${iso(received)}, due ${iso(deadline)}.</p>`;
  } catch (err) {
    const msg = err instanceof UnsupportedYearError
      ? `${err.message} Until then, use the Ombudsman's calculator and check the result by hand.`
      : err.message;
    out.innerHTML = `<p><strong>Could not calculate.</strong> ${escapeHtml(msg)}</p>`;
  }
  out.focus?.();
});
