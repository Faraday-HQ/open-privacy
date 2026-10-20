// Privacy self-check, organised by the ten pou of the Privacy Commissioner's
// Poupou Matatapu guidance. The statements are Faraday's own. The Commissioner
// has said it will use Poupou Matatapu when working with organisations and when
// deciding on compliance action, so this is a sensible frame for a self-check.

const OPC = "https://www.privacy.org.nz/responsibilities/poupou-matatapu-doing-privacy-well/";

export const SCALE = [
  { value: 0, label: "Not yet" },
  { value: 1, label: "Started" },
  { value: 2, label: "Mostly" },
  { value: 3, label: "In place" },
];

export const POU = [
  {
    id: "governance", title: "Governance", opc: `${OPC}governance/`,
    statements: [
      "A named privacy officer has the authority and time to do the job, and staff know who it is.",
      "Leaders or the board get privacy reporting (breaches, requests, key risks) at least twice a year.",
      "Privacy responsibilities are written into job descriptions and supplier contracts.",
    ],
    actions: [["Privacy officer role description", "/templates/privacy-officer-role/"], ["Board privacy report", "/templates/board-privacy-report/"]],
  },
  {
    id: "know", title: "Know your personal information", opc: `${OPC}know-your-personal-information/`,
    statements: [
      "We have a current list of the personal information we hold, where it lives, why we hold it and who can see it.",
      "We know which information is sensitive and handle it with extra care.",
      "Every type of information has a retention period, and we actually delete or destroy it on schedule.",
    ],
    actions: [["Personal information inventory", "/templates/data-inventory/"], ["Retention schedule", "/templates/retention-schedule/"]],
  },
  {
    id: "security", title: "Security and internal access controls", opc: `${OPC}security-and-internal-access-controls/`,
    statements: [
      "Access to personal information is limited to people who need it, and removed promptly when they leave or change roles.",
      "Every account that can reach personal information uses multi-factor authentication.",
      "We can see who accessed sensitive records, and we look.",
      "Suppliers that hold our data were checked before we signed, and their contracts cover security and breach notification.",
    ],
    actions: [["Supplier privacy questionnaire", "/templates/vendor-questionnaire/"], ["Small organisation privacy programme", "/guides/organisations/first-90-days/"]],
  },
  {
    id: "transparency", title: "Transparency", opc: `${OPC}transparency/`,
    statements: [
      "Our privacy statement is accurate, in plain language, and covers information we collect from others (IPP 3A).",
      "Forms and sign-up flows have a short notice at the point of collection.",
      "We tell people before we use their information for a purpose they wouldn't expect.",
    ],
    actions: [["Privacy statement template", "/templates/privacy-statement/"], ["Indirect collection check", "/tools/indirect-collection/"]],
  },
  {
    id: "capability", title: "Building capability and awareness", opc: `${OPC}building-capability-and-awareness/`,
    statements: [
      "Every staff member learns the privacy essentials when they start, with a yearly reminder.",
      "Staff know what a breach looks like and how to report one quickly.",
      "Teams handling sensitive information get training specific to their work.",
    ],
    actions: [["Staff privacy essentials checklist", "/templates/staff-privacy-essentials/"]],
  },
  {
    id: "breach", title: "Breach management", opc: `${OPC}breach-management/`,
    statements: [
      "We have a written breach response plan with named roles, and we've practised it in the last year.",
      "We record every incident and near miss in a breach register, with the decision and reasons.",
      "We could notify the Privacy Commissioner and affected people within 72 hours of finding a serious breach.",
    ],
    actions: [["Breach response plan", "/templates/breach-response-plan/"], ["Breach assessment record", "/tools/breach/"]],
  },
  {
    id: "requests", title: "Responding to requests and complaints well", opc: `${OPC}responding-to-requests-and-complaints-well/`,
    statements: [
      "We log access and correction requests and answer them within 20 working days.",
      "Staff recognise a request for personal information even when it doesn't mention the Privacy Act.",
      "We have a written complaints process and we use complaints to improve.",
    ],
    actions: [["Access request procedure", "/templates/access-request-procedure/"], ["Deadline calculator", "/tools/deadline/"]],
  },
  {
    id: "risk", title: "Assessing risk", opc: `${OPC}assessing-risk/`,
    statements: [
      "We do a privacy impact assessment, or at least a threshold check, before new projects, suppliers or AI tools.",
      "Privacy risks sit in our risk register with owners.",
      "Any biometric processing has been assessed against the Biometric Processing Privacy Code.",
    ],
    actions: [["Privacy impact assessment", "/templates/privacy-impact-assessment/"], ["Biometric code guide", "/guides/organisations/biometrics-code/"]],
  },
  {
    id: "measure", title: "Measure and monitor", opc: `${OPC}measure-and-monitor/`,
    statements: [
      "We track a few privacy measures, such as requests answered on time, breaches and training completion.",
      "We check ourselves against a framework like this one at least once a year.",
      "Breaches and complaints lead to changes we can point to.",
    ],
    actions: [["Board privacy report", "/templates/board-privacy-report/"]],
  },
  {
    id: "plan", title: "Privacy management plan", opc: `${OPC}privacy-management-plan/`,
    statements: [
      "We have a written privacy plan with goals, owners and dates.",
      "The plan has a budget or time allocation, and someone reviews progress.",
    ],
    actions: [["Small organisation privacy programme", "/guides/organisations/first-90-days/"]],
  },
];
