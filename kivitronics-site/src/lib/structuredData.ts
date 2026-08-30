import { brand, contact } from '@/data/site'

/**
 * schema.org markup for the organisation and its service. Only facts that
 * appear on the site itself are described here — no invented awards, ratings,
 * founders or review counts.
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
        slogan: brand.positioning,
        description: brand.descriptor,
        areaServed: 'IN',
        ...(contact.location
          ? { address: { '@type': 'PostalAddress', addressLocality: 'Chennai', addressCountry: 'IN' } }
          : {}),
        ...(contact.email ? { email: contact.email } : {}),
        ...(contact.phone ? { telephone: contact.phone } : {}),
        knowsAbout: [
          'Recruitment process outsourcing',
          'Talent acquisition',
          'IT recruitment',
          'Non-IT recruitment',
          'Global recruitment',
          'Talent matching',
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
      {
        '@type': 'Service',
        '@id': `${brand.url}/#service`,
        serviceType: 'Recruitment consultancy',
        provider: { '@id': `${brand.url}/#organization` },
        description:
          'RPO, IT and non-IT recruitment, global hiring across the US and India, and structured talent matching — owned by a single delivery team from requirement to joining.',
      },
    ],
  }

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}
