---
title: Privacy impact assessment
description: "A two-stage PIA, with a ten-minute threshold check to decide whether you need one and a full assessment structured around the information privacy principles."
order: 3
checked: 2026-10-19
downloads:
  - { file: privacy-impact-assessment.md, label: "Download as Markdown" }
sources: [opc-pia, opc-genai, opc-bppc, pa-s22, opc-ipp3a, opc-poupou]
---

## How to use this

A privacy impact assessment (PIA) is a structured way to find privacy risks in a project before they're built in, when they're cheap to fix. The Privacy Commissioner expects PIAs for new AI tools, biometric processing and significant changes in how you handle personal information, and its Poupou Matatapu treats assessing risk as one of the ten pou.

Consultancies often charge thousands for a PIA. Much of that cost is understanding the project, which you already do. Use this template yourself; bring in a specialist to review the result if the project is high-risk.

Do the threshold check first. If every answer is "no", record that and stop.

<!-- template -->

# Privacy impact assessment

**Project:** [name]
**Owner:** [name, role]
**Assessed by:** [name]
**Date:** [date]
**Version:** [1.0]

## Part A: Threshold check

Answer yes or no. Any "yes" means you should complete Part B.

| # | Question | Yes / No |
| --- | --- | --- |
| A1 | Will we collect new personal information, or collect it in a new way? | |
| A2 | Will we use existing personal information for a new purpose? | |
| A3 | Will we share personal information with a new organisation, or send it overseas? | |
| A4 | Does it involve sensitive information (health, children, financial, ethnicity, justice, location)? | |
| A5 | Does it involve AI, automated decisions, profiling or data matching? | |
| A6 | Does it involve biometric processing (face, fingerprint, voice)? | |
| A7 | Does it involve monitoring or tracking people (cameras, location, device or activity monitoring)? | |
| A8 | Will we collect information about people from someone other than them? | |
| A9 | Could people reasonably be surprised or upset by it? | |
| A10 | Will a new supplier hold or process personal information for us? | |

**Outcome:** [No PIA needed, reason recorded / Full PIA required]

## Part B: Full assessment

### B1. Description

What is the project, what problem does it solve, and when will it go live? Who are the people whose information is involved (customers, staff, children, the public)?

### B2. Information flows

Describe or draw how information moves, covering what's collected, from whom, where it's stored, who uses it, who it's shared with, and when it's deleted. A simple table works:

| Information | Source | Stored in | Used by | Shared with | Retention |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

### B3. Assessment against the privacy principles

| Principle | Question | Finding | Risk (L/M/H) |
| --- | --- | --- | --- |
| IPP 1 Purpose | Is every item of information necessary for the purpose? What could we not collect? | | |
| IPP 2 Source | Are we collecting from the person? If not, what's the basis? | | |
| IPP 3 Notice (direct) | How will people be told the IPP 3 matters? | | |
| IPP 3A Notice (indirect) | For indirect collection, how will people be told, or which exception applies and what's our evidence? | | |
| IPP 4 Manner | Is collection fair and not unreasonably intrusive? Any children or young people? | | |
| IPP 5 Security | What safeguards fit the sensitivity? Access control, MFA, encryption, logging, supplier security? | | |
| IPP 6 and 7 Access and correction | Can we find, provide and correct a person's information within 20 working days? Including AI outputs? | | |
| IPP 8 Accuracy | How will we check accuracy before acting on it? Is there human review? | | |
| IPP 9 Retention | How long is it kept, and how will deletion happen in practice? | | |
| IPP 10 Use | Is every use consistent with the purpose people were told? | | |
| IPP 11 Disclosure | What's the basis for each disclosure? | | |
| IPP 12 Overseas | Does information go overseas? Held for us (s 11), or disclosed? What safeguards? | | |
| IPP 13 Unique identifiers | Are we assigning or reusing identifiers? | | |

### B4. Wider risks

- **Collective and group harm:** could this harm a group or community, including Māori communities, even where no individual is identified?
- **Fairness and bias:** could it work less well, or more harshly, for some groups?
- **Function creep:** what could this be used for later, and what stops that?
- **Biometrics:** if A6 was yes, complete the [biometric proportionality worksheet](/templates/biometric-assessment/).
- **Codes of practice:** does a code (health, credit, telecommunications, biometrics) apply?

### B5. Consultation

Who did you consult? Affected people, staff, iwi or Māori partners, your privacy officer, the supplier, specialists? What did they say?

### B6. Risks and actions

| Risk | Likelihood | Impact | Action | Owner | Due |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

### B7. Sign-off

**Recommendation:** [proceed / proceed with actions / don't proceed]

**Residual risk accepted by:** [name, role, date]

**Review date:** [when the PIA will be revisited, for example 6 months after go-live or on any significant change]
