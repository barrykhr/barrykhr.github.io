# KiVitronics Consulting — website

Source for the KiVitronics site — an enterprise talent-infrastructure product
site. React + TypeScript + Tailwind CSS v4, built with Vite. The production build
is committed to `../kivitronics/` so GitHub Pages can serve it from this repo.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:5173/kivitronics/
npm run build      # → ../kivitronics/
npm run preview    # serve the build
npm run typecheck
```

Three extra scripts need a Chromium binary. They pick one up from
`PLAYWRIGHT_CHROMIUM_PATH`, or fall back to Playwright's own download
(`npx playwright install chromium`):

```bash
npm run audit         # contrast + labelling + heading audit across every route
npm run og            # regenerates public/og-image.png from scripts/og-image.html
npm run preview:file  # bundles the whole site into one shareable HTML file
```

`preview:file` writes `preview/kivitronics-preview.html` — every page, CSS and JS
inlined, fonts embedded, hash-routed so it works with no server at all. Useful for
sending the site to someone before it is deployed anywhere.

---

## Before it goes live

Two things are deliberately left unset rather than filled with placeholders.

**1. Where the enquiry form posts.**
`src/components/MandateForm.tsx` → `FORM_ENDPOINT`. Point it at anything that
accepts a JSON `POST` (Formspree, Basin, a serverless function, your own API).
Until it is set the form validates normally and then says plainly that delivery
is not connected — it never silently drops an enquiry.

**2. Contact channels.**
`src/data/site.ts` → `contact`. `email`, `phone` and `linkedin` are `null`; the
header, footer and contact page skip null values instead of rendering a fake
address. Fill them in and they appear everywhere at once.

---

## Deploying

`vite.config.ts` reads the base path from the `BASE` environment variable.

| Where it is served | Command |
| --- | --- |
| `barrykhr.github.io/kivitronics/` (default) | `npm run build` |
| Root of a custom domain, e.g. `kivitronicsconsulting.com` | `BASE=/ npm run build` |

The build also emits `404.html` and `.nojekyll`. `404.html` stashes the
requested deep link in the query string and hands back to `index.html`, where a
small decoder in the page head restores it — without that, a static host returns
a hard 404 for every route except the site root. `scripts/postbuild.mjs` derives
the path depth from `BASE`, so switching base paths needs no other change.

If you move the site to its own repository or domain, also update `brand.url` in
`src/data/site.ts` (it drives canonical URLs, OpenGraph tags and JSON-LD) and the
`<loc>` entries in `public/sitemap.xml`.

---

## Structure

```
src/
  data/          all copy, metrics and structures — the site's source of truth
  components/    primitives, chrome, form, and viz/ for the charts and diagrams
  sections/      one section per idea — each lives on exactly one page
  pages/         routes, composed from sections
  lib/           hooks (in-view, count-up, scroll lock) and structured data
  styles/        design tokens (@theme), base layer, motion, self-hosted fonts
