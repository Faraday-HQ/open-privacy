// Tests for statutory working-day maths (Privacy Act 2020, s 7).
// Each expected deadline is worked by hand in the comment beside it, so a reviewer
// can check the reasoning without running anything.
import test from "node:test";
import assert from "node:assert/strict";
import {
  parseDate, iso, easterSunday, nthWeekday, isWorkingDay, nonWorkingReason,
  addWorkingDays, workingDaysBetween, holidaysFor, UnsupportedYearError,
} from "../src/assets/js/lib/nzdates.js";

const d = parseDate;
const deadline = (received, n = 20) => iso(addWorkingDays(d(received), n).deadline);

test("Easter Sunday matches published dates", () => {
  assert.equal(iso(easterSunday(2024)), "2024-03-31");
  assert.equal(iso(easterSunday(2025)), "2025-04-20");
  assert.equal(iso(easterSunday(2026)), "2026-04-05");
  assert.equal(iso(easterSunday(2027)), "2027-03-28");
});

test("Sovereign's birthday and Labour Day fall on the right Mondays", () => {
  assert.equal(iso(nthWeekday(2026, 6, 1, 1)), "2026-06-01");
  assert.equal(iso(nthWeekday(2026, 10, 1, 4)), "2026-10-26");
  assert.equal(iso(nthWeekday(2027, 10, 1, 4)), "2027-10-25");
});

test("weekends are not working days", () => {
  assert.equal(isWorkingDay(d("2026-10-17")), false); // Saturday
  assert.equal(isWorkingDay(d("2026-10-18")), false); // Sunday
  assert.equal(isWorkingDay(d("2026-10-19")), true);  // Monday
});

test("Anzac Day on a Saturday moves to Monday (s 7(b))", () => {
  assert.equal(nonWorkingReason(d("2026-04-25")), "Anzac Day");
  assert.equal(nonWorkingReason(d("2026-04-27")), "Anzac Day (observed Monday)");
});

test("Waitangi Day on a Saturday moves to Monday (s 7(b))", () => {
  assert.equal(isWorkingDay(d("2027-02-06")), false);
  assert.equal(nonWorkingReason(d("2027-02-08")), "Waitangi Day (observed Monday)");
});

test("Matariki is excluded from 2022 onward", () => {
  assert.equal(nonWorkingReason(d("2026-07-10")), "Matariki");
  assert.equal(nonWorkingReason(d("2025-06-20")), "Matariki");
  assert.equal(isWorkingDay(d("2021-07-02")), true); // Friday, before the holiday existed
});

test("the summer period 25 December to 15 January is excluded (s 7(c))", () => {
  assert.equal(isWorkingDay(d("2026-12-24")), true);
  assert.equal(isWorkingDay(d("2026-12-29")), false);
  assert.equal(isWorkingDay(d("2027-01-15")), false);
  assert.equal(isWorkingDay(d("2027-01-18")), true);
});

test("regional anniversary days are still working days", () => {
  // s 7 does not list provincial anniversary days.
  assert.equal(isWorkingDay(d("2027-02-01")), true); // Auckland Anniversary observed
  assert.equal(isWorkingDay(d("2026-11-13")), true); // Canterbury show day
});

test("20 working days with no holidays in the way", () => {
  // Received Mon 2 Mar 2026. Day 1 is Tue 3 Mar. Mar 3-6 (4), 9-13 (9), 16-20 (14),
  // 23-27 (19), Mon 30 Mar (20).
  assert.equal(deadline("2026-03-02"), "2026-03-30");
});

test("Easter is skipped", () => {
  // Received Mon 23 Mar 2026. 24-27 (4), 30-31 (6), Apr 1-2 (8), Good Friday 3 Apr and
  // Easter Monday 6 Apr skipped, Apr 7-10 (12), 13-17 (17), 20-22 (20).
  assert.equal(deadline("2026-03-23"), "2026-04-22");
});

test("Mondayised Anzac Day is skipped", () => {
  // Received Mon 13 Apr 2026. 14-17 (4), 20-24 (9), Mon 27 Apr skipped, 28-30 (12),
  // May 1 (13), May 4-8 (18), May 11-12 (20).
  assert.equal(deadline("2026-04-13"), "2026-05-12");
});

test("Matariki is skipped", () => {
  // Received Mon 29 Jun 2026. Jun 30 (1), Jul 1-3 (4), 6-9 (8), Fri 10 Jul skipped,
  // 13-17 (13), 20-24 (18), 27-28 (20).
  assert.equal(deadline("2026-06-29"), "2026-07-28");
});

test("Labour Day is skipped (a request received today, 19 October 2026)", () => {
  // 20-23 Oct (4), Mon 26 Oct skipped, 27-30 (8), Nov 2-6 (13), 9-13 (18), 16-17 (20).
  assert.equal(deadline("2026-10-19"), "2026-11-17");
});

test("the summer period pauses the clock", () => {
  // Received Fri 4 Dec 2026. Dec 7-11 (5), 14-18 (10), 21-24 (14), 25 Dec to 15 Jan
  // skipped, Jan 18-22 (19), Mon 25 Jan 2027 (20).
  assert.equal(deadline("2026-12-04"), "2027-01-25");
});

test("a request received on a non-working day still starts counting the next working day", () => {
  // Received Sat 17 Oct 2026: day 1 is Mon 19 Oct, so the deadline is one working day
  // earlier than for a Monday receipt. 19-23 (5), 27-30 (9), Nov 2-6 (14), 9-13 (19), 16 (20).
  assert.equal(deadline("2026-10-17"), "2026-11-16");
});

test("skipped holidays are reported for transparency", () => {
  const { skipped } = addWorkingDays(d("2026-10-19"), 20);
  assert.deepEqual(skipped, [{ date: "2026-10-26", reason: "Labour Day" }]);
});

test("workingDaysBetween is the inverse of addWorkingDays", () => {
  for (const start of ["2026-03-23", "2026-06-29", "2026-12-04", "2026-10-19"]) {
    const { deadline: end } = addWorkingDays(d(start), 20);
    assert.equal(workingDaysBetween(d(start), end), 20, start);
  }
});

test("years without a loaded Matariki date fail loudly rather than guess", () => {
  assert.throws(() => holidaysFor(2033), UnsupportedYearError);
});

test("bad input is rejected", () => {
  assert.throws(() => parseDate("2026-02-30"));
  assert.throws(() => parseDate("19/10/2026"));
  assert.throws(() => addWorkingDays(d("2026-10-19"), 0));
});
