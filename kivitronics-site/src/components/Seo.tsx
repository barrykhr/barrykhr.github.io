import { useEffect } from 'react'
import { brand } from '@/data/site'

type SeoProps = {
  title: string
  description: string
  path: string
  /** Overrides the default OG type. */
  type?: 'website' | 'article'
}

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Per-route head management. Deliberately dependency-free: the site is small
 * enough that a helmet library would cost more than it returns.
 */
export function Seo({ title, description, path, type = 'website' }: SeoProps) {
  useEffect(() => {
    const url = `${brand.url}${path}`
    document.title = title

    upsertMeta('meta[name="description"]', 'name', 'description', description)

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description)
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url)
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', brand.fullName)
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', `${brand.url}/og-image.png`)

    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', `${brand.url}/og-image.png`)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, path, type])

  return null
}
