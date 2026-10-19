# Contributing

Thank you for helping. This is a public commons for Aotearoa, and it gets better with more expert eyes on it.

Read [GOVERNANCE.md](GOVERNANCE.md) first. It sets out the accuracy, dual-use and writing standards every change must meet.

Every change is reviewed before it's published, and Faraday has the final say on what's merged.

## Quick fixes

Typos, broken links and outdated phone numbers: open a pull request directly, or use the "edit this page" link at the bottom of any page.

## Corrections to legal content

Open an issue using the **Correction** template. Include the page, what's wrong, and the primary source that shows it. If you're a lawyer or practitioner, say so; it helps us prioritise.

## Changing tool logic

Legal logic lives in `src/assets/js/lib/` and must have tests in `tests/`. Write expected results with the reasoning in a comment, so a reviewer can check them by hand. Tools must not make network requests; the content security policy will block them anyway.

## Pull request checklist

- [ ] `npm run check` passes
- [ ] Sources added or updated in the registry with today's date
- [ ] `checked` date updated on pages whose claims you rechecked
- [ ] Dual-use review done for any exposure or safety content
- [ ] `CHANGELOG.md` updated for material changes
