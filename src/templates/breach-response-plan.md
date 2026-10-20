---
title: Privacy breach response plan
description: A one-document plan with roles, a first-hour checklist, assessment against section 113, notification steps and a review. Comes with a breach register spreadsheet.
order: 4
checked: 2026-10-19
downloads:
  - { file: breach-response-plan.md, label: "Download plan as Markdown" }
  - { file: breach-register.csv, label: "Download breach register (CSV)" }
sources: [pa-s112, pa-s113, pa-s114, pa-s115, pa-s116, pa-s118, opc-breaches, opc-breach-pou, ncsc-reporting]
---

## How to use this

Fill in the names and phone numbers now, while nothing is on fire. Print a copy, because in a cyber attack your systems may be down. Test it once a year by talking through a scenario (section 7).

The breach register (CSV) opens in Excel, Google Sheets or Numbers. Record every incident and near miss, including the ones you decide aren't notifiable, with your reasons. That record is what the Privacy Commissioner will ask for.

<!-- template -->

# Privacy breach response plan

**[Organisation name]**
Owner: [privacy officer]
Last tested: [date]
Next review: [date]

## 1. What counts as a breach

A privacy breach is unauthorised or accidental access to, or disclosure, alteration, loss or destruction of, personal information, or anything that stops us accessing it (Privacy Act 2020, s 112). Examples include an email to the wrong person, a lost laptop, a hacked account, ransomware, a staff member looking at records without a work reason, paperwork left on a bus.

A breach is **notifiable** if it's reasonable to believe it has caused or is likely to cause serious harm to someone.

**Anyone who suspects a breach must tell [privacy officer] immediately, on [phone], even after hours, and even if they caused it.** We never punish people for reporting mistakes quickly, and we treat hiding a breach seriously.

## 2. The team

| Role | Name | Phone | Backup |
| --- | --- | --- | --- |
| Lead (privacy officer) | | | |
| Decision-maker (CEO or delegate) | | | |
| IT / security | | | |
| Communications | | | |
| Legal adviser | | | |
| Insurer (policy number) | | | |

Useful numbers: National Cyber Security Centre **0800 114 115**. Police **105** (111 in an emergency).

## 3. First hour: contain and preserve

- [ ] Stop the breach continuing: recall the email, disable the account, revoke the link, isolate the device (disconnect it from the network; don't switch it off).
- [ ] Ask anyone who received information by mistake to delete it, and to confirm in writing that they have and haven't shared it.
- [ ] Preserve evidence: logs, emails, screenshots, the device.
- [ ] For a cyber incident: call the NCSC and our insurer before engaging other IT help.
- [ ] Start the incident log: time, action, who.
- [ ] Open an entry in the breach register.

## 4. Within 24 hours: assess

Answer each s 113 factor in writing. Use Faraday's breach assessment record ({{ site.url | replace("https://", "") }}/tools/breach) if helpful.

1. What have we done to reduce the risk of harm?
2. Is the information sensitive?
3. What harm could result, for the most vulnerable person affected?
4. Who has, or may have, the information?
5. Was it protected by a security measure? Is that measure still effective?
6. Anything else relevant?

Also record: how many people are affected, what information about them, when it happened, and when we became aware.

**Decision:** notifiable / not notifiable / not yet known. The decision-maker signs off. If in doubt, we notify.

## 5. Within 72 hours: notify

The Commissioner expects notification within 72 hours of becoming aware. If we don't have all the facts, we notify with what we know and update later.

- [ ] **Privacy Commissioner**, using NotifyUs on privacy.org.nz.
- [ ] **Affected people**, as soon as practicable. If individual notice isn't reasonably practicable, a public notice. Record any reason for delaying or not notifying, including any s 116 exception relied on.
- [ ] **Insurer.**
- [ ] **Board or leadership.**
- [ ] **Police**, if a crime is involved.
- [ ] **Partners or clients** whose information was affected.
- [ ] **Sector regulator**, if relevant: [name].

### Notice to affected people: checklist

Our notice says, in plain language:

- [ ] what happened and when
- [ ] what information about them was involved (specifically)
- [ ] what we've done and are doing
- [ ] what they can do to protect themselves, with specific steps and any support we're offering
- [ ] who to contact with questions
- [ ] that they can complain to the Privacy Commissioner

We don't say "there is no evidence of misuse" unless we've looked for it, and we don't minimise.

## 6. Within 30 days: review

- [ ] What happened and why (the root cause, beyond "human error")?
- [ ] What will we change: process, technology, training, suppliers?
- [ ] Who owns each change, and by when?
- [ ] Update the breach register with the outcome.
- [ ] Report to leadership.

## 7. Testing the plan

Once a year, check the plan still works by talking through one of these scenarios with the people named in it:

- A staff member emails a spreadsheet of client details to the wrong external address at 4.45pm on a Friday.
- Our email provider tells us an attacker accessed a staff mailbox for three weeks.
- Ransomware encrypts our file server, and the attackers say they've copied the data.
- A volunteer's car is broken into and a folder of enrolment forms is taken.
