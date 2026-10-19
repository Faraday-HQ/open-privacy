---
layout: layouts/page.njk
title: Accessibility
description: How we've built this site to work for as many people as possible, and how to tell us when it doesn't.
permalink: /accessibility/
---

People looking for privacy and safety help may be stressed, in a hurry, on an old phone, using a screen reader, or reading in their second language. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.

## What we've done

- **Typefaces:** Geist Mono for headings, navigation and tools, and its sibling Geist Sans for long reading, so guides stay comfortable to read. Both are stored on this site, so no font service sees your visit.
- **Plain language:** short sentences, common words, and legal terms explained when they're used.
- **Contrast and themes:** the site is dark by default, with a light mode button in the header that this browser remembers. Text is designed to meet AA contrast in both. Without JavaScript, the site stays in dark mode.
- **Keyboard:** everything works without a mouse, with a visible focus outline and a skip link.
- **No motion by default** beyond small progress bars, and none if you've asked your device to reduce motion.
- **Works without JavaScript** for all guides, templates and the help page. The interactive tools need JavaScript.
- **Light pages:** no trackers or third-party code, so pages load quickly on slow connections.
- **Print:** pages print cleanly, with link addresses shown.

## Known gaps

- Content is in English only. We'd welcome help translating the help page and key guides into te reo Māori and Pacific languages.
- The interactive tools haven't yet been tested with every screen reader.

## Tell us

If something doesn't work for you, email {{ site.email }} or [open an issue]({{ site.repo }}/issues). Tell us the page, what you were trying to do, and the device or assistive technology you use.
