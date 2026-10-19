import { SITE_HOST } from "./ui.js";
// Decision aid for privacy breaches under Part 6 of the Privacy Act 2020.
//
// s 112: a privacy breach is unauthorised or accidental access to, or disclosure,
// alteration, loss or destruction of, personal information; or an action that
// prevents the agency from accessing it (temporarily or permanently).
// A notifiable privacy breach is one that it is reasonable to believe has caused
// serious harm to an affected individual, or is likely to do so.
//
// s 113 says that when assessing likely harm, an agency must consider:
//  (a) any action taken to reduce the risk of harm;
//  (b) whether the information is sensitive in nature;
//  (c) the nature of the harm that may be caused;
//  (d) the person or body that has obtained or may obtain the information (if known);
//  (e) whether the information is protected by a security measure;
//  (f) any other relevant matters.
//
// This module does not decide for the agency. It sorts the facts against those
// factors and produces a written record, which is what the Commissioner will ask for.

export const BREACH_TYPES = {
  access: "Someone accessed it without authority",
  disclosure: "It was disclosed to the wrong person or published",
  alteration: "It was altered without authority",
  loss: "It was lost (device, paperwork, backup)",
  destruction: "It was destroyed without authority",
  unavailable: "We can no longer access it (for example ransomware)",
};

export const SENSITIVE = {
  health: "Health, disability or medical information",
  financial: "Bank, card or detailed financial information",
  identity: "Identity documents or numbers (passport, licence, IRD number)",
  credentials: "Passwords, security questions or account access",
  location: "Home address or location of someone who may be at risk",
  children: "Information about children or young people",
  justice: "Criminal, court or protection order information",
  intimate: "Sexual life, intimate images or relationships",
  biometric: "Biometric information (face, fingerprint, voice)",
  beliefs: "Ethnicity, religion, political views or immigration status",
  employment: "Employment disputes, disciplinary or performance records",
};

export const HARMS = {
  physical: "Physical harm or intimidation",
  financial: "Financial loss or fraud",
  emotional: "Significant humiliation, fear or emotional distress",
  reputational: "Damage to reputation or relationships",
  opportunity: "Loss of a job, benefit, housing or other opportunity",
  identity: "Identity theft",
};

export const RECIPIENTS = {
  malicious: "A criminal or someone acting maliciously",
  unknown: "Unknown, or it was published openly",
  untrusted: "A known person with no duty of confidence",
  internal: "Staff inside our organisation without a need to know",
  trusted: "A trustworthy recipient who has confirmed deletion",
};

export const PROTECTION = {
  none: "No protection",
  weak: "Password or basic protection that could be bypassed",
  strong: "Strong encryption, and the key or password was not exposed",
};

export const CONTAINMENT = {
  none: "Not contained yet",
  partial: "Partly contained (for example some copies recovered)",
  before: "Fully contained before anyone could read or use it",
};

