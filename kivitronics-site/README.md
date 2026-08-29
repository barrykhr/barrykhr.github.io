# KiVitronics Consulting — website

Source for the KiVitronics Consulting site. React + TypeScript + Tailwind CSS v4,
built with Vite. The production build is committed to `../kivitronics/` so GitHub
Pages can serve it straight from this repository.

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

### Which page owns what

Every section renders on exactly one page — the homepage argues, the other pages
carry the evidence. `FinalCta` is the deliberate exception; it closes all of them.

| Page | Sections |
| --- | --- |
| `/` | Hero · MetricStrip · ProblemFunnel · Beliefs · Pathways |
| `/what-we-do` | mandate types · ApproachComparison · engagement |
| `/how-we-work` | ProcessTimeline · QualificationModel · AccountableHuman |
| `/proof` | ProofOfDelivery · ConversionToJoining · ClientRelationships |
| `/for-talent` | commitments · ProtectingJourney · InterviewPreparation |
| `/about` | AboutSection · TechnologyVision |
| `/insights` | Insights |
| `/start-a-mandate` | MandateForm |

Before adding a section to a second page, move it instead. Duplication is what
turns a website back into one long scroll with a menu on top.

### Adding an insight

`src/data/insights.ts`. Entries default to `status: 'coming-soon'` and render
with a "Coming soon" badge. Give one `status: 'published'` and a `slug` and it
becomes a live card — no changes needed in `sections/Insights.tsx`.

---

## Rules the code is written to

**Never publish a number the material does not support.** Every figure on the
site traces to `src/data/metrics.ts` or `src/data/relationships.ts`:
136 roles closed · 72% mandate closure · 91% offer-to-joining · 60% repeat
clients · 25 companies served · 15 with more than one mandate · 65+ hires across
the three deepest relationships · 20–30 days standard closure · ~45 days niche.

**Never present the technology roadmap as shipped product.** Everything under
`next` and `future` in `src/data/technology.ts` is forward-looking, and the UI
labels it as such on every surface. KiVitronics is a recruitment consultancy,
not a software vendor.

**No invented clients.** No client names or logos were supplied, so the trust
wall in `sections/ClientRelationships.tsx` is generated from the verified counts
and renders anonymously. If real names are cleared for publication, replace that
component's wall — do not add logos to the data file speculatively.

---

## Design system

| Token | Value | Used for |
| --- | --- | --- |
| `ink` | `#0B0F14` | hero, proof, technology, CTA — the dark 20% |
| `paper` / `ivory` | `#FBFAF7` / `#F5F3EE` | the warm 70% |
| `gold` | `#C8A84E` | brand accent; text on ink |
| `gold-500` | `#9A7C2E` | display-size accents on ivory (≥ 3:1) |
| `gold-600` | `#7E6520` | small text and labels on ivory (≥ 4.5:1) |
| `slate` | `#68758A` | secondary marks and diagram nodes |
| `cobalt` | `#4D6FFF` | the single moving signal in the hero |

Type is Inter Tight (display) over Inter (text), self-hosted as two variable
`woff2` files — no third-party font request. The fluid scale (`text-d1`…`text-d4`,
`text-num`, `text-lede`) is defined in `src/styles/index.css`.

Motion is one `IntersectionObserver` per revealed element plus CSS transitions —
no animation library. `prefers-reduced-motion: reduce` disables every reveal, the
count-ups resolve immediately, and the hero canvas renders a single static frame.
