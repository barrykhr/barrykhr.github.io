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
        slogan: brand.promise.join(' '),
        description: brand.descriptor,
        areaServed: 'IN',
        ...(contact.location
          ? { address: { '@type': 'PostalAddress', addressLocality: 'Chennai', addressCountry: 'IN' } }
          : {}),
        ...(contact.email ? { email: contact.email } : {}),
        ...(contact.phone ? { telephone: contact.phone } : {}),
        knowsAbout: [
          'Recruitment consultancy',
          'Talent acquisition',
          'Executive recruitment',
          'Technology recruitment',
          'Specialist recruitment',
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
          'End-to-end hiring mandates owned by a single delivery lead across nine stages, from requirement calibration through to the candidate joining.',
      },
    ],
  }

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}
