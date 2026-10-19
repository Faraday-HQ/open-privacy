// One-line summary of a Privacy Act s 44 deadline (20 working days), shared by the
// home page panel (in the browser) and the build (for the version shown without JavaScript).
import { parseDate, addWorkingDays, iso } from "./nzdates.js";
import { longDate } from "./ui.js";

function list(items) {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function summariseDeadline(receivedIso, days = 20) {
  const received = parseDate(receivedIso);
  const { deadline, skipped } = addWorkingDays(received, days);
  const reasons = [...new Set(skipped.map((s) => s.reason.replace(/ \(25 December to 15 January\)/, " shutdown")))];
  const note = reasons.length
    ? `${days} working days, skipping weekends and ${list(reasons.map((r) => (r.startsWith("Summer") ? "the summer shutdown (25 December to 15 January)" : r)))}.`
    : `${days} working days, skipping weekends. No public holidays fall in this window.`;
  return { received: longDate(received), deadline: longDate(deadline), deadlineIso: iso(deadline), note };
}
