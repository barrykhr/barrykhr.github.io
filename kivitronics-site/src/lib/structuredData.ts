import { brand, contactChannels, industries } from '@/data/content'

/**
 * Organisation markup. Only facts the site itself states — no awards, ratings,
 * founders or figures, because the copy contains none.
 */
export function injectStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${brand.url}/#organization`,
        name: brand.fullName,
        legalName: brand.legalName,
        url: brand.url,
        slogan: brand.tagline,
        description: brand.description,
        ...(contactChannels.email ? { email: contactChannels.email } : {}),
        knowsAbout: [
          'Permanent recruitment',
          'Executive search',
          'Leadership hiring',
          ...industries.list,
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${brand.url}/#website`,
        url: brand.url,
        name: brand.fullName,
        publisher: { '@id': `${brand.url}/#organization` },
        inLanguage: 'en',
      },
    ],
  }

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}
