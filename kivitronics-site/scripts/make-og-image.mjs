// Renders public/og-image.png (1200x630) from scripts/og-image.html.
import { chromium } from 'playwright'
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
})
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
const source = new URL('./og-image.html', import.meta.url).href
await page.goto(source, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
await page.screenshot({ path: 'public/og-image.png' })
await browser.close()
console.log('og-image.png written')
