# Kivitronics Consulting — website

One page. React + TypeScript + Tailwind CSS v4, built with Vite. The production
build is committed to `../kivitronics/` so GitHub Pages serves it from this repo.

---

## Running it

```bash
npm install
npm run dev           # http://localhost:5173/kivitronics/
npm run build         # → ../kivitronics/
npm run preview       # serve the build
npm run typecheck
```

Three scripts need a Chromium binary — they use `PLAYWRIGHT_CHROMIUM_PATH`, or
fall back to Playwright's own download (`npx playwright install chromium`):

```bash
npm run audit         # contrast + labelling + heading audit
npm run og            # regenerates public/og-image.png
npm run preview:file  # bundles the whole site into one shareable HTML file
```

---

## Before it goes live

**All three contact channels are unset.** They live together in
`src/data/content.ts` → `contactChannels`:

| Field | Powers | State |
| --- | --- | --- |
| `bookingUrl` | "Book a discovery call" | `null` |
| `email` | "Email us", footer address | `null` |
| `briefFormEndpoint` | "Share a hiring brief" form | `null` |

While a channel is null its button still renders and still works — pressing it
explains that the link isn't set up and points at the brief form. It is
deliberately not `aria-disabled`: the control does respond, so marking it
disabled would hide a working button from assistive tech. Fill the three fields
in and every CTA on the site goes live with no other change.

**Thirteen FAQ answers need sign-off.** See below.

---

## Content rule

`src/data/content.ts` holds every string the site renders, and the body copy is
the client-supplied text reproduced verbatim. The rule the file states and the
code follows: **if a claim is not in the supplied copy, it does not go on the
site.**

That is why there are no delivery figures, no named service lines, no
qualification framework and no geographic specifics beyond "around the world" —
the supplied copy contains none of them, and the previous version of this site
(which was built on all four) was removed rather than merged.

---

## Architecture

A single route. Navigation is native anchors, with an `IntersectionObserver`
highlighting the section currently in view.

| Anchor | Section |
| --- | --- |
| `#what-we-do` | Recruitment for the roles that move your business forward |
| `#industries` | Experience across industries |
| `#approach` | AI-assisted screening · Hiring shaped by what success looks like |
| `#every-size` | A hiring partner for companies of every size |
| `#faq` | Questions, answered |
| `#contact` | Let's talk about your hiring needs |

`src/data/redirects.ts` maps all eighteen URLs from the previous multi-page
architecture onto the nearest equivalent anchor, so nothing already indexed or
linked returns a 404. Any other path resolves to the top of the page.

---

## FAQ

Twenty questions across two tabs, in `sections/Faq.tsx` with content in
`data/faqs.ts`. Both tabpanels stay in the DOM (the inactive one carries
`hidden`) and collapsed answers stay in the DOM too, so all twenty are
crawlable. Collapsed answers carry `inert` — not focusable, not announced.

No `FAQPage` schema: Google restricted FAQ rich results to government and health
sites in 2023, so it would produce nothing here.

### Thirteen answers need business sign-off

`needsConfirmation: true` flags each one, and `faqsNeedingConfirmation` exports
the list so it can be audited from code.

**Clients (5)** — timeline to shortlist, fee structure, what happens if a hire
doesn't work out, confidential and hard-to-fill searches.

**Candidates (8)** — nearly the whole tab. The supplied copy is entirely
client-facing: it says nothing about how candidates apply, how their data is
handled, what support they receive during a process, or whether they are ever
charged. Those eight answers currently commit to nothing and offer to answer
directly instead. **This tab needs candidate-side copy before launch.**

---

## Design system

Roughly 90% neutral, 8% structural dark, 2% colour.

| Token | Value | Job |
| --- | --- | --- |
| `background` / `surface` | `#FBFAF9` / `#FFFFFF` | Warm-white ground and cards |
| `foreground` | `#0C0E12` | 18.5:1 — all primary text |
| `muted` | `#61656E` | 5.6:1 — the floor for body-size text |
| `primary` | `#1F45E0` | 6.75:1 as text, 7.03:1 reversed |
| `accent` | `#0F7B6C` | Muted teal, used sparingly |
| `canvas` | `#101318` | One section — "every size" — plus the footer |
| `border` | `#E5E4E1` | Every hairline |

Type is **Geist** with **Geist Mono** for labels, self-hosted as two variable
`woff2` files (52 kB, no third-party request). Radius 4→20px. Four layered
shadows. Scroll reveals are one `IntersectionObserver` per element, no animation
library.

Breakpoints `sm 480 · md 768 · lg 1024 · xl 1280 · 2xl 1440`.

---

## Accessibility

`npm run audit` rasterises each computed colour to resolve Tailwind's
`color-mix()` output, composites it against the real painted background and
reports anything under WCAG AA. Passing.

Also verified: skip link first in tab order, visible focus throughout, anchor
nav with `aria-current`, FAQ accordion operable by keyboard with arrow-key tab
switching, scroll lock on the mobile drawer, labelled form fields with inline
errors, every tap target ≥44px at 390px, and all reveals rendered immediately
under `prefers-reduced-motion`.
