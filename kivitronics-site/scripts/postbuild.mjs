/**
 * Post-build: emit a 404.html that stashes the requested deep link and bounces
 * to index.html, where the decoder in the page head restores it. Without this,
 * a static host returns a hard 404 for every route except the site root.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const outDir = resolve(process.cwd(), '../kivitronics')
const base = process.env.BASE ?? '/kivitronics/'
const segmentsToKeep = base.split('/').filter(Boolean).length

const html = await readFile(resolve(outDir, 'index.html'), 'utf8')

const redirect = `    <script>
      // Stash the requested path in the query string, then hand back to index.html.
      var pathSegmentsToKeep = ${segmentsToKeep}
      var l = window.location
      l.replace(
        l.protocol +
          '//' +
          l.hostname +
          (l.port ? ':' + l.port : '') +
          l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') +
          '/?/' +
          l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
          (l.search ? '&' + l.search.slice(1) : '') +
          l.hash,
      )
    </script>
`

await writeFile(resolve(outDir, '404.html'), html.replace('  </head>', redirect + '  </head>'), 'utf8')

// GitHub Pages otherwise runs the output through Jekyll, which drops _-prefixed files.
await writeFile(resolve(outDir, '.nojekyll'), '', 'utf8')

console.log(`postbuild: wrote 404.html (pathSegmentsToKeep=${segmentsToKeep}) and .nojekyll`)
