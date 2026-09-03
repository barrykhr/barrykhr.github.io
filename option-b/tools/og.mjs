/**
 * Renders src/og.html to assets/og.png at 1200x630.
 * Run with network access so Manrope / IBM Plex Mono load:
 *   node option-b/tools/og.mjs
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('file://' + join(root, 'src', 'og.html'), { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready).catch(() => {});
await page.waitForTimeout(600);
await page.screenshot({ path: join(root, 'assets', 'og.png') });
console.log('wrote assets/og.png');
await browser.close();
