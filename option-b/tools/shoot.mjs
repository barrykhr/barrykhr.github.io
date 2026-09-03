import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = process.env.SHOTS || '/tmp/shots';
const url = 'file://' + join(root, 'index.html');
const only = process.argv.slice(2);

/** [name, selector, fraction through that section] */
const marks = [
  ['hero', '#top', 0],
  ['hero-end', '#top', 0.62],
  ['proof', '#proof', 0.35],
  ['gap', '#problem', 0.55],
  ['model-a', '#how', 0.12],
  ['model-b', '#how', 0.55],
  ['model-c', '#how', 0.95],
  ['qual', '#qualification', 0.5],
  ['journey', '#journey', 0.45],
  ['solutions', '#solutions', 0.35],
  ['clients', '#clients', 0.4],
  ['intel', '#about', 0.45],
  ['faq', '#faq', 0.2],
  ['cta', '#contact', 0.4],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/ERR_CONNECTION_RESET/.test(m.text())) errors.push('console: ' + m.text()); });

await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(800);

async function shoot(name, sel, frac, prefix = '') {
  const y = await page.evaluate(([s, f]) => {
    const el = document.querySelector(s);
    const r = el.getBoundingClientRect();
    return r.top + window.scrollY + r.height * f;
  }, [sel, frac]);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(650);
  await page.screenshot({ path: join(OUT, prefix + name + '.png') });
}

for (const [name, sel, frac] of marks) {
  if (only.length && !only.includes(name)) continue;
  await shoot(name, sel, frac);
}

if (!only.length) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  for (const [name, sel, frac] of marks) await shoot(name, sel, frac, 'm-');
}

for (const w of [320, 390, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(200);
  const o = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
  if (o.s > o.c) console.log(`w=${w} OVERFLOW ${o.s}>${o.c}`);
}
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no page errors');
await browser.close();
