#!/usr/bin/env node
/**
 * Emits a single self-contained HTML file for preview hosts that serve one
 * document with no sibling assets (and strip the document shell themselves).
 *
 *   node option-b/tools/preview.mjs [outfile]
 *
 * The committed site at option-b/index.html stays the real build; this is a
 * flattened copy of it — same markup, same CSS, same JS, inlined.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = process.argv[2] || join(root, 'preview.html');

const html = await readFile(join(root, 'index.html'), 'utf8');
const css = await readFile(join(root, 'assets', 'site.css'), 'utf8');
const js = await readFile(join(root, 'assets', 'site.js'), 'utf8');

const body = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>')).trim();
const markup = body.replace(/<script src="assets\/site\.js" defer><\/script>/, '');

const FONTS = [
  'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap',
];

const page = `<title>Talent, in motion.</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${FONTS.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n')}
<style>
${css}
</style>
<script>document.documentElement.classList.add('js');</script>

${markup}

<script>
${js}
</script>
`;

await writeFile(out, page);
console.log(`wrote ${out}  (${(Buffer.byteLength(page) / 1024).toFixed(1)} kB)`);