export function assess(a) {
  const reasons = [];
  const mitigating = [];

  const types = (a.types || []).filter((t) => BREACH_TYPES[t]);
  if (types.length === 0) {
    return {
      isBreach: false,
      level: "none",
      headline: "On what you have entered, this may not be a privacy breach under s 112.",
      reasons: ["No unauthorised or accidental access, disclosure, alteration, loss, destruction or loss of access was selected."],
      mitigating: [],
      next: [
        "Check again with the people involved. Near misses are worth recording in your breach register even when they are not breaches.",
      ],
    };
  }

  const sensitive = (a.sensitive || []).filter((s) => SENSITIVE[s]);
  const harms = (a.harms || []).filter((h) => HARMS[h]);
  const recipient = RECIPIENTS[a.recipient] ? a.recipient : "unknown";
  const protection = PROTECTION[a.protection] ? a.protection : "none";
  const containment = CONTAINMENT[a.containment] ? a.containment : "none";
  const count = Number.isFinite(+a.count) && +a.count > 0 ? Math.floor(+a.count) : 1;

  let score = 0;

  if (sensitive.length) {
    score += 2 + Math.min(sensitive.length - 1, 2);
    reasons.push(`Sensitive information is involved (s 113(b)): ${sensitive.map((s) => SENSITIVE[s].toLowerCase()).join("; ")}.`);
  }
  if (harms.length) {
    score += harms.length >= 2 ? 3 : 2;
    reasons.push(`Plausible harms (s 113(c)): ${harms.map((h) => HARMS[h].toLowerCase()).join("; ")}.`);
  }

  const recipientWeight = { malicious: 4, unknown: 3, untrusted: 2, internal: 1, trusted: -2 }[recipient];
  score += recipientWeight;
  if (recipientWeight > 0) reasons.push(`Who has or may have it (s 113(d)): ${RECIPIENTS[recipient].toLowerCase()}.`);
  else mitigating.push(`Recipient (s 113(d)): ${RECIPIENTS[recipient].toLowerCase()}.`);

  if (protection === "strong") {
    score -= 4;
    mitigating.push("Security measure (s 113(e)): strong encryption with the key not exposed.");
  } else if (protection === "weak") {
    score -= 1;
    mitigating.push("Security measure (s 113(e)): some protection, but it could be bypassed. Give it little weight.");
  } else {
    reasons.push("No security measure protected the information (s 113(e)).");
  }

  if (containment === "before") {
    score -= 3;
    mitigating.push("Action taken to reduce harm (s 113(a)): contained before anyone could read or use it.");
  } else if (containment === "partial") {
    score -= 1;
    mitigating.push("Action taken to reduce harm (s 113(a)): partly contained.");
  } else {
    reasons.push("The breach is not yet contained (s 113(a)).");
  }

  if (types.includes("unavailable")) {
    reasons.push("Loss of access counts as a breach. With ransomware, assume the data was also copied unless forensic evidence shows otherwise.");
    score += 1;
  }
  if (count >= 100) {
    score += 1;
    reasons.push(`Scale: about ${count.toLocaleString("en-NZ")} people affected. Scale does not make harm serious by itself, but it raises the chance that someone is seriously harmed.`);
  }

  // Hard overrides that a points total should never talk you out of.
  const overrideHigh =
    (recipient === "malicious" && protection !== "strong" && containment !== "before") ||
    (sensitive.includes("location") && recipient !== "trusted" && containment !== "before") ||
    (sensitive.includes("credentials") && protection !== "strong" && containment !== "before");

  let level;
  if (overrideHigh || score >= 6) level = "high";
  else if (score >= 3) level = "medium";
  else level = "low";

  const next = [];
  if (level === "high") {
    next.push("Treat this as a notifiable privacy breach. Notify the Privacy Commissioner through NotifyUs as soon as practicable (s 114). The Commissioner expects this within 72 hours of you becoming aware.");
    next.push("Notify affected people as soon as practicable (s 115), unless a s 116 exception applies. Tell them what happened, what you are doing, and what they can do to protect themselves.");
  } else if (level === "medium") {
    next.push("This is borderline. Get a second opinion today from your privacy officer or adviser, and lean towards notifying. Failing to notify the Commissioner of a notifiable breach is an offence (s 118).");
    next.push("If you decide not to notify, write down why, with reference to each s 113 factor, and keep it in your breach register.");
  } else {
    next.push("On what you have entered, serious harm looks unlikely. Record your reasoning against each s 113 factor in your breach register.");
    next.push("Revisit the decision if new facts emerge, such as the information turning up somewhere, or a recipient who will not confirm deletion.");
  }
  next.push("Keep containing it. Recover copies, revoke access, reset credentials, and preserve logs.");

  const headline = {
    high: "Treat this as notifiable.",
    medium: "Borderline. Get advice now and lean towards notifying.",
    low: "Serious harm looks unlikely on these facts. Record your reasoning.",
  }[level];

  return { isBreach: true, level, score, headline, reasons, mitigating, next, count, types, sensitive, harms, recipient, protection, containment };
}

// Plain-text record suitable for pasting into a breach register.
export function record(a, result, meta = {}) {
  const lines = [];
  const line = (s = "") => lines.push(s);
  line("PRIVACY BREACH ASSESSMENT RECORD");
  line(`Prepared: ${meta.prepared || new Date().toISOString().slice(0, 10)}`);
  if (a.agency) line(`Agency: ${a.agency}`);
  if (a.awareDate) line(`Date we became aware: ${a.awareDate}`);
  if (a.summary) { line(); line("What happened:"); line(a.summary); }
  line();
  line("Type of breach (s 112):");
  for (const t of result.types || []) line(`- ${BREACH_TYPES[t]}`);
  line(`People affected (approx.): ${result.count ?? "unknown"}`);
  line();
  line("Factors pointing to serious harm:");
  for (const r of result.reasons) line(`- ${r}`);
  if (!result.reasons.length) line("- None identified");
  line();
  line("Mitigating factors:");
  for (const r of result.mitigating) line(`- ${r}`);
  if (!result.mitigating.length) line("- None identified");
  line();
  line(`Assessment: ${result.headline}`);
  line();
  line("Next steps:");
  for (const n of result.next) line(`- ${n}`);
  line();
  line(`This record was produced with Faraday's breach assessment aid (${SITE_HOST}).`);
  line("The agency makes the decision. If in doubt, notify the Commissioner.");
  return lines.join("\n");
}
