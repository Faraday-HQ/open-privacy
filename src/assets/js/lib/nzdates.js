// Statutory working days under the Privacy Act 2020, s 7.
//
// "working day" means any day of the week other than—
//  (a) a Saturday, a Sunday, Waitangi Day, Good Friday, Easter Monday, Anzac Day,
//      the Sovereign's birthday, Te Rā Aro ki a Matariki/Matariki Observance Day,
//      or Labour Day; or
//  (b) if Waitangi Day or Anzac Day falls on a Saturday or a Sunday, the following Monday; or
//  (c) a day in the period commencing on 25 December in one year and ending with
//      15 January in the next year.
//
// Note what is NOT excluded: regional anniversary days, and the Mondayised
// Christmas and New Year holidays (those fall inside the 25 Dec to 15 Jan period anyway).
//
// All dates here are plain calendar dates held as UTC midnight, so the maths never
// shifts because of the reader's time zone or daylight saving.

// Matariki public holiday dates, fixed in advance by the Matariki Advisory Committee
// and set out in the Te Kāhui o Matariki Public Holiday Act 2022.
// Source: MBIE, "Matariki dates 2022 to 2052". Extend this table from that schedule.
export const MATARIKI = {
  2022: "2022-06-24",
  2023: "2023-07-14",
  2024: "2024-06-28",
  2025: "2025-06-20",
  2026: "2026-07-10",
  2027: "2027-06-25",
  2028: "2028-07-14",
  2029: "2029-07-06",
  2030: "2030-06-21",
  2031: "2031-07-11",
  2032: "2032-07-02",
};

export class UnsupportedYearError extends Error {
  constructor(year) {
    super(`No Matariki date is loaded for ${year}. Add it to MATARIKI from the official schedule before relying on this result.`);
    this.name = "UnsupportedYearError";
    this.year = year;
  }
}

export function ymd(y, m, d) {
  return new Date(Date.UTC(y, m - 1, d));
}

export function parseDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s).trim());
  if (!m) throw new Error(`Expected a date like 2026-10-19, got "${s}"`);
  const d = ymd(+m[1], +m[2], +m[3]);
  if (d.getUTCMonth() !== +m[2] - 1) throw new Error(`"${s}" is not a real date`);
  return d;
}

export function iso(d) {
  return d.toISOString().slice(0, 10);
}

export function addDays(d, n) {
  return new Date(d.getTime() + n * 86400000);
}

const sameDay = (a, b) => a.getTime() === b.getTime();

// Anonymous Gregorian algorithm (Meeus/Jones/Butcher).
export function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return ymd(year, month, day);
}

// nth occurrence (1-based) of a weekday (0 = Sunday) in a month.
export function nthWeekday(year, month, weekday, n) {
  const first = ymd(year, month, 1);
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  return ymd(year, month, 1 + offset + (n - 1) * 7);
}

function mondayised(date) {
  const dow = date.getUTCDay();
  if (dow === 6) return addDays(date, 2);
  if (dow === 0) return addDays(date, 1);
  return null;
}

// Returns a list of { date, name } for every s 7 holiday in the year.
export function holidaysFor(year) {
  const list = [];
  const push = (date, name) => list.push({ date, name });

  const waitangi = ymd(year, 2, 6);
  push(waitangi, "Waitangi Day");
  const wMon = mondayised(waitangi);
  if (wMon) push(wMon, "Waitangi Day (observed Monday)");

  const easter = easterSunday(year);
  push(addDays(easter, -2), "Good Friday");
  push(addDays(easter, 1), "Easter Monday");

  const anzac = ymd(year, 4, 25);
  push(anzac, "Anzac Day");
  const aMon = mondayised(anzac);
  if (aMon) push(aMon, "Anzac Day (observed Monday)");

  push(nthWeekday(year, 6, 1, 1), "Sovereign's birthday");

  if (year >= 2022) {
    if (!MATARIKI[year]) throw new UnsupportedYearError(year);
    push(parseDate(MATARIKI[year]), "Matariki");
  }

  push(nthWeekday(year, 10, 1, 4), "Labour Day");
  return list;
}

const holidayCache = new Map();
function holidayIndex(year) {
  if (!holidayCache.has(year)) {
    const idx = new Map();
    for (const h of holidaysFor(year)) idx.set(iso(h.date), h.name);
    holidayCache.set(year, idx);
  }
  return holidayCache.get(year);
}

// Why a day is not a working day, or null if it is one.
export function nonWorkingReason(date) {
  const dow = date.getUTCDay();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  if ((m === 12 && d >= 25) || (m === 1 && d <= 15)) return "Summer period (25 December to 15 January)";
  const holiday = holidayIndex(date.getUTCFullYear()).get(iso(date));
  if (holiday) return holiday;
  if (dow === 6) return "Saturday";
  if (dow === 0) return "Sunday";
  return null;
}

export function isWorkingDay(date) {
  return nonWorkingReason(date) === null;
}

// The deadline for "not later than N working days after the day on which the
// request is received". The day of receipt is never counted.
export function addWorkingDays(received, n) {
  if (!Number.isInteger(n) || n < 1) throw new Error("n must be a positive whole number");
  let cursor = received;
  let counted = 0;
  const skipped = [];
  while (counted < n) {
    cursor = addDays(cursor, 1);
    const reason = nonWorkingReason(cursor);
    if (reason === null) counted += 1;
    else if (reason !== "Saturday" && reason !== "Sunday") skipped.push({ date: iso(cursor), reason });
  }
  return { deadline: cursor, skipped };
}

// Count the working days from the day after `from` up to and including `to`.
export function workingDaysBetween(from, to) {
  let n = 0;
  for (let c = addDays(from, 1); c.getTime() <= to.getTime(); c = addDays(c, 1)) {
    if (isWorkingDay(c)) n += 1;
  }
  return n;
}

export { sameDay };
