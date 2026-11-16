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
| `#how-we-work` | Hiring takes more than a job description — four principles, then coverage |
| `#industries` | Experience across industries |
| `#every-size` | A hiring partner for companies of every size |
| `#faq` | Questions, answered |
| `#contact` | Let's talk about your hiring needs |

`#how-we-work` sits ahead of `#industries` on purpose: its closing block names
the functions and industries, so it reads as a hand-off into that section rather
than a repeat of it. The supplied "How we work" copy restated
"AI-assisted screening, human-led hiring" almost word for word, so the older
duplicate was dropped and the newer wording kept; "Hiring shaped by what success
looks like" has no equivalent in the new copy and was folded in here rather than
left stranded in a one-block section.

`src/data/redirects.ts` maps all nineteen URLs from the previous multi-page
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

Roughly 88% neutral, 8% structural dark, 4% colour.

| Token | Value | Job |
| --- | --- | --- |
| `background` / `surface` | `#FBFAF9` / `#FFFFFF` | Warm-white ground and cards |
| `foreground` | `#0C0E12` | 18.5:1 — all primary text |
| `muted` | `#61656E` | 5.6:1 — the floor for body-size text |
| `primary` | `#1F45E0` | 6.75:1 as text, 7.03:1 reversed — the brand cobalt |
| `--gradient-accent` | cobalt → violet, 135° | Primary buttons and the logo, everywhere, unchanged |
| `accent` | `#0F7B6C` | Muted teal, kept for live/ok states only |
| `canvas` | `#101318` | One section — "who we work with" — plus the footer |
| `border` | `#E5E4E1` | Every hairline |

Both gradient stops clear 7:1 against white, so a gradient button is as
readable at its lightest point as at its darkest. Hover darkens
(`brightness-92`) rather than lightening, so contrast only improves on
interaction. `npm run audit` understands gradients: it pulls every colour stop
out of `background-image` and scores text against the worst one.

### The accent family, and why it is multi-colour

There is **no supplied brand logo** in this project. The mark in
`components/Logo.tsx` was drawn here, and its only colour is the cobalt
`#1F45E0`. That cobalt is therefore what the whole palette is anchored on — if
a real logo arrives, re-key `--hue-cobalt` and the family moves with it.

The site is multi-colour **by section, never within one**. Six hues sit on a
single luminance band and sweep from the logo cobalt through the
blue-violet-magenta arc, resolving back to cobalt at the final CTA:

| | Section | Hue | On `background` | Reversed | On `canvas` |
| --- | --- | --- | --- | --- | --- |
| 01 | Services | `--hue-cobalt` `#1F45E0` | 6.75 | 7.03 | 6.75 |
| 02 | How we work | `--hue-indigo` `#4338CA` | 7.58 | 7.90 | 8.24 |
| 03 | Industries | `--hue-violet` `#6D28D9` | 6.82 | 7.10 | 6.84 |
| 04 | Who we work with | `--hue-fuchsia` `#A21CAF` | 6.06 | 6.32 | 7.56 |
| 05 | FAQ | `--hue-rose` `#BE185D` | 5.79 | 6.04 | 10.16 |
| 06 | Contact | `--hue-cobalt` (resolves home) | 6.75 | 7.03 | 6.75 |
| — | *categorical only* | `--hue-sky` `#0369A1` | 5.69 | 5.93 | 9.75 |

Sharing one luminance band is what makes six colours read as a system rather
than as confetti. Every hue clears 5.3:1 as text on the background **and** 4.5:1
reversed, so the same value works as body-size text, as a filled chip and as a
gradient stop — no hue needs a separate "text version".

**How a section gets its hue.** `data/sections.ts` is the single source of
truth for page order, numbering and hue assignment; numbering is derived from
the array's order, so reordering `Home.tsx` cannot leave a section labelled
"03" sitting second. A section passes its entry to `<Section meta={…}>`, which
sets `--sx` / `--sx-soft` / `--sx-line` / `--sx-lift` / `--sx-to` as one inline
style. Everything inside then reads `.text-sx`, `.bg-sx`, `.border-sx-line`,
`.bg-sx-gradient` or `.rule-sx` — no component names a hue.

