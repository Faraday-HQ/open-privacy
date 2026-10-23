---
layout: layouts/page.njk
title: Contribute
description: This is an open commons. Corrections, reviews, translations are all welcome.
permalink: /contribute/
---

Everything on this site lives in a public repository. Content is CC BY 4.0 and code is MIT, so you can reuse it, and you can help improve it. Every suggested change is reviewed before it's published, and Faraday has the final say on what goes live.

## Ways to help

- **Report an error.** Every page has a "tell us" link at the bottom. Include what's wrong and a source if you have one.
- **Translate.** The help page and the people guides would do the most good in te reo Māori, Samoan, Tongan, Hindi and Chinese.
- **Test the tools.** Try to break them. Check the deadline calculator against your own calculations.

## Standards

Before contributing, read [CONTRIBUTING.md]({{ site.repo }}/blob/main/CONTRIBUTING.md) and [GOVERNANCE.md]({{ site.repo }}/blob/main/GOVERNANCE.md). In short:

- Cite primary sources and add them to the source registry with the date you checked them.
- Write plain New Zealand English. The build runs a prose linter that rejects padded phrases and US spellings.
- Write from the defender's side. We don't publish techniques for finding or tracking a particular person.
- Say when something needs a professional.

## Running it locally

You need Node.js 20 or later.

```
npm install
npm start        # local preview at http://localhost:8080
npm run check    # tests, prose lint, source check and build
```