scripts/         post-build, a11y audit, OpenGraph image generator
```

Content lives in `src/data` and presentation in `src/sections`. Changing a
metric, a stage description or a roadmap item is a one-line edit in `data/`, and
every place it appears updates together.

### Architecture

| Route | Owns |
| --- | --- |
| `/` | Hero (Talent OS) · trust bar · problem · solutions · how it works · scale · coverage · why us · proof · about · **FAQ** · CTA |
| `/solutions` | The five service lines, with outcomes |
| `/solutions/:slug` | One template, five pages, driven entirely by `data/solutions.ts` |
| `/industries` | The IT and non-IT role families we hire across |
| `/how-we-work` | Nine stages · five qualification dimensions · eight touchpoints · preparation · the record |
| `/about` | The firm, the four commitments, the record |
| `/insights` | Editorial structure, honest empty state |
| `/contact` | Five-field enquiry form |
| `/careers` | Working here — no invented openings |
| `/for-talent` | The candidate side |

Old URLs are preserved. `src/data/redirects.ts` maps every previous route
(`/what-we-do`, `/proof`, `/start-a-mandate`) onto its new home; each renders a
`Navigate replace`, so nothing already indexed or linked breaks.

Sections live on exactly one page. Before adding one to a second page, move it
instead — duplication is what turns a site back into one long scroll with a menu.

---

## Design system

Roughly 90% neutral, 8% structural dark, 2% colour. The restraint is the point.

| Token | Value | Job |
| --- | --- | --- |
| `background` / `surface` | `#FBFAF9` / `#FFFFFF` | The warm-white ground and cards |
| `foreground` | `#0C0E12` | 18.5:1 — all primary text |
| `muted` | `#61656E` | 5.6:1 — the floor for body-size text |
| `primary` | `#1F45E0` | 6.75:1 as text, 7.03:1 reversed — CTAs, links, active state, data marks |
| `accent` | `#0F7B6C` | Muted teal, used sparingly for confirmation and the second market |
| `canvas` | `#101318` | Two sections only — Scale and the closing CTA |
| `border` | `#E5E4E1` | Every hairline |

Type is **Geist** with **Geist Mono** for labels, metrics and technical
annotation — self-hosted as two variable `woff2` files (52 kB, no third-party
request). The mono voice on eyebrows and data labels is what makes the system
read as product rather than brochure.

Radius runs 4→20px and never goes bubbly. Elevation is four layered, very quiet
shadows. Motion is `--duration-*` and `--ease-out` on transforms and colour only;
scroll reveals are one `IntersectionObserver` per element, no animation library.

Breakpoints are `sm 480 · md 768 · lg 1024 · xl 1280 · 2xl 1440`, and `md` is a
real target — the previous build used `lg:` 76 times and `md:` twice, which left
the 768–1024 band as an afterthought.

### The hero product surface

`components/viz/TalentOS.tsx` is a conceptual enterprise interface. It carries a
visible **Illustrative** badge and invents no statistics: every figure in it
(91%, 20–30 days, 136, 5, 9) is the real record. Role titles and pipeline
proportions are representative shape, and the caption says so.

---

## FAQ

Twenty questions across two tabs (Clients / Candidates), living in
`sections/Faq.tsx` with content in `data/faqs.ts`. It is a homepage section, not
a route — a `/faq` page would put the same twenty answers on a second URL, which
is duplicate content and the duplication this codebase deliberately avoids. The
nav item targets `/#faq`; `ScrollManager` already handles hash targets.

Both tabpanels stay in the DOM (the inactive one carries `hidden`) and collapsed
answers stay in the DOM too, so all twenty are crawlable rather than only the
open tab. Collapsed answers carry `inert`, so they are neither focusable nor
announced while closed.

No `FAQPage` schema. Google restricted FAQ rich results to government and health
sites in 2023, so it would produce no result here — and the brief for this work
said not to add schema that only exists for SEO. Semantic `dl`/`dt`/`dd` carries
the structure instead.

### Three answers need business sign-off

`data/faqs.ts` flags them with `needsConfirmation: true`, and
`faqsNeedingConfirmation` exports the list so it can be audited from code:

1. **How does your recruitment fee structure work?**
2. **What happens if a candidate doesn't work out after joining?**
3. **Does KiVitronics charge candidates any fees?**

Nothing in the source material covers commercial terms, so these are written to
state no figure, model or guarantee period — only that terms are agreed and
confirmed in writing. Confirm each with the business, correct the wording, then
delete the flag.

---

## Accessibility

`npm run audit` walks every route, rasterises each computed colour to resolve
Tailwind's `color-mix()` output, composites it against the real painted
background and reports anything under WCAG AA. All routes pass.

Also verified: skip link first in tab order, visible focus on every control, the
Solutions mega-menu operable by keyboard and dismissible with Escape, scroll lock
on the mobile drawer, labelled form fields with inline errors, and every reveal
rendered immediately under `prefers-reduced-motion`.
