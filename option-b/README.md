# KiVitronics — Option B

An independent creative direction for the KiVitronics Consulting website, built
from scratch. It shares no layout, component structure, CSS, section ordering or
interaction pattern with the current site or with Option A — it is a separate
proposal, not an iteration.

**Live build:** `/option-b/` → https://barrykhr.github.io/option-b/

---

## The idea

> **Talent, in motion.**

The homepage is one continuous track rather than a stack of sections. A hairline
rail runs down the left edge of the whole page, chapters hang off it, and talent
moves along it — scattered, matched, qualified, engaged, joined. The business is
meant to be understood by scrolling it, not by reading about it.

Every animation carries a specific meaning. Nothing moves for decoration:

| Section | What moves | What it says |
|---|---|---|
| Hero | Twelve talent tiles converge on an open mandate | Talent → match |
| Proof | Four numbers count once, rules draw in | Delivery, stated plainly |
| The gap | Units leave the track between stages | Hiring leaks after the shortlist |
| The model | The page pins; nine stages travel past a fixed playhead | Scrolling *is* the journey |
| Qualification | One profile is scanned across five dimensions in turn | Fit is assessed, not assumed |
| Candidate journey | A single stroke is drawn to day one | The line never breaks |
| Solutions | The tile field re-forms per offering | One engine, five configurations |
| Clients | 25 marks appear, 15 fill | The second mandate |
| Direction | Planes assemble behind the statement | A system taking shape, not shipped |
| Close | The unit arrives at "Join" | The track terminates where it promised |

Copy is roughly half the length of the current site: one headline, one
supporting line, one action per section, and each idea stated exactly once.

---

## Architecture

Zero dependencies, zero install. A small Node build renders static HTML from a
single content module and a set of component functions:

```
option-b/
├── build.js                  # node build.js  →  index.html + assets/
├── index.html                # generated — do not edit
├── assets/                   # generated — site.css, site.js, favicon.svg, og.png
├── src/
│   ├── content.js            # ← all copy, metrics and FAQ live here
│   ├── layout.js             # document shell: meta, Open Graph, JSON-LD
│   ├── page.js               # section order
│   ├── components/ui.js      # section, headline, lede, metric, button, placeholder
│   ├── sections/*.js         # one module per section, each a pure function
│   ├── styles/*.css          # 01 tokens → 17 responsive, concatenated in order
│   ├── scripts/*.js          # 01 motion core → 99 boot, concatenated in order
│   ├── favicon.svg
│   └── og.html               # source for the Open Graph image
└── tools/                    # og.mjs (render OG image), shoot.mjs, audit.mjs
```

```bash
node option-b/build.js        # rebuild the page
node option-b/tools/og.mjs    # re-render assets/og.png (needs network for fonts)
node option-b/tools/audit.mjs # semantics, keyboard, reduced-motion, no-JS checks
```

Content is fully separated from presentation: to change any wording, metric or
FAQ answer, edit `src/content.js` and rebuild. No copy is hard-coded in a
section module.

---

## Design system

**Colour** — warm paper `#F4F2EE`, ink `#101113`, one electric cobalt `#1B3BFF`
used only to mean *matched / moving*, and a single restrained mint `#0E9E82`
reserved for one meaning: *joined*. Dark panels (`#0B0C0E`) mark the three
moments that carry weight — the model, the candidate journey, and the close.

**Type** — Manrope for everything editorial, IBM Plex Mono for stage labels,
metrics captions and system microcopy. Display sizes are fluid `clamp()` values;
measures are set in `ch` **on the headline itself** so they scale with the
display size rather than with body text.

**Motion** — one rAF loop, one read pass, one write pass. Sections register a
scrub and receive a 0→1 progress value as the CSS custom property `--p`; every
animation is expressed against that single variable, so the work stays on the
compositor (`transform` and `opacity` only). A full-page scroll runs at 60fps
with no long frames.

---

## Accessibility and resilience

- One `<h1>`, ordered headings, `header`/`nav`/`main`/`footer` landmarks
- Skip link, visible focus rings, full keyboard operation
- FAQ tabs follow the ARIA tabs pattern including arrow, Home and End keys
- Accordions are real buttons with `aria-expanded` and labelled regions
- `prefers-reduced-motion` pins every scrubbed value to its end state: the model
  becomes a readable vertical list, numbers show their final value, nothing is
  hidden behind an animation
- Without JavaScript the page still renders completely — the hero scatter has a
  CSS-only fallback and all FAQ answers are in the DOM
- No images, so nothing to lazy-load: ~25 kB gzipped in total

---

## Unverified content — read before launch

Nothing on this page is invented. Where a fact was not verifiable it renders as
a **visible dashed placeholder** marked `to confirm`, so it cannot be mistaken
for approved copy. There are currently **9** on the page:

| Placeholder | Needed from KiVitronics |
|---|---|
| Approved client logos | Which client names may be shown publicly |
| Turnaround commitment | Whether a response time can be stated |
| Commercial terms | Fee structure |
| Replacement terms | What happens if a hire does not work out |
| Candidate fee policy | Whether candidates are ever charged |
| Application route | Careers page or inbox for applications |
| Data and consent policy | How candidate information is handled |
| Verified contact address | Public email address |
| Legal / entity details | Registered entity, privacy policy, terms |

The contact form is deliberately **not wired to an endpoint**. It validates, and
then says so. Set `contact.formEndpoint` in `src/content.js` to a verified URL
and the form will post there.

Also outstanding, per the master sheet: confirm the 136 / 72% / 91% / 60%
figures and the period they cover, the 25 / 15 / 65+ relationship figures, and
whether the 500,000+ talent-network figure is still current — it is deliberately
**not** used anywhere on this page.

Metrics used, all from the verified master sheet: 136 roles closed, 72% mandate
closure, 91% offer-to-joining, 60% repeat clients, 25 companies served, 15
clients with more than one mandate, 65+ hires across the three deepest
relationships.

---

## Notes on the brief

- **Navigation** was mapped 1:1 to real sections — Proof, How we work, Solutions,
  Clients, FAQ — rather than the suggested Work / About, which had no destination
  that verified content could fill. The company-direction section still exists at
  `#about`.
- **The hero headline** was chosen against "Build better teams." and "Better
  talent. Better outcomes." *Talent, in motion.* names the mechanism instead of
  the category, and it is the only one of the three the page can demonstrate
  rather than assert.
- **The gap visual** shows generic funnel leakage. It carries no numbers on
  purpose: attaching figures to it would invent a metric.
- **`assets/og.png`** was rendered in this environment without network access, so
  it fell back to a system grotesque. Re-run `node option-b/tools/og.mjs` with
  network access to regenerate it in Manrope.