Defaults live on `:where(section)`, which has zero specificity, so a section's
inline `--sx` always wins while a section that sets nothing (the hero) still
renders in the brand cobalt. On the dark canvas, `Section` substitutes the
`-lift` variants into `--sx` itself rather than overriding in CSS — an inline
style always beats a class rule, so `.on-canvas { --sx: … }` could never win.

**Where colour is per item instead.** Only the seven industries, via
`accentStyle()`. Seven industries are seven categories and telling them apart is
the actual job, so each card is keyed to its own hue (this is what `--hue-sky`
is held back for). The cards stay neutral white — only the dot, the hover border
and the hover ground carry hue, which is what keeps seven colours in one
viewport legible rather than loud.

**What never changes colour.** Primary buttons and the logo stay on the
cobalt→violet brand gradient on every section. The colour that *moves* is
navigational; the colour that *converts* is constant.

### Sections

Each section carries a number, a name, a rule that draws itself in the section
hue as the section arrives, and a coloured tab on its top edge running from its
own hue into the next one's — so scrolling walks the tab through the family and
the boundaries read as a sequence rather than as one continuous scroll.

The nav mirrors this: each item's underline takes its section's hue, and the
mobile drawer is a numbered contents page. Because the drawer prints section
numbers, `nav` and `sectionRegister` must stay in step — "Who we work with" was
missing from the nav and made the drawer count 01, 02, 03, 05, 06, which reads
as a bug. A dev-only warning in `Navbar.tsx` now catches that drift.

Type is **Geist** with **Geist Mono** for labels, self-hosted as two variable
`woff2` files (52 kB, no third-party request). Radius 4→20px. Four layered
shadows. Scroll reveals are one `IntersectionObserver` per element, no animation
library.

Breakpoints `sm 480 · md 768 · lg 1024 · xl 1280 · 2xl 1440`.

---

## Hero motion graphic

`components/viz/HiringStory.tsx` runs a six-beat loop: a role brief appears, an
AI-assisted screening pass sweeps it, two candidate cards enter showing
motivation and interests alongside experience, connectors link role need to
candidate context, a human-review marker arrives last, and the composition
holds before fading and repeating. Roughly 13 seconds end to end.

Colour carries meaning here rather than decoration. The role brief is the brand
cobalt; each candidate is keyed to a different hue of the family, and their
card, avatar, context chip and the connector reaching them all share that one
hue, so which line belongs to whom is readable without a label. The
human-review marker is the only element in plain ink — the person deciding is
not another colour-coded output of the screen.

It deliberately avoids a "perfect match" effect — the connectors draw slowly,
they link context to context rather than producing a score, and the person is
the last element to appear. All role and candidate detail is fictional and the
figure carries an "Illustrative" caption saying so.

Two simplifications, both per the brief:

- **Below `md` it is static.** Looping there reserved the full composition
  height and left a long void while the beats played, and it spends battery on
  the most constrained devices for a graphic that is often scrolled past.
- **Under `prefers-reduced-motion` it renders once in its settled end state.**
  Note that `usePrefersReducedMotion` reads the media query in an effect, so it
  is `false` on first render — the component jumps to the end state in a
  separate effect rather than seeding `useState` from it. Seeding from it left
  reduced-motion visitors looking at the role brief alone, frozen.

---

## Accessibility

`npm run audit` rasterises each computed colour to resolve Tailwind's
`color-mix()` output, composites it against the real painted background and
reports anything under WCAG AA. Passing, including every hue of the accent
family on all three grounds.

It drives Playwright, which needs a browser binary. If the bundled one is
missing — a sandbox with Chromium installed elsewhere, say — point it at the
existing binary rather than downloading a second copy:
`PLAYWRIGHT_CHROMIUM_PATH=/path/to/chromium npm run audit`.

Also verified: skip link first in tab order, visible focus throughout, anchor
nav with `aria-current`, FAQ accordion operable by keyboard with arrow-key tab
switching, scroll lock on the mobile drawer, labelled form fields with inline
errors, every tap target ≥44px at 390px, and all reveals rendered immediately
under `prefers-reduced-motion`.
