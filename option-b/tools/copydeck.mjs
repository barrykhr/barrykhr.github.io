#!/usr/bin/env node
/**
 * Builds a text-only copy deck of the site — every word, in page order, with
 * no design around it — and prints it to PDF.
 *
 *   node option-b/tools/copydeck.mjs [outfile.pdf]
 *
 * Reads src/content.js, so the deck can never drift from what the page says.
 * Unverified content is rendered as [TO CONFIRM — …] exactly where it appears.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = process.argv[2] || join(root, 'KiVitronics-OptionB-website-copy.pdf');

const C = await import(join(root, 'src', 'content.js'));

/* ---------- helpers ---------- */
const E = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const esc = (v) => String(v).replace(/[&<>"]/g, (c) => E[c]);
const isTodo = (v) => Boolean(v && v.__placeholder);

let words = 0;
const count = (v) => {
  if (!v || isTodo(v)) return;
  words += String(v).trim().split(/\s+/).filter(Boolean).length;
};

/** Copy that may be a verified string or a placeholder. */
const copy = (v) => {
  if (isTodo(v)) return `<span class="todo">[TO CONFIRM — ${esc(v.label)}]</span>`;
  count(v);
  return esc(v);
};

const lines = (v) => (Array.isArray(v) ? v : [v]).map(copy).join(' ');

const row = (label, value) =>
  value ? `<div class="row"><span class="k">${esc(label)}</span><span class="v">${value}</span></div>` : '';

const section = (n, name, body) => `
<section class="sec">
  <h2><span class="num">${n}</span>${esc(name)}</h2>
  ${body}
</section>`;

const list = (items) => `<ul class="list">${items.join('')}</ul>`;

/* ---------- the deck ---------- */
const nav = `
  ${row('Links', C.nav.links.map((l) => copy(l.label)).join('  ·  '))}
  ${row('Button', copy(C.nav.cta.label))}`;

const hero = `
  ${row('Eyebrow', copy(C.hero.eyebrow))}
  <p class="head">${lines(C.hero.headline)}</p>
  <p class="lede">${copy(C.hero.lede)}</p>
  ${row('Primary button', copy(C.hero.primary.label))}
  ${row('Secondary button', copy(C.hero.secondary.label))}
  ${row('Talent tiles', C.hero.tiles.map((t) => copy(t)).join(', '))}
  ${row('Mandate card', `${copy(C.hero.slot.role)} — ${copy(C.hero.slot.idle)} → ${copy(C.hero.slot.matched)}`)}
  ${row('Scroll cue', copy(C.hero.scrollHint))}`;

const proof = `
  ${row('Eyebrow', copy(C.proof.eyebrow))}
  <p class="head">${lines(C.proof.headline)}</p>
  ${list(C.proof.metrics.map((m) => `<li><b>${esc(m.value)}${esc(m.suffix)}</b> ${copy(m.label)}</li>`))}
  <p class="note">${copy(C.proof.footnote)}</p>`;

const problem = `
  <p class="head">${lines(C.problem.headline)}</p>
  <p class="lede">${copy(C.problem.lede)}</p>
  ${row('Funnel labels', C.problem.stages.map((s) => copy(s)).join(' → '))}
  <p class="note">${copy(C.problem.caption)}</p>`;

const model = `
  ${row('Eyebrow', copy(C.model.eyebrow))}
  <p class="head">${lines(C.model.headline)}</p>
  <p class="lede">${copy(C.model.lede)}</p>
  ${list(C.model.stages.map((s) => `<li><b>${esc(s.n)} ${copy(s.name)}</b> — ${copy(s.note)}</li>`))}`;

const qual = `
  <p class="head">${lines(C.qualification.headline)}</p>
  <p class="lede">${copy(C.qualification.lede)}</p>
  ${list(C.qualification.dimensions.map((d) => `<li><b>${copy(d.name)}</b> — ${copy(d.question)}</li>`))}`;

const journey = `
  <p class="head">${lines(C.journey.headline)}</p>
  <p class="lede">${copy(C.journey.lede)}</p>
  ${row('Touchpoints', C.journey.steps.map((s) => copy(s)).join(' → '))}`;

const solutions = `
  ${row('Eyebrow', copy(C.solutions.eyebrow))}
  <p class="head">${lines(C.solutions.headline)}</p>
  ${list(C.solutions.items.map((i) => `<li><b>${copy(i.name)}</b> <span class="tag">${copy(i.tag)}</span><br>${copy(i.line)}</li>`))}`;

const clients = `
  <p class="head">${lines(C.clients.headline)}</p>
  ${list(C.clients.metrics.map((m) => `<li><b>${esc(m.value)}${esc(m.suffix)}</b> ${copy(m.label)}</li>`))}
  <p class="note">${copy(C.clients.fieldNote)}</p>
  ${row('Logo strip', copy(C.clients.logosNote))}`;

const intel = `
  <p class="head">${lines(C.intelligence.headline)}</p>
  <p class="lede">${copy(C.intelligence.lede)}</p>
  ${row('Label', copy(C.intelligence.roadmapLabel))}
  ${row('Roadmap items', C.intelligence.roadmap.map((r) => copy(r)).join(', '))}`;

const faq = `
  <p class="head">${lines(C.faq.headline)}</p>
  ${C.faq.tabs
    .map(
      (t) => `
    <h3>${copy(t.label)}</h3>
    ${list(t.items.map((i) => `<li class="qa"><b>${copy(i.q)}</b><br>${copy(i.a)}</li>`))}`
    )
    .join('')}`;

const contact = `
  <p class="head">${lines(C.contact.headline)}</p>
  <p class="lede">${copy(C.contact.lede)}</p>
  ${row('Form fields', C.contact.fields.map((f) => copy(f.label)).join(', ') + ', ' + copy(C.contact.message.label))}
  ${row('Button', copy(C.contact.cta))}
  ${row('Direct', `${copy(C.contact.direct.label)} ${copy(C.contact.direct.value)}`)}`;

const footer = `
  ${row('Tagline', copy(C.footer.tagline))}
  ${row('Links', C.footer.links.map((l) => copy(l.label)).join(', '))}
  ${row('Legal', copy(C.footer.legal))}
  ${row('Build note', copy(C.footer.note))}`;

const body = [
  section('—', 'Navigation', nav),
  section('01', 'Hero', hero),
  section('02', 'Proof', proof),
  section('03', 'The gap', problem),
  section('04', 'The model', model),
  section('05', 'Qualification', qual),
  section('06', 'Candidate journey', journey),
  section('07', 'Solutions', solutions),
  section('08', 'Clients', clients),
  section('09', 'Direction', intel),
  section('10', 'FAQ', faq),
  section('11', 'Close', contact),
  section('—', 'Footer', footer),
].join('');

const todos = (body.match(/class="todo"/g) || []).length;
const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 20mm 18mm 18mm; }
  * { box-sizing: border-box; margin: 0; }
  body {
    font-family: 'Bitstream Charter', 'Liberation Serif', Georgia, serif;
    font-size: 10.5pt; line-height: 1.5; color: #16202a; background: #fff;
  }
  .label { font-family: 'Liberation Sans', 'DejaVu Sans', sans-serif; }

  header { border-bottom: 2px solid #0D1216; padding-bottom: 10mm; margin-bottom: 9mm; }
  .brand {
    font-family: 'Liberation Sans', sans-serif; font-size: 8.5pt;
    letter-spacing: .18em; text-transform: uppercase; color: #0A6E93; margin-bottom: 5mm;
  }
  h1 { font-size: 25pt; line-height: 1.1; letter-spacing: -.01em; font-weight: 700; }
  .sub { font-size: 11pt; color: #55636e; margin-top: 3mm; max-width: 105mm; }
  .meta {
    display: flex; gap: 9mm; margin-top: 7mm;
    font-family: 'Liberation Sans', sans-serif; font-size: 8pt;
    letter-spacing: .1em; text-transform: uppercase; color: #55636e;
  }
  .meta b { display: block; font-size: 13pt; letter-spacing: 0; text-transform: none; color: #0D1216; }

  .sec { break-inside: avoid-page; margin-bottom: 8mm; }
  .sec h2 {
    font-family: 'Liberation Sans', sans-serif; font-size: 9pt; font-weight: 700;
    letter-spacing: .16em; text-transform: uppercase; color: #0D1216;
    border-bottom: .4pt solid #c3ced6; padding-bottom: 2.5mm; margin-bottom: 4mm;
  }
  .sec h2 .num { color: #29ABE2; margin-right: 4mm; }
  .sec h3 {
    font-family: 'Liberation Sans', sans-serif; font-size: 8.5pt; font-weight: 700;
    letter-spacing: .14em; text-transform: uppercase; color: #0A6E93;
    margin: 6mm 0 3mm;
  }

  .head { font-size: 15pt; line-height: 1.25; font-weight: 700; letter-spacing: -.01em; max-width: 125mm; }
  .lede { font-size: 11pt; color: #3d4a55; margin-top: 2mm; max-width: 125mm; }
  .note { font-size: 9pt; color: #6b7883; margin-top: 3mm; font-style: italic; }

  .row { display: flex; gap: 5mm; margin-top: 2.5mm; break-inside: avoid; }
  .row .k {
    flex: 0 0 32mm; font-family: 'Liberation Sans', sans-serif; font-size: 7.5pt;
    letter-spacing: .1em; text-transform: uppercase; color: #7b8790; padding-top: 1.1mm;
  }
  .row .v { flex: 1; }

  .list { list-style: none; margin-top: 4mm; }
  .list li { padding: 1.8mm 0 1.8mm 5mm; border-left: 1.6pt solid #dbe3e8; margin-bottom: 1mm; break-inside: avoid; }
  .list li b { font-weight: 700; }
  .qa { margin-bottom: 2.5mm; }
  .tag {
    font-family: 'Liberation Sans', sans-serif; font-size: 7pt; letter-spacing: .1em;
    text-transform: uppercase; color: #7b8790;
  }

  .todo {
    font-family: 'DejaVu Sans Mono', monospace; font-size: 8.5pt;
    color: #8a5a00; background: #fdf4e3; border: .4pt dashed #d9a441;
    padding: .4mm 1.6mm; border-radius: 1mm;
  }
  .legend {
    margin-top: 9mm; padding-top: 4mm; border-top: .4pt solid #c3ced6;
    font-size: 9pt; color: #6b7883;
  }
</style></head><body>
<header>
  <p class="brand">KiVi · Tronics — Option B</p>
  <h1>Website copy</h1>
  <p class="sub">Every word on the homepage, in page order, with the design removed — for reading and approval.</p>
  <div class="meta">
    <span>Words<b>${words.toLocaleString('en-GB')}</b></span>
    <span>Sections<b>11</b></span>
    <span>To confirm<b>${todos}</b></span>
    <span>Generated<b style="font-size:10pt">${date}</b></span>
  </div>
</header>
${body}
<p class="legend"><span class="todo">[TO CONFIRM — …]</span> marks copy that could not be verified from the
KiVitronics source material. Nothing in this deck was invented to fill a gap; each of these needs a decision
before the site goes live.</p>
</body></html>`;

/* word count is only final after the body renders, so patch it in */
const finalHtml = html.replace('<b>0</b>', `<b>${words.toLocaleString('en-GB')}</b>`);

const tmp = join(root, '.copydeck.tmp.html');
await writeFile(tmp, finalHtml);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + tmp, { waitUntil: 'load' });
await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: `<div style="width:100%;padding:0 18mm;font-family:Liberation Sans,sans-serif;font-size:7pt;color:#8b959d;display:flex;justify-content:space-between;">
    <span>KiVitronics — Option B · website copy</span><span class="pageNumber"></span>
  </div>`,
  margin: { top: '20mm', bottom: '18mm', left: '18mm', right: '18mm' },
});
await browser.close();
const { rm } = await import('node:fs/promises');
if (!process.env.KEEP_HTML) await rm(tmp, { force: true });
console.log(`wrote ${out}  —  ${words} words, ${todos} to confirm`);
