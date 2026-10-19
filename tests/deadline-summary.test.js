import { test } from "node:test";
import assert from "node:assert/strict";
import { summariseDeadline } from "../src/assets/js/lib/deadline-summary.js";

// Received Monday 19 October 2026. Labour Day (Monday 26 October) is skipped,
// so the 20th working day is Tuesday 17 November 2026.
test("home panel: Labour Day is skipped and named", () => {
  const r = summariseDeadline("2026-10-19");
  assert.equal(r.deadline, "Tuesday 17 November 2026");
  assert.equal(r.deadlineIso, "2026-11-17");
  assert.match(r.note, /Labour Day/);
});

// Received Friday 4 December 2026. Working days 7-11 Dec (5) and 14-18 Dec (5),
// 21-24 Dec (4) = 14; 25 Dec to 15 Jan skipped; 18-22 Jan 2027 (5) = 19; Monday 25 Jan = 20.
test("home panel: the summer shutdown is named once", () => {
  const r = summariseDeadline("2026-12-04");
  assert.equal(r.deadline, "Monday 25 January 2027");
  assert.equal((r.note.match(/summer shutdown/g) || []).length, 1);
});

test("home panel: a quiet window says no holidays fall in it", () => {
  const r = summariseDeadline("2026-08-03");
  assert.match(r.note, /No public holidays/);
});
