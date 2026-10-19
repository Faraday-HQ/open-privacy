// Exposes the breach aid's option lists to templates, so the form and the logic
// can never drift apart.
import { BREACH_TYPES, SENSITIVE, HARMS, RECIPIENTS, PROTECTION, CONTAINMENT } from "../assets/js/lib/breach.js";

export default {
  types: BREACH_TYPES,
  sensitive: SENSITIVE,
  harms: HARMS,
  recipients: RECIPIENTS,
  protection: PROTECTION,
  containment: CONTAINMENT,
};
