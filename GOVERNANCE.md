# Editorial standards and governance

These are the rules for what Faraday publishes and how it stays accurate. They apply to maintainers and contributors alike.

## 1. Accuracy

**Primary sources first.** Legal claims cite legislation, a code of practice, the Privacy Commissioner, a court or tribunal, or the agency that runs the register or service. News coverage is acceptable for bills and events, labelled as such.

**Every source is registered.** Add sources to `src/_data/sourcesRegistry.json` with an id, title, publisher, URL, the date you checked it, and a status. Use `verified` only if you opened the source yourself and confirmed it supports the claim. Otherwise use `to-verify`.

**Every page shows its check date.** Guides and templates carry a `checked` date in front matter. Update it only when you've rechecked the page's claims against its sources.

**Review cadence.**

| What | How often | Who |
| --- | --- | --- |
| Source registry staleness | Automatic, every build | CI |
| Link check | Weekly | CI |
| `to-verify` sources | Before each release | Maintainer |
| Organisation guides | Every 6 months, and on any law change | Maintainer plus a privacy lawyer where possible |
| Help page and safety guides | Every 6 months | Maintainer |
| Phone numbers and contact details | Every 3 months | Maintainer |
| Matariki table in `nzdates.js` | Before it runs out (currently loaded to 2032) | Maintainer |

**Law changes.** When a relevant law, code or regulation changes: update affected pages, update the home page timeline, add a changelog entry, and consider a blog post explaining the change.

**Corrections.** Fix errors promptly. Record material corrections in `CHANGELOG.md` with the date and what changed.

## 2. Dual-use review

Some privacy knowledge can protect someone or harm them. Knowing which public registers show home addresses helps a survivor hide, and could help an abuser search.

Before publishing anything about finding information on people:

1. **Write from the defender's side.** Describe what a source reveals about *you*, how to check *yourself*, and how to reduce it.
2. **Don't publish techniques for locating or tracking a particular person**, combining sources to build a profile of someone else, or defeating someone's privacy protections.
3. **Lead with the remedy.** Every exposure described must come with what the reader can do about it.
4. **Mention only what's already widely known** and necessary for the reader to protect themselves.
5. **Get a second reviewer** for any new item in the exposure audit or any new safety guide.

## 3. Writing

- Plain New Zealand English. Short sentences. Explain legal terms when first used.
- No padding or marketing language. The prose linter enforces a banned-phrase list; it's a floor, not the standard.
- Address one reader. Use "you".
- Te reo Māori words are used naturally where they're the normal word in New Zealand English (whānau, tamariki, iwi), with macrons.
- Say plainly when a professional is needed.

## 4. Neutrality on contested politics

On political questions, such as bills before Parliament, we set out what's proposed and the main arguments on each side, then focus on practical privacy questions. We don't tell readers how to vote or which side to take.

## 5. Independence

Faraday doesn't accept payment for mentions, links or recommendations. We name products only where needed for practical instructions (for example, settings on a particular phone), and we don't use affiliate links.

## 6. Privacy of this project

The site has no analytics, cookies, third-party fonts or third-party scripts, and the content security policy enforces that. Any proposal to add tracking of any kind will be declined.

## 7. Search engines and AI assistants

The content is CC BY 4.0 and exists to be found. `src/robots.njk` allows search engines, AI search crawlers, assistant fetchers and AI training crawlers. The reasoning: people increasingly ask AI assistants about their rights, and accurate New Zealand information in those systems helps them. If that changes (for example, a crawler that ignores licence attribution or overloads the site), change the policy here first, then the file.

We don't publish thin pages to chase keywords. A new answer page needs a real question people ask, a primary source, and something the existing pages don't already cover.

## 8. Decisions

Faraday's founder, Jacques Cantin, has the final say on what's published. Anyone can propose a change, and other maintainers can review it, but nothing is merged into `main` (and so nothing reaches faraday.co.nz) without his approval. This is enforced by `.github/CODEOWNERS` and the branch protection rules on `main`.

Within that, changes are judged against these standards. Disagreements about accuracy are settled by the primary source. If the source is genuinely ambiguous, the page says so.
