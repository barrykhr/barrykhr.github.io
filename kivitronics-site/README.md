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

Built from the actual logo: a cyan kingfisher between KIVI and TRONICS. Four
colours do all the work — cream ground, navy structure and ink, the logo cyan,
coral. Roughly 86% neutral, 10% navy, 4% colour.

| Token | Value | Job |
| --- | --- | --- |
| `background` | `#FAF6EE` | The cream ground |
| `surface` | `#FFFFFF` | Cards |
| `foreground` | `#0B2545` | The brand navy — 14.3:1, all primary text |
| `muted` | `#556073` | 5.9:1 — the floor for body-size text |
| `--color-logo` | `#00B7FF` | The bird's exact colour. The mark, and navy grounds. |
| `primary` | `#04688F` | The same blue at text weight — 5.8:1 on cream |
| `--color-blue` | `#1B5293` | The navy at accent weight — 7.3:1 |
| `--color-coral` | `#BC4A30` | 4.7:1 on cream |
| `--color-coral-display` | `#FF6B57` | True coral — navy grounds only |
| `canvas` | `#0B2545` | The navy section and the footer |
| `border` | `#E7DFD0` | Warm hairlines, so lines sit *in* the cream |

### The one constraint everything else follows

The logo cyan is gorgeous and almost unusable on light:

| `#00B7FF` as text on… | Contrast |
| --- | --- |
| cream `#FAF6EE` | **2.11:1** |
| white | **2.28:1** |
| navy `#0B2545` | **6.75:1** |

So `#00B7FF` is never small text or a hairline on a light ground. It is the
mark, and it is what the navy section is for — which is exactly why navy is the
logo's partner colour rather than a decorative preference. On light grounds the
same blue appears deepened to `--color-primary` (`#04688F`), which clears 5.8:1.

This is also why primary buttons are the navy→blue gradient rather than cyan:
cream clears 14.3:1 on the dark stop and 7.3:1 on the light one, so the button
is readable at its weakest point.

### The accent family, and why it is multi-colour

The site is multi-colour **by section, never within one**. Three hues, all of
them brand colours:

| | Section | Hue | On cream | Reversed | On navy |
| --- | --- | --- | --- | --- | --- |
| 01 | Services | cyan `#04688F` | 5.76 | 6.21 | — |
| 02 | How we work | blue `#1B5293` | 7.28 | 7.85 | — |
| 03 | Industries | coral `#BC4A30` | 4.68 | 5.05 | — |
| 04 | Who we work with | **`#00B7FF`** on navy | — | — | 6.75 |
| 05 | FAQ | coral `#BC4A30` | 4.68 | 5.05 | — |
| 06 | Contact | cyan `#04688F` | 5.76 | 6.21 | — |

Section 04 is the payoff: on the navy ground `cyan` resolves to its `-lift`
value, which is `#00B7FF` — the logo colour at full strength. That is the only
place on the site it appears outside the mark, because it is the only ground it
is legible on.

**How a section gets its hue.** `data/sections.ts` is the single source of truth
for page order, numbering and hue; numbering is derived from the array's order,
so reordering `Home.tsx` cannot leave a section labelled "03" sitting second. A
section passes its entry to `<Section meta={…}>`, which sets `--sx` /
`--sx-soft` / `--sx-line` / `--sx-lift` / `--sx-to` as one inline style.
Everything inside reads `.text-sx`, `.bg-sx`, `.border-sx-line`,
`.bg-sx-gradient` or `.rule-sx` — no component names a hue.

Defaults sit on `:where(section)` at zero specificity, so a section's inline
`--sx` always wins while a section that sets nothing (the hero) still renders in
the brand blue. On navy, `Section` substitutes the `-lift` variants into `--sx`
itself rather than overriding in CSS — an inline style would always beat a
`.on-canvas` class rule.

**Gradients are for hairlines, not fills.** A section's gradient runs into the
*next* section's hue, which is what makes colour travel down the page. But blue
into coral passes through a muddy brown at its midpoint: invisible across a 1px
spine or a 2px section tab, very visible filling a 40px circle. Filled shapes
take the flat `--sx`.

**Where colour is per item.** Only the seven industries, via `accentStyle()`,
and only cyan and coral — `blue` is in the family but at dot size it is
indistinguishable from `cyan`, so a three-hue rotation read as a two-hue one
with a mistake in it.

**What never changes colour.** Primary buttons stay navy everywhere. The colour
that moves is navigational; the colour that converts is constant.

### Sections

Each section carries a number, a name, a rule that draws itself in the section
hue as the section arrives, and a coloured tab on its top edge running from its
own hue into the next one's. The nav mirrors this: each item's underline takes
its section's hue, and the mobile drawer is a numbered contents page. Because
the drawer prints section numbers, `nav` and `sectionRegister` must stay in
step — a dev-only warning in `Navbar.tsx` catches drift.

---

## The logo

`src/assets/logo.png` and `logo-on-navy.png`, rendered by
`components/Logo.tsx`. Two files rather than one recoloured with a CSS filter,
because the lockup is two-tone: the wordmark flips to cream on navy while the
bird keeps its exact `#00B7FF`, and a filter that lightened the text would drag
the cyan with it.

They are imported rather than read from `/public` — the site is served under a
base path, and Vite rewrites asset URLs it can see through an import but not
string literals inside components. Both are under the 4 kB inline threshold, so
they also become data URIs: no extra request, and the single-file preview build
needs no special-casing.

**It is a bitmap, and that is the one soft spot.** The supplied artwork is a
357×140 PNG. It is rendered at 40px tall — set by the wordmark, not the bird,
since at 34px the letters fell to ~10px and the lockup read as a smudge — which
leaves ~3.5x headroom and stays sharp at 2x and 3x. **Ask the client for the
original vector (AI, EPS or SVG).** Dropping it in means replacing those two
files with SVGs; nothing else changes.

The favicon (`public/favicon.png`, 512×512) is the bird alone, cyan on navy. It
reads clearly from 32px up; at 16px it reduces to a blob, which is inherent to a
mark this slender and would need a simplified variant from the client to fix.

Typography is unchanged: **Geist** with **Geist Mono** for labels, self-hosted
as two variable `woff2` files (52 kB, no third-party request).

---

## Social card

`npm run og` renders `public/og-image.png` from `scripts/og-image.html`.

**Every string on that card must come from `src/data/content.ts.`** An earlier
version carried headline figures ("136 roles closed", "91% offer to joining",
"500K+ talent network"), a geography line and service-line labels that were
never supplied. They had been removed from the site but survived in this
template — the worst place to survive, since this image is what LinkedIn, Slack
and WhatsApp render when the site is shared, so the invented numbers travelled
further than the page ever did. The card now shows the logo, the tagline
verbatim, and nothing else.

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
