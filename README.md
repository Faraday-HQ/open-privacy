# Faraday privacy commons

Free, open privacy, online safety and data governance resources for Aotearoa New Zealand. This repository is the source for [faraday.co.nz](https://faraday.co.nz): the website, the blog, the tools and the templates.

Faraday is a privacy company founded in Auckland. We've published what we know, so that people and organisations can protect themselves without paying for basics that should be open.

## What's in it

| | |
| --- | --- |
| **Guides for people** (`src/guides/people/`) | Threat modelling, account security, scams, online harassment and the HDCA, intimate image abuse, technology-facilitated abuse, identity theft and credit suppression, Privacy Act rights, public registers, higher-risk roles |
| **Guides for organisations** (`src/guides/organisations/`) | The Privacy Act in plain language, a 90-day programme, breach response, IPP 3A, the Biometric Processing Privacy Code, access requests, suppliers and overseas disclosure, CCTV and monitoring, AI, Māori data, data governance, community groups |
| **Tools** (`src/tools/`, `src/assets/js/`) | Statutory deadline calculator, request letter builder, breach assessment record, IPP 3A check, personal exposure audit, privacy self-check (Poupou Matatapu), urgent help page |
| **Templates** (`src/templates/`, `src/downloads/`) | Privacy statement, collection notices, PIA, breach plan and register, inventory, retention schedule, request procedure and log, supplier questionnaire, privacy officer role, board report, staff privacy essentials checklist, CCTV policy, AI policy, biometric worksheet, digital safety plan |
| **Blog** (`src/blog/`) | Launch post and timely explainers: the unpublished roll before the election, rates suppression, director addresses, Manage My Health, IPP 3A, biometrics, free versus paid |

Every tool runs in the browser. Nothing is sent anywhere. The site has no analytics, cookies or third-party requests.

## How accuracy is maintained

- **Source registry.** `src/_data/sourcesRegistry.json` lists every primary source with the date it was last checked and a status (`verified` or `to-verify`). Pages cite sources by id in their front matter; the build fails on an unknown id.
- **Staleness check.** `npm run check:sources` fails if any source hasn't been checked in 15 months, and lists `to-verify` sources for a maintainer to open by hand.
- **Tested legal logic.** `tests/` covers the working-day calculation (Privacy Act s 7) and the breach assessment scenarios. Every expected deadline is worked by hand in a comment.
- **Continuous integration.** `.github/workflows/ci.yml` runs all checks on every pull request, plus an external link check you can run on demand.

## Search and AI visibility

The site is built to be found and cited: answer-first pages for real New Zealand questions, structured data, a sitemap, social cards, a robots policy that welcomes search and AI crawlers, `llms.txt`, and IndexNow pings on deploy. Performance is measured through Google Search Console and Bing Webmaster Tools, never with visitor tracking.

## Running locally

Requires Node.js 20 or later.

```sh
npm install
npm start          # preview at http://localhost:8080
npm test           # unit tests
npm run check      # tests, prose lint, source check, build
```

## Licences

- Content (guides, templates, blog posts, data): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Code (scripts, styles, configuration): MIT.
- Typefaces: Geist, Geist Mono (Vercel) and Syne (Bonjour Monde), all SIL Open Font License (`src/assets/fonts/OFL.txt`). Free to use, embed and modify. See [docs/design.md](docs/design.md) for the design system.

See [LICENSE.md](LICENSE.md).

## Not legal advice

This is general information about New Zealand law and practice. It isn't legal advice for your situation. If you're in danger, call 111.
