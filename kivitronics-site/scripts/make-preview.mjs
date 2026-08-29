/**
 * Builds the whole site into ONE self-contained HTML file, so it can be opened
 * or shared without a server: CSS inlined, JS inlined, fonts embedded as data
 * URIs, and a hash router in place of real URLs.
 *
 *   npm run preview:file        -> preview/kivitronics-preview.html
 */
import { execSync } from 'node:child_process'
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const tmp = resolve(root, '.preview-build')
const outDir = resolve(root, 'preview')

rmSync(tmp, { recursive: true, force: true })
execSync(`npx vite build --outDir ${tmp} --emptyOutDir`, {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, BASE: './', VITE_ROUTER: 'hash' },
})

const assets = resolve(tmp, 'assets')
const files = readdirSync(assets)
const pick = (ext) => files.find((f) => f.endsWith(ext))

let css = readFileSync(resolve(assets, pick('.css')), 'utf8')
const js = readFileSync(resolve(assets, pick('.js')), 'utf8')

// Embed the two variable fonts so the file carries its own typography.
for (const font of files.filter((f) => f.endsWith('.woff2'))) {
  const b64 = readFileSync(resolve(assets, font)).toString('base64')
  css = css.replaceAll(`./${font}`, `data:font/woff2;base64,${b64}`)
}

// A literal </script> inside the bundle would close the tag early.
const safeJs = js.replaceAll('</script', '<\\/script')

const html = `<title>KiVitronics Consulting</title>
<style>${css}</style>
<div id="root"></div>
<script type="module">${safeJs}</script>
`

mkdirSync(outDir, { recursive: true })
const dest = resolve(outDir, 'kivitronics-preview.html')
writeFileSync(dest, html, 'utf8')
rmSync(tmp, { recursive: true, force: true })

console.log(`preview: ${dest} (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB)`)
