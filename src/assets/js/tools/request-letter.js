import { parseDate, addWorkingDays, iso } from "../lib/nzdates.js";
import { $, $$, copy, download, formData, longDate, todayIso } from "../lib/ui.js";

const form = $("#letter-form");
const out = $("#letter-output");
const textEl = $("#letter-text");
const deadlineEl = $("#letter-deadline");

function syncKind() {
  const kind = form.querySelector('input[name="kind"]:checked').value;
  for (const fs of $$("fieldset[data-for]")) fs.hidden = fs.dataset.for !== kind;
}
$$('input[name="kind"]').forEach((r) => r.addEventListener("change", syncKind));
syncKind();

const today = () => longDate(parseDate(todayIso()));
const or = (v, fallback) => (v && v.trim() ? v.trim() : fallback);

function header(d) {
  return [
    today(),
    "",
    `To: Privacy Officer, ${or(d.agency, "[organisation name]")}`,
    "",
  ];
}

function signoff(d) {
  return ["", "Ngā mihi,", or(d.name, "[your name]"), or(d.contact, "[your email or postal address]")];
}

function idLines(d) {
  const lines = [`My name is ${or(d.name, "[your name]")}.`];
  if (d.other) lines.push(`To help you find my records: ${d.other}.`);
  return lines.join(" ");
}

function accessLetter(d) {
  const lines = header(d);
  lines.push("Request for my personal information under the Privacy Act 2020 (IPP 6)", "");
  lines.push(`${idLines(d)} I am asking for access to the personal information ${or(d.agency, "your organisation")} holds about me, under information privacy principle 6 of the Privacy Act 2020.`, "");
  if (d.scope) lines.push(`Specifically, I am asking for: ${d.scope}`, "");
  else lines.push("I am asking for all personal information you hold about me, in any form, including emails, notes, recordings, images and records in third-party systems you use.", "");
  if ((d.electronic || []).includes("yes")) lines.push("Please provide the information electronically, to the contact details below.", "");
  if ((d.sources || []).includes("yes")) lines.push("Where you obtained any of this information from someone other than me, please also tell me where it came from.", "");
  if ((d.urgent || []).includes("yes")) {
    lines.push(`I am asking you to treat this request as urgent. ${or(d.urgentReason, "[explain why]")}`, "");
  }
  lines.push(
    "Please confirm you have received this request. I understand you must respond as soon as reasonably practicable, and no later than 20 working days after receiving it. If you decide to withhold any information, please tell me what was withheld and the reason, so that I can consider my options, including a complaint to the Privacy Commissioner.",
  );
  lines.push("", "If you need to verify my identity, please tell me what you need.");
  return lines.concat(signoff(d)).join("\n");
}

function correctionLetter(d) {
  const lines = header(d);
  lines.push("Request to correct my personal information under the Privacy Act 2020 (IPP 7)", "");
  lines.push(`${idLines(d)} I am asking you to correct personal information you hold about me, under information privacy principle 7 of the Privacy Act 2020.`, "");
  lines.push(`The information that is wrong: ${or(d.wrong, "[describe it]")}`, "");
  lines.push(`What it should say: ${or(d.right, "[describe the correction]")}`, "");
  if (d.evidence) lines.push(`I have attached: ${d.evidence}.`, "");
  lines.push(
    "Please let me know within 20 working days whether you will make the correction. If you decide not to, I ask that you attach a statement of the correction I have sought to the information, so that it is read with it, and tell me that you have done so.",
    "",
    "If you have already shared the incorrect information with others, please tell me who, and let them know about the correction where that is reasonably practicable.",
  );
  return lines.concat(signoff(d)).join("\n");
}

function followupLetter(d) {
  let deadlineText = "[date]";
  if (d.sent) {
    try {
      const { deadline } = addWorkingDays(parseDate(d.sent), 20);
      deadlineText = longDate(deadline);
    } catch {
      /* leave the placeholder */
    }
  }
  const sentText = d.sent ? longDate(parseDate(d.sent)) : "[date]";
  const lines = header(d);
  lines.push("Overdue response to my Privacy Act request", "");
  lines.push(
    `${idLines(d)} You received my request for my personal information on ${sentText}. The 20 working-day limit for your response ended on ${deadlineText}, and I have not received a decision or a notice that you are extending the time limit.`,
    "",
    "Under the Privacy Act 2020 a failure to respond within the time limit is treated as a refusal. I would prefer to resolve this with you directly. Please send me your decision, and the information, within 5 working days of this letter.",
    "",
    "If I don't hear from you by then, I intend to make a complaint to the Privacy Commissioner.",
  );
  return { text: lines.concat(signoff(d)).join("\n"), deadlineText };
}

let current = "";
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = formData(form);
  let note = "";
  if (d.kind === "access") {
    current = accessLetter(d);
    const { deadline } = addWorkingDays(parseDate(todayIso()), 20);
    note = `If they receive it today, their response is due by ${longDate(deadline)}.`;
  } else if (d.kind === "correction") {
    current = correctionLetter(d);
    const { deadline } = addWorkingDays(parseDate(todayIso()), 20);
    note = `If they receive it today, their decision is due by ${longDate(deadline)}.`;
  } else {
    const r = followupLetter(d);
    current = r.text;
    note = d.sent ? `Their deadline was ${r.deadlineText}.` : "Add the date they received your request so the letter shows the correct deadline.";
  }
  deadlineEl.textContent = note;
  textEl.textContent = current;
  out.hidden = false;
});

$("#copy-letter").addEventListener("click", (e) => copy(current, e.currentTarget));
$("#download-letter").addEventListener("click", () => download(`privacy-request-${iso(parseDate(todayIso()))}.txt`, current));
