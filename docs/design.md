# Design system

The site is one framed column. Hairline rules mark the frame edges and every section boundary, with a small cross where they meet. The idea comes from the name: a Faraday cage is a mesh that controls what gets in and out, so the structure is drawn on the page rather than hidden.

All styles live in `src/assets/css/site.css`. There is no CSS framework and no build step for styles.

## Type

| Face | Role | Licence |
| --- | --- | --- |
| Geist | Reading text and headings | SIL OFL |
| Geist Mono | Data: dates, counts, citations, breadcrumbs, the deadline panel, table headers | SIL OFL |
| Syne ExtraBold | The FARADAY wordmark only | SIL OFL |

All three are self-hosted from `src/assets/fonts/`. Nothing loads from a font service, and none of them costs anything to use, embed or modify.

Mono is for facts a reader might scan or compare, not decoration. If a label doesn't carry information, leave it out.

The scale is a major third (1.25) from a 17px body, set as `--fs-xs` to `--fs-5`. Headings use weight 500 to 520 with tight negative tracking; the bigger the size, the tighter the tracking.

## Colour

| Token | Dark (default) | Light | Use |
| --- | --- | --- | --- |
| `--bg` | `#0c1214` | `#f1f3f1` | Page |
| `--bg-2` | `#10181b` | `#ffffff` | Panels, hover |
| `--line` | `#1f2c31` | `#d8dedb` | Hairlines |
| `--ink` | `#e9eeec` | `#0e1517` | Headings, strong text |
| `--ink-2` | `#b6c1bf` | `#34413e` | Reading text |
| `--muted` | `#84928f` | `#5a6866` | Secondary text |
| `--accent` | `#7fd0b0` | `#11664f` | Pounamu: links, focus, current item |
| `--urgent` | `#ff8b7b` | `#b0261b` | Urgent help only |

Red means "get help now". Don't use it for anything else.

## Components

- **Band** (`.band`): a full-width section inside the frame. Each one draws the rule above it.
- **Split** (`.split`): a heading column on the left (sticky on wide screens) and content on the right.
- **Rows** (`.rows`): a list of links separated by hairlines. Variants put a date first (`meta-first`), a tag last (`meta-last`) or a description beside the title (`split-rows`).
- **Cells** (`.cells`): a grid of linked boxes that share their borders.
- **Facts** (`.facts`): the label and value pairs under a page title.
- **Panel**: the short answer box, the home page deadline panel and the contents box. These get a 10px radius; controls get 6px; structural boxes are square.

## Layout and screen sizes

- The frame is 80rem wide at most. Its side rules appear from 768px.
- The inline navigation shows from 1120px. Below that, a menu button opens a full-screen panel. Without JavaScript, the links sit in a row under the wordmark instead.
- "Get help now" stays in the header at every width. It shortens to "Get help" below 480px and "Help" below 360px.
- Wide tables scroll inside their own box.

Before merging a layout change, load the home page, a guide, an answer, a tool and a template at 320, 390, 768, 1024, 1120 and 1440 pixels wide, and check nothing spills sideways and the menu opens and closes with the keyboard.

## Motion

There are no animations that run on their own. Hover and open/close transitions are short, only answer something the reader did, and are switched off when the reader has asked their system to reduce motion.
