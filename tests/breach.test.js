// Scenario tests for the breach assessment aid. These encode judgement calls,
// so each case says why the expected outcome is the defensible one.
import test from "node:test";
import assert from "node:assert/strict";
import { assess, record } from "../src/assets/js/lib/breach.js";

test("nothing selected means no s 112 breach on these facts", () => {
  const r = assess({ types: [] });
  assert.equal(r.isBreach, false);
});

test("wrong email to a trusted partner who deleted it, ordinary contact details: low", () => {
  const r = assess({ types: ["disclosure"], sensitive: [], harms: [], recipient: "trusted", protection: "none", containment: "before", count: 30 });
  assert.equal(r.level, "low");
});

test("ransomware at a clinic with health records and unknown attackers: high", () => {
  const r = assess({ types: ["unavailable", "access"], sensitive: ["health"], harms: ["emotional", "reputational"], recipient: "malicious", protection: "none", containment: "none", count: 4000 });
  assert.equal(r.level, "high");
});

test("lost laptop with strong encryption and the key not exposed: low", () => {
  const r = assess({ types: ["loss"], sensitive: ["financial"], harms: [], recipient: "unknown", protection: "strong", containment: "none", count: 800 });
  assert.equal(r.level, "low");
});

test("home address of someone at risk sent to a person with no duty of confidence: high, whatever the score", () => {
  const r = assess({ types: ["disclosure"], sensitive: ["location"], harms: [], recipient: "untrusted", protection: "none", containment: "partial", count: 1 });
  assert.equal(r.level, "high");
});

test("employee browsing a neighbour's file without a reason: borderline", () => {
  const r = assess({ types: ["access"], sensitive: [], harms: ["emotional"], recipient: "internal", protection: "none", containment: "none", count: 1 });
  assert.equal(r.level, "medium");
});

test("exposed passwords without strong protection are high even at small scale", () => {
  const r = assess({ types: ["access"], sensitive: ["credentials"], harms: [], recipient: "unknown", protection: "weak", containment: "partial", count: 5 });
  assert.equal(r.level, "high");
});

test("the written record cites the s 113 factors and never claims to decide", () => {
  const input = { types: ["disclosure"], sensitive: ["health"], harms: ["emotional"], recipient: "untrusted", protection: "none", containment: "none", count: 1, agency: "Example Ltd", summary: "Letter posted to the wrong address." };
  const text = record(input, assess(input), { prepared: "2026-10-19" });
  assert.match(text, /s 113\(b\)/);
  assert.match(text, /The agency makes the decision/);
  assert.match(text, /Example Ltd/);
});
