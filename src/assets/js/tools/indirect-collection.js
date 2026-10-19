import { IPP3A_EXCEPTIONS } from "../lib/ipp3a-exceptions.js";
import { $, copy, download, escapeHtml, formData, todayIso } from "../lib/ui.js";

const form = $("#ipp3a-form");
const out = $("#ipp3a-output");
const byId = Object.fromEntries(IPP3A_EXCEPTIONS.map((e) => [e.id, e]));
let lastText = "";

const val = (v, ph) => (v && v.trim() ? v.trim() : `[${ph}]`);

function notice(d) {
  const lines = [
    `How ${val(d.agency, "organisation")} collects information about you from others`,
    "",
    `We collect ${val(d.what, "what information")} from ${val(d.from, "who you collect it from")}.`,
    /^to /i.test(d.purpose || "")
      ? `We collect it ${d.purpose.trim().replace(/^to /i, "to ").replace(/\.$/, "")}.`
      : `We collect it for this purpose: ${val(d.purpose, "why").replace(/\.$/, "")}.`,
    `We share it with ${val(d.recipients, "who you share it with")}.`,
  ];
  if (d.law) lines.push(`The collection is authorised or required by ${d.law}.`);
  lines.push(
    `${val(d.agency, "Organisation")} holds the information and can be contacted at ${val(d.address, "contact details")}.`,
    "You have the right to ask for a copy of the information we hold about you, and to ask us to correct it. Contact us using the details above.",
  );
  return lines.join("\n");
}

function decisionRecord(d, outcome, exceptions) {
  const lines = [
    "IPP 3A DECISION RECORD",
    `Prepared: ${todayIso()}`,
    `Organisation: ${val(d.agency, "organisation")}`,
    `Collection: ${val(d.activity, "describe the collection")}`,
    `Outcome: ${outcome}`,
  ];
  if (exceptions.length) {
    lines.push("", "Exceptions relied on, and the evidence we hold:");
    for (const ex of exceptions) lines.push(`- ${ex.label}. Evidence: [record it here]. Note: ${ex.caution}`);
  }
  lines.push("", "Review this record when the collection, its purpose or its source changes.");
  return lines.join("\n");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = formData(form);
  const exceptions = (d.exceptions || []).map((id) => byId[id]).filter(Boolean);
  let html = "";

  if (d.source === "direct") {
    html = `<h2>IPP 3 applies instead</h2><p>When you collect from the person themselves, IPP 3 sets out what to tell them. The six matters are almost the same. Make sure your collection notice covers them at or before the point of collection.</p>`;
    lastText = "";
  } else if (d.source === "pppr") {
    html = `<h2>Treated as direct collection (IPP 3)</h2><p>An attorney under an enduring power of attorney, a welfare guardian or a property manager appointed under the Protection of Personal and Property Rights Act 1988 stands in the person's shoes. The Commissioner treats this as direct collection, so IPP 3 applies. Other representatives, such as parents, lawyers or advocates, are indirect collection.</p>`;
    lastText = "";
  } else if (d.when === "before") {
    html = `<h2>IPP 3A doesn't apply to that collection</h2><p>IPP 3A only applies to information collected on or after 1 May 2026. If this collection continues, update your notices now so future collections comply.</p>`;
    lastText = "";
  } else if (exceptions.length) {
    const rec = decisionRecord(d, "Not notifying, relying on the exception(s) below", exceptions);
    lastText = rec;
    html = `
      <h2>You may not need to notify, if you can prove it</h2>
      <p>You've relied on ${exceptions.length === 1 ? "one exception" : `${exceptions.length} exceptions`}. Each needs evidence you could show the Privacy Commissioner.</p>
      <ul>${exceptions.map((ex) => `<li><strong>${escapeHtml(ex.label)}.</strong> ${escapeHtml(ex.caution)}</li>`).join("")}</ul>
      <p>Even where an exception applies, the Commissioner's examples often still put a short statement in the privacy policy. It costs little and it's honest.</p>
      <h3>Decision record</h3>
      <pre>${escapeHtml(rec)}</pre>`;
  } else {
    const n = notice(d);
    const rec = decisionRecord(d, "Notify. No exception applies.", []);
    lastText = `${n}\n\n----\n\n${rec}`;
    html = `
      <p><span class="verdict high">Notify</span></p>
      <h2>You need to tell people</h2>
      <p>Take reasonable steps to make sure each person knows the six matters below, as soon as reasonably practicable after you collect the information. You can do this in advance, for example by having the source agency include your details in its own notice, if you can show it was done.</p>
      <p>Reasonable steps depend on how sensitive the information is, the possible negative impacts, and the person's needs, such as language or accessibility. Higher risk means more effort.</p>
      <h3>Draft notice</h3>
      <pre>${escapeHtml(n)}</pre>
      <h3>Decision record</h3>
      <pre>${escapeHtml(rec)}</pre>`;
  }

  if (lastText) {
    html += `<button class="btn" type="button" id="copy-out">Copy</button><button class="btn secondary" type="button" id="download-out">Download</button>`;
  }
  out.innerHTML = html;
  out.hidden = false;
  if (lastText) {
    $("#copy-out").addEventListener("click", (ev) => copy(lastText, ev.currentTarget));
    $("#download-out").addEventListener("click", () => download(`ipp3a-${todayIso()}.txt`, lastText));
  }
  out.scrollIntoView({ behavior: "smooth", block: "start" });
});
