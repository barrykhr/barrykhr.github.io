import { chromium } from 'playwright'
const base = 'http://localhost:4173/kivitronics'
const routes = ['/', '/what-we-do', '/how-we-work', '/proof', '/insights', '/about', '/for-talent', '/start-a-mandate']
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const AUDIT = () => {
  // Tailwind v4 emits color-mix(), which getComputedStyle returns in oklab or
  // color() form. Rasterise instead of regexing: paint the colour over black and
  // over white and solve for the straight colour and its alpha.
  const cv = document.createElement('canvas')
  cv.width = cv.height = 1
  const cx = cv.getContext('2d', { willReadFrequently: true })
  const cache = new Map()
  const paint = (c, bg) => {
    cx.globalCompositeOperation = 'copy'
    cx.fillStyle = bg
    cx.fillRect(0, 0, 1, 1)
    cx.globalCompositeOperation = 'source-over'
    cx.fillStyle = c
    cx.fillRect(0, 0, 1, 1)
    return cx.getImageData(0, 0, 1, 1).data
  }
  const parse = (c) => {
    if (!c || c === 'transparent' || c === 'none') return null
    if (cache.has(c)) return cache.get(c)
    let out = null
    try {
      const b = paint(c, '#000')
      const w = paint(c, '#fff')
      const a = 1 - (w[0] - b[0]) / 255
      out = a <= 0.001 ? { r: 0, g: 0, b: 0, a: 0 } : { r: b[0] / a, g: b[1] / a, b: b[2] / a, a }
    } catch { out = null }
    cache.set(c, out)
    return out
  }
  // Proper source-over: alpha composites too, so stacked translucent layers
  // (bg-ink/4 inside bg-ink/10 over paper) resolve to the real painted colour.
  const over = (fg, bg) => {
    const a = fg.a + bg.a * (1 - fg.a)
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 }
    return {
      r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
      g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
      b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
      a,
    }
  }
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b)
  }
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]; return (hi + 0.05) / (lo + 0.05) }
  const bgOf = (el) => {
    let n = el
    let acc = null
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (c && c.a > 0) { acc = acc ? over(acc, c) : c; if (acc.a >= 0.999) return acc }
      n = n.parentElement
    }
    return acc || { r: 255, g: 255, b: 255, a: 1 }
  }

  const problems = []
  const seen = new Set()
  document.querySelectorAll('body *').forEach((el) => {
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
    if (!hasText) return
    const s = getComputedStyle(el)
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const fg = parse(s.color); if (!fg) return
    const bg = bgOf(el)
    const eff = over(fg, bg)
    const size = parseFloat(s.fontSize)
    const weight = +s.fontWeight || 400
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    const need = large ? 3 : 4.5
    const r = ratio(eff, bg)
    if (r < need) {
      const key = `${s.color}|${size}|${el.className}`.slice(0, 90)
      if (seen.has(key)) return
      seen.add(key)
      problems.push({
        ratio: +r.toFixed(2), need, size: +size.toFixed(1),
        color: s.color, cls: (el.className || '').toString().slice(0, 70),
        text: el.textContent.trim().slice(0, 50),
      })
    }
  })

  const h1 = document.querySelectorAll('h1').length
  const imgsNoAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length
  const roleImgNoLabel = [...document.querySelectorAll('[role="img"]')].filter((i) => !i.getAttribute('aria-label')).length
  const inputsNoLabel = [...document.querySelectorAll('input,textarea,select')].filter((i) => {
    if (i.getAttribute('aria-label')) return false
    const id = i.id
    return !(id && document.querySelector(`label[for="${CSS.escape(id)}"]`))
  }).length
  const emptyLinks = [...document.querySelectorAll('a')].filter((a) => !a.textContent.trim() && !a.getAttribute('aria-label')).length
  const buttonsNoName = [...document.querySelectorAll('button')].filter((b) => !b.textContent.trim() && !b.getAttribute('aria-label')).length

  return { problems, h1, imgsNoAlt, roleImgNoLabel, inputsNoLabel, emptyLinks, buttonsNoName }
}

for (const r of routes) {
  await page.goto(base + r, { waitUntil: 'networkidle' })
  // Audit with the header in its opaque state; the transparent-over-hero state
  // paints against the hero, which a DOM walk cannot see.
  await page.evaluate(() => window.scrollTo(0, 600))
  await page.waitForTimeout(600)
  const res = await page.evaluate(AUDIT)
  const flags = []
  if (res.h1 !== 1) flags.push(`h1 count = ${res.h1}`)
  if (res.imgsNoAlt) flags.push(`img without alt: ${res.imgsNoAlt}`)
  if (res.roleImgNoLabel) flags.push(`role=img without label: ${res.roleImgNoLabel}`)
  if (res.inputsNoLabel) flags.push(`unlabelled fields: ${res.inputsNoLabel}`)
  if (res.emptyLinks) flags.push(`links without name: ${res.emptyLinks}`)
  if (res.buttonsNoName) flags.push(`buttons without name: ${res.buttonsNoName}`)
  console.log(`\n=== ${r} ===`)
  if (flags.length) console.log('  ' + flags.join('\n  '))
  if (res.problems.length) {
    console.log('  contrast:')
    res.problems.slice(0, 40).forEach((p) =>
      console.log(`   ${p.ratio} (need ${p.need}) ${p.size}px ${p.color} "${p.text}" [${p.cls}]`))
    if (res.problems.length > 40) console.log(`   … ${res.problems.length - 40} more`)
  }
  if (!flags.length && !res.problems.length) console.log('  ok')
}
await browser.close()
