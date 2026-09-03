import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const url = 'file:///home/user/barrykhr.github.io/option-b/index.html';
const browser = await chromium.launch();

/* ---------- semantics + names ---------- */
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url); await page.waitForTimeout(700);

const report = await page.evaluate(() => {
  const out = {};
  out.headings = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => h.tagName + ' ' + h.textContent.trim().replace(/\s+/g, ' ').slice(0, 46));
  out.landmarks = [...document.querySelectorAll('header,nav,main,footer,section[aria-label]')].map((e) => e.tagName + (e.getAttribute('aria-label') ? ':' + e.getAttribute('aria-label') : ''));
  out.h1Count = document.querySelectorAll('h1').length;
  out.imgsNoAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length;
  out.namelessControls = [...document.querySelectorAll('a,button')]
    .filter((el) => !(el.textContent.trim() || el.getAttribute('aria-label') || el.getAttribute('title')))
    .map((el) => el.tagName + '.' + el.className);
  out.inputsNoLabel = [...document.querySelectorAll('input,textarea,select')]
    .filter((el) => !document.querySelector(`label[for="${el.id}"]`) && !el.getAttribute('aria-label'))
    .map((el) => el.name);
  out.ariaControlsBroken = [...document.querySelectorAll('[aria-controls]')]
    .filter((el) => !document.getElementById(el.getAttribute('aria-controls')))
    .map((el) => el.getAttribute('aria-controls'));
  out.ariaLabelledbyBroken = [...document.querySelectorAll('[aria-labelledby]')]
    .filter((el) => !document.getElementById(el.getAttribute('aria-labelledby')))
    .map((el) => el.getAttribute('aria-labelledby'));
  out.duplicateIds = (() => {
    const seen = new Set(), dup = new Set();
    document.querySelectorAll('[id]').forEach((e) => (seen.has(e.id) ? dup.add(e.id) : seen.add(e.id)));
    return [...dup];
  })();
  out.lang = document.documentElement.lang;
  out.title = document.title;
  return out;
});
console.log('--- semantics ---');
console.log(JSON.stringify(report, null, 1));

/* ---------- keyboard: tab through and exercise widgets ---------- */
await page.keyboard.press('Tab');
const first = await page.evaluate(() => document.activeElement.textContent.trim());
console.log('\n--- keyboard ---');
console.log('first stop:', first);

await page.evaluate(() => document.querySelector('#faq').scrollIntoView());
await page.waitForTimeout(400);
await page.focus('[data-faq-tab]');
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(200);
const tabState = await page.evaluate(() => ({
  selected: [...document.querySelectorAll('[data-faq-tab]')].map((t) => t.getAttribute('aria-selected')),
  visible: [...document.querySelectorAll('[data-faq-panel]')].map((p) => !p.hidden),
  focused: document.activeElement.textContent.trim(),
}));
console.log('faq arrow-right:', JSON.stringify(tabState));

await page.click('[data-faq-panel]:not([hidden]) [data-faq-q]');
await page.waitForTimeout(200);
const acc = await page.evaluate(() => {
  const q = document.querySelector('[data-faq-panel]:not([hidden]) [data-faq-q]');
  const a = document.getElementById(q.getAttribute('aria-controls'));
  return { expanded: q.getAttribute('aria-expanded'), open: a.hasAttribute('data-open'), h: a.getBoundingClientRect().height };
});
console.log('faq accordion:', JSON.stringify(acc));

await page.evaluate(() => document.querySelector('#solutions').scrollIntoView());
await page.waitForTimeout(300);
await page.click('[data-sol-trigger]:nth-of-type(1)').catch(() => {});
const sol = await page.evaluate(() => {
  const t = document.querySelectorAll('[data-sol-trigger]')[2];
  t.click();
  return [...document.querySelectorAll('[data-sol-trigger]')].map((x) => x.getAttribute('aria-expanded'));
});
console.log('solutions single-open:', JSON.stringify(sol));

/* form validation */
await page.evaluate(() => document.querySelector('#contact').scrollIntoView());
await page.waitForTimeout(300);
await page.click('form.form button[type=submit]');
await page.waitForTimeout(200);
console.log('form status:', await page.textContent('[data-form-status]'));
console.log('invalid marked:', await page.evaluate(() => document.querySelectorAll('[aria-invalid="true"]').length));

await page.close();

/* ---------- reduced motion ---------- */
const rm = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
const rp = await rm.newPage();
await rp.goto(url); await rp.waitForTimeout(700);
const rmState = await rp.evaluate(() => ({
  hiddenReveals: [...document.querySelectorAll('[data-reveal]')].filter((e) => getComputedStyle(e).opacity !== '1').length,
  modelHeight: document.querySelector('.model').getBoundingClientRect().height,
  stagesVisible: [...document.querySelectorAll('.stage')].filter((s) => getComputedStyle(s).opacity === '1').length,
  counters: [...document.querySelectorAll('[data-count]')].map((c) => c.textContent),
  docHeight: document.documentElement.scrollHeight,
}));
console.log('\n--- reduced motion ---');
console.log(JSON.stringify(rmState));
await rp.screenshot({ path: (process.env.SHOTS || '/tmp/shots') + '/reduced-motion.png', fullPage: false });
await rp.evaluate(() => document.querySelector('#how').scrollIntoView());
await rp.waitForTimeout(400);
await rp.screenshot({ path: (process.env.SHOTS || '/tmp/shots') + '/reduced-motion-model.png' });

/* ---------- no-JS ---------- */
const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
const np = await nojs.newPage();
await np.goto(url); await np.waitForTimeout(2200);
const nojsState = await np.evaluate(() => ({
  visibleText: document.body.innerText.replace(/\s+/g, ' ').length,
  faqAnswersInDom: document.querySelectorAll('[data-faq-a]').length,
}));
console.log('\n--- no JS ---');
console.log(JSON.stringify(nojsState));
await np.screenshot({ path: (process.env.SHOTS || '/tmp/shots') + '/no-js.png' });

await browser.close();
